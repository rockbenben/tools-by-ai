import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 值提取工具|Tools by AI",
  description: "使用 JSON 值提取工具，轻松从 JSON 数据中提取并格式化节点值。",
  keywords: "JSON, 值提取, JSON 处理, 前缀, 后缀, 节点提取",
};

export default function Page() {
  return <ClientPage />;
}
