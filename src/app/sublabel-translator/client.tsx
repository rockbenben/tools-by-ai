"use client";
import React, { useState, useEffect } from "react";
import { Flex, Button, Input, Upload, Form, Space, message, Typography, Select, Modal, Progress, Radio, RadioChangeEvent } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { languages, translationMethods } from "../components/transalteConstants";
import { translateText } from "../components/translateText";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const SubtitleTranslator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [translationMethod, setTranslationMethod] = useState<string>("deeplx");
  const [apiKeyDeepl, setApiKeyDeepl] = useState<string>("");
  const [apiKeyGoogleTranslate, setApiKeyGoogleTranslate] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("zh");
  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [translateInProgress, setTranslateInProgress] = useState(false);
  const [translationMode, setTranslationMode] = useState("single");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [runningTime, setRunningTime] = useState(0);
  const [isClient, setIsClient] = useState(false);

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
      saveToLocalStorage("sourceLanguage", sourceLanguage);
      saveToLocalStorage("targetLanguage", targetLanguage);
    }
  }, [translationMethod, apiKeyDeepl, apiKeyGoogleTranslate, sourceLanguage, targetLanguage, isClient]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (translateInProgress && startTime) {
      timer = setInterval(() => {
        setRunningTime((Date.now() - startTime) / 1000);
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
      setRunningTime(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [translateInProgress, startTime]);

  const handleFileUpload = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSourceText(e.target?.result as string);
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
    }
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

  const translateTextUsingMethod = async (text: string) => {
    return await translateText({
      text,
      translationMethod,
      targetLanguage,
      sourceLanguage,
      apiKey: translationMethod === "deepl" ? apiKeyDeepl : apiKeyGoogleTranslate,
    });
  };

  const handleTranslate = async () => {
    if (sourceLanguage === targetLanguage) {
      message.error("源语言和目标语言不能相同");
      return;
    }

    if (translationMethod !== "deeplx" && !apiKeyDeepl && !apiKeyGoogleTranslate) {
      message.error("请设置 API Key");
      return;
    }

    setTranslateInProgress(true);
    setStartTime(Date.now());

    const lines = sourceText.split("\n");
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

    const translatedContent = await translateTextUsingMethod(contentLines.join("\n"));
    const translatedLines = translatedContent.split("\n");

    const translatedTextArray = [...lines];
    contentIndices.forEach((index, i) => {
      translatedTextArray[index] = translatedLines[i];
    });

    setTranslatedText(translatedTextArray.join("\n"));
    setTranslateInProgress(false);
  };

  const handleMultipleTranslate = async () => {
    if (sourceLanguage === targetLanguage) {
      message.error("源语言和目标语言不能相同");
      return;
    }

    if (translationMethod !== "deeplx" && !apiKeyDeepl && !apiKeyGoogleTranslate) {
      message.error("请设置 API Key");
      return;
    }

    if (multipleFiles.length === 0) {
      message.error("请选择要翻译的字幕文件");
      return;
    }

    setTranslateInProgress(true);
    setStartTime(Date.now());

    try {
      for (const currentFile of multipleFiles) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = async (e) => {
            const sourceText = e.target?.result as string;
            const lines = sourceText.split("\n");
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

            const translatedContent = await translateTextUsingMethod(contentLines.join("\n"));
            const translatedLines = translatedContent.split("\n");

            const translatedTextArray = [...lines];
            contentIndices.forEach((index, i) => {
              translatedTextArray[index] = translatedLines[i];
            });

            const translatedText = translatedTextArray.join("\n");
            const blob = new Blob([translatedText], {
              type: "text/plain;charset=utf-8",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${currentFile.name}`;
            link.click();
            URL.revokeObjectURL(link.href);

            resolve();
          };
          reader.readAsText(currentFile);
        });
      }
      message.success("翻译完成，已自动下载所有翻译后的字幕文件");
    } catch (error) {
      message.error("翻译过程中发生错误");
    } finally {
      setTranslateInProgress(false);
    }
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
      <Title level={3} style={{ marginBottom: "24px" }}>
        字幕翻译工具
      </Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }}>
        本工具支持 .srt 字幕文件的翻译，支持单文件和多文件翻译。请上传或粘贴字幕文件，选择翻译语言和翻译方法，然后点击翻译按钮。翻译结果将会显示在下方，您可以复制或导出字幕文件。了解更多：
        <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">Google Translate API</a>；
        <a href="https://www.deepl.com/your-account/keys">DeepL API</a>。本工具不会储存您的 API Key，所有数据均缓存在本地浏览器中。
      </Typography.Paragraph>
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
          <Select value={translationMethod} onChange={(value) => setTranslationMethod(value)} options={translationMethods} />
          {translationMethod === "deepl" && <Input placeholder="输入 DeepL API Key" value={apiKeyDeepl} onChange={(e) => handleApiKeyChange(e, "deepl")} style={{ width: "300px" }} />}
          {translationMethod === "google" && (
            <Input placeholder="输入 Google Translate API Key" value={apiKeyGoogleTranslate} onChange={(e) => handleApiKeyChange(e, "google")} style={{ width: "300px" }} />
          )}
        </Form.Item>
        <Space style={{ display: "flex" }} align="baseline">
          <Form.Item label="源语言">
            <Select value={sourceLanguage} onChange={handleSourceLanguageChange} options={languages} style={{ width: "150px" }} />
          </Form.Item>
          <Form.Item label="目标语言">
            <Select value={targetLanguage} onChange={handleTargetLanguageChange} options={languages} style={{ width: "150px" }} />
          </Form.Item>
        </Space>
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
          <Progress type="circle" percent={100} format={() => `${Math.floor(runningTime)}s`} style={{ fontSize: "60px" }} />
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

export default SubtitleTranslator;
