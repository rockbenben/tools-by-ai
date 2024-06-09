"use client";

import React, { useState, useCallback } from "react";
import { Row, Col, Button, Form, Input, message, Typography, Card, Space, Checkbox, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { JSONPath } from "jsonpath-plus";
import { preprocessJson } from "@/app/components/preprocessJson";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;

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

const ClientPage = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [jsonPath, setJsonPath] = useState("");
  const [isVariableReplace, setIsVariableReplace] = useState(false);

  const handleInputChange = useCallback((setter) => (e) => setter(e.target.value), []);

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

  const handleEdit = useCallback(() => {
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
          for (let i = 1; i < nodePathArray.length - 1; i++) {
            currentNode = currentNode[nodePathArray[i]];
          }
          currentNode[nodePathArray[nodePathArray.length - 1]] = applyPrefixSuffix(node.value, nodePathArray.join("."));
        }
      });
    });

    setJsonOutput(JSON.stringify(jsonObject, null, 2));
  }, [jsonInput, jsonPath, findText, replaceText, prefix, suffix, isVariableReplace]);

  return (
    <>
      <Title level={2}>JSON 节点批量编辑</Title>
      <Paragraph type="secondary">
        在 JSON
        中查找节点并编辑它们的值，你可以为找到的节点的值添加前缀、后缀或进行替换操作。节点的查找支持批量操作，可以使用逗号来分割节点。请注意，本工具只支持第一层的子键，不支持嵌套子键内的键名互换。
      </Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <Form.Item label="🔍JSON节点">
              <Input value={jsonPath} onChange={handleInputChange(setJsonPath)} placeholder="Enter the JSONPaths, separated by commas" />
            </Form.Item>
            <Form.Item label="添加前缀">
              <Input value={prefix} onChange={handleInputChange(setPrefix)} placeholder="Enter a prefix to add to all output keys" />
            </Form.Item>
            <Form.Item label="添加后缀">
              <Input value={suffix} onChange={handleInputChange(setSuffix)} placeholder="Enter a suffix to add to all output keys" />
            </Form.Item>
            <Space>
              <Form.Item label="查找文本">
                <Input value={findText} onChange={handleInputChange(setFindText)} placeholder="Find in the JSON node" />
              </Form.Item>
              <Form.Item label="替换文本">
                <Input value={replaceText} onChange={handleInputChange(setReplaceText)} placeholder="Replace the found text" />
              </Form.Item>
              <Tooltip title="根据当前节点的语言代码（如 zh、en、ja 等），将找到的文本替换为对应语言的名称。例如，en 节点会将指定文本替换为 English，zh 节点则替换为 Chinese。">
                <Checkbox checked={isVariableReplace} onChange={(e) => setIsVariableReplace(e.target.checked)}>
                  多语言变量替换
                </Checkbox>
              </Tooltip>
            </Space>
            <Form.Item>
              <Input.TextArea placeholder="JSON Input" value={jsonInput} onChange={handleInputChange(setJsonInput)} rows={10} />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="结果区">
            <Button onClick={handleEdit} style={{ marginBottom: "16px" }}>
              编辑 JSON
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(jsonOutput)} style={{ marginLeft: "16px", marginBottom: "16px" }}>
              复制结果
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

export default ClientPage;
