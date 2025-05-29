// utils/geoUtils.js
// Получение города по координатам через Nominatim (OpenStreetMap)
export async function getCityByCoords(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`;
    const res = await fetch(url, { headers: { 'User-Agent': 'my-portfolio/1.0' } });
    if (!res.ok) return '';
    const data = await res.json();
    // Варианты: city, town, village, state, country
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.state ||
      data.address.country ||
      ''
    );
  } catch (e) {
    return '';
  }
}
