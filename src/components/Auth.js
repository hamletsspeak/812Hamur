import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';

const Auth = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMethod, setAuthMethod] = useState('email');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, loginWithGithub } = useAuth();

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Пользователь с таким email не найден';
      case 'auth/wrong-password':
        return 'Неверный пароль';
      case 'auth/email-already-in-use':
        return 'Пользователь с таким email уже существует';
      case 'auth/weak-password':
        return 'Пароль должен содержать минимум 6 символов';
      case 'auth/invalid-email':
        return 'Некорректный email адрес';
      case 'auth/account-exists-with-different-credential':
        return 'Аккаунт уже существует с другим методом входа';
      case 'auth/popup-closed-by-user':
        return 'Окно авторизации было закрыто. Попробуйте еще раз';
      case 'auth/cancelled-popup-request':
        return 'Предыдущий запрос авторизации не был завершен';
      case 'auth/popup-blocked':
        return 'Всплывающее окно заблокировано браузером. Пожалуйста, разрешите всплывающие окна для этого сайта';
      case 'auth/unauthorized-domain':
        return 'Этот домен не авторизован для работы с Firebase. Пожалуйста, проверьте настройки Firebase';
      default:
        return 'Произошла ошибка при авторизации';
    }
  };

  const handleSuccess = (isNewUser = false) => {
    onClose();
    if (isNewUser) {
      navigate('/profile-setup');
    } else {
      navigate('/profile');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
        handleSuccess(false);
      } else {
        if (password !== confirmPassword) {
          setError('Пароли не совпадают');
          return;
        }
        await signup(email, password);
        handleSuccess(true);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    try {
      const result = await loginWithGithub();
      const isNewUser = result?.additionalUserInfo?.isNewUser;
      handleSuccess(isNewUser);
    } catch (err) {
      setError(getErrorMessage(err.code) || err.message || 'Ошибка GitHub авторизации');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Добавляем обработчик Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Обработчик клика по оверлею
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200"
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-md bg-[#1f1f1f] p-8 rounded-lg shadow-lg relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {isLogin ? 'Вход в аккаунт' : 'Создание аккаунта'}
            </h2>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  setAuthMethod('email');
                  resetForm();
                }}
                className={`px-4 py-2 rounded ${
                  authMethod === 'email' ? 'bg-blue-500' : 'bg-gray-700'
                } text-white`}
              >
                Email
              </button>
              <button
                onClick={() => {
                  setAuthMethod('github');
                  resetForm();
                }}
                className={`px-4 py-2 rounded ${
                  authMethod === 'github' ? 'bg-blue-500' : 'bg-gray-700'
                } text-white flex items-center gap-2`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {error && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded mb-6"
              >
                {error}
              </m.div>
            )}

            {authMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                {!isLogin && (
                  <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                )}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors font-semibold"
                >
                  {isLogin ? 'Войти' : 'Создать аккаунт'}
                </button>
              </form>
            )}

            {authMethod === 'github' && (
              <button
                onClick={handleGithubLogin}
                className="w-full bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                {isLogin ? 'Войти через GitHub' : 'Зарегистрироваться через GitHub'}
              </button>
            )}

            <button
              onClick={switchAuthMode}
              className="text-blue-400 mt-6 hover:underline w-full text-center"
            >
              {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default Auth;