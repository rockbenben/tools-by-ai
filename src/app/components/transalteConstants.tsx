export const translationMethods = [
  { value: "google", label: "Google Translate" },
  { value: "azure", label: "Azure Translate" },
  { value: "deepl", label: "DeepL" },
  { value: "deeplx", label: "DeepLX（免费）" },
];

export type LanguageOption = {
  value: string;
  label: string;
  firstChoice: string;
};

export const languages: LanguageOption[] = [
  { value: "en", label: "英语（English）", firstChoice: "deepl" },
  { value: "zh", label: "中文（Chinese）", firstChoice: "deepl" },
  { value: "ja", label: "日本語", firstChoice: "deepl" },
  { value: "ko", label: "韩语（한국어）", firstChoice: "deepl" },
  { value: "es", label: "西班牙语", firstChoice: "deepl" },
  { value: "fr", label: "法语（Français）", firstChoice: "deepl" },
  { value: "de", label: "德语（Deutsch）", firstChoice: "deepl" },
  { value: "it", label: "意大利语", firstChoice: "deepl" },
  { value: "ru", label: "俄语（Русский）", firstChoice: "deepl" },
  { value: "pt", label: "葡萄牙语", firstChoice: "deepl" },
  { value: "ar", label: "阿拉伯语", firstChoice: "deepl" },
  { value: "hi", label: "印地语 (仅 Google)", firstChoice: "google" },
  { value: "bn", label: "孟加拉语 (仅 Google)", firstChoice: "google" },
];

// 判断一个变量是否是有效的 language value
export function isValidLanguageValue(testValue: string): boolean {
  return languages.some((language) => language.value === testValue);
}
