import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON节点批量编辑|Tools by AI",
  description: "使用本工具轻松编辑JSON节点，支持批量添加前缀、后缀或替换操作",
  keywords: "JSON编辑, 批量编辑JSON, JSON工具, 前缀后缀添加, 文本替换, 变量编辑",
};

export default function Page() {
  return <ClientPage />;
}
