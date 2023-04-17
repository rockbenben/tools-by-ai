import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Button, Col, Input, message, Row, Typography, Layout, Radio } from "antd";
import "./index.css";
import "antd/dist/reset.css";
import { Helmet } from "react-helmet";
import NavBar from "./NavBar";
import Translate from "./components/Translate";

const { TextArea } = Input;
const { Title } = Typography;

// 定义一个组件，用于处理正则匹配
class RegexMatcher extends React.Component {
  state = {
    inputText: "",
    regexRule: "",
    result: "",
    currentRule: 1, // Add a new state for the current rule
  };

  // 更新输入文本和正则规则的状态
  handleInputChange = (e) => {
    this.setState({ inputText: e.target.value });
  };

  handleRegexChange = (e) => {
    this.setState({ regexRule: e.target.value });
  };
  handleRuleChange = (e) => {
    this.setState({ currentRule: e.target.value });
  };
  // 匹配文本并执行相应的操作
  processRule1 = () => {
    const { inputText, regexRule } = this.state;

    // 创建一个动态的正则表达式
    const regex = new RegExp(regexRule, "g");
    let match;
    let result = "";
    let count = 0;

    while ((match = regex.exec(inputText)) !== null) {
      count++;

      // 在匹配到的文本上执行操作，<h4>(.*?)<\/h4>|<h5>(.*?)<\/h5>|<p class=card-title>(.*?)<\/p>
      if (match[1]) {
        result += `],\n},\n"${match[1]}": {\n`; // 第一个匹配规则，对应 <h4> 和 </h4> 之间的内容
      } else if (match[2]) {
        result += `],\n"${match[2]}": [\n`; // 第二个匹配规则，对应 <h5> 和 </h5> 之间的内容
      } else if (match[3]) {
        result += `{ "displayName": "${match[3]}", "langName": "" },\n`; // 第三个匹配规则，对应 <p class=card-title> 和 </p> 之间的内容
      } else {
        result += `${match[0]}\n`;
      }
    }

    this.setState({ result });
    message.success(`匹配成功，共找到${count}个匹配项。`);
  };
  // Rule 2 logic
  processRule2 = () => {
    const { inputText } = this.state;
    const json = JSON.parse(inputText);

    let result = "";

    for (const key in json) {
      const entry = json[key];
      const text = entry.text;
      const langZh = entry.lang_zh;

      // Perform text operations a and b
      const operationA = `{\n"displayName": "${text}",\n`;
      const operationB = `"langName": "${langZh}"\n},\n`;

      result += operationA + operationB;
    }

    this.setState({ result });
    message.success(`处理成功，共处理了${Object.keys(json).length}个条目。`);
  };

  handleMatchClick = () => {
    if (this.state.currentRule === 1) {
      this.processRule1();
    } else if (this.state.currentRule === 2) {
      this.processRule2();
    }
  };
  // 复制结果到剪贴板
  handleCopyClick = () => {
    navigator.clipboard.writeText(this.state.result).then(() => {
      message.success("结果已复制到剪贴板。");
    });
  };

  render() {
    const ruleDescription =
    this.state.currentRule === 1
      ? "本页面是一个正则匹配工具，用于根据用户输入的正则表达式查找目标文本中的匹配项。用户可以在“输入文本框”中输入需要处理的文本，在“正则规则框”中输入相应的正则表达式。点击“匹配”按钮后，工具会根据正则表达式在输入文本中搜索匹配项。匹配成功后，页面会显示匹配数量并在“匹配结果框”中显示匹配到的内容。用户可以根据需要点击“复制结果”按钮，将匹配结果复制到剪贴板。"
      : "在规则 2 中，用户需要在输入框中输入 JSON 格式的数据，然后点击“匹配”按钮。工具会根据 JSON 数据中的 'text' 和 'lang_zh' 字段进行相应的文本操作。处理成功后，页面会显示处理后的内容，并在“匹配结果框”中显示结果。用户可以根据需要点击“复制结果”按钮，将结果复制到剪贴板。";

    return (
      <Layout style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>批量文本处理器</title>
      </Helmet>
        <NavBar />
        <Layout.Content
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}
        >
          <Title level={3} style={{ marginBottom: "24px" }}>
          批量文本处理器
          </Title>
          <Radio.Group
          onChange={this.handleRuleChange}
          value={this.state.currentRule}
          style={{ marginBottom: "16px" }}
        >
          <Radio value={1}>正则处理</Radio>
          <Radio value={2}>处理 JSON 节点（无需正则）</Radio>
        </Radio.Group>
          <Typography.Paragraph
            type="secondary"
            style={{ fontSize: "14px", marginBottom: "20px" }}
          >
            {ruleDescription}
          </Typography.Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <TextArea
                placeholder="请输入文本"
                value={this.state.inputText}
                onChange={this.handleInputChange}
                rows={4}
                style={{ width: "100%", marginBottom: "16px" }}
              />
            </Col>
            <Col xs={24} md={12}>
              <Input
                placeholder="请输入正则规则"
                value={this.state.regexRule}
                onChange={this.handleRegexChange}
                style={{ width: "100%", marginBottom: "16px" }}
              />
              <Button onClick={this.handleMatchClick} style={{ marginBottom: "16px" }}>
              匹配
              </Button>
              <Button onClick={this.handleCopyClick} style={{ marginBottom: "16px" }} className="ml-2">
              复制结果
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
              <TextArea
                placeholder="匹配结果"
                value={this.state.result}
                readOnly
                rows={10}
                style={{ width: "100%", marginTop: "16px" }}
              />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    );
  }
}

// 渲染整个应用
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegexMatcher />} />
        <Route path="/translate" element={<Translate />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
