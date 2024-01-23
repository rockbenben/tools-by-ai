"use client";
import React, { useState } from "react";
import { Input, Button, Typography, Row, Col, message, Radio } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

const FlareDataPage = () => {
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [rule, setRule] = useState("app"); // 新增状态变量用于存储当前选择的规则
  const [categoryId, setCategoryId] = useState(""); // 新增状态变量用于存储输入的 ID

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const handleCategoryIdChange = (e) => {
    setCategoryId(e.target.value);
  };

  const parseFlareData = () => {
    const regex = /<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/g;
    let match;
    let result = "";

    while ((match = regex.exec(inputData)) !== null) {
      const href = match[1];
      const name = match[2];
      const cleanHref = href.replace(/https?:\/\//, "");
      result += `- name: ${name}\n  link: ${cleanHref}\n  icon: ${name}\n`;

      if (rule === "app") {
        result += `  desc: ${name}\n`;
      } else {
        result += `  category: "${categoryId}"\n`;
      }
    }

    setOutputData(result);
  };

  const onCopy = () => {
    message.success("结果已复制到剪贴板");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Flare 书签解析工具</Title>
      <Paragraph>用于将书签数据转换为 Flare 的格式。您可以选择“App”模式以解析应用列表，或“Bookmark”模式以解析书签列表。在“Bookmark”模式下，您还需要输入一个分类 ID。</Paragraph>
      <Radio.Group value={rule} onChange={(e) => setRule(e.target.value)} style={{ marginBottom: "10px" }}>
        <Radio.Button value="app">App</Radio.Button>
        <Radio.Button value="bookmark">Bookmark</Radio.Button>
      </Radio.Group>

      {rule === "bookmark" && <Input placeholder="请输入分类 ID" value={categoryId} onChange={handleCategoryIdChange} style={{ marginBottom: "10px" }} />}

      <Row gutter={16}>
        <Col span={12}>
          <TextArea rows={6} value={inputData} onChange={handleInputChange} placeholder="在此粘贴书签源码" />
          <Button type="text" onClick={parseFlareData} style={{ margin: "10px 0" }}>
            解析数据
          </Button>
          <CopyToClipboard text={outputData} onCopy={onCopy}>
            <Button type="text" icon={<CopyOutlined />} style={{ margin: "10px 0" }}>
              复制结果
            </Button>
          </CopyToClipboard>
        </Col>
        <Col span={12}>
          <Text type="secondary">解析结果：</Text>
          <TextArea rows={10} value={outputData} readOnly />
        </Col>
      </Row>
    </div>
  );
};

export default FlareDataPage;
