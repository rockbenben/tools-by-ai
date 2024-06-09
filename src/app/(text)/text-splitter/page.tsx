import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文本分割器 - 轻松分割和复制长文本|Tools by AI",
  description: "文本分割工具可以帮助你将长文本分割成较小段落。输入文本并设置字符限制，获取分割结果并一键复制。适用于ChatGPT等字符限制场景。",
  keywords: "文本分割, 文本工具, 分割长文本, 复制文本, ChatGPT字符限制, 字符限制工具",
};

export default function Page() {
  return <ClientPage />;
}
