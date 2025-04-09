import { uploadImageToCloudinary } from './cloudinaryService';
import { updateUserAvatar } from './databaseService';

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