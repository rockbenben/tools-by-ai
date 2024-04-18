"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Upload, message, Typography, Select, Space, Modal, Progress, Divider, Radio } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { languages } from "../components/transalteConstants";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const SubtitleTranslator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);

  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("zh");
  const [translateInProgress, setTranslateInProgress] = useState(false);
  const [translationMode, setTranslationMode] = useState("single");
  const [startTime, setStartTime] = useState(null);
  const [runningTime, setRunningTime] = useState(0);

  useEffect(() => {
    let timer;
    if (translateInProgress) {
      timer = setInterval(() => {
        setRunningTime((Date.now() - startTime) / 1000);
      }, 1000);
    } else {
      clearInterval(timer);
      setRunningTime(0);
    }
    return () => clearInterval(timer);
  }, [translateInProgress, startTime]);
  const handleFileUpload = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSourceText(e.target.result as string);
    };
    reader.readAsText(file);
    return false;
  };
  const handleMultipleFileUpload = (file) => {
    setMultipleFiles((prevFiles) => [...prevFiles, file]);
    return false;
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSourceLanguageChange = (value) => {
    setSourceLanguage(value);
  };

  const handleTargetLanguageChange = (value) => {
    setTargetLanguage(value);
  };

  const handleTranslate: () => Promise<void> = async () => {
    if (!apiKey) {
      message.error("请设置 Google Translate API Key");
      return;
    }

    setTranslateInProgress(true);
    setStartTime(Date.now());

    const lines = sourceText.split("\n");
    const contentLines = [];
    const contentIndices = [];

    lines.forEach((line, index) => {
      const isTimecode = /^[\d:,]+ --> [\d:,]+$/.test(line);
      const isIndex = /^\d+$/.test(line);
      const isNumeric = /^\d+(\.\d+)?$/.test(line.trim());
      if (!isIndex && !isTimecode && !isNumeric && line.trim().length > 0) {
        contentLines.push(line);
        contentIndices.push(index);
      }
    });

    const translatedContent = await translateText(contentLines.join("\n"));
    const translatedLines = translatedContent.split("\n");

    let translatedTextArray = [...lines];
    contentIndices.forEach((index, i) => {
      translatedTextArray[index] = translatedLines[i];
    });

    setTranslatedText(translatedTextArray.join("\n"));
    setTranslateInProgress(false);
  };

  const handleMultipleTranslate = async () => {
    if (!apiKey) {
      message.error("请设置 Google Translate API Key");
      return;
    }

    if (multipleFiles.length === 0) {
      message.error("请选择要翻译的字幕文件");
      return;
    }

    setTranslateInProgress(true);
    setStartTime(Date.now());

    for (const currentFile of multipleFiles) {
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = async (e) => {
          const sourceText = e.target.result;
          const lines = (sourceText as string).split("\n");
          const contentLines = [];
          const contentIndices = [];

          lines.forEach((line, index) => {
            const isTimecode = /^[\d:,]+ --> [\d:,]+$/.test(line);
            const isIndex = /^\d+$/.test(line);
            const isNumeric = /^\d+(\.\d+)?$/.test(line.trim());
            if (!isIndex && !isTimecode && !isNumeric && line.trim().length > 0) {
              contentLines.push(line);
              contentIndices.push(index);
            }
          });

          const translatedContent = await translateText(contentLines.join("\n"));
          const translatedLines = translatedContent.split("\n");

          let translatedTextArray = [...lines];
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

          resolve(void 0);
        };
        reader.readAsText(currentFile);
      });
    }

    setTranslateInProgress(false);
    message.success("翻译完成，已自动下载所有翻译后的字幕文件");
  };

  const translateText = async (text) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: "text",
          preserveFormatting: "preserve",
        }),
      });

      if (!response.ok) {
        console.error("Error translating text:", await response.text());
        return "";
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return "";
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

  const handleTranslationModeChange = (e) => {
    setTranslationMode(e.target.value);
    setFile(null);
    setSourceText("");
    setTranslatedText("");
  };

  return (
    <>
      <Title level={3} style={{ marginBottom: "24px" }}>
        字幕翻译
      </Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }}>
        写完后发现本工具与 <a href="https://github.com/1c7/Translate-Subtitle-File">1c7/Translate-Subtitle-File</a>
        功能重叠了，你也可以尝试使用它的 <a href="https://tern.1c7.me/#/">网页版</a>。
      </Typography.Paragraph>
      <Radio.Group value={translationMode} onChange={handleTranslationModeChange}>
        <Radio.Button value="single">单文件翻译</Radio.Button>
        <Radio.Button value="multiple">多文件翻译</Radio.Button>
      </Radio.Group>
      {translationMode === "single" && (
        <>
          <div>
            <Dragger
              customRequest={({ file }) => handleFileUpload(file)}
              accept=".srt"
              showUploadList={false}
              style={{
                marginBottom: "16px",
                padding: "16px 0",
              }}>
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
            rows={10}
            style={{ width: "100%", marginBottom: "16px" }}
          />
        </>
      )}
      {translationMode === "multiple" && (
        <div>
          <Dragger
            customRequest={({ file }) => handleMultipleFileUpload(file)}
            accept=".srt"
            multiple
            showUploadList={true}
            style={{
              marginBottom: "16px",
              padding: "16px 0",
            }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域以上传多个 .srt 字幕文件</p>
          </Dragger>
        </div>
      )}
      <Space>
        <Input placeholder="输入 Google Translate API Key" value={apiKey} onChange={handleApiKeyChange} />
        <span>预翻译语言：</span>
        <Select value={sourceLanguage} onChange={handleSourceLanguageChange} style={{ width: "200px" }}>
          {languages.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <span>目标语言：</span>
        <Select value={targetLanguage} onChange={handleTargetLanguageChange} style={{ width: "200px" }}>
          {languages.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Space>
      <Divider type="vertical" />
      <Space>
        <Button onClick={translationMode === "single" ? handleTranslate : handleMultipleTranslate} disabled={translateInProgress}>
          翻译
        </Button>
        {translationMode === "single" && (
          <>
            <Button onClick={() => navigator.clipboard.writeText(translatedText)}>复制结果</Button>
            <Button onClick={handleExportSubtitle}>导出字幕文件</Button>
          </>
        )}
      </Space>
      {translateInProgress && (
        <Modal title="翻译中" visible={translateInProgress} footer={null} closable={false}>
          <Progress type="circle" format={() => `${Math.floor(runningTime)}s`} percent={100} width={80} style={{ marginTop: "16px" }} />
        </Modal>
      )}
      {translationMode === "single" && (
        <>
          <Title level={5} style={{ marginBottom: "8px" }}>
            翻译结果
          </Title>
          <TextArea readOnly value={translatedText} rows={10} style={{ width: "100%", marginBottom: "16px" }} />
        </>
      )}
    </>
  );
};

export default SubtitleTranslator;
