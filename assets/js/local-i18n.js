/**
 * Local I18n System for Blog Posts
 * Simplified translation system for individual blog posts
 */

class LocalI18n {
  constructor(translations) {
    this.translations = translations;
    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && this.translations[langParam]) {
      return langParam;
    }

    // Check localStorage
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && this.translations[savedLang]) {
      return savedLang;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0];
    
    // Map common language codes
    const langMap = {
      'pt': 'pt-BR',
      'en': 'en',
      'es': 'es'
    };

    if (this.translations[browserLang]) {
      return browserLang;
    } else if (langMap[shortLang] && this.translations[langMap[shortLang]]) {
      return langMap[shortLang];
    }

    // Default to Portuguese Brazil
    return 'pt-BR';
  }

  init() {
    // Create language selector if it doesn't exist
    this.createLanguageSelector();
    
    // Update content on page load
    this.updateContent();
    
    // Update URL
    this.updateURL();
    
    // Set document language
    document.documentElement.lang = this.currentLang === 'pt-BR' ? 'pt-BR' : this.currentLang;
  }

  createLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (!selector) return;

    const select = document.createElement('select');
    select.id = 'lang-select';
    select.setAttribute('aria-label', 'Select Language');

    const languages = {
      'pt-BR': 'Português',
      'en': 'English',
      'es': 'Español'
    };

    Object.entries(languages).forEach(([code, name]) => {
      if (this.translations[code]) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        if (code === this.currentLang) {
          option.selected = true;
        }
        select.appendChild(option);
      }
    });

    select.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });

    selector.appendChild(select);
  }

  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not available`);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('preferred-language', lang);
    this.updateContent();
    this.updateURL();
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang;
  }

  updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    const currentTranslations = this.translations[this.currentLang];

    if (!currentTranslations) {
      console.error(`No translations found for language: ${this.currentLang}`);
      return;
    }

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getNestedValue(currentTranslations, key);

      if (translation) {
        // Handle different content types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      } else {
        console.warn(`Translation key not found: ${key}`);
      }
    });

    // Update meta tags
    this.updateMetaTags(currentTranslations);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  updateMetaTags(translations) {
    // Update page title
    if (translations.meta?.title) {
      document.title = translations.meta.title;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations.meta?.description) {
      metaDesc.setAttribute('content', translations.meta.description);
    }

    // Update og:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && translations.meta?.title) {
      ogTitle.setAttribute('content', translations.meta.title);
    }

    // Update og:description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && translations.meta?.description) {
      ogDesc.setAttribute('content', translations.meta.description);
    }
  }

  updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('lang', this.currentLang);
    window.history.replaceState({}, '', url);
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  getSupportedLanguages() {
    return Object.keys(this.translations);
  }
}

// Auto-initialize when translations are available
if (typeof translations !== 'undefined') {
  const localI18n = new LocalI18n(translations);
  
  // Expose globally for debugging
  window.localI18n = localI18n;
}
