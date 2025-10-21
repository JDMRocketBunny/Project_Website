// Cafe Aroma - Main JavaScript

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initParallaxEffect();
  initSmoothScrolling();
  updateActiveNavLink();
});

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  // Observe all elements with 'reveal' class
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// Parallax effect for hero background
function initParallaxEffect() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    heroBg.style.transform = `translate3d(0, ${rate}px, 0) scale(1.1)`;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Only apply parallax on non-mobile devices
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', requestTick);
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Update active navigation link based on current page
function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'index.html' && linkHref === 'index.html')) {
      link.style.color = 'var(--coffee-orange)';
      link.style.borderBottom = '2px solid var(--coffee-orange)';
    }
  });
}

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    header.style.background = 'rgba(111, 78, 55, 0.98)';
    header.style.boxShadow = '0 2px 10px rgba(111, 78, 55, 0.3)';
  } else {
    header.style.background = 'rgba(111, 78, 55, 0.95)';
    header.style.boxShadow = 'none';
  }
}, { passive: true });

// Menu item hover effects (for menu page)
function initMenuItemEffects() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Coffee bean animation (decorative)
function createCoffeeBeans() {
  const beansContainer = document.createElement('div');
  beansContainer.className = 'coffee-beans-bg';
  beansContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  `;
  
  // Create floating coffee beans
  for (let i = 0; i < 5; i++) {
    const bean = document.createElement('div');
    bean.style.cssText = `
      position: absolute;
      width: 8px;
      height: 12px;
      background: #8B4513;
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      opacity: 0.1;
      animation: float ${8 + Math.random() * 4}s ease-in-out infinite;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 5}s;
    `;
    
    beansContainer.appendChild(bean);
  }
  
  document.body.appendChild(beansContainer);
}

// Add floating animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
`;
document.head.appendChild(style);

// Initialize coffee beans on all pages
createCoffeeBeans();

// Page-specific initializations
if (document.body.classList.contains('page--menu')) {
  initMenuItemEffects();
}

// Loading animation
window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
const handleResize = debounce(function() {
  // Reinitialize parallax if needed
  if (window.innerWidth <= 768) {
    window.removeEventListener('scroll', requestTick);
  } else {
    initParallaxEffect();
  }
}, 250);

window.addEventListener('resize', handleResize);
