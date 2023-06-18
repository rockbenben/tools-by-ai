import { useState } from "react";
import Head from "next/head";
import { Typography, Layout, Radio } from "antd";
import RegexMatcher from "./components/RegexMatcher";
import JsonTextProcessor from "./components/JsonTextProcessor";
import JsonArrayInserter from "./components/JsonArrayInserter";
import JsonWeightUpdater from "./components/JsonWeightUpdater";
import JsonValueTransformer from "./components/JsonValueTransformer";
import JsonEdit from "./components/JsonEdit";

const { Title } = Typography;
const TextProcessingTool = () => {
  const [selectedTool, setSelectedTool] = useState("regex");

  const renderTool = () => {
    switch (selectedTool) {
      case "regex":
        return <RegexMatcher />;
      case "JsonValueTransformer":
        return <JsonValueTransformer />;
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
      <Head>
        <title>批量文本处理 - 正则匹配、JSON 编辑与转换|Tools by AI</title>
        <meta
          name="description"
          content="提供了多种实用工具，包括正则匹配工具、JSON键值替换、JSON编辑器、文本处理工具、数组插入工具以及权重更新工具。无论您是需要进行批量文本处理，还是需要进行JSON编辑和转换，都能帮助您快速完成任务。"
        />
        <meta
          name="keywords"
          content="批量文本处理，正则匹配工具，JSON键值替换，JSON编辑器，文本处理工具，数组插入工具，权重更新工具"
        />
      </Head>
      <Layout.Content
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}
      >
        <Title level={3} style={{ marginBottom: "24px" }}>
          批量文本处理
        </Title>
        <Radio.Group
          onChange={onChange}
          value={selectedTool}
          style={{ marginBottom: "16px" }}
        >
          <Radio value="regex">正则匹配工具</Radio>
          <Radio value="JsonValueTransformer">JSON 键值替换</Radio>
          <Radio value="JsonEdit">JSON Editor</Radio>
          <Radio value="textProcessor">文本处理工具</Radio>
          <Radio value="arrayInserter">数组插入工具</Radio>
          <Radio value="weightUpdater">权重更新工具</Radio>
        </Radio.Group>
        {renderTool()}
      </Layout.Content>
    </>
  );
};

export default TextProcessingTool;
