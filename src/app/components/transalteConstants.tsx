export const translationMethods = [
  { value: "google", label: "Google Translate" },
  { value: "deepl", label: "DeepL" },
  { value: "deeplx", label: "DeepLX（免费，无需填 API）" },
];

export type LanguageOption = {
  value: string;
  label: string;
};

export const languages: LanguageOption[] = [
  { value: "en", label: "英语（English）" },
  { value: "zh", label: "中文（Chinese）" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "韩语（한국어）" },
  { value: "es", label: "西班牙语" },
  { value: "fr", label: "法语（Français）" },
  { value: "de", label: "德语（Deutsch）" },
  { value: "it", label: "意大利语" },
  { value: "ru", label: "俄语（Русский）" },
  { value: "pt", label: "葡萄牙语" },
  { value: "ar", label: "阿拉伯语" },
  { value: "hi", label: "印地语 (仅 Google)" },
  { value: "bn", label: "孟加拉语 (仅 Google)" },
];
