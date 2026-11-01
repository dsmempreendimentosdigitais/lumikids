const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const getVal = (k) => {
  const l = lines.find(x => x.startsWith(k + '='));
  return l ? l.replace(k + '=', '').trim().replace(/^['"]|['"]$/g, '') : '';
};

const workerUrl = getVal('CLOUDFLARE_WORKER_URL');
const workerKey = getVal('CLOUDFLARE_WORKER_API_KEY');

console.log('Worker URL:', workerUrl);
console.log('Worker Key length:', workerKey.length);
