import { supabase } from "../supabase";

const RATING_CLIENT_ID_KEY = "site_rating_client_id_v1";

const getRatingClientId = () => {
  const existing = localStorage.getItem(RATING_CLIENT_ID_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(RATING_CLIENT_ID_KEY, nextId);
  return nextId;
};

export const saveSiteRating = async (rating) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Некорректная оценка");
  }

  const clientId = getRatingClientId();
  const { data, error } = await supabase
    .from("site_ratings")
    .insert({ rating, client_id: clientId }, { onConflict: "client_id", ignoreDuplicates: true })
    .select("id");

  if (error) {
    throw error;
  }

  return { saved: Array.isArray(data) && data.length > 0 };
};
