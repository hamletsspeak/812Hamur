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
    const docRef = doc(db, 'users', userId);
    
    // Получаем текущие данные
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.exists() ? currentDoc.data() : {};
    
    // Объединяем текущие данные с новыми
    const updatedData = {
      ...currentData,
      ...data,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, updatedData);
    return updatedData;
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
    if (!userId) throw new Error('User ID is required');
    
    const docRef = doc(db, 'users', userId);
    const timestamp = new Date().toISOString();
    
    const updateData = {
      ...data,
      updatedAt: timestamp,
      lastModified: timestamp
    };

    await updateDoc(docRef, updateData);
    
    // Возвращаем обновленные данные
    return updateData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
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

export const updateUserAvatar = async (userId, avatarData) => {
  try {
    const docRef = doc(db, 'users', userId);
    
    await updateDoc(docRef, {
      photoURL: avatarData.url,
      avatar: {
        url: avatarData.url,
        publicId: avatarData.publicId,
        width: avatarData.width,
        height: avatarData.height,
        updatedAt: new Date().toISOString()
      }
    });

    return avatarData;
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error);
    throw new Error('Не удалось обновить аватар в базе данных');
  }
};