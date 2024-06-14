"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Space, Checkbox, Radio, Flex } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const { Title, Paragraph } = Typography;

const descriptions = {
  excel: "用 Excel 表格数据的第一列进行比对去重，然后提取去重后数据的第三列，并添加指定前缀。",
  noval: "替换多个指定文本，将不是空行且不以空格或制表符开头的文本行与上一行进行合并。",
};

const ClientPage = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [prefix, setPrefix] = useState("");
  const [applyNewLines, setApplyNewLines] = useState(true);
  const [selectedTool, setSelectedTool] = useState("excel");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrefix = localStorage.getItem("prefix");
      if (storedPrefix) {
        setPrefix(storedPrefix);
      }
    }
  }, []);

  const handleExcelProcessing = async () => {
    const lines = input.split("\n");
    const data = lines.map((line) => line.split("\t"));

    const uniqueDataMap = new Map();
    data.forEach((item) => {
      if (item.length > 1 && !uniqueDataMap.has(item[0])) {
        uniqueDataMap.set(item[0], item);
      }
    });

    const uniqueData = Array.from(uniqueDataMap.values());
    const result = uniqueData.map((item) => prefix + item[2]).join("\n");
    setOutput(result);

    localStorage.setItem("prefix", prefix);

    await copyToClipboard(result);
  };

  const handleNovalProcessing = () => {
    let processedInput = input.replace(/Added Url/g, "");
    processedInput = processedInput.replace(/【待续】/g, "");
    processedInput = processedInput.replace(/章、/g, "章 ");
    processedInput = processedInput.replace(/[０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });

    if (applyNewLines) {
      const lines = processedInput.split("\n").filter((line) => line.trim() !== "");
      let merged = lines[0];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].match(/^\s/) || lines[i].startsWith("【") || lines[i].startsWith("「") || lines[i].startsWith("作者")) {
          merged += "\n\n" + lines[i];
        } else {
          merged += lines[i];
        }
      }

      setOutput(merged.replace(/\n{3,}/g, "\n\n"));
    } else {
      setOutput(processedInput.replace(/\n{2,}/g, "\n"));
    }
  };

  const handleProcess = () => {
    if (selectedTool === "excel") {
      handleExcelProcessing();
    } else {
      handleNovalProcessing();
    }
  };

  return (
    <>
      <Title level={3}>
        <ProfileOutlined /> 文本处理工具
      </Title>
      <Radio.Group onChange={(e) => setSelectedTool(e.target.value)} value={selectedTool}>
        <Radio.Button value="excel">表格数据去重</Radio.Button>
        <Radio.Button value="noval">小说文本处理</Radio.Button>
      </Radio.Group>
      <Paragraph type="secondary">{descriptions[selectedTool]}</Paragraph>
      <Flex gap="small" vertical>
        {selectedTool === "excel" && <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="如果添加前缀文本，请在这里输入" />}
        <Input.TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} placeholder="请输入要处理的内容" />
        {selectedTool === "noval" && (
          <Checkbox checked={applyNewLines} onChange={(e) => setApplyNewLines(e.target.checked)}>
            是否需要处理换行
          </Checkbox>
        )}
        <Space>
          <Button type="primary" onClick={handleProcess}>
            处理文本
          </Button>
          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)}>
            复制结果
          </Button>
        </Space>
        <Input.TextArea rows={10} value={output} readOnly placeholder="处理后的内容将出现在这里" />
      </Flex>
    </>
  );
};

export default ClientPage;
