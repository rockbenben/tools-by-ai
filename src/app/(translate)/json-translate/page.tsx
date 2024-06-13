import ClientPage from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "多语言 JSON 翻译工具 - i18n 国际化开发助手 | JsonTranslate | Tools by AI",
  description:
    "JsonTranslate 是一个轻便的多语言 JSON 翻译工具，专为软件开发者和内容管理者设计，以支持国际化和本地化项目。轻松转换 JSON 文档中的文本到多种目标语言，使用 Google Translate、DeepL、Azure 和 DeepLX 翻译 API。",
  keywords: "JsonTranslate,JSON 翻译工具，多语言翻译，国际化工具，i18n,本地化，Google 翻译 API,DeepL 翻译 API,Azure翻译,自动翻译 JSON,编程语言翻译",
};

export default function Page() {
  return <ClientPage />;
}
