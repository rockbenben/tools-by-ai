import FlareDataPage from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flare 书签解析工具|Tools by AI",
  description: "用于将书签数据转换为 Flare 的格式。您可以选择“App”模式以解析应用列表，或“Bookmark”模式以解析书签列表，并可实现 app 和 bookmarks 间的互相转换。",
  keywords: "flare，书签导入",
};

export default function Page() {
  return <FlareDataPage />;
}
