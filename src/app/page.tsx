import LoginBox from './LoginBox';
const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";

export default function Page() {
  return (
    <div className={`flex items-center justify-center h-screen ${inter.className}`}>
      <LoginBox></LoginBox>
    </div>
  );
}