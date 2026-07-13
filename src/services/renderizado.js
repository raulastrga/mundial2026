function calcularEquiposEliminados() {
    equiposEliminadosGlobal.clear();
    
    Object.values(eliminatoriasPorMatchNumber).forEach(p => {
        if (p.status === 'FINISHED' && p.home && p.away) {
            const t1Normal = traducirEquipo(p.home);
            const t2Normal = traducirEquipo(p.away);
            
            // Verificamos si hubo penales
            if (p.hPen !== null && p.aPen !== null) {
                if (p.hPen > p.aPen) equiposEliminadosGlobal.add(t2Normal);
                else if (p.aPen > p.hPen) equiposEliminadosGlobal.add(t1Normal);
            } else {
                // Verificamos goles regulares o prórroga
                if (p.hScore > p.aScore) equiposEliminadosGlobal.add(t2Normal);
                else if (p.aScore > p.hScore) equiposEliminadosGlobal.add(t1Normal);
            }
        }
    });
}

function renderizarBracketDefinitivo() {
    const wrapper = document.getElementById('bracket-wrapper');
    if (!wrapper) return;

    // EL MAPA MAESTRO: Completamente infalible.
    // Usamos los números oficiales (MatchNumber) agrupados exactamente como la FIFA los cruza.
    const layout = [
        { nombre: '16vos (Izq)', clase: 'col-16-izq', partidos: [74, 77, 73, 75, 83, 84, 81, 82] },
        { nombre: '8vos (Izq)',  clase: 'col-8-izq',  partidos: [89, 90, 93, 94] },
        { nombre: '4tos (Izq)',  clase: 'col-4-izq',  partidos: [97, 98] },
        { nombre: 'Semi (Izq)',  clase: 'col-2-izq',  partidos: [101] },
        { nombre: 'FINAL',       clase: 'col-final',  partidos: [104, 103] },
        { nombre: 'Semi (Der)',  clase: 'col-2-der',  partidos: [102] },
        { nombre: '4tos (Der)',  clase: 'col-4-der',  partidos: [99, 100] },
        { nombre: '8vos (Der)',  clase: 'col-8-der',  partidos: [91, 92, 95, 96] },
        { nombre: '16vos (Der)', clase: 'col-16-der', partidos: [76, 78, 79, 80, 86, 88, 85, 87] }
    ];

    let html = '';

    layout.forEach(col => {
        html += `<div class="bracket-column ${col.clase}">
                    <div class="bracket-column-title">${col.nombre}</div>`;

        col.partidos.forEach(matchNum => {
            if (matchNum === 103) {
                html += `<div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; margin: 15px 0 5px 0; text-transform: uppercase;">3er Lugar</div>`;
            }
            const p = eliminatoriasPorMatchNumber[matchNum];

            if (p) {
                // Si el equipo ya clasificó, mostramos su nombre. Si no, mostramos el código (Ej. 1A, W73)
                const t1 = p.home || p.phA || 'TBD';
                const t2 = p.away || p.phB || 'TBD';

                // Buscamos a los dueños y las banderas (funcionará perfecto porque 't1' ya viene en español)
                function buscarEquipo(nombre) {
                    if (equiposDatos[nombre]) return equiposDatos[nombre];
                    // Intenta buscar ignorando acentos o variaciones leves
                    const claveNormalizada = Object.keys(equiposDatos).find(key => 
                        key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 
                        nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    );
                    return equiposDatos[claveNormalizada] || null;
                }

                const t1Normal = traducirEquipo(t1);
                const t2Normal = traducirEquipo(t2);

                // Dentro del bucle de partidos:
                const eq1 = buscarEquipo(t1Normal);
                const eq2 = buscarEquipo(t2Normal);

                const c1 = eq1 ? eq1.d : '';
                const c2 = eq2 ? eq2.d : '';
                const b1 = eq1 ? eq1.c : '';
                const b2 = eq2 ? eq2.c : '';

                const scr1 = p.hScore !== null ? p.hScore : '-';
                const scr2 = p.aScore !== null ? p.aScore : '-';

                // Aprovechamos tus clases CSS nativas (d-Jona, d-David, etc.)
                let badge1 = c1 ? `<span class="bracket-chango-badge d-${c1}" style="font-size:0.6rem; padding:2px 4px; border-radius:4px; margin-left:5px;">${c1}</span>` : '';
                let badge2 = c2 ? `<span class="bracket-chango-badge d-${c2}" style="font-size:0.6rem; padding:2px 4px; border-radius:4px; margin-left:5px;">${c2}</span>` : '';

                let clsW1 = (p.hScore > p.aScore && p.status === 'FINISHED') ? 'winner' : '';
                let clsW2 = (p.aScore > p.hScore && p.status === 'FINISHED') ? 'winner' : '';

                // Agregamos la lógica para mostrar penales si existieron
                let penalesHtml = '';
                if (p.hPen !== null && p.aPen !== null) {
                    penalesHtml = `<div style="font-size:0.65rem; color:#888; text-align:center; margin-top:2px;">(Penales: ${p.hPen} - ${p.aPen})</div>`;
                    if (p.hPen > p.aPen) { clsW1 = 'winner'; clsW2 = ''; }
                    else if (p.aPen > p.hPen) { clsW2 = 'winner'; clsW1 = ''; }
                }

                const classElim1 = equiposEliminadosGlobal.has(t1Normal) ? 'equipo-eliminado' : '';
                const classElim2 = equiposEliminadosGlobal.has(t2Normal) ? 'equipo-eliminado' : '';

                     html += `
                     <div class="bracket-match" id="bracket-match-${matchNum}" data-cuelume-press="tick">
                         <div class="bracket-team ${classElim1}">
                            ${b1 ? `<img src="https://flagcdn.com/w40/${b1}.png" class="bracket-flag" alt="${t1}">` : '<div class="bracket-flag" style="background:#eee"></div>'}
                            <span style="${!p.home ? 'color:#999; font-size:0.85rem;' : ''}">${traducirEquipo(t1)}</span> ${badge1}
                            <span class="bracket-score ${clsW1}">${scr1}</span>
                        </div>
                    <div class="bracket-team ${classElim2}">
                        ${b2 ? `<img src="https://flagcdn.com/w40/${b2}.png" class="bracket-flag" alt="${t2}">` : '<div class="bracket-flag" style="background:#eee"></div>'}
                        <span style="${!p.away ? 'color:#999; font-size:0.85rem;' : ''}">${traducirEquipo(t2)}</span> ${badge2}
                        <span class="bracket-score ${clsW2}">${scr2}</span>
                    </div>
                    ${penalesHtml}
                    ${p.status === 'LIVE' ? '<div class="bracket-info" style="color:#ef4444; font-weight:bold; font-size:0.75rem; text-align:center; margin-top:4px;">🔴 EN VIVO</div>' : ''}
                </div>`;
            } else {
                // Placeholder base de carga
                html += `
                <div class="bracket-match">
                    <div class="bracket-team"><div class="bracket-flag" style="background:#eee"></div><span style="color:#999">...</span></div>
                    <div class="bracket-team"><div class="bracket-flag" style="background:#eee"></div><span style="color:#999">...</span></div>
                </div>`;
            }
        });
        html += `</div>`;
    });

    wrapper.innerHTML = html;
    
    // Centramos el scroll hacia la Gran Final automáticamente
    setTimeout(() => wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2, 100);
    
    if (window.cuelumeBind) window.cuelumeBind();
}

