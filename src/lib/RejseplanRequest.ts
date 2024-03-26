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
  return new Promise((resolve, reject) => {
    
    const url = require('url');
    const parsedUrl = url.parse(path);
    const host = parsedUrl.host;
    const reqPath = parsedUrl.pathname;

    const options: https.RequestOptions = {
      host: host,
      port: 443,
      path: reqPath,
      method: method,
      headers: headers
    };

    const req = https.request(options)

    req.on('response', (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const response: HttpResponse = {
          responseData: responseData,
          responseHeaders: res.headers,
          responseCode: res.statusCode
        };
        resolve(response);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // Write data to the request body if it's a POST request
    if (method === HttpMethod.POST) {
      req.write(data);
    }

    req.end();
  });
}

function extractCookies(headers: IncomingHttpHeaders): Cookie {
  const setCookieHeader = headers['set-cookie'];
  if (!setCookieHeader || !Array.isArray(setCookieHeader)) {
    return {};
  }
  const cookies: Record<string, string> = {};

  setCookieHeader.map(cookie => {
    // Extract cookie name and value
    const [nameValue, ...options] = cookie.split(';');
    const [name, value] = nameValue.split('=').map(part => part.trim());

    // Combine name and value
    cookies[name] = value;
  });

  return cookies;
}

function getInputVerificationToken(page: string): string {
  const regexPattern = /<input[^>]*name="__RequestVerificationToken"[^>]*value="([^"]*)"[^>]*>/;
  return (page).match(regexPattern)?.[1] || ""
}

function formatCookies(cookiesMap: Record<string, string>): string {
  const formattedCookies = Object.entries(cookiesMap)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');

  return formattedCookies;
}

function parseDateString(dateString: string): Date {
  // Split the date and time parts
  const [datePart, timePart] = dateString.split(' ');

  // Split the date into day, month, and year
  const [day, month, year] = datePart.split('-').map(part => parseInt(part, 10));

  // Split the time into hours and minutes
  const [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));

  // If all parts are valid, create a new Date object
  if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hours) && !isNaN(minutes)) {
    // Assuming year format as 'YY', adjust accordingly if it's 'YYYY'
    const fullYear = year < 50 ? 2000 + year : 1900 + year;

    // Note: Months are zero-based (0-11)
    return new Date(fullYear, month - 1, day, hours, minutes);
  }

  return new Date(); // Return null if parsing fails
}

export async function login(username: string, password: string): Promise<Cookie> {
  const loginMainPageResponse: HttpResponse = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin", HttpMethod.GET);
  const requestTokenHidden = getInputVerificationToken(loginMainPageResponse.responseData);
  let cookies = extractCookies(loginMainPageResponse.responseHeaders);
  const travelOverViewPage = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin", HttpMethod.POST, { "Cookie": formatCookies(cookies), "Content-type": "application/x-www-form-urlencoded" }, `__RequestVerificationToken=${requestTokenHidden}&ReturnUrl=&Username=${username}&Password=${password}`)

  cookies = { ...extractCookies(travelOverViewPage.responseHeaders), ...cookies };
  return cookies;

}

export async function getTravelHistoryNextPage(nextpage: NextPage): Promise<TripAndNextPage> {
  return getTravelHistory(nextpage.cookie, nextpage.pageIndex + 5, nextpage.verificationToken)
}

export async function checkCookie(cookies: Cookie) : Promise<boolean> {
  const page = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/TransactionServices/TravelCardHistory", HttpMethod.GET, { "Cookie": formatCookies(cookies) })
  return page.responseCode === 200
}

export async function getTravelHistory(cookies: Cookie, page: number = 1, historyToken?: string): Promise<TripAndNextPage> {
  if (!historyToken) {
    const travelHistory = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/TransactionServices/TravelCardHistory", HttpMethod.GET, { "Cookie": formatCookies(cookies) })
    historyToken = getInputVerificationToken(travelHistory.responseData)
    cookies = { ...extractCookies(travelHistory.responseHeaders), ...cookies };
  }
  const historyAllPayload = `__RequestVerificationToken=${historyToken}&periodSelected=All&page=${page}`;
  const allTravelsPageOne = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/TransactionServices/TravelCardHistory", HttpMethod.POST, { "Cookie": formatCookies(cookies), "Content-type": "application/x-www-form-urlencoded" }, historyAllPayload)
  cookies = { ...extractCookies(allTravelsPageOne.responseHeaders), ...cookies };
  const nextPageVerificationToken = getInputVerificationToken(allTravelsPageOne.responseData);

  const replacements: { [key: string]: string } = {
    'æ': 'ae',
    'ø': 'oe',
    'å': 'aa',
    'Æ': 'AE',
    'Ø': 'OE',
    'Å': 'AA'
  };
  const pattern = new RegExp(Object.keys(replacements).join('|'), 'g');
  const tablesAsJson = Tabletojson.convert(allTravelsPageOne.responseData.replace(pattern, match => replacements[match]));
  const filteredAndFlattenedData: any[] = tablesAsJson
    .flatMap(table => table.filter((entry: any, index: number, arr: any[]) =>
      entry["Rejsenr."] !== undefined && entry["Rejsenr."] !== "" &&
      arr.findIndex(e => e["Rejsenr."] === entry["Rejsenr."]) === index
    ));
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