interface TranslateTextParams {
  text: string;
  translationMethod: string;
  targetLanguage: string;
  sourceLanguage: string;
  apiKey?: string;
  apiRegion?: string;
}

export const translateText = async ({ text, translationMethod, targetLanguage, sourceLanguage, apiKey, apiRegion = "eastasia" }: TranslateTextParams): Promise<string | null> => {
  try {
    // 如果文本为空或源语言和目标语言相同，则直接返回原文
    if (text.trim() === "" || sourceLanguage === targetLanguage) {
      return text;
    }
    switch (translationMethod) {
      case "google": {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            source: sourceLanguage,
          }),
        });

        const data = await response.json();
        return data.data.translations[0].translatedText;
      }
      case "deepl": {
        const response = await fetch("/api/deepl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            target_lang: targetLanguage,
            source_lang: sourceLanguage,
            authKey: apiKey,
          }),
        });

        const data = await response.json();
        return data.translations[0].text;
      }
      case "deeplx": {
        const url = `https://deeplx.aishort.top/translate`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            target_lang: targetLanguage,
            source_lang: sourceLanguage,
          }),
        });

        const data = await response.json();
        return data.data;
      }
      case "azure": {
        const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": apiRegion,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ Text: text }]),
        });

        const data = await response.json();
        return data[0].translations[0].text;
      }
      default:
        throw new Error(`Unsupported translation method: ${translationMethod}`);
    }
  } catch (error) {
    console.error(`Failed to translate text: ${error}`);
    return null;
  }
};
