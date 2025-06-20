
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';


export interface Cookie {
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

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

export interface HttpResponse {
  responseData: string;
  responseHeaders: IncomingHttpHeaders;
  responseCode: number | undefined;
}