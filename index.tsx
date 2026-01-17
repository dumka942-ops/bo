
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical: Could not find root element to mount to");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #ea580c; font-family: sans-serif; text-align: center; background: #fff7ed; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">🐹 Ой! Бобры уронили сервер</h2>
        <p style="color: #9a3412; margin-bottom: 24px;">Произошла ошибка при загрузке интерфейса Боброблокса.</p>
        <pre style="background: #fed7aa; padding: 16px; border-radius: 12px; font-size: 12px; max-width: 80%; overflow: auto;">${err instanceof Error ? err.message : String(err)}</pre>
        <button onclick="location.reload()" style="margin-top: 24px; background: #ea580c; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;">Попробовать снова</button>
      </div>`;
  }
}
