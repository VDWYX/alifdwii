/* ====== script.js (mobile + desktop, smooth) ====== */
const yearEl = document.getElementById('y');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const debounce = (fn, wait = 150) => { 
  let t; 
  return (...args) => { 
    clearTimeout(t); 
    t = setTimeout(() => fn(...args), wait); 
  }; 
};

const navWrap = document.querySelector('.nav .wrap');
const nav = document.querySelector('.pill');
let toggleBtn = document.querySelector('.nav-toggle');

function ensureToggle() {
  if (!navWrap || !nav) return;
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.style.display = 'none';
    toggleBtn.setAttribute('aria-label', 'Buka menu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
    navWrap.appendChild(toggleBtn);
  }
}
ensureToggle();

const BP = 860;

function applyLayout() {
  if (!nav || !toggleBtn) return;
  const isMobile = window.innerWidth < BP;
  
  if (isMobile) {
    toggleBtn.style.display = 'inline-flex';
    nav.hidden = toggleBtn.getAttribute('aria-expanded') !== 'true';
  } else {
    toggleBtn.style.display = 'none';
    nav.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
}

applyLayout();
window.addEventListener('resize', debounce(applyLayout, 100));

function closeMenu() { 
  if (!nav || !toggleBtn) return; 
  nav.hidden = true; 
  toggleBtn.setAttribute('aria-expanded', 'false'); 
}

function openMenu() { 
  if (!nav || !toggleBtn) return; 
  nav.hidden = false; 
  toggleBtn.setAttribute('aria-expanded', 'true'); 
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => { 
    (toggleBtn.getAttribute('aria-expanded') === 'true') ? closeMenu() : openMenu(); 
  });
}

if (nav) {
  nav.addEventListener('click', (e) => { 
    if (e.target.closest('a') && window.innerWidth < BP) closeMenu(); 
  });
}

document.addEventListener('click', (e) => { 
  if (window.innerWidth >= BP) return; 
  const inside = e.target.closest('.pill') || e.target.closest('.nav-toggle'); 
  if (!inside) closeMenu(); 
});

document.addEventListener('keydown', (e) => { 
  if (e.key === 'Escape') closeMenu(); 
});

// Smooth scroll
document.querySelectorAll('.pill a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    
    const id = href.slice(1);
    const target = document.getElementById(id);
    
    if (target) { 
      e.preventDefault(); 
      target.scrollIntoView({
        behavior: 'smooth', 
        block: 'start'
      }); 
      history.replaceState(null, '', `#${id}`);
    }
  });
});

// Scroll spy
const links = document.querySelectorAll('.pill a[href^="#"]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    if (!id) return;
    
    const link = document.querySelector(`.pill a[href="#${id}"]`);
    if (entry.isIntersecting) { 
      links.forEach(l => l.classList.remove('active')); 
      link?.classList.add('active'); 
    }
  });
}, { 
  rootMargin: '-55% 0px -40% 0px', 
  threshold: 0 
});

document.querySelectorAll('main[id], section[id]').forEach(s => {
  if (s.id) spy.observe(s);
});

/* ===== Circular Progress logic ===== */
(function(){
  const cp = document.getElementById('cp');
  const label = document.getElementById('cp-label');
  const range = document.getElementById('cp-range');
  const btnAnim = document.getElementById('cp-animate');
  const btnReset = document.getElementById('cp-reset');

  if (!cp || !label || !range) return;

  const setVal = (v) => {
    const val = Math.max(0, Math.min(100, Number(v) || 0));
    cp.style.setProperty('--val', val);
    label.textContent = `${val}%`;
    cp.setAttribute('aria-label', `Kemajuan ${val} persen`);
  };

  range.addEventListener('input', e => setVal(e.target.value));

  let animId = null;
  
  if (btnAnim) {
    btnAnim.addEventListener('click', () => {
      cancelAnimationFrame(animId);
      let start = null;
      const dur = 1500;
      
      const step = (t) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(eased * 100);
        setVal(val);
        range.value = val;
        if (p < 1) animId = requestAnimationFrame(step);
      };
      
      setVal(0); 
      range.value = 0;
      animId = requestAnimationFrame(step);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => { 
      setVal(70); 
      range.value = 70; 
    });
  }
  
  setVal(range.value);
})();

// Additional improvements for better user experience
document.addEventListener('DOMContentLoaded', function() {
  // Add loading state management
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }, 500);
    });
  }

  // Add smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add intersection observer for fade-in animations
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Observe elements with fade-in class
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
  });
});
