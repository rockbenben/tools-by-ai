"use client";

import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Button,
  Form,
  Typography,
  Input,
  Select,
  message,
  Card,
  Space,
  Spin,
} from "antd";
import JSONPath from "jsonpath";
import KeyMappingInput from "../components/KeyMappingInput";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON 节点机器翻译器 - 可用于 i18n 国际化 | Tools by AI",
  description:
    "强大的 JSON 节点翻译工具，允许用户指定 JSON 输入的节点进行翻译，它可以通过 Google 或 DeepL 的翻译 API 将选定的节点从源语言翻译为目标语言，并将翻译的结果填入相应的输出节点。",
  keywords:
    "JSON, 翻译器，JSON 翻译，语言转换，机器翻译，自动翻译，JSON 节点，Google 翻译 API, DeepL 翻译 API",
};

const { Title } = Typography;

const JsonTranslate = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});
  const [translationMethod, setTranslationMethod] = useState<string>("google");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("zh");
  const [keyMappings, setKeyMappings] = useState<
    Array<{ inputKey: string; outputKey: string }>
  >([{ inputKey: "", outputKey: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  const translationMethods = [
    { value: "google", label: "Google Translate" },
    { value: "deepl", label: "DeepL" },
  ];

  type LanguageOption = {
    value: string;
    label: string;
  };

  const languages: LanguageOption[] = [
    { value: "en", label: "English" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日语" },
    { value: "ko", label: "韩语" },
    { value: "es", label: "西班牙语" },
    { value: "fr", label: "法语" },
    { value: "de", label: "德语" },
    { value: "it", label: "意大利语" },
    { value: "ru", label: "俄语" },
    { value: "pt", label: "葡萄牙语" },
    { value: "hi", label: "印地语 (仅 Google)" },
    { value: "ar", label: "阿拉伯语 (仅 Google)" },
    { value: "bn", label: "孟加拉语 (仅 Google)" },
  ];

  const translateText = async (text: string) => {
    try {
      if (translationMethod === "google") {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            source: sourceLanguage,
          }),
        });

        const data = await response.json();
        return data.data.translations[0].translatedText;
      } else if (translationMethod === "deepl") {
        const response = await fetch("/api/deepl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            target_lang: targetLanguage,
            source_lang: sourceLanguage,
            authKey: apiKey,
          }),
        });

        const data = await response.json();
        return data.translations[0].text;
      }
    } catch (error) {
      console.error(`Failed to translate text: ${error}`);
      return null; // or some default value
    }
  };

  
  const handleTranslate = async () => {
    if (!apiKey) {
      message.error("API Key 不能为空");
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
    const translations = keyMappings.map(async (mapping) => {
      if (!mapping.inputKey || !mapping.outputKey) {
        return;
      }
      const inputNodes = JSONPath.nodes(jsonObject, `$..${mapping.inputKey}`);
      const outputNodes = JSONPath.nodes(jsonObject, `$..${mapping.outputKey}`);

      if (inputNodes.length === 0) {
        message.error(`输入键 ${mapping.inputKey} 在 JSON 中找不到`);
        return;
      }
      if (outputNodes.length === 0) {
        message.error(`输出键 ${mapping.outputKey} 在 JSON 中找不到`);
        return;
      }

      const tasks = inputNodes.map(async (node, index) => {
        const translatedText = await translateText(node.value);
        JSONPath.apply(
          jsonObject,
          JSONPath.stringify(outputNodes[index].path),
          () => translatedText
        );
      });

      // 等待所有的翻译任务完成
      await Promise.all(tasks);
    });

    // 等待所有的键映射完成
    await Promise.all(translations);

    setJsonOutput(JSON.stringify(jsonObject, null, 2));
    setIsLoading(false);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(jsonOutput).then(
      () => {
        message.success("结果已复制到剪贴板");
      },
      (err) => {
        message.error("无法复制结果，请手动复制");
      }
    );
  };

  return (
    <Layout.Content
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Title level={3} style={{ marginBottom: "24px" }}>
        JSON 节点机器翻译器
      </Title>
      <Typography.Paragraph
        type='secondary'
        style={{ fontSize: "14px", marginBottom: "20px" }}>
        本页面旨在帮助用户处理和翻译 JSON 数据。它使用 Google/DeepL Translate
        API，能够把用户指定的 JSON
        输入中的某些节点的值翻译成目标语言，并把翻译结果填入相应的输出节点中。用户可以自定义输入/输出节点，选择源语言和目标语言，然后通过简单的点击操作完成翻译任务。
        若你尚未拥有 API，可参考
        <a href='https://docs.easyuseai.com/platform/translate/google_fanyi.html'>
          接口申请教程
        </a>
        。如果已成功申请，可以直接查看{" "}
        <a href='https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814'>
          Google Translate API
        </a>{" "}
        或 <a href='https://www.deepl.com/zh/account/summary'>DeepL API</a>{" "}
        。使用建议：对于界面 UI 翻译，建议使用 Google
        Translate；而对于长句翻译，DeepL 的质量更好。请注意，Google Translate
        会直接将数据发送到 Google，然而 DeepL API
        并不支持网页使用。因此，我在服务器上设立了一个转发接口。服务器只负责转发你的数据，不会进行数据收集。你也可以选择在本地端进行部署使用。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title='输入区'>
            <Form.Item label='Translation Method'>
              <Select
                value={translationMethod}
                onChange={(value) => setTranslationMethod(value)}
                options={translationMethods}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder='Google/DeepL Translate API Key'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Form.Item>
            <Space style={{ display: "flex" }} align='baseline'>
              <Form.Item label='Source Language'>
                <Select
                  value={sourceLanguage}
                  onChange={(value) => setSourceLanguage(value)}
                  options={languages}
                />
              </Form.Item>

              <Form.Item label='Target Language'>
                <Select
                  value={targetLanguage}
                  onChange={(value) => setTargetLanguage(value)}
                  options={languages}
                />
              </Form.Item>
            </Space>

            <KeyMappingInput
              keyMappings={keyMappings}
              setKeyMappings={setKeyMappings}
            />
            <Form.Item>
              <Input.TextArea
                placeholder='JSON Input'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='结果区'>
            <Spin spinning={isLoading}>
              <Button
                onClick={handleTranslate}
                style={{ marginBottom: "16px" }}>
                Translate Text
              </Button>
              <Button
                onClick={handleCopyResult}
                style={{ marginLeft: "16px", marginBottom: "16px" }}>
                Copy Result
              </Button>
              <Form.Item>
                <Input.TextArea
                  placeholder='JSON Output'
                  value={jsonOutput}
                  rows={10}
                  readOnly
                />
              </Form.Item>
            </Spin>
          </Card>
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default JsonTranslate;
