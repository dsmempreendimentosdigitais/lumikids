'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User as DBUser } from '@/types/user';

interface AuthContextType {
  user: User | null;
  dbUser: DBUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  logout: async () => {},
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Obter o token do Firebase e salvar como cookie para o proxy.ts
        const token = await currentUser.getIdToken();
        document.cookie = `session=${token}; path=/; max-age=3600; SameSite=Lax`;
        
        try {
          const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
          if (docSnap.exists()) {
            setDbUser(docSnap.data() as DBUser);
          } else {
            setDbUser(null);
          }
        } catch (err) {
          console.error("Erro ao buscar dbUser", err);
        }
      } else {
        // Remover cookie ao fazer logout
        document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        setDbUser(null);
      }
    }, (error) => {
      console.error("Auth erro:", error);
      if (isMounted) setLoading(false);
    });

    // Fallback timeout in case onAuthStateChanged hangs (e.g. storage blocked on mobile)
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
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

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Erro no login via email:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, logout, signInWithGoogle, signUpWithEmail, signInWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
