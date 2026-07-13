import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: 'admin' | 'user';
  plan: 'free' | 'start' | 'familia' | 'familia_plus' | 'premium2';
  planExpiresAt?: Timestamp;
  stripeCustomerId?: string;
  aiUsage: {
    weekCount: number;        // free/start: reset semanal
    monthCount: number;       // demais: reset mensal
    lastResetAt: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  ageGroup: '2-4' | '5-7' | '8-10';
  birthYear?: number;
  language: 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT';
  parentalPIN?: string;           // hash bcrypt
  dailyLimitMinutes?: number;
  contentSettings: {
    bibliaKids: boolean;          // default true
    vidaDeJesus: boolean;         // default true
    horaDeDormir: boolean;        // default true
    sentimentos: boolean;         // default true
    mulheresFortes: boolean;      // default true
    inventoresGenios: boolean;    // default true
    classicosInfantis: boolean;   // default true
    paisesCulturas: boolean;      // default true
    bebes24: boolean;             // default true
    mitologiaGrega: boolean;      // default false
    budismoHinduismo: boolean;    // parental control
  };
  createdAt: Timestamp;
}
