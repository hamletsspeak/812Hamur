import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Toast from './components/Toast';
import { IMaskInput } from 'react-imask';
import LocationAutocomplete from './components/LocationAutocomplete';
import { getCityByCoords } from './utils/geoUtils';
import { useLanguage } from './contexts/LanguageContext';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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
  const [validationErrors] = useState({});
  const PROFILE_STORAGE_KEY = 'local_profile_data_v1';

  useEffect(() => {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserInfo((prev) => ({ ...prev, ...parsed, email: user?.email || prev.email }));
      } catch {}
    }

    if (!raw && typeof window !== 'undefined') {
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
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message: typeof message === 'string' ? t(message) : message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 1000);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setProfileError('');
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userInfo));
      showToast('profileUpdated');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setProfileError(err.message || String(err));
      showToast('profileUpdateError', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {toast.show && (
          <div className="pointer-events-none">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ show: false, message: '', type: 'success' })}
            />
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('profile')}</h1>
            <p className="text-slate-500 mt-1">Личный кабинет и данные аккаунта</p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
            <span className="font-semibold">Режим:</span> профиль работает без авторизации
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Аккаунт</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Email:</span> {userInfo.email || '-'}</p>
              <p><span className="font-semibold text-slate-800">GitHub:</span> {userInfo.github || 'не указан'}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('personalData')}</h3>
            {profileError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-xl mb-4">
                {profileError}
              </div>
            )}

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('fullName')}</label>
                  <input
                    type="text"
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                    placeholder={t('fullNamePlaceholder')}
                    className={`w-full px-4 py-3 rounded-xl bg-white border ${validationErrors.fullName ? 'border-red-500' : 'border-slate-200'} text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition`}
                    required
                  />
                  {validationErrors.fullName && <div className="text-red-400 text-xs mt-1">{t(validationErrors.fullName)}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('phone')}</label>
                  <IMaskInput
                    mask="+7 (000) 000-00-00"
                    value={userInfo.phone}
                    onAccept={(value) => setUserInfo({ ...userInfo, phone: value })}
                    unmask={false}
                    placeholder={t('phonePlaceholder')}
                    className={`w-full px-4 py-3 rounded-xl bg-white border ${validationErrors.phone ? 'border-red-500' : 'border-slate-200'} text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition`}
                    required
                  />
                  {validationErrors.phone && <div className="text-red-400 text-xs mt-1">{t(validationErrors.phone)}</div>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  readOnly
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${validationErrors.email ? 'border-red-500' : 'border-slate-200'} text-slate-500 cursor-not-allowed`}
                />
                {validationErrors.email && <div className="text-red-400 text-xs mt-1">{t(validationErrors.email)}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">{t('about')}</label>
                <textarea
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                  rows="3"
                  placeholder={t('aboutPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">{t('location')}</label>
                <LocationAutocomplete
                  value={userInfo.location}
                  onChange={(val) => setUserInfo({ ...userInfo, location: val })}
                  placeholder={t('locationPlaceholder')}
                />
                {validationErrors.location && <div className="text-red-400 text-xs mt-1">{t(validationErrors.location)}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">{t('skills')}</label>
                <input
                  type="text"
                  value={userInfo.skills}
                  onChange={(e) => setUserInfo({ ...userInfo, skills: e.target.value })}
                  placeholder={t('skillsPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={userInfo.github}
                    onChange={(e) => setUserInfo({ ...userInfo, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('website')}</label>
                  <input
                    type="url"
                    value={userInfo.website}
                    onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg transition disabled:opacity-60"
                >
                  {isLoading ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
