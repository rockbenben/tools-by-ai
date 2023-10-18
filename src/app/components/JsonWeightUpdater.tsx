import { useState } from "react";
import { Input, Button, Typography, message, Row, Col, Space } from "antd";

const JsonWeightUpdater = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [countJson, setCountJson] = useState("");
  const [result, setResult] = useState("");

  // 新增的 state
  const [idField, setIdField] = useState("id");
  const [weightField, setWeightField] = useState("weight");
  const [cardIdField, setCardIdField] = useState("card_id");
  const [countField, setCountField] = useState("count");

  const handleUpdate = () => {
    try {
      const originalData = JSON.parse(jsonInput);
      const countData = JSON.parse(countJson);

      const countDataMap = new Map(
        countData.map((item) => [
          item[cardIdField].toString(),
          item[countField],
        ])
      );

      const updatedData = originalData.map((item) => {
        if (item.zh.title && item.zh.title.includes("失效")) {
          return { ...item, [weightField]: 0 };
        }

        if (countDataMap.has(item[idField].toString())) {
          const updatedItem = {
            ...item,
            [weightField]: countDataMap.get(item[idField].toString()),
          };
          return updatedItem;
        }
        return item;
      });

      const result = JSON.stringify(updatedData, null, 2);
      setResult(result);
      message.success(`处理成功，共更新了${countData.length}个条目。`);
    } catch (error) {
      message.error("无法解析输入的 JSON 数据，请检查格式是否正确。");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      message.success("结果已复制到剪贴板。");
    });
  };

  return (
    <>
      <Typography.Paragraph
        type='secondary'
        style={{ fontSize: "14px", marginBottom: "20px" }}>
        请在输入框中输入原始 JSON 数据和计数 JSON
        数据，然后点击“匹配”按钮。工具会根据计数数据中的「card_id」与原始数据中的「id」匹配，并将对应计数数据的「count」值更新到原始数据中的「weight」值。处理成功后，页面会显示处理后的内容，并在“匹配结果框”中显示结果。用户可以根据需要点击“复制结果”按钮，将结果复制到剪贴板。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input.TextArea
            placeholder='输入原始JSON数据'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={3}
          />
          <Input.TextArea
            placeholder='输入计数JSON数据'
            value={countJson}
            onChange={(e) => setCountJson(e.target.value)}
            rows={2}
            style={{ marginTop: "5px" }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Space style={{ display: "flex", marginBottom: 8 }} align='baseline'>
            匹配键名：
            <Input
              placeholder='原始数据 ID 字段名'
              value={idField}
              onChange={(e) => setIdField(e.target.value)}
            />
            <Input
              placeholder='计数数据 card_id 字段名'
              value={cardIdField}
              onChange={(e) => setCardIdField(e.target.value)}
              style={{ marginTop: "5px" }}
            />
          </Space>
          <Space style={{ display: "flex", marginBottom: 8 }} align='baseline'>
            更新键名：
            <Input
              placeholder='原始数据 weight 字段名'
              value={weightField}
              onChange={(e) => setWeightField(e.target.value)}
            />
            <Input
              placeholder='计数数据 count 字段名'
              value={countField}
              onChange={(e) => setCountField(e.target.value)}
            />
          </Space>
          <Button onClick={handleUpdate} style={{ marginRight: "10px" }}>
            更新
          </Button>
          <Button onClick={handleCopy}>复制结果</Button>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <Col span={24}>
          <Input.TextArea
            placeholder='更新结果'
            value={result}
            readOnly
            rows={10}
          />
        </Col>
      </Row>
    </>
  );
};

export default JsonWeightUpdater;
