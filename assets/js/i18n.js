/**
 * ========================================
 * INTERNATIONALIZATION (i18n) ENGINE
 * ========================================
 * Salomao Santos - Professional Blog
 * Version: 1.0.0
 * Date: 2025-11-27
 * 
 * Features:
 * - Multi-language support (EN, PT-BR, ES)
 * - Automatic language detection
 * - LocalStorage persistence
 * - Dynamic content update
 * - Meta tags update
 * - hreflang management
 * - Fallback system
 */

class I18n {
  constructor(config = {}) {
    this.supportedLanguages = config.supportedLanguages || ['en', 'pt-BR', 'es'];
    this.defaultLanguage = config.defaultLanguage || 'en';
    this.translationsPath = config.translationsPath || '/data/translations/';
    this.currentLanguage = null;
    this.translations = {};
    this.storageKey = 'site_language';
    
    this.init();
  }

  /**
   * Initialize i18n system
   */
  async init() {
    try {
      // Detect language
      const detectedLang = this.detectLanguage();
      
      // Load translations
      await this.loadTranslations(detectedLang);
      
      // Set current language
      await this.setLanguage(detectedLang);
      
      // Dispatch ready event
      this.dispatchEvent('i18n:ready', { language: this.currentLanguage });
    } catch (error) {
      console.error('I18n initialization error:', error);
      // Fallback to default language
      await this.setLanguage(this.defaultLanguage);
    }
  }

  /**
   * Detect user's preferred language
   */
  detectLanguage() {
    // 1. Check URL parameter (?lang=pt-BR)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.isSupported(urlLang)) {
      return urlLang;
    }

    // 2. Check localStorage
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang && this.isSupported(storedLang)) {
      return storedLang;
    }

    // 3. Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Try exact match first (e.g., pt-BR)
    if (this.isSupported(browserLang)) {
      return browserLang;
    }
    
    // Try language code only (e.g., pt from pt-BR)
    const langCode = browserLang.split('-')[0];
    const matchedLang = this.supportedLanguages.find(lang => 
      lang.startsWith(langCode)
    );
    
    if (matchedLang) {
      return matchedLang;
    }

    // 4. Fallback to default
    return this.defaultLanguage;
  }

  /**
   * Check if language is supported
   */
  isSupported(lang) {
    return this.supportedLanguages.includes(lang);
  }

  /**
   * Load translation file
   */
  async loadTranslations(lang) {
    if (this.translations[lang]) {
      return this.translations[lang];
    }

    try {
      const response = await fetch(`${this.translationsPath}${lang}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      
      const data = await response.json();
      this.translations[lang] = data;
      
      return data;
    } catch (error) {
      console.error(`Error loading ${lang} translations:`, error);
      
      // Try loading default language if not already trying
      if (lang !== this.defaultLanguage) {
        return await this.loadTranslations(this.defaultLanguage);
      }
      
      throw error;
    }
  }

  /**
   * Set current language
   */
  async setLanguage(lang) {
    if (!this.isSupported(lang)) {
      console.warn(`Language ${lang} not supported. Falling back to ${this.defaultLanguage}`);
      lang = this.defaultLanguage;
    }

    try {
      // Load translations if not cached
      if (!this.translations[lang]) {
        await this.loadTranslations(lang);
      }

      this.currentLanguage = lang;
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, lang);
      
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      
      // Update meta tags
      this.updateMetaTags();
      
      // Update hreflang links
      this.updateHreflangLinks();
      
      // Update content
      this.updateContent();
      
      // Update URL without reload
      this.updateURL(lang);
      
      // Announce language change to screen readers
      this.announceToScreenReader(lang);
      
      // Dispatch language change event
      this.dispatchEvent('i18n:languageChanged', { 
        language: lang,
        translations: this.translations[lang]
      });
      
      return true;
    } catch (error) {
      console.error('Error setting language:', error);
      return false;
    }
  }

  /**
   * Get translation by key path (e.g., 'nav.home')
   */
  t(keyPath, replacements = {}) {
    const keys = keyPath.split('.');
    let value = this.translations[this.currentLanguage];
    
    // Navigate through object
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English if key not found
        console.warn(`Translation key '${keyPath}' not found for ${this.currentLanguage}`);
        
        // Try English fallback
        let fallbackValue = this.translations[this.defaultLanguage];
        for (const k of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
            fallbackValue = fallbackValue[k];
          } else {
            return keyPath; // Return key path if even English doesn't have it
          }
        }
        value = fallbackValue;
        break;
      }
    }
    
    // Handle string replacements (e.g., {name})
    if (typeof value === 'string') {
      value = value.replace(/\{(\w+)\}/g, (match, key) => {
        return replacements[key] !== undefined ? replacements[key] : match;
      });
    }
    
    return value;
  }

  /**
   * Update content elements with data-i18n attribute
   */
  updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    console.log(`Updating ${elements.length} elements with language: ${this.currentLanguage}`);
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Debug log for first few elements
      if (elements.length < 20 || Math.random() < 0.1) {
        console.log(`Translating ${key} = ${translation}`);
      }
      
      // Update element based on type
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.placeholder !== undefined) {
          element.placeholder = translation;
        }
      } else if (element.tagName === 'IMG') {
        element.alt = translation;
      } else {
        // Check if we should update innerHTML or textContent
        const useHTML = element.hasAttribute('data-i18n-html');
        
        if (useHTML) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
    
    console.log('Content update complete');
  }

  /**
   * Update meta tags
   */
  updateMetaTags() {
    const meta = this.t('meta');
    
    // Update title
    document.title = meta.title;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', meta.keywords);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', meta.description);
    }
    
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      const localeMap = {
        'en': 'en_US',
        'pt-BR': 'pt_BR',
        'es': 'es_ES'
      };
      ogLocale.setAttribute('content', localeMap[this.currentLanguage] || 'en_US');
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', meta.title);
    }
    
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', meta.description);
    }
  }

  /**
   * Update hreflang links for SEO
   */
  updateHreflangLinks() {
    // Remove existing hreflang links
    const existingLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => link.remove());
    
    // Get base URL
    const baseURL = window.location.origin + window.location.pathname;
    
    // Add hreflang for each supported language
    this.supportedLanguages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${baseURL}?lang=${lang}`;
      document.head.appendChild(link);
    });
    
    // Add x-default
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseURL}?lang=${this.defaultLanguage}`;
    document.head.appendChild(defaultLink);
  }

  /**
   * Update URL without page reload
   */
  updateURL(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    
    // Update URL without reload
    window.history.replaceState({ lang }, '', url);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get all translations for current language
   */
  getAllTranslations() {
    return this.translations[this.currentLanguage] || {};
  }

  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  /**
   * Announce to screen readers (accessibility)
   */
  announceToScreenReader(lang) {
    const announcer = document.getElementById('sr-announcements');
    if (!announcer) return;
    
    const messages = {
      'en': 'Language changed to English',
      'pt-BR': 'Idioma alterado para Português',
      'es': 'Idioma cambiado a Español'
    };
    
    // Clear and set announcement
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = messages[lang] || messages['en'];
    }, 100);
  }
}

// Initialize i18n when DOM is ready
let i18n;

function initI18n() {
  i18n = new I18n();
  
  // Make available globally immediately
  window.I18n = I18n;
  window.i18n = i18n;
  
  // Listen for i18n ready event and force content update
  document.addEventListener('i18n:ready', () => {
    console.log('i18n ready, forcing content update');
    if (i18n && i18n.updateContent) {
      setTimeout(() => i18n.updateContent(), 100);
    }
  });
  
  // Listen for language change
  document.addEventListener('i18n:languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
