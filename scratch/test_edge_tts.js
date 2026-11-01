async function testEdgeTTS() {
  try {
    const { EdgeTTS } = require('node-edge-tts');
    const tts = new EdgeTTS({ voice: 'pt-BR-FranciscaNeural', lang: 'pt-BR', outputFormat: 'audio-24khz-48kbitrate-mono-mp3' });
    console.log('node-edge-tts instantiated successfully!');
  } catch (e) {
    console.log('node-edge-tts failed:', e.message);
  }

  try {
    const { EdgeTTS: EdgeTTSUni } = require('edge-tts-universal');
    console.log('edge-tts-universal loaded successfully!');
  } catch (e) {
    console.log('edge-tts-universal failed:', e.message);
  }
}
testEdgeTTS();
