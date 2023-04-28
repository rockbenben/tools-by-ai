import React from "react";
import {
  Button,
  Input,
  Layout,
  message,
  Typography,
  Row,
  Col,
} from "antd";
import NavBar from "../NavBar";
import { Helmet } from "react-helmet";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

class TextSplitter extends React.Component {
  state = {
    inputText: "",
    splittedTexts: [],
    copiedIndexes: new Set(),
    limit: 2000,
  };

  handleInputChange = (e) => {
    this.setState({ inputText: e.target.value });
  };

  handleLimitChange = (e) => {
    this.setState({ limit: parseInt(e.target.value, 10) || 2000 });
  };

  splitText = () => {
    const { inputText, limit } = this.state;

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

    this.setState({ splittedTexts });
    message.success("文本已成功分割。");
  };

  copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success("结果已复制到剪贴板。");
      this.setState((prevState) => ({
        copiedIndexes: prevState.copiedIndexes.add(index),
      }));
    });
  };

  render() {
    const { inputText, splittedTexts, copiedIndexes, limit } = this.state;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Helmet>
          <title>文本分割器</title>
        </Helmet>
        <NavBar />
        <Layout.Content style={{ padding: "24px" }}>
          <Row justify="center">
            <Col xs={24} sm={24} md={20} lg={18} xl={16} xxl={14}>
              <Title level={3}>文本分割器</Title>
              <Paragraph>
                本工具可以帮助您将较长的文本分割成若干段，每段长度根据您设置的字符限制进行分割。方便您在需要遵循字符限制的场景中使用。<br />
                特别是对于 ChatGPT 的长度限制场景，2000 字符的限制尤为适用。
              </Paragraph>
              <TextArea
                name="inputText"
                placeholder=            "请输入文本"
                value={inputText}
                onChange={this.handleInputChange}
                rows={10}
                style={{ width: "100%", marginBottom: "16px" }}
              />
              <Row gutter={16} align="middle">
                <Col>
                  <span>分割字符数：</span>
                  <Input
                    type="number"
                    value={limit}
                    onChange={this.handleLimitChange}
                    min={1}
                    max={10000}
                    defaultValue={2000}
                    style={{ width: "auto" }}
                  />
                </Col>
                <Col>
                  <Button onClick={this.splitText} type="primary" ghost>
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
                      onClick={() => this.copyToClipboard(text, index)}
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
      </Layout>
    );
}
}

export default TextSplitter;
