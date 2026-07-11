let serviceWorkerRegistration = null;

async function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./src/utils/firebase-messaging-sw.js');
            console.log('Service Worker registrado:', registration);
            serviceWorkerRegistration = registration;
        } catch (err) {
            console.error('Error al registrar SW:', err);
        }
    }
}
registrarServiceWorker();

async function solicitarPermisoFCM() {
    try {
        if (!('Notification' in window)) {
            alert('Tu navegador no soporta notificaciones push.');
            return;
        }
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Necesitas permitir las notificaciones para recibir alertas');
            return;
        }
        if (!serviceWorkerRegistration) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!serviceWorkerRegistration) {
                alert('El Service Worker no está listo. Intenta de nuevo en unos segundos.');
                return;
            }
        }
        const vapidKey = 'BJYFgBfPbfuj6CIrLfgoSACHMTMHamp2X15xWiBVugFh0E5iP7IDqiNpT4U6nrJ7i4prC0haHd54Dn0mtxN0j40';
        const token = await messaging.getToken({ vapidKey, serviceWorkerRegistration });
        if (token) {
            console.log('Token FCM:', token);
            localStorage.setItem('fcm_token', token);
            alert('✅ Notificaciones push activadas correctamente');
        } else {
            alert('No se pudo obtener el token. Revisa la configuración.');
        }
    } catch (error) {
        console.error('Error al obtener token FCM:', error);
        alert('Error al activar notificaciones: ' + error.message);
    }
}

function enviarNotificacionLocal(titulo, cuerpo, tipo = 'general') {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (document.visibilityState === 'visible') {
        new Notification(titulo, { body: cuerpo, icon: 'https://flagcdn.com/w160/mx.png' });
    } else {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(titulo, {
                    body: cuerpo,
                    icon: 'https://flagcdn.com/w160/mx.png',
                    badge: 'https://flagcdn.com/w160/mx.png',
                    vibrate: [200, 100, 200]
                });
            }).catch(err => console.error('Error con SW:', err));
        } else {
            new Notification(titulo, { body: cuerpo });
        }
    }
}
