// pages/api/hello.ts (Pages Router)
import { login } from '@/lib/RejseplanRequest';
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
    const json = req.body; // Access POST data
    const user = json["user"]
    const pass = json["pass"]


    res.status(200).json({ message: 'Data received', data: await login(user, pass) });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}