import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber,
  signInWithPopup,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { auth, githubProvider } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGithub() {
    return signInWithPopup(auth, githubProvider);
  }

  function logout() {
    return signOut(auth);
  }

  function loginAnonymously() {
    return signInAnonymously(auth);
  }

  async function setupRecaptcha(phoneNumber, appVerifier) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log('Attempting phone sign in with:', formattedPhone);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      console.log('Phone sign in successful, confirmation result:', confirmation);
      setConfirmationResult(confirmation);
      return confirmation;
    } catch (error) {
      console.error('Error in setupRecaptcha:', error);
      throw error;
    }
  }

  async function confirmPhoneCode(code) {
    try {
      if (!confirmationResult) {
        throw new Error('Сначала необходимо отправить код подтверждения');
      }
      console.log('Attempting to confirm code:', code);
      const result = await confirmationResult.confirm(code);
      console.log('Code confirmation successful:', result);
      return result;
    } catch (error) {
      console.error('Error in confirmPhoneCode:', error);
      throw error;
    }
  }

  async function updateUserProfile(data) {
    if (!user) return;
    
    try {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL
      });
      
      // Обновляем локальное состояние пользователя
      setUser({ ...user });
    } catch (error) {
      throw new Error('Ошибка при обновлении профиля');
    }
  }

  async function updateUserPassword(newPassword) {
    if (!user) return;
    
    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      throw new Error('Ошибка при обновлении пароля');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    loginAnonymously,
    setupRecaptcha,
    confirmPhoneCode,
    loginWithGithub,
    updateUserProfile,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-white text-xl">Загрузка...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
}