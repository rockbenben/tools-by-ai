"use client";

import React, { useState, useEffect } from "react";
import { Flex, Button, Input, Upload, Form, Space, message, Typography, Select, Modal, Progress, Radio, RadioChangeEvent } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import { languages, translationMethods } from "@/app/components/transalteConstants";
import { splitTextIntoChunks, translateText } from "@/app/components/translateText";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const ClientPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [translationMethod, setTranslationMethod] = useState<string>("deeplx");
  const [apiKeyDeepl, setApiKeyDeepl] = useState<string>("");
  const [apiKeyGoogleTranslate, setApiKeyGoogleTranslate] = useState<string>("");
  const [apiKeyAzure, setApiKeyAzure] = useState<string>("");
  const [apiRegionAzure, setApiRegionAzure] = useState<string>("eastasia");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("zh");
  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [translateInProgress, setTranslateInProgress] = useState(false);
  const [translationMode, setTranslationMode] = useState("single");
  const [isClient, setIsClient] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [delayTime, setDelayTime] = useState<number>(200);

  useEffect(() => {
    const loadFromLocalStorage = (key: string, setState: (value: string) => void) => {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setState(storedValue);
      }
    };

    loadFromLocalStorage("translationMethod", setTranslationMethod);
    loadFromLocalStorage("apiKeyDeepl", setApiKeyDeepl);
    loadFromLocalStorage("apiKeyGoogleTranslate", setApiKeyGoogleTranslate);
    loadFromLocalStorage("apiKeyAzure", setApiKeyAzure);
    loadFromLocalStorage("apiRegionAzure", setApiRegionAzure);
    loadFromLocalStorage("sourceLanguage", setSourceLanguage);
    loadFromLocalStorage("targetLanguage", setTargetLanguage);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const saveToLocalStorage = (key: string, value: string) => {
        localStorage.setItem(key, value);
      };

      saveToLocalStorage("translationMethod", translationMethod);
      saveToLocalStorage("apiKeyDeepl", apiKeyDeepl);
      saveToLocalStorage("apiKeyGoogleTranslate", apiKeyGoogleTranslate);
      saveToLocalStorage("apiKeyAzure", apiKeyAzure);
      saveToLocalStorage("apiRegionAzure", apiRegionAzure);
      saveToLocalStorage("sourceLanguage", sourceLanguage);
      saveToLocalStorage("targetLanguage", targetLanguage);
    }
  }, [translationMethod, apiKeyDeepl, apiKeyGoogleTranslate, apiKeyAzure, apiRegionAzure, sourceLanguage, targetLanguage, isClient]);

  const handleFileUpload = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string).replace(/\r\n/g, "\n");
      setSourceText(text);
    };
    reader.readAsText(file);
    return false;
  };

  const handleMultipleFileUpload = (file: File) => {
    setMultipleFiles((prevFiles) => [...prevFiles, file]);
    return false;
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>, method: string) => {
    const { value } = e.target;
    if (method === "google") {
      setApiKeyGoogleTranslate(value);
    } else if (method === "deepl") {
      setApiKeyDeepl(value);
    } else if (method === "azure") {
      setApiKeyAzure(value);
    }
  };

  const handleApiRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiRegionAzure(e.target.value);
  };

  const handleSourceLanguageChange = (value: string) => {
    if (value === targetLanguage) {
      message.error("源语言和目标语言不能相同");
    } else {
      setSourceLanguage(value);
    }
  };

  const handleTargetLanguageChange = (value: string) => {
    if (value === sourceLanguage) {
      message.error("目标语言和源语言不能相同");
    } else {
      setTargetLanguage(value);
    }
  };

  const handleDelayTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setDelayTime(value);
  };

  const filterContentLines = (lines: string[]) => {
    const contentLines: string[] = [];
    const contentIndices: number[] = [];

    lines.forEach((line, index) => {
      const isTimecode = /^[\d:,]+ --> [\d:,]+$/.test(line);
      const isIndex = /^\d+$/.test(line);
      const isNumeric = /^\d+(\.\d+)?$/.test(line.trim());
      if (!isIndex && !isTimecode && !isNumeric && line.trim().length > 0) {
        contentLines.push(line);
        contentIndices.push(index);
      }
    });

    return { contentLines, contentIndices };
  };

  const testDeeplxTranslation = async () => {
    setTranslateInProgress(true);
    setProgressPercent(10);
    try {
      const testTranslation = await translateText({
        text: "Hello world",
        translationMethod: "deeplx",
        targetLanguage,
        sourceLanguage,
      });
      if (!testTranslation) {
        throw new Error("测试翻译失败");
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setTranslateInProgress(false);
    }
  };

  const validateInputs = async () => {
    if ((translationMethod === "deepl" && !apiKeyDeepl) || (translationMethod === "google" && !apiKeyGoogleTranslate) || (translationMethod === "azure" && !apiKeyAzure)) {
      message.error("Google/DeepL/Azure 翻译方法中，API Key 不能为空。没有 API 的话，可以使用 DeepLX 免费翻译。");
      return;
    }

    if (translationMethod === "deeplx") {
      const isDeeplxWorking = await testDeeplxTranslation();
      if (!isDeeplxWorking) {
        message.error("当前 Deeplx 节点有问题，请切换其他翻译模式");
        setTranslationMethod("google"); // 默认切换到 Google 翻译
        return false;
      }
    }

    return true;
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const performTranslation = async (sourceText: string, fileName?: string, fileIndex?: number, totalFiles?: number) => {
    const lines = sourceText.split("\n");
    const { contentLines, contentIndices } = filterContentLines(lines);

    try {
      const chunks = splitTextIntoChunks(contentLines.join("\n"), 3000);
      const translatedLines: string[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const translatedContent = await translateText({
          text: chunk,
          translationMethod,
          targetLanguage,
          sourceLanguage,
          apiKey: translationMethod === "deepl" ? apiKeyDeepl : translationMethod === "google" ? apiKeyGoogleTranslate : apiKeyAzure,
          apiRegion: translationMethod === "azure" && apiRegionAzure ? apiRegionAzure : "eastasia",
        });
        translatedLines.push(translatedContent);
        setProgressPercent((((fileIndex ? fileIndex : 0) + i / chunks.length) / (totalFiles ? totalFiles : 1)) * 100);
        await delay(delayTime); // 使用延迟时间状态
      }

      const finalTranslatedLines = translatedLines.join("\n").split("\n");
      const translatedTextArray = [...lines];
      contentIndices.forEach((index, i) => {
        translatedTextArray[index] = finalTranslatedLines[i];
      });

      const translatedText = translatedTextArray.join("\n");

      if (fileName) {
        const blob = new Blob([translatedText], {
          type: "text/plain;charset=utf-8",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        setTranslatedText(translatedText);
      }
    } catch (error) {
      message.error("翻译过程中发生错误");
    }
  };

  const handleTranslate = async () => {
    if (!(await validateInputs())) return;

    setTranslateInProgress(true);
    setProgressPercent(0);

    await performTranslation(sourceText);
    setTranslateInProgress(false);
  };

  const handleMultipleTranslate = async () => {
    if (!(await validateInputs())) return;

    if (multipleFiles.length === 0) {
      message.error("请选择要翻译的字幕文件");
      return;
    }

    setTranslateInProgress(true);
    setProgressPercent(0);

    for (let i = 0; i < multipleFiles.length; i++) {
      const currentFile = multipleFiles[i];
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async (e) => {
          const text = (e.target?.result as string).replace(/\r\n/g, "\n");
          await performTranslation(text, currentFile.name, i, multipleFiles.length);
          resolve();
        };
        reader.readAsText(currentFile);
      });
    }

    setTranslateInProgress(false);
    message.success("翻译完成，已自动下载所有翻译后的字幕文件");
  };

  const handleExportSubtitle = () => {
    if (!translatedText) {
      message.error("没有可导出的字幕文件");
      return;
    }
    const blob = new Blob([translatedText], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "subtitle.srt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleTranslationModeChange = (e: RadioChangeEvent) => {
    setTranslationMode(e.target.value);
    setFile(null);
    setSourceText("");
    setTranslatedText("");
    setMultipleFiles([]);
  };

  return (
    <>
      <Title level={3}>
        <VideoCameraOutlined /> 字幕翻译工具
      </Title>
      <Paragraph type="secondary">
        本工具支持 .srt 字幕文件的翻译，支持单文件和多文件翻译。请上传或粘贴字幕文件，选择翻译语言和翻译方法，然后点击翻译按钮。翻译结果将会显示在下方，您可以复制或导出字幕文件。了解更多：
        <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">Google Translate API</a>；
        <a href="https://learn.microsoft.com/zh-cn/azure/ai-services/translator/reference/v3-0-translate">Azure Translate</a>；<a href="https://www.deepl.com/your-account/keys">DeepL API</a>
        。本工具不会储存您的 API Key，所有数据均缓存在本地浏览器中。
      </Paragraph>
      <Radio.Group value={translationMode} onChange={handleTranslationModeChange}>
        <Radio.Button value="single">单文件翻译</Radio.Button>
        <Radio.Button value="multiple">多文件翻译</Radio.Button>
      </Radio.Group>
      {translationMode === "single" && (
        <>
          <div>
            <Dragger customRequest={({ file }) => handleFileUpload(file as File)} accept=".srt" showUploadList={false} style={{ marginBottom: "12px", padding: "12px 0" }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域以上传 .srt 字幕文件</p>
            </Dragger>
          </div>
          <TextArea
            placeholder="或在此处粘贴字幕文本（仅支持 .srt 格式）"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={8}
            style={{ width: "100%", marginBottom: "16px" }}
          />
        </>
      )}
      {translationMode === "multiple" && (
        <div>
          <Dragger customRequest={({ file }) => handleMultipleFileUpload(file as File)} accept=".srt" multiple showUploadList={true} style={{ marginBottom: "12px", padding: "12px 0" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域以上传多个 .srt 字幕文件</p>
          </Dragger>
        </div>
      )}
      <Flex wrap="wrap" gap="small" style={{ marginTop: "8px" }}>
        <Form.Item label="翻译 API">
          <Space>
            <Select value={translationMethod} onChange={(value) => setTranslationMethod(value)} options={translationMethods} />
            {translationMethod === "deepl" && <Input placeholder="输入 DeepL API Key" value={apiKeyDeepl} onChange={(e) => handleApiKeyChange(e, "deepl")} style={{ width: "300px" }} />}
            {translationMethod === "google" && (
              <Input placeholder="输入 Google Translate API Key" value={apiKeyGoogleTranslate} onChange={(e) => handleApiKeyChange(e, "google")} style={{ width: "320px" }} />
            )}
            {translationMethod === "azure" && (
              <>
                <Input placeholder="输入 Azure API Key" value={apiKeyAzure} onChange={(e) => handleApiKeyChange(e, "azure")} style={{ width: "300px" }} />
                <Input placeholder="输入 Azure API Region" value={apiRegionAzure} onChange={handleApiRegionChange} />
              </>
            )}
          </Space>
        </Form.Item>
        <Space style={{ display: "flex" }} align="baseline">
          <Form.Item label="源语言">
            <Select value={sourceLanguage} onChange={handleSourceLanguageChange} options={languages} style={{ width: "150px" }} />
          </Form.Item>
          <Form.Item label="目标语言">
            <Select value={targetLanguage} onChange={handleTargetLanguageChange} options={languages} style={{ width: "150px" }} />
          </Form.Item>
        </Space>
        <Form.Item label="延迟时间（毫秒）">
          <Input type="number" value={delayTime} onChange={handleDelayTimeChange} style={{ width: "150px" }} />
        </Form.Item>
        <Button type="primary" onClick={translationMode === "single" ? handleTranslate : handleMultipleTranslate} disabled={translateInProgress}>
          翻译
        </Button>
        {translationMode === "single" && (
          <>
            <Button onClick={() => copyToClipboard(translatedText)} disabled={!translatedText}>
              复制结果
            </Button>
            <Button onClick={handleExportSubtitle} disabled={!translatedText}>
              导出字幕文件
            </Button>
          </>
        )}
      </Flex>
      {translateInProgress && (
        <Modal title="翻译中" open={translateInProgress} footer={null} closable={false}>
          <Progress type="circle" percent={Math.round(progressPercent * 100) / 100} style={{ fontSize: "60px" }} />
        </Modal>
      )}
      {translationMode === "single" && translatedText && (
        <>
          <Title level={5} style={{ marginTop: "24px", marginBottom: "8px" }}>
            翻译结果
          </Title>
          <TextArea readOnly value={translatedText} rows={10} style={{ width: "100%" }} />
        </>
      )}
    </>
  );
};

export default ClientPage;
