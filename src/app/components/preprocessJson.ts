/**
 * 预处理输入字符串并尝试将其解析为 JSON。
 * 如果输入不是有效的 JSON，尝试修复常见的格式问题并重新解析。
 * 如果处理失败，则抛出错误。
 *
 * @param {string} input - 待处理和解析的字符串。
 * @return {any} 解析后的 JSON 数据。
 */
export const preprocessJson = (input: string): any => {
  if (!input || !input.trim()) {
    throw new Error("输入为空。");
  }

  try {
    // 尝试直接解析原始输入
    return JSON.parse(input);
  } catch (initialError) {
    // 初始解析失败后的处理

    // 去除可能的尾部逗号和空白符
    let fixedInput = input.trim().replace(/,\s*$/, "");

    // 修复可能的引号问题
    fixedInput = fixedInput.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');

    // 尝试解析修复后的输入
    try {
      return JSON.parse(fixedInput);
    } catch (finalError) {
      // 如果再次失败，尝试用[]包裹并解析
      try {
        return JSON.parse(`[${fixedInput}]`);
      } catch (wrapError) {
        // 详细的错误信息
        throw new Error(`无效的 JSON 数据。初始错误: ${initialError.message}; 修复错误: ${finalError.message}; 包裹错误: ${wrapError.message}`);
      }
    }
  }
};
