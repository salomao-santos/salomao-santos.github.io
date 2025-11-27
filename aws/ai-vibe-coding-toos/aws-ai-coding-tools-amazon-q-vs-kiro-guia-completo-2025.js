$(document).ready(function() {
    // Tab navigation
    $('.tab-btn').on('click', function() {
        const tabId = $(this).data('tab');
        
        // Remove active class from all tabs and content
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        
        // Add active class to clicked tab and corresponding content
        $(this).addClass('active');
        $(`#${tabId}`).addClass('active');
        
        // Smooth scroll to top of content
        $('html, body').animate({
            scrollTop: $('.container').offset().top - 20
        }, 300);
    });

    // Highlight table rows on hover
    $('.comparison-table tbody tr').hover(
        function() {
            $(this).css('background-color', '#f0f8ff');
        },
        function() {
            if (!$(this).hasClass('deprecated')) {
                $(this).css('background-color', '');
            } else {
                $(this).css('background-color', '#fff9f0');
            }
        }
    );

    // Add copy button to code blocks
    $('pre').each(function() {
        const $pre = $(this);
        const $copyBtn = $('<button class="copy-btn">📋 Copiar</button>');
        
        $copyBtn.css({
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '5px 10px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.8rem'
        });

        $pre.css('position', 'relative');
        $pre.append($copyBtn);

        $copyBtn.on('click', function() {
            const text = $pre.text().replace('📋 Copiar', '').trim();
            
            navigator.clipboard.writeText(text).then(function() {
                $copyBtn.text('✅ Copiado!');
                setTimeout(function() {
                    $copyBtn.text('📋 Copiar');
                }, 2000);
            }).catch(function() {
                $copyBtn.text('❌ Erro');
                setTimeout(function() {
                    $copyBtn.text('📋 Copiar');
                }, 2000);
            });
        });
    });

    // Filter table functionality
    const $filterInput = $('<input type="text" placeholder="🔍 Filtrar funcionalidades..." class="filter-input">');
    
    $filterInput.css({
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        border: '2px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem'
    });

    $('.comparison-table').before($filterInput);

    $filterInput.on('keyup', function() {
        const value = $(this).val().toLowerCase();
        
        $('.comparison-table tbody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Smooth scroll for internal links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 500);
        }
    });

    // Add tooltips to deprecated items
    $('.dep').each(function() {
        $(this).attr('title', 'Este comando foi depreciado. Use conversação natural.');
        $(this).css('cursor', 'help');
    });

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                $(entry.target).css({
                    opacity: '0',
                    transform: 'translateY(20px)'
                }).animate({
                    opacity: 1
                }, 500);
                
                $(entry.target).css('transform', 'translateY(0)');
            }
        });
    }, observerOptions);

    $('.version-card, .news-card, .platform-card, .prompt-card').each(function() {
        observer.observe(this);
    });

    // Add expand/collapse for long content
    $('.platform-card ul, .platform-card ol').each(function() {
        const $list = $(this);
        const itemCount = $list.children('li').length;
        
        if (itemCount > 5) {
            $list.children('li:gt(4)').hide();
            
            const $toggleBtn = $('<button class="toggle-btn">Ver mais (+' + (itemCount - 5) + ')</button>');
            $toggleBtn.css({
                marginTop: '10px',
                padding: '5px 15px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
            });
            
            $list.after($toggleBtn);
            
            $toggleBtn.on('click', function() {
                const $hiddenItems = $list.children('li:gt(4)');
                
                if ($hiddenItems.is(':visible')) {
                    $hiddenItems.slideUp();
                    $(this).text('Ver mais (+' + (itemCount - 5) + ')');
                } else {
                    $hiddenItems.slideDown();
                    $(this).text('Ver menos');
                }
            });
        }
    });

    // Add search highlight
    function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Alt + 1-5 for tab navigation
        if (e.altKey && e.keyCode >= 49 && e.keyCode <= 53) {
            e.preventDefault();
            const tabIndex = e.keyCode - 49;
            $('.tab-btn').eq(tabIndex).click();
        }
        
        // Ctrl/Cmd + F for filter
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
            e.preventDefault();
            $filterInput.focus();
        }
    });

    // Add keyboard shortcut hints
    const $shortcutHint = $('<div class="shortcut-hint">💡 Atalhos: Alt+1-5 (tabs) | Ctrl+F (filtrar)</div>');
    $shortcutHint.css({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(35, 47, 62, 0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '0.85rem',
        zIndex: 1000,
        display: 'none'
    });
    
    $('body').append($shortcutHint);
    
    // Show hint on first visit
    if (!localStorage.getItem('shortcutHintSeen')) {
        $shortcutHint.fadeIn().delay(5000).fadeOut();
        localStorage.setItem('shortcutHintSeen', 'true');
    }

    // Show hint on hover over help icon
    $('.tab-btn:contains("Detalhes")').hover(
        function() {
            $shortcutHint.fadeIn();
        },
        function() {
            setTimeout(function() {
                $shortcutHint.fadeOut();
            }, 2000);
        }
    );

    console.log('✅ Amazon Q Developer Comparison - Loaded successfully!');
    console.log('📊 Use Alt+1-5 para navegar entre tabs');
    console.log('🔍 Use Ctrl+F para filtrar a tabela');
});
