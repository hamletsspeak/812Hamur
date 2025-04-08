import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Измеряем и отправляем метрики производительности
reportWebVitals(metric => {
  // Можно отправлять метрики в Google Analytics или другой сервис аналитики
  console.log(metric);
  
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value), // Округляем значение
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
});
