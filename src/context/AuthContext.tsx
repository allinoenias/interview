import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, testFirestoreConnection } from '../lib/firebase';
import { InterviewerUser } from '../types';

interface AuthContextType {
  currentUser: User | null;
  interviewerProfile: InterviewerUser | null;
  loading: boolean;
  isFirebaseConnected: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoInterviewer: (interviewerName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [interviewerProfile, setInterviewerProfile] = useState<InterviewerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  useEffect(() => {
    // Check initial connection
    testFirestoreConnection().then(connected => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'interviewers', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setInterviewerProfile({
              uid: user.uid,
              name: data.name || user.displayName || user.email?.split('@')[0] || 'Interviewer',
              email: user.email || '',
              role: data.role || 'Senior Interviewer'
            });
          } else {
            // Provision initial interviewer record
            const newProfile: InterviewerUser = {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Interviewer',
              email: user.email || '',
              role: 'Senior Interviewer'
            };
            await setDoc(docRef, {
              interviewerId: user.uid,
              name: newProfile.name,
              email: newProfile.email,
              role: newProfile.role,
              createdAt: new Date().toISOString()
            });
            setInterviewerProfile(newProfile);
          }
        } catch (e) {
          console.warn('Interviewer profile fetch warning:', e);
          // Fallback profile from user auth object
          setInterviewerProfile({
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Interviewer',
            email: user.email || '',
            role: 'Interviewer'
          });
        }
      } else {
        setInterviewerProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      const docRef = doc(db, 'interviewers', res.user.uid);
      await setDoc(docRef, {
        interviewerId: res.user.uid,
        name: name.trim() || email.split('@')[0],
        email: email,
        role: 'Senior Interviewer',
        createdAt: new Date().toISOString()
      });
      setInterviewerProfile({
        uid: res.user.uid,
        name: name.trim() || email.split('@')[0],
        email: email,
        role: 'Senior Interviewer'
      });
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginAsDemoInterviewer = async (interviewerName = 'Senior Panel Interviewer') => {
    // Try sign in with a standard academy interviewer account or create it
    const demoEmail = 'interviewer@allinoneacademy.com';
    const demoPass = 'Academy@1234';
    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        try {
          await registerWithEmail(demoEmail, demoPass, interviewerName);
        } catch (regErr: any) {
          if (regErr.code === 'auth/email-already-in-use') {
            await signInWithEmailAndPassword(auth, demoEmail, demoPass);
          } else {
            throw regErr;
          }
        }
      } else {
        throw err;
      }
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setInterviewerProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        interviewerProfile,
        loading,
        isFirebaseConnected,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemoInterviewer,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
