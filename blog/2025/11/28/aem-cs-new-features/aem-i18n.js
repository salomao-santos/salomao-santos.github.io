// Internationalization for AEM Blog
const translations = {
    en: {
        title: "Adobe Experience Manager 2025",
        subtitle: "Complete Update Guide | Cloud Service • Sites • Assets • Forms | Features, Deprecations & Best Practices",
        tabs: {
            releases: "Releases",
            novidades: "What's New",
            depreciacoes: "Deprecations",
            sites: "Sites",
            assets: "Assets",
            cloudManager: "Cloud Manager",
            foundation: "Foundation",
            bestPractices: "Best Practices"
        },
        footer: {
            created: "Created",
            updated: "Last Updated",
            source: "Source: Adobe Experience League - Official Documentation",
            disclaimer: "Educational content based on public documentation. Not affiliated with Adobe.",
            backHome: "← Back to Home"
        },
        content: {
            // Common terms
            releaseNotes: "Release Notes",
            maintenanceNotes: "Maintenance Notes",
            requirements: "Requirements",
            nextRelease: "Next Planned Release",
            contact: "Contact",
            useCases: "Use Cases",
            timeline: "Timeline",
            requiredActions: "Required Actions",
            improvements: "Improvements",
            bestPractices: "Best Practices",
            securityChecklist: "Security Checklist"
        }
    },
    pt: {
        title: "Adobe Experience Manager 2025",
        subtitle: "Guia Completo de Atualizações | Cloud Service • Sites • Assets • Forms | Novidades, Depreciações e Melhores Práticas",
        tabs: {
            releases: "Releases",
            novidades: "Novidades",
            depreciacoes: "Depreciações",
            sites: "Sites",
            assets: "Assets",
            cloudManager: "Cloud Manager",
            foundation: "Foundation",
            bestPractices: "Melhores Práticas"
        },
        footer: {
            created: "Data de Criação",
            updated: "Última Atualização",
            source: "Fonte: Adobe Experience League - Documentação Oficial",
            disclaimer: "Conteúdo educacional baseado em documentação pública. Não afiliado à Adobe.",
            backHome: "← Voltar para Home"
        },
        content: {
            // Common terms
            releaseNotes: "Release Notes",
            maintenanceNotes: "Maintenance Notes",
            requirements: "Requirements",
            nextRelease: "Próxima Release Planejada",
            contact: "Contato",
            useCases: "Casos de Uso",
            timeline: "Timeline",
            requiredActions: "Ações Necessárias",
            improvements: "Melhorias",
            bestPractices: "Melhores Práticas",
            securityChecklist: "Checklist de Segurança"
        }
    },
    es: {
        title: "Adobe Experience Manager 2025",
        subtitle: "Guía Completa de Actualizaciones | Cloud Service • Sites • Assets • Forms | Novedades, Deprecaciones y Mejores Prácticas",
        tabs: {
            releases: "Releases",
            novidades: "Novedades",
            depreciacoes: "Deprecaciones",
            sites: "Sites",
            assets: "Assets",
            cloudManager: "Cloud Manager",
            foundation: "Foundation",
            bestPractices: "Mejores Prácticas"
        },
        footer: {
            created: "Fecha de Creación",
            updated: "Última Actualización",
            source: "Fuente: Adobe Experience League - Documentación Oficial",
            disclaimer: "Contenido educativo basado en documentación pública. No afiliado a Adobe.",
            backHome: "← Volver a Inicio"
        },
        content: {
            // Common terms
            releaseNotes: "Release Notes",
            maintenanceNotes: "Maintenance Notes",
            requirements: "Requirements",
            nextRelease: "Próximo Release Planificado",
            contact: "Contacto",
            useCases: "Casos de Uso",
            timeline: "Cronología",
            requiredActions: "Acciones Requeridas",
            improvements: "Mejoras",
            bestPractices: "Mejores Prácticas",
            securityChecklist: "Lista de Verificación de Seguridad"
        }
    }
};

