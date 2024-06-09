import React from "react";
import { Button, Form, Input, Space, Tooltip } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

let idCounter = 0;

const KeyMappingInput = ({ keyMappings = [], setKeyMappings }) => {
  const removeMapping = (id) => {
    if (keyMappings.length > 1) {
      const newMappings = keyMappings.filter((mapping) => mapping.id !== id);
      setKeyMappings(newMappings);
    }
  };

  const addMapping = () => {
    setKeyMappings([...keyMappings, { inputKey: "", outputKey: "", id: idCounter++ }]);
  };

  const handleInputChange = (index, field, value) => {
    const newMappings = [...keyMappings];
    newMappings[index][field] = value;
    setKeyMappings(newMappings);
  };

  return (
    <>
      {keyMappings.map((mapping, index) => (
        <Form key={mapping.id}>
          <Space key={mapping.id} style={{ display: "flex", marginBottom: 8 }} align="baseline">
            <Form.Item name={`inputKey${mapping.id}`} label={`输入键名 ${index + 1}`} style={{ marginBottom: 0 }}>
              <Input value={mapping.inputKey} onChange={(e) => handleInputChange(index, "inputKey", e.target.value)} />
            </Form.Item>
            <Form.Item name={`outputKey${mapping.id}`} label={`输出键名 ${index + 1}`} style={{ marginBottom: 0 }}>
              <Input value={mapping.outputKey} onChange={(e) => handleInputChange(index, "outputKey", e.target.value)} />
            </Form.Item>
            <Tooltip title="删除翻译节点">
              <Button onClick={() => removeMapping(mapping.id)} type="default" icon={<MinusCircleOutlined />} />
            </Tooltip>
          </Space>
        </Form>
      ))}
      <Form.Item>
        <Button onClick={addMapping} type="dashed" block icon={<PlusOutlined />}>
          添加翻译节点
        </Button>
      </Form.Item>
    </>
  );
};

export default KeyMappingInput;
