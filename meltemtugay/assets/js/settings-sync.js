(function () {
    const SETTINGS_ENDPOINT = '/api/settings/public';

    function digitsOnly(value) {
        return (value || '').replace(/\D/g, '');
    }

    function updatePhoneLinks(formattedPhone, digitsPhone, email) {
        const phoneHref = `tel:${digitsPhone}`;
        const waHref = `https://wa.me/${digitsPhone}?text=${encodeURIComponent('Merhaba, Meltem Tugay ile görüşmek istiyorum.')}`;

        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href') || '';

            if (href.startsWith('tel:')) {
                link.setAttribute('href', phoneHref);
                if (link.textContent && /\+?90|535|521|34/.test(link.textContent)) {
                    link.textContent = link.textContent.replace(/\+?90[\s\d]+/g, formattedPhone);
                }
            }

            if (href.includes('wa.me/')) {
                link.setAttribute('href', waHref);
            }

            if (href.startsWith('mailto:') && email) {
                link.setAttribute('href', `mailto:${email}`);
                if (link.textContent && link.textContent.includes('@')) {
                    link.textContent = email;
                }
            }
        });
    }

    function updateMetadata(settings) {
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }

        const metaMappings = [
            ['meta[name="description"]', settings.siteDescription],
            ['meta[property="og:title"]', settings.siteTitle],
            ['meta[property="og:description"]', settings.siteDescription],
            ['meta[property="og:site_name"]', settings.siteTitle],
            ['meta[name="twitter:title"]', settings.siteTitle],
            ['meta[name="twitter:description"]', settings.siteDescription]
        ];

        metaMappings.forEach(([selector, value]) => {
            const element = document.querySelector(selector);
            if (element && value) {
                element.setAttribute('content', value);
            }
        });
    }

    function updateSettingsOnPage(settings) {
        const formattedPhone = settings.contactPhone || '+90 535 521 34 58';
        const digitsPhone = digitsOnly(settings.whatsappPhone || settings.contactPhone || '905355213458');
        const contactEmail = settings.contactEmail || 'pskmeltemtugay@gmail.com';
        const siteDescription = settings.siteDescription || 'Psikolog Meltem Tugay ile profesyonel psikolojik destek için güvenli bir adım atın!';
        const siteTitle = settings.siteTitle || 'Psikolog Meltem Tugay';
        const cvButtonVisible = settings.cvButtonVisible !== false;

        updateMetadata(settings);
        updatePhoneLinks(formattedPhone, digitsPhone, contactEmail);

        document.querySelectorAll('.cv-link').forEach((el) => {
            el.style.display = cvButtonVisible ? '' : 'none';
            el.hidden = !cvButtonVisible;
        });

        document.querySelectorAll('[data-setting="contact-phone"]').forEach((el) => {
            el.textContent = formattedPhone;
            if (el.tagName === 'A') {
                el.setAttribute('href', `tel:${digitsPhone}`);
            }
        });

        document.querySelectorAll('[data-setting="contact-email"]').forEach((el) => {
            el.textContent = contactEmail;
            if (el.tagName === 'A') {
                el.setAttribute('href', `mailto:${contactEmail}`);
            }
        });

        document.querySelectorAll('[data-setting="site-description"]').forEach((el) => {
            el.textContent = siteDescription;
        });

        document.querySelectorAll('[data-setting="site-title"]').forEach((el) => {
            el.textContent = siteTitle;
        });
    }

    async function loadSettings() {
        try {
            const response = await fetch(SETTINGS_ENDPOINT, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ayarlar yüklenemedi');
            }

            const settings = await response.json();
            updateSettingsOnPage(settings);
        } catch (error) {
            console.error('Settings sync error:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSettings);
    } else {
        loadSettings();
    }
})();
