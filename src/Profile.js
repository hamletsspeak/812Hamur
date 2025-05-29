import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Auth from './components/Auth';
import { subscribeToUserData } from './services/databaseService';
import Toast from './components/Toast';
import { IMaskInput } from 'react-imask';
import LocationAutocomplete from './components/LocationAutocomplete';

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    phone: '',
    displayName: '',
    bio: '',
    location: '',
    skills: '',
    github: '',
    website: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    let unsubscribe;
    
    if (user) {
      unsubscribe = subscribeToUserData(user.uid, (data) => {
        if (data) {
          setUserInfo({
            fullName: data.fullName || '',
            phone: data.phone || '',
            displayName: data.displayName || '',
            bio: data.bio || '',
            location: data.location || '',
            skills: data.skills || '',
            github: data.github || '',
            website: data.website || '',
            email: user.email || ''
          });
        }
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

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setProfileError('');
    try {
      await updateUserProfile(userInfo);
      showToast('Профиль успешно обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setProfileError(err.message || String(err));
      showToast('Ошибка при обновлении профиля', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-[#23272f] rounded-2xl shadow-2xl overflow-hidden border border-[#2d3748]">
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={hideToast}
          />
        )}
        <div className="px-8 py-8 sm:p-10">
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition disabled:opacity-60"
            >
              {isLoading ? 'Выход...' : 'Выйти'}
            </button>
          </div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center tracking-wide">
            Личные данные
          </h3>
          {profileError && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
              {profileError}
            </div>
          )}
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">ФИО</label>
              <input
                type="text"
                value={userInfo.fullName}
                onChange={e => setUserInfo({ ...userInfo, fullName: e.target.value })}
                placeholder="Введите ФИО полностью"
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Телефон</label>
              <IMaskInput
                mask="+7 (000) 000-00-00"
                value={userInfo.phone}
                onAccept={value => setUserInfo({ ...userInfo, phone: value })}
                unmask={false}
                placeholder="+7 (___) ___-__-__"
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={userInfo.email}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">О себе</label>
              <textarea
                value={userInfo.bio}
                onChange={e => setUserInfo({ ...userInfo, bio: e.target.value })}
                rows="3"
                placeholder="Расскажите о себе..."
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Местоположение</label>
              <LocationAutocomplete
                value={userInfo.location}
                onChange={val => setUserInfo({ ...userInfo, location: val })}
                placeholder="Город, страна"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Навыки</label>
              <input
                type="text"
                value={userInfo.skills}
                onChange={e => setUserInfo({ ...userInfo, skills: e.target.value })}
                placeholder="Например: React, Node.js, Python"
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
                <input
                  type="url"
                  value={userInfo.github}
                  onChange={e => setUserInfo({ ...userInfo, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Личный сайт</label>
                <input
                  type="url"
                  value={userInfo.website}
                  onChange={e => setUserInfo({ ...userInfo, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition disabled:opacity-60"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;