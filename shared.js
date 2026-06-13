/* ============================================
   CROWNLEDGER BANK — SHARED JAVASCRIPT
   ============================================ */

// ===== AUTH STATE =====
const AUTH_KEY = 'crownledger_auth';
const STATE_KEY = 'crownledger_state';
const TX_KEY = 'crownledger_transactions';
const LAST_TX_KEY = 'crownledger_last_tx';

const DEFAULT_STATE = {
  checking: 11700.00,
  savings: 2520.00,
  user: {
    firstName: 'Kimberly',
    lastName: 'Westbrook',
    email: 'kimberly.westbrook@email.com',
    phone: '(555) 123-4567',
    username: 'Kimberlywestbrooklmi',
    memberSince: 'March 2019'
  },
  activated: false
};

const DEFAULT_TRANSACTIONS = [
  {
    id: 'TXN-20260608-001',
    name: 'Liberty Mutual Insurance',
    desc: 'Direct Deposit',
    amount: 10402.00,
    type: 'deposit',
    date: '2026-06-08',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260610-002',
    name: 'Liberty Mutual Insurance',
    desc: 'Bonus Payment',
    amount: 318.00,
    type: 'deposit',
    date: '2026-06-10',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260611-003',
    name: 'Liberty Mutual Insurance',
    desc: 'Performance Bonus',
    amount: 208.00,
    type: 'deposit',
    date: '2026-06-11',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260605-004',
    name: 'Whole Foods Market',
    desc: 'Grocery Purchase',
    amount: -127.43,
    type: 'payment',
    date: '2026-06-05',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260604-005',
    name: 'Shell Oil',
    desc: 'Gas Station',
    amount: -45.00,
    type: 'payment',
    date: '2026-06-04',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260603-006',
    name: 'Netflix',
    desc: 'Monthly Subscription',
    amount: -15.99,
    type: 'payment',
    date: '2026-06-03',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260601-007',
    name: 'Transfer to Savings',
    desc: 'Automatic Transfer',
    amount: -500.00,
    type: 'transfer',
    date: '2026-06-01',
    status: 'completed',
    account: 'checking'
  },
  {
    id: 'TXN-20260601-008',
    name: 'Transfer from Checking',
    desc: 'Automatic Transfer',
    amount: 500.00,
    type: 'transfer',
    date: '2026-06-01',
    status: 'completed',
    account: 'savings'
  }
];

// ===== STORAGE HELPERS =====
function getState() {
  try {
    var stored = localStorage.getItem(STATE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function getTransactions() {
  try {
    var stored = localStorage.getItem(TX_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
}

function saveTransactions(txs) {
  try {
    localStorage.setItem(TX_KEY, JSON.stringify(txs));
  } catch (e) {}
}

function isLoggedIn() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function login() {
  try {
    localStorage.setItem(AUTH_KEY, 'true');
  } catch (e) {}
}

function logout() {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(TX_KEY);
    localStorage.removeItem(LAST_TX_KEY);
  } catch (e) {}
}

function getLastTx() {
  try {
    var stored = localStorage.getItem(LAST_TX_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return null;
}

function saveLastTx(tx) {
  try {
    localStorage.setItem(LAST_TX_KEY, JSON.stringify(tx));
  } catch (e) {}
}

// ===== FORMATTERS =====
function formatCurrency(amount) {
  return '$' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateTxId() {
  var date = new Date();
  var dateStr = date.getFullYear() + 
    String(date.getMonth() + 1).padStart(2, '0') + 
    String(date.getDate()).padStart(2, '0');
  var random = Math.floor(Math.random() * 9000) + 1000;
  return 'TXN-' + dateStr + '-' + random;
}

// ===== TOAST =====
function showToast(message, type) {
  type = type || 'success';
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  
  var icon = type === 'success' ? 'check-circle' : 
             type === 'error' ? 'exclamation-circle' : 'info-circle';
  
  toast.innerHTML = '<i class="fas fa-' + icon + '"></i><span>' + message + '</span>';
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() {
      toast.remove();
    }, 400);
  }, 3000);
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text, btn) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard!', 'success');
    if (btn) {
      var original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied';
      setTimeout(function() {
        btn.innerHTML = original;
      }, 2000);
    }
  } catch (e) {
    showToast('Failed to copy', 'error');
  }
  
  document.body.removeChild(textarea);
}

// ===== LOGOUT HANDLER =====
function handleLogout() {
  logout();
  window.location.href = 'index.html';
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  var nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.toggle('open');
  }
}

function closeMobileMenu() {
  var nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.remove('open');
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  // Add logout listeners
  var logoutBtns = document.querySelectorAll('[data-logout]');
  for (var i = 0; i < logoutBtns.length; i++) {
    logoutBtns[i].addEventListener('click', handleLogout);
  }
  
  // Add mobile menu listeners
  var menuBtn = document.getElementById('mobileMenuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  var closeBtn = document.getElementById('mobileNavClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }
  
  var mobileOverlay = document.getElementById('mobileNav');
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function(e) {
      if (e.target === mobileOverlay) closeMobileMenu();
    });
  }
});