// ========== ESTADÍSTICAS DE ELIMINATORIAS POR CHANGO ==========
function renderizarEstadisticasEliminatorias() {
    const container = document.getElementById('eliminatorias-stats-container');
    if (!container) return;

    // Definir etapas y rangos de MatchNumber
    const etapas = [
        { nombre: 'R32', min: 73, max: 88, label: '16vos' },
        { nombre: 'R16', min: 89, max: 96, label: '8vos' },
        { nombre: 'QF', min: 97, max: 100, label: '4tos' },
        { nombre: 'SF', min: 101, max: 102, label: 'Semi' },
        { nombre: 'F', min: 104, max: 104, label: 'Final' }
    ];

    const changos = ['Jona', 'David', 'Raúl', 'Sergio'];
    const emojis = { 'Jona': '🐵', 'David': '🦍', 'Raúl': '🦧', 'Sergio': '🐒' };

    // Inicializar estadísticas
    let stats = {};
    changos.forEach(ch => {
        stats[ch] = {};
        etapas.forEach(etapa => {
            stats[ch][etapa.nombre] = { vivos: 0, total: 0 };
        });
    });

    // Función auxiliar para buscar equipo
    function buscarEquipoElim(nombre) {
        if (equiposDatos[nombre]) return equiposDatos[nombre];
        const claveNormalizada = Object.keys(equiposDatos).find(key => 
            key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 
            nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );
        return equiposDatos[claveNormalizada] || null;
    }

    // Recorrer todos los partidos de eliminatorias
    for (let matchNum in eliminatoriasPorMatchNumber) {
        const p = eliminatoriasPorMatchNumber[matchNum];
        if (!p) continue;
        const num = parseInt(matchNum, 10);
        // Determinar etapa por número de partido
        let etapaNombre = null;
        for (let e of etapas) {
            if (num >= e.min && num <= e.max) {
                etapaNombre = e.nombre;
                break;
            }
        }
        if (!etapaNombre) continue;

        // Equipos involucrados en el partido
        const equipos = [];
        if (p.home) equipos.push(p.home);
        if (p.away) equipos.push(p.away);

        equipos.forEach(equipo => {
            const eqInfo = buscarEquipoElim(traducirEquipo(equipo));
            if (!eqInfo) return;
            const chango = eqInfo.d;
            if (!chango || !stats[chango]) return;
            // Incrementar total
            stats[chango][etapaNombre].total++;
            // Si no está eliminado, contar como vivo
            if (!equiposEliminadosGlobal.has(traducirEquipo(equipo))) {
                stats[chango][etapaNombre].vivos++;
            }
        });
    }

    // Generar HTML
    let html = `<div class="eliminatorias-stats-grid">`;

    // Cabecera
    html += `<div class="eliminatorias-stats-header">
                <span>Chango</span>
                ${etapas.map(e => `<span class="ronda-header">${e.label}</span>`).join('')}
            </div>`;

    // Filas por chango
    changos.forEach(ch => {
        html += `<div class="eliminatorias-stats-row">`;
        html += `<span class="eliminatorias-chango"><span class="chango-emoji">${emojis[ch]}</span> ${ch}</span>`;
        etapas.forEach(etapa => {
            const data = stats[ch][etapa.nombre];
            const vivos = data.vivos;
            const total = data.total;
            // Si total es 0, mostrar un guion
            const display = total > 0 ? `<span class="vivos">${vivos}</span><span class="total">/${total}</span>` : '—';
            html += `<span class="eliminatorias-count">${display}</span>`;
        });
        html += `</div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// Inicialización
// Variables para estado anterior de estadísticas (notificaciones)
let estadisticasAnteriores = null;
let rachasAnteriores = null;
let liderAnterior = null;
let ultimoPartidoDelDia = {};

function renderizarGraficas(resultadosFinalizados, equiposDatos) {
    const changos = ['Jona', 'David', 'Raúl', 'Sergio'];
    
    // Colores que coinciden con style.css
    const colores = {
        'Jona': '#ef4444',   // Rojo
        'David': '#10b981',  // Esmeralda
        'Raúl': '#3b82f6',   // Azul
        'Sergio': '#f59e0b'  // Ámbar
    };

    // 1. Evolución de Puntos
    const resOrdenados = [...resultadosFinalizados].sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
    let puntosAcumulados = { Jona: [0], David: [0], Raúl: [0], Sergio: [0] };

    resOrdenados.forEach(res => {
        const c1 = equiposDatos[res.t1]?.d;
        const c2 = equiposDatos[res.t2]?.d;
        
        const lastPts = {
            Jona: puntosAcumulados.Jona[puntosAcumulados.Jona.length - 1],
            David: puntosAcumulados.David[puntosAcumulados.David.length - 1],
            Raúl: puntosAcumulados.Raúl[puntosAcumulados.Raúl.length - 1],
            Sergio: puntosAcumulados.Sergio[puntosAcumulados.Sergio.length - 1]
        };

        puntosAcumulados.Jona.push(lastPts.Jona + (c1 === 'Jona' ? (res.g1 > res.g2 ? 3 : res.g1 === res.g2 ? 1 : 0) : (c2 === 'Jona' ? (res.g2 > res.g1 ? 3 : res.g1 === res.g2 ? 1 : 0) : 0)));
        puntosAcumulados.David.push(lastPts.David + (c1 === 'David' ? (res.g1 > res.g2 ? 3 : res.g1 === res.g2 ? 1 : 0) : (c2 === 'David' ? (res.g2 > res.g1 ? 3 : res.g1 === res.g2 ? 1 : 0) : 0)));
        puntosAcumulados.Raúl.push(lastPts.Raúl + (c1 === 'Raúl' ? (res.g1 > res.g2 ? 3 : res.g1 === res.g2 ? 1 : 0) : (c2 === 'Raúl' ? (res.g2 > res.g1 ? 3 : res.g1 === res.g2 ? 1 : 0) : 0)));
        puntosAcumulados.Sergio.push(lastPts.Sergio + (c1 === 'Sergio' ? (res.g1 > res.g2 ? 3 : res.g1 === res.g2 ? 1 : 0) : (c2 === 'Sergio' ? (res.g2 > res.g1 ? 3 : res.g1 === res.g2 ? 1 : 0) : 0)));
    });

    const labels = puntosAcumulados.Jona.map((_, i) => i === 0 ? 'Ini' : `P${i}`);

    if (chartEvolucion) chartEvolucion.destroy();
    const ctxEvol = document.getElementById('chart-evolucion').getContext('2d');
    chartEvolucion = new Chart(ctxEvol, {
        type: 'line',
        data: {
            labels: labels,
            datasets: changos.map(ch => ({
                label: ch,
                data: puntosAcumulados[ch],
                borderColor: colores[ch],
                backgroundColor: colores[ch] + '22',
                tension: 0.3,
                pointRadius: 2
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
            scales: { 
                y: { beginAtZero: true, ticks: { stepSize: 3, font: { size: 10 } } },
                x: { ticks: { font: { size: 9 } } }
            }
        }
    });

    // 2. Balance de Goles
    let golesFavor = { Jona: 0, David: 0, Raúl: 0, Sergio: 0 };
    let golesContra = { Jona: 0, David: 0, Raúl: 0, Sergio: 0 };

    resultadosFinalizados.forEach(res => {
        const c1 = equiposDatos[res.t1]?.d;
        const c2 = equiposDatos[res.t2]?.d;
        if (c1) { golesFavor[c1] += res.g1; golesContra[c1] += res.g2; }
        if (c2) { golesFavor[c2] += res.g2; golesContra[c2] += res.g1; }
    });

    if (chartGoles) chartGoles.destroy();
    const ctxGoles = document.getElementById('chart-goles').getContext('2d');
    chartGoles = new Chart(ctxGoles, {
        type: 'bar',
        data: {
            labels: changos,
            datasets: [
                {
                    label: 'Favor',
                    data: changos.map(ch => golesFavor[ch]),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Contra',
                    data: changos.map(ch => golesContra[ch]),
                    backgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
            scales: { 
                y: { beginAtZero: true, ticks: { font: { size: 10 } } },
                x: { ticks: { font: { size: 10 } } }
            }
        }
    });
}

async function actualizarResultados(manual = false, fromCache = false, rawData = null) {
    const estadoAnterior = JSON.parse(JSON.stringify(resultadosEnVivo));
    if (manual) {
        mostrarLoaderParcial(true);
    } else if (!fromCache) {
        mostrarLoaderParcial(true);
    }
    try {
        let data;
        if (fromCache && rawData) {
            data = rawData;
        } else {
            const response = await fetch("https://play.fifa.com/json/fantasy/rounds.json");
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            data = await response.json();
            localStorage.setItem('fifaRoundsCache', JSON.stringify(data));
        }
        const nuevosResultados = {};
        const nuevosHorarios = {};
        const sedesJSON_tmp = {};
        const nuevosEliminatorias = { R32: [], R16: [], QF: [], SF: [], F: [] };
        for (const ronda of data) {
            if (!ronda.tournaments || !Array.isArray(ronda.tournaments)) continue;
            for (const m of ronda.tournaments) {
                const local = traducirEquipo(m.homeSquadName);
                const visita = traducirEquipo(m.awaySquadName);
                if (!local || !visita) continue;
                const status = (m.status || '').toUpperCase();
                const isComplete = ['COMPLETE', 'FINISHED', 'PLAYED'].includes(status);
                const isLive = ['PLAYING', 'LIVE', 'IN_PROGRESS'].includes(status);
                const isKnockout = ['R32', 'R16', 'QF', 'SF', 'F'].includes(ronda.stage); // Identificador de fase eliminatoria
                const key = `${local}-${visita}`;

                if (m.date) nuevosHorarios[key] = new Date(m.date);
                if (m.venueCity) sedesJSON_tmp[key] = m.venueCity;

                if (isComplete) {
                    nuevosResultados[key] = { g1: parseInt(m.homeScore,10), g2: parseInt(m.awayScore,10), status: 'FINISHED', minute: null, isLive: false, isKnockout: isKnockout };
                } else if (isLive && m.homeScore !== null && m.awayScore !== null) {
                    nuevosResultados[key] = { g1: parseInt(m.homeScore,10), g2: parseInt(m.awayScore,10), status: 'LIVE', minute: m.minutes || 0, isLive: true, isKnockout: isKnockout };
                } else {
                    nuevosResultados[key] = { status: 'SCHEDULED', isLive: false, isKnockout: isKnockout };
                }
                
                // Almacenar datos para la llave de eliminatorias
                if (['R32', 'R16', 'QF', 'SF', 'F'].includes(ronda.stage)) {
                    nuevosEliminatorias[ronda.stage].push({
                        id: m.id,
                        home: local || 'TBD',
                        homeOrig: m.homeSquadName || 'TBD',
                        away: visita || 'TBD',
                        awayOrig: m.awaySquadName || 'TBD',
                        hScore: m.homeScore,
                        aScore: m.awayScore,
                        status: status,
                        isLive: isLive
                    });
                }
            }
        }
        
        // Notificaciones de partidos
        for (const key in nuevosResultados) {
            const anterior = estadoAnterior[key];
            const actual = nuevosResultados[key];
            if (anterior && actual) {
                const [t1, t2] = key.split('-');
                const chango1 = equiposDatos[t1]?.d || 'Desconocido';
                const chango2 = equiposDatos[t2]?.d || 'Desconocido';
                if (anterior.g1 !== undefined && actual.g1 !== undefined && (anterior.g1 !== actual.g1 || anterior.g2 !== actual.g2)) {
                    const nuevoGol = actual.g1 > (anterior.g1 || 0) ? t1 : (actual.g2 > (anterior.g2 || 0) ? t2 : null);
                    if (nuevoGol) {
                        const changoQueAnota = (nuevoGol === t1) ? chango1 : chango2;
                        const changoRival = (nuevoGol === t1) ? chango2 : chango1;
                        const mensaje = `⚽ ${changoQueAnota} anotó con ${nuevoGol}! (vs ${changoRival})`;
                        enviarNotificacionLocal('⚽ ¡GOL!', mensaje, 'gol');
                    }
                }
                if (anterior.status !== 'LIVE' && actual.status === 'LIVE') {
                    const mensaje = `🎺 Comienza ${t1} (${chango1}) vs ${t2} (${chango2})`;
                    enviarNotificacionLocal('🎺 Partido en vivo', mensaje, 'inicio');
                }
                if (anterior.status !== 'FINISHED' && actual.status === 'FINISHED') {
                    const resultado = `${actual.g1} - ${actual.g2}`;
                    let mensaje = `🏁 Final: ${t1} ${resultado} ${t2}`;
                    if (actual.g1 > actual.g2) mensaje += ` – ¡Victoria para ${chango1}!`;
                    else if (actual.g2 > actual.g1) mensaje += ` – ¡Victoria para ${chango2}!`;
                    else mensaje += ` – Empate entre ${chango1} y ${chango2}`;
                    enviarNotificacionLocal('🏁 Partido finalizado', mensaje, 'fin');
                }
            }
        }

        const nuevasStatsCompleto = calcularStatsDesdeResultados(nuevosResultados, equiposDatos, nuevosHorarios);
        const nuevasStats = nuevasStatsCompleto.stats;
        const nuevasRachas = nuevasStatsCompleto.rachas;
        const ordenStats = Object.values(nuevasStats).sort((a,b) => b.pts - a.pts || (b.gf-b.gc) - (a.gf-a.gc) || b.gf - a.gf);
        const nuevoLider = ordenStats[0]?.nombre;
        
        if (liderAnterior && nuevoLider && liderAnterior !== nuevoLider) {
            const nuevoPts = nuevasStats[nuevoLider].pts;
            const anteriorPts = estadisticasAnteriores?.[liderAnterior]?.pts || 0;
            enviarNotificacionLocal('🏆 ¡Nuevo líder!', `${nuevoLider} supera a ${liderAnterior} con ${nuevoPts} puntos (antes ${anteriorPts})`, 'general');
        }
        if (rachasAnteriores) {
            for (let chango of ['Jona','David','Raúl','Sergio']) {
                const rachaActual = nuevasRachas[chango] || [];
                const rachaAnterior = rachasAnteriores[chango] || [];
                if (rachaActual.length >= 3 && rachaActual.slice(-3).every(r => r === 'G') &&
                    (!rachaAnterior.length || rachaAnterior.slice(-3).some(r => r !== 'G'))) {
                    enviarNotificacionLocal('🔥 ¡Racha imparable!', `${chango} lleva 3 victorias consecutivas`, 'general');
                }
                if (rachaActual.length >= 2 && rachaActual.slice(-2).every(r => r === 'P') &&
                    (!rachaAnterior.length || rachaAnterior.slice(-2).some(r => r !== 'P'))) {
                    enviarNotificacionLocal('⚠️ Mala racha', `${chango} suma 2 derrotas seguidas`, 'general');
                }
            }
        }
        if (estadisticasAnteriores) {
            for (let chango of ['Jona','David','Raúl','Sergio']) {
                const gfActual = nuevasStats[chango].gf;
                const gfAnterior = estadisticasAnteriores[chango]?.gf || 0;
                if (gfActual > gfAnterior && gfActual % 5 === 0 && gfActual !== gfAnterior) {
                    enviarNotificacionLocal('🎯 Hito de goles', `${chango} alcanzó los ${gfActual} goles a favor`, 'general');
                }
            }
        }
        for (const key in nuevosResultados) {
            const anterior = estadoAnterior[key];
            const actual = nuevosResultados[key];
            if (anterior && actual && actual.isLive && actual.minute && actual.minute >= 85) {
                if (anterior.g1 !== undefined && actual.g1 !== undefined && (anterior.g1 !== actual.g1 || anterior.g2 !== actual.g2)) {
                    const [t1, t2] = key.split('-');
                    const ganaLocalActual = actual.g1 > actual.g2;
                    const ganaVisitanteActual = actual.g2 > actual.g1;
                    const anteriorLocalGanaba = anterior.g1 > anterior.g2;
                    const anteriorVisitanteGanaba = anterior.g2 > anterior.g1;
                    if ((!anteriorLocalGanaba && ganaLocalActual) || (!anteriorVisitanteGanaba && ganaVisitanteActual)) {
                        const equipoGanador = ganaLocalActual ? t1 : t2;
                        const changoGanador = equiposDatos[equipoGanador]?.d || 'desconocido';
                        enviarNotificacionLocal('⏱️ Remontada agónica', `${equipoGanador} (${changoGanador}) dio vuelta al partido en el minuto ${actual.minute}`, 'gol');
                    }
                }
            }
        }
        const hoyStr = new Date().toDateString();
        const partidosHoy = [];
        for (const key in nuevosResultados) {
            const partido = nuevosResultados[key];
            if (partido.status === 'FINISHED') {
                const fechaPartido = getHorario(key.split('-')[0], key.split('-')[1]);
                if (fechaPartido && fechaPartido.toDateString() === hoyStr) partidosHoy.push(key);
            }
        }
        let quedanPartidosHoy = false;
        for (const key in nuevosResultados) {
            const partido = nuevosResultados[key];
            const fechaPartido = getHorario(key.split('-')[0], key.split('-')[1]);
            if (fechaPartido && fechaPartido.toDateString() === hoyStr && (partido.status === 'SCHEDULED' || partido.status === 'LIVE')) {
                quedanPartidosHoy = true;
                break;
            }
        }
        if (!quedanPartidosHoy && partidosHoy.length > 0 && (!ultimoPartidoDelDia[hoyStr] || ultimoPartidoDelDia[hoyStr] !== partidosHoy.length)) {
            const totalGoles = Object.values(nuevosResultados).reduce((acc, p) => acc + (p.g1 || 0) + (p.g2 || 0), 0);
            enviarNotificacionLocal('📆 Fin de la jornada', `Hoy hubo ${partidosHoy.length} partidos, ${totalGoles} goles. Líder: ${nuevoLider} (${nuevasStats[nuevoLider]?.pts} pts)`, 'general');
            ultimoPartidoDelDia[hoyStr] = partidosHoy.length;
        }
        
        estadisticasAnteriores = JSON.parse(JSON.stringify(nuevasStats));
        rachasAnteriores = JSON.parse(JSON.stringify(nuevasRachas));
        liderAnterior = nuevoLider;
        
        resultadosEnVivo = nuevosResultados;
        horariosJSON = nuevosHorarios;
        sedesJSON = sedesJSON_tmp;
        eliminatoriasDatos = nuevosEliminatorias;
        construirInterfaz();
        renderizarBracketDefinitivo();
        renderizarEstadisticasEliminatorias();
    } catch (error) {
        console.error("Error al obtener datos FIFA:", error);
        if (!manual && !fromCache && !localStorage.getItem('fifaRoundsCache')) alert("No se pudo actualizar. Revisa tu conexión.");
    } finally {
        if (!fromCache) mostrarLoaderParcial(false);
    }
}

let eliminatoriasPorMatchNumber = {};

async function cargarBracketOficial(fromCache = false, rawData = null) {
    try {
        let data;
        if (fromCache && rawData) {
            data = rawData;
        } else {
            const response = await fetch("https://api.fifa.com/api/v3/seasonbracket/season/285023?language=es");
            data = await response.json();
            localStorage.setItem('fifaBracketCache', JSON.stringify(data));
        }

        if (data.KnockoutStages) {
            data.KnockoutStages.forEach(stage => {
                if (stage.Matches) {
                    stage.Matches.forEach(m => {
                        eliminatoriasPorMatchNumber[m.MatchNumber] = {
                            // Extraemos el nombre en español directo de la API
                            home: m.HomeTeam ? m.HomeTeam.TeamName[0].Description : null,
                            away: m.AwayTeam ? m.AwayTeam.TeamName[0].Description : null,
                            hScore: m.HomeTeamScore,
                            aScore: m.AwayTeamScore,
                            hPen: m.HomeTeamPenaltyScore, // ¡La API trae los penales!
                            aPen: m.AwayTeamPenaltyScore,
                            // Status: 0 = Finalizado
                            status: m.MatchStatus === 0 ? 'FINISHED' : (m.MatchTimeStatus === 3 ? 'LIVE' : 'SCHEDULED'),
                            phA: m.PlaceHolderA, // Ej. "W74" o "1L"
                            phB: m.PlaceHolderB  // Ej. "W77" o "3EHIJK"
                        };
                    });
                }
            });
        }
        calcularEquiposEliminados();
        renderizarBracketDefinitivo();
    } catch(error) {
        console.error("Error al cargar el bracket oficial de la FIFA:", error);
    }
}

function getResult(t1, t2) {
    const key = `${t1}-${t2}`;
    if (resultadosEnVivo[key]) return resultadosEnVivo[key];
    const revKey = `${t2}-${t1}`;
    if (resultadosEnVivo[revKey]) {
        const rev = resultadosEnVivo[revKey];
        if (rev.g1 !== undefined && rev.g2 !== undefined) return { ...rev, g1: rev.g2, g2: rev.g1, status: rev.status, minute: rev.minute, isLive: rev.isLive };
        return rev;
    }
    return null;
}

function getHorario(t1, t2) {
    const key = `${t1}-${t2}`;
    if (horariosJSON[key]) return horariosJSON[key];
    const revKey = `${t2}-${t1}`;
    if (horariosJSON[revKey]) return horariosJSON[revKey];
    return null;
}

function calcularStatsDesdeResultados(resVivo, equiposData, horariosMap) {
    let stats = {
        Jona: { nombre: 'Jona', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
        David: { nombre: 'David', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
        Raúl: { nombre: 'Raúl', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
        Sergio: { nombre: 'Sergio', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 }
    };
    let partidosFinalizados = [];
    for (const key in resVivo) {
        const partido = resVivo[key];
        if (partido.status !== 'FINISHED' || partido.g1 === undefined || partido.isKnockout) continue;
        let [t1, t2] = key.split('-');
        if (!equiposData[t1] || !equiposData[t2]) continue;
        let g1 = partido.g1, g2 = partido.g2;
        let c1 = equiposData[t1].d, c2 = equiposData[t2].d;
        let fecha = horariosMap[key] || horariosMap[`${t2}-${t1}`] || new Date();
        partidosFinalizados.push({ t1, t2, g1, g2, fecha, c1, c2 });
        stats[c1].pj++; stats[c1].gf += g1; stats[c1].gc += g2;
        stats[c2].pj++; stats[c2].gf += g2; stats[c2].gc += g1;
        if (g1 > g2) { stats[c1].pg++; stats[c1].pts += 3; stats[c2].pp++; }
        else if (g1 < g2) { stats[c2].pg++; stats[c2].pts += 3; stats[c1].pp++; }
        else { stats[c1].pe++; stats[c1].pts += 1; stats[c2].pe++; stats[c2].pts += 1; }
    }
    let partidosPorChango = { Jona: [], David: [], Raúl: [], Sergio: [] };
    for (let p of partidosFinalizados) {
        partidosPorChango[p.c1].push({ chango: p.c1, resultado: p.g1 > p.g2 ? 'G' : (p.g1 < p.g2 ? 'P' : 'E'), fecha: p.fecha });
        partidosPorChango[p.c2].push({ chango: p.c2, resultado: p.g2 > p.g1 ? 'G' : (p.g2 < p.g1 ? 'P' : 'E'), fecha: p.fecha });
    }
    for (let c in partidosPorChango) partidosPorChango[c].sort((a,b) => a.fecha - b.fecha);
    let rachas = {};
    for (let c in partidosPorChango) rachas[c] = partidosPorChango[c].map(p => p.resultado);
    return { stats, rachas };
}

function renderizarInsigniaEstado(statusObj) {
    if (!statusObj || !statusObj.status) return '';
    
    // 1. Si el partido terminó (FINISHED)
    if (statusObj.status === 'FINISHED') {
        // Revisamos si trae info de penales desde el bracket
        if (statusObj.hPen !== undefined && statusObj.hPen !== null) {
              return `<div class="status-container"><span class="badge-estado b-penales">🎯 Penales: ${statusObj.hPen} - ${statusObj.aPen}</span></div>`;
        }
        return `<div class="status-container"><span class="badge-estado b-fin">✅ Finalizado</span></div>`;
    }
    
    // 2. Si el partido está EN VIVO (LIVE)
    if (statusObj.status === 'LIVE') {
        const minutoRaw = statusObj.minute ? String(statusObj.minute).replace("'", "") : "0";
        const minutoInt = parseInt(minutoRaw, 10);
        const extra = statusObj.minute ? ` ${statusObj.minute}'` : '';
        
        // Si el minuto es mayor a 90, automáticamente es Prórroga
        if (minutoInt > 90) {
            return `<div class="status-container"><span class="badge-estado b-prorroga">⏳ PRÓRROGA${extra}</span></div>`;
        }
        // Tiempo regular
        return `<div class="status-container"><span class="badge-estado b-vivo">🔴 EN VIVO${extra}</span></div>`;
    }
    
    return '';
}

function esFechaPasada(fechaObj) {
    if (!fechaObj) return false;
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaComparar = new Date(fechaObj);
    fechaComparar.setHours(0,0,0,0);
    return fechaComparar < hoy;
}

function obtenerHtmlHistorial(t1, t2) {
    let key = `${t1}-${t2}`;
    let matches = baseDatosH2H[key];
    if (!matches) { key = `${t2}-${t1}`; matches = baseDatosH2H[key]; }
    let html = `<div class="h2h-inline-panel" id="h2h-${t1}-${t2}" style="display: none;">
                    <div class="h2h-titulo">⚔️ Historial Reciente (H2H)</div>
                    <div class="h2h-list">`;
    if (!matches || matches.length === 0) {
        html += `<div class="historial-item"><p class="historial-texto" style="text-align:center;">No hay enfrentamientos previos</p></div>`;
    } else {
        matches.slice(0,5).forEach(m => {
            html += `<div class="historial-item" style="padding: 10px 12px;">
                        <div class="historial-fecha">📅 ${m.f}</div>
                        <p class="historial-texto">${m.r}</p>
                    </div>`;
        });
    }
    html += `   </div></div>`;
    return html;
}

function alternarTarjetaPartido(elemento) {
    const yaSeleccionado = elemento.classList.contains('seleccionado');
    document.querySelectorAll('.partido-card, .p-mini').forEach(card => card.classList.remove('seleccionado'));
    if (!yaSeleccionado) elemento.classList.add('seleccionado');
}

function calcularEstadisticasAvanzadas(estadisticasChangos, equiposDatos, resultadosFinalizados) {
    let partidosPorChangoFecha = { Jona: [], David: [], Raúl: [], Sergio: [] };
    for (let res of resultadosFinalizados) {
        const c1 = equiposDatos[res.t1]?.d;
        const c2 = equiposDatos[res.t2]?.d;
        if (c1) partidosPorChangoFecha[c1].push({ chango: c1, resultado: res.g1 > res.g2 ? 'G' : (res.g1 < res.g2 ? 'P' : 'E'), fecha: res.fecha });
        if (c2) partidosPorChangoFecha[c2].push({ chango: c2, resultado: res.g2 > res.g1 ? 'G' : (res.g2 < res.g1 ? 'P' : 'E'), fecha: res.fecha });
    }
    for (let c in partidosPorChangoFecha) partidosPorChangoFecha[c].sort((a,b) => a.fecha - b.fecha);
    let rachas = {};
    for (let c in partidosPorChangoFecha) rachas[c] = partidosPorChangoFecha[c].map(p => p.resultado);
    let mayorGoleadaFavor = {}, mayorGoleadaContra = {};
    for (let c in estadisticasChangos) {
        mayorGoleadaFavor[c] = { dif: 0, rival: '' };
        mayorGoleadaContra[c] = { dif: 0, rival: '' };
    }
    let mayorPaliza = { dif: -1, t1: '', t2: '', g1: 0, g2: 0, d1: '', d2: '' };
    let partidoMasGoles = { total: -1, t1: '', t2: '', g1: 0, g2: 0, d1: '', d2: '' };

    for (let res of resultadosFinalizados) {
        const c1 = equiposDatos[res.t1]?.d, c2 = equiposDatos[res.t2]?.d;
        if (c1) {
            let dif = res.g1 - res.g2;
            if (dif > mayorGoleadaFavor[c1].dif) { mayorGoleadaFavor[c1].dif = dif; mayorGoleadaFavor[c1].rival = res.t2; }
            if (-dif > mayorGoleadaContra[c1].dif) { mayorGoleadaContra[c1].dif = -dif; mayorGoleadaContra[c1].rival = res.t2; }
        }
        if (c2) {
            let dif = res.g2 - res.g1;
            if (dif > mayorGoleadaFavor[c2].dif) { mayorGoleadaFavor[c2].dif = dif; mayorGoleadaFavor[c2].rival = res.t1; }
            if (-dif > mayorGoleadaContra[c2].dif) { mayorGoleadaContra[c2].dif = -dif; mayorGoleadaContra[c2].rival = res.t1; }
        }

        // Mayor paliza del torneo (diferencia de goles)
        let difAbs = Math.abs(res.g1 - res.g2);
        if (difAbs > mayorPaliza.dif || (difAbs === mayorPaliza.dif && (res.g1 + res.g2) > (mayorPaliza.g1 + mayorPaliza.g2))) {
            mayorPaliza = {
                dif: difAbs,
                t1: res.t1,
                t2: res.t2,
                g1: res.g1,
                g2: res.g2,
                d1: c1 || '?',
                d2: c2 || '?'
            };
        }

        // Partido con más goles del torneo
        let totalGoles = res.g1 + res.g2;
        if (totalGoles > partidoMasGoles.total) {
            partidoMasGoles = {
                total: totalGoles,
                t1: res.t1,
                t2: res.t2,
                g1: res.g1,
                g2: res.g2,
                d1: c1 || '?',
                d2: c2 || '?'
            };
        }
    }
    return { rachas, mayorGoleadaFavor, mayorGoleadaContra, mayorPaliza, partidoMasGoles };
}

function generarHtmlEstadisticas(estadisticasChangos, avanzadas, gruposStats) {
    let html = '<div class="stats-grid changos-grid">';
    const changos = Object.values(estadisticasChangos).sort((a,b)=>b.pts - a.pts);
    for (let c of changos) {
        const rachaCompleta = avanzadas.rachas[c.nombre] || [];
        const rachaUltimos5 = rachaCompleta.slice(-5);
        const rachaAnterior = rachaCompleta.slice(0, -5);
        
        let rachaHtml = `<div class="rachas">${rachaUltimos5.map(r => `<span class="racha-item ${r==='G'?'racha-win':r==='E'?'racha-draw':'racha-loss'}">${r==='G'?'✅':r==='E'?'➖':'❌'}</span>`).join('')}${rachaUltimos5.length===0?'—':''}</div>`;
        
        if (rachaAnterior.length > 0) {
            rachaHtml += `
            <details class="historial-racha-details">
                <summary>Ver historial completo</summary>
                <div class="rachas rachas-full">
                    ${rachaAnterior.map(r => `<span class="racha-item ${r==='G'?'racha-win':r==='E'?'racha-draw':'racha-loss'}">${r==='G'?'✅':r==='E'?'➖':'❌'}</span>`).join('')}
                </div>
            </details>`;
        }

        const mayorF = avanzadas.mayorGoleadaFavor[c.nombre];
        const mayorC = avanzadas.mayorGoleadaContra[c.nombre];
        html += `<div class="stat-card"><h4>🐒 ${c.nombre}</h4><div><strong>Racha (últimos 5):</strong> ${rachaHtml}</div><div><strong>Mayor goleada a favor:</strong> ${mayorF.dif>0 ? `${mayorF.dif} goles vs ${mayorF.rival}` : 'Ninguna'}</div><div><strong>Mayor goleada en contra:</strong> ${mayorC.dif>0 ? `${mayorC.dif} goles vs ${mayorC.rival}` : 'Ninguna'}</div></div>`;
    }
    html += '</div>';
    return html;
}

function generarCuriosidades(estadisticasChangos, avanzadas) {
    const changos = Object.values(estadisticasChangos);
    const maxGoles = changos.reduce((max, c) => c.gf > max.gf ? c : max, { gf: -1 });
    const minGolesRecibidos = changos.reduce((min, c) => c.gc < min.gc ? c : min, { gc: 9999 });
    const maxEmpates = changos.reduce((max, c) => c.pe > max.pe ? c : max, { pe: -1 });
    const mejorDG = changos.reduce((max, c) => (c.gf-c.gc) > (max.gf-max.gc) ? c : max, { gf:0, gc:0 });
    const peorDG = changos.reduce((min, c) => (c.gf-c.gc) < (min.gf-min.gc) ? c : min, { gf:0, gc:0 });
    
    const curiosidadesList = [
        { icon: '⚽', title: 'Máximo goleador', value: maxGoles.nombre, detail: `${maxGoles.gf} goles`, desc: "Suma de todos los goles a favor anotados por los equipos de este participante." },
        { icon: '🛡️', title: 'Mejor defensa', value: minGolesRecibidos.nombre, detail: `${minGolesRecibidos.gc} goles en contra`, desc: "Suma de todos los goles en contra recibidos por los equipos de este participante." },
        { icon: '🤝', title: 'Rey del empate', value: maxEmpates.nombre, detail: `${maxEmpates.pe} empates`, desc: "Suma total de empates obtenidos por todos los equipos del participante." },
        { icon: '📈', title: 'Mejor DG', value: mejorDG.nombre, detail: `${mejorDG.gf-mejorDG.gc} goles`, desc: "Diferencia total de goles (anotados menos recibidos) de sus equipos." },
        { icon: '📉', title: 'Peor DG', value: peorDG.nombre, detail: `${peorDG.gf-peorDG.gc} goles`, desc: "Diferencia total de goles (anotados menos recibidos) de sus equipos." }
    ];

    const changosConPartidos = changos.filter(c => c.pj > 0);
    if (changosConPartidos.length > 0) {
        const maxOfensivo = changosConPartidos.reduce((max, c) => (c.gf / c.pj) > (max.gf / max.pj) ? c : max, changosConPartidos[0]);
        curiosidadesList.push({
            icon: '🚀',
            title: 'Súper Ofensivo',
            value: maxOfensivo.nombre,
            detail: `${(maxOfensivo.gf / maxOfensivo.pj).toFixed(2)} goles anotados/partido`,
            desc: "Promedio más alto de goles a favor por cada partido jugado por sus equipos."
        });

        const mejorDefensaPromedio = changosConPartidos.reduce((min, c) => (c.gc / c.pj) < (min.gc / min.pj) ? c : min, changosConPartidos[0]);
        curiosidadesList.push({
            icon: '🚌',
            title: 'El Autobús',
            value: mejorDefensaPromedio.nombre,
            detail: `${(mejorDefensaPromedio.gc / mejorDefensaPromedio.pj).toFixed(2)} goles recibidos/partido`,
            desc: "Promedio más bajo de goles recibidos por cada partido jugado por sus equipos."
        });

        const maxEspectaculo = changosConPartidos.reduce((max, c) => ((c.gf + c.gc) / c.pj) > ((max.gf + max.gc) / max.pj) ? c : max, changosConPartidos[0]);
        curiosidadesList.push({
            icon: '🍿',
            title: 'Espectáculo garantizado',
            value: maxEspectaculo.nombre,
            detail: `${((maxEspectaculo.gf + maxEspectaculo.gc) / maxEspectaculo.pj).toFixed(2)} goles totales/partido`,
            desc: "Mayor promedio de goles totales (favor + contra) en los partidos de sus equipos. ¡Festival asegurado!"
        });

        const minEspectaculo = changosConPartidos.reduce((min, c) => ((c.gf + c.gc) / c.pj) < ((min.gf + min.gc) / min.pj) ? c : min, changosConPartidos[0]);
        curiosidadesList.push({
            icon: '💤',
            title: 'El Somnífero',
            value: minEspectaculo.nombre,
            detail: `${((minEspectaculo.gf + minEspectaculo.gc) / minEspectaculo.pj).toFixed(2)} goles totales/partido`,
            desc: "Menor promedio de goles totales (favor + contra) en los partidos de sus equipos. Partidos cerrados o aburridos."
        });

        const maxEfectividad = changosConPartidos.reduce((max, c) => (c.pts / c.pj) > (max.pts / max.pj) ? c : max, changosConPartidos[0]);
        curiosidadesList.push({
            icon: '⚡',
            title: 'Pura Efectividad',
            value: maxEfectividad.nombre,
            detail: `${(maxEfectividad.pts / maxEfectividad.pj).toFixed(2)} puntos/partido`,
            desc: "Mayor promedio de puntos obtenidos por partido jugado por sus equipos (PG: 3 pts, PE: 1 pt)."
        });
    }

    if (avanzadas.mayorPaliza && avanzadas.mayorPaliza.dif >= 0) {
        const mp = avanzadas.mayorPaliza;
        curiosidadesList.push({
            icon: '🥊',
            title: 'La mayor paliza',
            value: `${mp.t1} ${mp.g1} - ${mp.g2} ${mp.t2}`,
            detail: `${mp.d1} vs ${mp.d2} (Dif: ${mp.dif} goles)`,
            desc: "El partido finalizado del torneo con la mayor diferencia de goles registrada."
        });
    }

    if (avanzadas.partidoMasGoles && avanzadas.partidoMasGoles.total >= 0) {
        const pmg = avanzadas.partidoMasGoles;
        curiosidadesList.push({
            icon: '🎉',
            title: 'Festival de goles',
            value: `${pmg.t1} ${pmg.g1} - ${pmg.g2} ${pmg.t2}`,
            detail: `${pmg.d1} vs ${pmg.d2} (Total: ${pmg.total} goles)`,
            desc: "El partido finalizado del torneo que acumuló la mayor cantidad de goles totales."
        });
    }

    const rachasLargas = Object.entries(avanzadas.rachas).map(([ch, r]) => ({ ch, ultimos: r.slice(-3) }));
    const rachaGanadora = rachasLargas.find(r => r.ultimos.length===3 && r.ultimos.every(u => u === 'G'));
    if (rachaGanadora) curiosidadesList.push({ icon: '🔥', title: 'Racha ganadora', value: rachaGanadora.ch, detail: '3 victorias seguidas', desc: "Este participante acumula 3 victorias seguidas en sus últimos partidos jugados." });
    const rachaPerdedora = rachasLargas.find(r => r.ultimos.length===3 && r.ultimos.every(u => u === 'P'));
    if (rachaPerdedora) curiosidadesList.push({ icon: '⚠️', title: 'Mala racha', value: rachaPerdedora.ch, detail: '3 derrotas seguidas', desc: "Este participante acumula 3 derrotas seguidas en sus últimos partidos jugados." });

    let html = `<div class="curiosidades-container"><h4 class="subtitulo-estadisticas">🎲 Estadísticas divertidas</h4><div class="curiosidades-grid">`;
    for (let item of curiosidadesList) {
        const valueStyle = item.value.length > 12 ? ' style="font-size: 0.85rem;"' : '';
        html += `
        <div class="curiosidad-card" onclick="this.classList.toggle('flipped')">
            <div class="curiosidad-inner">
                <div class="curiosidad-front">
                    <div class="curiosidad-icon">${item.icon}</div>
                    <div class="curiosidad-title">${item.title}</div>
                    <div class="curiosidad-value"${valueStyle}>${item.value}</div>
                    <div class="curiosidad-detail">${item.detail}</div>
                </div>
                <div class="curiosidad-back">
                    <div class="curiosidad-back-title">💡 ¿De qué trata?</div>
                    <div class="curiosidad-desc">${item.desc || ''}</div>
                </div>
            </div>
        </div>`;
    }
    html += `</div></div>`;
    return html;
}

function compartirWhatsApp() {
    const tablaBody = document.getElementById('tabla-body-changos');
    let texto = "🏆 *QUINIELA MUNDIAL 2026* 🏆\n\n📊 *TABLA DE POSICIONES*\n";
    const filas = tablaBody.querySelectorAll('tr');
    filas.forEach((row, idx) => {
        const celdas = row.querySelectorAll('td');
        if (celdas.length >= 7) {
            const primeraCelda = celdas[0].innerText.trim();
            const numeroMatch = primeraCelda.match(/^(\d+)/);
            const posicion = numeroMatch ? numeroMatch[1] : (idx+1).toString();
            const nombre = primeraCelda.replace(/^\d+\s*/, '').trim();
            const pts = celdas[7].innerText.trim();
            const pj = celdas[1].innerText.trim();
            const gf = celdas[5].innerText.trim();
            const dg = celdas[6].innerText.trim();
            texto += `${posicion}. ${nombre} → ${pts} pts (PJ:${pj} GF:${gf} DG:${dg})\n`;
        }
    });
    const curiosidadesCards = document.querySelectorAll('.curiosidad-card');
    if (curiosidadesCards.length > 0) {
        texto += `\n✨ *ESTADÍSTICAS DESTACADAS*\n`;
        curiosidadesCards.forEach(card => {
            const icono = card.querySelector('.curiosidad-icon')?.innerText || '';
            const titulo = card.querySelector('.curiosidad-title')?.innerText || '';
            const valor = card.querySelector('.curiosidad-value')?.innerText || '';
            const detalle = card.querySelector('.curiosidad-detail')?.innerText || '';
            texto += `• ${icono} ${titulo}: ${valor} (${detalle})\n`;
        });
    } else {
        const curiosidadesDiv = document.getElementById('curiosidades-container');
        if (curiosidadesDiv) {
            let rawText = curiosidadesDiv.innerText.replace('🎲 Estadísticas divertidas:', '').trim();
            let lineas = rawText.split('\n').filter(l => l.trim().length > 0);
            if (lineas.length) {
                texto += `\n✨ *ESTADÍSTICAS DESTACADAS*\n`;
                lineas.slice(0, 8).forEach(linea => { texto += `• ${linea.trim()}\n`; });
            }
        }
    }
    texto += `\n#Mundial2026 #Quiniela`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
}

function renderizarMiJornada(changoSeleccionado) {
    const container = document.getElementById('proximos-partidos-container');
    if (!container) return;
    const partidos = partidosPorChangoDetalle[changoSeleccionado] || [];
    const ahora = new Date();
    const proximos = partidos.filter(p => {
        if (p.finalizado) return false;
        if (!p.fechaObj) return false;
        if (!(p.fechaObj instanceof Date) || isNaN(p.fechaObj.getTime())) return false;
        if (p.fechaObj.getHours() === 0 && p.fechaObj.getMinutes() === 0 && p.fechaObj.getSeconds() === 0 && p.fechaObj.getFullYear() === 2026) return false;
        return p.fechaObj >= ahora;
    }).sort((a,b) => a.fechaObj - b.fechaObj).slice(0, 3);
    if (proximos.length === 0) {
        container.innerHTML = `<div class="vacio-mi-jornada">🎉 No tienes partidos próximos con horario confirmado. ¡Vuelve más tarde!</div>`;
        return;
    }
    let html = '';
    for (let pt of proximos) {
        let esLocal = (pt.d1 === changoSeleccionado);
        let res = getResult(pt.t1, pt.t2);
        let estado = renderizarInsigniaEstado(res);
        let scoreCenter = (res && (res.status === 'FINISHED' || res.status === 'LIVE')) ?
            `<div style="font-weight:900; font-size:1.1rem; background:#eef2f5; padding:2px 8px; border-radius:6px;">${esLocal ? res.g1 : res.g2} - ${esLocal ? res.g2 : res.g1}</div>` :
            `<span style="color:#aaa; font-weight:bold;">VS</span>`;
        let h2hHtml = obtenerHtmlHistorial(pt.t1, pt.t2);
        html += `<div class="p-mini" onclick="alternarTarjetaPartido(this)">
            <div class="p-mini-fecha">${pt.fecha} - ${pt.hora} hrs</div>
            <div class="p-mini-equipos">
                <div class="p-mini-col"><img src="https://flagcdn.com/w160/${esLocal ? pt.c1 : pt.c2}.png"><span>${esLocal ? pt.t1 : pt.t2}</span><span class="t-dueño d-${changoSeleccionado}" style="font-size:0.65rem;">Tu equipo</span></div>
                <div>${scoreCenter}${estado}</div>
                <div class="p-mini-col"><img src="https://flagcdn.com/w160/${esLocal ? pt.c2 : pt.c1}.png"><span>${esLocal ? pt.t2 : pt.t1}</span><span class="t-dueño d-${esLocal ? pt.d2 : pt.d1}" style="font-size:0.65rem;">Rival: ${esLocal ? pt.d2 : pt.d1}</span></div>
            </div>
            ${h2hHtml}
        </div>`;
        }
        container.innerHTML = html;
        if (window.cuelumeBind) window.cuelumeBind();
    }

function seleccionarChango(chango) {
    document.querySelectorAll('.btn-chango').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.btn-chango[data-chango="${chango}"]`).classList.add('active');
    renderizarMiJornada(chango);
}

function construirInterfaz() {
    let diasOrdenados = {};
    let partidosPorChango = { Jona: [], David: [], Raúl: [], Sergio: [] };
    let gruposStats = {};
    let estadisticasChangos = {
        Jona: { nombre: 'Jona', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0, color:'var(--jona)' },
        David: { nombre: 'David', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0, color:'var(--david)' },
        Raúl: { nombre: 'Raúl', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0, color:'var(--raul)' },
        Sergio: { nombre: 'Sergio', pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0, color:'var(--sergio)' }
    };
    for (let eq in equiposDatos) {
        let g = equiposDatos[eq].g;
        if (!gruposStats[g]) gruposStats[g] = [];
        gruposStats[g].push({ equipo: eq, bandera: equiposDatos[eq].c, dueño: equiposDatos[eq].d, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 });
    }
    rawSchedule.forEach(str => {
        let p = str.split('|');
        let objPartido = {
            t1: p[1], t2: p[2], d1: equiposDatos[p[1]].d, d2: equiposDatos[p[2]].d,
            c1: equiposDatos[p[1]].c, c2: equiposDatos[p[2]].c, gr: equiposDatos[p[1]].g,
            finalizado: false, isLive: false
        };
        const fechaReal = getHorario(p[1], p[2]);
        if (fechaReal) {
            objPartido.fechaObj = fechaReal;
            objPartido.hora = formatearHoraLocal(fechaReal);
            objPartido.fecha = formatearFechaLocal(fechaReal);
            objPartido.yaPaso = esFechaPasada(fechaReal);
        } else {
            objPartido.fecha = p[0];
            objPartido.hora = "Hora por confirmar";
            objPartido.fechaObj = new Date(2026, 5, parseInt(p[0].split('-')[0]), 0,0,0);
            objPartido.yaPaso = esFechaPasada(objPartido.fechaObj);
        }
        if (!diasOrdenados[objPartido.fecha]) diasOrdenados[objPartido.fecha] = [];
        diasOrdenados[objPartido.fecha].push(objPartido);
        partidosPorChango[objPartido.d1].push(objPartido);
        partidosPorChango[objPartido.d2].push(objPartido);
    });
    
    // Inyectar partidos de eliminatorias en los calendarios
    for (let etapa in eliminatoriasDatos) {
        let etiqueta = '';
        if (etapa === 'R32') etiqueta = '16vos';
        else if (etapa === 'R16') etiqueta = '8vos';
        else if (etapa === 'QF') etiqueta = '4tos';
        else if (etapa === 'SF') etiqueta = 'Semi';
        else if (etapa === 'F') etiqueta = 'FINAL';
        
        eliminatoriasDatos[etapa].forEach(m => {
            // Solo si ya están definidos los equipos, o si se quiere mostrar el placeholder
            // Es mejor mostrarlo solo si al menos uno está definido o si se desea mostrar todos. 
            // Los mostraremos si al menos tienen fecha y equipos conocidos.
            if (m.home !== 'TBD' && m.away !== 'TBD') {
                let objPartido = {
                    t1: m.home, t2: m.away, 
                    d1: equiposDatos[m.home] ? equiposDatos[m.home].d : '', 
                    d2: equiposDatos[m.away] ? equiposDatos[m.away].d : '',
                    c1: equiposDatos[m.home] ? equiposDatos[m.home].c : '', 
                    c2: equiposDatos[m.away] ? equiposDatos[m.away].c : '', 
                    gr: etiqueta, // Reutilizamos 'gr' para la etiqueta
                    finalizado: m.status === 'FINISHED' || m.status === 'COMPLETE', 
                    isLive: m.isLive
                };
                const fechaReal = getHorario(m.home, m.away);
                if (fechaReal) {
                    objPartido.fechaObj = fechaReal;
                    objPartido.hora = formatearHoraLocal(fechaReal);
                    objPartido.fecha = formatearFechaLocal(fechaReal);
                    objPartido.yaPaso = esFechaPasada(fechaReal);
                    
                    if (!diasOrdenados[objPartido.fecha]) diasOrdenados[objPartido.fecha] = [];
                    diasOrdenados[objPartido.fecha].push(objPartido);
                    if (objPartido.d1) partidosPorChango[objPartido.d1].push(objPartido);
                    if (objPartido.d2) partidosPorChango[objPartido.d2].push(objPartido);
                }
            }
        });
    }
    
    for (let dia in diasOrdenados) diasOrdenados[dia].sort((a,b)=> (a.hora||"").localeCompare(b.hora||""));
    for (let dia in diasOrdenados) {
        for (let pt of diasOrdenados[dia]) {
            const res = getResult(pt.t1, pt.t2);
            if (res) {
                if (res.status === 'FINISHED') pt.finalizado = true;
                else if (res.status === 'LIVE') pt.isLive = true;
            }
        }
    }
    partidosPorChangoDetalle = partidosPorChango;
    let resultadosFinalizados = [];
    for (let key in resultadosEnVivo) {
        const partido = resultadosEnVivo[key];
        if (partido.status !== 'FINISHED' || partido.g1 === undefined || partido.isKnockout) continue;
        let [t1, t2] = key.split('-');
        if (!equiposDatos[t1] || !equiposDatos[t2]) continue;
        let g1 = partido.g1, g2 = partido.g2;
        let c1 = equiposDatos[t1].d, c2 = equiposDatos[t2].d;
        let fechaPartido = getHorario(t1,t2) || new Date();
        resultadosFinalizados.push({ t1, t2, g1, g2, fecha: fechaPartido });
        estadisticasChangos[c1].pj++; estadisticasChangos[c1].gf += g1; estadisticasChangos[c1].gc += g2;
        estadisticasChangos[c2].pj++; estadisticasChangos[c2].gf += g2; estadisticasChangos[c2].gc += g1;
        if (g1 > g2) { estadisticasChangos[c1].pg++; estadisticasChangos[c1].pts += 3; estadisticasChangos[c2].pp++; }
        else if (g1 < g2) { estadisticasChangos[c2].pg++; estadisticasChangos[c2].pts += 3; estadisticasChangos[c1].pp++; }
        else { estadisticasChangos[c1].pe++; estadisticasChangos[c1].pts += 1; estadisticasChangos[c2].pe++; estadisticasChangos[c2].pts += 1; }
        let eq1 = gruposStats[equiposDatos[t1].g]?.find(e => e.equipo === t1);
        let eq2 = gruposStats[equiposDatos[t2].g]?.find(e => e.equipo === t2);
        if (eq1 && eq2) {
            eq1.pj++; eq2.pj++; eq1.gf += g1; eq2.gf += g2; eq1.gc += g2; eq2.gc += g1;
            if (g1 > g2) { eq1.pg++; eq2.pp++; eq1.pts += 3; }
            else if (g1 < g2) { eq2.pg++; eq1.pp++; eq2.pts += 3; }
            else { eq1.pe++; eq2.pe++; eq1.pts += 1; eq2.pts += 1; }
        }
    }

    // Calendario general
    const vGeneral = document.getElementById('vista-cal-general');
    let htmlPasados = '<details class="dias-pasados"><summary>📁 Días anteriores a hoy</summary>';
    let htmlFuturos = '';
    let encontroProximo = false;
    const diasOrdenadosKeys = Object.keys(diasOrdenados).sort((a,b) => (diasOrdenados[a][0]?.fechaObj||0) - (diasOrdenados[b][0]?.fechaObj||0));
    for (let dia of diasOrdenadosKeys) {
        let todosPasados = diasOrdenados[dia].every(pt => pt.yaPaso === true);
        let gridHTML = '<div class="grid-partidos">';
        for (let pt of diasOrdenados[dia]) {
            let res = getResult(pt.t1, pt.t2);
            let estadoInsignia = renderizarInsigniaEstado(res);
            let scoreHtml = (res && (res.status === 'FINISHED' || res.status === 'LIVE')) ? `<div class="score">${res.g1} - ${res.g2}</div>` : '<div class="vs">VS</div>';

            let sede = sedesJSON[`${pt.t1}-${pt.t2}`] || sedesJSON[`${pt.t2}-${pt.t1}`] || "";
            let climaBadge = '';
            if (sede) {
                let climaInfo = obtenerClimaParaSede(sede);
                if (climaInfo) {
                    climaBadge = `<span class="clima-badge-inline" data-sede="${sede}" style="opacity: 1;"><span class="clima-badge-item" title="${climaInfo.desc}">${climaInfo.icon} ${climaInfo.temp}°C</span></span>`;
                } else {
                    climaBadge = `<span class="clima-badge-inline" data-sede="${sede}"></span>`;
                }
            }
            let sedeHtml = sede ? `<div class="partido-sede">📍 ${sede}${climaBadge}</div>` : '';

            let clsAd = '';
            if (pt.finalizado) clsAd = 'partido-pasado';
            else if (pt.isLive) clsAd = 'partido-vivo';
            else if (!encontroProximo && !pt.finalizado && !pt.isLive && !pt.yaPaso) { clsAd = 'proximo-partido'; encontroProximo = true; }
            let badge = (clsAd === 'proximo-partido') ? '<div class="badge-proximo">👉 Siguiente Partido</div>' : '';
            let h2hHtml = obtenerHtmlHistorial(pt.t1, pt.t2);
            let grLabel = pt.gr.length > 1 ? pt.gr : `Grupo ${pt.gr}`;
            gridHTML += `<div class="partido-card ${clsAd}" onclick="alternarTarjetaPartido(this)" data-cuelume-press="tick">${badge}<div class="p-info"><span>⏰ ${pt.hora}</span><span>${grLabel}</span></div><div class="p-teams"><div class="team"><img src="https://flagcdn.com/w160/${pt.c1}.png" class="img-bandera"><span class="t-nombre">${pt.t1}</span><span class="t-dueño d-${pt.d1}">${pt.d1}</span></div><div style="display:flex;flex-direction:column;align-items:center;">${scoreHtml}${estadoInsignia}</div><div class="team"><img src="https://flagcdn.com/w160/${pt.c2}.png" class="img-bandera"><span class="t-nombre">${pt.t2}</span><span class="t-dueño d-${pt.d2}">${pt.d2}</span></div></div>${sedeHtml}${h2hHtml}</div>`;
        }
        gridHTML += '</div>';
        let header = `<div class="fecha-header">🗓️ ${dia} 2026</div>`;
        if (todosPasados) htmlPasados += header + gridHTML;
        else htmlFuturos += header + gridHTML;
    }
    vGeneral.innerHTML = (htmlPasados !== '<details class="dias-pasados"><summary>📁 Días anteriores a hoy</summary>' ? htmlPasados + '</details>' : '') + htmlFuturos;

    // Lazy Rendering para componentes pesados
    setTimeout(() => {
        // Por Chango (calendario)
        for (let c of ["Jona","David","Raúl","Sergio"]) {
            const div = document.getElementById('lista-pers-' + c);
            let html = '';
            partidosPorChango[c].sort((a,b)=> (a.fechaObj||0) - (b.fechaObj||0));
            for (let pt of partidosPorChango[c]) {
                let esLocal = (pt.d1 === c);
                let res = getResult(pt.t1, pt.t2);
                let estado = renderizarInsigniaEstado(res);
                let scoreCenter = (res && (res.status === 'FINISHED' || res.status === 'LIVE')) ? `<div style="font-weight:900; font-size:1.1rem; background:#eef2f5; padding:2px 8px; border-radius:6px;">${esLocal ? res.g1 : res.g2} - ${esLocal ? res.g2 : res.g1}</div>` : `<span style="color:#aaa; font-weight:bold;">VS</span>`;
                let clasePasado = pt.finalizado ? 'partido-pasado' : '';
                let h2hHtml = obtenerHtmlHistorial(pt.t1, pt.t2);
                html += `<div class="p-mini ${clasePasado}" onclick="alternarTarjetaPartido(this)" data-cuelume-press="tick"><div class="p-mini-fecha">${pt.fecha} - ${pt.hora} hrs</div><div class="p-mini-equipos"><div class="p-mini-col"><img src="https://flagcdn.com/w160/${esLocal ? pt.c1 : pt.c2}.png"><span>${esLocal ? pt.t1 : pt.t2}</span><span class="t-dueño d-${c}" style="font-size:0.65rem;">Tu equipo</span></div><div>${scoreCenter}${estado}</div><div class="p-mini-col"><img src="https://flagcdn.com/w160/${esLocal ? pt.c2 : pt.c1}.png"><span>${esLocal ? pt.t2 : pt.t1}</span><span class="t-dueño d-${esLocal ? pt.d2 : pt.d1}" style="font-size:0.65rem;">Rival: ${esLocal ? pt.d2 : pt.d1}</span></div></div>${h2hHtml}</div>`;
            }
            div.innerHTML = html;
        }

        // Tabla grupos
        const vGrupos = document.getElementById('vista-res-grupos');
        let htmlGrupos = '';
        for (let g of Object.keys(gruposStats).sort()) {
            gruposStats[g].sort((a,b) => b.pts - a.pts || (b.gf-b.gc) - (a.gf-a.gc) || b.gf - a.gf);
            htmlGrupos += `<div class="seccion-contenedor"><h3 class="seccion-titulo">🎯 Grupo ${g}</h3><div style="overflow-x:auto;"><table class="tabla-stats"><thead><tr><th style="text-align:left;">Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>DG</th><th>Pts</th></td></thead><tbody>`;
            gruposStats[g].forEach((eq, i) => {
                let dg = eq.gf - eq.gc;
                htmlGrupos += `<tr><td class="td-izq"><span style="color:#aaa;">${i+1}</span><img src="https://flagcdn.com/w160/${eq.bandera}.png"><div>${eq.equipo}<span class="t-dueño d-${eq.dueño}" style="font-size:0.6rem; margin-left:6px;">${eq.dueño}</span></div></td><td>${eq.pj}</td><td>${eq.pg}</td><td>${eq.pe}</td><td>${eq.pp}</td><td>${eq.gf}</td><td>${dg>0?'+':''}${dg}</td><td style="font-weight:900;">${eq.pts}</td></tr>`;
            });
            htmlGrupos += `</tbody></table></div></div>`;
        }
        vGrupos.innerHTML = htmlGrupos;

        // Tabla changos
        let arrChangos = Object.values(estadisticasChangos);
        arrChangos.sort((a,b) => b.pts - a.pts || (b.gf-b.gc) - (a.gf-a.gc) || b.gf - a.gf);
        let maxPts = Math.max(...arrChangos.map(c=>c.pts),1);
        let grafica = '', tabla = '';
        arrChangos.forEach((c, i) => {
            let pct = (c.pts / maxPts) * 100;
            grafica += `<div class="barra-container"><div class="barra-header"><span>${c.nombre}</span><span>${c.pts} Pts</span></div><div class="barra-fondo"><div class="barra-progreso" style="width: ${Math.max(pct,2)}%; background-color: ${c.color};"></div></div></div>`;
            let dg = c.gf - c.gc;
            tabla += `<table><td class="td-izq"><span style="color:#aaa;">${i+1}</span><span class="t-dueño d-${c.nombre}">${c.nombre}</span></td><td>${c.pj}</td><td>${c.pg}</td><td>${c.pe}</td><td>${c.pp}</td><td>${c.gf}</td><td>${dg>0?'+':''}${dg}</td><td style="font-weight:900;">${c.pts}</td></tr>`;
        });
        document.getElementById('grafica-changos').innerHTML = grafica;
        document.getElementById('tabla-body-changos').innerHTML = tabla;

        const avanzadas = calcularEstadisticasAvanzadas(estadisticasChangos, equiposDatos, resultadosFinalizados);
        document.getElementById('stats-avanzadas-container').innerHTML = generarHtmlEstadisticas(estadisticasChangos, avanzadas, gruposStats);
        document.getElementById('curiosidades-container').innerHTML = generarCuriosidades(estadisticasChangos, avanzadas);
        renderizarGraficas(resultadosFinalizados, equiposDatos);
        
        if (window.cuelumeBind) window.cuelumeBind();
    }, 100);

    const changoActivo = document.querySelector('.btn-chango.active')?.getAttribute('data-chango') || 'Jona';
    renderizarMiJornada(changoActivo);
    actualizarBadgesClima();
}

function setMain(mainStr) {
    document.querySelectorAll('.m-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('m-' + mainStr).classList.add('active');
    if (mainStr === 'calendarios') {
        document.getElementById('sub-calendarios').style.display = 'flex';
        document.getElementById('sub-resultados').style.display = 'none';
        // Por defecto mostrar la primera sub-vista (general) si no hay una seleccionada
        const activeSub = document.querySelector('#sub-calendarios .s-tab.active');
        if (!activeSub) {
            setSub('cal-general');
        } else {
            setSub(activeSub.id.replace('s-', ''));
        }
    } else if (mainStr === 'resultados') {
        document.getElementById('sub-calendarios').style.display = 'none';
        document.getElementById('sub-resultados').style.display = 'flex';
        const activeSub = document.querySelector('#sub-resultados .s-tab.active');
        if (!activeSub) {
            setSub('res-grupos');
        } else {
            setSub(activeSub.id.replace('s-', ''));
        }
    } else if (mainStr === 'eliminatorias') {
        document.getElementById('sub-calendarios').style.display = 'none';
        document.getElementById('sub-resultados').style.display = 'none';
        document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
        document.getElementById('vista-cal-eliminatorias').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function setSub(subStr) {
    document.querySelectorAll('.s-tab').forEach(b => b.classList.remove('active'));
    const activeButton = document.getElementById('s-' + subStr);
    if (activeButton) activeButton.classList.add('active');
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    const vistaId = 'vista-' + subStr;
    const targetVista = document.getElementById(vistaId);
    if (targetVista) targetVista.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (subStr === 'res-chango') {
        setTimeout(() => {
            document.querySelectorAll('.barra-progreso').forEach(b => { let w = b.style.width; b.style.width = '0%'; setTimeout(() => b.style.width = w, 20); });
        }, 50);
    }
}