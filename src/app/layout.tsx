import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "90년대 레트로 PC 통신 채팅 | 나우누리, 천리안, 하이텔, 유니텔, 이야기 7.0, 새롬데이터맨 프로",
    description: "90년대 추억의 PC 통신 대화실에서 나우누리, 천리안, 하이텔, 유니텔, 이야기 7.0, 새롬데이터맨 프로와 같은 레트로 채팅을 경험해보세요. 향수를 자극하는 대화와 추억의 소통 공간.",
    icons: {
        icon: "/favicon.ico",
    },
    verification: {
        google: "SvUW37uUSOo7XgFPKWVf1bL7Tt53kz8nS2Y-wrYh30c",
        other: {"naver-site-verification": "aba4c7b721665c4986c7f7f9e78d2464d3d61bbc"},
    }
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
