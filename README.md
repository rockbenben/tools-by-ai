# Tools by AI

> AI 时代已经来临，每个人都能定制属于自己的专属工具。

这是一个开源的在线工具，主要由 ChatGPT 完成编程。我将把之前的本地应用处理工具在线化，并分享在这里。

工具链接：<https://tools.newzone.top>

## 生成命令

v1:

```txt
Please act as a Senior Frontend developer and create a a project using Create Next App, yarn, Ant Design, axios. In this project, implement a feature that displays Chinese text on the screen. Apply styling using Ant Design. Please provide all relevant code snippets for each task and explain how they work. Your first task is [项目要求]
```

v2:

```txt
Please assist me in building a frontend project with specific technologies and features. Your expertise as a Senior Frontend Developer will be appreciated. Here are the detailed tasks:

1. Setup a new project using Create Next App, yarn, Ant Design, axios.

2. Implement a feature that displays Chinese text on the screen. Apply styling using Ant Design.

3. The entire conversation and instructions should be provided in Chinese.

Please provide all relevant code snippets for each task and explain how they work. Your first task is [项目要求]
```

## 工具说明

### JsonTranslate i18n 翻译器

JsonTranslate 是一款高效的多语言 JSON 翻译工具，专为开发者和内容创作者设计。支持 Google Translate、DeepL 和 DeepLX 翻译 API，助力快速实现项目的国际化和本地化。无论您是在开发多语言网站、应用程序还是处理多语言数据集，JsonTranslate 都能提供简便的解决方案，轻松将 JSON 文件中的内容翻译为多种目标语言。了解更多可查看[使用教程](https://newzone.top/apps/devdocs/json-translate.html)。

![](https://img.newzone.top/2023-12-18-16-09-04.gif?imageMogr2/format/webp "JsonTranslate 使用示例")

### 批量文本处理器

批量文本处理器除了支持正则匹配和 JSON 节点提取，还可以在多条件匹配时使用条件语句执行不同的文本处理操作。例如，匹配 `<h4>` 和 `</h4>` 之间的文本执行文本处理操作 1，匹配 `<h5>` 和 `</h5>` 之间的文本执行文本处理操作 2，如果都没有匹配到则直接输出文本。批量文本处理器适合从大量数据中提取文本，并按照特定规则进行处理和输出。

## Deploy

System Requirements:

- [Node.js 18.17](https://nodejs.org/) or later.
- macOS, Windows (including WSL), and Linux are supported.

### Deploy With Vercel

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frockbenben%2Ftools-by-ai%2Ftree%2Fmain)

### Installation

```shell
# Installation
yarn

# Local Development
yarn dev

# build and start
yarn build && yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
