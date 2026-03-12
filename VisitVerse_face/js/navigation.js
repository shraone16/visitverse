/* ==============================
   STATE & NAVIGATION
   ============================== */
let currentPortal = null; // 'registrar' | 'authenticator'
let currentPage = 'landing';

const REG_PAGES = ['reg-home','register','safety','assessment'];
const AUTH_PAGES = ['auth-home','verify','gate','dashboard'];

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + id);
  if (el) { el.classList.add('active'); window.scrollTo(0,0); }
  currentPage = id;
}

function updateNav() {
  const navLinks = document.getElementById('navLinks');
  const navRight = document.getElementById('navRight');
  const glow = document.getElementById('glowEl');

  if (currentPortal === 'registrar') {
    glow.className = 'hero-glow';
    navLinks.innerHTML = `
      <span class="portal-badge-cyan">📋 Registrar</span>
      <button class="nav-btn ${currentPage==='reg-home'?'active':''}" onclick="navigate('home')">Overview</button>
      <button class="nav-btn ${currentPage==='register'?'active':''}" onclick="navigate('register')">Pre-Register</button>
      <button class="nav-btn ${currentPage==='safety'?'active':''}" onclick="navigate('safety')">Safety Rules</button>
      <button class="nav-btn ${currentPage==='assessment'?'active':''}" onclick="navigate('assessment')">Assessment</button>
    `;
    navRight.innerHTML = `
      <button class="portal-switch-btn to-auth" onclick="enterPortal('authenticator')">🔐 Authenticator ↗</button>
      <button class="nav-cta" onclick="navigate('register')">Register Visit →</button>
    `;
  } else if (currentPortal === 'authenticator') {
    glow.className = 'auth-glow';
    navLinks.innerHTML = `
      <span class="portal-badge-orange">🔐 Authenticator</span>
      <button class="nav-btn ${currentPage==='auth-home'?'active':''}" onclick="navigate('home')">Overview</button>
      <button class="nav-btn ${currentPage==='verify'?'active':''}" onclick="navigate('verify')">Verify ID</button>
      <button class="nav-btn ${currentPage==='gate'?'active':''}" onclick="navigate('gate')">Gate Entry</button>
      <button class="nav-btn ${currentPage==='dashboard'?'active':''}" onclick="navigate('dashboard')">Dashboard</button>
    `;
    navRight.innerHTML = `
      <button class="portal-switch-btn to-reg" onclick="enterPortal('registrar')">📋 Registrar ↗</button>
      <button class="nav-cta" style="background:var(--orange);" onclick="navigate('verify')">Verify Visitor →</button>
    `;
  } else {
    glow.className = 'hero-glow';
    navLinks.innerHTML = `<span style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;color:var(--text3);text-transform:uppercase;">Select Your Role</span>`;
    navRight.innerHTML = `
      <button class="portal-switch-btn to-reg" onclick="enterPortal('registrar')">📋 Registrar Portal</button>
      <button class="portal-switch-btn to-auth" onclick="enterPortal('authenticator')">🔐 Authenticator Portal</button>
    `;
  }
}

function enterPortal(portal) {
  currentPortal = portal;
  updateNav();
  if (portal === 'registrar') showPage('reg-home');
  else showPage('auth-home');
}

function showLanding() {
  currentPortal = null;
  updateNav();
  showPage('landing');
}

function navigate(page) {
  if (currentPortal === 'registrar') {
    const map = {home:'reg-home', register:'register', safety:'safety', assessment:'assessment',
                  verify:'verify', gate:'gate', dashboard:'dashboard'};
    if (map[page]) { showPage(map[page]); updateNav(); }
  } else if (currentPortal === 'authenticator') {
    const map = {home:'auth-home', verify:'verify', gate:'gate', dashboard:'dashboard',
                  register:'register', safety:'safety', assessment:'assessment'};
    if (map[page]) { showPage(map[page]); updateNav(); }
  }
  if (page === 'dashboard') setTimeout(initCharts, 100);
  if (page === 'gate') setTimeout(initEntryLog, 100);
  if (page === 'safety') setTimeout(() => loadSafety('production', document.querySelector('.dept-list-item')), 100);
}
