import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';

const storage = getStorage();

export const uploadUserAvatar = async (file) => {
  if (!auth.currentUser) {
    throw new Error('Пользователь не авторизован');
  }

  const fileRef = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`);
  
  try {
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    throw new Error('Ошибка при загрузке аватара');
  }
};