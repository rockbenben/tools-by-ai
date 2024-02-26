import TextProcessingTool from "./home";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "批量文本处理 - 正则匹配、JSON 编辑与转换|Tools by AI",
  description: "提供包括正则匹配工具、JSON 键值替换、JSON 编辑器、文本处理工具、数组插入工具以及权重更新工具。无论您是需要进行批量文本处理，还是需要进行 JSON 编辑和转换，都能帮助您快速完成任务。",
  keywords: "批量文本处理,正则匹配工具,JSON 键值替换,JSON 编辑器,文本处理工具,数组插入工具,权重更新工具",
};

export default function Home() {
  return <TextProcessingTool />;
}
