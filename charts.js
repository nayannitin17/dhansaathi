// ===== CHART RENDERING =====
const charts = {
  allocationChart: null,
  projectionChart: null,
  simulatorChart: null,

  chartDefaults() {
    Chart.defaults.color = '#8a8fa8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
  },

  renderAllocation(allocation) {
    this.chartDefaults();
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;
    if (this.allocationChart) this.allocationChart.destroy();

    this.allocationChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: allocation.map(a => a.name),
        datasets: [{
          data: allocation.map(a => a.pct),
          backgroundColor: allocation.map(a => a.color),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(20,24,41,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });

    // Render legend
    const legendEl = document.getElementById('allocation-legend');
    if (legendEl) {
      legendEl.innerHTML = allocation.map(a =>
        `<div class="legend-item"><div class="legend-dot" style="background:${a.color}"></div>${a.name} (${a.pct}%)</div>`
      ).join('');
    }
  },

  renderProjection(data, monthly) {
    this.chartDefaults();
    const ctx = document.getElementById('projectionChart');
    if (!ctx) return;
    if (this.projectionChart) this.projectionChart.destroy();

    this.projectionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.year === 0 ? 'Now' : `${d.year}Y`),
        datasets: [
          {
            label: 'Portfolio Value',
            data: data.map(d => d.value),
            borderColor: '#00E5A0',
            backgroundColor: 'rgba(0,229,160,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2.5
          },
          {
            label: 'Amount Invested',
            data: data.map(d => d.invested),
            borderColor: '#7B61FF',
            backgroundColor: 'rgba(123,97,255,0.05)',
            fill: true,
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.08)' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: 'rgba(255,255,255,0.08)' },
            ticks: { callback: v => portfolio.formatINR(v) }
          }
        },
        plugins: {
          legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } },
          tooltip: {
            backgroundColor: 'rgba(20,24,41,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${portfolio.formatINRFull(ctx.parsed.y)}`
            }
          }
        }
      }
    });
  },

  renderSimulator(data) {
    this.chartDefaults();
    const ctx = document.getElementById('simulatorChart');
    if (!ctx) return;
    if (this.simulatorChart) this.simulatorChart.destroy();

    this.simulatorChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.year === 0 ? 'Now' : `${d.year}Y`),
        datasets: [
          {
            label: 'Portfolio Value',
            data: data.map(d => d.value),
            borderColor: '#00E5A0',
            backgroundColor: 'rgba(0,229,160,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2.5
          },
          {
            label: 'Invested',
            data: data.map(d => d.invested),
            borderColor: 'rgba(255,255,255,0.2)',
            borderDash: [5, 5],
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 1.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.08)' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: 'rgba(255,255,255,0.08)' },
            ticks: { callback: v => portfolio.formatINR(v) }
          }
        },
        plugins: {
          legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } },
          tooltip: {
            backgroundColor: 'rgba(20,24,41,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${portfolio.formatINRFull(ctx.parsed.y)}` }
          }
        }
      }
    });
  }
};
