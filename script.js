
const screens = [...document.querySelectorAll('.screen')];
const order = ['intro','message','reveal','gallery','date','final'];
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const buzz = (p) => { if (navigator.vibrate) navigator.vibrate(p); };

const show = (id) => {
  screens.forEach(s => s.classList.remove('active'));
  const next = document.getElementById(id);
  next.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});

  const i = order.indexOf(id);
  progress.classList.toggle('on', i > 0);
  progressBar.style.width = ((i + 1) / order.length * 100) + '%';
  if (id === 'gallery') requestAnimationFrame(markCenterSlide);
};

/* onda al tocar cualquier boton */
document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('.btn, .envelope-wrap');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.width = dot.style.height = size + 'px';
  dot.style.left = (e.clientX - r.left - size / 2) + 'px';
  dot.style.top = (e.clientY - r.top - size / 2) + 'px';
  btn.appendChild(dot);
  setTimeout(() => dot.remove(), 650);
}, {passive:true});

const envelope = document.getElementById('envelope');
document.getElementById('openLetter').addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  buzz([25, 45, 25]);
  burstHearts(12, 1400);
  setTimeout(() => show('message'), 1150);
});

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => { buzz(18); show(btn.dataset.next); });
});

const track = document.getElementById('galleryTrack');
const dots = [...document.querySelectorAll('#dots i')];

function markCenterSlide(){
  if (!track) return;
  const slides = [...track.querySelectorAll('.slide')];
  const center = track.scrollLeft + track.clientWidth / 2;
  let best = 0, dist = Infinity;
  slides.forEach((slide, i) => {
    const c = slide.offsetLeft + slide.offsetWidth / 2;
    const d = Math.abs(c - center);
    if (d < dist) { dist = d; best = i; }
  });
  slides.forEach((s,i) => s.classList.toggle('is-center', i === best));
  dots.forEach((d,i) => d.classList.toggle('active', i === best));
}

if (track) {
  let last = -1;
  track.addEventListener('scroll', () => {
    markCenterSlide();
    const now = [...track.querySelectorAll('.slide')].findIndex(s => s.classList.contains('is-center'));
    if (now !== last) { last = now; buzz(8); }
  }, {passive:true});
  markCenterSlide();
}

const dateInput = document.getElementById('chosenDate');
const preview = document.getElementById('datePreview');
const confirm = document.getElementById('confirmDate');
const chosenText = document.getElementById('chosenText');
const countdown = document.getElementById('countdown');
const whatsapp = document.getElementById('whatsappShare');

const today = new Date();
today.setHours(0,0,0,0);
dateInput.min = today.toISOString().split('T')[0];

const formatDate = (value) => {
  const d = new Date(value + 'T12:00:00');
  return new Intl.DateTimeFormat('es-ES', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  }).format(d);
};

dateInput.addEventListener('change', () => {
  preview.classList.remove('pop');
  void preview.offsetWidth;
  preview.classList.add('pop');
  if (!dateInput.value) {
    preview.textContent = 'Todavía no has elegido fecha.';
    confirm.disabled = true;
    return;
  }
  preview.textContent = 'Has elegido: ' + formatDate(dateInput.value) + ' \u2661';
  confirm.disabled = false;
  buzz(20);
});

confirm.addEventListener('click', () => {
  const value = dateInput.value;
  if (!value) return;
  localStorage.setItem('fecha-alange-irenica', value);
  const human = formatDate(value);
  chosenText.textContent = human.charAt(0).toUpperCase() + human.slice(1);

  const chosen = new Date(value + 'T12:00:00');
  const now = new Date();
  now.setHours(12,0,0,0);
  const days = Math.ceil((chosen - now) / 86400000);
  countdown.textContent = days > 1
    ? `Faltan ${days} d\u00edas para nuestra escapada \u2661`
    : days === 1
    ? '\u00a1Es ma\u00f1ana! \u2661'
    : days === 0
    ? '\u00a1Es hoy! \u2661'
    : 'Ya hemos llegado a nuestro d\u00eda \u2661';

  const msg = `He elegido nuestra fecha para las Termas de Alange: ${human} \u2764\ufe0f Feliz aniversario`;
  whatsapp.href = 'https://wa.me/?text=' + encodeURIComponent(msg);

  buzz([30, 60, 30, 60, 80]);
  show('final');
  burstHearts();
});

function burstHearts(count = 34, life = 3900){
  const box = document.getElementById('confetti');
  const chars = ['\u2661','\u2665','\u2661','\u2726','\u2764\ufe0f'];
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.textContent = chars[Math.floor(Math.random()*chars.length)];
    s.style.left = Math.random()*100 + 'vw';
    s.style.animationDelay = (Math.random()*.8) + 's';
    s.style.animationDuration = (2.6 + Math.random()*1.4) + 's';
    s.style.fontSize = (14 + Math.random()*22) + 'px';
    s.style.color = Math.random()>.45 ? '#e53349' : '#f0a2b5';
    box.appendChild(s);
    setTimeout(()=>s.remove(), life);
  }
}

document.getElementById('restart').addEventListener('click', () => {
  envelope.classList.remove('open');
  buzz(18);
  show('intro');
});

const saved = localStorage.getItem('fecha-alange-irenica');
if (saved) {
  dateInput.value = saved;
  confirm.disabled = false;
}
