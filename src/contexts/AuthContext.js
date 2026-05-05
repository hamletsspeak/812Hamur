import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const signedUpUser = data.user;
      if (!signedUpUser) throw new Error('Не удалось создать пользователя');

      // Сохраняем начальные данные пользователя
      await saveUserData(signedUpUser.id, {
        email: signedUpUser.email,
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
      return { user: signedUpUser };
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const loggedInUser = data.user;
      if (!loggedInUser) throw new Error('Не удалось авторизоваться');

      // Обновляем время последнего входа
      await updateUserData(loggedInUser.id, {
        lastLogin: new Date().toISOString()
      });
      return { user: loggedInUser };
    } catch (error) {
      throw error;
    }
  }

  async function loginWithGithub() {
    try {
      const isLocalhost = window.location.hostname === 'localhost';
      const redirectTo = isLocalhost
        ? 'http://localhost:3000/#/profile'
        : 'https://www.hamleturu.ru/#/profile';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo }
      });
      if (error) throw error;
      return { oauth: true };
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
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async function updateUserProfile(profileData) {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      // Обновляем базовые поля в Supabase Auth metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL || null
        }
      });
      if (authUpdateError) throw authUpdateError;

      // Обновляем расширенные данные в таблице users
      await updateUserData(user.uid, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      const { data: authData } = await supabase.auth.getUser();
      const updatedUser = authData?.user;
      const userData = await getUserData(user.uid);
      setUser({
        ...updatedUser,
        ...userData
      });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user || null;
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser.id);
          setUser({ ...currentUser, uid: currentUser.id, ...userData });
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          setUser({ ...currentUser, uid: currentUser.id });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const currentUser = session?.user || null;
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser.id);
          setUser({ ...currentUser, uid: currentUser.id, ...userData });
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          setUser({ ...currentUser, uid: currentUser.id });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
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
