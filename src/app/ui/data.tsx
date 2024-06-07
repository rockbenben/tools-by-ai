import Link from "next/link";
import { BgColorsOutlined, DatabaseOutlined, ExperimentOutlined, ThunderboltOutlined } from "@ant-design/icons";

export const DISCORD_LINK = "https://discord.gg/PZTQfJ4GjX";
export const GITHUB_LINK = "https://github.com/rockbenben/tools-by-ai";
export const DISCORD_BADGE_SRC = "https://img.shields.io/discord/1048780149899939881?color=%2385c8c8&label=Discord&logo=discord&style=for-the-badge";

export const MENU_ITEMS = [
  {
    label: <Link href="/">主页</Link>,
    key: "/",
  },
  {
    label: <Link href="/json-translate">i18n JSON 翻译</Link>,
    key: "/json-translate",
  },
  {
    label: <Link href="/json-edit">批量文本处理</Link>,
    key: "/json-edit",
  },
  {
    label: "数据解析工具",
    key: "dataParser",
    icon: <DatabaseOutlined />,
    children: [
      {
        label: <Link href="/data-parser/img-prompt">IMGPrompt 数据转换器</Link>,
        key: "/data-parser/img-prompt",
      },
      {
        label: <Link href="/data-parser/flare">Flare 书签解析工具</Link>,
        key: "/data-parser/flare",
      },
      {
        label: <Link href="/text-splitter">文本分割</Link>,
        key: "/text-splitter",
      },
    ],
  },
  {
    label: <Link href="/aishort-translate">多语言一键翻译</Link>,
    key: "/aishort-translate",
  },
  {
    label: <Link href="/sublabel-translator">字幕翻译</Link>,
    key: "/sublabel-translator",
  },
  {
    label: (
      <a href="https://www.aishort.top/" target="_blank" rel="noopener noreferrer">
        ChatGPT Shortcut
      </a>
    ),
    key: "aishort",
    icon: <ExperimentOutlined />,
  },
  {
    label: (
      <a href="https://prompt.newzone.top/" target="_blank" rel="noopener noreferrer">
        IMGPrompt
      </a>
    ),
    key: "IMGPrompt",
    icon: <BgColorsOutlined />,
  },
  {
    label: (
      <a href="https://newzone.top/" target="_blank" rel="noopener noreferrer">
        LearnData 开源笔记
      </a>
    ),
    key: "LearnData",
    icon: <ThunderboltOutlined />,
  },
];
