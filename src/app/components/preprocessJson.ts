// preprocessJson.ts

/**
 * 预处理输入字符串并尝试将其解析为 JSON。
 * 如果输入不是有效的 JSON，尝试移除尾部逗号并用[]包裹以解析为数组。
 * 如果处理失败，则抛出错误。
 *
 * @param {string} input - 待处理和解析的字符串。
 * @return {any} 解析后的 JSON 数据。
 */
export const preprocessJson = (input: string): any => {
  try {
    // 尝试直接解析原始输入
    return JSON.parse(input);
  } catch (initialError) {
    // 初始解析失败后的处理

    // 如果输入以逗号结尾，则去除逗号
    const trimmedInput = input.trim().endsWith(",") ? input.trim().slice(0, -1) : input.trim();

    // 尝试用[]包裹修改后的输入并解析
    try {
      return JSON.parse(`[${trimmedInput}]`);
    } catch (finalError) {
      // 如果再次失败，抛出错误
      throw new Error("无效的 JSON 数据。");
    }
  }
};
