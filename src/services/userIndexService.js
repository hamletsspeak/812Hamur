import { db } from '../firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';

// Получить следующий доступный индекс пользователя
export const getNextUserIndex = async () => {
  const counterRef = doc(db, 'counters', 'userIndex');
  
  try {
    const result = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let nextIndex = 1;
      if (counterDoc.exists()) {
        nextIndex = counterDoc.data().value + 1;
      }
      
      transaction.set(counterRef, { value: nextIndex });
      return nextIndex;
    });
    
    return result;
  } catch (error) {
    console.error('Ошибка при получении следующего индекса:', error);
    throw new Error('Не удалось получить индекс пользователя');
  }
};

// Получить или создать индекс для пользователя
export const getUserIndex = async (userId) => {
  const userIndexRef = doc(db, 'userIndices', userId);
  
  try {
    const userIndexDoc = await getDoc(userIndexRef);
    
    if (userIndexDoc.exists()) {
      return userIndexDoc.data().index;
    }
    
    // Если индекс не существует, создаем новый
    const newIndex = await getNextUserIndex();
    await setDoc(userIndexRef, { index: newIndex });
    return newIndex;
  } catch (error) {
    console.error('Ошибка при получении индекса пользователя:', error);
    throw new Error('Не удалось получить индекс пользователя');
  }
};