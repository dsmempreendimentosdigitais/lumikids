import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://lumikids-image-api.lumikidsapp.workers.dev';
const CLOUDFLARE_WORKER_API_KEY = process.env.CLOUDFLARE_WORKER_API_KEY || 'lumikids_segredo_12345';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPrompt = searchParams.get('prompt') || 'Cute 2D children storybook illustration';
  const seed = searchParams.get('seed') || '100';

  const cleanStyle = 'Cute 2D children storybook illustration, digital watercolor painting, flat vector art, bright sunny colors, cheerful fairytale book style, clean lines, clear sky, no text, no logo';
  const fullPrompt = `Beautiful 2D storybook drawing of ${rawPrompt.replace(/[*_#~`"']/g, '').trim()}, ${cleanStyle}`;

  // 1. Tentativa via Cloudflare Worker AI (Alta qualidade 2D, super rápido)
  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_WORKER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: fullPrompt }),
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength > 1000) {
        return new NextResponse(arrayBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }
  } catch (err: any) {
    console.warn('[Image Proxy] Cloudflare Worker erro/timeout:', err.message);
  }

  // 2. Fallback via Pollinations (sem parâmetros que causam 402)
  try {
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}`;
    const pRes = await fetch(pollinationsUrl, { signal: AbortSignal.timeout(8000) });
    if (pRes.ok) {
      const pBuffer = await pRes.arrayBuffer();
      return new NextResponse(pBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (pErr: any) {
    console.warn('[Image Proxy] Pollinations fallback erro:', pErr.message);
  }

  // 3. Resposta 404 limpa se falhar
  return new NextResponse('Image not generated', { status: 504 });
}
