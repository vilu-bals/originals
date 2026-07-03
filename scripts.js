document.addEventListener('DOMContentLoaded', () => {
  // Navegación móvil: alterna clase is-open y aria-expanded
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('primary-navigation-menu');
  const navList = document.querySelector('.nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('is-open');
    });

    // Cerrar menú al clicar en un enlace (móvil)
    navList.addEventListener('click', (e) => {
      const target = e.target.closest && e.target.closest('a');
      if (target) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // Formularios de demostración / reservas: enviar mediante mailto fallback
  const demoForms = document.querySelectorAll('form[data-demo-form]');
  demoForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const fd = new FormData(form);
      const nombre = (fd.get('nombre') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      if (!nombre || !email) {
        if (status) status.textContent = 'Completa los campos obligatorios (nombre y correo).';
        return;
      }

      const telefono = (fd.get('telefono') || '').toString().trim();
      const servicio = (fd.get('servicio') || '').toString().trim();
      const mensaje = (fd.get('mensaje') || '').toString().trim();

      const subject = encodeURIComponent(`Reserva - ${servicio || 'Solicitud'} - ${nombre}`);
      const body = encodeURIComponent([
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Teléfono: ${telefono}`,
        `Servicio: ${servicio}`,
        '',
        `Mensaje:`,
        `${mensaje}`,
      ].join('\n'));

      if (status) status.textContent = 'Gracias — te redirigimos al sistema de reservas...';
      // Abrir widget de reservas en nueva pestaña como fallback al correo
      window.open('https://widget.treatwell.es/establecimiento/mes-original-s-sl/?utm_medium=partner-ecosystem&utm_campaign=partner-instagram&utm_content=book-now', '_blank', 'noopener');
      setTimeout(() => {
        if (status) status.textContent = 'Si necesitas ayuda, llama al +34 623 00 62 36.';
      }, 1500);
    });
  });

  // Botón flotante solo en index.html
  const isIndexPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
  
  if (isIndexPage) {
    const treatwellButton = document.createElement('a');
    treatwellButton.className = 'button float-cta';
    treatwellButton.href = 'https://widget.treatwell.es/establecimiento/mes-original-s-sl/?utm_medium=partner-ecosystem&utm_campaign=partner-instagram&utm_content=book-now';
    treatwellButton.target = '_blank';
    treatwellButton.rel = 'noopener noreferrer';
    treatwellButton.textContent = 'Reserva';
    treatwellButton.setAttribute('aria-label', 'Reservar en Treatwell');
    document.body.appendChild(treatwellButton);

    const floatButton = document.querySelector('.float-cta');
    const hero = document.querySelector('.hero');
    const footer = document.querySelector('footer');

    const toggleFloatVisibility = () => {
      if (!floatButton || !hero || !footer) return;

      const rectButton = floatButton.getBoundingClientRect();
      const rectHero = hero.getBoundingClientRect();
      const rectFooter = footer.getBoundingClientRect();

      const overlapsHero = rectButton.bottom > rectHero.top && rectButton.top < rectHero.bottom;
      const overlapsFooter = rectButton.top < rectFooter.bottom && rectButton.bottom > rectFooter.top;

      floatButton.classList.toggle('hidden', overlapsHero || overlapsFooter);
    };

    window.addEventListener('scroll', toggleFloatVisibility);
    window.addEventListener('resize', toggleFloatVisibility);
    toggleFloatVisibility();
  }

  const pricingTabs = document.querySelectorAll('[data-pricing-tab]');
  const pricingPanels = document.querySelectorAll('[data-pricing-panel]');

  if (pricingTabs.length && pricingPanels.length) {
    pricingTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('aria-controls');

        pricingTabs.forEach((item) => {
          const isActive = item === tab;
          item.setAttribute('aria-selected', String(isActive));
          item.classList.toggle('is-active', isActive);
        });

        pricingPanels.forEach((panel) => {
          panel.setAttribute('aria-hidden', panel.id !== targetId ? 'true' : 'false');
        });
      });
    });
  }

  // GIFT WIZARD
  const giftWizard = () => {
    const giftSteps = document.querySelectorAll('[data-gift-step]');
    const giftCategoryCards = document.querySelectorAll('.gift-category-card');
    const giftServicesList = document.getElementById('gift-services-list');
    const giftProgressText = document.getElementById('gift-progress');
    const giftWizardTitle = document.querySelector('.gift-wizard-title');
    const giftBackBtn = document.getElementById('gift-back-btn');
    const giftRestartBtn = document.getElementById('gift-restart-btn');
    const giftWhatsappBtn = document.getElementById('gift-whatsapp-btn');
    const giftSelectedService = document.getElementById('gift-selected-service');

    let currentStep = 1;
    let selectedCategory = null;
    let selectedService = null;

    const servicesByCategory = {
      hombre: [
        { name: 'Corte con degradado (Semanal)', desc: '12 €' },
        { name: 'Corte sin degradado (Quincenal)', desc: '12 €' },
        { name: 'Corte + Lavado', desc: '15 €' },
        { name: 'Arreglo de barba', desc: '10 €' },
        { name: 'Corte degradado + Barba (Semanal)', desc: '17 €' },
        { name: 'Pack Relax SPA', desc: 'Desde 27 €' }
      ],
      mujer: [
        { name: 'Corte pelo corto', desc: '37 €' },
        { name: 'Corte pelo largo', desc: '40 €' },
        { name: 'Lavado y secado', desc: 'Desde 15 €' },
        { name: 'Moldeado + secado', desc: 'Desde 50 €' },
        { name: 'Corte Curly en seco', desc: 'Especializado' },
        { name: 'Peinado de evento', desc: 'A medida' }
      ],
      color: [
        { name: 'Mechas y Balayage', desc: 'Efecto natural' },
        { name: 'Tinte en raíz', desc: 'Desde 10 €' },
        { name: 'Decoloración', desc: 'Consultar' },
        { name: 'Color completo', desc: 'Consultar' }
      ],
      spa: [
        { name: 'Corte + SPA', desc: 'Desde 27 €' },
        { name: 'Corte + Barba + SPA', desc: 'Desde 30 €' },
        { name: 'SPA Completo', desc: '35 €' }
      ],
      estetica: [
        { name: 'Maquillaje profesional', desc: '35 €' },
        { name: 'Micropigmentación', desc: '35 €' },
        { name: 'Depilación facial', desc: 'Desde 5 €' },
        { name: 'Depilación cejas', desc: 'Tarifa base' }
      ],
      tratamiento: [
        { name: 'Queratina', desc: 'Antifrizz' },
        { name: 'Alisado permanente', desc: 'Cambio durador' },
        { name: 'Extensiones', desc: 'Longitud y volumen' },
        { name: 'Ritual Kemon', desc: 'Desde 20 €' }
      ]
    };

    const goToStep = (step) => {
      giftSteps.forEach((s) => s.classList.remove('gift-step--active'));
      const targetStep = document.getElementById(`gift-step-${step}`);
      if (targetStep) targetStep.classList.add('gift-step--active');
      currentStep = step;
      giftProgressText.textContent = `PASO ${step} DE 3`;
    };

    const renderServices = (category) => {
      giftServicesList.innerHTML = '';
      const services = servicesByCategory[category] || [];
      services.forEach((service) => {
        const card = document.createElement('button');
        card.className = 'gift-service-card';
        card.innerHTML = `
          <div class="gift-service-name">${service.name}</div>
          <div class="gift-service-desc">${service.desc}</div>
        `;
        card.addEventListener('click', () => {
          selectedService = service.name;
          goToStep(3);
          showFinalCard();
        });
        giftServicesList.appendChild(card);
      });
    };

    const showFinalCard = () => {
      if (selectedService) {
        giftSelectedService.textContent = selectedService;
        const whatsappText = encodeURIComponent(`Hola! Quiero comprar un Bono Regalo para el servicio: ${selectedService}`);
        giftWhatsappBtn.href = `https://wa.me/34623006236?text=${whatsappText}`;
      }
    };

    giftCategoryCards.forEach((card) => {
      card.addEventListener('click', () => {
        selectedCategory = card.getAttribute('data-category');
        renderServices(selectedCategory);
        goToStep(2);
      });
    });

    giftBackBtn.addEventListener('click', () => {
      goToStep(1);
    });

    giftRestartBtn.addEventListener('click', () => {
      currentStep = 1;
      selectedCategory = null;
      selectedService = null;
      goToStep(1);
    });
  };

  if (document.querySelector('.gift-wizard-section')) {
    giftWizard();
  }

  const galleryButtons = document.querySelectorAll('.gallery-card');
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
  const galleryCloseButton = document.querySelector('.gallery-lightbox__close');
  const galleryPrevButton = document.querySelector('.gallery-lightbox__nav--prev');
  const galleryNextButton = document.querySelector('.gallery-lightbox__nav--next');

  if (galleryButtons.length && galleryLightbox && galleryLightboxImage) {
    const galleryImages = Array.from(galleryButtons).map((button) => ({
      src: button.getAttribute('data-gallery-image') || button.querySelector('img')?.getAttribute('src') || '',
      alt: button.getAttribute('data-gallery-alt') || button.querySelector('img')?.getAttribute('alt') || ''
    }));

    let currentGalleryIndex = 0;
    let lastFocusedGalleryButton = null;

    const openGalleryImage = (index, triggerButton) => {
      currentGalleryIndex = index;
      lastFocusedGalleryButton = triggerButton || lastFocusedGalleryButton;
      galleryLightboxImage.src = galleryImages[index].src;
      galleryLightboxImage.alt = galleryImages[index].alt;
      galleryLightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      galleryCloseButton?.focus();
    };

    const closeGalleryLightbox = () => {
      galleryLightbox.hidden = true;
      document.body.style.overflow = '';
      lastFocusedGalleryButton?.focus();
    };

    const showPrevGalleryImage = () => {
      const index = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      openGalleryImage(index);
    };

    const showNextGalleryImage = () => {
      const index = (currentGalleryIndex + 1) % galleryImages.length;
      openGalleryImage(index);
    };

    galleryButtons.forEach((button, index) => {
      button.addEventListener('click', () => openGalleryImage(index, button));
    });

    if (galleryCloseButton) galleryCloseButton.addEventListener('click', closeGalleryLightbox);
    if (galleryPrevButton) galleryPrevButton.addEventListener('click', showPrevGalleryImage);
    if (galleryNextButton) galleryNextButton.addEventListener('click', showNextGalleryImage);

    galleryLightbox.addEventListener('click', (event) => {
      if (event.target === galleryLightbox) closeGalleryLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (galleryLightbox.hidden) return;
      if (event.key === 'Escape') closeGalleryLightbox();
      if (event.key === 'ArrowLeft') showPrevGalleryImage();
      if (event.key === 'ArrowRight') showNextGalleryImage();
    });
  }

  const teamCarouselCards = document.querySelectorAll('[data-team-card]');
  const teamCarouselPrev = document.querySelector('[data-team-prev]');
  const teamCarouselNext = document.querySelector('[data-team-next]');
  const teamCarouselDots = document.querySelectorAll('[data-team-dot]');
  const teamCardCount = teamCarouselCards.length;
  let activeTeamIndex = 0;

  const updateTeamCarousel = (index) => {
    if (!teamCardCount) return;
    const safeIndex = ((index % teamCardCount) + teamCardCount) % teamCardCount;

    teamCarouselCards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === safeIndex);
    });

    teamCarouselDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === safeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });

    activeTeamIndex = safeIndex;
  };

  if (teamCarouselPrev) {
    teamCarouselPrev.addEventListener('click', () => {
      updateTeamCarousel(activeTeamIndex - 1);
    });
  }

  if (teamCarouselNext) {
    teamCarouselNext.addEventListener('click', () => {
      updateTeamCarousel(activeTeamIndex + 1);
    });
  }

  teamCarouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = Number(dot.dataset.teamDot);
      if (!Number.isNaN(targetIndex)) {
        updateTeamCarousel(targetIndex);
      }
    });
  });

  updateTeamCarousel(0);
});
