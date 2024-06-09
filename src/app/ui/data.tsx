import Link from "next/link";
import {
  BgColorsOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  ScissorOutlined,
  FileTextOutlined,
  CodeOutlined,
  GlobalOutlined,
  BookOutlined,
  FileSearchOutlined,
  EditOutlined,
  SwapOutlined,
  FileSyncOutlined,
  NodeIndexOutlined,
  VideoCameraOutlined,
  TranslationOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

export const GITHUB_LINK = "https://github.com/rockbenben/tools-by-ai";
export const DISCORD_LINK = "https://discord.gg/PZTQfJ4GjX";
export const DISCORD_BADGE_SRC = "https://img.shields.io/discord/1048780149899939881?color=%2385c8c8&label=Discord&logo=discord&style=for-the-badge";

export const MENU_ITEMS = [
  {
    label: <Link href="/">主页</Link>,
    key: "/",
  },
  {
    label: "多语言翻译",
    key: "translate",
    icon: <GlobalOutlined />,
    children: [
      {
        label: <Link href="/json-translate">i18n JSON 翻译</Link>,
        key: "/json-translate",
        icon: <TranslationOutlined />,
      },
      {
        label: <Link href="/sublabel-translator">SRT 字幕翻译</Link>,
        key: "/sublabel-translator",
        icon: <VideoCameraOutlined />,
      },
      {
        label: <Link href="/aishort-translate">AIShort 多语言翻译</Link>,
        key: "/aishort-translate",
        icon: <GlobalOutlined />,
      },
    ],
  },
  {
    label: "文本处理",
    key: "textParser",
    icon: <FileTextOutlined />,
    children: [
      {
        label: <Link href="/regex-matcher">正则匹配</Link>,
        key: "/regex-matcher",
        icon: <CodeOutlined />,
      },
      {
        label: <Link href="/text-splitter">文本分割</Link>,
        key: "/text-splitter",
        icon: <ScissorOutlined />,
      },
      {
        label: <Link href="/text-processor">多规则处理</Link>,
        key: "/text-processor",
        icon: <ProfileOutlined />,
      },
    ],
  },
  {
    label: "JSON 处理",
    key: "jsonParser",
    icon: <DatabaseOutlined />,
    children: [
      {
        label: <Link href="/json-value-transformer">JSON 键值替换工具</Link>,
        key: "/json-value-transformer",
        icon: <FileSyncOutlined />,
      },
      {
        label: <Link href="/json-value-swapper">JSON 键值互换工具</Link>,
        key: "/json-value-swapper",
        icon: <SwapOutlined />,
      },
      {
        label: <Link href="/json-node-inserter">JSON 节点插入工具</Link>,
        key: "/json-node-inserter",
        icon: <NodeIndexOutlined />,
      },
      {
        label: <Link href="/json-node-edit">JSON 节点批量编辑</Link>,
        key: "/json-node-edit",
        icon: <EditOutlined />,
      },
      {
        label: <Link href="/json-value-extractor">JSON 值提取工具</Link>,
        key: "/json-value-extractor",
        icon: <FileSearchOutlined />,
      },
      {
        label: <Link href="/json-match-update">JSON 数据匹配更新</Link>,
        key: "/json-match-update",
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    label: "数据解析工具",
    key: "dataParser",
    icon: <FileSearchOutlined />,
    children: [
      {
        label: <Link href="/data-parser/flare">Flare 书签解析工具</Link>,
        key: "/data-parser/flare",
        icon: <LinkOutlined />,
      },
      {
        label: <Link href="/data-parser/img-prompt">IMGPrompt 数据转换器</Link>,
        key: "/data-parser/img-prompt",
        icon: <UnorderedListOutlined />,
      },
    ],
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
    icon: <BookOutlined />,
  },
];
