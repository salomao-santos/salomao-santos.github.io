$(document).ready(function () {
    // Default language
    let currentLang = 'pt';

    // Function to update content based on language
    function updateContent(lang) {
        currentLang = lang;

        // Update html lang attribute for accessibility
        $('html').attr('lang', lang);

        // Update active state of buttons
        $('.lang-btn').removeClass('active');
        $(`.lang-btn[data-lang="${lang}"]`).addClass('active');

        // Update text content
        $('[data-i18n]').each(function () {
            const key = $(this).data('i18n');
            if (translations[lang] && translations[lang][key]) {
                $(this).text(translations[lang][key]);
            }
        });
    }

    // Event listener for language buttons
    $('.lang-btn').click(function () {
        const lang = $(this).data('lang');
        updateContent(lang);
    });

    // Initialize with default language
    updateContent(currentLang);

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80 // Adjusted for header height
            }, 1000);
        }
    });
});
