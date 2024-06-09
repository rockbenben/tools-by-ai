import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文本合并工具",
  description: "用文本合并工具，轻松合并文本并自动处理格式。",
  keywords: "文本合并，合并文本，文本处理，格式处理",
};

export default function Page() {
  return <ClientPage />;
}
