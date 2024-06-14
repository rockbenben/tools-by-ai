"use client";

import { Card, Row, Col, Typography, Space } from "antd";
import Link from "next/link";
import {
  GlobalOutlined,
  VideoCameraOutlined,
  EditOutlined,
  FileSearchOutlined,
  TranslationOutlined,
  CodeOutlined,
  ScissorOutlined,
  FileSyncOutlined,
  ProfileOutlined,
  NodeIndexOutlined,
  SwapOutlined,
  LinkOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const projects = [
  {
    title: "i18n JSON 翻译",
    description: "多语言翻译工具，帮助开发者快速翻译 JSON 文件。",
    link: "/json-translate",
    icon: <TranslationOutlined />,
  },
  {
    title: "SRT 字幕翻译",
    description: "自动字幕翻译，支持多种语言的字幕文件转换。",
    link: "/subtitle-translator",
    icon: <VideoCameraOutlined />,
  },
  {
    title: "正则匹配",
    description: "使用正则表达式匹配文本。",
    link: "/regex-matcher",
    icon: <CodeOutlined />,
  },
  {
    title: "文本分割",
    description: "将长文本按照特定规则进行分割。",
    link: "/text-splitter",
    icon: <ScissorOutlined />,
  },
  {
    title: "多规则处理",
    description: "自用工具，定制多种规则处理工具",
    link: "/text-processor",
    icon: <ProfileOutlined />,
  },
  {
    title: "JSON 键值替换工具",
    description: "将 JSON 中指定键的值替换为另一个指定键的值。",
    link: "/json-value-transformer",
    icon: <FileSyncOutlined />,
  },
  {
    title: "JSON 键值互换工具",
    description: "在 JSON 中互换指定的两个键的值。",
    link: "/json-value-swapper",
    icon: <SwapOutlined />,
  },
  {
    title: "JSON 节点插入工具",
    description: "在 JSON 中的指定位置插入新的节点。",
    link: "/json-node-inserter",
    icon: <NodeIndexOutlined />,
  },
  {
    title: "JSON 节点批量编辑",
    description: "批量编辑 JSON 节点的值。",
    link: "/json-node-edit",
    icon: <EditOutlined />,
  },
  {
    title: "JSON 值提取工具",
    description: "从 JSON 数据中批量提取特定键名的值。",
    link: "/json-value-extractor",
    icon: <FileSearchOutlined />,
  },
  {
    title: "Flare 书签解析工具",
    description: "将书签数据转换为 Flare 格式，并可互相转换。",
    link: "/data-parser/flare",
    icon: <LinkOutlined />,
  },
  {
    title: "IMGPrompt 数据转换器",
    description: "为 IMGPrompt 数据处理设计，通过自定义对象与属性批量生成 JSON 数据。",
    link: "/data-parser/img-prompt",
    icon: <UnorderedListOutlined />,
  },
  {
    title: "JSON 数据匹配更新",
    description: "使用两个不同的 JSON 数据，根据它们的键名进行匹配，并使用另一个指定键名的值进行更新的工具。",
    link: "/json-match-update",
    icon: <UnorderedListOutlined />,
  },
  {
    title: "AIShort 多语言翻译",
    description: "为 ChatGPT Shortcut 的 prompt.json 数据结构设计的多语言翻译工具，支持一键翻译 13 种语言。",
    link: "/aishort-translate",
    icon: <GlobalOutlined />,
  },
];

const HomePage = () => (
  <>
    <Title style={{ textAlign: "center" }}>Welcome to Tools by AI</Title>
    <Paragraph style={{ textAlign: "center" }}>这里是一些由 AI 驱动的工具，帮助你更高效地完成工作。</Paragraph>

    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={[16, 16]} justify="center">
        {projects.map((project, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Link href={project.link} passHref>
              <Card
                hoverable
                title={
                  <Space>
                    {project.icon}
                    {project.title}
                  </Space>
                }>
                <p>{project.description}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Space>
  </>
);

export default HomePage;
