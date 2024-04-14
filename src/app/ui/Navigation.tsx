"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { MenuProps } from "antd";
import { Menu, Row, Col } from "antd";
import { usePathname } from "next/navigation";
import { BgColorsOutlined, DatabaseOutlined, ExperimentOutlined, ThunderboltOutlined, GithubOutlined } from "@ant-design/icons";

const items: MenuProps["items"] = [
  {
    label: <Link href="/json-translate">i18n JSON 翻译</Link>,
    key: "/json-translate",
  },
  {
    label: <Link href="/">批量文本处理</Link>,
    key: "/",
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

export function Navigation() {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <Row justify="space-between" align="middle" gutter={16}>
      <Col xs={20} sm={18} md={16}>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      </Col>
      <Col>
        <Row gutter={16} wrap={false}>
          <Col xs={0} sm={0} md={18}>
            <a href="https://discord.gg/PZTQfJ4GjX" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/discord/1048780149899939881?color=%2385c8c8&label=Discord&logo=discord&style=for-the-badge" alt="chat on Discord" />
            </a>
          </Col>
          <Col>
            <a href="https://github.com/rockbenben/tools-by-ai" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px" }}>
              <GithubOutlined style={{ color: "black", fontSize: "24px" }} />
            </a>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
