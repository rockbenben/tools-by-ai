import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IMGPrompt 数据生成器",
  description: "这款数据生成器专为 Img-Prompt 数据处理设计，支持用户通过自定义对象与属性批量生成 JSON 数据。简化数据格式转换过程，实现快速生成、编辑与复制操作。",
  keywords: "IMGPrompt, JSON 数据生成器, 在线 JSON 编辑器, 数据格式转换, 批量数据处理, 自定义对象属性, 编程辅助工具, 数据管理",
};

export default function Page() {
  return <ClientPage />;
}
