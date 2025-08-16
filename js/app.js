// Student Portfolio App - ES6 Module IIFE
(function() {
  'use strict';

  // App State
  const state = {
    isTyping: false,
    currentTheme: 'dark',
    mousePosition: { x: 0, y: 0 },
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    animationId: null
  };

  // DOM Elements
  const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    navLinks: document.querySelectorAll('.navbar__link'),
    typewriterText: document.getElementById('typewriter-text'),
    contactForm: document.getElementById('contact-form'),
    canvas: document.getElementById('bg-canvas'),
    lazyImages: document.querySelectorAll('img[loading="lazy"]')
  };

  // Constants
  const TYPEWRITER_TEXT = "Hi, I'm Begari Sairam";
  const TYPEWRITER_SPEED = 70;

  // Initialize App
  function init() {
    setupTheme();
    setupNavigation();
    setupTypewriter();
    setupFormValidation();
    setupLazyLoading();
    setupScrollSpy();
    setupThreeJsBackground();
    setupEventListeners();
  }

  // Theme Management
  function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    state.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    updateTheme();
    
    elements.themeToggle?.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    updateTheme();
    localStorage.setItem('theme', state.currentTheme);
  }

  function updateTheme() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    
    if (elements.themeToggle) {
      const icon = elements.themeToggle.querySelector('.theme-toggle__icon');
      icon.textContent = state.currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Navigation
  function setupNavigation() {
    elements.navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
  }

  function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Close mobile menu
    const toggle = document.getElementById('navbar__toggle');
    if (toggle) {
      toggle.checked = false;
    }
  }

  // Typewriter Effect
  function setupTypewriter() {
    if (!elements.typewriterText) return;
    
    elements.typewriterText.textContent = '';
    state.isTyping = true;
    
    let currentIndex = 0;
    
    function typeNextCharacter() {
      if (currentIndex < TYPEWRITER_TEXT.length && state.isTyping) {
        elements.typewriterText.textContent += TYPEWRITER_TEXT[currentIndex];
        currentIndex++;
        setTimeout(typeNextCharacter, TYPEWRITER_SPEED);
      } else {
        state.isTyping = false;
      }
    }
    
    // Start typing after a short delay
    setTimeout(typeNextCharacter, 500);
  }

  // Form Validation
  function setupFormValidation() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData);
    
    let isValid = true;
    
    // Validate all fields
    Object.keys(data).forEach(key => {
      const field = elements.contactForm.querySelector(`[name="${key}"]`);
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      showSuccessMessage();
      elements.contactForm.reset();
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error state
    field.classList.remove('error');
    
    switch (fieldName) {
      case 'name':
        if (!value) {
          errorMessage = 'Name is required';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;
        
      case 'message':
        if (!value) {
          errorMessage = 'Message is required';
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = 'Message must be at least 10 characters';
          isValid = false;
        }
        break;
    }
    
    showFieldError(field, errorMessage, !isValid);
    return isValid;
  }

  function showFieldError(field, message, hasError) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (hasError) {
      field.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
      }
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
      }
    }
  }

  function clearError(field) {
    showFieldError(field, '', false);
  }

  function showSuccessMessage() {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.textContent = 'Message sent successfully!';
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--clr-primary);
      color: var(--clr-bg);
      padding: 1rem 2rem;
      border-radius: var(--radius-base);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  // Lazy Loading with Intersection Observer
  function setupLazyLoading() {
    if (!elements.lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('fade-in');
          
          img.addEventListener('load', () => {
            img.classList.add('visible');
          });
          
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    elements.lazyImages.forEach(img => {
      img.classList.add('fade-in');
      imageObserver.observe(img);
    });
  }

  // Scroll Spy
  function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`.navbar__link[href="#${id}"]`);
        
        if (entry.isIntersecting) {
          // Remove active class from all links
          elements.navLinks.forEach(link => link.classList.remove('active'));
          // Add active class to current link
          if (navLink) {
            navLink.classList.add('active');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Three.js Background
  function setupThreeJsBackground() {
    if (!window.THREE || !elements.canvas) return;
    
    initThreeScene();
    createParticles();
    startAnimation();
    handleResize();
  }

  function initThreeScene() {
    // Scene
    state.scene = new THREE.Scene();
    
    // Camera
    state.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    state.camera.position.z = 5;
    
    // Renderer
    state.renderer = new THREE.WebGLRenderer({
      canvas: elements.canvas,
      alpha: true,
      antialias: true
    });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function createParticles() {
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions across larger area
      positions[i3] = (Math.random() - 0.5) * 40;     // x
      positions[i3 + 1] = Math.random() * 30 - 15;    // y
      positions[i3 + 2] = (Math.random() - 0.5) * 20; // z
      
      // Varied velocities for organic movement
      velocities[i3] = (Math.random() - 0.5) * 0.02;        // x drift
      velocities[i3 + 1] = Math.random() * 0.03 + 0.01;     // y upward
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;   // z drift
      
      // Varied particle sizes
      sizes[i] = Math.random() * 3 + 1;
      
      // Color variation with theme colors
      const colorType = Math.random();
      if (colorType < 0.33) {
        // Pink
        colors[i3] = 1.0;     // r
        colors[i3 + 1] = 0.49; // g
        colors[i3 + 2] = 0.86; // b
      } else if (colorType < 0.66) {
        // Cyan
        colors[i3] = 0.49;    // r
        colors[i3 + 1] = 0.91; // g
        colors[i3 + 2] = 1.0;  // b
      } else {
        // Orange
        colors[i3] = 1.0;     // r
        colors[i3 + 1] = 0.72; // g
        colors[i3 + 2] = 0.42; // b
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        
        void main() {
          vColor = color;
          vSize = size;
          
          vec3 pos = position;
          pos.x += sin(time + position.y * 0.01) * 2.0;
          pos.z += cos(time + position.x * 0.01) * 1.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        uniform float opacity;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * opacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    state.particles = new THREE.Points(geometry, material);
    state.particles.userData = { velocities };
    state.scene.add(state.particles);
  }

  function animateParticles() {
    if (!state.particles) return;
    
    const positions = state.particles.geometry.attributes.position.array;
    const velocities = state.particles.userData.velocities;
    const time = Date.now() * 0.001;
    
    // Update time uniform for shader animation
    if (state.particles.material.uniforms) {
      state.particles.material.uniforms.time.value = time;
    }
    
    for (let i = 0; i < positions.length; i += 3) {
      // Update positions with velocities
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      // Add floating motion
      positions[i] += Math.sin(time + i * 0.01) * 0.01;
      positions[i + 2] += Math.cos(time + i * 0.015) * 0.008;
      
      // Mouse parallax effect (more noticeable)
      const mouseInfluence = 0.0003;
      positions[i] += (state.mousePosition.x - window.innerWidth / 2) * mouseInfluence;
      positions[i + 1] -= (state.mousePosition.y - window.innerHeight / 2) * mouseInfluence;
      
      // Wrap particles that go out of bounds
      if (positions[i + 1] > 15) {
        positions[i + 1] = -15;
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 20;
      }
      
      if (positions[i] > 20) positions[i] = -20;
      if (positions[i] < -20) positions[i] = 20;
      if (positions[i + 2] > 10) positions[i + 2] = -10;
      if (positions[i + 2] < -10) positions[i + 2] = 10;
    }
    
    state.particles.geometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    if (document.hidden) {
      // Pause animation when tab is hidden
      return;
    }
    
    state.animationId = requestAnimationFrame(animate);
    
    animateParticles();
    
    if (state.renderer && state.scene && state.camera) {
      state.renderer.render(state.scene, state.camera);
    }
  }

  function startAnimation() {
    animate();
  }

  function handleResize() {
    window.addEventListener('resize', () => {
      if (!state.camera || !state.renderer) return;
      
      state.camera.aspect = window.innerWidth / window.innerHeight;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Event Listeners
  function setupEventListeners() {
    // Mouse movement for parallax
    document.addEventListener('mousemove', (e) => {
      state.mousePosition.x = e.clientX;
      state.mousePosition.y = e.clientY;
    });
    
    // Visibility change for animation optimization
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !state.animationId) {
        startAnimation();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const toggle = document.getElementById('navbar__toggle');
        if (toggle && toggle.checked) {
          toggle.checked = false;
        }
      }
    });
    
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


// Carousel and Lightbox functionality

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.carousel-track');
  if (!carousel || !track) return;

  // Prevent any CSS keyframe animation interfering
  track.style.animation = 'none';
  track.style.webkitAnimation = 'none';

  // Make sure images are visible if some CSS set them hidden
  const imgs = Array.from(track.querySelectorAll('img'));
  imgs.forEach(img => {
    img.style.opacity = '1';
    img.style.visibility = 'visible';
    img.style.display = 'block';
  });

  // Wait for images to finish loading (or error)
  const waitForImages = Promise.all(imgs.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(res => {
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true }); // continue even if one fails
    });
  }));

  waitForImages.then(() => {
    // Duplicate children for seamless loop
    const originalItems = Array.from(track.children);
    originalItems.forEach(node => track.appendChild(node.cloneNode(true)));

    // ensure flex layout
    track.style.display = 'flex';
    track.style.gap = getComputedStyle(track).gap || '0px';

    // Compute width of original set (including gaps)
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    let originalTotalWidth = 0;
    originalItems.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      originalTotalWidth += rect.width;
      if (i < originalItems.length - 1) originalTotalWidth += gap;
    });

    // defensive fallback
    if (!originalTotalWidth || !isFinite(originalTotalWidth)) {
      console.warn('Could not compute originalTotalWidth, setting fallback.');
      originalTotalWidth = 1000;
    }

    // set track width to hold both sets
    track.style.width = (originalTotalWidth * 2) + 'px';
    track.style.boxSizing = 'content-box';

    console.log('carousel widths:', { originalTotalWidth, itemCount: originalItems.length });

    // RAF pixel-based loop
    let px = 0;
    const pxPerSecond = Math.max(30, Math.round(originalTotalWidth / 6)); // tune speed
    let last = performance.now();
    let running = true;

    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (running) {
        px += pxPerSecond * dt;
        if (px >= originalTotalWidth) px -= originalTotalWidth;
        track.style.transform = `translate3d(${-px}px, 0, 0)`;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // Pause on hover or focus
    const pause = () => running = false;
    const resume = () => running = true;
    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    carousel.addEventListener('focusin', pause);
    carousel.addEventListener('focusout', resume);

    // Lightbox handlers (keeps existing behavior)
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('cert-modal-img');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalDownload = document.getElementById('cert-modal-download');
    const modalClose = document.getElementById('cert-modal-close');

    function openModal(imgSrc, altText, title) {
      modalImg.src = imgSrc;
      modalImg.alt = altText || title || 'Certificate';
      modalTitle.textContent = title || '';
      modalDownload.href = imgSrc;
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modalClose.focus();
    }
    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    track.addEventListener('click', (e) => {
      const item = e.target.closest('.carousel-item');
      if (!item) return;
      const img = item.querySelector('img');
      const title = item.dataset.title || item.querySelector('figcaption')?.textContent || '';
      openModal(img.src, img.alt, title);
    });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // On resize: recompute (simple approach - reload to re-measure reliably)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => location.reload(), 250);
    });

  }).catch(err => {
    console.error('Error waiting for certificate images:', err);
  });
});

