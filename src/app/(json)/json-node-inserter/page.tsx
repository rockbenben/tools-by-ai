import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 节点插入工具|Tools by AI",
  description: "在JSON数据中指定位置插入新节点",
  keywords: "数组插入, 节点插入, 数据处理工具",
};

export default function Page() {
  return <ClientPage />;
}
