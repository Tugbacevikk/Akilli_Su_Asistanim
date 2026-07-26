/* 
  Akıllı Su Asistanım - Chart.js Visualizations
*/

let consumptionChartInstance = null;
let damsPieChartInstance = null;
let weatherCorrelationChartInstance = null;
let historicalDamChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    // 1. Dashboard Consumption Chart (Bar / Line)
    const ctxConsumption = document.getElementById('dashboardConsumptionChart');
    if (ctxConsumption) {
        consumptionChartInstance = new Chart(ctxConsumption, {
            type: 'bar',
            data: {
                labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
                datasets: [{
                    label: 'Su Tüketimi (Litre)',
                    data: [110, 95, 120, 105, 140, 160, 125],
                    backgroundColor: 'rgba(6, 182, 212, 0.65)',
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    borderRadius: 8,
                }, {
                    label: 'Tasarruf Hedefi (Litre)',
                    data: [100, 100, 100, 100, 100, 100, 100],
                    type: 'line',
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // 2. Bursa Dams Breakdown Pie Chart
    const ctxDams = document.getElementById('damsPieChart');
    if (ctxDams) {
        damsPieChartInstance = new Chart(ctxDams, {
            type: 'doughnut',
            data: {
                labels: ['Doğancı Barajı (%72)', 'Nilüfer Barajı (%64)', 'Çınarcık Barajı (%58)'],
                datasets: [{
                    data: [72, 64, 58],
                    backgroundColor: [
                        '#0284c7',
                        '#06b6d4',
                        '#6366f1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                },
                cutout: '70%'
            }
        });
    }

    // 3. Temperature vs Water Usage Correlation Chart
    const ctxCorr = document.getElementById('weatherCorrelationChart');
    if (ctxCorr) {
        weatherCorrelationChartInstance = new Chart(ctxCorr, {
            type: 'line',
            data: {
                labels: ['18°C', '22°C', '26°C', '30°C', '34°C', '38°C'],
                datasets: [{
                    label: 'Ortalama Tüketim (Litre)',
                    data: [85, 98, 115, 142, 168, 195],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // 4. Historical Dam Water Levels (TÜBİTAK Proposal Page 3 Chart Replica)
    const ctxHistDam = document.getElementById('historicalDamChart');
    if (ctxHistDam) {
        historicalDamChartInstance = new Chart(ctxHistDam, {
            type: 'bar',
            data: {
                labels: ['11-2024', '12-2024', '01-2025', '02-2025', '03-2025', '04-2025', '05-2025', '06-2025', '07-2025', '08-2025', '09-2025', '10-2025'],
                datasets: [{
                    label: 'Bursa Toplam Baraj Doluluk Oranı (%)',
                    data: [18, 15, 23, 35, 48, 55, 51, 38, 24, 18, 10, 2],
                    backgroundColor: 'rgba(2, 132, 199, 0.7)',
                    borderColor: '#0284c7',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { 
                        min: 0, max: 100,
                        ticks: { color: '#94a3b8' }, 
                        grid: { color: 'rgba(255,255,255,0.05)' } 
                    }
                }
            }
        });
    }
}
