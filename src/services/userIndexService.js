import { supabase } from '../supabase';

// Получить следующий доступный индекс пользователя
export const getNextUserIndex = async () => {
  try {
    const { data: counter, error: readError } = await supabase
      .from('counters')
      .select('value')
      .eq('id', 'userIndex')
      .maybeSingle();
    if (readError) throw readError;

    const nextIndex = (counter?.value || 0) + 1;
    const { error: upsertError } = await supabase
      .from('counters')
      .upsert({ id: 'userIndex', value: nextIndex }, { onConflict: 'id' });
    if (upsertError) throw upsertError;

    return nextIndex;
  } catch (error) {
    console.error('Ошибка при получении следующего индекса:', error);
    throw new Error('Не удалось получить индекс пользователя');
  }
};

// Получить или создать индекс для пользователя
export const getUserIndex = async (userId) => {
  try {
    const { data: existing, error: readError } = await supabase
      .from('user_indices')
      .select('user_index')
      .eq('user_id', userId)
      .maybeSingle();
    if (readError) throw readError;

    if (existing?.user_index) {
      return existing.user_index;
    }

    const newIndex = await getNextUserIndex();
    const { error: upsertError } = await supabase
      .from('user_indices')
      .upsert({ user_id: userId, user_index: newIndex }, { onConflict: 'user_id' });
    if (upsertError) throw upsertError;

    return newIndex;
  } catch (error) {
    console.error('Ошибка при получении индекса пользователя:', error);
    throw new Error('Не удалось получить индекс пользователя');
  }
};
