import React, { useState } from "react";
import {
  Button,
  Input,
  Layout,
  Row,
  Col,
  Typography,
  message,
  Select,
  Form,
  Spin,
  Card,
} from "antd";
import axios from "axios";
import NavBar from "../NavBar";
import { Helmet } from "react-helmet";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Translate = () => {
  const [result, setResult] = useState("");
  const [inputText, setInputText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [outputKey, setOutputKey] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("zh-CN");
  const [isLoading, setIsLoading] = useState(false);

  // Add your supported languages here
  const languages = [
    { value: "en", label: "English" },
    { value: "zh-CN", label: "中文" },
    { value: "ja", label: "日语" },
    { value: "ko", label: "韩语" },
    { value: "es", label: "西班牙语" },
    // Add more languages as needed...
  ];

  const translateText = async (text) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    // Just throw the error and let the caller handle it
    const response = await axios.post(url, {
      q: text,
      target: targetLanguage,
      source: sourceLanguage,
    });
    return response.data.data.translations[0].translatedText;
  };

  const handleCopyResultClick = () => {
    navigator.clipboard.writeText(result).then(
      () => {
        message.success("结果已复制到剪贴板");
      },
      (err) => {
        message.error("无法复制结果，请手动复制");
      }
    );
  };

  const translateNode = async (node, inputKey, outputKey) => {
    if (Array.isArray(node)) {
      let newArray = [];
      for (let i = 0; i < node.length; i++) {
        newArray[i] = await translateNode(node[i], inputKey, outputKey);
      }
      return newArray;
    } else if (typeof node === "object" && node !== null) {
      let newObj = { ...node }; // Copy the original object first
      for (let key in node) {
        if (key === inputKey && newObj.hasOwnProperty(outputKey)) {
          let textToTranslate = node[key];
          if (textToTranslate) {
            // Check if the text to translate is not empty
            const translatedText = await translateText(textToTranslate);
            newObj[outputKey] = translatedText;
          }
        } else if (typeof node[key] === "object" && node[key] !== null) {
          newObj[key] = await translateNode(node[key], inputKey, outputKey);
        }
      }
      return newObj;
    } else {
      return node;
    }
  };

  const handleTranslateClick = async () => {
    if (!apiKey.trim()) {
      message.error("API Key 不能为空。");
      return;
    }
    if (!inputText.trim()) {
      message.error("要翻译的文本不能为空。");
      return;
    }

    if (!inputKey.trim()) {
      message.error("输入节点名不能为空。");
      return;
    }
    if (!outputKey.trim()) {
      message.error("输出节点名不能为空。");
      return;
    }

    setIsLoading(true);
    try {
      const input = JSON.parse(inputText);

      // Check if inputKey or outputKey exists globally
      let inputKeyFound = false;
      let outputKeyUsed = false;

      const checkKeys = (node) => {
        for (let key in node) {
          if (typeof node[key] === "object") {
            checkKeys(node[key]);
          } else {
            if (key === inputKey) {
              inputKeyFound = true;
            }
            if (key === outputKey) {
              outputKeyUsed = true;
            }
          }
        }
      };

      checkKeys(input);

      if (!inputKeyFound) {
        message.error(`输入键名 "${inputKey}" 找不到。`);
        setIsLoading(false);
        return;
      }

      if (!outputKeyUsed) {
        message.error(`输出键名 "${outputKey}" 找不到。`);
        setIsLoading(false);
        return;
      }

      const translatedData = await translateNode(input, inputKey, outputKey);
      setResult(JSON.stringify(translatedData, null, 2));
    } catch (error) {
      // Handle all errors here
      if (axios.isAxiosError(error)) {
        // The error is from an axios request
        if (error.response) {
          message.error(
            `API 错误：${error.response.data.error.code} ${error.response.data.error.message}`
          );
        } else if (error.request) {
          message.error("API 错误：没有收到服务器响应。");
        } else {
          message.error("API 错误：请求设置出错。");
        }
      } else if (error instanceof SyntaxError) {
        // The error is a JSON parsing error
        message.error("JSON 格式错误，请检查您的输入。");
      } else {
        // Handle other possible errors
        message.error(error.message);
      }
    } finally {
      // Regardless of whether an error occurred, stop showing the loading indicator.
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>i18n JSON 翻译</title>
      </Helmet>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Layout.Content
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}
        >
          <Title level={3} style={{ marginBottom: "24px" }}>
            机器翻译 JSON 节点
          </Title>
          <Typography.Paragraph
            type="secondary"
            style={{ fontSize: "14px", marginBottom: "20px" }}
          >
            本页面的主要目的是将用户输入的文本翻译成中文。页面上方设置有输入框，用于输入
            API Key，下方设置有另一个输入框，用于输入要翻译的 JSON
            文本。在输入相应的内容后，点击“翻译文本”按钮，系统会调用 Google
            Translate
            API，将输入文本翻译成中文。翻译完成后，翻译结果将显示在右侧的结果文本框中。
            此处设定翻译原文是 displayName 的值（英文），然后将 langName
            的值设为翻译后的内容（中文）。你可以根据需要进行调整。如果没有
            API，可查看
            <a href="https://docs.easyuseai.com/platform/translate/google_fanyi.html">
              接口申请教程
            </a>
            。已经申请好了，可以直接查看
            <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">
              当前 API
            </a>
            。
          </Typography.Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="输入">
                <Form>
                  <Form.Item label="API Key">
                    <Input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="源语言">
                    <Select value={sourceLanguage} onChange={setSourceLanguage}>
                      {languages.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="目标语言">
                    <Select value={targetLanguage} onChange={setTargetLanguage}>
                      {languages.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="输入键名">
                    <Input
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="输出键名">
                    <Input
                      value={outputKey}
                      onChange={(e) => setOutputKey(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="要翻译的文本">
                    <TextArea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={10}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="输出">
                <Button
                  onClick={handleTranslateClick}
                  style={{ marginBottom: "16px" }}
                >
                  翻译文本
                </Button>
                <Button
                  onClick={handleCopyResultClick}
                  style={{ marginLeft: "16px", marginBottom: "16px" }}
                >
                  复制结果
                </Button>
                <Spin spinning={isLoading}>
                  <TextArea
                    placeholder="翻译结果"
                    value={result}
                    readOnly
                    rows={10}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </div>
    </Layout>
  );
};

export default Translate;