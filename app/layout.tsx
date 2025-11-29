import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "穿搭GPT - AI智能穿搭助手",
  description: "基于AI的智能穿搭方案生成器，提供个性化穿搭建议、购买指南和虚拟试穿功能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
