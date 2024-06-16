import React from "react";
import "./globals.css";
import { Navigation } from "./ui/Navigation";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { GoogleTagManager } from "@next/third-parties/google";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <GoogleTagManager gtmId="GTM-YourTag" />
      <body>
        <Navigation />
        <AntdRegistry>
          <main>
            {children}
          </main>
        </AntdRegistry>
      </body>
    </html>
  );
}
