(function () {
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      updateWAHref();
      // Simple non-intrusive feedback
      showToast('Demo: form is front-end only. WhatsApp link updated.');
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
