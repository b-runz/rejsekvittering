'use server'

import * as https from 'https';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { Tabletojson } from 'tabletojson';

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

interface HttpResponse {
  responseData: string;
  responseHeaders: IncomingHttpHeaders;
  responseCode: number | undefined;
}

interface Cookie {
  [key: string]: string;
}

export interface TripAndNextPage {
  trips: Trip[],
  nextPage: NextPage
}

export interface Trip {
  date: Date
  from: string
  arrival: Date
  to: string
  amount: string
  printed: boolean
  id: number
}

export interface NextPage {
  verificationToken: string
  cookie: Cookie
  pageIndex: number
}

function requestRejseplan(path: string, method: HttpMethod, headers: OutgoingHttpHeaders = {}, data: string = ""): Promise<HttpResponse> {
  console.log(`requestRejseplan: Initiating ${method} request to ${path}`);
  return new Promise((resolve, reject) => {
    const url = require('url');
    const parsedUrl = url.parse(path);
    const host = parsedUrl.host;
    const reqPath = parsedUrl.pathname;
    console.log(`requestRejseplan: Parsed URL - host: ${host}, path: ${reqPath}`);

    const options: https.RequestOptions = {
      host: host,
      port: 443,
      path: reqPath,
      method: method,
      headers: headers,
      rejectUnauthorized: false
    };
    console.log(`requestRejseplan: Request options:`, options);

    const req = https.request(options);

    req.on('response', (res) => {
      let responseData = '';
      console.log(`requestRejseplan: Received response with status code: ${res.statusCode}`);

      res.on('data', (chunk) => {
        responseData += chunk;
        console.log(`requestRejseplan: Received data chunk of length: ${chunk.length}`);
      });

      res.on('end', () => {
        console.log(`requestRejseplan: Response ended, total data length: ${responseData.length}`);
        const response: HttpResponse = {
          responseData: responseData,
          responseHeaders: res.headers,
          responseCode: res.statusCode
        };
        console.log(`requestRejseplan: Resolving with response:`, { responseCode: response.responseCode, headers: response.responseHeaders });
        resolve(response);
      });
    });

    req.on('error', (error) => {
      console.error(`requestRejseplan: Error occurred:`, error);
      reject(error);
    });

    if (method === HttpMethod.POST) {
      console.log(`requestRejseplan: Writing POST data: ${data}`);
      req.write(data);
    }

    console.log(`requestRejseplan: Sending request`);
    req.end();
  });
}

function extractCookies(headers: IncomingHttpHeaders): Cookie {
  console.log(`extractCookies: Extracting cookies from headers:`, headers);
  const setCookieHeader = headers['set-cookie'];
  if (!setCookieHeader || !Array.isArray(setCookieHeader)) {
    console.log(`extractCookies: No set-cookie header found, returning empty object`);
    return {};
  }
  const cookies: Record<string, string> = {};

  setCookieHeader.map(cookie => {
    const [nameValue, ...options] = cookie.split(';');
    const [name, value] = nameValue.split('=').map(part => part.trim());
    console.log(`extractCookies: Parsed cookie - name: ${name}, value: ${value}`);
    cookies[name] = value;
  });

  console.log(`extractCookies: Returning cookies:`, cookies);
  return cookies;
}

function getInputVerificationToken(page: string): string {
  console.log(`getInputVerificationToken: Extracting token from page data (length: ${page.length})`);
  const regexPattern = /<input[^>]*name="__RequestVerificationToken"[^>]*value="([^"]*)"[^>]*>/;
  const token = (page).match(regexPattern)?.[1] || "";
  console.log(`getInputVerificationToken: Extracted token: ${token}`);
  return token;
}

function formatCookies(cookiesMap: Record<string, string>): string {
  console.log(`formatCookies: Formatting cookies:`, cookiesMap);
  const formattedCookies = Object.entries(cookiesMap)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
  console.log(`formatCookies: Formatted cookie string: ${formattedCookies}`);
  return formattedCookies;
}

