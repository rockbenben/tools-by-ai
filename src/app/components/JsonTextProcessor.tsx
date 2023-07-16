import { useState } from "react";
import { Input, Button, Typography, Row, Col, message } from "antd";
import { JSONPath } from "jsonpath-plus";

const JsonTextProcessor = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState("");
  const [node1, setNode1] = useState("");
  const [node2, setNode2] = useState("");
  const [prefixText1, setPrefixText1] = useState("");
  const [prefixText2, setPrefixText2] = useState("");
  const [suffixText1, setSuffixText1] = useState("");
  const [suffixText2, setSuffixText2] = useState("");

  const processNode = (node, prefixText, suffixText, jsonObject) => {
    if (!node) return "";
    let formattedText = "";
    JSONPath({ path: `$..${node}`, json: jsonObject }).forEach((value) => {
      formattedText += `${prefixText.replace(
        "{value}",
        value
      )}${value}${suffixText.replace("{value}", value)}\n`;
    });
    return formattedText;
  };

  const handleProcess = () => {
    try {
      if (!jsonInput) throw new Error("请输入 JSON 数据");
      if (!node1 && !node2) throw new Error("请至少输入一个节点");

      const jsonObject = JSON.parse(jsonInput);

      const result1 = processNode(node1, prefixText1, suffixText1, jsonObject);
      const result2 = processNode(node2, prefixText2, suffixText2, jsonObject);

      const result = result1 + result2;

      if (!result) throw new Error("在 JSON 数据中找不到指定的节点");

      setResult(result);
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      message.success("复制成功！");
    });
  };

  return (
    <>
      <Typography.Paragraph
        type='secondary'
        style={{ fontSize: "14px", marginBottom: "20px" }}>
        根据输入的节点名称在 JSON
        中找到相应的节点，并对节点的值进行处理，添加前缀和后缀。如果找到多个节点，将它们的值以换行形式拼接在一起。如果没有指定前缀和后缀，则只提取对应节点的值。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input.TextArea
            placeholder='输入JSON数据'
            value={jsonInput}
            rows={12}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Input
            placeholder='🔍节点1'
            value={node1}
            onChange={(e) => setNode1(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder='前缀文本1'
            value={prefixText1}
            onChange={(e) => setPrefixText1(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder='后缀文本1'
            value={suffixText1}
            onChange={(e) => setSuffixText1(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder='🔍节点2'
            value={node2}
            onChange={(e) => setNode2(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder='前缀文本2'
            value={prefixText2}
            onChange={(e) => setPrefixText2(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder='后缀文本2'
            value={suffixText2}
            onChange={(e) => setSuffixText2(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button onClick={handleProcess}>处理</Button>
          <Button onClick={handleCopy} style={{ marginLeft: "10px" }}>
            复制结果
          </Button>
        </Col>
        <Col xs={24}>
          <Input.TextArea
            placeholder='处理结果'
            rows={10}
            value={result}
            readOnly
          />
        </Col>
      </Row>
    </>
  );
};

export default JsonTextProcessor;
