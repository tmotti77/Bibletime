// Language System - Bilingual Support (English/Hebrew)

class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.init();
    }

    init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('biblicalTimelineLang');
        if (savedLang) {
            this.currentLang = savedLang;
        }

        // Set up language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Apply initial language
        this.applyLanguage();
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'he' : 'en';
        localStorage.setItem('biblicalTimelineLang', this.currentLang);
        this.applyLanguage();

        // Trigger event for other components to update
        window.dispatchEvent(new CustomEvent('languageChange', {
            detail: { language: this.currentLang }
        }));
    }

    applyLanguage() {
        const html = document.documentElement;

        // Set HTML attributes for direction
        if (this.currentLang === 'he') {
            html.setAttribute('lang', 'he');
            html.setAttribute('dir', 'rtl');
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
        }

        // Update all text elements
        this.updateTextElements();

        // Update language toggle buttons
        this.updateLangToggleUI();

        // Update placeholders
        this.updatePlaceholders();
    }

    updateTextElements() {
        // Update elements with data-en and data-he attributes
        const elements = document.querySelectorAll('[data-en][data-he]');
        elements.forEach(element => {
            const text = this.currentLang === 'en'
                ? element.getAttribute('data-en')
                : element.getAttribute('data-he');

            if (text) {
                element.textContent = text;
            }
        });
    }

    updateLangToggleUI() {
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    updatePlaceholders() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const placeholder = this.currentLang === 'en'
                ? searchInput.getAttribute('data-placeholder-en')
                : searchInput.getAttribute('data-placeholder-he');

            if (placeholder) {
                searchInput.placeholder = placeholder;
            }
        }
    }

    // Helper method to get text in current language
    getText(textObject) {
        if (typeof textObject === 'string') {
            return textObject;
        }
        return textObject[this.currentLang] || textObject.en || '';
    }

    // Helper method to get current language
    getCurrentLang() {
        return this.currentLang;
    }

    // Helper method to check if current language is RTL
    isRTL() {
        return this.currentLang === 'he';
    }
}

// Create global instance
const languageManager = new LanguageManager();