function parseDateString(dateString: string): Date {
  console.log(`parseDateString: Parsing date string: ${dateString}`);
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('-').map(part => parseInt(part, 10));
  const [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));
  console.log(`parseDateString: Parsed components - day: ${day}, month: ${month}, year: ${year}, hours: ${hours}, minutes: ${minutes}`);

  if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hours) && !isNaN(minutes)) {
    const fullYear = year < 50 ? 2000 + year : 1900 + year;
    console.log(`parseDateString: Calculated full year: ${fullYear}`);
    const parsedDate = new Date(fullYear, month - 1, day, hours, minutes);
    console.log(`parseDateString: Returning parsed date: ${parsedDate}`);
    return parsedDate;
  }

  console.log(`parseDateString: Invalid date components, returning default Date`);
  return new Date();
}

export async function login(username: string, password: string): Promise<Cookie> {
  console.log(`login: Starting login with username: ${username}`);
  const loginMainPageResponse: HttpResponse = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin", HttpMethod.GET);
  console.log(`login: Received login page response, status: ${loginMainPageResponse.responseCode}`);
  const requestTokenHidden = getInputVerificationToken(loginMainPageResponse.responseData);
  console.log(`login: Extracted verification token: ${requestTokenHidden}`);
  let cookies = extractCookies(loginMainPageResponse.responseHeaders);
  console.log(`login: Cookies from GET response:`, cookies);
  const formattedCookies = formatCookies(cookies);
  console.log(`login: Formatted cookies for POST: ${formattedCookies}`);
  const travelOverViewPage = await requestRejseplan(
    "https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin",
    HttpMethod.POST,
    { "Cookie": formattedCookies, "Content-type": "application/x-www-form-urlencoded" },
    `__RequestVerificationToken=${requestTokenHidden}&ReturnUrl=&Username=${username}&Password=${password}`
  );
  console.log(`login: Received POST response, status: ${travelOverViewPage.responseCode}`);
  cookies = { ...extractCookies(travelOverViewPage.responseHeaders), ...cookies };
  console.log(`login: Merged cookies:`, cookies);
  console.log(`login: Returning cookies`);
  return cookies;
}

export async function getTravelHistoryNextPage(nextpage: NextPage): Promise<TripAndNextPage> {
  console.log(`getTravelHistoryNextPage: Fetching next page, pageIndex: ${nextpage.pageIndex + 5}, token: ${nextpage.verificationToken}`);
  const result = await getTravelHistory(nextpage.cookie, nextpage.pageIndex + 5, nextpage.verificationToken);
  console.log(`getTravelHistoryNextPage: Returning result:`, result);
  return result;
}

export async function checkCookie(cookies: Cookie): Promise<boolean> {
  console.log(`checkCookie: Checking cookies:`, cookies);
  const formattedCookies = formatCookies(cookies);
  console.log(`checkCookie: Formatted cookies: ${formattedCookies}`);
  const page = await requestRejseplan(
    "https://selvbetjening.rejsekort.dk/CWS/TransactionServices/TravelCardHistory",
    HttpMethod.GET,
    { "Cookie": formattedCookies }
  );
  console.log(`checkCookie: Received response, status: ${page.responseCode}`);
  const isValid = page.responseCode === 200;
  console.log(`checkCookie: Cookie valid: ${isValid}`);
  return isValid;
}

