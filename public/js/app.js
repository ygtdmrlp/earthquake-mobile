// State Management
let earthquakes = [];
let map;
let markers = [];
let magnitudeChart;
let analysisChart;
let earthquakeInterval;

// User Settings (Default)
let userSettings = {
    notifications: false,
    minMagnitude: 2.0,
    refreshInterval: 60000,
    mapTheme: 'dark'
};

// Configuration
let REFRESH_INTERVAL = 60000; // 1 minute
const SIGNIFICANT_MAGNITUDE = 4.0;

// Initialize Icons
if (window.lucide) lucide.createIcons();

// Load Settings from LocalStorage
function loadSettings() {
    const saved = localStorage.getItem('quakeTrackerSettings');
    if (saved) {
        userSettings = { ...userSettings, ...JSON.parse(saved) };
        REFRESH_INTERVAL = userSettings.refreshInterval;
    }
    
    // Update UI settings elements
    document.getElementById('settings-notifications').checked = userSettings.notifications;
    document.getElementById('settings-min-mag').value = userSettings.minMagnitude;
    document.getElementById('min-mag-val').textContent = userSettings.minMagnitude.toFixed(1);
    document.getElementById('settings-refresh').value = userSettings.refreshInterval;
    
    updateNotificationStatus();
}

function saveSettings() {
    localStorage.setItem('quakeTrackerSettings', JSON.stringify(userSettings));
    REFRESH_INTERVAL = userSettings.refreshInterval;
    
    // Restart interval with new time
    clearInterval(earthquakeInterval);
    earthquakeInterval = setInterval(fetchEarthquakes, REFRESH_INTERVAL);
    
    fetchEarthquakes(); // Immediate refresh
}

// Initialize Map
function initMap() {
    console.log('Initializing map...');
    try {
        const center = [39.0, 35.0];
        const zoom = 6;
        
        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView(center, zoom);

        const tileUrl = userSettings.mapTheme === 'dark' 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);
    } catch (e) {
        console.error('Error initializing map:', e);
    }
}

// Fetch Data from API
async function fetchEarthquakes() {
    console.log('Fetching earthquakes...');
    try {
        const response = await fetch('/api/earthquakes');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (!Array.isArray(data)) return;

        // Filter by min magnitude
        const filteredData = data.filter(eq => (parseFloat(eq.mag) || 0) >= userSettings.minMagnitude);
        console.log(`Received ${data.length} earthquakes, showing ${filteredData.length} (Min: ${userSettings.minMagnitude})`);
        
        // Check for new significant earthquakes and send push notification
        if (earthquakes.length > 0 && filteredData.length > 0) {
            const latestNew = filteredData[0];
            const isKnown = earthquakes.some(eq => eq.earthquake_id === latestNew.earthquake_id);
            if (!isKnown) {
                const mag = parseFloat(latestNew.mag);
                if (mag >= SIGNIFICANT_MAGNITUDE) {
                    showToast(`Şiddetli Deprem: ${latestNew.title}`, latestNew.mag);
                    if (userSettings.notifications) {
                        sendPushNotification(latestNew);
                    }
                }
            }
        }

        earthquakes = filteredData;
        updateUI();
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('earthquake-count').textContent = 'Bağlantı Hatası';
    }
}

// Push Notification Logic
function sendPushNotification(eq) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification("Yeni Deprem!", {
            body: `${eq.title} - Büyüklük: ${eq.mag}`,
            icon: '/favicon.ico'
        });
    }
}

function updateNotificationStatus() {
    const statusEl = document.getElementById('notification-status');
    if (!("Notification" in window)) {
        statusEl.textContent = "Tarayıcınız bildirimleri desteklemiyor.";
        return;
    }
    
    if (Notification.permission === "granted") {
        statusEl.textContent = "Bildirim izni verildi.";
    } else if (Notification.permission === "denied") {
        statusEl.textContent = "Bildirim izni reddedildi. Lütfen tarayıcı ayarlarından düzeltin.";
    } else {
        statusEl.textContent = "Bildirim izni henüz sorulmadı.";
    }
}

// Update UI Components
function updateUI() {
    if (!earthquakes) return;
    console.log('Updating UI...');
    renderList();
    renderMarkers();
    updateStats();
    updateChart();
    document.getElementById('earthquake-count').textContent = `${earthquakes.length} Kayıt`;
}

