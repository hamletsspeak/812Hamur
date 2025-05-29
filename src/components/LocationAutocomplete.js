import React, { useState } from 'react';

// Пример списка городов РФ (можно расширить или подключить внешний API)
const cities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Ростов-на-Дону',
  'Уфа',
  'Красноярск',
  'Воронеж',
  'Пермь',
  'Волгоград',
  'Краснодар',
  'Сочи',
  'Омск',
  'Тюмень',
  'Иркутск',
  'Хабаровск',
  'Владивосток',
  'Ярославль',
  'Томск',
  'Барнаул',
  'Калининград',
  'Саратов',
  'Тула',
  'Калуга',
  'Курск',
  'Белгород',
  'Другой...'
];

const LocationAutocomplete = ({ value, onChange, placeholder = 'Город, страна' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 0) {
      const filtered = cities.filter(city => city.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered.length ? filtered : ['Другой...']);
      setShow(true);
    } else {
      setSuggestions([]);
      setShow(false);
    }
  };

  const handleSelect = (city) => {
    onChange(city === 'Другой...' ? '' : city);
    setShow(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-[#181c23] border border-[#374151] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        autoComplete="off"
        onFocus={() => value && setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 100)}
      />
      {show && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-[#23272f] border border-[#374151] rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
          {suggestions.map((city, idx) => (
            <li
              key={city + idx}
              className="px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white text-gray-200"
              onMouseDown={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
