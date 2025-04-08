import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';

const storage = getStorage();

const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800; // максимальный размер стороны изображения
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          }));
        }, 'image/jpeg', 0.8); // качество 0.8
      };
    };
  });
};

export const uploadUserAvatar = async (file) => {
  if (!auth.currentUser) {
    throw new Error('Пользователь не авторизован');
  }

  try {
    // Оптимизируем изображение перед загрузкой
    const optimizedFile = await compressImage(file);
    
    const fileRef = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`);
    const snapshot = await uploadBytes(fileRef, optimizedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    throw new Error('Ошибка при загрузке аватара');
  }
};