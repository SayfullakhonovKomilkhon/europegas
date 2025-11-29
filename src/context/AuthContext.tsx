import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../firebase/config';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  phoneNumber?: string | null;
  address?: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase is not configured, don't try to authenticate
    if (!isFirebaseConfigured) {
      console.warn('Firebase not configured - user authentication disabled');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<UserData, 'uid' | 'email' | 'displayName'>;
            
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              isAdmin: userData.isAdmin || false,
              phoneNumber: user.phoneNumber || userData.phoneNumber,
              address: userData.address
            });
            
            setIsAdmin(userData.isAdmin || false);
          } else {
            // If user document doesn't exist in Firestore yet
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              isAdmin: false,
              phoneNumber: user.phoneNumber
            });
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAdmin: false,
            phoneNumber: user.phoneNumber
          });
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured');
    }

    try {
      setError(null);
      setIsLoading(true);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        isAdmin: false,
        createdAt: new Date().toISOString()
      });
      
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to create account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured');
    }

    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to sign in';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      setCurrentUser(null);
      setIsAdmin(false);
      return;
    }

    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to sign out';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured');
    }

    try {
      setError(null);
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to send password reset email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured');
    }

    try {
      setError(null);
      setIsLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      // Update Firestore document
      await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      
      if (data.isAdmin !== undefined) {
        setIsAdmin(data.isAdmin);
      }
      
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAdmin,
    isLoading,
    error,
    isConfigured: isFirebaseConfigured,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
