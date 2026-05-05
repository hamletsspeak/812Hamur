import { supabase } from '../supabase';

export const saveUserData = async (userId, data) => {
  try {
    const { data: currentData, error: readError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (readError) throw readError;

    const updatedData = { ...currentData, ...data, id: userId, updatedAt: new Date().toISOString() };
    const { error } = await supabase.from('users').upsert(updatedData, { onConflict: 'id' });
    if (error) throw error;
    return updatedData;
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    throw new Error('Не удалось сохранить данные пользователя');
  }
};

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    throw new Error('Не удалось получить данные пользователя');
  }
};

export const updateUserData = async (userId, data) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const timestamp = new Date().toISOString();

    const updateData = { ...data, updatedAt: timestamp, lastModified: timestamp };
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);
    if (error) throw error;

    return updateData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
};

export const subscribeToUserData = (userId, callback) => {
  let isActive = true;

  const fetchCurrent = async () => {
    try {
      const userData = await getUserData(userId);
      if (isActive) callback(userData);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  fetchCurrent();

  const channel = supabase
    .channel(`user-profile-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
      (payload) => callback(payload.new || null)
    )
    .subscribe();

  return () => {
    isActive = false;
    supabase.removeChannel(channel);
  };
};

export const subscribeToUserField = (userId, field, callback) => {
  return subscribeToUserData(userId, (data) => {
    callback(data ? data[field] : null);
  });
};

export const updateUserAvatar = async (userId, avatarData) => {
  try {
    const { error } = await supabase.from('users').update({
      photoURL: avatarData.url,
      avatar: {
        url: avatarData.url,
        publicId: avatarData.publicId,
        width: avatarData.width,
        height: avatarData.height,
        updatedAt: new Date().toISOString()
      }
    }).eq('id', userId);
    if (error) throw error;

    return avatarData;
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error);
    throw new Error('Не удалось обновить аватар в базе данных');
  }
};
