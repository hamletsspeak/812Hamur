import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Auth from './components/Auth';
import { uploadUserAvatar } from './services/storageService';
import { subscribeToUserData } from './services/databaseService';
import Toast from './components/Toast';

const Profile = () => {
  const { user, logout, updateUserProfile, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.displayName || '',
    about: user?.additionalData?.about || '',
    skills: user?.additionalData?.skills || []
  });
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    let unsubscribe;
    
    if (user) {
      unsubscribe = subscribeToUserData(user.uid, (data) => {
        setUserData(data);
        setUserInfo(prev => ({
          ...prev,
          displayName: data?.displayName || user.displayName || '',
          about: data?.about || '',
          skills: data?.skills || []
        }));
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (err) {
      showToast('Ошибка при выходе из системы. Попробуйте еще раз', 'error');
      console.error('Ошибка при выходе:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      // Сохраняем все поля включая about и skills
      await updateUserProfile({
        displayName: userInfo.displayName,
        photoURL: user.photoURL,
        about: userInfo.about,
        skills: userInfo.skills,
        email: user.email,
      });

      // Обновляем локальное состояние
      setUserData(prev => ({
        ...prev,
        displayName: userInfo.displayName,
        about: userInfo.about,
        skills: userInfo.skills
      }));

      showToast('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
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
    if (!file) return;

    try {
      setIsAvatarLoading(true);
      const photoURL = await uploadUserAvatar(user.uid, file);
      
      await updateUserProfile({
        ...userInfo,
        photoURL
      });

      showToast('Аватар успешно обновлен');
    } catch (err) {
      console.error('Ошибка при загрузке аватара:', err);
      showToast(err.message || 'Ошибка при загрузке аватара', 'error');
    } finally {
      setIsAvatarLoading(false);
    }
  };

  if (!user) {
    return <Auth isOpen={true} onClose={() => navigate('/')} />;
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
        <div className="bg-[#1f1f1f] rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Профиль</h2>
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Назад
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938л3-2.647z" />
                    </svg>
                    Выход...
                  </>
                ) : (
                  'Выйти'
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Основная информация */}
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/100'}
                  alt="Аватар"
                  className={`w-24 h-24 rounded-full object-cover cursor-pointer ${isAvatarLoading ? 'opacity-50' : ''}`}
                  onClick={handleAvatarClick}
                />
                {isAvatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938л3-2.647z" />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={userInfo.displayName}
                      onChange={(e) => setUserInfo({ ...userInfo, displayName: e.target.value })}
                      className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                      placeholder="Имя пользователя"
                    />
                    <textarea
                      value={userInfo.about}
                      onChange={(e) => setUserInfo({ ...userInfo, about: e.target.value })}
                      className="w-full bg-[#2d2d2d] text-white p-2 rounded h-24"
                      placeholder="О себе"
                    />
                    <div>
                      <input
                        type="text"
                        value={userInfo.skills.join(', ')}
                        onChange={(e) => setUserInfo({ ...userInfo, skills: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                        placeholder="Навыки (через запятую)"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#2d2d2d] rounded-lg p-4">
                      <table className="w-full text-white">
                        <tbody>
                          <tr>
                            <td className="py-2 text-gray-400 w-1/3">Имя:</td>
                            <td className="py-2">{userData?.displayName || 'Не указано'}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-400">Email:</td>
                            <td className="py-2">{userData?.email || user?.email}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-400">О себе:</td>
                            <td className="py-2">{userData?.about || 'Не указано'}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-400">Навыки:</td>
                            <td className="py-2">
                              {userData?.skills?.length ? (
                                <div className="flex flex-wrap gap-2">
                                  {userData.skills.map((skill, index) => (
                                    <span 
                                      key={index}
                                      className="bg-blue-600 px-2 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : 'Не указаны'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
                    >
                      Редактировать
                    </button>
                  </div>
                )}
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;