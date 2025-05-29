import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile as updateFirebaseProfile
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

  async function signup(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Сохраняем начальные данные пользователя
      await saveUserData(result.user.uid, {
        email: result.user.email,
        displayName: '',
        photoURL: '',
        bio: '',
        location: '',
        skills: '',
        github: '',
        website: '',
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
      const isNewUser = result.additionalUserInfo.isNewUser;
      
      // Сохраняем/обновляем данные пользователя GitHub
      await saveUserData(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        githubProfile: true,
        bio: '',
        location: '',
        skills: '',
        github: result.additionalUserInfo?.profile?.html_url || '',
        website: result.additionalUserInfo?.profile?.blog || '',
        createdAt: isNewUser ? new Date().toISOString() : undefined,
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
      
      // Обновляем данные о выходе в Firestore
      try {
        await updateUserData(user.uid, {
          lastLogout: new Date().toISOString()
        });
      } catch (error) {
        console.error('Ошибка при обновлении времени выхода:', error);
      }
      
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async function updateUserProfile(profileData) {
    if (!auth.currentUser) throw new Error('Пользователь не авторизован');

    try {
      // Обновляем базовые поля в Firebase Auth
      const authUpdate = {
        displayName: profileData.displayName
      };
      if (profileData.photoURL) {
        authUpdate.photoURL = profileData.photoURL;
      }
      await updateFirebaseProfile(auth.currentUser, authUpdate);

      // Обновляем расширенные данные в Firestore
      await updateUserData(auth.currentUser.uid, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      // Обновляем локальное состояние пользователя
      const updatedUser = auth.currentUser;
      const userData = await getUserData(auth.currentUser.uid);
      setUser({
        ...updatedUser,
        ...userData
      });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setUser({ ...user, ...userData });
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    loginWithGithub,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;