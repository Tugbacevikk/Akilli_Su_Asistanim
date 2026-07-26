/* 
  Akıllı Su Asistanım - Günlük Kullanıcı Akışı ve Mobil Mantık
*/

// Varsayılan Kullanım Kayıtları (Örnek Veriler)
const DEFAULT_LOGS = [
    { date: '2026-07-26', showerMins: 12, totalLitres: 96, status: 'Normal', tip: 'Duş süresini 3 dk düşürebilirsin' },
    { date: '2026-07-25', showerMins: 8, totalLitres: 78, status: 'İdeal', tip: 'Tebrikler, çok iyi!' },
    { date: '2026-07-24', showerMins: 15, totalLitres: 130, status: 'Yüksek', tip: 'Sıcak havada tasarruf yapın' },
    { date: '2026-07-23', showerMins: 10, totalLitres: 90, status: 'Dengeli', tip: 'Düzenli kullanım' }
];

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initLogs();
    initDailyTips();
    updateMLPrediction();

    // Bugünün tarihini form girdisine ayarla
    const todayInput = document.getElementById('log-date');
    if (todayInput) {
        todayInput.value = new Date().toISOString().split('T')[0];
    }
});

/* -------------------------------------------------------------
   Mobil & Masaüstü Navigasyon Yönetimi
------------------------------------------------------------- */
function initNavigation() {
    // Hem masaüstü hem de mobil menü öğelerini bağla
    const allNavItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

    allNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');

            // Aktif sınıfları güncelle
            allNavItems.forEach(n => {
                if (n.getAttribute('data-tab') === targetTab) {
                    n.classList.add('active');
                } else {
                    n.classList.remove('active');
                }
            });

            // Sekme sayfalarını güncelle
            const tabPages = document.querySelectorAll('.tab-page');
            tabPages.forEach(page => page.classList.remove('active'));

            const activePage = document.getElementById(targetTab);
            if (activePage) {
                activePage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

/* -------------------------------------------------------------
   Tema Değiştirme (Aydınlık / Koyu)
------------------------------------------------------------- */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        });
    }
}

/* -------------------------------------------------------------
   Mobil Stepper (+ ve - Butonları)
------------------------------------------------------------- */
function adjustValue(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    let val = parseInt(input.value) || 0;
    val += delta;
    if (val < 0) val = 0;
    input.value = val;
    calculateInstantLitres();
}

/* -------------------------------------------------------------
   Su Tüketim Hesaplama ve Kayıt
------------------------------------------------------------- */
function calculateInstantLitres() {
    const shower = parseFloat(document.getElementById('shower-mins').value) || 0;
    const faucet = parseFloat(document.getElementById('faucet-mins').value) || 0;
    const flush = parseFloat(document.getElementById('flush-count').value) || 0;
    const appliances = parseFloat(document.getElementById('appliance-runs').value) || 0;

    // Duş (8L/dk), Musluk (6L/dk), Sifon (6L/adet), Makine (15L/yıkama)
    const total = (shower * 8) + (faucet * 6) + (flush * 6) + (appliances * 15);
    const rounded = Math.round(total);

    const calcEl = document.getElementById('calculated-total-litres');
    if (calcEl) calcEl.textContent = rounded;
    return rounded;
}

function initLogs() {
    let storedLogs = localStorage.getItem('water_logs');
    if (!storedLogs) {
        localStorage.setItem('water_logs', JSON.stringify(DEFAULT_LOGS));
        storedLogs = JSON.stringify(DEFAULT_LOGS);
    }
    renderLogsTable(JSON.parse(storedLogs));
}

