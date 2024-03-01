import * as https from 'https';
import { IncomingHttpHeaders } from 'http';
import { headers } from 'next/headers';
import { Tabletojson } from 'tabletojson';

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

interface RequestOptions {
  method: HttpMethod;
  headers?: any;
}

interface HttpResponse {
  responseData: string;
  responseHeaders: IncomingHttpHeaders;
}

interface Headers {
  [key: string]: string;
}

interface Cookie {
  [key: string]: string;
}

export interface RejseAndNextPage {
  rejser: Rejse[],
  nextPage: NextPage
}

export interface Rejse {
  date: Date
  from: string
  arrival: Date
  to: string
  amount: string
}

interface NextPage {
  verificationToken: string
  cookie: Cookie
  pageIndex: number
}

function requestRejseplan(path: string, method: HttpMethod, headers: Headers = {}, data: string = ""): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const options: RequestOptions = {
      method,
      headers
    };

    const req = https.request(path, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const response: HttpResponse = {
          responseData: responseData,
          responseHeaders: res.headers,
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

export async function getTravelHistoryNextPage(nextpage: NextPage):Promise<RejseAndNextPage> {
  return getTravelHistory(nextpage.pageIndex + 5, nextpage.cookie, nextpage.verificationToken)
}

export async function getTravelHistory(page: number, cookies: Cookie, historyToken?: string): Promise<RejseAndNextPage> {
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
  let rejser: Rejse[] = [];
  for (const rejse of filteredAndFlattenedData) {
    rejser.push({
      date: parseDateString(rejse.Dato + " " + rejse.Tid),
      from: rejse.Fra,
      arrival: parseDateString(rejse.Dato + " " + rejse.Tid_2),
      to: rejse.Til,
      amount: rejse['Beloeb kr.']
    })
  }

  return { rejser: rejser, nextPage: { verificationToken: nextPageVerificationToken, cookie: cookies, pageIndex: page } };
}
