import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const ADMIN_EMAIL = 'kylesung0901@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 구글 로그인 리디렉션 결과 처리
    getRedirectResult(auth).then(async (result) => {
      if (result?.user && result.user.email !== ADMIN_EMAIL) {
        await firebaseSignOut(auth);
      }
    }).catch(() => {});

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Popup 대신 Redirect 방식 사용 → unauthorized-domain 오류 우회
  const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user.email !== ADMIN_EMAIL) {
      await firebaseSignOut(auth);
      throw new Error('관리자 계정만 로그인 가능합니다.');
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (email !== ADMIN_EMAIL) throw new Error('관리자 계정만 가입 가능합니다.');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user.email !== ADMIN_EMAIL) {
      await firebaseSignOut(auth);
      throw new Error('관리자 계정만 로그인 가능합니다.');
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.email === ADMIN_EMAIL,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
