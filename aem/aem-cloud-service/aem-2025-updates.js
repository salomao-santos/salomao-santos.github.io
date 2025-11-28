// Tab functionality
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

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
            document.getElementById(targetTab).classList.add('active');

            // Scroll to top of content
            document.getElementById('main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Handle deep linking (URL hash)
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

    // Update URL hash when tab is clicked
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            history.pushState(null, null, `#${targetTab}`);
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#main-content') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Add keyboard navigation for tabs
document.addEventListener('keydown', function (e) {
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;

    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const currentIndex = tabs.indexOf(activeTab);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].click();
        tabs[nextIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].click();
        tabs[prevIndex].focus();
    }
});

// Print functionality
function printContent() {
    window.print();
}

// Add print button if needed
const footer = document.querySelector('footer');
if (footer) {
    const printBtn = document.createElement('button');
    printBtn.textContent = '🖨️ Imprimir Guia';
    printBtn.style.cssText = 'margin-top: 1rem; padding: 0.75rem 1.5rem; background: white; color: var(--adobe-red); border: 2px solid white; border-radius: 6px; cursor: pointer; font-weight: 600;';
    printBtn.onclick = printContent;
    footer.insertBefore(printBtn, footer.firstChild);
}

// Add copy code functionality to code blocks
document.querySelectorAll('pre').forEach(pre => {
    const button = document.createElement('button');
    button.textContent = '📋 Copiar';
    button.style.cssText = 'position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.4rem 0.8rem; background: rgba(255,255,255,0.9); color: var(--adobe-dark); border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: 600;';

    pre.style.position = 'relative';
    pre.appendChild(button);

    button.addEventListener('click', async () => {
        const code = pre.textContent.replace('📋 Copiar', '').trim();
        try {
            await navigator.clipboard.writeText(code);
            button.textContent = '✅ Copiado!';
            setTimeout(() => {
                button.textContent = '📋 Copiar';
            }, 2000);
        } catch (err) {
            button.textContent = '❌ Erro';
            setTimeout(() => {
                button.textContent = '📋 Copiar';
            }, 2000);
        }
    });
});

// Analytics tracking (placeholder)
function trackTabChange(tabName) {
    // Add your analytics tracking code here
    console.log('Tab changed to:', tabName);
}

// Track tab changes
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        trackTabChange(button.getAttribute('data-tab'));
    });
});
