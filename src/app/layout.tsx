import React from "react";
import "./globals.css";
import { Navigation } from "./ui/Navigation";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { GoogleTagManager } from "@next/third-parties/google";
import AdsenseAd from "./AdSense";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools by AI",
  description: "由 AI 辅助生成的多种文本工具",
  keywords: "ai tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <GoogleTagManager gtmId="GTM-WBM6XHGB" />
      <body>
        <Navigation />
        <AntdRegistry>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
            {children}
            <AdsenseAd />
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
