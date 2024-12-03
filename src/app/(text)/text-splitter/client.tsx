"use client";
import React, { useState } from "react";
import { Button, Input, Typography, Checkbox, message, Form, Tooltip, Space } from "antd";
import { ScissorOutlined, FileTextOutlined, DownloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/app/utils/copyToClipboard";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const ClientPage = () => {
  const [inputText, setInputText] = useState("");
  const [splittedTexts, setSplittedTexts] = useState<string[]>([]);
  const [copiedIndexes, setCopiedIndexes] = useState(new Set<number>());
  const [limit, setLimit] = useState(2000);
  const [useSentenceEnd, setUseSentenceEnd] = useState(false);
  const [customFileName, setCustomFileName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value, 10) || 2000);
  };

  const handleUseSentenceEndChange = (e: { target: { checked: boolean } }) => {
    setUseSentenceEnd(e.target.checked);
  };

  const splitText = () => {
    const singleLineText = inputText.replace(/[\r\n]+/g, " ");
    const newSplittedTexts: string[] = [];
    let start = 0;

    while (start < singleLineText.length) {
      let end = start + limit;

      if (end < singleLineText.length && useSentenceEnd) {
        let chineseEnd = end;
        let englishEnd = end;
        let found = false;

        while (chineseEnd > start && !found) {
          if (singleLineText[chineseEnd] === "。" || singleLineText[chineseEnd] === "！" || singleLineText[chineseEnd] === "？") {
            found = true;
            end = chineseEnd + 1;
          }
          chineseEnd--;
        }

        if (!found) {
          while (englishEnd > start && !found) {
            if (singleLineText[englishEnd] === "." || singleLineText[englishEnd] === "!" || singleLineText[englishEnd] === "?") {
              found = true;
              end = englishEnd + 1;
            }
            englishEnd--;
          }
        }
      }

      if (end > singleLineText.length) {
        end = singleLineText.length;
      }

      newSplittedTexts.push(singleLineText.slice(start, end));
      start = end;
    }

    setSplittedTexts(newSplittedTexts);
    setCopiedIndexes(new Set());
    message.success("文本已成功分割。");
  };

  const handleCopy = async (text: string, index: number) => {
    await copyToClipboard(text, "指定文本");
    setCopiedIndexes((prevIndexes) => {
      const newIndexes = new Set(prevIndexes);
      newIndexes.add(index);
      return newIndexes;
    });
  };

  // Export full split text as a single file
  const handleExportFullText = () => {
    if (splittedTexts.length === 0) {
      message.error("没有可导出的文本");
      return;
    }

    const fileName = customFileName || "split_text_full";
    const fullText = splittedTexts.join("\n\n");
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    message.success("全文本已导出");
  };

  // Export each split text as a separate file
  const handleBatchExport = () => {
    if (splittedTexts.length === 0) {
      message.error("没有可导出的文本");
      return;
    }

    const baseFileName = customFileName || "split_text";
    splittedTexts.forEach((text, index) => {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${baseFileName}_${index + 1}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    });

    message.success(`已导出 ${splittedTexts.length} 个文本文件`);
  };

  return (
    <>
      <Title level={3}>
        <ScissorOutlined /> 文本分割器
      </Title>
      <Paragraph type="secondary">
        本工具可以帮助您将较长的文本分割成若干段，每段长度根据您设置的字符限制进行分割。方便您在需要遵循字符限制的场景中使用。特别是对于 ChatGPT 的长度限制场景，2000 字符的限制尤为适用。
      </Paragraph>
      <TextArea name="inputText" placeholder="请输入文本" value={inputText} onChange={handleInputChange} rows={10} style={{ width: "100%" }} allowClear />
      <Form className="mt-2 -mb-4">
        <Space>
          <Form.Item label="分割字符数">
            <Input type="number" value={limit} onChange={handleLimitChange} min={1} max={10000} defaultValue={2000} />
          </Form.Item>
          <Form.Item>
            <Checkbox onChange={handleUseSentenceEndChange} checked={useSentenceEnd}>
              优先按整句分割（。！？）
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={splitText}>
              分割文本
            </Button>
          </Form.Item>
          {splittedTexts.length > 0 && (
            <>
              <Form.Item>
                <Tooltip title="将所有分割的文本合并到一个文件中，文本之间使用两个换行符分隔">
                  <Button icon={<FileTextOutlined />} onClick={handleExportFullText}>
                    导出全文本
                  </Button>
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip title="将每个分割的文本导出为单独的文本文件">
                  <Button icon={<DownloadOutlined />} onClick={handleBatchExport}>
                    批量导出
                  </Button>
                </Tooltip>
              </Form.Item>
              <Form.Item label="导出文件名">
                <Input value={customFileName} onChange={(e) => setCustomFileName(e.target.value)} />
              </Form.Item>
            </>
          )}
        </Space>
      </Form>
      <>
        {splittedTexts.map((text, index) => (
          <div key={index} className="mt-1 flex items-center">
            <TextArea readOnly value={text} rows={4} className="w-full mr-2 mb-2" />
            <Button onClick={() => handleCopy(text, index)} className={`mb-4 ${copiedIndexes.has(index) ? "bg-green-200" : ""}`}>
              复制
            </Button>
          </div>
        ))}
      </>
    </>
  );
};

export default ClientPage;
