const { EdgeTTS } = require('node-edge-tts');
const fs = require('fs');
const path = require('path');

const VOICES = {
  pt: { voice: 'pt-BR-FranciscaNeural', text: 'Era uma vez uma estrelinha que iluminava a noite com bondade.' },
  fr: { voice: 'fr-FR-DeniseNeural', text: 'Il était une fois une petite étoile qui éclairait la nuit avec douceur.' },
  es: { voice: 'es-ES-ElviraNeural', text: 'Érase una vez una pequeña estrella que iluminaba la noche con dulzura.' },
  it: { voice: 'it-IT-ElsaNeural', text: "C'era una volta una piccola stella che illuminava la notte con dolcezza." },
  en: { voice: 'en-US-JennyNeural', text: 'Once upon a time, a little star brought warmth to the quiet night.' },
};

async function testAll() {
  for (const [lang, cfg] of Object.entries(VOICES)) {
    const t0 = Date.now();
    const tts = new EdgeTTS({
      voice: cfg.voice,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });
    const tmp = path.join(__dirname, `test_${lang}.mp3`);
    await tts.ttsPromise(cfg.text, tmp);
    const size = fs.statSync(tmp).size;
    fs.unlinkSync(tmp);
    console.log(`Lang: ${lang} | Voice: ${cfg.voice} | Size: ${size} bytes | Time: ${Date.now() - t0}ms`);
  }
}
testAll();
