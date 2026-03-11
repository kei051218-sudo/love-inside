import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Love Inside",
  description: "오늘 밤, 당신의 사랑은 어디로 가나요?",
  openGraph: {
    title: "Love Inside",
    description: "오늘 밤, 당신의 사랑은 어디로 가나요?",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
