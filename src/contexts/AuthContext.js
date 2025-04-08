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
import { saveUserData, getUserData, updateUserData } from '../services/databaseService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  async function signup(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Сохраняем начальные данные пользователя
      await saveUserData(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Обновляем время последнего входа
      await updateUserData(result.user.uid, {
        lastLogin: new Date().toISOString()
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function loginWithGithub() {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      // Сохраняем/обновляем данные пользователя GitHub
      await saveUserData(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        githubProfile: true,
        lastLogin: new Date().toISOString()
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function loginAnonymously() {
    try {
      const result = await signInAnonymously(auth);
      // Сохраняем данные анонимного пользователя
      await saveUserData(result.user.uid, {
        isAnonymous: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      if (!user) return;
      
      // Сначала обновляем данные о выходе в Firestore
      try {
        await updateUserData(user.uid, {
          lastLogout: new Date().toISOString()
        });
      } catch (error) {
        console.error('Ошибка при обновлении времени выхода:', error);
        // Продолжаем процесс выхода даже если не удалось обновить время
      }

      // Затем выполняем выход из Firebase Auth
      await signOut(auth);
      
      // Очищаем локальные данные пользователя после успешного выхода
      setUser(null);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      throw new Error('Не удалось выполнить выход из системы');
    }
  }

  async function setupRecaptcha(phoneNumber, appVerifier) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log('Attempting phone sign in with:', formattedPhone);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
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
      const result = await confirmationResult.confirm(code);
      // Сохраняем данные пользователя, вошедшего по телефону
      await saveUserData(result.user.uid, {
        phoneNumber: result.user.phoneNumber,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      return result;
    } catch (error) {
      console.error('Error in confirmPhoneCode:', error);
      throw error;
    }
  }

  async function updateUserProfile(data) {
    if (!user) return;
    
    try {
      // Сначала обновляем Firebase Auth
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL
      });
      
      // Создаем обновленный объект пользователя
      const updatedUser = {
        ...user,
        displayName: data.displayName,
        photoURL: data.photoURL
      };
      
      // Обновляем локальное состояние
      setUser(updatedUser);
      
      // Затем обновляем Firestore
      await updateUserData(user.uid, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      return updatedUser;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      throw new Error('Ошибка при обновлении профиля');
    }
  }

  async function updateUserPassword(newPassword) {
    if (!user) return;
    
    try {
      await updatePassword(user, newPassword);
      // Записываем в базу время последнего обновления пароля
      await updateUserData(user.uid, {
        passwordLastUpdated: new Date().toISOString()
      });
    } catch (error) {
      throw new Error('Ошибка при обновлении пароля');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // При входе загружаем дополнительные данные пользователя из Firestore
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData) {
            currentUser.additionalData = userData;
          }
        } catch (error) {
          console.error('Ошибка при загрузке данных пользователя:', error);
        }
      }
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