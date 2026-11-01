async function testPollinationsModels() {
  const prompt = encodeURIComponent('A cute little bird on a blossoming branch, vibrant storybook illustration, clean lines');
  const models = ['flux', 'turbo', 'unity', 'midjourney', 'deliberate'];
  for (const m of models) {
    try {
      const url = `https://image.pollinations.ai/prompt/${prompt}?model=${m}&nologo=true`;
      console.log('Testing', m, '...');
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      console.log(`[${m}] status:`, res.status, res.headers.get('content-type'));
    } catch (e) {
      console.log(`[${m}] error:`, e.message);
    }
  }
}
testPollinationsModels();
