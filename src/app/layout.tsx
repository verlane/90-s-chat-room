import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "90년대 PC 통신 대화실 채팅",
  description: "90년대 레트로 대화실입니다. 나우누리, 천리안, 하이텔, 유니텔, 이야기 7.0, 새롬데이터맨 프로",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
