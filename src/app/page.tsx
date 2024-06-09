import HomePage from "./home";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools by AI 工具集 | 提高工作效率的多语言翻译和文本处理工具",
  description: "AI 驱动的工具集合，包括多语言翻译、正则匹配、文本分割和去重等，帮助开发者更高效地完成工作。",
  keywords: "文本工具, 多语言翻译, JSON 处理, 文本处理, 正则匹配, 文本分割, 文本去重",
};

export default function Home() {
  return <HomePage />;
}
