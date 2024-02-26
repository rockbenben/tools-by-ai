import TextSplitter from "./client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文本分割工具|Tools by AI",
  description:
    "文本分割工具可以帮助你将输入的长文本按照指定的字符限制分割成多个小段，分割后的结果会以多个文本框的形式展示在界面上，用户可以通过点击“复制”按钮将某个文本框中的内容复制到剪贴板中。这特别适用于需要遵守字符限制的场景，例如使用 ChatGPT 时的 2000 字符限制。",
  keywords: "文本分割,文本处理,AI 工具,字符限制,ChatGPT",
};

export default function Page() {
  return <TextSplitter />;
}
