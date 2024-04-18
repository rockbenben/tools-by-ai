"use client";

import { useState } from "react";
import { Typography, Radio } from "antd";
import RegexMatcher from "./components/RegexMatcher";
import JsonTextProcessor from "./components/JsonTextProcessor";
import JsonArrayInserter from "./components/JsonArrayInserter";
import JsonWeightUpdater from "./components/JsonWeightUpdater";
import JsonValueTransformer from "./components/JsonValueTransformer";
import JsonEdit from "./components/JsonEdit";
import JsonKeyValueSwapper from "./components/JsonKeyValueSwapper";

const { Title } = Typography;
const TextProcessingTool = () => {
  const [selectedTool, setSelectedTool] = useState("regex");

  const renderTool = () => {
    switch (selectedTool) {
      case "regex":
        return <RegexMatcher />;
      case "JsonValueTransformer":
        return <JsonValueTransformer />;
      case "JsonKeyValueSwapper":
        return <JsonKeyValueSwapper />;
      case "JsonEdit":
        return <JsonEdit />;
      case "textProcessor":
        return <JsonTextProcessor />;
      case "arrayInserter":
        return <JsonArrayInserter />;
      case "weightUpdater":
        return <JsonWeightUpdater />;
      default:
        return null;
    }
  };

  const onChange = (e) => {
    setSelectedTool(e.target.value);
  };

  return (
    <>
      <Title level={3} style={{ marginBottom: "24px" }}>
        批量文本处理
      </Title>
      <Radio.Group onChange={onChange} value={selectedTool} style={{ marginBottom: "16px" }}>
        <Radio value="regex">正则匹配工具</Radio>
        <Radio value="JsonValueTransformer">JSON 键值替换</Radio>
        <Radio value="JsonKeyValueSwapper">JSON 键值交换</Radio>
        <Radio value="JsonEdit">JSON Editor</Radio>
        <Radio value="textProcessor">JSON 值提取</Radio>
        <Radio value="arrayInserter">数组插入工具</Radio>
        <Radio value="weightUpdater">权重更新工具</Radio>
      </Radio.Group>
      {renderTool()}
    </>
  );
};

export default TextProcessingTool;
