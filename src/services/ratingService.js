import { supabase } from "../supabase";

const RATING_CLIENT_ID_KEY = "site_rating_client_id_v1";
const RATING_LOCK_KEY = "site_rating_locked_v1";
const RATING_VALUE_KEY = "site_rating_value_v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5;

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const readCookie = (name) => {
  if (!isBrowser()) return null;

  const target = `${encodeURIComponent(name)}=`;
  return document.cookie.split("; ").reduce((found, part) => {
    if (found) return found;
    if (!part.startsWith(target)) return null;
    return decodeURIComponent(part.slice(target.length));
  }, null);
};

const writeCookie = (name, value) => {
  if (!isBrowser()) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};

const readStoredValue = (key) => {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(key) || readCookie(key);
  } catch {
    return readCookie(key);
  }
};

const writeStoredValue = (key, value) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {}

  writeCookie(key, value);
};

const getRatingClientId = () => {
  const existing = readStoredValue(RATING_CLIENT_ID_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  writeStoredValue(RATING_CLIENT_ID_KEY, nextId);
  return nextId;
};

export const getStoredSiteRating = () => {
  const rawLocked = readStoredValue(RATING_LOCK_KEY);
  const rawRating = readStoredValue(RATING_VALUE_KEY);
  const rating = rawRating ? Number(rawRating) : 0;

  return {
    clientId: readStoredValue(RATING_CLIENT_ID_KEY),
    locked: rawLocked === "1",
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0,
  };
};

const markRatingSaved = (rating) => {
  writeStoredValue(RATING_LOCK_KEY, "1");
  writeStoredValue(RATING_VALUE_KEY, String(rating));
};

const isMissingClientIdColumnError = (error) => {
  const message = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`.toLowerCase();
  return (
    error?.code === "42703" ||
    (message.includes("client_id") && (message.includes("does not exist") || message.includes("column")))
  );
};

export const saveSiteRating = async (rating) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Некорректная оценка");
  }

  const stored = getStoredSiteRating();

  const clientId = getRatingClientId();

  const trySaveWithClientId = async () =>
    supabase
      .from("site_ratings")
      .upsert({ rating, client_id: clientId }, { onConflict: "client_id" })
      .select("id, rating");

  const trySaveWithoutClientId = async () =>
    supabase.from("site_ratings").insert({ rating }).select("id, rating");

  let response = await trySaveWithClientId();
  if (response.error && isMissingClientIdColumnError(response.error)) {
    response = await trySaveWithoutClientId();
  }

  if (response.error) {
    throw response.error;
  }

  const saved = Array.isArray(response.data) && response.data.length > 0;
  if (saved) {
    markRatingSaved(rating);
  }

  return {
    saved,
    alreadyRated: false,
    rating,
  };
};
