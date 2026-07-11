// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
        btn.textContent = isDark ? '☀️' : '🌙';
    });
    localStorage.setItem('darkMode', isDark);
}
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
        btn.textContent = '☀️';
    });
}

function mostrarLoaderParcial(mostrar) {
    const loader = document.getElementById('partialLoader');
    if (loader) {
        if (mostrar) loader.classList.add('visible');
        else loader.classList.remove('visible');
    }
}

function traducirEquipo(nombreIngles) {
    if (!nombreIngles) return null;
    if (dic[nombreIngles]) return dic[nombreIngles];
    /* console.warn(`Nombre de equipo no traducido: ${nombreIngles}`); */
    return nombreIngles;
}

function formatearHoraLocal(fechaISO) {
    if (!fechaISO) return "Hora por confirmar";
    return new Date(fechaISO).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'America/Mazatlan' });
}
function formatearFechaLocal(fechaISO) {
    if (!fechaISO) return "Fecha por confirmar";
    return new Date(fechaISO).toLocaleDateString('es-MX', { day:'numeric', month:'short', timeZone:'America/Mazatlan' }).replace('.','');
}