import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rejsekvittering",
  description: "Generate receipts for rejseplanen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex items-center justify-center h-screen bg-gray-100 ${inter.className}`}>{children}</body>
    </html>
  );
}
