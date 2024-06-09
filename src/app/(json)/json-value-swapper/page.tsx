import ClientPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 键值互换工具|Tools by AI",
  description: "在 JSON 数据数组中互换指定的两个键的值。",
  keywords: "JSON, 键值互换",
};

export default function Page() {
  return <ClientPage />;
}
