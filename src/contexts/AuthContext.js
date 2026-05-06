import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user] = useState({
    id: 'local-user',
    uid: 'local-user',
    email: 'guest@local.dev',
    displayName: 'Guest User'
  });

  async function signup() {
    return { user };
  }

  async function login() {
    return { user };
  }

  async function loginWithGithub() {
    return { oauth: false };
  }

  async function logout() {
    return;
  }

  async function updateUserProfile() {
    return;
  }

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
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
