import React from "react";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "./ui/Navigation";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ClientScripts from "./ClientScripts";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools by AI",
  description: "由 AI 辅助生成的多种文本工具",
  keywords: "ai tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <body>
        <Navigation />
        <ClientScripts />
        <AntdRegistry>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
            {children}
            <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-7585955822109216" data-ad-slot="3744254915" data-ad-format="auto" data-full-width-responsive="true"></ins>
          </div>
        </AntdRegistry>
        <Script src="https://oss.newzone.top/instantpage.min.js" type="module" strategy="lazyOnload" />
      </body>
    </html>
  );
}
