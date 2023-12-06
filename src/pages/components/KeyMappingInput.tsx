import React from "react";
import { Button, Form, Input, Space, Tooltip } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const KeyMappingInput = ({ keyMappings = [], setKeyMappings }) => {
  const removeMapping = (id) => {
    if (keyMappings.length > 1) {
      const newMappings = keyMappings.filter((mapping) => mapping.id !== id);
      setKeyMappings(newMappings);
    }
  };

  const addMapping = () => {
    setKeyMappings([
      ...keyMappings,
      { inputKey: "", outputKey: "", id: Date.now() },
    ]);
  };

  return (
    <>
      {keyMappings.map((mapping, index) => (
        <Space
          key={mapping.id}
          style={{ display: "flex", marginBottom: 8 }}
          align='baseline'>
          <Form.Item
            name={`inputKey${mapping.id}`}
            label={`输入键名 ${index + 1}`}
            style={{ marginBottom: 0 }}>
            <Input
              value={mapping.inputKey}
              onChange={(e) => {
                const newMappings = [...keyMappings];
                newMappings[index].inputKey = e.target.value;
                setKeyMappings(newMappings);
              }}
            />
          </Form.Item>
          <Form.Item
            name={`outputKey${mapping.id}`}
            label={`输出键名 ${index + 1}`}
            style={{ marginBottom: 0 }}>
            <Input
              value={mapping.outputKey}
              onChange={(e) => {
                const newMappings = [...keyMappings];
                newMappings[index].outputKey = e.target.value;
                setKeyMappings(newMappings);
              }}
            />
          </Form.Item>
          <Tooltip title='删除翻译节点'>
            <Button
              onClick={() => removeMapping(mapping.id)}
              type='default'
              icon={<MinusCircleOutlined />}
            />
          </Tooltip>
        </Space>
      ))}
      <Form.Item>
        <Button
          onClick={addMapping}
          type='dashed'
          block
          icon={<PlusOutlined />}>
          添加翻译节点
        </Button>
      </Form.Item>
    </>
  );
};

export default KeyMappingInput;