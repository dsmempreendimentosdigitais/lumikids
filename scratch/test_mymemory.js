async function testMyMemory() {
  const text = 'Era uma vez um coelhinho muito corajoso.';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|fr`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Result:', data.responseData?.translatedText);
  } catch (e) {
    console.error('Error:', e);
  }
}
testMyMemory();
