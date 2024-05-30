import React, { useState } from "react";
import { Row, Col, Button, Form, Typography, Input, message, Card } from "antd";
import { JSONPath } from "jsonpath-plus";
import KeyMappingInput from "./KeyMappingInput";
import { copyToClipboard } from "@/app/components/copyToClipboard";

const JsonValueTransformer = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>({});
  const [isPresetUsed, setIsPresetUsed] = useState<boolean>(false);

  const defaultMappings = [
    { inputKey: "en.prompt", outputKey: "ar.prompt" },
    { inputKey: "en.prompt", outputKey: "bn.prompt" },
    { inputKey: "en.prompt", outputKey: "de.prompt" },
    { inputKey: "en.prompt", outputKey: "es.prompt" },
    { inputKey: "en.prompt", outputKey: "fr.prompt" },
    { inputKey: "en.prompt", outputKey: "hi.prompt" },
    { inputKey: "en.prompt", outputKey: "it.prompt" },
    { inputKey: "en.prompt", outputKey: "ja.prompt" },
    { inputKey: "en.prompt", outputKey: "ko.prompt" },
    { inputKey: "en.prompt", outputKey: "pt.prompt" },
    { inputKey: "en.prompt", outputKey: "ru.prompt" },
  ];

  const [keyMappings, setKeyMappings] = useState<Array<{ inputKey: string; outputKey: string }>>([{ inputKey: "", outputKey: "" }]);

  const handleEdit = () => {
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

    const transformations = keyMappings.map((mapping) => {
      if (!mapping.inputKey || !mapping.outputKey) {
        message.error("输入键或输出键不能为空");
        return;
      }
      const inputNodes = JSONPath({ path: `$..${mapping.inputKey}`, json: jsonObject, resultType: "all" });
      const outputNodes = JSONPath({ path: `$..${mapping.outputKey}`, json: jsonObject, resultType: "all" });

      if (inputNodes.length === 0) {
        message.error(`输入键 ${mapping.inputKey} 在 JSON 中找不到`);
        return;
      }
      if (outputNodes.length === 0) {
        message.error(`输出键 ${mapping.outputKey} 在 JSON 中找不到`);
        return;
      }

      inputNodes.forEach((node, index) => {
        let outputNodePathArray = JSONPath.toPathArray(outputNodes[index].path);
        if (outputNodePathArray && outputNodePathArray.length > 0) {
          let currentNode = jsonObject;
          for (let i = 1; i < outputNodePathArray.length - 1; i++) {
            currentNode = currentNode[outputNodePathArray[i]];
          }
          currentNode[outputNodePathArray[outputNodePathArray.length - 1]] = node.value;
        }
      });
    });

    // 等待所有的键映射完成
    Promise.all(transformations).then(() => {
      setJsonOutput(JSON.stringify(jsonObject, null, 2));
    });
  };

  const toggleUsePreset = () => {
    if (isPresetUsed) {
      setIsPresetUsed(false);
    } else {
      setIsPresetUsed(true);
      setKeyMappings(defaultMappings);
    }
  };
  return (
    <>
      <Typography.Paragraph type="secondary" style={{ fontSize: "14px" }}>
        通过键映射（key mapping）来修改 JSON 数据。用户可以输入一对键（输入键和输出键），该工具会查找 JSON 数据中的输入键位置，然后将对应位置的值替换为输出键位置的值。
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入区">
            <Button onClick={toggleUsePreset} style={{ marginBottom: "16px" }}>
              {isPresetUsed ? "显示映射" : "使用预设映射"}
            </Button>
            {!isPresetUsed && <KeyMappingInput keyMappings={keyMappings} setKeyMappings={setKeyMappings} />}

            <Form.Item>
              <Input.TextArea placeholder="JSON Input" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} rows={10} />
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="结果区">
            <Button onClick={handleEdit} style={{ marginBottom: "16px" }}>
              Edit Json
            </Button>
            <Button onClick={() => copyToClipboard(jsonOutput)} style={{ marginLeft: "16px", marginBottom: "16px" }}>
              Copy Result
            </Button>
            <Form.Item>
              <Input.TextArea placeholder="JSON Output" value={jsonOutput} rows={10} readOnly />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default JsonValueTransformer;
