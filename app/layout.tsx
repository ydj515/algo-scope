import type { Metadata } from "next";
import { GlobalNav } from "@/features/navigation/components/global-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algo Scope",
  description: "자료구조/알고리즘 시각화 학습 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
