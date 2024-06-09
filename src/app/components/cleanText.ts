// cleanText.ts

/**
 * 清理输入文本，移除空行和前后空格。
 * @param {string} inputText - 待清理的文本。
 * @return {object} 包含两个属性：cleanedArray (清理后的文本数组) 和 cleanedText (清理并组合后的文本字符串)。
 */
export const cleanText = (inputText) => {
  const cleanedArray = inputText
    .split("\n")
    .map((line) => line.trim()) // 移除每行的前后空格
    .filter((line) => line); // 移除空行

  const cleanedText = cleanedArray.join("\n"); // 重新组合文本

  return { cleanedArray, cleanedText };
};
