
const screens = [...document.querySelectorAll('.screen')];
const show = (id) => {
  screens.forEach(s => s.classList.remove('active'));
  const next = document.getElementById(id);
  next.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
};

const envelope = document.getElementById('envelope');
document.getElementById('openLetter').addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  if (navigator.vibrate) navigator.vibrate([25, 45, 25]);
  setTimeout(() => show('message'), 1150);
});

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => show(btn.dataset.next));
});

const track = document.getElementById('galleryTrack');
const dots = [...document.querySelectorAll('#dots i')];
if (track) {
  track.addEventListener('scroll', () => {
    const slides = [...track.querySelectorAll('.slide')];
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    slides.forEach((slide, i) => {
      const c = slide.offsetLeft + slide.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < dist) { dist = d; best = i; }
    });
    dots.forEach((d,i) => d.classList.toggle('active', i === best));
  }, {passive:true});
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
  if (!dateInput.value) {
    preview.textContent = 'Todavía no has elegido fecha.';
    confirm.disabled = true;
    return;
  }
  preview.textContent = 'Has elegido: ' + formatDate(dateInput.value) + ' ♡';
  confirm.disabled = false;
  if (navigator.vibrate) navigator.vibrate(20);
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
    ? `Faltan ${days} días para nuestra escapada ♡`
    : days === 1
    ? '¡Es mañana! ♡'
    : days === 0
    ? '¡Es hoy! ♡'
    : 'Ya hemos llegado a nuestro día ♡';

  const msg = `He elegido nuestra fecha para las Termas de Alange: ${human} ❤️ Feliz aniversario`;
  whatsapp.href = 'https://wa.me/?text=' + encodeURIComponent(msg);

  show('final');
  burstHearts();
});

function burstHearts(){
  const box = document.getElementById('confetti');
  const chars = ['♡','♥','♡','✦'];
  for(let i=0;i<28;i++){
    const s = document.createElement('span');
    s.textContent = chars[Math.floor(Math.random()*chars.length)];
    s.style.left = Math.random()*100 + 'vw';
    s.style.animationDelay = (Math.random()*.7) + 's';
    s.style.fontSize = (16 + Math.random()*18) + 'px';
    s.style.color = Math.random()>.45 ? '#e53349' : '#f0a2b5';
    box.appendChild(s);
    setTimeout(()=>s.remove(), 3800);
  }
}

document.getElementById('restart').addEventListener('click', () => {
  envelope.classList.remove('open');
  show('intro');
});

const saved = localStorage.getItem('fecha-alange-irenica');
if (saved) dateInput.value = saved;
