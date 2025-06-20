// pages/api/hello.ts (Pages Router)
import { HttpMethod, HttpResponse } from '@/lib/helper';
import { requestRejseplan, getInputVerificationToken } from '@/lib/RejseplanRequest';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
  const loginMainPageResponse: HttpResponse = await requestRejseplan("https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin", HttpMethod.GET);
  console.log(`login: Received login page response, status: ${loginMainPageResponse.responseCode}`);
  const requestTokenHidden = await getInputVerificationToken(loginMainPageResponse.responseData);

  res.status(200).json({message: requestTokenHidden})
  
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
