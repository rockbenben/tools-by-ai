import React, { useState } from "react";
import { Row, Col, Button, Form, Input, message, Card } from "antd";
import JSONPath from "jsonpath";

const JsonEdit = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});
  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [insertText, setInsertText] = useState<string>("");
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");

  const [jsonPath, setJsonPath] = useState<string>("");

  const applyPrefixSuffix = (value) => {
    let newValue = value;
    if (findText) newValue = newValue.replaceAll(findText, replaceText);
    if (prefix) newValue = prefix + newValue;
    if (suffix) newValue = newValue + suffix;

    // Insert the text into the penultimate sentence
    if (insertText) {
      let sentences = newValue.split(". ");
      if (sentences.length > 1) {
        sentences.splice(sentences.length - 1, 0, insertText);
        newValue = sentences.join(". ");
      }
    }

    return newValue;
  };

  const handleEdit = () => {
    if (!jsonInput) {
      message.error("JSON Input 不能为空");
      return;
    }

    let jsonObject;
    try {
      jsonObject = JSON.parse(jsonInput);
    } catch (error) {
      message.error("JSON Input 格式错误");
      return;
    }

    const paths = jsonPath.split(/,|，/);

    paths.forEach((path) => {
      if (!path) return;

      const nodes = JSONPath.nodes(jsonObject, `$..${path}`);

      if (nodes.length === 0) {
        message.error(`在 JSON 中找不到路径 ${path}`);
        return;
      }

      nodes.forEach((node) => {
        JSONPath.apply(jsonObject, JSONPath.stringify(node.path), () =>
          applyPrefixSuffix(node.value)
        );
      });
    });

    setJsonOutput(JSON.stringify(jsonObject, null, 2));
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(jsonOutput).then(
      () => {
        message.success("结果已复制到剪贴板");
      },
      (err) => {
        message.error("无法复制结果，请手动复制");
      }
    );
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <Form.Item label="JSONPath">
              <Input
                value={jsonPath}
                onChange={(e) => setJsonPath(e.target.value)}
                placeholder="Enter the JSONPaths, separated by commas"
              />
            </Form.Item>

            <Form.Item label="Prefix">
              <Input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Enter a prefix to add to all output keys"
              />
            </Form.Item>
            <Form.Item label="Insert Text">
              <Input
                value={insertText}
                onChange={(e) => setInsertText(e.target.value)}
                placeholder="Enter a text to insert into output value"
              />
            </Form.Item>

            <Form.Item label="Suffix">
              <Input
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Enter a suffix to add to all output keys"
              />
            </Form.Item>
            <Form.Item label="Find Text">
              <Input
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Enter a text to find in the JSON node"
              />
            </Form.Item>
            <Form.Item label="Replace Text">
              <Input
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Enter a text to replace the found text"
              />
            </Form.Item>
            <Form.Item>
              <Input.TextArea
                placeholder="JSON Input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="结果区">
            <Button onClick={handleEdit} style={{ marginBottom: "16px" }}>
              Edit Json
            </Button>
            <Button
              onClick={handleCopyResult}
              style={{ marginLeft: "16px", marginBottom: "16px" }}
            >
              Copy Result
            </Button>
            <Form.Item>
              <Input.TextArea
                placeholder="JSON Output"
                value={jsonOutput}
                rows={10}
                readOnly
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default JsonEdit;
