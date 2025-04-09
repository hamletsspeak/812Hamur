const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dkpomb0py/upload';
const UPLOAD_PRESET = 'my_portfolio_preset';

// Обновляем конфигурацию для аватаров
const AVATAR_CONFIG = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
};

const optimizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const { maxWidth, maxHeight } = AVATAR_CONFIG;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
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
          AVATAR_CONFIG.quality
        );
      };
    };
  });
};

export const uploadImageToCloudinary = async (file, userId) => {
  try {
    if (file.size > AVATAR_CONFIG.maxFileSize) {
      throw new Error(`Файл слишком большой. Максимальный размер ${AVATAR_CONFIG.maxFileSize / 1024 / 1024}MB`);
    }
    
    if (!AVATAR_CONFIG.acceptedTypes.includes(file.type)) {
      throw new Error('Неподдерживаемый формат файла. Допустимы: JPG, PNG, WebP');
    }

    const optimizedFile = await optimizeImage(file);
    
    const formData = new FormData();
    formData.append('file', optimizedFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'avatars');
    formData.append('public_id', `user_${userId}_${Date.now()}`); // Добавляем timestamp для уникальности
    formData.append('transformation', 'w_400,h_400,c_fill,g_face'); // Crop по лицу

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке изображения');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Ошибка при загрузке в Cloudinary:', error);
    throw error;
  }
};
