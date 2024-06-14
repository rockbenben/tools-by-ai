"use client";

import { useState, useEffect } from "react";
import { Input, Button, Typography, message, Row, Col, Space, Form } from "antd";
import { CopyOutlined, NodeIndexOutlined } from "@ant-design/icons";
import { preprocessJson } from "@/app/components/preprocessJson";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;

const ClientPage = () => {
  const [form] = Form.useForm();
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    form.setFieldsValue({ jsonInput });
  }, [jsonInput, form]);

  const handleInsert = (values) => {
    const { jsonInput, node1, insertNode } = values;
    try {
      if (!jsonInput) throw new Error("请先输入 JSON 数据");
      if (!node1) throw new Error("请输入要插入位置的节点名称");
      if (!insertNode) throw new Error("请输入要插入的新节点名称");

      let jsonObject;
      try {
        jsonObject = preprocessJson(jsonInput);
      } catch (error) {
        message.error("JSON Input 格式错误或无法处理");
        return;
      }

      const insertNodes = insertNode.split(/[，,]/); // Split by Chinese and English comma

      let node1Found = false;

      const processNode = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map((item) => processNode(item));
        } else if (typeof obj === "object" && obj !== null) {
          let entries = Object.entries(obj);
          for (let i = 0; i < entries.length; i++) {
            let [key, value] = entries[i];
            if (key === node1) {
              node1Found = true;
              // Insert multiple keys after the found key
              for (let j = insertNodes.length - 1; j >= 0; j--) {
                entries.splice(i + 1, 0, [insertNodes[j], ""]);
              }
            }
            entries[i][1] = processNode(value); // Recurse into the value
          }
          return Object.fromEntries(entries); // Convert back to an object
        } else {
          return obj; // Not an object or array, return the value as is
        }
      };

      jsonObject = processNode(jsonObject);

      if (!node1Found) throw new Error("找不到指定的节点名称");

      const result = JSON.stringify(jsonObject, null, 2);

      setResult(result);
      message.success(`处理成功，共处理了${Object.keys(jsonObject).length}个条目。`);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <Title level={3}>
        <NodeIndexOutlined /> JSON 节点插入工具
      </Title>
      <Paragraph type="secondary">
        请在输入框中输入 JSON 格式的数据，然后点击“插入”按钮。工具会在 JSON
        数据中查找数组类型的节点，并在指定节点后插入新的指定节点（支持多个，用逗号分割）。插入成功后，页面会显示处理后的内容，并在“插入结果”框中显示结果。用户可以根据需要点击“复制结果”按钮，将结果复制到剪贴板。
      </Paragraph>
      <Form form={form} layout="vertical" onFinish={handleInsert}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="jsonInput" rules={[{ required: true, message: "请输入 JSON 数据" }]} style={{ marginBottom: 8 }}>
              <Input.TextArea placeholder="输入JSON数据" rows={5} onChange={(e) => setJsonInput(e.target.value)} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="node1" rules={[{ required: true, message: "请输入要插入位置的节点名称" }]} style={{ marginBottom: 8 }}>
              <Input placeholder="输入要插入位置的节点名称" />
            </Form.Item>
            <Form.Item name="insertNode" rules={[{ required: true, message: "请输入要插入的新节点名称" }]} style={{ marginBottom: 8 }}>
              <Input placeholder="输入要插入的新节点名称，可以输入多个节点，用逗号分隔。" />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                插入
              </Button>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(result)}>
                复制结果
              </Button>
            </Space>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Input.TextArea placeholder="插入结果" rows={10} value={result} readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ClientPage;