// Render Earthquake List
function renderList() {
    console.log('Rendering list...');
    const listContainer = document.getElementById('quake-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    if (earthquakes.length === 0) {
        listContainer.innerHTML = '<div class="text-center p-8 text-gray-500 text-sm">Deprem bulunamadı.</div>';
        return;
    }

    earthquakes.slice(0, 50).forEach(eq => {
        const mag = parseFloat(eq.mag) || 0;
        const dateStr = eq.date_time || eq.date || '';
        const dateParts = dateStr.split(' ');
        const dateOnly = dateParts[0] || '';
        const timeOnly = dateParts[1] || '';

        const magClass = mag >= 4.5 ? 'text-neon-red' : mag >= 3.0 ? 'text-neon-amber' : 'text-neon-cyan';
        const magBg = mag >= 4.5 ? 'bg-neon-red/10 border-neon-red/20' : mag >= 3.0 ? 'bg-neon-amber/10 border-neon-amber/20' : 'bg-neon-cyan/10 border-neon-cyan/20';

        const card = document.createElement('div');
        card.className = `quake-card p-4 rounded-xl bg-dark-lighter border border-white/5 cursor-pointer flex items-center gap-4 hover:border-white/20`;
        card.onclick = () => focusOnQuake(eq);

        card.innerHTML = `
            <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg border ${magBg} ${magClass} font-bold text-lg">
                ${mag.toFixed(1)}
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-white truncate">${eq.title || 'Bilinmeyen Konum'}</h3>
                <div class="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                    <span class="flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3"></i> ${timeOnly}
                    </span>
                    <span class="flex items-center gap-1">
                        <i data-lucide="arrow-down" class="w-3 h-3"></i> ${eq.depth || 0}km
                    </span>
                </div>
            </div>
            <div class="text-[10px] text-gray-600 font-mono">
                ${dateOnly}
            </div>
        `;
        listContainer.appendChild(card);
    });
    if (window.lucide) lucide.createIcons();
}

// Render Map Markers
function renderMarkers() {
    if (!map) return;
    console.log('Rendering markers...');
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    earthquakes.forEach(eq => {
        const mag = parseFloat(eq.mag) || 0;
        const color = mag >= 4.5 ? '#ff3333' : mag >= 3.0 ? '#ffcc00' : '#00f3ff';
        const radius = Math.max(mag * 3, 5);
        const dateStr = eq.date_time || eq.date || '';

        if (!eq.geojson || !eq.geojson.coordinates) return;

        try {
            const marker = L.circleMarker([eq.geojson.coordinates[1], eq.geojson.coordinates[0]], {
                radius: radius,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.3,
                className: mag >= SIGNIFICANT_MAGNITUDE ? 'pulse-marker' : ''
            }).addTo(map);

            marker.bindPopup(`
                <div class="p-2 min-w-[150px]">
                    <div class="text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">${dateStr}</div>
                    <div class="text-lg font-bold text-white mb-1">${eq.title || 'Bilinmeyen Konum'}</div>
                    <div class="grid grid-cols-2 gap-2 mt-3">
                        <div class="bg-white/5 p-2 rounded">
                            <div class="text-[10px] text-gray-500">Büyüklük</div>
                            <div class="text-sm font-bold" style="color: ${color}">${mag.toFixed(1)}</div>
                        </div>
                        <div class="bg-white/5 p-2 rounded">
                            <div class="text-[10px] text-gray-500">Derinlik</div>
                            <div class="text-sm font-bold text-white">${eq.depth || 0}km</div>
                        </div>
                    </div>
                </div>
            `, {
                closeButton: false,
                offset: [0, -5]
            });

            markers.push(marker);
        } catch (e) {
            console.error('Error adding marker:', e);
        }
    });
}

// Stats Calculation
function updateStats() {
    if (earthquakes.length === 0) return;

    const mags = earthquakes.map(e => parseFloat(e.mag));
    const depths = earthquakes.map(e => parseFloat(e.depth));

    document.getElementById('max-mag').textContent = Math.max(...mags).toFixed(1);
    document.getElementById('avg-depth').textContent = (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1) + 'km';
}

// Chart.js Visualization
function updateChart() {
    const ctx = document.getElementById('magnitudeChart').getContext('2d');
    
    // Group by magnitude ranges
    const ranges = { '2-3': 0, '3-4': 0, '4-5': 0, '5+': 0 };
    earthquakes.forEach(eq => {
        const m = parseFloat(eq.mag);
        if (m < 3) ranges['2-3']++;
        else if (m < 4) ranges['3-4']++;
        else if (m < 5) ranges['4-5']++;
        else ranges['5+']++;
    });

    if (magnitudeChart) magnitudeChart.destroy();

    magnitudeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                label: 'Deprem Sayısı',
                data: Object.values(ranges),
                backgroundColor: [
                    'rgba(0, 243, 255, 0.2)',
                    'rgba(255, 204, 0, 0.2)',
                    'rgba(255, 51, 51, 0.2)',
                    'rgba(255, 0, 243, 0.2)'
                ],
                borderColor: [
                    '#00f3ff',
                    '#ffcc00',
                    '#ff3333',
                    '#ff00f3'
                ],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#666', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#666', font: { size: 10 } }
                }
            }
        }
    });
}

