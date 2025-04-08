import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authMethod, setAuthMethod] = useState('email');
  const [isLogin, setIsLogin] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, loginAnonymously, setupRecaptcha, confirmPhoneCode, loginWithGithub } = useAuth();

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
      case 'auth/invalid-phone-number':
        return 'Неверный формат номера телефона';
      case 'auth/invalid-verification-code':
        return 'Неверный код подтверждения';
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

  useEffect(() => {
    // Очищаем старый рекапчу при размонтировании
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptchaVerifier = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          setError('Время действия проверки истекло. Попробуйте еще раз.');
        }
      });
    }
  };

  const formatPhoneNumber = (phone) => {
    // Убираем все нецифровые символы
    const cleaned = phone.replace(/\D/g, '');
    // Добавляем '+' в начало, если его нет
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Пароли не совпадают');
          return;
        }
        await signup(email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!showVerificationInput) {
        setupRecaptchaVerifier();
        const formattedPhone = formatPhoneNumber(phoneNumber);
        console.log('Отправка кода на номер:', formattedPhone);
        const appVerifier = window.recaptchaVerifier;
        await setupRecaptcha(formattedPhone, appVerifier);
        setShowVerificationInput(true);
      } else {
        if (!verificationCode || verificationCode.length < 6) {
          setError('Введите корректный код подтверждения');
          return;
        }
        console.log('Подтверждение кода:', verificationCode);
        await confirmPhoneCode(verificationCode);
      }
    } catch (err) {
      console.error('Ошибка телефонной авторизации:', err);
      
      if (err.code === 'auth/invalid-verification-code') {
        setError('Неверный код подтверждения');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('Неверный формат номера телефона');
      } else if (err.code === 'auth/code-expired') {
        setError('Срок действия кода истек. Попробуйте получить новый код');
        setShowVerificationInput(false);
      } else if (err.code === 'auth/too-many-requests') {
        setError('Слишком много попыток. Попробуйте позже');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при авторизации');
      }
      
      // Очищаем reCAPTCHA только если это не ошибка кода подтверждения
      if (err.code !== 'auth/invalid-verification-code') {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
        setShowVerificationInput(false);
      }
    }
  };

  const handleAnonymousLogin = async () => {
    setError('');
    try {
      await loginAnonymously();
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    try {
      console.log('Начинаем GitHub авторизацию...');
      await loginWithGithub();
    } catch (err) {
      console.error('Ошибка GitHub авторизации:', err);
      if (err.code) {
        setError(getErrorMessage(err.code));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Произошла непредвиденная ошибка при авторизации через GitHub');
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setVerificationCode('');
    setShowVerificationInput(false);
    setError('');
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121212] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#1f1f1f] p-8 rounded-lg shadow-lg">
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
          {isLogin && (
            <button
              onClick={() => {
                setAuthMethod('anonymous');
                resetForm();
              }}
              className={`px-4 py-2 rounded ${
                authMethod === 'anonymous' ? 'bg-blue-500' : 'bg-gray-700'
              } text-white`}
            >
              Анонимно
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded mb-6">
            {error}
          </div>
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

        {authMethod === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
            <div className="phone-input-container">
              <PhoneInput
                country={'ru'}
                value={phoneNumber}
                onChange={(phone) => {
                  console.log('Введен номер телефона:', phone);
                  setPhoneNumber(phone);
                }}
                disabled={showVerificationInput}
                containerClass="phone-input"
                inputClass="!w-full !h-12 !text-white !bg-gray-700 !border-gray-600 !pl-12 !rounded"
                buttonClass="!bg-gray-700 !border-gray-600 !rounded-l"
                dropdownClass="!bg-gray-700 !text-white"
                searchClass="!bg-gray-800 !text-white"
                enableSearch={true}
                searchPlaceholder="Поиск страны..."
                inputProps={{
                  required: true,
                  placeholder: "Номер телефона"
                }}
              />
            </div>
            {showVerificationInput && (
              <input
                type="text"
                placeholder="Код подтверждения"
                value={verificationCode}
                onChange={(e) => {
                  console.log('Введен код:', e.target.value);
                  setVerificationCode(e.target.value);
                }}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                required
              />
            )}
            <div id="recaptcha-container"></div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors font-semibold"
            >
              {showVerificationInput ? 'Подтвердить код' : (isLogin ? 'Войти' : 'Создать аккаунт')}
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

        {authMethod === 'anonymous' && (
          <button
            onClick={handleAnonymousLogin}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors font-semibold"
          >
            Войти анонимно
          </button>
        )}

        <button
          onClick={switchAuthMode}
          className="text-blue-400 mt-6 hover:underline w-full text-center"
        >
          {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
};

export default Auth;