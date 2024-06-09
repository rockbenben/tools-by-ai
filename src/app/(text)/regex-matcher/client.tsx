"use client";

import React, { useState } from "react";
import { Input, Button, Row, Col, Card, Radio, Space, Typography } from "antd";
import { CopyOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { cleanText } from "@/app/components/cleanText";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;

const commonRegexes = [
  { label: "URL（无参数）", value: 'https?://[^\\s"。？,，)#?]+' },
  { label: "URL（宽松匹配）", value: 'https?://[^\\s"。？,，)#]+' },
];

const ToolPage = () => {
  const defaultRegex = commonRegexes[0].value;
  const [inputText, setInputText] = useState("");
  const [regex, setRegex] = useState(defaultRegex);
  const [result, setResult] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleMatch = () => {
    const { cleanedText } = cleanText(inputText);
    try {
      const regexObj = new RegExp(regex, "g");
      const matches = cleanedText.match(regexObj);
      setResult(matches ? matches.join("\n") : "没有匹配结果");
    } catch (error) {
      setResult("正则表达式错误");
    }
  };

  const handleSelectRegex = (e) => {
    const selectedValue = e.target.value;
    setRegex(selectedValue);
  };

  const handleSortText = () => {
    const { cleanedArray, cleanedText } = cleanText(inputText);
    setInputText(cleanedText);
    const sortedArray = [...cleanedArray].sort();
    if (sortDirection === "desc") {
      sortedArray.reverse();
    }
    setResult(sortedArray.join("\n"));
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleReverseText = () => {
    const { cleanedArray } = cleanText(inputText);
    cleanedArray.reverse();
    setResult(cleanedArray.join("\n"));
  };

  const handleReplaceNewlines = () => {
    const updatedResult = result.replace(/\n/g, ",");
    setResult(updatedResult);
  };

  return (
    <>
      <Title level={3}>正则匹配工具</Title>
      <Paragraph type="secondary">
        在「待匹配文本框」输入文本，在「正则规则框」输入正则表达式。点击“匹配”按钮后，工具将显示匹配结果和匹配数量。用户可点击“复制结果”按钮，将匹配结果复制到剪贴板。
      </Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={18}>
          <Card title="待匹配文本">
            <Input.TextArea rows={4} placeholder="在此输入待匹配文本" value={inputText} onChange={(e) => setInputText(e.target.value)} />
            <Input style={{ marginTop: 10 }} addonBefore="正则表达式" placeholder="在此输入正则表达式" value={regex} onChange={(e) => setRegex(e.target.value)} />
            <Space style={{ marginTop: 10 }} wrap>
              <Button type="primary" onClick={handleMatch}>
                正则匹配
              </Button>
              <Button onClick={handleSortText} icon={sortDirection === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}>
                排序
              </Button>
              <Button onClick={handleReverseText} icon={<SortDescendingOutlined />}>
                反转排序
              </Button>
              <Button onClick={handleReplaceNewlines}>替换换行符</Button>
              <Button onClick={() => copyToClipboard(inputText, "原文本")}>复制原文本</Button>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(result, "结果文本")}>
                复制结果
              </Button>
            </Space>
          </Card>
          <Card style={{ marginTop: 20 }} title="结果">
            <Input.TextArea rows={6} value={result} readOnly />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title="常用正则表达式">
            <Radio.Group onChange={handleSelectRegex} value={regex}>
              {commonRegexes.map((regex) => (
                <Radio.Button
                  key={regex.value}
                  value={regex.value}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: "5px",
                  }}>
                  {regex.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ToolPage;
