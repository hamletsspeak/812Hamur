const createImagePlaceholder = (width, height, color = '#1f1f1f') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const generateBlurHash = async (imageUrl) => {
  try {
    const img = await preloadImage(imageUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = 32; // низкое разрешение для блюра
    canvas.height = (32 * img.height) / img.width;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.1);
  } catch (error) {
    console.error('Error generating blur hash:', error);
    return null;
  }
};

export { createImagePlaceholder, preloadImage, generateBlurHash };