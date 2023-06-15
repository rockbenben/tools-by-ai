import { useState } from "react";
import { Input, Button, Typography, Row, Col, message } from "antd";
import JSONPath from "jsonpath";

const JsonTextProcessor = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState("");
  const [node1, setNode1] = useState("");
  const [node2, setNode2] = useState("");
  const [prefixText1, setPrefixText1] = useState("");
  const [prefixText2, setPrefixText2] = useState("");
  const [suffixText1, setSuffixText1] = useState("");
  const [suffixText2, setSuffixText2] = useState("");

  const handleProcess = () => {
    try {
      if (!jsonInput) throw new Error("请输入 JSON 数据");
      if (!node1 && !node2) throw new Error("请至少输入一个节点");

      const jsonObject = JSON.parse(jsonInput);
      let result = "";

      const processNode = (node, value) => {
        const formattedPrefixText = node === node1 ? prefixText1 : prefixText2;
        const formattedSuffixText = node === node1 ? suffixText1 : suffixText2;

        const formattedText = `${formattedPrefixText.replace(
          "{value}",
          value
        )}${value}${formattedSuffixText.replace("{value}", value)}\n`;
        result += formattedText;
      };

      JSONPath.apply(jsonObject, `$..${node1}`, (value) =>
        processNode(node1, value)
      );
      JSONPath.apply(jsonObject, `$..${node2}`, (value) =>
        processNode(node2, value)
      );

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
        type="secondary"
        style={{ fontSize: "14px", marginBottom: "20px" }}
      >
        请在输入框中输入 JSON 格式的数据，然后点击“匹配”按钮。工具会根据 JSON
        数据中的 节点 1 和 节点 2
        字段进行相应的文本操作。处理成功后，页面会显示处理后的内容，并在“匹配结果框”中显示结果。用户可以根据需要点击“复制结果”按钮，将结果复制到剪贴板。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input.TextArea
            placeholder="输入JSON数据"
            value={jsonInput}
            rows={12}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Input
            placeholder="节点1"
            value={node1}
            onChange={(e) => setNode1(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="节点2"
            value={node2}
            onChange={(e) => setNode2(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="前缀文本1"
            value={prefixText1}
            onChange={(e) => setPrefixText1(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="前缀文本2"
            value={prefixText2}
            onChange={(e) => setPrefixText2(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="后缀文本1"
            value={suffixText1}
            onChange={(e) => setSuffixText1(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="后缀文本2"
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
            placeholder="处理结果"
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
