/* global window, document */

(function () {
  function initHideHeader() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastScroll = window.scrollY || 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY || 0;
      if (currentScroll > lastScroll && currentScroll > 100) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      lastScroll = currentScroll;
    });
  }

  function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!burgerBtn || !mobileMenu) return;

    const spans = burgerBtn.querySelectorAll('span');

    function setIcon(isOpen) {
      if (!spans || spans.length < 3) return;
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    }

    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
      setIcon(mobileMenu.classList.contains('active'));
    });

    document.addEventListener('click', () => {
      if (!mobileMenu.classList.contains('active')) return;
      mobileMenu.classList.remove('active');
      setIcon(false);
    });
  }

  function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    if (!carousels || carousels.length === 0) return;

    carousels.forEach((carousel) => {
      const slides = carousel.querySelectorAll('.slide');
      if (!slides || slides.length <= 1) return;

      let current = 0;
      slides.forEach((s, i) => {
        if (s.classList.contains('active')) current = i;
      });

      function showSlide(index) {
        const next = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('active', i === next));
        current = next;
      }

      function nextSlide() { showSlide(current + 1); }
      function prevSlide() { showSlide(current - 1); }

      // Some pages may have multiple "active" slides; normalize to one.
      showSlide(current);

      let auto = window.setInterval(nextSlide, 5000);
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        window.clearInterval(auto);
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        if (swipeDistance > 50) nextSlide();
        else if (swipeDistance < -50) prevSlide();
        auto = window.setInterval(nextSlide, 5000);
      }, { passive: true });
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lbImg = lightbox.querySelector('img');
    if (!lbImg) return;

    document.querySelectorAll('img').forEach((img) => {
      if (img.closest('#lightbox')) return;
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  function normalizeUrl(url) {
    if (!url) return '';
    return url.startsWith('/') ? url.substring(1) : url;
  }

  function initRandom(options) {
    const opts = options || {};
    const randomLink = document.getElementById('randomLink');
    if (!randomLink) return;

    const objectsUrl = opts.objectsUrl;
    const basePrefix = opts.basePrefix || '';
    const type = opts.type || null; // 'signboard' | 'mosaic' | null
    if (!objectsUrl) return;

    fetch(objectsUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки objects.json');
        return res.json();
      })
      .then((objects) => {
        const all = Array.isArray(objects) ? objects : [];
        let filtered = all.filter((o) => o && o.url);
        if (type) filtered = filtered.filter((o) => o.type === type);
        if (filtered.length === 0 && all.length > 0) filtered = all.filter((o) => o && o.url);

        const urls = filtered
          .map((o) => normalizeUrl(o.url))
          .filter(Boolean)
          .map((u) => basePrefix + u);

        function getRandomUrl() {
          const randomIndex = Math.floor(Math.random() * urls.length);
          return urls[randomIndex];
        }

        function updateHref() {
          const url = getRandomUrl();
          if (url) randomLink.href = url;
        }

        if (urls.length > 0) {
          updateHref();
          randomLink.addEventListener('pointerdown', updateHref);
          randomLink.addEventListener('mousedown', updateHref);
          randomLink.addEventListener('touchstart', updateHref, { passive: true });
        }
      })
      .catch((err) => console.error('Ошибка:', err));
  }

  function init(options) {
    const opts = options || {};
    initHideHeader();
    initBurgerMenu();
    initCarousels();
    initLightbox();
    initRandom(opts.random);
  }

  window.SiteCore = { init: init };
})();