// Helper Functions
function focusOnQuake(eq) {
    const lat = eq.geojson.coordinates[1];
    const lng = eq.geojson.coordinates[0];
    map.flyTo([lat, lng], 10, { duration: 1.5 });
    
    // Find marker and open popup
    const marker = markers.find(m => {
        const pos = m.getLatLng();
        return pos.lat === lat && pos.lng === lng;
    });
    if (marker) marker.openPopup();

    // Close mobile menu if open
    document.querySelector('aside').classList.remove('mobile-open');
}

function showToast(message, mag) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `glassmorphism p-4 rounded-xl border border-neon-red/30 shadow-2xl flex items-center gap-4 translate-x-full transition-transform duration-500`;
    
    toast.innerHTML = `
        <div class="w-10 h-10 bg-neon-red/20 rounded-lg flex items-center justify-center text-neon-red">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
        </div>
        <div>
            <div class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Yeni Şiddetli Deprem</div>
            <div class="text-sm font-bold text-white">${message} (M${mag})</div>
        </div>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

// Mobile List Toggle Logic
document.getElementById('mobile-list-toggle').onclick = (e) => {
    e.stopPropagation();
    console.log('Mobile toggle clicked');
    document.querySelector('aside').classList.toggle('mobile-open');
};

document.getElementById('mobile-close-list').onclick = () => {
    document.querySelector('aside').classList.remove('mobile-open');
};

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const aside = document.querySelector('aside');
    const toggle = document.getElementById('mobile-list-toggle');
    if (window.innerWidth <= 768 && 
        aside.classList.contains('mobile-open') && 
        !aside.contains(e.target) && 
        !toggle.contains(e.target)) {
        aside.classList.remove('mobile-open');
    }
});

// Navigation Logic
const handleLiveNav = () => {
    document.getElementById('analysis-panel').classList.add('hidden');
    document.getElementById('settings-panel').classList.add('hidden');
    document.getElementById('about-modal').classList.add('hidden');
    setActiveLink('nav-live');
    setActiveMobLink('mob-nav-live');
};

const handleAnalysisNav = () => {
    renderAnalysis();
    document.getElementById('analysis-panel').classList.remove('hidden');
    document.getElementById('settings-panel').classList.add('hidden');
    document.getElementById('about-modal').classList.add('hidden');
    setActiveLink('nav-analysis');
    setActiveMobLink('mob-nav-analysis');
};

const handleSettingsNav = () => {
    document.getElementById('settings-panel').classList.remove('hidden');
    document.getElementById('analysis-panel').classList.add('hidden');
    document.getElementById('about-modal').classList.add('hidden');
    setActiveLink('nav-settings');
    setActiveMobLink('mob-nav-settings');
};

const handleAboutNav = () => {
    document.getElementById('about-modal').classList.remove('hidden');
    document.getElementById('settings-panel').classList.add('hidden');
    document.getElementById('analysis-panel').classList.add('hidden');
    setActiveLink('nav-about');
    setActiveMobLink('mob-nav-about');
};

document.getElementById('nav-live').onclick = handleLiveNav;
document.getElementById('nav-analysis').onclick = handleAnalysisNav;
document.getElementById('nav-settings').onclick = handleSettingsNav;
document.getElementById('nav-about').onclick = handleAboutNav;

document.getElementById('mob-nav-live').onclick = handleLiveNav;
document.getElementById('mob-nav-analysis').onclick = handleAnalysisNav;
document.getElementById('mob-nav-settings').onclick = handleSettingsNav;
document.getElementById('mob-nav-about').onclick = handleAboutNav;

document.getElementById('close-settings').onclick = handleLiveNav;
document.getElementById('close-analysis').onclick = handleLiveNav;
document.getElementById('close-about').onclick = handleLiveNav;

// Settings Event Listeners
document.getElementById('settings-notifications').onchange = async (e) => {
    if (e.target.checked) {
        const permission = await Notification.requestPermission();
        userSettings.notifications = permission === 'granted';
        if (permission !== 'granted') e.target.checked = false;
    } else {
        userSettings.notifications = false;
    }
    updateNotificationStatus();
    saveSettings();
};

document.getElementById('settings-min-mag').oninput = (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('min-mag-val').textContent = val.toFixed(1);
};

document.getElementById('settings-min-mag').onchange = (e) => {
    userSettings.minMagnitude = parseFloat(e.target.value);
    saveSettings();
};

document.getElementById('settings-refresh').onchange = (e) => {
    userSettings.refreshInterval = parseInt(e.target.value);
    saveSettings();
};

document.querySelectorAll('.map-theme-btn').forEach(btn => {
    btn.onclick = (e) => {
        const theme = e.target.dataset.theme;
        userSettings.mapTheme = theme;
        
        // Update UI
        document.querySelectorAll('.map-theme-btn').forEach(b => {
            b.classList.remove('border-neon-cyan', 'bg-neon-cyan/10', 'text-neon-cyan');
            b.classList.add('border-white/5', 'bg-white/5', 'text-gray-400');
        });
        e.target.classList.remove('border-white/5', 'bg-white/5', 'text-gray-400');
        e.target.classList.add('border-neon-cyan', 'bg-neon-cyan/10', 'text-neon-cyan');
        
        // Refresh Map
        if (map) {
            map.remove();
            initMap();
            renderMarkers();
        }
        saveSettings();
    };
});

function setActiveLink(id) {
    const links = ['nav-live', 'nav-analysis', 'nav-settings', 'nav-about'];
    links.forEach(l => {
        const el = document.getElementById(l);
        if (el) {
            if (l === id) el.classList.add('active-link');
            else el.classList.remove('active-link');
        }
    });
}

function setActiveMobLink(id) {
    const mobLinks = ['mob-nav-live', 'mob-nav-analysis', 'mob-nav-settings', 'mob-nav-about'];
    mobLinks.forEach(l => {
        const el = document.getElementById(l);
        if (el) {
            if (l === id) {
                el.classList.add('mob-nav-active');
                el.classList.remove('text-gray-500');
            } else {
                el.classList.remove('mob-nav-active');
                el.classList.add('text-gray-500');
            }
        }
    });
}

function renderAnalysis() {
    if (earthquakes.length === 0) return;

    // Stats
    const mags = earthquakes.map(e => parseFloat(e.mag) || 0);
    const depths = earthquakes.map(e => parseFloat(e.depth) || 0);
    
    document.getElementById('total-count-anal').textContent = earthquakes.length;
    document.getElementById('max-mag-anal').textContent = Math.max(...mags).toFixed(1);
    document.getElementById('avg-depth-anal').textContent = (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1) + 'km';

    // Analysis Chart
    const ctx = document.getElementById('analysisChart').getContext('2d');
    const ranges = { '2.0-3.0': 0, '3.0-4.0': 0, '4.0-5.0': 0, '5.0-6.0': 0, '6.0+': 0 };
    earthquakes.forEach(eq => {
        const m = parseFloat(eq.mag) || 0;
        if (m < 3) ranges['2.0-3.0']++;
        else if (m < 4) ranges['3.0-4.0']++;
        else if (m < 5) ranges['4.0-5.0']++;
        else if (m < 6) ranges['5.0-6.0']++;
        else ranges['6.0+']++;
    });

    if (analysisChart) analysisChart.destroy();
    analysisChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                data: Object.values(ranges),
                backgroundColor: ['#00f3ff', '#ffcc00', '#ff3333', '#ff00f3', '#ffffff'],
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#888', font: { size: 12, family: 'Plus Jakarta Sans' }, padding: 20 }
                }
            },
            cutout: '70%'
        }
    });

    // Top Regions
    const regions = {};
    earthquakes.forEach(eq => {
        const city = eq.location_properties?.epiCenter?.name || eq.title.split('(')[1]?.replace(')', '') || 'Diğer';
        regions[city] = (regions[city] || 0) + 1;
    });

    const sortedRegions = Object.entries(regions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const regionsContainer = document.getElementById('top-regions');
    regionsContainer.innerHTML = sortedRegions.map(([name, count]) => `
        <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <span class="text-white font-medium">${name}</span>
            <span class="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-xs font-bold rounded-full border border-neon-cyan/20">
                ${count} Deprem
            </span>
        </div>
    `).join('');
}

// Initial Load
window.addEventListener('load', () => {
    loadSettings();
    initMap();
    fetchEarthquakes();
    earthquakeInterval = setInterval(fetchEarthquakes, REFRESH_INTERVAL);
    if (window.lucide) lucide.createIcons();
});
