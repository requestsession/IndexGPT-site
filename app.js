const siteData = window.showcaseSite;

if (!siteData) {
  throw new Error('showcaseSite data is missing. Make sure content.js is loaded before app.js.');
}

const langButtons = document.querySelectorAll('[data-lang]');
const navMarkEl = document.getElementById('nav-mark');
const badgeEl = document.getElementById('badge');
const heroKickerEl = document.getElementById('hero-kicker');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('description');
const githubBtnEl = document.getElementById('github-btn');
const demoBtnEl = document.getElementById('demo-btn');
const tagListEl = document.getElementById('tag-list');
const metricListEl = document.getElementById('metric-list');
const sectionTitleEl = document.getElementById('section-title');
const highlightListEl = document.getElementById('highlight-list');
const screenTitleEl = document.getElementById('screen-title');
const screenListEl = document.getElementById('screen-list');
const bilingualTitleEl = document.getElementById('bilingual-title');
const zhLabelEl = document.getElementById('zh-label');
const enLabelEl = document.getElementById('en-label');
const zhCopyEl = document.getElementById('zh-copy');
const enCopyEl = document.getElementById('en-copy');
const currentYearEl = document.getElementById('year');

function render(lang) {
  const text = siteData[lang];
  const metrics = siteData.metrics[lang];
  const features = siteData.features[lang];
  const screenshots = siteData.screenshots[lang];

  navMarkEl.textContent = text.navMark;
  badgeEl.textContent = text.badge;
  heroKickerEl.textContent = text.kicker;
  titleEl.textContent = text.title;
  descEl.textContent = text.description;

  githubBtnEl.textContent = siteData.githubText[lang];
  githubBtnEl.href = siteData.githubUrl;

  demoBtnEl.textContent = siteData.demoText[lang];
  demoBtnEl.href = siteData.demoUrl;
  if (siteData.demoUrl.startsWith('#')) {
    demoBtnEl.removeAttribute('target');
    demoBtnEl.removeAttribute('rel');
  } else {
    demoBtnEl.target = '_blank';
    demoBtnEl.rel = 'noreferrer';
  }

  tagListEl.innerHTML = '';
  for (const tag of text.tags) {
    const li = document.createElement('li');
    li.textContent = tag;
    tagListEl.appendChild(li);
  }

  metricListEl.innerHTML = '';
  for (const item of metrics) {
    const li = document.createElement('li');
    li.innerHTML = `<div class="metric-value">${item.value}</div><div class="metric-label">${item.label}</div>`;
    metricListEl.appendChild(li);
  }

  sectionTitleEl.textContent = text.sectionTitle;
  highlightListEl.innerHTML = '';
  for (const feature of features) {
    const li = document.createElement('li');
    li.textContent = feature;
    highlightListEl.appendChild(li);
  }

  screenTitleEl.textContent = text.screenTitle;
  screenListEl.innerHTML = '';
  for (const shot of screenshots) {
    const li = document.createElement('li');
    li.className = 'screen-card';
    li.innerHTML = `
      <figure class="screen-frame">
        <img src="${shot.image}" alt="${shot.title}" loading="lazy" decoding="async" />
      </figure>
      <div class="screen-copy">
        <h3>${shot.title}</h3>
        <p>${shot.description}</p>
      </div>
    `;
    screenListEl.appendChild(li);
  }

  bilingualTitleEl.textContent = text.bilingualTitle;
  zhLabelEl.textContent = text.zhLabel;
  enLabelEl.textContent = text.enLabel;
  zhCopyEl.textContent = siteData.projectIntro?.zh || siteData.zh.description;
  enCopyEl.textContent = siteData.projectIntro?.en || siteData.en.description;

  for (const btn of langButtons) {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

for (const btn of langButtons) {
  btn.addEventListener('click', () => render(btn.dataset.lang));
}

currentYearEl.textContent = String(new Date().getFullYear());
render('zh');

function initFestivalEffects() {
  const canvas = document.getElementById('festival-fireworks');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles = [];
  const palette = ['#ffef8a', '#ffd166', '#ff8c5a', '#ff5757', '#ffdfe0'];
  const maxParticles = 240;
  const isMobile = window.matchMedia('(max-width: 920px)').matches;

  let width = 0;
  let height = 0;
  let rafId = null;
  let burstTimer = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnBurst(x, y) {
    const count = isMobile ? 20 : 32;
    for (let i = 0; i < count; i += 1) {
      if (particles.length >= maxParticles) particles.shift();
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 0.9 + Math.random() * 1.9;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.011 + Math.random() * 0.014,
        size: 1.6 + Math.random() * 2.8,
        color: palette[(Math.random() * palette.length) | 0]
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.011;
      p.vx *= 0.992;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(tick);
  }

  function randomBurst() {
    const x = width * (0.15 + Math.random() * 0.7);
    const y = height * (0.08 + Math.random() * 0.26);
    spawnBurst(x, y);
  }

  resize();
  randomBurst();
  burstTimer = window.setInterval(randomBurst, isMobile ? 1900 : 1450);
  rafId = requestAnimationFrame(tick);

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('beforeunload', () => {
    if (burstTimer) window.clearInterval(burstTimer);
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}

initFestivalEffects();
