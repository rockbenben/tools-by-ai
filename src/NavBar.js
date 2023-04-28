import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Layout, Row, Col, Grid } from "antd";
import {
  BgColorsOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  GithubOutlined,
} from "@ant-design/icons";
const { useBreakpoint } = Grid;

const { Header } = Layout;

const menuItems = [
  {
    key: "1",
    path: "/",
    title: "正则匹配工具",
  },
  {
    key: "2",
    path: "/translate",
    title: "i18n JSON 翻译",
  },
  {
    key: "3",
    path: "/text-splitter",
    title: "文本分割",
  },
  {
    key: "6",
    path: "https://www.aishort.top/",
    title: "ChatGPT Shortcut",
    icon: <ExperimentOutlined />,
    external: true,
  },
  {
    key: "7",
    path: "https://prompt.newzone.top/",
    title: "IMGPrompt",
    icon: <BgColorsOutlined />,
    external: true,
  },
  {
    key: "8",
    path: "https://newzone.top/",
    title: "LearnData 开源笔记",
    icon: <ThunderboltOutlined />,
    external: true,
  },
];

const NavBar = () => {
  const location = useLocation();
  const screens = useBreakpoint();

  const selectedKey = menuItems.reduce((selected, item) => {
    return location.pathname.startsWith(item.path) ? item.key : selected;
  }, "1");

  return (
    <Header>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col xs={20} sm={18} md={16}>
          <Menu mode="horizontal" theme="dark" selectedKeys={[selectedKey]}>
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.external ? (
                  <a href={item.path} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                ) : (
                  <Link to={item.path}>{item.title}</Link>
                )}
              </Menu.Item>
            ))}
          </Menu>
        </Col>
        <Col>
          <Row gutter={16} wrap={false}>
            {screens.md && (
              <Col style={{ display: "flex", alignItems: "center" }}>
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
            )}
            <Col>
              <a
                href="https://github.com/rockbenben/tools-by-ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined style={{ color: "white", fontSize: "24px" }} />
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default NavBar;
