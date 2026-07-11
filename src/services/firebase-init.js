const OBFUSCATED_CONFIG = "NksiHAg9ACpHWVAkPRtTY0tyViBaNiAoIhEQLTofFRwOdnJnUUQDGAAGNEUcAhYpRSRWTRBRR0JJCQYuDQgYR2lHDgcLEAhTXAAGE3tEelsFT1B9AwoAABYAQVVTRlFjCiwBQ1pHIxcMGAAXFXtUEAwDIBwtCAgXCWFVUURITVZWCQcUDW8aNwMTFwI2JxYRDhEVEAoQW1QjDSoNDURVYVNOS1IQWAceVF9TKAsiHwQFETwXAhUAWgBCQBAaAyAMMB8AEQw9AjAXCxAEQHlWFBtvWHdaVkBRalZUS1FWTRBRQkZoKUt5TlBMVGdTVERRTVIFCQYMVigLeQkFFVdgUgAXAxZSAgZXVBIrWyZZAxRHf0cOFwQHFEBVX1NPOSAnTltUIn4hNUA3OjJkBwMAAzA=";
const SECRET_KEY = "MiClaveSecreta2026!";

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
        const encrypted = atob(OBFUSCATED_CONFIG);
        const decrypted = xorDecrypt(encrypted, SECRET_KEY);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Error al desofuscar la configuración:', error);
        return null;
    }
}

const firebaseConfig = getFirebaseConfig();
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const messaging = firebase.messaging();
