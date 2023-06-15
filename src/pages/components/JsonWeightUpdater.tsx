import { useState } from 'react';
import { Input, Button, Typography, message, Row, Col } from 'antd';

const JsonWeightUpdater = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [countJson, setCountJson] = useState('');
  const [result, setResult] = useState('');

  const handleUpdate = () => {
    try {
      const originalData = JSON.parse(jsonInput);
      const countData = JSON.parse(countJson);

      const countDataMap = new Map(
        countData.map(({ card_id, count }) => [card_id, count])
      );

      const updatedData = originalData.map((item) => {
        if (
          item.title &&
          (item.title.includes("AI DAN") ||
            item.title.includes("DAN 10.0") ||
            item.title.includes("DAN 11.0") ||
            item.title.includes("无限制的 ChatGPT") ||
            item.title.includes("失效"))
        ) {
          return { ...item, weight: 0 };
        }
        if (countDataMap.has(item.id.toString())) {
          return { ...item, weight: countDataMap.get(item.id.toString()) };
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
      type="secondary"
      style={{ fontSize: "14px", marginBottom: "20px" }}
    >
      请在输入框中输入原始 JSON 数据和计数 JSON 数据，然后点击“匹配”按钮。工具会根据计数数据中的「card_id」与原始数据中的「id」匹配，并更新原始数据中的「weight」值。处理成功后，页面会显示处理后的内容，并在“匹配结果框”中显示结果。用户可以根据需要点击“复制结果”按钮，将结果复制到剪贴板。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input.TextArea placeholder="输入原始JSON数据" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} rows={5} />
        </Col>
        <Col xs={24} md={12}>
          <Input.TextArea placeholder="输入计数JSON数据" value={countJson} onChange={(e) => setCountJson(e.target.value)} rows={3} />
          <Button onClick={handleUpdate} style={{ marginRight: "10px", marginTop: "10px" }}>更新</Button>
          <Button onClick={handleCopy} style={{ marginTop: "10px" }}>复制结果</Button>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <Col span={24}>
          <Input.TextArea placeholder="更新结果" value={result} readOnly rows={10} />
        </Col>
      </Row>
    </>
  );
};

export default JsonWeightUpdater;
