/* ==========================================================================
   PUNTO Y SEGUIDO, LIBRERÍA — LÓGICA DE INTERACCIÓN Y ANIMACIONES (JAVASCRIPT VANILLA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GESTIÓN DEL ENCABEZADO AL HACER SCROLL
  const header = document.getElementById('site-header');
  const scrollThreshold = 40;

  const handleHeaderScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Ejecutar al cargar por si la página inicia con scroll

  // 2. NAVEGACIÓN MÓVIL ACCESIBLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
    });

    // Cerrar menú móvil al hacer clic en un enlace de navegación
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 3. DESPLAZAMIENTO SUAVE PARA ENLACES INTERNOS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 4. CARRUSEL DEL CATÁLOGO CURADO (LIBROS ESPECIALES)
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const track = document.getElementById('curated-track');
  const dots = document.querySelectorAll('.dot-indicator');

  if (prevBtn && nextBtn && track) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.curated-card');
    const totalCards = cards.length;

    const updateCarousel = (index) => {
      currentIndex = index;
      if (window.innerWidth <= 992) {
        cards.forEach((card, i) => {
          card.style.display = i === currentIndex ? 'flex' : 'none';
        });
      } else {
        cards.forEach(card => card.style.display = 'flex');
      }

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel(currentIndex);
    });

    window.addEventListener('resize', () => {
      updateCarousel(currentIndex);
    });

    updateCarousel(0);
  }

  // 5. ANIMACIONES PROGRESIVAS AL DESPLAZARSE (INTERSECTION OBSERVER)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  }

  // 6. MANEJO Y ROBUSTEZ DE LA IMAGEN PRINCIPAL
  const heroImg = document.getElementById('hero-image');
  if (heroImg) {
    heroImg.onerror = () => {
      heroImg.src = 'assets/hero-libreria.svg';
    };
  }
});
