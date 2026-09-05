/* ==========================================================================
   LIBRERÍA — LÓGICA DE INTERACCIÓN Y ANIMACIONES (JAVASCRIPT VANILLA)
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

  // 3. DESPLAZAMIENTO SUAVE PARA EL BOTÓN PRINCIPAL Y ENLACES
  const discoverBtn = document.getElementById('btn-discover');
  if (discoverBtn) {
    discoverBtn.addEventListener('click', (e) => {
      const targetId = discoverBtn.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  // 4. ANIMACIONES PROGRESIVAS AL DESPLAZARSE (INTERSECTION OBSERVER)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Desobservar una vez animado para mejor rendimiento
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Se activa cuando el 12% del elemento es visible
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Si el usuario prefiere movimiento reducido o el navegador es antiguo, mostrar todo directamente
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  }

  // 5. MANEJO INTELIGENTE DE LA IMAGEN PRINCIPAL (COMPROBACIÓN DE ASSET)
  const heroImg = document.getElementById('hero-image');
  if (heroImg) {
    // Intentar cargar imagen alternativa en formato JPG o PNG si el usuario la coloca en la carpeta assets
    const customPhoto = new Image();
    customPhoto.src = 'assets/imagen-principal.jpg';
    
    customPhoto.onload = () => {
      heroImg.src = 'assets/imagen-principal.jpg';
    };

    // Si no existe 'imagen-principal.jpg', también probar con 'hero.jpg'
    customPhoto.onerror = () => {
      const customPhoto2 = new Image();
      customPhoto2.src = 'assets/hero.jpg';
      customPhoto2.onload = () => {
        heroImg.src = 'assets/hero.jpg';
      };
    };
  }
});
