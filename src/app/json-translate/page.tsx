"use client";

import React, { useState } from "react";
import { Row, Col, Button, Tooltip, Form, Typography, Input, Select, message, Card, Space, Spin } from "antd";
import { JSONPath } from "jsonpath-plus";
import _ from "lodash";
import { translateText } from "../components/translateText";
import KeyMappingInput from "../components/KeyMappingInput";
import Head from "next/head";

const { Title, Paragraph } = Typography;

const JsonTranslate = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [translationMethod, setTranslationMethod] = useState<string>("deeplx");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("zh");
  const [showSimpleInput, setShowSimpleInput] = useState(true);
  const [simpleInputKey, setSimpleInputKey] = useState("");
  const toggleInputType = () => {
    setShowSimpleInput(!showSimpleInput);
  };
  const [keyMappings, setKeyMappings] = useState<Array<{ inputKey: string; outputKey: string }>>([{ inputKey: "", outputKey: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonInputError, setJsonInputError] = useState(null);

  const translationMethods = [
    { value: "google", label: "Google Translate" },
    { value: "deepl", label: "DeepL" },
    { value: "deeplx", label: "DeepLX（免费，无需填 API）" },
  ];

  type LanguageOption = {
    value: string;
    label: string;
  };

  const languages: LanguageOption[] = [
    { value: "en", label: "英语（English）" },
    { value: "zh", label: "中文（Chinese）" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "韩语（한국어）" },
    { value: "es", label: "西班牙语" },
    { value: "fr", label: "法语（Français）" },
    { value: "de", label: "德语（Deutsch）" },
    { value: "it", label: "意大利语" },
    { value: "ru", label: "俄语（Русский）" },
    { value: "pt", label: "葡萄牙语" },
    { value: "hi", label: "印地语 (仅 Google)" },
    { value: "ar", label: "阿拉伯语 (仅 Google)" },
    { value: "bn", label: "孟加拉语 (仅 Google)" },
  ];

  // Parse JSON Input, set error if invalid
  const parseAndSetJsonInput = (input) => {
    try {
      const parsedJson = JSON.parse(input);
      setJsonInput(JSON.stringify(parsedJson, null, 2));
      setJsonInputError(null);
    } catch (error) {
      setJsonInputError("JSON Input 格式错误，请检查");
    }
  };

  const debouncedParseAndSetJsonInput = _.debounce(parseAndSetJsonInput, 1500);

  const handleJsonInputChange = (e) => {
    const input = e.target.value;
    setJsonInput(input);
    debouncedParseAndSetJsonInput(input);
  };

  const handleTranslate = async () => {
    // Reset Output
    setJsonOutput("");

    // Check Input
    if (!apiKey && translationMethod !== "deeplx") {
      message.error("Google/DeepL 翻译方法中，API Key 不能为空。没有 API 的话，可以使用 DeepLX 免费翻译。");
      return;
    }
    if (!jsonInput) {
      message.error("JSON Input 不能为空");
      return;
    }

    let jsonObject;
    try {
      jsonObject = JSON.parse(jsonInput);
    } catch (error) {
      message.error("JSON Input 格式错误");
      return;
    }
    setIsLoading(true);

    try {
      let mappings;
      if (showSimpleInput) {
        // 替换中文逗号为英文逗号，并分割
        const keys = simpleInputKey
          .replace(/，/g, ",")
          .split(",")
          .filter((k) => k.trim() !== "");
        mappings = keys.map((key) => ({ inputKey: key.trim(), outputKey: key.trim() }));
      } else {
        mappings = keyMappings;
      }
      // 一次性处理所有 JSONPath 查询
      const inputNodesMap = new Map();
      const outputNodesMap = new Map();

      for (const { inputKey, outputKey } of mappings) {
        if (!inputKey || !outputKey) {
          throw new Error(`输入或输出键缺失`);
        }

        if (!inputNodesMap.has(inputKey)) {
          inputNodesMap.set(inputKey, JSONPath({ path: `$..${inputKey}`, json: jsonObject, resultType: "all" }));
        }
        if (!outputNodesMap.has(outputKey)) {
          outputNodesMap.set(outputKey, JSONPath({ path: `$..${outputKey}`, json: jsonObject, resultType: "all" }));
        }

        const inputNodes = inputNodesMap.get(inputKey);
        const outputNodes = outputNodesMap.get(outputKey);

        if (inputNodes.length === 0 || outputNodes.length === 0) {
          throw new Error(`输入键 ${inputKey} 或输出键 ${outputKey} 在 JSON 中找不到`);
        }
        if (inputNodes.length !== outputNodes.length) {
          throw new Error(`输入键 ${inputKey} 和输出键 ${outputKey} 的节点数量不匹配`);
        }

        const tasks = inputNodes.map(async (node, index) => {
          const translatedText = await translateText({
            text: node.value,
            translationMethod,
            targetLanguage,
            sourceLanguage,
            apiKey,
          });
          applyTranslation(jsonObject, outputNodes[index].path, translatedText);
        });

        await Promise.all(tasks);
      }

      setJsonOutput(JSON.stringify(jsonObject, null, 2));
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTranslation = (jsonObject, path, translatedText) => {
    const outputNodePathArray = JSONPath.toPathArray(path);
    if (!outputNodePathArray || outputNodePathArray.length === 0) {
      throw new Error(`输出路径解析错误`);
    }
    let currentNode = jsonObject;
    for (let i = 1; i < outputNodePathArray.length - 1; i++) {
      currentNode = currentNode[outputNodePathArray[i]];
    }
    currentNode[outputNodePathArray[outputNodePathArray.length - 1]] = translatedText;
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(jsonOutput).then(
      () => {
        message.success("翻译结果已复制到剪贴板");
      },
      (err) => {
        message.error("无法复制翻译内容，请手动复制");
      }
    );
  };

  const [ellipsis, setEllipsis] = useState(true);
  return (
    <>
      <Head>
        <title>多语言 JSON 翻译工具 - i18n 国际化开发助手 | JsonTranslate | Tools by AI</title>
        <meta
          name="description"
          content="JsonTranslate 是一个轻便的多语言 JSON 翻译工具，专为软件开发者和内容管理者设计，以支持国际化和本地化项目。轻松转换 JSON 文档中的文本到多种目标语言，使用 Google Translate、DeepL 和 DeepLX 翻译 API。"
        />
        <meta name="keywords" content="JsonTranslate, JSON 翻译工具, 多语言翻译, 国际化工具, i18n, 本地化, Google 翻译 API, DeepL 翻译 API, 自动翻译 JSON, 编程语言翻译" />
      </Head>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          多语言 JSON 翻译工具
        </Title>
        <Paragraph type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }} ellipsis={ellipsis ? { rows: 3, expandable: true, symbol: "more" } : false}>
          JsonTranslate 是一款高效的多语言 JSON 翻译工具，专为开发者和内容创作者设计。支持 Google Translate、DeepL 和 DeepLX 翻译
          API，助力快速实现项目的国际化和本地化。无论你是在开发多语言网站、应用程序还是处理多语言数据集，JsonTranslate 都能提供简便的解决方案，轻松将 JSON 文件中的内容翻译为多种目标语言。
          <br />
          了解更多：<a href="https://newzone.top/apps/devdocs/json-translate.html">使用教程</a>；
          <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">Google Translate API</a>；
          <a href="https://www.deepl.com/zh/account/summary">DeepL API</a>。
        </Paragraph>
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="输入区">
              <Form.Item label="翻译 API">
                <Select value={translationMethod} onChange={(value) => setTranslationMethod(value)} options={translationMethods} />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Google/DeepL Translate API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </Form.Item>
              <Space style={{ display: "flex" }} align="baseline">
                <Form.Item label="源语言">
                  <Select value={sourceLanguage} onChange={(value) => setSourceLanguage(value)} options={languages} />
                </Form.Item>

                <Form.Item label="目标语言">
                  <Select value={targetLanguage} onChange={(value) => setTargetLanguage(value)} options={languages} />
                </Form.Item>
              </Space>

              {showSimpleInput ? (
                <Form.Item label="翻译键名">
                  <Input value={simpleInputKey} onChange={(e) => setSimpleInputKey(e.target.value)} placeholder="输入欲翻译的节点键名" />
                </Form.Item>
              ) : (
                <KeyMappingInput keyMappings={keyMappings} setKeyMappings={setKeyMappings} />
              )}
              <Form.Item>
                <Input.TextArea placeholder="JSON Input，输入要翻译的 JSON" value={jsonInput} onChange={handleJsonInputChange} rows={10} />
                {jsonInputError && <div style={{ color: "red" }}>{jsonInputError}</div>}
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="结果区">
              <Spin spinning={isLoading}>
                <Button
                  onClick={handleTranslate}
                  style={{ marginBottom: "16px", backgroundColor: "#1890ff", color: "#fff" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#40a9ff")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1890ff")}>
                  开始翻译
                </Button>
                <Button onClick={handleCopyResult} style={{ marginLeft: "16px", marginRight: "16px", marginBottom: "16px" }}>
                  复制翻译结果
                </Button>
                <Button onClick={toggleInputType} style={{ backgroundColor: "#f5f5f5", color: "rgba(0, 0, 0, 0.65)" }}>
                  <Tooltip
                    title="点击以切换翻译节点模式。单一键名模式表示翻译的输入输出使用相同节点，而映射翻译则涉及不同节点。例如，节点 A 的值将翻译至节点 B，节点 C 的值则翻译至节点 D。"
                    placement="top">
                    {showSimpleInput ? "切换到映射翻译" : "切换到单一键名翻译"}
                  </Tooltip>
                </Button>
                <Form.Item>
                  <Input.TextArea placeholder="JSON Output" value={jsonOutput} rows={10} readOnly />
                </Form.Item>
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JsonTranslate;
