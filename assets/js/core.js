/**
 * ========================================
 * CORE JAVASCRIPT
 * ========================================
 * Salomao Santos - Professional Blog
 * Version: 1.0.0
 * Date: 2025-11-27
 * 
 * Core functionality for the website
 * - Navigation
 * - Smooth scrolling
 * - Mobile menu
 * - Theme toggle
 * - Language switcher integration
 * - Scroll animations
 * - Performance optimizations
 */

(function() {
  'use strict';

  // ========================================
  // 1. NAVIGATION & MOBILE MENU
  // ========================================

  class Navigation {
    constructor() {
      this.header = document.querySelector('.header');
      this.menuToggle = document.querySelector('.menu-toggle');
      this.navLinks = document.querySelector('.nav-links');
      this.navItems = document.querySelectorAll('.nav-link');
      this.lastScrollTop = 0;
      
      this.init();
    }

    init() {
      if (this.menuToggle && this.navLinks) {
        this.setupMobileMenu();
      }
      
      this.setupScrollBehavior();
      this.setupActiveLinks();
    }

    setupMobileMenu() {
      // Toggle mobile menu
      this.menuToggle.addEventListener('click', () => {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.menuToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
      });

      // Close menu when clicking on a link
      this.navItems.forEach(link => {
        link.addEventListener('click', () => {
          this.menuToggle.classList.remove('active');
          this.navLinks.classList.remove('active');
          this.menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.header.contains(e.target) && this.navLinks.classList.contains('active')) {
          this.menuToggle.classList.remove('active');
          this.navLinks.classList.remove('active');
          this.menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
          this.menuToggle.classList.remove('active');
          this.navLinks.classList.remove('active');
          this.menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    setupScrollBehavior() {
      if (!this.header) return;

      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add shadow when scrolled
      if (scrollTop > 10) {
        this.header.classList.add('header-scrolled');
      } else {
        this.header.classList.remove('header-scrolled');
      }

      this.lastScrollTop = scrollTop;
    }

    setupActiveLinks() {
      // Highlight active section in navigation
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.setActiveLink(id);
          }
        });
      }, observerOptions);

      // Observe all sections
      document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
      });
    }

    setActiveLink(sectionId) {
      this.navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // ========================================
  // 2. SMOOTH SCROLLING
  // ========================================

  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just '#' or the skip link
        if (href === '#' || this.classList.contains('skip-link')) {
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without triggering scroll
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ========================================
  // 3. LANGUAGE SWITCHER UI
  // ========================================

  function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (!langButtons.length) return;

    // Set initial active state
    function updateActiveButton(lang) {
      langButtons.forEach(btn => {
        const btnLang = btn.dataset.lang;
        if (btnLang === lang) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    }

    // Listen for language change events
    document.addEventListener('i18n:languageChanged', (e) => {
      updateActiveButton(e.detail.language);
    });

    document.addEventListener('i18n:ready', (e) => {
      updateActiveButton(e.detail.language);
    });

    // Add click handlers
    langButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        
        // Wait for i18n to be ready if not available yet
        if (!window.i18n) {
          console.warn('i18n not ready yet, waiting...');
          
          // Wait for i18n:ready event
          return new Promise((resolve) => {
            document.addEventListener('i18n:ready', async () => {
              if (window.i18n) {
                await window.i18n.setLanguage(lang);
                resolve();
              }
            }, { once: true });
          });
        }
        
        // i18n is available, change language directly
        await window.i18n.setLanguage(lang);
      });
    });
  }

  // ========================================
  // 4. TABS FUNCTIONALITY
  // ========================================

  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        
        tabContents.forEach(content => {
          content.classList.remove('active');
        });

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add('active');
          
          // Smooth scroll to content
          targetContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Update URL hash
        history.pushState(null, null, `#${targetTab}`);
      });
    });

    // Handle deep linking with hash
    function handleHash() {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const targetButton = document.querySelector(`[data-tab="${hash}"]`);
        if (targetButton) {
          targetButton.click();
        }
      }
    }

    // Check hash on load
    handleHash();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);
  }

  // ========================================
  // 5. SCROLL ANIMATIONS
  // ========================================

  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Optional: unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  // ========================================
  // 6. THEME TOGGLE (Optional)
  // ========================================

  function setupThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(`theme-${currentTheme}`);

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      const newTheme = isDark ? 'light' : 'dark';
      
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${newTheme}`);
      
      localStorage.setItem('theme', newTheme);
      
      // Dispatch event
      document.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: newTheme }
      }));
    });
  }

  // ========================================
  // 7. KEYBOARD NAVIGATION
  // ========================================

  function setupKeyboardNavigation() {
    // Enable keyboard navigation for tabs
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    
    if (!tabButtons.length) return;

    tabButtons.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        let newIndex;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            newIndex = (index + 1) % tabButtons.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            break;
          case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            newIndex = tabButtons.length - 1;
            break;
          default:
            return;
        }

        tabButtons[newIndex].click();
        tabButtons[newIndex].focus();
      });
    });
  }

  // ========================================
  // 8. PERFORMANCE OPTIMIZATIONS
  // ========================================

  // Debounce function
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

  // Throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ========================================
  // 9. UTILITIES
  // ========================================

  // Copy to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error('Copy failed:', error);
      }
      document.body.removeChild(textArea);
    }
  }

  // Setup copy buttons for code blocks
  function setupCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
      const button = document.createElement('button');
      button.className = 'copy-btn';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code to clipboard');
      
      button.addEventListener('click', async () => {
        await copyToClipboard(codeBlock.textContent);
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
      
      const pre = codeBlock.parentElement;
      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }

  // ========================================
  // 10. UX ENHANCEMENTS
  // ========================================

  /**
   * Reading Progress Bar
   */
  function setupReadingProgress() {
    // Create progress bar if not exists
    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
      document.body.prepend(progressBar);
    }
    
    const bar = progressBar.querySelector('.reading-progress-bar');
    
    // Update on scroll
    const updateProgress = throttle(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      
      bar.style.width = `${Math.min(progress, 100)}%`;
    }, 50);
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
  }

  /**
   * Scroll to Top Button
   */
  function setupScrollToTop() {
    // Create button if not exists
    let button = document.querySelector('.scroll-to-top');
    if (!button) {
      button = document.createElement('button');
      button.className = 'scroll-to-top';
      button.innerHTML = '↑';
      button.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(button);
    }
    
    // Show/hide on scroll
    const toggleVisibility = throttle(() => {
      if (window.scrollY > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }, 100);
    
    window.addEventListener('scroll', toggleVisibility);
    
    // Scroll to top on click
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Table of Contents Generator
   */
  function setupTableOfContents() {
    const tocContainer = document.querySelector('.toc');
    if (!tocContainer) return;
    
    // Find all headings in article
    const article = document.querySelector('article') || document.querySelector('main');
    const headings = article.querySelectorAll('h2, h3');
    
    if (headings.length === 0) return;
    
    // Generate TOC
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
      // Add ID if not exists
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.dataset.target = heading.id;
      
      // Nested list for h3
      if (heading.tagName === 'H3') {
        li.style.marginLeft = 'var(--space-4)';
      }
      
      li.appendChild(link);
      tocList.appendChild(li);
    });
    
    tocContainer.appendChild(tocList);
    
    // Highlight active section on scroll
    const links = tocList.querySelectorAll('a');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = tocList.querySelector(`a[data-target="${id}"]`);
          
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            link?.classList.add('active');
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );
    
    headings.forEach(heading => observer.observe(heading));
  }

  /**
   * Web Share API
   */
  function setupWebShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    // Check if Web Share API is supported
    if (!navigator.share) {
      shareButtons.forEach(btn => btn.style.display = 'none');
      return;
    }
    
    shareButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const title = document.title;
        const url = window.location.href;
        const text = document.querySelector('meta[name="description"]')?.content || '';
        
        try {
          await navigator.share({
            title,
            text,
            url
          });
          
          console.log('Content shared successfully');
        } catch (error) {
          // User cancelled or error occurred
          if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
          }
        }
      });
    });
  }

  // ========================================
  // 11. INITIALIZATION
  // ========================================

  function init() {
    // Initialize navigation
    new Navigation();
    
    // Setup features
    setupSmoothScrolling();
    setupLanguageSwitcher();
    setupTabs();
    setupScrollAnimations();
    setupThemeToggle();
    setupKeyboardNavigation();
    setupCodeCopyButtons();
    setupReadingProgress();
    setupScrollToTop();
    setupTableOfContents();
    setupWebShare();
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('app:ready'));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export utilities to window
  window.utils = {
    debounce,
    throttle,
    copyToClipboard
  };

})();
