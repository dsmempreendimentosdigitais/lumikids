export interface PlanConfig {
  id: string;
  name: string;
  billingPeriod: 'monthly' | 'yearly';
  priceMonthlyEquivalent: number;
  priceTotal: number;
  discountBadge?: string;
  description: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, PlanConfig> = {
  monthly: {
    id: 'monthly',
    name: 'Plano Mensal',
    billingPeriod: 'monthly',
    priceMonthlyEquivalent: 29.90,
    priceTotal: 29.90,
    description: 'Acesso completo com renovação mês a mês',
    features: [
      'Acesso ilimitado a todas as 60+ histórias do acervo',
      'Todas as 991 ilustrações no estilo Puffin Rock em HD',
      'Narração de voz profissional e sincronizada',
      'Quizzes pedagógicos interativos para todas as idades',
      '5 Idiomas (Português, Inglês, Espanhol, Francês e Italiano)',
      'Sem anúncios, ambiente 100% seguro para crianças'
    ]
  },
  yearly: {
    id: 'yearly',
    name: 'Plano Anual',
    billingPeriod: 'yearly',
    priceMonthlyEquivalent: 19.90,
    priceTotal: 238.80,
    discountBadge: 'Economize 33%',
    description: 'Melhor valor: 1 ano inteiro de leitura por menos de R$ 0,66 por dia',
    features: [
      'Economia real de R$ 120,00 no ano',
      'Parcelamento em até 12x de R$ 19,90 sem juros',
      'Opção de pagamento instantâneo via PIX ou Cartão',
      'Acesso antecipado a novas histórias lançadas',
      'Desbloqueio de histórias bônus do Desafio dos 30 Dias',
      'Acesso em múltiplos dispositivos da família'
    ]
  }
};
