import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "正则匹配工具 - 轻松查找文本匹配项",
  description: "轻松通过正则表达式查找文本中的匹配项。输入文本和正则表达式，立即获取结果。一键复制匹配结果。",
  keywords: "正则工具, 正则匹配, 正则表达式, 查找文本匹配, 复制正则结果, 常用正则表达式",
};

export default function Page() {
  return <ClientPage />;
}
