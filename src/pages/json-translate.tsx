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
} from "antd";
import axios from "axios";
import JSONPath from "jsonpath";
import KeyMappingInput from "./components/KeyMappingInput";
const { Title } = Typography;

const JsonTranslate = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("zh-CN");
  const [keyMappings, setKeyMappings] = useState<
    Array<{ inputKey: string; outputKey: string }>
  >([{ inputKey: "", outputKey: "" }]);

  type LanguageOption = {
    value: string;
    label: string;
  };

  const languages: LanguageOption[] = [
    { value: "en", label: "English" },
    { value: "zh-CN", label: "中文" },
    { value: "ja", label: "日语" },
    { value: "ko", label: "韩语" },
    { value: "es", label: "西班牙语" },
  ];

  const translateText = async (text: string) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await axios.post(url, {
      q: text,
      target: targetLanguage,
      source: sourceLanguage,
    });

    return response.data.data.translations[0].translatedText;
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
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}
    >
      <Title level={3} style={{ marginBottom: "24px" }}>
        机器翻译 JSON 节点
      </Title>
      <Typography.Paragraph
        type="secondary"
        style={{ fontSize: "14px", marginBottom: "20px" }}
      >
        本页面旨在帮助用户处理和翻译 JSON 数据。它使用 Google Translte
        API，能够把用户指定的 JSON
        输入中的某些节点的值翻译成目标语言，并把翻译结果填入相应的输出节点中。用户可以自定义输入/输出节点，选择源语言和目标语言，然后通过简单的点击操作完成翻译任务。
        如果没有 API，可查看
        <a href="https://docs.easyuseai.com/platform/translate/google_fanyi.html">
          接口申请教程
        </a>
        。如果你已经申请好了，可以直接查看
        <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">
          当前 API
        </a>
        。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <Form.Item>
              <Input
                placeholder="Google Translate API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Form.Item>
            <Space style={{ display: "flex" }} align="baseline">
              <Form.Item label="Source Language">
                <Select
                  value={sourceLanguage}
                  onChange={(value) => setSourceLanguage(value)}
                  options={languages}
                />
              </Form.Item>

              <Form.Item label="Target Language">
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
                placeholder="JSON Input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="结果区">
            <Button onClick={handleTranslate} style={{ marginBottom: "16px" }}>
              Translate Text
            </Button>
            <Button
              onClick={handleCopyResult}
              style={{ marginLeft: "16px", marginBottom: "16px" }}
            >
              Copy Result
            </Button>
            <Form.Item>
              <Input.TextArea
                placeholder="JSON Output"
                value={jsonOutput}
                rows={10}
                readOnly
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default JsonTranslate;
