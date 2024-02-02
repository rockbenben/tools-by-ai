"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Row, Col, message, Radio } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Head from "next/head";

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

const FlareDataPage = () => {
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [currentFormat, setCurrentFormat] = useState("");
  const [rule, setRule] = useState("app"); // 新增状态变量用于存储当前选择的规则

  useEffect(() => {
    const appRegex = /^  - name: (.+)\n    link: (.+)\n    icon: (.+)\n    desc: (.+)$/gm;
    const bookmarkRegex = /^  - name: (.+)\n    link: (.+)\n    icon: (.+)\n    category: "(.+)"$/gm;

    if (appRegex.test(inputData)) {
      setCurrentFormat("app");
    } else if (bookmarkRegex.test(inputData)) {
      setCurrentFormat("bookmark");
    } else {
      setCurrentFormat("");
    }
  }, [inputData]);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const handleCategoryIdChange = (e) => {
    setCategoryId(e.target.value);
  };

  // 解析输入数据为 Flare 格式
  const parseFlareData = () => {
    const regex = /<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/g;
    let match;
    let result = "";

    while ((match = regex.exec(inputData)) !== null) {
      const href = match[1];
      const name = match[2];
      result += `- name: ${name}\n  link: ${href}\n  icon: ${name}\n`;

      if (rule === "app") {
        result += `  desc: ${name}\n`;
      } else {
        result += `  category: "${categoryId}"\n`;
      }
    }

    setOutputData(result);
  };

  const convertToBookmark = () => {
    if (currentFormat === "app") {
      const converted = inputData.replace(/desc: .+/g, `category: "${categoryId}"`);
      setOutputData(converted);
    } else {
      message.error("当前文本格式不是 App 格式");
    }
  };

  const convertToApp = () => {
    if (currentFormat === "bookmark") {
      const lines = inputData.split("\n");
      let converted = "";
      let currentName = ""; // 用于存储当前处理的书签项的名称

      for (let line of lines) {
        if (line.trim().startsWith("- name:")) {
          // 存储当前书签项的名称
          currentName = line.split(":")[1].trim();
        }

        if (line.trim().startsWith("category:")) {
          // 使用当前书签项的名称作为 desc
          converted += `    desc: ${currentName}\n`;
        } else if (!line.trim().startsWith("category:")) {
          // 其他行直接添加到转换结果中
          converted += line + "\n";
        }
      }

      setOutputData(converted);
    } else {
      message.error("当前文本格式不是 Bookmark 格式");
    }
  };

  return (
    <>
      <Head>
        <title>批量文本处理 - 正则匹配、JSON 编辑与转换|Tools by AI</title>
        <meta
          name="description"
          content="提供了多种实用工具，包括正则匹配工具、JSON键值替换、JSON编辑器、文本处理工具、数组插入工具以及权重更新工具。无论您是需要进行批量文本处理，还是需要进行JSON编辑和转换，都能帮助您快速完成任务。"
        />
        <meta name="keywords" content="批量文本处理，正则匹配工具，JSON键值替换，JSON编辑器，文本处理工具，数组插入工具，权重更新工具" />
      </Head>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <Title level={2}>Flare 书签解析工具</Title>
        <Paragraph>用于将书签数据转换为 Flare 的格式。您可以选择“App”模式以解析应用列表，或“Bookmark”模式以解析书签列表，并可实现 app 和 bookmarks 间的互相转换。</Paragraph>

        <Radio.Group value={rule} onChange={(e) => setRule(e.target.value)} style={{ marginBottom: "10px" }}>
          <Radio.Button value="app">App</Radio.Button>
          <Radio.Button value="bookmark">Bookmark</Radio.Button>
        </Radio.Group>

        <Input placeholder="指定 bookmarks 内的 category ID" value={categoryId} onChange={handleCategoryIdChange} style={{ marginBottom: "10px" }} />

        <Row gutter={16}>
          <Col span={12}>
            <TextArea rows={6} value={inputData} onChange={handleInputChange} placeholder="在此粘贴源码" />
            <Button type="text" onClick={parseFlareData} style={{ margin: "10px 0" }}>
              解析数据
            </Button>
            <Button type="text" onClick={convertToBookmark} style={{ margin: "10px 0" }} disabled={currentFormat !== "app"}>
              转换为 Bookmark 格式
            </Button>
            <Button type="text" onClick={convertToApp} style={{ margin: "10px 0" }} disabled={currentFormat !== "bookmark"}>
              转换为 App 格式
            </Button>
          </Col>
          <Col span={12}>
            <Text type="secondary">输出结果：</Text>
            <TextArea rows={10} value={outputData} readOnly />
            <CopyToClipboard text={outputData} onCopy={() => message.success("结果已复制到剪贴板")}>
              <Button type="text" icon={<CopyOutlined />} style={{ margin: "10px 0" }}>
                复制结果
              </Button>
            </CopyToClipboard>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FlareDataPage;
