async function translateChunk(text, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=pt|${targetLang}`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.responseData?.translatedText || text;
}

async function translateParagraph(p, targetLang) {
  if (p.length <= 400) {
    return await translateChunk(p, targetLang);
  }
  const sentences = p.match(/[^.!?]+[.!?]+/g) || [p];
  const translatedSentences = [];
  for (const s of sentences) {
    const tr = await translateChunk(s, targetLang);
    translatedSentences.push(tr);
  }
  return translatedSentences.join(' ');
}

async function test() {
  const original = 'Era uma vez um leãozinho que vivia no alto da colina. Ele era amigo de todos os pequenos animais.';
  for (const lang of ['en', 'es', 'fr', 'it']) {
    const res = await translateParagraph(original, lang);
    console.log(`${lang.toUpperCase()}:`, res);
  }
}
test();
