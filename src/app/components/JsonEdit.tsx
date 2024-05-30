import React, { useState } from "react";
import { Row, Col, Button, Form, Input, message, Typography, Card, Space, Checkbox } from "antd";
import { JSONPath } from "jsonpath-plus";
import { preprocessJson } from "@/app/components/preprocessJson";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const JsonEdit = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});
  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");

  const [jsonPath, setJsonPath] = useState<string>("");
  const [isVariableReplace, setIsVariableReplace] = useState(false);

  const languages = {
    zh: "Chinese",
    en: "English",
    ja: "Japanese",
    ko: "Korean",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ru: "Russian",
    pt: "Portuguese",
    hi: "Hindi",
    ar: "Arabic",
    bn: "Bengali",
  };

  const applyPrefixSuffix = (value, path) => {
    let newValue = value;

    if (isVariableReplace) {
      const matchedLang = Object.keys(languages).find((lang) => path.includes(lang));
      if (matchedLang) {
        newValue = newValue.replaceAll(findText, languages[matchedLang]);
      }
    } else if (findText) {
      newValue = newValue.replaceAll(findText, replaceText);
    }

    if (prefix) newValue = prefix + newValue;
    if (suffix) newValue = newValue + suffix;

    return newValue;
  };

  const handleEdit = () => {
    if (!jsonInput) {
      message.error("JSON Input 不能为空");
      return;
    }

    let jsonObject;
    try {
      jsonObject = preprocessJson(jsonInput);
    } catch (error) {
      message.error("JSON Input 格式错误或无法处理");
      return;
    }

    const paths = jsonPath.split(/,|，/);

    paths.forEach((path) => {
      if (!path) return;

      const nodes = JSONPath({ path: `$..${path}`, json: jsonObject, resultType: "all" });

      if (nodes.length === 0) {
        message.error(`在 JSON 中找不到路径 ${path}`);
        return;
      }

      nodes.forEach((node) => {
        let nodePathArray = JSONPath.toPathArray(node.path);
        if (nodePathArray && nodePathArray.length > 0) {
          let currentNode = jsonObject;
          // 遍历路径数组，直到到达倒数第二个元素
          for (let i = 1; i < nodePathArray.length - 1; i++) {
            currentNode = currentNode[nodePathArray[i]];
          }
          // 应用 applyPrefixSuffix 函数并更新值
          currentNode[nodePathArray[nodePathArray.length - 1]] = applyPrefixSuffix(node.value, nodePathArray.join("."));
        }
      });
    });

    setJsonOutput(JSON.stringify(jsonObject, null, 2));
  };

  return (
    <>
      <Typography.Paragraph type="secondary" style={{ fontSize: "14px" }}>
        在 JSON 中查找节点并编辑它们的值，你可以为找到的节点的值添加前缀、后缀或进行替换操作。节点的查找支持批量操作，可以使用逗号来分割节点。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <Form.Item label="🔍JSON节点">
              <Input value={jsonPath} onChange={(e) => setJsonPath(e.target.value)} placeholder="Enter the JSONPaths, separated by commas" />
            </Form.Item>
            <Form.Item label="添加前缀">
              <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Enter a prefix to add to all output keys" />
            </Form.Item>
            <Form.Item label="添加后缀">
              <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="Enter a suffix to add to all output keys" />
            </Form.Item>
            <Space style={{ display: "flex", marginBottom: 8 }} align="baseline">
              <Form.Item label="查找文本">
                <Input value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Find in the JSON node" />
              </Form.Item>
              <Form.Item label="替换文本">
                <Input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replace the found text" />
              </Form.Item>
              <Form.Item>
                <Checkbox checked={isVariableReplace} onChange={(e) => setIsVariableReplace(e.target.checked)}>
                  变量替换
                </Checkbox>
              </Form.Item>
            </Space>
            <Form.Item>
              <Input.TextArea placeholder="JSON Input" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} rows={10} />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="结果区">
            <Button onClick={handleEdit} style={{ marginBottom: "16px" }}>
              Edit JSON
            </Button>
            <Button onClick={() => copyToClipboard(jsonOutput)} style={{ marginLeft: "16px", marginBottom: "16px" }}>
              Copy Result
            </Button>
            <Form.Item>
              <Input.TextArea placeholder="JSON Output" value={jsonOutput} rows={10} readOnly />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default JsonEdit;
