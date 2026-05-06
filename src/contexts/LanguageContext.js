import React, { createContext, useContext, useMemo } from 'react';

const translations = {
  loginToSeeMore: 'Войдите, чтобы увидеть больше информации',
  helloWorld: 'ПРИВЕТ МИР!',
  profileUpdated: 'Профиль успешно обновлен',
  profileUpdateError: 'Ошибка при обновлении профиля',
  autosaveError: 'Ошибка автосохранения: ',
  logoutError: 'Ошибка при выходе из системы. Попробуйте еще раз',
  loggingOut: 'Выход...',
  logout: 'Выйти',
  personalData: 'Личные данные',
  fullName: 'ФИО',
  fullNamePlaceholder: 'Введите ФИО полностью',
  phone: 'Телефон',
  phonePlaceholder: 'Введите телефон',
  about: 'О себе',
  aboutPlaceholder: 'Расскажите о себе...',
  location: 'Местоположение',
  locationPlaceholder: 'Город, страна',
  skills: 'Навыки',
  skillsPlaceholder: 'Например: React, Node.js, Python',
  website: 'Личный сайт',
  saving: 'Сохранение...',
  saveChanges: 'Сохранить изменения',
  'Введите корректное ФИО (минимум 3 символа)': 'Введите корректное ФИО (минимум 3 символа)',
  'Введите телефон в формате +7 (XXX) XXX-XX-XX': 'Введите телефон в формате +7 (XXX) XXX-XX-XX',
  'Некорректный email': 'Некорректный email',
  'Укажите местоположение': 'Укажите местоположение',
  aboutTitle: 'Обо мне',
  aboutText: 'Данные ниже автоматически обновляются через HH API.',
  projectsTitle: 'Мои проекты',
  loadingProjects: 'Загрузка проектов...',
  retryAttempt: 'Повторная попытка',
  tryAgain: 'Попробовать снова',
  contactsTitle: 'Контакты',
  contactsText: 'Свяжитесь со мной удобным для вас способом',
  allRightsReserved: 'Все права защищены.',
  profileSetupTitle: 'Настройка профиля',
  skip: 'Пропустить',
  email: 'Email',
  password: 'Пароль',
  confirmPassword: 'Подтвердите пароль',
  login: 'Войти',
  register: 'Создать аккаунт',
  loginTitle: 'Вход в аккаунт',
  registerTitle: 'Создание аккаунта',
  createAccount: 'Создать новый аккаунт',
  alreadyHaveAccount: 'Уже есть аккаунт? Войти',
  userNotFound: 'Пользователь с таким email не найден',
  wrongPassword: 'Неверный пароль',
  emailInUse: 'Пользователь с таким email уже существует',
  weakPassword: 'Пароль должен содержать минимум 6 символов',
  invalidEmail: 'Некорректный email адрес',
  accountExistsWithDifferentCredential: 'Аккаунт уже существует с другим методом входа',
  popupClosed: 'Окно авторизации было закрыто. Попробуйте еще раз',
  popupCancelled: 'Предыдущий запрос авторизации не был завершен',
  popupBlocked: 'Всплывающее окно заблокировано браузером. Пожалуйста, разрешите всплывающие окна для этого сайта',
  unauthorizedDomain: 'Этот домен не авторизован. Проверьте настройки авторизации',
  authError: 'Произошла ошибка при авторизации',
  profile: 'Профиль',
  loginOrRegister: 'Войти / Регистрация',
  openGame: 'Войти в игру',
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      language: 'ru',
      setLanguage: () => {},
      t: (key) => translations[key] || key,
      translations,
    }),
    []
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
