// ===== CHAT ENGINE =====
const chat = {
  lang: 'en',
  flowIndex: 0,
  userProfile: {},

  flows: {
    en: [
      {
        ai: "Hey! 👋 I'm DhanSaathi, your AI investment buddy. I've set up a personalized plan based on your profile. Want me to walk you through it?",
        replies: ["Yes, show me!", "How does this work?", "Is my money safe?"]
      },
      {
        ai: "Great! Based on your income and goals, I recommend a monthly SIP of **{sip}**. This amount is comfortable — you won't even miss it! 💡\n\nYour money will be split across different assets to balance risk and returns.",
        replies: ["What's a SIP?", "Show my allocation", "Can I change the amount?"]
      },
      {
        ai: "A SIP (Systematic Investment Plan) is like a recurring UPI payment — but instead of paying a bill, you're building wealth! Every month, ₹{sip_num} gets auto-invested.\n\n📊 The magic? **Compounding**. Your returns earn returns. Over 10 years, your {sip} monthly can grow to **{proj_10y}**!",
        replies: ["That's amazing! 🤩", "What if market crashes?", "Show me the chart"]
      },
      {
        ai: "Market dips are temporary — your plan is long-term! 📈\n\nHistorically, the Indian market has always recovered and grown. The Nifty 50 has delivered ~12% average annual returns over 20 years.\n\nThat's why we diversify — your portfolio has debt, gold, AND equity. If stocks dip, gold and debt cushion the fall. 🛡️",
        replies: ["Smart! What funds?", "Open my dashboard", "How to start investing?"]
      },
      {
        ai: "Here's what I've picked for you:\n\n{fund_list}\n\nEach fund is SEBI-regulated and has a strong track record. I've balanced safety with growth based on your risk profile. 💎",
        replies: ["Start investing now!", "Open dashboard", "Change my risk level"]
      },
      {
        ai: "To start, just:\n1️⃣ Link your UPI ID\n2️⃣ Choose SIP date (1st of every month)\n3️⃣ Auto-invest starts next month!\n\nIt takes 2 minutes. Your money stays in YOUR demat account — DhanSaathi just guides you. 🔒",
        replies: ["Link UPI & start!", "I have more questions", "Show simulator"]
      }
    ],
    hi: [
      {
        ai: "नमस्ते! 👋 मैं धनसाथी हूँ, आपका AI निवेश साथी। मैंने आपकी प्रोफ़ाइल के हिसाब से एक प्लान बनाया है। देखना चाहेंगे?",
        replies: ["हाँ, दिखाओ!", "ये कैसे काम करता है?", "क्या मेरा पैसा सुरक्षित है?"]
      },
      {
        ai: "बढ़िया! आपकी आय और लक्ष्य के अनुसार, मेरी सलाह है कि हर महीने **{sip}** का SIP करें। यह राशि आरामदायक है — आपको पता भी नहीं चलेगा! 💡",
        replies: ["SIP क्या है?", "मेरा allocation दिखाओ", "राशि बदल सकता हूँ?"]
      },
      {
        ai: "SIP एक recurring UPI payment जैसा है — बस बिल की जगह, आप wealth बना रहे हैं! हर महीने ₹{sip_num} auto-invest होता है।\n\n📊 जादू? **Compounding**। 10 साल में, आपके {sip} monthly **{proj_10y}** बन सकते हैं!",
        replies: ["ये तो कमाल है! 🤩", "Market गिरे तो?", "Chart दिखाओ"]
      },
      {
        ai: "Market की गिरावट temporary है — आपका plan long-term है! 📈\n\nNifty 50 ने 20 साल में ~12% avg annual return दिया है। इसलिए हम diversify करते हैं — debt, gold, और equity का मिश्रण। 🛡️",
        replies: ["Smart! कौन से funds?", "Dashboard खोलो", "Investing कैसे शुरू करें?"]
      },
      {
        ai: "आपके लिए मैंने ये चुने:\n\n{fund_list}\n\nहर fund SEBI-regulated है और strong track record वाला। आपके risk profile के हिसाब से balanced है। 💎",
        replies: ["अभी invest शुरू करो!", "Dashboard खोलो", "Risk level बदलो"]
      },
      {
        ai: "शुरू करने के लिए:\n1️⃣ UPI ID link करें\n2️⃣ SIP तारीख चुनें (हर महीने 1 तारीख)\n3️⃣ अगले महीने से auto-invest!\n\n2 मिनट लगेंगे। पैसा आपके demat account में रहता है। 🔒",
        replies: ["UPI link करो!", "और सवाल हैं", "Simulator दिखाओ"]
      }
    ]
  },

  getFlows() {
    return this.flows[this.lang] || this.flows.en;
  },

  processTemplate(text) {
    const p = this.userProfile;
    const riskKey = p.risk || 'moderate';
    const profile = portfolio.riskProfiles[riskKey];
    const sipNum = portfolio.getSIPAmount(p.income || 30000);
    const sipStr = portfolio.formatINRFull(sipNum);
    const proj10 = portfolio.formatINR(portfolio.calcFutureValue(sipNum, 10, profile.expectedReturn));
    const fundListStr = profile.allocation.slice(0, 3).map(a =>
      `${a.icon} **${a.fund}** — ${a.return3y} (3Y return)`
    ).join('\n');

    return text
      .replace(/{sip}/g, sipStr)
      .replace(/{sip_num}/g, sipNum.toLocaleString('en-IN'))
      .replace(/{proj_10y}/g, proj10)
      .replace(/{fund_list}/g, fundListStr);
  },

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  },

  addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `msg msg-${type}`;
    div.innerHTML = type === 'ai' ? this.formatMarkdown(text) : text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  showTyping() {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'msg msg-ai msg-typing';
    div.id = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  },

  showQuickReplies(replies) {
    const container = document.getElementById('quick-replies');
    container.innerHTML = '';
    replies.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = text;
      btn.onclick = () => this.handleQuickReply(text);
      container.appendChild(btn);
    });
  },

  handleQuickReply(text) {
    this.addMessage(text, 'user');
    document.getElementById('quick-replies').innerHTML = '';

    // Handle special actions
    if (text.includes('dashboard') || text.includes('Dashboard') || text.includes('allocation') || text.includes('chart') || text.includes('Chart')) {
      setTimeout(() => app.switchTab('dashboard'), 500);
    }
    if (text.includes('simulator') || text.includes('Simulator')) {
      setTimeout(() => app.switchTab('simulator'), 500);
    }
    if (text.includes('UPI') || text.includes('start') || text.includes('Start') || text.includes('शुरू') || text.includes('link')) {
      setTimeout(() => app.showStartInvestModal(), 800);
    }

    this.flowIndex++;
    const flows = this.getFlows();
    if (this.flowIndex < flows.length) {
      this.showTyping();
      setTimeout(() => {
        this.removeTyping();
        const flow = flows[this.flowIndex];
        const processed = this.processTemplate(flow.ai);
        this.addMessage(processed, 'ai');
        this.showQuickReplies(flow.replies);
      }, 1200);
    }
  },

  sendUserMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.handleQuickReply(text);
  },

  startChat(profile) {
    this.userProfile = profile;
    this.flowIndex = 0;
    const flows = this.getFlows();
    const flow = flows[0];
    const processed = this.processTemplate(flow.ai);

    document.getElementById('chat-messages').innerHTML = '';

    this.showTyping();
    setTimeout(() => {
      this.removeTyping();
      this.addMessage(processed, 'ai');
      this.showQuickReplies(flow.replies);
    }, 1000);
  }
};
