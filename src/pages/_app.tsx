import React, { useState } from "react";
import {
  BgColorsOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Row, Col } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppProps } from "next/app";
import Head from "next/head";

const items: MenuProps["items"] = [
  {
    label: <Link href='/json-translate'>i18n JSON 翻译</Link>,
    key: "/json-translate",
  },
  {
    label: <Link href='/'>批量文本处理</Link>,
    key: "/",
  },
  {
    label: <Link href='/text-splitter'>文本分割</Link>,
    key: "/text-splitter",
  },
  {
    label: <Link href='/sublabel-translator'>字幕翻译</Link>,
    key: "/sublabel-translator",
  },
  {
    label: (
      <a
        href='https://www.aishort.top/'
        target='_blank'
        rel='noopener noreferrer'>
        ChatGPT Shortcut
      </a>
    ),
    key: "aishort",
    icon: <ExperimentOutlined />,
  },
  {
    label: (
      <a
        href='https://prompt.newzone.top/'
        target='_blank'
        rel='noopener noreferrer'>
        IMGPrompt
      </a>
    ),
    key: "IMGPrompt",
    icon: <BgColorsOutlined />,
  },
  {
    label: (
      <a href='https://newzone.top/' target='_blank' rel='noopener noreferrer'>
        LearnData 开源笔记
      </a>
    ),
    key: "LearnData",
    icon: <ThunderboltOutlined />,
  },
];

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const [current, setCurrent] = useState(router.pathname);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                  var u="https://piwik.seoipo.com/";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', '11']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
          `,
          }}
        />
      </Head>
      <Row justify='space-between' align='middle' gutter={16}>
        <Col xs={20} sm={18} md={16}>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode='horizontal'
            items={items}
          />
        </Col>
        <Col>
          <Row gutter={16} wrap={false}>
            <Col xs={0} sm={0} md={18}>
              <a
                href='https://discord.gg/PZTQfJ4GjX'
                target='_blank'
                rel='noopener noreferrer'>
                <img
                  src='https://img.shields.io/discord/1048780149899939881?color=%2385c8c8&label=Discord&logo=discord&style=for-the-badge'
                  alt='chat on Discord'
                />
              </a>
            </Col>
            <Col>
              <a
                href='https://github.com/rockbenben/tools-by-ai'
                target='_blank'
                rel='noopener noreferrer'
                style={{ marginLeft: "10px" }}>
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
