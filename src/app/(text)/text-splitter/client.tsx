"use client";

import React, { useState } from "react";
import { Button, Input, Typography, Row, Col, Checkbox, message } from "antd";
import { ScissorOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const ClientPage = () => {
  const [inputText, setInputText] = useState("");
  const [splittedTexts, setSplittedTexts] = useState([]);
  const [copiedIndexes, setCopiedIndexes] = useState(new Set());
  const [limit, setLimit] = useState(2000);
  const [useSentenceEnd, setUseSentenceEnd] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10) || 2000);
  };

  const handleUseSentenceEndChange = (e) => {
    setUseSentenceEnd(e.target.checked);
  };

  const splitText = () => {
    const singleLineText = inputText.replace(/[\r\n]+/g, " ");
    const newSplittedTexts = [];
    let start = 0;

    while (start < singleLineText.length) {
      let end = start + limit;

      if (end < singleLineText.length && useSentenceEnd) {
        let chineseEnd = end;
        let englishEnd = end;
        let found = false;

        while (chineseEnd > start && !found) {
          if (singleLineText[chineseEnd] === "。" || singleLineText[chineseEnd] === "！" || singleLineText[chineseEnd] === "？") {
            found = true;
            end = chineseEnd + 1;
          }
          chineseEnd--;
        }

        if (!found) {
          while (englishEnd > start && !found) {
            if (singleLineText[englishEnd] === "." || singleLineText[englishEnd] === "!" || singleLineText[englishEnd] === "?") {
              found = true;
              end = englishEnd + 1;
            }
            englishEnd--;
          }
        }
      }

      if (end > singleLineText.length) {
        end = singleLineText.length;
      }

      newSplittedTexts.push(singleLineText.slice(start, end));
      start = end;
    }

    setSplittedTexts(newSplittedTexts);
    setCopiedIndexes(new Set());
    message.success("文本已成功分割。");
  };

  const handleCopy = async (text, index) => {
    await copyToClipboard(text, "指定文本");
    setCopiedIndexes((prevIndexes) => {
      const newIndexes = new Set(prevIndexes);
      newIndexes.add(index);
      return newIndexes;
    });
  };

  return (
    <>
      <Title level={3}>
        <ScissorOutlined /> 文本分割器
      </Title>
      <Paragraph type="secondary">
        本工具可以帮助您将较长的文本分割成若干段，每段长度根据您设置的字符限制进行分割。方便您在需要遵循字符限制的场景中使用。特别是对于 ChatGPT 的长度限制场景，2000 字符的限制尤为适用。
      </Paragraph>
      <TextArea name="inputText" placeholder="请输入文本" value={inputText} onChange={handleInputChange} rows={10} style={{ width: "100%", marginBottom: "16px" }} />
      <Row gutter={16} align="middle">
        <Col>
          <span>分割字符数：</span>
          <Input type="number" value={limit} onChange={handleLimitChange} min={1} max={10000} defaultValue={2000} style={{ width: "auto" }} />
        </Col>
        <Col>
          <Checkbox onChange={handleUseSentenceEndChange} checked={useSentenceEnd} style={{ marginLeft: "10px" }}>
            优先按整句分割（。！？）
          </Checkbox>
        </Col>
        <Col>
          <Button onClick={splitText} type="primary" ghost style={{ marginLeft: "10px" }}>
            分割文本
          </Button>
        </Col>
      </Row>
      <div>
        {splittedTexts.map((text, index) => (
          <div
            key={index}
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
            }}>
            <TextArea
              readOnly
              value={text}
              rows={4}
              style={{
                width: "100%",
                marginRight: "8px",
                marginBottom: "8px",
              }}
            />
            <Button
              onClick={() => handleCopy(text, index)}
              style={{
                marginBottom: "16px",
                backgroundColor: copiedIndexes.has(index) ? "lightgreen" : undefined,
              }}>
              复制
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClientPage;
