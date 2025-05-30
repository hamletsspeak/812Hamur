import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Auth from './components/Auth';
import { subscribeToUserData } from './services/databaseService';
import Toast from './components/Toast';
import { IMaskInput } from 'react-imask';
import LocationAutocomplete from './components/LocationAutocomplete';
import { getCityByCoords } from './utils/geoUtils';
import { useLanguage } from './contexts/LanguageContext';

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
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
  const [validationErrors, setValidationErrors] = useState({});
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = subscribeToUserData(user.uid, (data) => {
        let location = data.location || '';
        // Если поле location пустое, пробуем взять из localStorage (геолокация)
        if (!location && typeof window !== 'undefined') {
          const loc = localStorage.getItem('userLocation');
          if (loc && loc !== 'denied' && loc !== 'unsupported') {
            try {
              const { lat, lon } = JSON.parse(loc);
              getCityByCoords(lat, lon).then(city => {
                if (city) setUserInfo(prev => ({ ...prev, location: city }));
              });
            } catch {}
          }
        }
        setUserInfo({
          fullName: data.fullName || '',
          phone: data.phone || '',
          displayName: data.displayName || '',
          bio: data.bio || '',
          location: location,
          skills: data.skills || '',
          github: data.github || '',
          website: data.website || '',
          email: user.email || ''
        });
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message: typeof message === 'string' ? t(message) : message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 1000);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (err) {
      showToast('logoutError', 'error');
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
      showToast('profileUpdated');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setProfileError(err.message || String(err));
      showToast('profileUpdateError', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Валидация профиля
  function validateProfile(data) {
    const errors = {};
    if (!data.fullName || data.fullName.trim().length < 3) {
      errors.fullName = 'Введите корректное ФИО (минимум 3 символа)';
    }
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(data.phone)) {
      errors.phone = 'Введите телефон в формате +7 (XXX) XXX-XX-XX';
    }
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = 'Некорректный email';
    }
    if (!data.location || data.location.trim().length < 2) {
      errors.location = 'Укажите местоположение';
    }
    return errors;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-[#23272f] rounded-2xl shadow-2xl overflow-hidden border border-[#2d3748]">
        {toast.show && (
          <div className="pointer-events-none">
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast({ show: false, message: '', type: 'success' })}
            />
          </div>
        )}
        <div className="px-8 py-8 sm:p-10">
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition disabled:opacity-60"
            >
              {isLoading ? t('loggingOut') : t('logout')}
            </button>
          </div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center tracking-wide">
            {t('personalData')}
          </h3>
          {profileError && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
              {profileError}
            </div>
          )}
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('fullName')}</label>
              <input
                type="text"
                value={userInfo.fullName}
                onChange={e => setUserInfo({ ...userInfo, fullName: e.target.value })}
                placeholder={t('fullNamePlaceholder')}
                className={`w-full px-4 py-3 rounded-lg bg-[#181c23] border ${validationErrors.fullName ? 'border-red-500' : 'border-[#374151]'} text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                required
              />
              {validationErrors.fullName && <div className="text-red-400 text-xs mt-1">{t(validationErrors.fullName)}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('phone')}</label>
              <IMaskInput
                mask="+7 (000) 000-00-00"
                value={userInfo.phone}
                onAccept={value => setUserInfo({ ...userInfo, phone: value })}
                unmask={false}
                placeholder={t('phonePlaceholder')}
                className={`w-full px-4 py-3 rounded-lg bg-[#181c23] border ${validationErrors.phone ? 'border-red-500' : 'border-[#374151]'} text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                required
              />
              {validationErrors.phone && <div className="text-red-400 text-xs mt-1">{t(validationErrors.phone)}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={userInfo.email}
                readOnly
                className={`w-full px-4 py-3 rounded-lg bg-[#181c23] border ${validationErrors.email ? 'border-red-500' : 'border-[#374151]'} text-gray-400 cursor-not-allowed`}
              />
              {validationErrors.email && <div className="text-red-400 text-xs mt-1">{t(validationErrors.email)}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('about')}</label>
              <textarea
                value={userInfo.bio}
                onChange={e => setUserInfo({ ...userInfo, bio: e.target.value })}
                rows="3"
                placeholder={t('aboutPlaceholder')}
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('location')}</label>
              <LocationAutocomplete
                value={userInfo.location}
                onChange={val => setUserInfo({ ...userInfo, location: val })}
                placeholder={t('locationPlaceholder')}
              />
              {validationErrors.location && <div className="text-red-400 text-xs mt-1">{t(validationErrors.location)}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('skills')}</label>
              <input
                type="text"
                value={userInfo.skills}
                onChange={e => setUserInfo({ ...userInfo, skills: e.target.value })}
                placeholder={t('skillsPlaceholder')}
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
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('website')}</label>
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
                {isLoading ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;