export async function getTravelHistory(cookies: Cookie, page: number = 1, historyToken?: string): Promise<TripAndNextPage> {
  console.log(`getTravelHistory: Starting for page ${page}, historyToken: ${historyToken}`);
  if (!historyToken) {
    console.log(`getTravelHistory: No history token, fetching initial page`);
    const travelHistory = await requestRejseplan(
      "https://selvbetjening.rejsekort.dk/CWS/TransactionServices/TravelCardHistory",
      HttpMethod.GET,
      { "Cookie": formatCookies(cookies) }
    );
    console.log(`getTravelHistory: Initial page response, status: ${travelHistory.responseCode}`);
    historyToken = getInputVerificationToken(travelHistory.responseData);
    console.log(`getTravelHistory: Extracted history token: ${historyToken}`);
    cookies = { ...extractCookies(travelHistory.responseHeaders), ...cookies };
    console.log(`getTravelHistory: Updated cookies:`, cookies);
  }
  const historyAllPayload = `__RequestVerificationToken=${historyToken}&periodSelected=All&page=${page}`;
  console.log(`getTravelHistory: POST payload: ${historyAllPayload}`);
  const formattedCookies = formatCookies(cookies);
  console.log(`getTravelHistory: Formatted cookies for POST: ${formattedCookies}`);
  const allTravelsPageOne = await requestRejseplan(
    "https://selvbetjening.rejsekort.dk/CWS/TransactionServices/TravelCardHistory",
    HttpMethod.POST,
    { "Cookie": formattedCookies, "Content-type": "application/x-www-form-urlencoded" },
    historyAllPayload
  );
  console.log(`getTravelHistory: POST response, status: ${allTravelsPageOne.responseCode}`);
  cookies = { ...extractCookies(allTravelsPageOne.responseHeaders), ...cookies };
  console.log(`getTravelHistory: Updated cookies after POST:`, cookies);
  const nextPageVerificationToken = getInputVerificationToken(allTravelsPageOne.responseData);
  console.log(`getTravelHistory: Next page verification token: ${nextPageVerificationToken}`);

  const replacements: { [key: string]: string } = {
    'æ': 'ae',
    'ø': 'oe',
    'å': 'aa',
    'Æ': 'AE',
    'Ø': 'OE',
    'Å': 'AA'
  };
  console.log(`getTravelHistory: Applying character replacements:`, replacements);
  const pattern = new RegExp(Object.keys(replacements).join('|'), 'g');
  const modifiedResponseData = allTravelsPageOne.responseData.replace(pattern, match => replacements[match]);
  console.log(`getTravelHistory: Response data length after replacement: ${modifiedResponseData.length}`);
  const tablesAsJson = Tabletojson.convert(modifiedResponseData);
  console.log(`getTravelHistory: Parsed tables to JSON, count: ${tablesAsJson.length}`);
  const filteredAndFlattenedData: any[] = tablesAsJson
    .flatMap(table => table.filter((entry: any, index: number, arr: any[]) =>
      entry["Rejsenr."] !== undefined && entry["Rejsenr."] !== "" &&
      arr.findIndex(e => e["Rejsenr."] === entry["Rejsenr."]) === index
    ));
  console.log(`getTravelHistory: Filtered unique trips, count: ${filteredAndFlattenedData.length}`);
  let trips: Trip[] = [];
  for (const rejse of filteredAndFlattenedData) {
    trips.push({
      date: parseDateString(rejse.Dato + " " + rejse.Tid),
      from: rejse.Fra,
      arrival: parseDateString(rejse.Dato + " " + rejse.Tid_2),
      to: rejse.Til,
      amount: rejse['Beloeb kr.'],
      printed: false,
      id: rejse['Rejsenr.']
    })
  }

  return { trips: trips, nextPage: { verificationToken: nextPageVerificationToken, cookie: cookies, pageIndex: page } };
}

export async function stringifyCookie(cookie: Cookie): Promise<string> {
  // Initialize an empty string to store the result
  let cookieString = '';

  // Iterate over each key-value pair in the cookie object
  for (const key in cookie) {
    if (Object.prototype.hasOwnProperty.call(cookie, key)) {
      // Append key-value pair to the result string
      cookieString += `${key}=${cookie[key]}; `;
    }
  }

  // Remove the trailing semicolon and space
  cookieString = cookieString.trim().slice(0, -1);

  return cookieString;
}

export async function cookiefyString(cookieString: string): Promise<Cookie> {
  const cookie: Cookie = {};

  cookieString.split(';').forEach(segment => {
    const [key, value] = segment.trim().split('=');
    if (key && value) {
      cookie[key] = value;
    }
  });

  return cookie;
}