import SubtitleTranslator from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线字幕翻译工具 | Tools by AI",
  description: "一个便捷的在线字幕翻译工具，支持多种语言选择和单文件或多文件翻译。只需要提供 Google Translate API Key，就可以快速得到翻译结果。",
  keywords: "字幕翻译，在线翻译，多语言翻译，Google Translate，字幕文件，单文件翻译，多文件翻译",
};

export default function Page() {
  return <SubtitleTranslator />;
}