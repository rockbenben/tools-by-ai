# Tools by AI

> AI 时代已经来临，每个人都能定制属于自己的专属工具。

这是一个开源的在线工具，主要由 ChatGPT 完成编程。我将把之前的本地应用处理工具在线化，并分享在这里。

在线链接：<https://tools.newzone.top>

## 工具列表

### JsonTranslate i18n 翻译器

[JsonTranslate](https://tools.newzone.top/json-translate) 是一款高效的多语言 JSON 翻译工具，专为开发者和内容创作者设计。支持 Google Translate、DeepL 和 DeepLX 翻译 API，助力快速实现项目的国际化和本地化。无论您是在开发多语言网站、应用程序还是处理多语言数据集，JsonTranslate 都能提供简便的解决方案，轻松将 JSON 文件中的内容翻译为多种目标语言。了解更多可查看[使用教程](https://newzone.top/apps/devdocs/json-translate.html)。

![](https://img.newzone.top/2023-12-18-16-09-04.gif?imageMogr2/format/webp "JsonTranslate 使用示例")

### 其它

- [SRT 字幕翻译](https://tools.newzone.top/subtitle-translator)：自动字幕翻译，支持多种语言的字幕文件转换。

- [正则匹配](https://tools.newzone.top/regex-matcher)：使用正则表达式匹配文本。

- [文本分割](https://tools.newzone.top/text-splitter)：将长文本按照特定规则进行分割。

- [JSON 键值替换工具](https://tools.newzone.top/json-value-transformer)：将 JSON 中指定键的值替换为另一个指定键的值。

- [JSON 键值互换工具](https://tools.newzone.top/json-value-swapper)：在 JSON 中互换指定的两个键的值。

- [JSON 节点插入工具](https://tools.newzone.top/json-node-inserter)：在 JSON 中的指定位置插入新的节点。

- [JSON 节点批量编辑](https://tools.newzone.top/json-node-edit)：批量编辑 JSON 节点的值。

- [JSON 值提取工具](https://tools.newzone.top/json-value-extractor)：从 JSON 数据中批量提取特定键名的值。

- [Flare 书签解析工具](https://tools.newzone.top/data-parser/flare)：将书签数据转换为 Flare 格式，并可互相转换。

- [IMGPrompt 数据转换器](https://tools.newzone.top/data-parser/img-prompt)：为 IMGPrompt 数据处理设计，通过自定义对象与属性批量生成 JSON 数据。

- [JSON 数据匹配更新](https://tools.newzone.top/json-match-update)：使用两个不同的 JSON 数据，根据它们的键名进行匹配，并使用另一个指定键名的值进行更新的工具。

## 生成命令

v1:

```bash
Please act as a Senior Frontend developer and create a a project using Create Next App, yarn, Ant Design, axios. In this project, implement a feature that displays Chinese text on the screen. Apply styling using Ant Design. Please provide all relevant code snippets for each task and explain how they work. Your first task is [项目要求]
```

v2:

```bash
Please assist me in building a frontend project with specific technologies and features. Your expertise as a Senior Frontend Developer will be appreciated. Here are the detailed tasks:

1. Setup a new project using Create Next App, yarn, Ant Design, axios.

2. Implement a feature that displays Chinese text on the screen. Apply styling using Ant Design.

3. The entire conversation and instructions should be provided in Chinese.

Please provide all relevant code snippets for each task and explain how they work. Your first task is [项目要求]
```

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
