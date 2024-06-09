import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 数据匹配更新工具|Tools by AI",
  description: "将计数 JSON 数据与原始 JSON 数据匹配，并自动更新权重值。支持自定义字段名，操作简单，处理快速。支持多种权重数据格式。",
  keywords: "JSON工具, JSON数据更新, JSON匹配工具, JSON数据处理, JSON自动更新, 数据处理工具, JSON解析, JSON编辑器",
};

export default function Page() {
  return <ClientPage />;
}
