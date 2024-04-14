import AIShortTranslate from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChatGPT Shortcut 定制翻译工具 - 一键翻译13种语言| Tools by AI",
  description:
    "专为 ChatGPT Shortcut 的 prompt.json 数据结构设计的多语言翻译工具，支持一键快捷翻译 13 种语言，包括印地语和孟加拉语默认使用 Google Translate，其他语言优先使用 DeepL。无 API 密钥时自动切换至 DeepLX，确保免费且有效满足基本翻译需求，操作简便，无需额外配置，适合多语言环境下的快速翻译。",
  keywords: "ChatGPT Shortcut, prompt.json, 多语言翻译工具, 一键翻译, 免费翻译服务, 翻译API密钥",
};

export default function Page() {
  return <AIShortTranslate />;
}
