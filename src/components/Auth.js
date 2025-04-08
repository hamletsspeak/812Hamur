import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login, signup, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Если пользователь авторизован, не показываем форму
  if (user) {
    return null;
  }

  return (
    <section id="auth" className="snap-start min-h-screen bg-[#121212] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors font-semibold"
          >
            {isLogin ? 'Авторизация' : 'Зарегистрироваться'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 mt-6 hover:underline w-full text-center"
        >
          {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт'}
        </button>
      </div>
    </section>
  );
};

export default Auth;