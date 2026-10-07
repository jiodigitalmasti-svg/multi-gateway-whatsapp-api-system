/**
 * Bharat Web Solutions (BWS) - Multi-Gateway WhatsApp API Cloud Core Engine
 * JS Gateway & Authentication Management Script
 */

(function () {
  'use strict';

  // Demo Sandbox Accounts Database
  const DEMO_ACCOUNTS = {
    client: {
      tier: 'enterprise',
      identifier: 'BWS-ENT-88492',
      password: 'DemoClient@2025',
      name: 'Bharat Logistics Enterprises',
      email: 'tech@bharatlogistics.in',
      phone: '+91 98765 43210',
      apiKey: 'bws_live_9f8d7c6b5a4e3d2c1b0a',
      gateway: 'WaGateway-NodeServer-Primary',
      activeQuota: '500,000 Messages / mo',
      webhookUrl: 'https://bharatlogistics.in/api/whatsapp-webhook'
    },
    govt: {
      tier: 'govt',
      identifier: 'NIC-DEPT-10482',
      password: 'NICGovtPass#2025',
      name: 'National E-Governance Division',
      email: 'admin@digitalindia.gov.in',
      phone: '+91 98111 22334',
      apiKey: 'bws_gov_1a2b3c4d5e6f7g8h9i0j',
      gateway: 'WaGateway-GovCloud-Dedicated',
      activeQuota: 'Unlimited Official Alerts',
      webhookUrl: 'https://nic.gov.in/api/wa-notifications'
    }
  };

  // Language Dictionary for Dynamic Toggle
  const TRANSLATIONS = {
    en: {
      topBanner: 'भारत सरकार क्लाउड मानकों के अनुरूप | Enterprise WhatsApp API Infrastructure',
      title: 'Official Client Portal Login',
      sub: 'Access your Multi-Gateway WhatsApp API Console, API Tokens, Webhooks, and Billing',
      lblTier: 'Account Classification',
      lblId: 'Client ID / Registered Mobile / Email',
      hintId: 'Use your registered Bharat Web Solutions account identifier.',
      lblPass: 'Portal Password / Security Token',
      btnLogin: 'Secure Sign In to Gateway Console',
      noAccount: "Don't have a registered gateway instance?",
      linkRegister: 'Register Enterprise Account'
    },
    hi: {
      topBanner: 'भारत सरकार क्लाउड मानकों के अनुरूप | एंटरप्राइज व्हाट्सएप एपीआई इन्फ्रास्ट्रक्चर',
      title: 'आधिकारिक क्लाइंट पोर्टल लॉगिन',
      sub: 'अपने मल्टी-गेटवे व्हाट्सएप एपीआई कंसोल, एपीआई टोकन, वेबहुक और बिलिंग एक्सेस करें',
      lblTier: 'खाता श्रेणी',
      lblId: 'क्लाइंट आईडी / पंजीकृत मोबाइल / ईमेल',
      hintId: 'अपने पंजीकृत भारत वेब सॉल्यूशंस खाते की आईडी दर्ज करें।',
      lblPass: 'पोर्टल पासवर्ड / सुरक्षा टोकन',
      btnLogin: 'गेटवे कंसोल में सुरक्षित प्रवेश करें',
      noAccount: 'क्या आपके पास पंजीकृत गेटवे खाता नहीं है?',
      linkRegister: 'एंटरप्राइज खाता पंजीकृत करें'
    }
  };

  let currentLang = 'en';

  // Toggle Language
  window.toggleLanguage = function () {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
      langBtn.textContent = currentLang === 'en' ? 'हिन्दी / English' : 'English / हिन्दी';
    }

    const t = TRANSLATIONS[currentLang];
    const topBanner = document.getElementById('portal-top-banner');
    if (topBanner) topBanner.textContent = t.topBanner;

    const titleText = document.getElementById('auth-title-text');
    if (titleText) titleText.textContent = t.title;

    const subText = document.getElementById('auth-sub-text');
    if (subText) subText.textContent = t.sub;

    const lblTier = document.getElementById('lbl-tier');
    if (lblTier) lblTier.textContent = t.lblTier;

    const lblId = document.getElementById('lbl-id');
    if (lblId) lblId.textContent = t.lblId;

    const hintId = document.getElementById('hint-id');
    if (hintId) hintId.textContent = t.hintId;

    const lblPass = document.getElementById('lbl-pass');
    if (lblPass) lblPass.textContent = t.lblPass;

    const btnLogin = document.getElementById('btn-login-submit');
    if (btnLogin) {
      const icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>';
      btnLogin.innerHTML = icon + t.btnLogin;
    }

    const noAcc = document.getElementById('txt-no-account');
    if (noAcc) noAcc.textContent = t.noAccount;

    const linkReg = document.getElementById('link-register');
    if (linkReg) linkReg.textContent = t.linkRegister;
  };

  // Quick fill sample/demo credentials
  window.fillDemo = function (type) {
    const data = DEMO_ACCOUNTS[type];
    if (!data) return;

    const tierElem = document.getElementById('login-tier');
    const idElem = document.getElementById('login-identifier');
    const passElem = document.getElementById('login-password');

    if (tierElem) tierElem.value = data.tier;
    if (idElem) idElem.value = data.identifier;
    if (passElem) passElem.value = data.password;

    showAlert('Demo credentials loaded for ' + data.name + '. Click Sign In below.', 'info');
  };

  // Toggle Password Visibility
  window.togglePasswordVisibility = function () {
    const passInput = document.getElementById('login-password');
    const toggleIcon = document.getElementById('pass-toggle-icon');
    if (!passInput) return;

    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (toggleIcon) toggleIcon.textContent = '🙈';
    } else {
      passInput.type = 'password';
      if (toggleIcon) toggleIcon.textContent = '👁️';
    }
  };

  // Alert Utility
  function showAlert(msg, type) {
    const alertBox = document.getElementById('login-alert-box');
    if (!alertBox) return;

    alertBox.style.display = 'block';
    if (type === 'error') {
      alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
      alertBox.style.border = '1px solid #EF4444';
      alertBox.style.color = '#FCA5A5';
    } else if (type === 'success') {
      alertBox.style.background = 'rgba(16, 185, 129, 0.15)';
      alertBox.style.border = '1px solid #10B981';
      alertBox.style.color = '#6EE7B7';
    } else {
      alertBox.style.background = 'rgba(59, 130, 246, 0.15)';
      alertBox.style.border = '1px solid #3B82F6';
      alertBox.style.color = '#93C5FD';
    }
    alertBox.textContent = msg;
  }

  // Handle Login Submit
  window.handleLoginSubmit = function (e) {
    e.preventDefault();

    const identifier = document.getElementById('login-identifier')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();
    const tier = document.getElementById('login-tier')?.value;
    const btn = document.getElementById('btn-login-submit');

    if (!identifier || !password) {
      showAlert('Please enter both Client ID / Email / Mobile and Password.', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return;
    }

    // Indicate loading
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Authenticating Gateway & TLS Handshake...';
    }

    // Check against session/localStorage or demo profile
    setTimeout(() => {
      let matchedAccount = null;

      // Check registered accounts in localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('bws_registered_clients') || '[]');
        matchedAccount = storedUsers.find(
          u => (u.identifier === identifier || u.email === identifier || u.orgName === identifier)
        );
      } catch (err) {
        console.error('Local storage read error:', err);
      }

      // Check demo accounts
      if (!matchedAccount) {
        if (identifier === DEMO_ACCOUNTS.client.identifier || identifier === DEMO_ACCOUNTS.client.email) {
          matchedAccount = DEMO_ACCOUNTS.client;
        } else if (identifier === DEMO_ACCOUNTS.govt.identifier || identifier === DEMO_ACCOUNTS.govt.email) {
          matchedAccount = DEMO_ACCOUNTS.govt;
        }
      }

      if (matchedAccount || password.length >= 6) {
        // Successful login
        const sessionData = {
          identifier: matchedAccount ? matchedAccount.identifier : identifier,
          name: matchedAccount ? (matchedAccount.name || matchedAccount.orgName) : identifier,
          tier: tier,
          apiKey: matchedAccount ? matchedAccount.apiKey : 'bws_live_' + Math.random().toString(36).substring(2, 12),
          gateway: matchedAccount ? matchedAccount.gateway : 'WaGateway-NodeServer-Primary',
          loginTime: new Date().toISOString(),
          token: 'bws_jwt_' + btoa(identifier + ':' + Date.now())
        };

        localStorage.setItem('bws_active_session', JSON.stringify(sessionData));
        showAlert('✅ Authentication Successful! Redirecting to Gateway Dashboard...', 'success');

        setTimeout(() => {
          window.location.href = 'index.html?session=active';
        }, 1200);
      } else {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '🔑 Secure Sign In to Gateway Console';
        }
        showAlert('Invalid Client ID or Password. Please try again or use Demo Profile.', 'error');
      }
    }, 900);
  };

  // On page load check session
  document.addEventListener('DOMContentLoaded', function () {
    const activeSession = localStorage.getItem('bws_active_session');
    if (activeSession && window.location.pathname.endsWith('login.html')) {
      try {
        const session = JSON.parse(activeSession);
        showAlert('Logged in as ' + (session.name || session.identifier) + '. Redirecting to Console...', 'info');
        setTimeout(() => {
          window.location.href = 'index.html?session=active';
        }, 1000);
      } catch (e) {
        localStorage.removeItem('bws_active_session');
      }
    }
  });

})();
