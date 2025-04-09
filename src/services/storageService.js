import { uploadImageToCloudinary } from './cloudinaryService';
import { updateUserAvatar } from './databaseService';

// Оптимизация изображения перед загрузкой
const optimizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            })); 
          }, 
          'image/jpeg', 
          0.7
        );
      };
    };
  });
};

export const uploadUserAvatar = async (userId, file) => {
  try {
    // Загружаем в Cloudinary
    const cloudinaryResult = await uploadImageToCloudinary(file, userId);
    
    // Сохраняем информацию в базе данных
    const result = await updateUserAvatar(userId, cloudinaryResult);
    
    return result.url;
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    throw error;
  }
};