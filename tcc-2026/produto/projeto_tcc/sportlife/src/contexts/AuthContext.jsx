import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: profile?.full_name || firebaseUser.displayName || '',
          photo_url: profile?.photo_url || firebaseUser.photoURL || '',
          bio: profile?.bio || '',
          city: profile?.city || '',
          sports: profile?.sports || [],
          followers_count: profile?.followers_count || 0,
          following_count: profile?.following_count || 0,
          posts_count: profile?.posts_count || 0,
          ...profile,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch {
      return null;
    }
  };

  const register = async (email, password, fullName = '') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) await updateProfile(cred.user, { displayName: fullName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      full_name: fullName || email.split('@')[0],
      photo_url: '',
      bio: '',
      city: '',
      sports: [],
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      created_at: serverTimestamp(),
    });
    return cred;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const snap = await getDoc(doc(db, 'users', result.user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        full_name: result.user.displayName || '',
        photo_url: result.user.photoURL || '',
        bio: '',
        city: '',
        sports: [],
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: serverTimestamp(),
      });
    }
    return result;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateMe = async (data) => {
    if (!user?.uid) return;
    await setDoc(doc(db, 'users', user.uid), { ...data, updated_at: serverTimestamp() }, { merge: true });
    if (data.full_name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.full_name });
    }
    const updated = await fetchUserProfile(user.uid);
    setUser((prev) => ({ ...prev, ...data, ...updated }));
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const updated = await fetchUserProfile(auth.currentUser.uid);
    if (updated) setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoadingAuth,
      register, login, loginWithGoogle, logout,
      resetPassword, updateMe, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
