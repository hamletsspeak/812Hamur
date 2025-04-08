import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

export const saveUserData = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    throw new Error('Не удалось сохранить данные пользователя');
  }
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    throw new Error('Не удалось получить данные пользователя');
  }
};

export const updateUserData = async (userId, data) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    throw new Error('Не удалось обновить данные пользователя');
  }
};

export const subscribeToUserData = (userId, callback) => {
  const docRef = doc(db, 'users', userId);
  
  // Подписываемся на изменения документа
  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Ошибка при получении данных:', error);
  });

  // Возвращаем функцию отписки
  return unsubscribe;
};

export const subscribeToUserField = (userId, field, callback) => {
  const docRef = doc(db, 'users', userId);
  
  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data[field]);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Ошибка при получении поля ${field}:`, error);
  });

  return unsubscribe;
};