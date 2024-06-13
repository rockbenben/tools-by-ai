import SubtitleTranslator from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线字幕翻译工具 | Tools by AI",
  description: "一款便捷的在线字幕翻译工具，支持多种语言选择和单文件或多文件翻译。只需提供 Google/DeepL/Azure Translate API Key，即可快速获取翻译结果。同时支持免费的 DeepLX 翻译服务。",
  keywords: "字幕翻译,在线翻译,多语言翻译,Google Translate,字幕文件,单文件翻译,多文件翻译,DeepL 翻译 API,Azure翻译,DeepLX",
};

export default function Page() {
  return <SubtitleTranslator />;
}