function renderLogsTable(logs) {
    const tbody = document.getElementById('logs-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    logs.forEach((log, index) => {
        let badgeClass = 'success';
        if (log.totalLitres > 110) badgeClass = 'warning';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${log.date}</strong></td>
            <td>${log.showerMins} dk</td>
            <td><strong>${log.totalLitres} L</strong></td>
            <td><span class="stat-badge ${badgeClass}">${log.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="deleteLog(${index})" title="Sil">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleWaterLogSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('log-date').value;
    const showerMins = parseInt(document.getElementById('shower-mins').value) || 0;
    const totalLitres = calculateInstantLitres();

    let status = 'İdeal';
    if (totalLitres > 110) status = 'Yüksek';

    const newLog = { date, showerMins, totalLitres, status, tip: 'Günlük kaydına eklendi' };

    let logs = JSON.parse(localStorage.getItem('water_logs')) || [];
    logs.unshift(newLog);
    localStorage.setItem('water_logs', JSON.stringify(logs));
    
    renderLogsTable(logs);
    alert('✅ Su kullanım kaydın başarıyla kaydedildi!');
}

function deleteLog(index) {
    let logs = JSON.parse(localStorage.getItem('water_logs')) || [];
    logs.splice(index, 1);
    localStorage.setItem('water_logs', JSON.stringify(logs));
    renderLogsTable(logs);
}

function clearLogs() {
    if (confirm('Tüm geçmiş kayıtlarını silmek istediğine emin misin?')) {
        localStorage.removeItem('water_logs');
        renderLogsTable([]);
    }
}

/* -------------------------------------------------------------
   Tahmin Hesaplayıcı (Doğal Türkçe İfadelerle)
------------------------------------------------------------- */
function updateMLPrediction() {
    const temp = parseFloat(document.getElementById('param-temp').value);
    const humidity = parseFloat(document.getElementById('param-humidity').value);
    const dam = parseFloat(document.getElementById('param-dam').value);
    const prev = parseFloat(document.getElementById('param-prev').value);

    document.getElementById('val-temp').textContent = temp + '°C';
    document.getElementById('val-humidity').textContent = '%' + humidity;
    document.getElementById('val-dam').textContent = '%' + dam;
    document.getElementById('val-prev').textContent = prev + ' L';

    // Tahmin formülü:
    let y = 18.5 + (2.1 * temp) - (0.35 * humidity) - (0.4 * dam) + (0.55 * prev);
    if (y < 40) y = 40;

    const roundedY = Math.round(y);
    const outputEl = document.getElementById('ml-predicted-output');
    if (outputEl) {
        outputEl.textContent = roundedY + ' Litre';
    }
}

/* -------------------------------------------------------------
   Günlük Pratik İpuçları (Doğal ve İnsani Dille)
------------------------------------------------------------- */
function initDailyTips() {
    const tips = [
        {
            title: "Sıcak Havalarda Balkon & Bahçe Sulaması",
            desc: "Bursa'da hava sıcaklığı 32°C. Buharlaşmayı önlemek için sulamayı akşam serinliğinde yaparsan tonlarca su tasarruf edersin.",
            type: "warning",
            icon: "fa-sun"
        },
        {
            title: "Duş Süreni 8 Dakikada Tut",
            desc: "Duşta geçirdiğin her ekstra dakika yaklaşık 8 litre su tüketir. Süreni 4 dakika kısaltarak günde 32 Litre su biriktirebilirsin.",
            type: "success",
            icon: "fa-shower"
        },
        {
            title: "Bursa Baraj Doluluğu İyi Durumda",
            desc: "Doğancı ve Nilüfer barajlarındaki doluluk %68 seviyesinde. Bilinçli kullanımımız sayesinde su seviyesi korunuyor.",
            type: "info",
            icon: "fa-water"
        }
    ];

    const dashContainer = document.getElementById('dashboard-ai-suggestions');
    const fullContainer = document.getElementById('full-recommendations-list');

    const html = tips.map(s => `
        <div class="rec-card ${s.type}">
            <div class="rec-icon text-${s.type === 'warning' ? 'amber' : s.type === 'success' ? 'emerald' : 'cyan'}">
                <i class="fa-solid ${s.icon}"></i>
            </div>
            <div class="rec-content">
                <h4>${s.title}</h4>
                <p>${s.desc}</p>
            </div>
        </div>
    `).join('');

    if (dashContainer) dashContainer.innerHTML = html;
    if (fullContainer) fullContainer.innerHTML = html;
}

/* -------------------------------------------------------------
   CSV Dışa Aktarma
------------------------------------------------------------- */
function exportLogsCSV() {
    let logs = JSON.parse(localStorage.getItem('water_logs')) || DEFAULT_LOGS;
    let csvContent = "data:text/csv;charset=utf-8,Tarih,DusSuresi_Dk,ToplamTuketim_Litre,Durum\n";

    logs.forEach(l => {
        csvContent += `${l.date},${l.showerMins},${l.totalLitres},${l.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bursa_su_tuketim_kayitlarim.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* Modal */
function openLogModal() {
    document.getElementById('logModal').classList.add('active');
}
function closeLogModal() {
    document.getElementById('logModal').classList.remove('active');
}
function saveModalLog() {
    const mins = parseInt(document.getElementById('modal-shower').value) || 10;
    const litres = parseInt(document.getElementById('modal-litres').value) || 90;
    const date = new Date().toISOString().split('T')[0];

    const newLog = {
        date,
        showerMins: mins,
        totalLitres: litres,
        status: litres > 110 ? 'Yüksek' : 'İdeal',
        tip: 'Eklenen kayıt'
    };

    let logs = JSON.parse(localStorage.getItem('water_logs')) || [];
    logs.unshift(newLog);
    localStorage.setItem('water_logs', JSON.stringify(logs));
    renderLogsTable(logs);

    closeLogModal();
    alert('Kullanım kaydın eklendi!');
}
