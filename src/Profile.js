import React, { useState, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Auth from './components/Auth';
import { uploadUserAvatar } from './services/storageService';
import Toast from './components/Toast';

const Profile = () => {
  const { user, logout, updateUserProfile, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.displayName || '',
    about: '',
    skills: []
  });
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      showToast('Ошибка при выходе', 'error');
      console.error('Ошибка при выходе:', err);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        displayName: userInfo.displayName,
        photoURL: user.photoURL
      });
      showToast('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (err) {
      showToast('Ошибка при обновлении профиля', 'error');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword.length < 6) {
        showToast('Пароль должен быть не менее 6 символов', 'error');
        return;
      }
      await updateUserPassword(newPassword);
      showToast('Пароль успешно изменен');
      setNewPassword('');
    } catch (err) {
      showToast('Ошибка при смене пароля', 'error');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const photoURL = await uploadUserAvatar(file);
        await updateUserProfile({
          ...userInfo,
          photoURL
        });
        showToast('Аватар успешно обновлен');
      } catch (err) {
        showToast('Ошибка при загрузке аватара', 'error');
        console.error(err);
      }
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center shimmer-text">
          Личный кабинет
        </h1>

        <div className="bg-[#1f1f1f] p-8 rounded-lg max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            {/* Аватар */}
            <div className="relative">
              <img
                src={user.photoURL || 'https://via.placeholder.com/150'}
                alt="Аватар"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 cursor-pointer"
                onClick={handleAvatarClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full hover:bg-blue-600"
                title="Изменить аватар"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Основная информация */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl">Основная информация</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  {isEditing ? 'Отменить' : 'Редактировать'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userInfo.displayName}
                    onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
                    className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                    placeholder="Ваше имя"
                  />
                  <textarea
                    value={userInfo.about}
                    onChange={(e) => setUserInfo({...userInfo, about: e.target.value})}
                    className="w-full bg-[#2d2d2d] text-white p-2 rounded h-32"
                    placeholder="О себе"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    Сохранить
                  </button>
                </div>
              ) : (
                <div className="text-white space-y-4">
                  <p><span className="text-gray-400">Email:</span> {user.email}</p>
                  <p><span className="text-gray-400">Имя:</span> {userInfo.displayName || 'Не указано'}</p>
                  <p><span className="text-gray-400">О себе:</span> {userInfo.about || 'Не указано'}</p>
                  <p><span className="text-gray-400">Дата регистрации:</span> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Смена пароля */}
            <div className="w-full border-t border-gray-700 pt-4">
              <h3 className="text-white text-lg mb-4">Безопасность</h3>
              <div className="flex gap-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 bg-[#2d2d2d] text-white p-2 rounded"
                  placeholder="Новый пароль"
                />
                <button
                  onClick={handleChangePassword}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Сменить пароль
                </button>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-4 mt-6">
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