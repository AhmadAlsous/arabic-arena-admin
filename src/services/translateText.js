import { TRANSLATE_API_URL } from '../config/constants';

export async function translateText(textToTranslate, targetLanguage) {
  const response = await fetch(TRANSLATE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: textToTranslate,
      target: targetLanguage,
      source: 'ar',
    }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data && data.data && data.data.translations) {
    
      return data.data.translations[0].translatedText;
    }
  } else {
    console.error('Failed to translate text:', await response.text());
  }
}
