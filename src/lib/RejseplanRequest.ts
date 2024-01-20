import * as https from 'https';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

interface RequestOptions {
  method: HttpMethod;
  headers?: any;
}

interface Headers {
  [key: string]: string;
}

export function requestRejseplan(path: string, method: HttpMethod, data: string = "", headers: Headers = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const options: RequestOptions = {
      method,
      headers
    };

    const req = https.request( path, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve(responseData);
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