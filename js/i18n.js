import config from './config.js';

class I18nManager {
    constructor() {
        this.currentLanguage = config.defaultLanguage;
        this.languages = config.supportedLanguages;
        this.translations = {};
        this.isLoaded = false;
    }

    async init() {
        try {
            // Load the default language first
            await this.loadLanguage(this.currentLanguage);
            this.applyTranslations();
            this.setupLanguageSelector();
            this.isLoaded = true;
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
        }
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`locale/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang} translations`);
            }
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            // Fallback to English if available
            if (lang !== 'en' && this.translations['en']) {
                console.warn(`Falling back to English`);
                return this.translations['en'];
            }
            return {};
        }
    }

    async changeLanguage(lang) {
        if (!this.languages.includes(lang)) {
            console.warn(`Language ${lang} is not supported`);
            return;
        }

        if (!this.translations[lang]) {
            await this.loadLanguage(lang);
        }

        this.currentLanguage = lang;
        this.applyTranslations();
        
        // Update language selectors
        document.querySelectorAll('#footer-language-select, #language-select').forEach(select => {
            select.value = lang;
        });

        // Store the language preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        const currentTranslations = this.translations[this.currentLanguage] || {};

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(currentTranslations, key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.getAttribute('type') === 'placeholder') {
                        element.placeholder = translation;
                    } else {
                        element.value = translation;
                    }
                } else {
                    element.innerHTML = translation;
                }
            } else {
                console.warn(`Missing translation for key: ${key} in language: ${this.currentLanguage}`);
            }
        });

        // Handle placeholders separately
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(currentTranslations, key);
            
            if (translation) {
                element.placeholder = translation;
            }
        });
    }

    getNestedTranslation(obj, path) {
        return path.split('.').reduce((p, c) => (p && p[c]) ? p[c] : null, obj);
    }

    setupLanguageSelector() {
        // Set up both language selectors (footer and playground)
        document.querySelectorAll('#footer-language-select, #language-select').forEach(select => {
            // Set initial value
            select.value = this.currentLanguage;
            
            // Add change event listener
            select.addEventListener('change', (event) => {
                this.changeLanguage(event.target.value);
            });
        });

        // Load saved language preference if available
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && this.languages.includes(savedLanguage)) {
            this.changeLanguage(savedLanguage);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getTranslation(key) {
        const currentTranslations = this.translations[this.currentLanguage] || {};
        return this.getNestedTranslation(currentTranslations, key) || key;
    }
}

// Create and export the singleton instance
const i18n = new I18nManager();
export default i18n;