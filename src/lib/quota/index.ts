import { adminDb } from '@/lib/firebase/admin';

const PLAN_LIMITS = {
  free:         { type: 'week',  limit: 2   },
  start:        { type: 'week',  limit: 999 },  // ilimitado
  familia:      { type: 'month', limit: 30  },
  familia_plus: { type: 'month', limit: 100 },
  premium2:     { type: 'month', limit: 999 },  // ilimitado
};

export async function checkAndIncrementQuota(uid: string): Promise<boolean> {
  const userRef  = adminDb.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const user     = userSnap.data();

  if (!user) return false;

  const plan  = user.plan as keyof typeof PLAN_LIMITS;
  const cfg   = PLAN_LIMITS[plan];
  const usage = user.aiUsage;

  // Verificar se precisa resetar contagem
  const now       = new Date();
  const lastReset = usage.lastResetAt.toDate();
  const needsReset = cfg.type === 'week'
    ? (now.getTime() - lastReset.getTime()) > 7 * 24 * 60 * 60 * 1000
    : now.getMonth() !== lastReset.getMonth();

  if (needsReset) {
    await userRef.update({
      'aiUsage.weekCount':  0,
      'aiUsage.monthCount': 0,
      'aiUsage.lastResetAt': now,
    });
    usage.weekCount  = 0;
    usage.monthCount = 0;
  }

  // Verificar limite
  const currentCount = cfg.type === 'week' ? usage.weekCount : usage.monthCount;
  if (currentCount >= cfg.limit) return false;

  // Incrementar
  const field = cfg.type === 'week' ? 'aiUsage.weekCount' : 'aiUsage.monthCount';
  await userRef.update({ [field]: currentCount + 1 });

  return true;
}
