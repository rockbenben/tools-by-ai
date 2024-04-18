"use client";

import React, { useState } from "react";
import { Row, Col, Button, Form, Typography, Input, message, Card, Spin } from "antd";
import { JSONPath } from "jsonpath-plus";
import { translateText } from "../components/translateText";
import { preprocessJson } from "../components/preprocessJson";
import { languages, isValidLanguageValue } from "../components/transalteConstants";

const { Title, Paragraph } = Typography;

const AIShortTranslate = () => {
  const [googleApi, setGoogleApi] = useState<string>("");
  const [deeplKey, setDeeplKey] = useState<string>("");

  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJsonInputChange = (e) => {
    const input = e.target.value;
    setJsonInput(input);
  };

  const applyTranslation = (jsonObject, path, translatedText) => {
    const outputNodePathArray = JSONPath.toPathArray(path);
    if (!outputNodePathArray || outputNodePathArray.length === 0) {
      throw new Error(`输出路径解析错误`);
    }
    let currentNode = jsonObject;
    for (let i = 1; i < outputNodePathArray.length - 1; i++) {
      currentNode = currentNode[outputNodePathArray[i]] = currentNode[outputNodePathArray[i]] || {};
    }
    currentNode[outputNodePathArray[outputNodePathArray.length - 1]] = translatedText;
  };

  function getApiKeyAndMethod(langKey) {
    const preferredMethod = languages.find((lang) => lang.value === langKey)?.firstChoice;
    if (preferredMethod === "google" && googleApi) {
      return { method: "google", key: googleApi };
    } else if (preferredMethod === "deepl" && deeplKey) {
      return { method: "deepl", key: deeplKey };
    }
    return { method: "deeplx", key: "" }; // Default to deeplx if no key is available
  }

  const translateData = async (jsonData) => {
    const promises = [];

    jsonData.forEach((item) => {
      // 遍历所有可能的语言节点
      Object.keys(item).forEach((langKey) => {
        if (isValidLanguageValue(langKey)) {
          // 验证是否为有效语言节点
          const fields = ["title", "remark"];
          const { method: apiMethod, key: apiKey } = getApiKeyAndMethod(langKey);

          // 翻译 title 和 remark 字段
          fields.forEach((field) => {
            const sourceText = item.zh[field]; // 来源文本从 'zh' 节点获取
            if (sourceText) {
              const path = `$.${langKey}.${field}`;
              const promise = translateText({
                text: sourceText,
                translationMethod: apiMethod,
                targetLanguage: langKey,
                sourceLanguage: "zh",
                apiKey: apiKey,
              }).then((translatedText) => {
                applyTranslation(item, path, translatedText);
              });
              promises.push(promise);
            }
          });

          // 只有在非 'en' 节点 description 字段
          if (langKey !== "en" && item[langKey].prompt) {
            const descText = item[langKey].prompt; // 使用当前节点的 prompt
            const descPath = `$.${langKey}.description`;
            const descPromise = translateText({
              text: descText,
              translationMethod: apiMethod,
              targetLanguage: langKey,
              sourceLanguage: "en", // 原文始终视为英文，根据 prompt 来翻译
              apiKey: apiKey,
            }).then((translatedText) => {
              applyTranslation(item, descPath, translatedText);
            });
            promises.push(descPromise);
          }
        }
      });
    });

    await Promise.all(promises);
    return jsonData;
  };

  const handleTranslate = async () => {
    // Reset Output
    setJsonOutput("");

    let jsonObject;
    try {
      jsonObject = preprocessJson(jsonInput);
    } catch (error) {
      message.error("JSON Input 格式错误或无法处理");
      return;
    }
    setJsonInput(JSON.stringify(jsonObject, null, 2));
    setIsLoading(true);

    try {
      const translatedJson = await translateData(jsonObject);
      setJsonOutput(JSON.stringify(translatedJson, null, 2));
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
      <Title level={3} style={{ marginBottom: "24px" }}>
        ChatGPT Shortcut 定制翻译工具
      </Title>
      <Paragraph type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }} ellipsis={ellipsis ? { rows: 3, expandable: true, symbol: "more" } : false}>
        专为 ChatGPT Shortcut 的 prompt.json 数据结构设计的翻译工具，支持一键快捷翻译 13 种语言，操作简便，无需额外配置。对于印地语和孟加拉语，该工具默认使用 Google Translate
        进行翻译。对于其他语言，则优先选用 DeepL 作为翻译服务。在用户未提供 Google Translate 或 DeepL 的 API 密钥的情况下，系统会自动切换到
        DeepLX，这是一个无需费用的翻译服务，保证基本的翻译需求得到满足。API：
        <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">Google Translate API</a>；
        <a href="https://www.deepl.com/your-account/keys">DeepL API</a>。
      </Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <Form.Item label="Google Translate">
              <Input placeholder="不含印地语、孟加拉语可空，不填则使用 DeepL" value={googleApi} onChange={(e) => setGoogleApi(e.target.value)} />
            </Form.Item>
            <Form.Item label="DeepL Translate">
              <Input placeholder="不填则使用 DeepLx" value={deeplKey} onChange={(e) => setDeeplKey(e.target.value)} />
            </Form.Item>
            <Input.TextArea placeholder="JSON Input，输入要翻译的 JSON" value={jsonInput} onChange={handleJsonInputChange} rows={10} />
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
              <Input.TextArea placeholder="JSON Output" value={jsonOutput} rows={10} readOnly />
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AIShortTranslate;
