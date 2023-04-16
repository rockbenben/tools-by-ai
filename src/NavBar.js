import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Layout, Row, Col } from "antd";
import { GithubOutlined } from "@ant-design/icons";

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
    path: "https://newzone.top/",
    title: "LearnData 开源笔记",
    external: true,
  },
  {
    key: "4",
    path: "https://newzone.top/",
    title: "ChatGPT Shortcut",
    external: true,
  },
];

const NavBar = () => {
  const location = useLocation();

  const selectedKey = menuItems.reduce((selected, item) => {
    return location.pathname.startsWith(item.path) ? item.key : selected;
  }, "1");

  return (
    <Header>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col xs={20} sm={18} md={16}>
          <Menu mode="horizontal" theme="dark" selectedKeys={[selectedKey]}>
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>
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
          <a
            href="https://github.com/rockbenben/tools-by-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubOutlined style={{ color: "white", fontSize: "24px" }} />
          </a>
        </Col>
      </Row>
    </Header>
  );
};


export default NavBar;
