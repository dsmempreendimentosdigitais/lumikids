async function testGoogleTranslate() {
  const text = 'Era uma vez um coelhinho corajoso.';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=fr&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('Status:', res.status);
    const textRes = await res.text();
    console.log('Text:', textRes.slice(0, 200));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
testGoogleTranslate();
