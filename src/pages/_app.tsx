import React, { useState } from "react";
import {
  BgColorsOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Menu, Row, Col } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppProps } from "next/app";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const [current, setCurrent] = useState(router.pathname);
  type MenuInfo = Parameters<typeof Menu>[0];
  const onClick = (e: MenuInfo) => {
    console.log("click ", e);
    setCurrent(e.key as string);
  };

  return (
    <>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col xs={20} sm={18} md={16}>
          <Menu mode="horizontal" selectedKeys={[current]} onClick={onClick}>
            <Menu.Item key="/">
              <Link href="/">批量文本处理</Link>
            </Menu.Item>
            <Menu.Item key="/json-translate">
              <Link href="/json-translate">i18n JSON 翻译</Link>
            </Menu.Item>
            <Menu.Item key="/text-splitter">
              <Link href="/text-splitter">文本分割</Link>
            </Menu.Item>
            <Menu.Item key="/sublabel-translator">
              <Link href="/sublabel-translator">字幕翻译</Link>
            </Menu.Item>
            <Menu.Item key="aishort" icon={<ExperimentOutlined />}>
              <a
                href="https://www.aishort.top/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ChatGPT Shortcut
              </a>
            </Menu.Item>
            <Menu.Item key="IMGPrompt" icon={<BgColorsOutlined />}>
              <a
                href="https://prompt.newzone.top/"
                target="_blank"
                rel="noopener noreferrer"
              >
                IMGPrompt
              </a>
            </Menu.Item>
            <Menu.Item key="LearnData" icon={<ThunderboltOutlined />}>
              <a
                href="https://newzone.top/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LearnData 开源笔记
              </a>
            </Menu.Item>
          </Menu>
        </Col>
        <Col>
          <Row gutter={16} wrap={false}>
            <Col xs={0} sm={0} md={18}>
              <a
                href="https://discord.gg/PZTQfJ4GjX"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.shields.io/discord/1048780149899939881?color=%2385c8c8&label=Discord&logo=discord&style=for-the-badge"
                  alt="chat on Discord"
                />
              </a>
            </Col>
            <Col>
              <a
                href="https://github.com/rockbenben/tools-by-ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "10px" }}
              >
                <GithubOutlined style={{ color: "black", fontSize: "24px" }} />
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
      <Component {...pageProps} />
    </>
  );
};

export default App;
