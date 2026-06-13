// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 🔴 REEMPLAZA con tu configuración de Firebase 🔴
const firebaseConfig = {
  apiKey: "AIzaSyDwm3uLITtCHYmphoDBUgeNqCjU3yQsJ7A",
  authDomain: "mundial2026-97d95.firebaseapp.com",
  projectId: "mundial2026-97d95",
  storageBucket: "mundial2026-97d95.firebasestorage.app",
  messagingSenderId: "14676493794",
  appId: "1:14676493794:web:edc237cefb306eb3f2e5bb",
  measurementId: "G-DV2RNSV716"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ========== EVENTOS PARA PWA (instalación y fetch básico) ==========
self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  self.skipWaiting(); // Activa el SW inmediatamente
});

self.addEventListener('activate', event => {
  console.log('[SW] Activado');
  event.waitUntil(clients.claim()); // Toma el control de las páginas sin recargar
});

// Opcional: respuesta básica offline (muestra un mensaje si no hay red)
self.addEventListener('fetch', event => {
  // No hacemos caching por ahora, solo permitimos que la red funcione normalmente
  // pero es necesario tener el evento fetch para que el SW sea considerado "activo"
  // y la PWA se pueda instalar.
  event.respondWith(fetch(event.request));
});

// ========== MANEJO DE NOTIFICACIONES EN SEGUNDO PLANO ==========
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Mensaje en segundo plano:', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Novedad del Mundial';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: payload.notification?.icon || 'https://flagcdn.com/w40/mx.png',
    badge: payload.notification?.badge || 'https://flagcdn.com/w40/mx.png',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});