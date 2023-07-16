import React, { useState } from "react";
import { Row, Col, Button, Form, Typography, Input, message, Card } from "antd";
import JSONPath from "jsonpath";
import KeyMappingInput from "./KeyMappingInput";

const JsonValueTransformer = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});

  const [keyMappings, setKeyMappings] = useState<
    Array<{ inputKey: string; outputKey: string }>
  >([{ inputKey: "", outputKey: "" }]);

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
        message.error('输入键或输出键不能为空');
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
          () => node.value
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
      <Typography.Paragraph type='secondary' style={{ fontSize: "14px" }}>
        通过键映射（key mapping）来修改 JSON
        数据。用户可以输入一对键（输入键和输出键），该工具会查找 JSON
        数据中的输入键位置，然后将对应位置的值替换为输出键位置的值。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title='输入区'>
            <KeyMappingInput
              keyMappings={keyMappings}
              setKeyMappings={setKeyMappings}
            />
            <Form.Item>
              <Input.TextArea
                placeholder='JSON Input'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='结果区'>
            <Button onClick={handleEdit} style={{ marginBottom: "16px" }}>
              Edit Json
            </Button>
            <Button
              onClick={handleCopyResult}
              style={{ marginLeft: "16px", marginBottom: "16px" }}>
              Copy Result
            </Button>
            <Form.Item>
              <Input.TextArea
                placeholder='JSON Output'
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

export default JsonValueTransformer;
