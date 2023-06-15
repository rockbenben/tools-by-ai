# Tools by AI

> AI 时代已经来临，每个人都能定制属于自己的专属工具。

这是一个开源的在线工具，主要由 ChatGPT 完成编程。我将把之前的本地应用处理工具在线化，并分享在这里。

工具链接：<https://tools.newzone.top>

## 批量文本处理器

批量文本处理器除了支持正则匹配和 JSON 节点提取，还可以在多条件匹配时使用条件语句执行不同的文本处理操作。例如，匹配 `<h4>` 和 `</h4> ` 之间的文本执行文本处理操作 1，匹配 `<h5>` 和 `</h5>` 之间的文本执行文本处理操作 2，如果都没有匹配到则直接输出文本。批量文本处理器适合从大量数据中提取文本，并按照特定规则进行处理和输出。

## i18n 翻译器

本工具适用于 i18n 文件翻译或 JSON 等规则文本翻译，同时支持规则文本的批量处理。默认使用 Google Translate API。

## Deploy

### Deploy With Vercel

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frockbenben%2Ftools-by-ai%2Ftree%2Fgh-pages)

### Installation

```shell
# Installation
yarn

# Local Development
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/index.tsx`. The page auto-updates as you edit the file.
