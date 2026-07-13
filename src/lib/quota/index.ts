import { adminDb } from '@/lib/firebase/admin';

const PLAN_LIMITS = {
  free:         { type: 'month', limit: 10  },
  start:        { type: 'week',  limit: 999 },  // ilimitado
  familia:      { type: 'month', limit: 30  },
  familia_plus: { type: 'month', limit: 100 },
  premium2:     { type: 'month', limit: 999 },  // ilimitado
};

export async function checkAndIncrementQuota(uid: string): Promise<boolean> {
  const userRef  = adminDb.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const user     = userSnap.data();

  const plan  = (user?.plan || 'free') as keyof typeof PLAN_LIMITS;
  const cfg   = PLAN_LIMITS[plan] || PLAN_LIMITS['free'];
  const usage = user?.aiUsage || { weekCount: 0, monthCount: 0, lastResetAt: new Date() };

  // Convert lastResetAt to Date correctly depending on if it's a Firestore Timestamp or a standard JS Date
  const rawLastReset = usage.lastResetAt || new Date();
  const lastReset = rawLastReset.toDate ? rawLastReset.toDate() : new Date(rawLastReset);

  // Verificar se precisa resetar contagem
  const now       = new Date();
  const needsReset = cfg.type === 'week'
    ? (now.getTime() - lastReset.getTime()) > 7 * 24 * 60 * 60 * 1000
    : now.getMonth() !== lastReset.getMonth();

  if (needsReset) {
    await userRef.set({
      aiUsage: {
        weekCount:  0,
        monthCount: 0,
        lastResetAt: now,
      }
    }, { merge: true });
    usage.weekCount  = 0;
    usage.monthCount = 0;
  }

  // Verificar limite
  const currentCount = cfg.type === 'week' ? usage.weekCount : usage.monthCount;
  if (currentCount >= cfg.limit) return false;

  // Incrementar
  const field = cfg.type === 'week' ? 'weekCount' : 'monthCount';
  await userRef.set({
    aiUsage: {
      [field]: currentCount + 1
    }
  }, { merge: true });

  return true;
}
