// [2026-08-03] [JS, i18n, O(1), navigator.language, German/English] - Organized by Gemini

(function () {
    // ─────────────────────────────────────────────────────────────────
    // TRANSLATION TABLE
    // To add a new language: copy the 'en' block, change the key
    //   (e.g. 'fr', 'es') and fill in the strings.
    // To add a new translatable region: add a matching data-i18n="key"
    //   attribute in index.html, then add the key to each language here.
    // ─────────────────────────────────────────────────────────────────
    const TRANSLATIONS = {
        en: {
            page_title: 'Michael Barlozewski | Cloud Security Specialist, Bare-Metal & AI Developer',
            meta_desc:  'System Software Engineer, Cloud Security Specialist & AI Developer. Certified in Azure AI Agents, MLOps, Google Cloud Security & Zero-Allocation O(1) Bare-Metal Architecture.',
            og_title:   'Michael Barlozewski | Cloud Security Specialist & AI Developer',
            og_desc:    'High-Performance Computing, Google Cloud Security and Enterprise AI Agents Engineering from transistor level to global cloud clusters.',
            subtitle:   'System Software Engineer, Cloud Security Specialist &amp; AI Developer',
            motto:      'High-Performance Computing &amp; Intelligent Systems.',
            whoami1:    'Seasoned industry expertise with deep roots in Assembly, classical systems, and computing architecture. I operate at the intersection of absolute precision and immense scale.',
            whoami2:    'A synergistic fusion of Professional Audiovisual Media Design (IHK), Event Management (IHK), and Low-Level Bare-Metal Systems &amp; AI Engineering.',
            whoami3:    'Championing a Zero-Allocation mindset, delivering uncompromising performance from the transistor level up to global cloud clusters.',
        },
        de: {
            page_title: 'Michael Barlozewski | Cloud-Security-Spezialist, Bare-Metal & KI-Entwickler',
            meta_desc:  'Systemsoftware-Entwickler, Cloud-Security-Spezialist & KI-Entwickler (Deutschland). Azure AI Agents, Google Cloud Security & Zero-Allocation O(1) Bare-Metal Architektur.',
            og_title:   'Michael Barlozewski | Cloud-Security-Spezialist & KI-Entwickler',
            og_desc:    'High-Performance Computing, Google Cloud Security & Enterprise AI Agents Engineering – vom Transistor-Level bis in globale Cloud-Cluster.',
            subtitle:   'Systemsoftware-Entwickler, Cloud-Security-Spezialist &amp; KI-Entwickler',
            motto:      'High-Performance Computing &amp; Intelligente Systeme.',
            whoami1:    'Fundierte Branchenerfahrung mit tiefen Wurzeln in Assembly, klassischen Systemen &amp; Rechnerarchitektur. Ich operiere an der Schnittstelle von absoluter Präzision &amp; massiver Skalierung.',
            whoami2:    'Eine synergistische Fusion aus professioneller Mediengestaltung Bild &amp; Ton (IHK), Eventmanagement (IHK) &amp; Low-Level Bare-Metal Systems &amp; KI-Engineering.',
            whoami3:    'Mit striktem Zero-Allocation-Mindset liefere ich kompromisslose Performance – vom Transistor-Level bis in globale Cloud-Cluster.',
        },
        // ── Add future languages here ──────────────────────────────────
        // fr: { subtitle: '...', motto: '...', whoami1: '...', ... },
    };

    // ─────────────────────────────────────────────────────────────────
    // LANGUAGE DETECTION
    // navigator.language returns e.g. "de-DE", "de", "en-US", "en"
    // We normalise to the 2-letter code and fall back to 'en'.
    // ─────────────────────────────────────────────────────────────────
    function detectLang() {
        const raw = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        const code = raw.split('-')[0];          // "de-DE" → "de"
        return TRANSLATIONS[code] ? code : 'en'; // unknown → fallback en
    }

    // ─────────────────────────────────────────────────────────────────
    // APPLY TRANSLATIONS & DYNAMIC HEAD META LOCALIZATION
    // Finds every element with [data-i18n], looks up its key in the
    // chosen locale, writes innerHTML (supports &amp; entities etc.).
    // ─────────────────────────────────────────────────────────────────
    function applyTranslations(lang) {
        const dict = TRANSLATIONS[lang];
        if (!dict) return;
        
        // O(1) Dynamic SEO <head> localization for German browsers & live preview
        if (dict.page_title) document.title = dict.page_title;
        if (dict.meta_desc) {
            const el = document.querySelector('meta[name="description"]');
            if (el) el.setAttribute('content', dict.meta_desc);
        }
        if (dict.og_title) {
            const el = document.querySelector('meta[property="og:title"]');
            if (el) el.setAttribute('content', dict.og_title);
        }
        if (dict.og_desc) {
            const el = document.querySelector('meta[property="og:description"]');
            if (el) el.setAttribute('content', dict.og_desc);
        }
        
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (Object.prototype.hasOwnProperty.call(dict, key)) {
                el.innerHTML = dict[key];
            }
        });
        // Stamp the detected locale on <html> for CSS hooks if needed
        document.documentElement.setAttribute('lang', lang);
    }

    // ─────────────────────────────────────────────────────────────────
    // INIT — runs once, O(1) per element
    // ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        const lang = detectLang();
        if (lang !== 'en') applyTranslations(lang); // en is already in HTML
    });
})();
