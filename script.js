(function () {
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro overlay animation
  const introEl = document.getElementById('intro');
  if (introEl) {
    const finishIntro = () => {
      if (!introEl.classList.contains('done')) {
        introEl.classList.add('done');
        // Remove from DOM after transition
        setTimeout(() => {
          if (introEl && introEl.parentNode) {
            introEl.parentNode.removeChild(introEl);
          }
        }, 800);
      }
    };
    if (prefersReduced) {
      finishIntro();
    } else {
      // Let the logo animate in, then fade out the overlay
      setTimeout(finishIntro, 1400);
      // Safety: ensure overlay never lingers beyond 4s
      setTimeout(finishIntro, 4000);
    }
  }

  // Dynamic year
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scrolled state
  const header = qs('.site-header');
  const toTop = qs('#to-top');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = qs('.nav-toggle');
  const siteNav = qs('#site-nav');
  const closeNav = () => {
    if (!siteNav) return;
    siteNav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  };
  const openNav = () => {
    if (!siteNav) return;
    siteNav.classList.add('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  };
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.contains('open');
      isOpen ? closeNav() : openNav();
    });
    // Close on link click
    siteNav.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'A') closeNav();
    });
    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) closeNav();
    });
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  // Smooth anchor scrolling
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = qs(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      // Update hash without jumping
      history.pushState(null, '', id);
    });
  });

  // IntersectionObserver reveal
  const reveals = qsa('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback
    reveals.forEach(el => el.classList.add('in-view'));
  }

  // Hero carousel (fades between images from window.HERO_IMAGES)
  (function initHeroCarousel() {
    const container = qs('.hero-carousel');
    const list = Array.isArray(window.HERO_IMAGES) ? window.HERO_IMAGES.filter(Boolean) : [];
    if (!container || !list.length) return;

    const slides = [];
    let idx = 0;
    let timer;

    const setActive = (i) => {
      slides.forEach((img, n) => img.classList.toggle('active', n === i));
    };

    const start = () => {
      if (prefersReduced || slides.length <= 1) { setActive(0); return; }
      clearInterval(timer);
      timer = setInterval(() => {
        idx = (idx + 1) % slides.length;
        setActive(idx);
      }, 4000);
    };

    // Preload and append images
    let pending = list.length;
    list.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.className = 'slide';
      img.alt = 'Project photo ' + (i + 1);
      img.onload = () => {
        container.appendChild(img);
        slides.push(img);
        pending -= 1;
        if (pending === 0 && slides.length) { setActive(0); start(); }
      };
      img.onerror = () => {
        pending -= 1;
        if (pending === 0 && slides.length) { setActive(0); start(); }
      };
      img.src = src;
    });

    // Pause on hover (desktop)
    container.addEventListener('mouseenter', () => { if (!prefersReduced) clearInterval(timer); });
    container.addEventListener('mouseleave', () => { if (!prefersReduced) start(); });

    // Stop animation when user prefers reduced motion (already handled by start())
  })();

  // Gallery carousel (manual with arrows + touch, images from window.GALLERY_IMAGES or HERO_IMAGES)
  (function initGallery() {
    const viewport = qs('.gallery-viewport');
    const track = qs('.gallery-track');
    const prevBtn = qs('.gallery-arrow.prev');
    const nextBtn = qs('.gallery-arrow.next');
    const list = Array.isArray(window.GALLERY_IMAGES) && window.GALLERY_IMAGES.length
      ? window.GALLERY_IMAGES
      : (Array.isArray(window.HERO_IMAGES) ? window.HERO_IMAGES : []);
    if (!viewport || !track || !list.length) return;

    viewport.setAttribute('tabindex', '0');

    const slides = [];
    let idx = 0;

    const setActive = (i) => {
      slides.forEach((img, n) => img.classList.toggle('active', n === i));
    };

    // Build slides
    list.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'lazy';
      img.className = 'slide';
      img.alt = 'Gallery image ' + (i + 1);
      img.src = src;
      track.appendChild(img);
      slides.push(img);
    });
    if (slides.length) setActive(0);

    const go = (dir) => {
      if (!slides.length) return;
      idx = (idx + dir + slides.length) % slides.length;
      setActive(idx);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));

    // Keyboard navigation
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    // Touch swipe
    let startX = 0, startY = 0, swiping = false;
    const threshold = 40; // px
    viewport.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; swiping = true;
    }, { passive: true });
    viewport.addEventListener('touchmove', (e) => {
      if (!swiping || !e.touches || !e.touches.length) return;
      // allow natural scrolling, only act on mostly-horizontal gesture
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        swiping = false;
        if (dx > 0) go(-1); else go(1);
      }
    }, { passive: true });
    viewport.addEventListener('touchend', () => { swiping = false; }, { passive: true });

    // Reduced motion: still use instant change but keep fade if allowed
    if (prefersReduced) {
      slides.forEach(img => img.style.transition = 'none');
    }
  })();

  // Back to top
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  // WhatsApp builder based on form inputs
  const form = qs('#quote-form');
  const waBtn = qs('#wa-cta');
  const waPhone = '17047076205'; // WhatsApp number for ESG Land Services
  const buildWAMessage = () => {
    const name = qs('#name')?.value?.trim();
    const email = qs('#email')?.value?.trim();
    const phone = qs('#phone')?.value?.trim();
    const service = qs('#service')?.value;
    const message = qs('#message')?.value?.trim();

    const lines = [
      'Hello ESG Land Services, I\'d like a quote.',
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      phone ? `Phone: ${phone}` : null,
      service ? `Service: ${service}` : null,
      message ? `Details: ${message}` : null,
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  };
  const updateWAHref = () => {
    if (!waBtn) return;
    const text = buildWAMessage();
    waBtn.setAttribute('href', `https://wa.me/${waPhone}?text=${text}`);
  };

  if (form && waBtn) {
    form.addEventListener('input', updateWAHref);
    updateWAHref();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Build message and open WhatsApp with the current form content
      const text = buildWAMessage();
      const url = `https://wa.me/${waPhone}?text=${text}`;
      // Open in a new tab/window to mirror the WhatsApp CTA behavior
      const win = window.open(url, '_blank', 'noopener');
      // If popup was blocked, fall back to setting location
      if (!win) {
        window.location.href = url;
      }
    });
  }

  // Service card -> prefill service + jump to contact
  qsa('.card[data-service]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const val = card.getAttribute('data-service');
      const map = {
        drainage: 'Storm water drainage',
        grading: 'Fine grading',
        clearing: 'Land clearing',
        trees: 'Tree removal',
        concrete: 'Concrete'
      };
      const nice = map[val] || val;
      const select = qs('#service');
      if (select) {
        select.value = nice;
        updateWAHref();
      }
      const contact = qs('#contact');
      if (contact) contact.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      // small highlight animation
      const formEl = qs('#quote-form');
      if (formEl) {
        formEl.style.boxShadow = '0 0 0 3px rgba(255,122,26,.45)';
        setTimeout(() => (formEl.style.boxShadow = ''), 700);
      }
    });
  });

  // Tiny toast
  let toastTm;
  function showToast(msg) {
    clearTimeout(toastTm);
    let t = qs('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.style.position = 'fixed';
      t.style.left = '50%';
      t.style.bottom = '16px';
      t.style.transform = 'translateX(-50%) translateY(8px)';
      t.style.padding = '10px 14px';
      t.style.borderRadius = '12px';
      t.style.background = 'rgba(2,6,23,.9)';
      t.style.border = '1px solid rgba(255,255,255,.14)';
      t.style.color = '#fff';
      t.style.boxShadow = '0 4px 14px rgba(0,0,0,.35)';
      t.style.opacity = '0';
      t.style.transition = 'opacity .25s ease, transform .25s ease';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    toastTm = setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2200);
  }
})();
