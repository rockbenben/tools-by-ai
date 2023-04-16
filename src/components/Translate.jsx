import React, { useState } from "react";
import { Button, Input, Layout, Row, Col, Typography, message } from "antd";
import axios from "axios";
import NavBar from "../NavBar";
import { Helmet } from "react-helmet";

const { Title } = Typography;
const Translate = () => {
  const [result, setResult] = useState("");
  const [inputText, setInputText] = useState("");
  const [apiKey, setApiKey] = useState("");

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
  
  const translateText = async (text) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
    try {
      const response = await axios.post(url, {
        q: text,
        target: "zh-CN",
        source: "en",
      });
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return "";
    }
  };
  
  const translateKeys = async (obj) => {
    const newObj = {};
    for (const key in obj) {
      const translatedKey = await translateText(key);
      newObj[translatedKey] = obj[key];
    }
    return newObj;
  };
  
  const handleTranslateClick = async () => {
    const input = JSON.parse(inputText);
  
    const translatedData = JSON.parse(JSON.stringify(input));
  
    for (const category in translatedData) {
      const translatedCategory = await translateKeys({ [category]: translatedData[category] });
      delete translatedData[category];
      const newCategoryKey = Object.keys(translatedCategory)[0];
      translatedData[newCategoryKey] = translatedCategory[newCategoryKey];
  
      for (const subcategory in translatedData[newCategoryKey]) {
        const items = translatedData[newCategoryKey][subcategory];
        const translatedSubcategory = await translateKeys({ [subcategory]: items });
        delete translatedData[newCategoryKey][subcategory];
        const newSubcategoryKey = Object.keys(translatedSubcategory)[0];
        translatedData[newCategoryKey][newSubcategoryKey] = translatedSubcategory[newSubcategoryKey];
  
        for (const item of translatedData[newCategoryKey][newSubcategoryKey]) {
          const translatedText = await translateText(item.displayName);
          item.langName = translatedText;
        }
      }
    }
  
    setResult(JSON.stringify(translatedData, null, 2));
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
        本页面的主要目的是将用户输入的文本翻译成中文。页面上方设置有输入框，用于输入 API Key，下方设置有另一个输入框，用于输入要翻译的 JSON 文本。在输入相应的内容后，点击“翻译文本”按钮，系统会调用 Google Translate API，将输入文本翻译成中文。翻译完成后，翻译结果将显示在右侧的结果文本框中。
        此处设定翻译原文是 displayName 的值（英文），然后将 langName 的值设为翻译后的内容（中文）。你可以根据需要进行调整。
        如果没有 API，可查看<a href="https://docs.easyuseai.com/platform/translate/google_fanyi.html">接口申请教程</a>。
        </Typography.Paragraph>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              placeholder="请输入 Goole API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: "100%", marginBottom: "16px" }}
            />
            <Input.TextArea
              placeholder="请输入要翻译的文本"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              style={{ width: "100%", marginBottom: "16px" }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Button onClick={handleTranslateClick} style={{ marginBottom: "16px" }}>
              翻译文本
            </Button>
            <Button
              onClick={handleCopyResultClick}
              style={{ marginLeft: "16px", marginBottom: "16px" }}
            >
              复制结果
            </Button>
            <Input.TextArea
              placeholder="翻译结果"
              value={result}
              readOnly
              rows={10}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </Layout.Content>
      </div>
    </Layout>
  );
};

export default Translate;
/* 
下面是节点的测试数据，以上将 "Post-processing"、"Post-processing" 类似的位置都做了翻译，并替代原本的位置。
{
  "Post-processing": {
    "Reflection": [{
        "displayName": "Ray Tracing Reflections",
        "langName": "中"
      },
      {
        "displayName": "Lumen Reflections",
        "langName": "中 2"
      },
      {
        "displayName": "Screen Space Reflections",
        "langName": "中 3"
      },
      {
        "displayName": "Diffraction Grading",
        "langName": "中 4"
      }
    ],
    "Filters": [{
        "displayName": "Chromatic Aberration",
        "langName": "中 5"
      }
    ],
    "Shaders": [{
        "displayName": "Ray Traced",
        "langName": "中 6"
      },
      {
        "displayName": "Ray Tracing Ambient Occlusion",
        "langName": "中 7"
      }
    ]
  },
  "Advanced": {
    "Compound Details": [{
        "displayName": "in a symbolic and meaningful style",
        "langName": "中 8"
      },
      {
        "displayName": "detailed and intricate",
        "langName": "中 9"
      }
    ]
  }
} */
