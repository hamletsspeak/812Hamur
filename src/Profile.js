import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center shimmer-text">
          Личный кабинет
        </h1>
        <div className="bg-[#1f1f1f] p-8 rounded-lg max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <p className="text-white text-xl">Вы вошли как: {user.email}</p>
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;