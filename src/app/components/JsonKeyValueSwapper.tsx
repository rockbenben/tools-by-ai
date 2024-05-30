import React, { useState } from "react";
import { Flex, Input, Typography, Button, message } from "antd";
import { preprocessJson } from "./preprocessJson";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const JsonKeyValueSwapper = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [swappedJson, setSwappedJson] = useState("");

  const handleJsonInputChange = (e) => setJsonInput(e.target.value);
  const handleKey1Change = (e) => setKey1(e.target.value);
  const handleKey2Change = (e) => setKey2(e.target.value);

  const swapValues = () => {
    try {
      let json = preprocessJson(jsonInput);
      // 确保处理后的结果是一个数组
      if (!Array.isArray(json)) {
        throw new Error("NotAnArrayError");
      }
      setJsonInput(JSON.stringify(json, null, 2));

      const swappedArray = json.map((obj) => {
        if (obj.hasOwnProperty(key1) && obj.hasOwnProperty(key2)) {
          let temp = obj[key1];
          obj[key1] = obj[key2];
          obj[key2] = temp;
        } else {
          throw new Error("KeyNotFoundError");
        }
        return obj;
      });

      setSwappedJson(JSON.stringify(swappedArray, null, 2));
    } catch (error) {
      if (error.message === "KeyNotFoundError") {
        message.error("指定的键名在 JSON 数据中未找到。");
      } else if (error.message === "NotAnArrayError") {
        message.error("处理后的结果不是一个数组。");
      } else {
        message.error("提供的字符串不是有效的 JSON 格式或无法处理。");
      }
    }
  };

  return (
    <Flex gap="small" vertical>
      <Typography.Paragraph>输入 JSON 数据并指定两个键名，本工具将在整个 JSON 数组中互换这两个键的值。</Typography.Paragraph>
      <Input.TextArea rows={10} value={jsonInput} onChange={handleJsonInputChange} placeholder="请输入 JSON 数据" />
      <Flex gap="small">
        <Input placeholder="键名1" value={key1} onChange={handleKey1Change} />
        <Input placeholder="键名2" value={key2} onChange={handleKey2Change} />
      </Flex>
      <Flex gap="small">
        <Button type="primary" onClick={swapValues}>
          互换键值
        </Button>
        <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(swappedJson)}>
          复制结果
        </Button>
      </Flex>
      <pre>{swappedJson}</pre>
    </Flex>
  );
};

export default JsonKeyValueSwapper;
