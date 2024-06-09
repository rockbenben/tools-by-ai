"use client";

import React, { useState } from "react";
import { Flex, Input, Typography, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { preprocessJson } from "@/app/components/preprocessJson";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;

const ClientPage = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [swappedJson, setSwappedJson] = useState("");

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const swapValues = () => {
    try {
      let json = preprocessJson(jsonInput);
      if (!Array.isArray(json)) throw new Error("NotAnArrayError");

      setJsonInput(JSON.stringify(json, null, 2));

      const swappedArray = json.map((obj) => {
        if (obj[key1] === undefined || obj[key2] === undefined) throw new Error("KeyNotFoundError");
        return { ...obj, [key1]: obj[key2], [key2]: obj[key1] };
      });

      setSwappedJson(JSON.stringify(swappedArray, null, 2));
    } catch (error) {
      switch (error.message) {
        case "KeyNotFoundError":
          message.error("指定的键名在 JSON 数据中未找到。");
          break;
        case "NotAnArrayError":
          message.error("处理后的结果不是一个数组。");
          break;
        default:
          message.error("提供的字符串不是有效的 JSON 格式或无法处理。");
      }
    }
  };

  return (
    <>
      <Title level={2}>JSON 键值互换工具</Title>
      <Paragraph type="secondary">输入 JSON 数据并指定两个键名，本工具将在整个 JSON 数组中互换这两个键的值。请注意，本工具只支持第一层的子键，不支持嵌套子键内的键名互换。</Paragraph>
      <Flex gap="small" vertical>
        <Input.TextArea rows={10} value={jsonInput} onChange={handleInputChange(setJsonInput)} placeholder="请输入 JSON 数据" />
        <Flex gap="small">
          <Input placeholder="键名1" value={key1} onChange={handleInputChange(setKey1)} />
          <Input placeholder="键名2" value={key2} onChange={handleInputChange(setKey2)} />
        </Flex>
        <Flex gap="small">
          <Button type="primary" onClick={swapValues}>
            互换键值
          </Button>
          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(swappedJson)}>
            复制结果
          </Button>
        </Flex>
      </Flex>
      <pre>{swappedJson}</pre>
    </>
  );
};

export default ClientPage;
