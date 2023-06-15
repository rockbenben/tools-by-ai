import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Button,
  Form,
  Typography,
  Input,
  message,
  Card,
} from "antd";
import JSONPath from "jsonpath";
import KeyMappingInput from "./KeyMappingInput";
const { Title } = Typography;

const JsonEdit = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});
  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [keyMappings, setKeyMappings] = useState<
    Array<{ inputKey: string; outputKey: string }>
  >([{ inputKey: "", outputKey: "" }]);

  const applyPrefixSuffix = (value) => {
    let newValue = value;
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
      jsonObject = JSON.parse(jsonInput);
    } catch (error) {
      message.error("JSON Input 格式错误");
      return;
    }

    const transformations = keyMappings.map((mapping) => {
      if (!mapping.inputKey || !mapping.outputKey) {
        return;
      }
      const inputNodes = JSONPath.nodes(jsonObject, `$..${mapping.inputKey}`);
      const outputNodes = JSONPath.nodes(jsonObject, `$..${mapping.outputKey}`);

      if (inputNodes.length === 0) {
        message.error(`输入键 ${mapping.inputKey} 在 JSON 中找不到`);
        return;
      }
      if (outputNodes.length === 0) {
        message.error(`输出键 ${mapping.outputKey} 在 JSON 中找不到`);
        return;
      }

      inputNodes.forEach((node, index) => {
        JSONPath.apply(
          jsonObject,
          JSONPath.stringify(outputNodes[index].path),
          () => applyPrefixSuffix(node.value)
        );
      });
    });

    // 等待所有的键映射完成
    Promise.all(transformations).then(() => {
      setJsonOutput(JSON.stringify(jsonObject, null, 2));
    });
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
      <Typography.Paragraph
        type="secondary"
        style={{ fontSize: "14px", marginBottom: "20px" }}
      >
        将输入 JSON
        中的输出节点的值设为输入节点的值。此外，你可以为所有输出键添加前缀或后缀。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <KeyMappingInput
              keyMappings={keyMappings}
              setKeyMappings={setKeyMappings}
            />

            <Form.Item label="Prefix">
              <Input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Enter a prefix to add to all output keys"
              />
            </Form.Item>
            <Form.Item label="Suffix">
              <Input
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Enter a suffix to add to all output keys"
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