// Get current language from localStorage or default to 'pt'
function getCurrentLanguage() {
    return localStorage.getItem('aem-blog-language') || 'pt';
}

// Set language
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} not supported, falling back to Portuguese`);
        lang = 'pt';
    }

    localStorage.setItem('aem-blog-language', lang);

    // Update language selector
    const selector = document.getElementById('lang-selector');
    if (selector) {
        selector.value = lang;
    }

    // Update page title and subtitle
    const headerTitle = document.querySelector('header h1');
    const headerSubtitle = document.querySelector('header .subtitle');

    if (headerTitle) {
        // Keep the emoji
        headerTitle.innerHTML = '🚀 ' + translations[lang].title;
    }

    if (headerSubtitle) {
        headerSubtitle.textContent = translations[lang].subtitle;
    }

    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabKeys = Object.keys(translations[lang].tabs);

    tabButtons.forEach((button, index) => {
        if (tabKeys[index]) {
            const tabKey = tabKeys[index];
            button.textContent = translations[lang].tabs[tabKey];
        }
    });

    // Update footer
    updateFooter(lang);

    // Update document language attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US';

    // Update meta tags
    updateMetaTags(lang);

    // Trigger custom event for content updates
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    
    // Call updateAllContent directly if available
    if (typeof window.updateAllContent === 'function') {
        window.updateAllContent(lang);
    }
}

// Update meta tags based on language
function updateMetaTags(lang) {
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    const descriptions = {
        en: "Complete guide to Adobe Experience Manager 2025 updates: new features, deprecated APIs, Java 21, Edge Computing, Content Fragments and more.",
        pt: "Guia completo das atualizações do Adobe Experience Manager 2025: novas funcionalidades, APIs depreciadas, Java 21, Edge Computing, Content Fragments e muito mais.",
        es: "Guía completa de actualizaciones de Adobe Experience Manager 2025: nuevas funcionalidades, APIs obsoletas, Java 21, Edge Computing, Content Fragments y más."
    };

    const titles = {
        en: "Adobe Experience Manager 2025: Complete Update Guide",
        pt: "Adobe Experience Manager 2025: Guia Completo de Atualizações",
        es: "Adobe Experience Manager 2025: Guía Completa de Actualizaciones"
    };

    if (metaDescription) metaDescription.content = descriptions[lang];
    if (ogTitle) ogTitle.content = titles[lang];
    if (ogDescription) ogDescription.content = descriptions[lang];
    if (twitterTitle) twitterTitle.content = titles[lang];
    if (twitterDescription) twitterDescription.content = descriptions[lang];
}

// Update footer content based on language
function updateFooter(lang) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const t = translations[lang].footer;
    
    // Update footer paragraphs
    const paragraphs = footer.querySelectorAll('p');
    if (paragraphs.length >= 4) {
        // Update "Created" text
        const createdTime = paragraphs[0].querySelector('time');
        if (createdTime) {
            paragraphs[0].innerHTML = `<strong>${t.created}:</strong> ${createdTime.outerHTML}`;
        }
        
        // Update "Last Updated" text
        const updatedTime = paragraphs[1].querySelector('time');
        if (updatedTime) {
            paragraphs[1].innerHTML = `<strong>${t.updated}:</strong> ${updatedTime.outerHTML}`;
        }
        
        // Update "Source" text
        paragraphs[2].innerHTML = `<strong>${t.source}</strong>`;
        
        // Update disclaimer
        paragraphs[3].innerHTML = `<small>${t.disclaimer}</small>`;
    }

    // Update back to home link
    const backLink = footer.querySelector('a[href="../index.html"]');
    if (backLink) {
        backLink.textContent = t.backHome;
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function () {
    const currentLang = getCurrentLanguage();
    setLanguage(currentLang);
});

// Make functions available globally
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.getTranslations = () => translations;
