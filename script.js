// ── PARTICLES ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + .3;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.alpha = Math.random() * .6 + .1;
    this.color = Math.random() > .5 ? '#00AEEF' : '#7B2FBE';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color; ctx.globalAlpha = this.alpha; ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const n = Math.floor(W * H / 14000);
  for (let i = 0; i < n; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00AEEF';
        ctx.globalAlpha = (1 - d / 120) * .12;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animParticles);
}
animParticles();

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cursor');
const fol = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx - 9 + 'px'; cur.style.top = my - 9 + 'px';
});
(function moveFol() {
  fx += (mx - fx) * .12; fy += (my - fy) * .12;
  fol.style.left = fx - 20 + 'px'; fol.style.top = fy - 20 + 'px';
  requestAnimationFrame(moveFol);
})();
document.querySelectorAll('a,button,.card,.skill-card,.tags span').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.transform = 'scale(1.8)'; cur.style.background = 'rgba(0,174,239,.25)'; });
  el.addEventListener('mouseleave', () => { cur.style.transform = 'scale(1)'; cur.style.background = ''; });
});

// ── TYPEWRITER ──
const lines = [
  'Building immersive virtual worlds...',
  'Unreal Engine 5 · Physics · Blueprints',
  'Unity · C# · Mobile · XR',
  'Real-Time 3D · Virtual Sports · WebAR',
  '10+ Years · Shipped 15+ Games'
];
let li = 0, ci = 0, del = false;
const tw = document.getElementById('tw');
function typeAnim() {
  if (!del) {
    tw.textContent = lines[li].slice(0, ++ci);
    if (ci === lines[li].length) { del = true; setTimeout(typeAnim, 1800); return; }
    setTimeout(typeAnim, 60);
  } else {
    tw.textContent = lines[li].slice(0, --ci);
    if (ci === 0) { del = false; li = (li + 1) % lines.length; setTimeout(typeAnim, 400); return; }
    setTimeout(typeAnim, 28);
  }
}
typeAnim();

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: .12 });
reveals.forEach(el => io.observe(el));

// ── COUNTER ──
const counters = document.querySelectorAll('.stat-number');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target, target = +el.dataset.target;
      let v = 0; const step = Math.ceil(target / 50);
      const t = setInterval(() => {
        v += step; if (v >= target) { v = target; clearInterval(t); }
        el.textContent = v + '+';
      }, 35);
      cio.unobserve(el);
    }
  });
}, { threshold: .5 });
counters.forEach(el => cio.observe(el));

// ── PROGRESS BARS ──
const bars = document.querySelectorAll('.bar-fill');
const bio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      el.style.width = el.dataset.pct + '%';
      bio.unobserve(el);
    }
  });
}, { threshold: .3 });
bars.forEach(b => bio.observe(b));

// ── BACK TO TOP ──
const btn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btn.style.display = window.scrollY > 400 ? 'block' : 'none';
});
btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── NAV ACTIVE ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? '#00f5ff' : '';
  });
});

// ── FIXED: SMOOTH SCROLL FOR NAVIGATION LINKS ──
// This handles anchor scrolling manually, bypassing the <base> tag issue
document.querySelectorAll('nav ul a, .scroll-indicator, a.btn[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
