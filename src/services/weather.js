const coordenadasCiudades = {
    "mexico city": { lat: 19.4326, lon: -99.1332, name: "Mexico City" },
    "ciudad de méxico": { lat: 19.4326, lon: -99.1332, name: "Mexico City" },
    "mexico df": { lat: 19.4326, lon: -99.1332, name: "Mexico City" },
    "guadalajara": { lat: 20.6790, lon: -103.3496, name: "Guadalajara" },
    "zapopan": { lat: 20.6790, lon: -103.3496, name: "Guadalajara" },
    "monterrey": { lat: 25.6866, lon: -100.3161, name: "Monterrey" },
    "guadalupe": { lat: 25.6866, lon: -100.3161, name: "Monterrey" },
    "vancouver": { lat: 49.2827, lon: -123.1207, name: "Vancouver" },
    "toronto": { lat: 43.6532, lon: -79.3832, name: "Toronto" },
    "new york": { lat: 40.8340, lon: -74.0971, name: "New York/New Jersey" },
    "new jersey": { lat: 40.8340, lon: -74.0971, name: "New York/New Jersey" },
    "east rutherford": { lat: 40.8340, lon: -74.0971, name: "New York/New Jersey" },
    "dallas": { lat: 32.7357, lon: -97.1081, name: "Dallas" },
    "arlington": { lat: 32.7357, lon: -97.1081, name: "Dallas" },
    "kansas city": { lat: 39.0997, lon: -94.5786, name: "Kansas City" },
    "houston": { lat: 29.7604, lon: -95.3698, name: "Houston" },
    "atlanta": { lat: 33.7490, lon: -84.3880, name: "Atlanta" },
    "los angeles": { lat: 33.9617, lon: -118.3531, name: "Los Angeles" },
    "inglewood": { lat: 33.9617, lon: -118.3531, name: "Los Angeles" },
    "philadelphia": { lat: 39.9526, lon: -75.1652, name: "Philadelphia" },
    "seattle": { lat: 47.6062, lon: -122.3321, name: "Seattle" },
    "san francisco": { lat: 37.3541, lon: -121.9552, name: "San Francisco Bay Area" },
    "santa clara": { lat: 37.3541, lon: -121.9552, name: "San Francisco Bay Area" },
    "boston": { lat: 42.0654, lon: -71.2484, name: "Boston" },
    "foxborough": { lat: 42.0654, lon: -71.2484, name: "Boston" },
    "miami": { lat: 25.9420, lon: -80.2456, name: "Miami" },
    "miami gardens": { lat: 25.9420, lon: -80.2456, name: "Miami" }
};

function buscarCoordenadas(ciudad) {
    if (!ciudad) return null;
    const norm = ciudad.toLowerCase().trim();
    for (let key in coordenadasCiudades) {
        if (norm.includes(key) || key.includes(norm)) {
            return coordenadasCiudades[key];
        }
    }
    return null;
}

function obtenerClimaParaSede(sede) {
    if (!sede) return null;
    const coord = buscarCoordenadas(sede);
    if (!coord) return null;
    return climaSedes[coord.name] || null;
}

function obtenerIconoClima(codigo) {
    if (codigo === 0) return { icon: '☀️', desc: 'Despejado' };
    if ([1, 2, 3].includes(codigo)) return { icon: '⛅', desc: 'Nublado' };
    if ([45, 48].includes(codigo)) return { icon: '🌫️', desc: 'Niebla' };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return { icon: '🌧️', desc: 'Lluvia' };
    if ([71, 73, 75, 77, 85, 86].includes(codigo)) return { icon: '❄️', desc: 'Nieve' };
    if ([95, 96, 99].includes(codigo)) return { icon: '⛈️', desc: 'Tormenta' };
    return { icon: '🌡️', desc: 'Clima' };
}

async function cargarClimaSedes() {
    const cached = localStorage.getItem('climaSedesCache');
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 30 * 60 * 1000) { // 30 minutos
                Object.assign(climaSedes, parsed.data);
                actualizarBadgesClima();
                return;
            }
        } catch (e) {}
    }

    const ciudadesUnicasMap = {};
    for (let key in coordenadasCiudades) {
        const c = coordenadasCiudades[key];
        ciudadesUnicasMap[c.name] = { lat: c.lat, lon: c.lon };
    }
    const ciudades = Object.keys(ciudadesUnicasMap).map(name => ({ name, ...ciudadesUnicasMap[name] }));
    
    try {
        const lats = ciudades.map(c => c.lat).join(',');
        const lons = ciudades.map(c => c.lon).join(',');
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`);
        if (!response.ok) throw new Error("Error en Open-Meteo");
        const data = await response.json();
        
        const results = Array.isArray(data) ? data : [data];
        results.forEach((res, index) => {
            if (res && res.current_weather) {
                const c = ciudades[index];
                const infoClima = obtenerIconoClima(res.current_weather.weathercode);
                climaSedes[c.name] = {
                    temp: Math.round(res.current_weather.temperature),
                    icon: infoClima.icon,
                    desc: infoClima.desc
                };
            }
        });
        localStorage.setItem('climaSedesCache', JSON.stringify({ timestamp: Date.now(), data: climaSedes }));
        actualizarBadgesClima();
    } catch (error) {
        console.error("Error al cargar clima:", error);
    }
}

function actualizarBadgesClima() {
    document.querySelectorAll('.clima-badge-inline').forEach(span => {
        const sede = span.getAttribute('data-sede');
        const climaInfo = obtenerClimaParaSede(sede);
        if (climaInfo) {
            span.innerHTML = ` <span class="clima-badge-item" title="${climaInfo.desc}">${climaInfo.icon} ${climaInfo.temp}°C</span>`;
            span.style.opacity = '1';
        }
    });
}
