import { useState } from "react";
import { Input, Button, Typography, message, Row, Col } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const RegexMatcher = () => {
  const [regex, setRegex] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const handleMatch = () => {
    const regexObj = new RegExp(regex, "g");
    const matches = text.match(regexObj);
    setResult(matches.join("\n"));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(
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
      <Typography.Paragraph type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }}>
        这是用于根据用户输入的正则表达式查找目标文本中的匹配项。用户可以在「输入文本框」中输入需要处理的文本，在「正则规则框」中输入相应的正则表达式。点击“匹配”按钮后，工具会根据正则表达式在输入文本中搜索匹配项。匹配成功后，页面会显示匹配数量并在“匹配结果框”中显示匹配到的内容。用户可以根据需要点击“复制结果”按钮，将匹配结果复制到剪贴板。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col span={14}>
          <TextArea rows={5} placeholder="输入文本" value={text} onChange={(e) => setText(e.target.value)} />
        </Col>
        <Col span={10}>
          <Input placeholder="输入正则规则" value={regex} onChange={(e) => setRegex(e.target.value)} />
          <Button onClick={handleMatch} style={{ marginTop: "10px" }}>
            匹配
          </Button>
          <Button icon={<CopyOutlined />} onClick={handleCopy} style={{ marginTop: "10px", marginLeft: "10px" }}>
            复制结果
          </Button>
        </Col>
      </Row>
      <TextArea placeholder="匹配结果" style={{ width: "100%", marginTop: "16px" }} rows={10} value={result} readOnly />
    </>
  );
};

export default RegexMatcher;
