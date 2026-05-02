// ===== PORTFOLIO ENGINE =====
const portfolio = {
  riskProfiles: {
    conservative: {
      label: 'Conservative',
      expectedReturn: 0.09,
      allocation: [
        { name: 'Debt Mutual Funds', pct: 40, color: '#00B4D8', icon: '🛡️', fund: 'HDFC Short Term Debt Fund', return3y: '7.2%' },
        { name: 'Fixed Deposits', pct: 25, color: '#7B61FF', icon: '🏦', fund: 'SBI FD (1-3 Year)', return3y: '7.0%' },
        { name: 'Gold ETF', pct: 15, color: '#FFD93D', icon: '🥇', fund: 'Nippon Gold BeES', return3y: '14.5%' },
        { name: 'Large Cap Equity', pct: 15, color: '#00E5A0', icon: '📊', fund: 'Nifty 50 Index Fund', return3y: '12.8%' },
        { name: 'Liquid Fund', pct: 5, color: '#FF6B6B', icon: '💧', fund: 'Parag Parikh Liquid Fund', return3y: '6.5%' }
      ]
    },
    moderate: {
      label: 'Moderate',
      expectedReturn: 0.12,
      allocation: [
        { name: 'Large Cap Equity', pct: 30, color: '#00E5A0', icon: '📊', fund: 'UTI Nifty 50 Index Fund', return3y: '12.8%' },
        { name: 'Flexi Cap Fund', pct: 25, color: '#00B4D8', icon: '📈', fund: 'Parag Parikh Flexi Cap', return3y: '16.2%' },
        { name: 'Debt Fund', pct: 20, color: '#7B61FF', icon: '🛡️', fund: 'ICICI Pru Short Term', return3y: '7.5%' },
        { name: 'Gold ETF', pct: 15, color: '#FFD93D', icon: '🥇', fund: 'SBI Gold ETF', return3y: '14.5%' },
        { name: 'Mid Cap Fund', pct: 10, color: '#FF6B6B', icon: '🚀', fund: 'Motilal Oswal Midcap', return3y: '18.1%' }
      ]
    },
    aggressive: {
      label: 'Aggressive',
      expectedReturn: 0.15,
      allocation: [
        { name: 'Mid Cap Fund', pct: 30, color: '#FF6B6B', icon: '🚀', fund: 'Motilal Oswal Midcap', return3y: '18.1%' },
        { name: 'Flexi Cap Fund', pct: 25, color: '#00B4D8', icon: '📈', fund: 'Parag Parikh Flexi Cap', return3y: '16.2%' },
        { name: 'Small Cap Fund', pct: 20, color: '#E040FB', icon: '💎', fund: 'Nippon Small Cap Fund', return3y: '22.4%' },
        { name: 'Large Cap Equity', pct: 15, color: '#00E5A0', icon: '📊', fund: 'UTI Nifty 50 Index', return3y: '12.8%' },
        { name: 'Gold ETF', pct: 10, color: '#FFD93D', icon: '🥇', fund: 'Nippon Gold BeES', return3y: '14.5%' }
      ]
    }
  },

  getSIPAmount(income) {
    const n = parseInt(income);
    if (n <= 15000) return 1500;
    if (n <= 30000) return 3000;
    if (n <= 60000) return 5000;
    return 10000;
  },

  calcFutureValue(monthly, years, rate) {
    const n = years * 12;
    const r = rate / 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  },

  formatINR(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + Math.round(num);
  },

  formatINRFull(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  },

  getProjectionData(monthly, years, rate) {
    const data = [];
    for (let y = 0; y <= years; y++) {
      data.push({
        year: y,
        invested: monthly * 12 * y,
        value: y === 0 ? 0 : this.calcFutureValue(monthly, y, rate)
      });
    }
    return data;
  }
};
