import React, { useState } from "react";
import Head from "next/head";
import { Layout, Button, Input, message, Typography, Row, Col } from "antd";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const TextSplitter = () => {
  const [inputText, setInputText] = useState("");
  const [splittedTexts, setSplittedTexts] = useState([]);
  const [copiedIndexes, setCopiedIndexes] = useState(new Set());
  const [limit, setLimit] = useState(2000);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10) || 2000);
  };

  const splitText = () => {
    // Remove line breaks and then split the text
    const singleLineText = inputText.replace(/[\r\n]+/g, " ");
    const splittedTexts = [];
    let start = 0;

    while (start < singleLineText.length) {
      let end = Math.min(start + limit, singleLineText.length);
      if (end !== singleLineText.length) {
        let chineseEnd = end;
        let englishEnd = end;
        let foundChinese = false;
        let foundEnglish = false;
        while (chineseEnd > start && !foundChinese) {
          if (singleLineText[chineseEnd] === "。") {
            foundChinese = true;
            end = chineseEnd + 1;
          }
          chineseEnd--;
        }
        if (!foundChinese) {
          while (englishEnd > start && !foundEnglish) {
            if (singleLineText[englishEnd] === ".") {
              foundEnglish = true;
              end = englishEnd + 1;
            }
            englishEnd--;
          }
        }
      }
      splittedTexts.push(singleLineText.slice(start, end));
      start = end;
    }

    setSplittedTexts(splittedTexts); // 添加这一行
    message.success("文本已成功分割。");
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success("结果已复制到剪贴板。");
      setCopiedIndexes((prevIndexes) => new Set(prevIndexes).add(index));
    });
  };

  return (
    <>
      <Head>
        <title>文本分割工具 - AI 工具集</title>
        <meta
          name="description"
          content="我们的文本分割工具可以帮助你将长文本划分为满足特定字符限制的多个小段。这特别适用于需要遵守字符限制的场景，例如使用ChatGPT时的2000字符限制。"
        />
        <meta
          name="keywords"
          content="文本分割, 文本处理, AI工具, 字符限制, ChatGPT"
        />
      </Head>
      <Layout.Content style={{ padding: "24px" }}>
        <Row justify="center">
          <Col xs={24} sm={24} md={20} lg={18} xl={16} xxl={14}>
            <Title level={3}>文本分割器</Title>
            <Typography.Paragraph
              type="secondary"
              style={{ fontSize: "14px", marginBottom: "20px" }}
            >
              本工具可以帮助您将较长的文本分割成若干段，每段长度根据您设置的字符限制进行分割。方便您在需要遵循字符限制的场景中使用。
              <br />
              特别是对于 ChatGPT 的长度限制场景，2000 字符的限制尤为适用。
            </Typography.Paragraph>
            <TextArea
              name="inputText"
              placeholder="请输入文本"
              value={inputText}
              onChange={handleInputChange}
              rows={10}
              style={{ width: "100%", marginBottom: "16px" }}
            />
            <Row gutter={16} align="middle">
              <Col>
                <span>分割字符数：</span>
                <Input
                  type="number"
                  value={limit}
                  onChange={handleLimitChange}
                  min={1}
                  max={10000}
                  defaultValue={2000}
                  style={{ width: "auto" }}
                />
              </Col>
              <Col>
                <Button onClick={splitText} type="primary" ghost>
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
                  }}
                >
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
                    onClick={() => copyToClipboard(text, index)}
                    style={{
                      marginBottom: "16px",
                      backgroundColor: copiedIndexes.has(index)
                        ? "lightgreen"
                        : undefined,
                    }}
                  >
                    复制
                  </Button>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Layout.Content>
    </>
  );
};
export default TextSplitter;
