import { adminAuth } from '@/lib/firebase/admin';

interface SendWelcomeEmailParams {
  email: string;
  name?: string;
  planName?: string;
  planAmount?: string;
  password?: string;
  paymentId?: string;
}

export async function sendWelcomeAccessEmail({
  email,
  name = 'Assinante',
  planName = 'Plano Anual',
  planAmount = 'R$ 199,90',
  password,
  paymentId
}: SendWelcomeEmailParams) {
  const cleanEmail = email.toLowerCase().trim();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contosevirtudes.com.br';
  const loginUrl = `${baseUrl}/login?email=${encodeURIComponent(cleanEmail)}`;
  const setupUrl = `${baseUrl}/app/sucesso?payment_id=${paymentId || ''}&email=${encodeURIComponent(cleanEmail)}`;

  // Gera link seguro de redefinição/criação de senha pelo Firebase Auth caso não tenha senha definida
  let resetPasswordLink = '';
  try {
    resetPasswordLink = await adminAuth.generatePasswordResetLink(cleanEmail, {
      url: `${baseUrl}/app`
    });
  } catch (err) {
    console.warn('[Email] Não foi possível gerar resetPasswordLink no Firebase:', err);
  }

  const accessLink = resetPasswordLink || setupUrl;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Bem-vindo ao Contos & Virtudes</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F7F2; margin: 0; padding: 24px; color: #1E293B; }
        .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 32px 24px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .badge { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
        .credentials { background: #FAF9F5; border: 1px solid #E5E7EB; border-radius: 16px; padding: 18px; margin: 20px 0; }
        .cred-item { margin-bottom: 10px; font-size: 14px; }
        .cred-item:last-child { margin-bottom: 0; }
        .cred-label { font-weight: 700; color: #475569; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .cred-value { font-weight: 600; color: #0F172A; font-size: 15px; font-family: monospace; }
        .btn { display: inline-block; width: 100%; box-sizing: border-box; background: #0D9488; color: #FFFFFF !important; text-decoration: none; padding: 16px; border-radius: 14px; font-weight: 700; text-align: center; font-size: 16px; margin: 16px 0 8px; }
        .footer { padding: 20px 28px 28px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>⭐ Contos & Virtudes</h1>
          <p>Histórias Clássicas com Valores para a Família</p>
        </div>
        
        <div class="content">
          <div class="badge">👑 Assinatura Confirmada</div>
          <h2 style="margin-top: 0; color: #0F172A; font-size: 20px;">Olá, ${name}!</h2>
          <p>Seu pagamento para o <strong>${planName}</strong> foi aprovado com sucesso! Todo o acervo com mais de 60 histórias ilustradas, áudio acolhedor e quizzes já está liberado para você e sua família.</p>
          
          <div class="credentials">
            <div class="cred-item">
              <span class="cred-label">Seu E-mail de Acesso</span>
              <span class="cred-value">${cleanEmail}</span>
            </div>
            ${password ? `
              <div class="cred-item">
                <span class="cred-label">Sua Senha Definida</span>
                <span class="cred-value">${password}</span>
              </div>
            ` : `
              <div class="cred-item">
                <span class="cred-label">Status da Senha</span>
                <span class="cred-value" style="font-family: inherit; font-size: 13px; color: #0D9488;">
                  Pronta para ser criada no botão abaixo
                </span>
              </div>
            `}
          </div>

          <p style="font-size: 14px; color: #475569;">
            ${password 
              ? 'Você já pode entrar diretamente no aplicativo com seu e-mail e senha:' 
              : 'Clique no botão abaixo para definir sua senha de acesso ou entrar diretamente:'}
          </p>

          <a href="${accessLink}" class="btn">
            ${password ? 'Entrar no Aplicativo Agora →' : 'Criar Senha & Acessar Histórias →'}
          </a>

          <p style="font-size: 12px; color: #64748B; text-align: center; margin-top: 12px;">
            Dica: Você também pode entrar com 1 clique utilizando sua conta do Google associada a este e-mail.
          </p>
        </div>

        <div class="footer">
          Contos & Virtudes • Refúgio de histórias saudáveis para crianças.<br>
          Precisa de suporte? Responda a este e-mail ou fale conosco em contato@contosevirtudes.com.br
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Envio via Resend API (se configurado em RESEND_API_KEY)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Contos & Virtudes <boasvindas@contosevirtudes.com.br>',
          to: [cleanEmail],
          subject: '🎉 Seu acesso ao Contos & Virtudes está liberado!',
          html: htmlContent
        })
      });

      if (resendRes.ok) {
        console.log(`[Email] ✅ E-mail de boas-vindas enviado com sucesso via Resend para ${cleanEmail}`);
        return { success: true, provider: 'resend' };
      } else {
        const errText = await resendRes.text();
        console.warn('[Email] Falha na API do Resend:', errText);
      }
    } catch (sendErr) {
      console.error('[Email] Erro ao disparar email via Resend:', sendErr);
    }
  }

  // 2. Log e registro para auditoria quando não houver RESEND_API_KEY configurado
  console.log(`[Email Mock/Local] Disparo de boas-vindas para: ${cleanEmail}`);
  console.log(`[Email Mock/Local] Link de ativação: ${accessLink}`);

  return { success: true, provider: 'logged', accessLink };
}
