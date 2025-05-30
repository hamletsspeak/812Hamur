import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { IMaskInput } from 'react-imask';
import LocationAutocomplete from './LocationAutocomplete';
import { getCityByCoords } from '../utils/geoUtils';
import { useLanguage } from "../contexts/LanguageContext";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    location: '',
    skills: '',
    github: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors] = useState({});

  useEffect(() => {
    if (!formData.location && typeof window !== 'undefined') {
      const loc = localStorage.getItem('userLocation');
      if (loc && loc !== 'denied' && loc !== 'unsupported') {
        try {
          const { lat, lon } = JSON.parse(loc);
          getCityByCoords(lat, lon).then(city => {
            if (city) setFormData(prev => ({ ...prev, location: city }));
          });
        } catch {}
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhone = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...formData,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      navigate('/profile');
    } catch (err) {
      console.error('Ошибка при сохранении профиля:', err);
      setError('Произошла ошибка при сохранении данных профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-[#23272f] p-8 rounded-2xl shadow-2xl border border-[#2d3748]">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {t("profileSetupTitle")}
        </h2>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("fullName")}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Введите ФИО полностью"
                className={`w-full px-4 py-3 rounded-lg bg-[#181c23] border ${validationErrors.fullName ? 'border-red-500' : 'border-[#374151]'} text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                required
              />
              {validationErrors.fullName && <div className="text-red-400 text-xs mt-1">{validationErrors.fullName}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("phone")}
              </label>
              <IMaskInput
                mask="+7 (000) 000-00-00"
                value={formData.phone}
                onAccept={handlePhone}
                unmask={false}
                placeholder="+7 (___) ___-__-__"
                className={`w-full px-4 py-3 rounded-lg bg-[#181c23] border ${validationErrors.phone ? 'border-red-500' : 'border-[#374151]'} text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                required
              />
              {validationErrors.phone && <div className="text-red-400 text-xs mt-1">{validationErrors.phone}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className={`w-full px-4 py-3 rounded-lg bg-[#181c23] border ${validationErrors.email ? 'border-red-500' : 'border-[#374151]'} text-gray-400 cursor-not-allowed`}
              />
              {validationErrors.email && <div className="text-red-400 text-xs mt-1">{validationErrors.email}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("about")}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                placeholder="Расскажите о себе..."
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("location")}
              </label>
              <LocationAutocomplete
                value={formData.location}
                onChange={val => setFormData(prev => ({ ...prev, location: val }))}
                placeholder="Город, страна"
              />
              {validationErrors.location && <div className="text-red-400 text-xs mt-1">{validationErrors.location}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("skills")}
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Например: React, Node.js, Python"
                className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t("website")}
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition disabled:opacity-60"
            >
              {loading ? t("saving") : t("saveChanges")}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-lg border border-gray-500 transition"
            >
              {t("skip")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;