import { useState } from "react";
import { Input, Button, Typography, message, Row, Col } from "antd";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const JsonArrayInserter = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [node1, setNode1] = useState("");
  const [insertNode, setInsertNode] = useState("");
  const [result, setResult] = useState("");

  const handleInsert = () => {
    try {
      if (!jsonInput) throw new Error("请先输入 JSON 数据");
      if (!node1) throw new Error("请输入要插入位置的节点名称");
      if (!insertNode) throw new Error("请输入要插入的新节点名称");

      let json;
      try {
        json = JSON.parse(jsonInput);
      } catch {
        throw new Error("输入的 JSON 数据格式不正确");
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

      json = processNode(json);

      if (!node1Found) throw new Error("找不到指定的节点名称");

      const result = JSON.stringify(json, null, 2);

      setResult(result);
      message.success(`处理成功，共处理了${Object.keys(json).length}个条目。`);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <Typography.Paragraph type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }}>
        请在输入框中输入 JSON 格式的数据，然后点击“匹配”按钮。工具会在 JSON
        数据中查找数组类型的节点，并在指定节点后插入新的指定节点（支持多个）。插入成功后，页面会显示处理后的内容，并在“匹配结果框”中显示结果。用户可以根据需要点击“复制结果”按钮，将结果复制到剪贴板。{" "}
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input.TextArea placeholder="输入JSON数据" value={jsonInput} rows={5} onChange={(e) => setJsonInput(e.target.value)} />
        </Col>
        <Col xs={24} md={12}>
          <Input placeholder="输入要插入位置的节点名称" value={node1} onChange={(e) => setNode1(e.target.value)} />
          <Input placeholder="输入要插入的新节点名称，可以输入多个节点，用逗号分隔。" value={insertNode} style={{ marginTop: "10px" }} onChange={(e) => setInsertNode(e.target.value)} />
          <Button onClick={handleInsert} style={{ marginTop: "10px" }}>
            插入
          </Button>
          <Button onClick={() => copyToClipboard(result)} style={{ marginTop: "10px", marginLeft: "10px" }}>
            复制结果
          </Button>
        </Col>
        <Col xs={24}>
          <Input.TextArea placeholder="插入结果" rows={10} value={result} readOnly />
        </Col>
      </Row>
    </>
  );
};

export default JsonArrayInserter;
