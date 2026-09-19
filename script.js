const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const progressBar = document.querySelector('.scroll-progress span');

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.classList.toggle('active', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

const roles = [
  'Senior Software QA Engineer',
  'Fintech Quality Specialist',
  'Arabic & RTL Testing Expert'
];
const roleElement = document.getElementById('typed-role');
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = true;

const typeRole = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = roles[roleIndex];
  charIndex += deleting ? -1 : 1;
  roleElement.textContent = target.slice(0, charIndex);
  if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  } else if (!deleting && charIndex === roles[roleIndex].length) {
    deleting = true;
    window.setTimeout(typeRole, 1600);
    return;
  }
  window.setTimeout(typeRole, deleting ? 35 : 65);
};
window.setTimeout(typeRole, 1400);

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const started = performance.now();
    const duration = 900;
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      element.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(element);
  });
}, { threshold: .7 });
document.querySelectorAll('[data-count]').forEach((element) => countObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-42% 0px -52%', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

if (window.matchMedia('(pointer: fine)').matches) {
  const dot = document.querySelector('.cursor-dot');
  const halo = document.querySelector('.cursor-halo');
  let mouseX = 0, mouseY = 0, haloX = 0, haloY = 0;
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
    dot.style.opacity = '1'; halo.style.opacity = '1';
  });
  const animateCursor = () => {
    haloX += (mouseX - haloX) * .16; haloY += (mouseY - haloY) * .16;
    halo.style.left = `${haloX}px`; halo.style.top = `${haloY}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
  document.querySelectorAll('a, button, [data-tilt]').forEach((element) => {
    element.addEventListener('mouseenter', () => halo.classList.add('active'));
    element.addEventListener('mouseleave', () => halo.classList.remove('active'));
  });

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const box = card.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const rotateX = ((y / box.height) - .5) * -5;
      const rotateY = ((x / box.width) - .5) * 5;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
