"use client";

import { useState } from "react";
import { Input, Button, Typography, Row, Col, message, Form } from "antd";
import { JSONPath } from "jsonpath-plus";
import { preprocessJson } from "@/app/components/preprocessJson";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;

const ClientPage = () => {
  const [result, setResult] = useState("");

  const processNode = (node, prefixText, suffixText, jsonObject) => {
    if (!node) return "";
    let formattedText = "";
    JSONPath({ path: `$..${node}`, json: jsonObject }).forEach((value) => {
      formattedText += `${prefixText.replace("{value}", value)}${value}${suffixText.replace("{value}", value)}\n`;
    });
    return formattedText;
  };

  const handleProcess = (values) => {
    const { jsonInput, node1, prefixText1, suffixText1, node2, prefixText2, suffixText2 } = values;

    try {
      if (!jsonInput) throw new Error("请输入 JSON 数据");
      if (!node1 && !node2) throw new Error("请至少输入一个节点");

      let jsonObject;
      try {
        jsonObject = preprocessJson(jsonInput);
      } catch (error) {
        message.error("JSON 输入格式错误或无法处理");
        return;
      }

      const result1 = processNode(node1, prefixText1, suffixText1, jsonObject);
      const result2 = processNode(node2, prefixText2, suffixText2, jsonObject);

      const result = result1 + result2;

      if (!result) throw new Error("在 JSON 数据中找不到指定的节点");

      setResult(result);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <Title level={2}>JSON 值提取工具</Title>
      <Paragraph type="secondary">
        根据输入的节点名称在 JSON 中找到相应的节点，并对节点的值进行处理，添加前缀和后缀。如果找到多个节点，将它们的值以换行形式拼接在一起。如果没有指定前缀和后缀，则只提取对应节点的值。
      </Paragraph>
      <Form onFinish={handleProcess} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="jsonInput" rules={[{ required: true, message: "请输入 JSON 数据" }]} style={{ marginBottom: 8 }}>
              <Input.TextArea placeholder="输入JSON数据" rows={12} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="node1" style={{ marginBottom: 8 }}>
              <Input placeholder="🔍节点1" />
            </Form.Item>
            <Form.Item name="prefixText1" style={{ marginBottom: 8 }}>
              <Input placeholder="前缀文本1" />
            </Form.Item>
            <Form.Item name="suffixText1" style={{ marginBottom: 8 }}>
              <Input placeholder="后缀文本1" />
            </Form.Item>
            <Form.Item name="node2" style={{ marginBottom: 8 }}>
              <Input placeholder="🔍节点2" />
            </Form.Item>
            <Form.Item name="prefixText2" style={{ marginBottom: 8 }}>
              <Input placeholder="前缀文本2" />
            </Form.Item>
            <Form.Item name="suffixText2" style={{ marginBottom: 8 }}>
              <Input placeholder="后缀文本2" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Button type="primary" htmlType="submit">
                处理
              </Button>
              <Button onClick={() => copyToClipboard(result)} style={{ marginLeft: "10px" }}>
                复制结果
              </Button>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Input.TextArea placeholder="处理结果" rows={10} value={result} readOnly />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ClientPage;
