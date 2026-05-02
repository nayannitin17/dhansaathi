// ===== MAIN APP CONTROLLER =====
const app = {
  userProfile: { income: null, goal: null, risk: null },
  currentStep: 1,

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  startOnboarding() {
    this.showScreen('onboarding-screen');
  },

  selectOption(type, el) {
    const parent = el.closest('.option-grid');
    parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    this.userProfile[type] = el.dataset.value;

    setTimeout(() => {
      if (type === 'income') this.goToStep(2);
      else if (type === 'goal') this.goToStep(3);
      else if (type === 'risk') this.finishOnboarding();
    }, 400);
  },

  goToStep(step) {
    this.currentStep = step;
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById('onboarding-progress-fill').style.width = `${(step / 3) * 100}%`;
    document.getElementById('onboarding-step-text').textContent = `Step ${step} of 3`;
  },

  finishOnboarding() {
    document.getElementById('onboarding-progress-fill').style.width = '100%';
    setTimeout(() => {
      this.showScreen('main-app');
      this.initDashboard();
      chat.startChat(this.userProfile);
      simulator.init(this.userProfile);
    }, 500);
  },

  initDashboard() {
    const p = this.userProfile;
    const riskKey = p.risk || 'moderate';
    const profile = portfolio.riskProfiles[riskKey];
    const sipAmount = portfolio.getSIPAmount(p.income || 30000);

    // SIP amount
    document.getElementById('sip-amount').textContent = portfolio.formatINRFull(sipAmount);

    const goalLabels = { emergency: 'Emergency Fund', wealth: 'Wealth Growth', house: 'Home Purchase', retirement: 'Retirement' };
    document.getElementById('sip-detail').textContent = `Goal: ${goalLabels[p.goal] || 'Wealth Growth'} • ${profile.label} risk`;
    document.getElementById('dashboard-greeting').textContent = `${profile.label} plan for your ${(goalLabels[p.goal] || 'wealth').toLowerCase()} goal`;

    // Projections
    const proj5 = portfolio.calcFutureValue(sipAmount, 5, profile.expectedReturn);
    const proj10 = portfolio.calcFutureValue(sipAmount, 10, profile.expectedReturn);
    const proj20 = portfolio.calcFutureValue(sipAmount, 20, profile.expectedReturn);
    document.getElementById('proj-5yr').textContent = portfolio.formatINR(proj5);
    document.getElementById('proj-10yr').textContent = portfolio.formatINR(proj10);
    document.getElementById('proj-20yr').textContent = portfolio.formatINR(proj20);

    // Charts
    setTimeout(() => {
      charts.renderAllocation(profile.allocation);
      const projData = portfolio.getProjectionData(sipAmount, 20, profile.expectedReturn);
      charts.renderProjection(projData, sipAmount);
    }, 300);

    // Fund list
    const fundListEl = document.getElementById('fund-list');
    fundListEl.innerHTML = profile.allocation.map(a => `
      <div class="fund-item">
        <div class="fund-icon" style="background:${a.color}22">${a.icon}</div>
        <div class="fund-info">
          <div class="fund-name">${a.fund}</div>
          <div class="fund-meta">${a.name} • ${a.pct}% allocation</div>
        </div>
        <div class="fund-return">${a.return3y}</div>
      </div>
    `).join('');
  },

  switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`nav-${tab}`).classList.add('active');

    if (tab === 'simulator') simulator.update();
  },

  toggleLang() {
    chat.lang = chat.lang === 'en' ? 'hi' : 'en';
    document.getElementById('lang-text').textContent = chat.lang === 'en' ? 'EN' : 'हिं';
    chat.flowIndex = 0;
    chat.startChat(this.userProfile);
  },

  showStartInvestModal() {
    document.getElementById('modal-overlay').classList.add('active');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  },

  confirmUPI() {
    const upi = document.getElementById('upi-input').value.trim();
    if (!upi) { document.getElementById('upi-input').style.borderColor = '#ff6b6b'; return; }
    this.closeModal();
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
};

// ===== SIMULATOR =====
const simulator = {
  risk: 'moderate',

  init(profile) {
    this.risk = profile.risk || 'moderate';
    const sipAmount = portfolio.getSIPAmount(profile.income || 30000);
    document.getElementById('sim-amount').value = sipAmount;
    document.querySelectorAll('.sim-risk-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.risk === this.risk);
    });
    this.update();
  },

  setRisk(risk, el) {
    this.risk = risk;
    document.querySelectorAll('.sim-risk-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this.update();
  },

  update() {
    const amount = parseInt(document.getElementById('sim-amount').value);
    const years = parseInt(document.getElementById('sim-years').value);
    const rate = portfolio.riskProfiles[this.risk].expectedReturn;
    const savingsRate = 0.035;

    document.getElementById('sim-amount-val').textContent = portfolio.formatINRFull(amount) + '/mo';
    document.getElementById('sim-years-val').textContent = years + ' years';

    const invested = amount * 12 * years;
    const totalValue = portfolio.calcFutureValue(amount, years, rate);
    const returns = totalValue - invested;
    const multiplier = (totalValue / invested).toFixed(1);
    const savingsValue = portfolio.calcFutureValue(amount, years, savingsRate);

    document.getElementById('sim-invested').textContent = portfolio.formatINRFull(invested);
    document.getElementById('sim-returns').textContent = portfolio.formatINRFull(returns);
    document.getElementById('sim-total').textContent = portfolio.formatINRFull(totalValue);
    document.getElementById('sim-multiplier-value').textContent = multiplier + 'x';

    // Comparison bars
    const maxVal = Math.max(totalValue, savingsValue);
    document.getElementById('comp-savings-fill').style.width = `${(savingsValue / maxVal) * 100}%`;
    document.getElementById('comp-invest-fill').style.width = `${(totalValue / maxVal) * 100}%`;
    document.getElementById('comp-savings-val').textContent = portfolio.formatINR(savingsValue);
    document.getElementById('comp-invest-val').textContent = portfolio.formatINR(totalValue);
    const diff = totalValue - savingsValue;
    document.getElementById('comp-extra').textContent = `You earn ${portfolio.formatINR(diff)} more with DhanSaathi! 🎉`;

    // Chart
    const data = portfolio.getProjectionData(amount, years, rate);
    charts.renderSimulator(data);
  }
};

// Enter key for chat input
document.getElementById('chat-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') chat.sendUserMessage();
});
