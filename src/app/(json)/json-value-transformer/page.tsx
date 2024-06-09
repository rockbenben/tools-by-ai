import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 键值替换|Tools by AI",
  description: "使用预设或自定义的键值映射来替换JSON数据中的键值。用户可以输入一对键（输入键和输出键），该工具会查找 JSON 数据中的输入键位置，然后将对应位置的值替换为输出键位置的值。",
  keywords: "JSON, 键值替换, JSON工具, 数据处理, 键映射",
};

export default function Page() {
  return <ClientPage />;
}
