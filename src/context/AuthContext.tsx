'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Obter o token do Firebase e salvar como cookie para o proxy.ts
        const token = await currentUser.getIdToken();
        document.cookie = `session=${token}; path=/; max-age=3600; SameSite=Lax`;
      } else {
        // Remover cookie ao fazer logout
        document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      // Garantir que exista no banco
      await setDoc(doc(db, 'users', res.user.uid), {
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        plan: 'free',
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao entrar com Google:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      
      // Salvar os detalhes extras no Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        displayName: name,
        phone,
        plan: 'free',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Erro no cadastro via email:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, signInWithGoogle, signUpWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
