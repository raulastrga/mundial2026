// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ========== DATOS OFUSCADOS (reemplaza con los valores que obtuviste) ==========
const OBFUSCATED_CONFIG = "NksiHAg9ACpHWVAkPRtTY0tyViBaNiAoIhEQLTofFRwOdnJnUUQDGAAGNEUcAhYpRSRWTRBRR0JJCQYuDQgYR2lHDgcLEAhTXAAGE3tEelsFT1B9AwoAABYAQVVTRlFjCiwBQ1pHIxcMGAAXFXtUEAwDIBwtCAgXCWFVUURITVZWCQcUDW8aNwMTFwI2JxYRDhEVEAoQW1QjDSoNDURVYVNOS1IQWAceVF9TKAsiHwQFETwXAhUAWgBCQBAaAyAMMB8AEQw9AjAXCxAEQHlWFBtvWHdaVkBRalZUS1FWTRBRQkZoKUt5TlBMVGdTVERRTVIFCQYMVigLeQkFFVdgUgAXAxZSAgZXVBIrWyZZAxRHf0cOFwQHFEBVX1NPOSAnTltUIn4hNUA3OjJkBwMAAzA="; // string largo
const SECRET_KEY = "MiClaveSecreta2026!";

// Función de desofuscación
function xorDecrypt(encryptedText, key) {
  let result = '';
  for (let i = 0; i < encryptedText.length; i++) {
    const charCode = encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

function getFirebaseConfig() {
  try {
    // Decodificar Base64 -> texto cifrado
    const encrypted = atob(OBFUSCATED_CONFIG);
    // Descifrar XOR -> JSON string
    const decrypted = xorDecrypt(encrypted, SECRET_KEY);
    // Parsear objeto
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error al desofuscar la configuración:', error);
    return null;
  }
}

// ========== INICIALIZACIÓN ==========
const firebaseConfig = getFirebaseConfig();
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
} else {
  console.error('No se pudo recuperar la configuración de Firebase');
}

const messaging = firebase.messaging();

// ========== EVENTOS PARA PWA ==========
self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activado');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

// ========== NOTIFICACIONES EN SEGUNDO PLANO ==========
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
  event.waitUntil(clients.openWindow('/'));
});