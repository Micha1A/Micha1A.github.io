// [2026-08-04] [JS, Rates & Licensing, O(1), Bilingual, Mobile+Desktop] - Organized by Gemini

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────────
    // BILINGUAL RATES DATA  (EN default / DE for German browsers)
    // ─────────────────────────────────────────────────────────────────
    const RATES_DATA = {
        en: {
            panelTitle: '⚡ RATES & LICENSING',
            barLabel:   '>Rates_& _Licensing<',
            backBtn:    '← BACK',
            categories: [
                {
                    id: 'dev',
                    label: 'Development',
                    icon:  'assets/stitch/feynman_rate_icon.svg',
                    section: '⚡ DEVELOPMENT & CONSULTING',
                    items: [
                        {
                            id:    'feynman',
                            icon:  'assets/stitch/feynman_rate_icon.svg',
                            label: 'The "Feynman" Rate',
                            price: '€220 / hr  ·  €1,800 / day',
                            scope: 'True O(1) architecture, deterministic quantum mechanics implementation, transistor-level efficiency, and zero-allocation bare-metal code.',
                            terms: 'No negotiations. You pay for absolute peak performance and constant-time execution.'
                        },
                        {
                            id:    'engine',
                            icon:  'assets/stitch/custom_engine_icon.svg',
                            label: 'Custom Bare-Metal Engine',
                            price: 'Starting at €5,000',
                            scope: 'Applied quantum mechanical models, deterministic O(1) pipelines, isolated nervous systems, and cutting-edge Wasm/Zig modules in the browser.',
                            terms: 'Base price. Final cost scales directly with project scope, architectural reach, and complexity.'
                        },
                        {
                            id:    'godmode',
                            icon:  'assets/stitch/god_mode_icon.svg',
                            label: 'God Mode — Firefighter',
                            price: '€350 / hr',
                            scope: 'Emergency system rescue, massive production bottlenecks, and immediate debugging of quantum-level math and assembly pipelines.',
                            terms: 'Absolute priority. You skip the line, I drop everything. Minimum billing: 4 hours per deployment.'
                        }
                    ]
                },
                {
                    id: 'bionic',
                    label: 'Bionic Wasm UI',
                    icon:  'assets/stitch/bionic_wasm_icon.svg',
                    section: '✨ BIONIC WASM UI & REFINEMENT',
                    items: [
                        {
                            id:    'bionic-ui',
                            icon:  'assets/stitch/frontend_o1_icon.svg',
                            label: 'Bionic O(1) Frontend & UI Architecture',
                            price: 'Starting at €3,500',
                            scope: 'Transforming static DOMs into dynamic, zero-latency O(1) Wasm architectures. Bionic interactive controls, magnetic gravity physics, custom WebGL injections, and absolute animation fluidity.',
                            terms: 'Tailored frontend refinement and custom high-performance interactive asset creation.'
                        }
                    ]
                },
                {
                    id: 'audio',
                    label: 'Quantum Audio',
                    icon:  'assets/stitch/quantum_audio_icon.svg',
                    section: '🔊 QUANTUM AUDIO ENGINES & SYNTHS',
                    items: [
                        {
                            id:    'dsp',
                            icon:  'assets/stitch/dsp_engine_icon.svg',
                            label: 'Custom Quantum Synth / DSP Engine',
                            price: 'Starting at €10,000 <a href="https://micha1a.gitlab.io/" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-left:12px; font-size:0.75rem; background:#030610; color:#00ffcc; padding:3px 10px; border-radius:4px; border:1px solid #00ffcc; text-decoration:none; vertical-align:middle; text-shadow:0 0 6px rgba(0,255,204,0.7);">⚡ [ EXPLORE QUANTUM SYNTH LAB // gitlab.io ]</a>',
                            scope: 'Dedicated O(1) WebAudio engines, zero-latency quantum synthesis modules, and compiled Wasm/Zig audio cores.',
                            terms: 'Includes compiled binary core, custom API integration, and full technical documentation. Source code remains proprietary.'
                        },
                        {
                            id:    'ip',
                            icon:  'assets/stitch/ip_buyout_icon.svg',
                            label: 'Full IP Buyout / Exclusive B2B License',
                            price: '€25,000+',
                            scope: 'Exclusive commercial rights, full IP transfer, or custom DSP architecture for game studios, DAWs, or enterprise platforms.',
                            terms: 'Custom B2B agreement depending on target reach, distribution scale, and monopoly requirements.'
                        }
                    ]
                },
                {
                    id: 'cloud',
                    label: 'AI & Cloud Security',
                    icon:  'assets/stitch/enterprise_ai_icon.svg',
                    section: '☁️ ENTERPRISE AI AGENTS & CLOUD SECURITY',
                    items: [
                        {
                            id:    'cloud-audit',
                            icon:  'assets/stitch/enterprise_ai_icon.svg',
                            label: 'AI & Cloud Security Architecture Audit',
                            price: 'Starting at €3,500',
                            scope: 'Deep-dive review of MLOps infrastructures, Google Cloud Vertex AI & Gemini integration, RAG vector systems, and zero-allocation cybersecurity hardening.',
                            terms: 'Comprehensive strategic blueprint, bottleneck/vulnerability mitigation plan, and live architectural calibration.'
                        }
                    ]
                },
                {
                    id: 'contract',
                    label: 'Contract & Terms',
                    icon:  'assets/stitch/30_30_40_icon.svg',
                    section: '⚖️ CONTRACT TERMS & PAYMENT',
                    items: [
                        {
                            id:    'milestone',
                            icon:  'assets/stitch/30_30_40_icon.svg',
                            label: 'The "30 / 30 / 40" Milestone Protocol',
                            price: null,
                            milestone: true,
                            scope: null,
                            terms: null
                        },
                        {
                            id:    'b2b-notice',
                            icon:  'assets/stitch/b2b_notice_icon.svg',
                            label: 'International B2B Notice',
                            price: '0% EU VAT (Reverse Charge)',
                            scope: 'All rates are strictly net in EUR (€). International US / non-EU enterprise invoicing is executed under tax-exempt international VAT regulations.',
                            terms: 'W-8BEN compliant / Reverse Charge. § 3a Abs. 2 UStG for EU partners.'
                        }
                    ]
                }
            ]
        },
        de: {
            panelTitle: '⚡ TARIFE & LIZENZEN',
            barLabel:   '>Tarife_& _Lizenzen>',
            backBtn:    '← ZURÜCK',
            categories: [
                {
                    id: 'dev',
                    label: 'Entwicklung',
                    icon:  'assets/stitch/feynman_rate_icon.svg',
                    section: '⚡ ENTWICKLUNGS- & BERATUNGSSÄTZE',
                    items: [
                        {
                            id:    'feynman',
                            icon:  'assets/stitch/feynman_rate_icon.svg',
                            label: 'Der "Feynman"-Tarif',
                            price: '150 € / Std.  ·  1.200 € / Tag',
                            scope: 'Echte O(1)-Architektur, deterministische Quantenmechanik-Implementierung, Effizienz auf Transistor-Ebene und Zero-Allocation Bare-Metal-Code.',
                            terms: 'Keine Verhandlungen. Du bezahlst für absolute Spitzenperformance und konstante Ausführungszeiten im O(1)-Takt.'
                        },
                        {
                            id:    'engine',
                            icon:  'assets/stitch/custom_engine_icon.svg',
                            label: 'Custom Bare-Metal Engine',
                            price: 'Ab 3.500 €',
                            scope: 'Angewandte quantenmechanische Modelle, deterministische O(1)-Pipelines, isolierte Nervensysteme und hochmoderne Wasm/Zig-Module im Browser.',
                            terms: 'Grundpreis. Der finale Preis skaliert direkt mit dem Projektumfang, der Architektur-Reichweite und der Komplexität.'
                        },
                        {
                            id:    'godmode',
                            icon:  'assets/stitch/god_mode_icon.svg',
                            label: 'God Mode — Feuerwehr / Override',
                            price: '250 € / Std.',
                            scope: 'Notrettung von Systemen, Beseitigung massiver Performance-Engpässe und sofortiges Debugging von Quanten-Mathematik- und Assembly-Pipelines.',
                            terms: 'Absolute Priorität. Du überspringst jede Warteschlange – ich lass sofort alles stehen und liegen, um den Brand zu löschen. Mindestbuchung: 4 Stunden pro Einsatz.'
                        }
                    ]
                },
                {
                    id: 'bionic',
                    label: 'Bionisches Wasm UI',
                    icon:  'assets/stitch/bionic_wasm_icon.svg',
                    section: '✨ BIONIC WASM UI & WEB-VEREDELUNG',
                    items: [
                        {
                            id:    'bionic-ui',
                            icon:  'assets/stitch/frontend_o1_icon.svg',
                            label: 'Bionische O(1) Frontend- & UI-Architektur',
                            price: 'Ab 2.500 €',
                            scope: 'Transformation statischer Webseitengrundlagen in dynamische, latenzfreie O(1) Wasm-Architekturen. Bionische interaktive Buttons, magnetische Schwerkraft-Physik, maßgeschneiderte WebGL-Injektionen und absolute Lösungsflüssigkeit.',
                            terms: 'Maßgeschneiderte Frontend-Veredelung und Erstellung hoch performanter interaktiver Web-Assets.'
                        }
                    ]
                },
                {
                    id: 'audio',
                    label: 'Quantum Audio',
                    icon:  'assets/stitch/quantum_audio_icon.svg',
                    section: '🔊 QUANTUM AUDIO-ENGINES & SYNTHESIZER',
                    items: [
                        {
                            id:    'dsp',
                            icon:  'assets/stitch/dsp_engine_icon.svg',
                            label: 'Custom Quantum Synth / DSP Engine',
                            price: 'Ab 7.000 € <a href="https://micha1a.gitlab.io/" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-left:12px; font-size:0.75rem; background:#030610; color:#00ffcc; padding:3px 10px; border-radius:4px; border:1px solid #00ffcc; text-decoration:none; vertical-align:middle; text-shadow:0 0 6px rgba(0,255,204,0.7);">⚡ [ QUANTUM SYNTHESIZER LAB BESTAUNEN // gitlab.io ]</a>',
                            scope: 'Dedizierte O(1) WebAudio-Engines, latenzfreie Quanten-Synthese-Module und kompilierte Wasm/Zig Audio-Kerne.',
                            terms: 'Beinhaltet den kompilierten Binärkern, individuelle API-Integration und die komplette technische Dokumentation. Der Quellcode bleibt mein alleiniges Eigentum (IP).'
                        },
                        {
                            id:    'ip',
                            icon:  'assets/stitch/ip_buyout_icon.svg',
                            label: 'Full IP Buyout / Exklusive B2B-Lizenz',
                            price: 'Ab 17.500 €',
                            scope: 'Exklusive kommerzielle Verwertungsrechte, vollständige Übertragung von geistigem Eigentum (IP-Transfer) oder Custom DSP-Architekturen für Spielestudios, DAWs und Enterprise-Plattformen.',
                            terms: 'Maßgeschneiderter B2B-Vertrag abhängig von Reichweite, Verbreitungsskala und Exklusivitäts-Anforderungen.'
                        }
                    ]
                },
                {
                    id: 'cloud',
                    label: 'KI & Cloud Security',
                    icon:  'assets/stitch/enterprise_ai_icon.svg',
                    section: '☁️ ENTERPRISE AI AGENTS & CLOUD SECURITY',
                    items: [
                        {
                            id:    'cloud-audit',
                            icon:  'assets/stitch/enterprise_ai_icon.svg',
                            label: 'AI & Cloud Security Architektur-Audit',
                            price: 'Ab 2.500 €',
                            scope: 'Tiefenprüfung (Deep-Dive) von MLOps-Infrastrukturen, Google Cloud Vertex AI & Gemini-Integration, RAG-Vektorsystemen und Zero-Allocation Cybersecurity-Härtung.',
                            terms: 'Detaillierter strategischer Blueprint, Schwachstellen- & Bottleneck-Beseitigungsplan sowie live vor Ort/Remote ausgeführte Architektur-Kalibrierung.'
                        }
                    ]
                },
                {
                    id: 'contract',
                    label: 'Konditionen & Zahlung',
                    icon:  'assets/stitch/30_30_40_icon.svg',
                    section: '⚖️ VERTRAGSKONDITIONEN & ZAHLUNGSMODELL',
                    items: [
                        {
                            id:    'milestone',
                            icon:  'assets/stitch/30_30_40_icon.svg',
                            label: 'Das "30 / 30 / 40" Meilenstein-Protokoll',
                            price: null,
                            milestone: true,
                            scope: null,
                            terms: null
                        },
                        {
                            id:    'b2b-notice',
                            icon:  'assets/stitch/b2b_notice_icon.svg',
                            label: 'Internationale B2B Rechnungshinweise',
                            price: '0% USt (Reverse Charge)',
                            scope: 'Alle Preise sind Nettoangaben in Euro (€). Für Auftraggeber aus dem EU-Ausland oder Drittländern greift das steuerfreie Reverse-Charge-Verfahren.',
                            terms: 'W-8BEN-konform / Reverse Charge. § 3a Abs. 2 UStG für EU-Partner.'
                        }
                    ]
                }
            ]
        }
    };

    // ─────────────────────────────────────────────────────────────────
    // MILESTONE HTML (shared, same for EN/DE)
    // ─────────────────────────────────────────────────────────────────
    function buildMilestoneHTML() {
        return `
            <div class="rates-milestone-grid">
                <div class="rates-milestone-card">
                    <span class="rates-milestone-pct cyan">30%</span>
                    <span class="rates-milestone-label">Upfront</span>
                    <span class="rates-milestone-desc">Non-refundable. Kick-off retainer before engineering begins.</span>
                </div>
                <div class="rates-milestone-card">
                    <span class="rates-milestone-pct blue">30%</span>
                    <span class="rates-milestone-label">Alpha / Mid</span>
                    <span class="rates-milestone-desc">Due when working architectural core is demonstrated.</span>
                </div>
                <div class="rates-milestone-card">
                    <span class="rates-milestone-pct gold">40%</span>
                    <span class="rates-milestone-label">Final Sign-off</span>
                    <span class="rates-milestone-desc">Upon delivery, deployment, or max optimization boundary.</span>
                </div>
            </div>`;
    }

    // ─────────────────────────────────────────────────────────────────
    // SOFT SOUND — mellow chime for rates panel (not jarring)
    // ─────────────────────────────────────────────────────────────────
    function playRatesOpen() {
        const ae = window.O1_AUDIO_ENGINE;
        if (!ae) return;
        // Reuse initAudio from global engine then play a softer tone
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!window._ratesAudioCtx) window._ratesAudioCtx = new AudioCtx();
            const ctx = window._ratesAudioCtx;
            if (ctx.state === 'suspended') ctx.resume();
            if (ctx.state !== 'running') return;
            const now = ctx.currentTime;
            [261.63, 329.63, 392.0].forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, now + i * 0.07);
                g.gain.setValueAtTime(0, now + i * 0.07);
                g.gain.linearRampToValueAtTime(0.08, now + i * 0.07 + 0.04);
                g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.55);
                o.connect(g); g.connect(ctx.destination);
                o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.6);
            });
        } catch {}
    }

    function playRatesClose() {
        try {
            if (!window._ratesAudioCtx) return;
            const ctx = window._ratesAudioCtx;
            if (ctx.state !== 'running') return;
            const now = ctx.currentTime;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(440, now);
            o.frequency.exponentialRampToValueAtTime(220, now + 0.12);
            g.gain.setValueAtTime(0.08, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            o.connect(g); g.connect(ctx.destination);
            o.start(now); o.stop(now + 0.15);
        } catch {}
    }

    function playRatesHover() {
        const ae = window.O1_AUDIO_ENGINE;
        if (ae && ae.playHoverChirp) ae.playHoverChirp();
    }

    function playRatesClick() {
        try {
            if (!window._ratesAudioCtx) return;
            const ctx = window._ratesAudioCtx;
            if (ctx.state !== 'running') return;
            const now = ctx.currentTime;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(880, now);
            o.frequency.exponentialRampToValueAtTime(440, now + 0.06);
            g.gain.setValueAtTime(0.1, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            o.connect(g); g.connect(ctx.destination);
            o.start(now); o.stop(now + 0.09);
        } catch {}
    }

    // ─────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────
    let currentLang = 'en';
    let panelOpen   = false;
    let currentLevel = 1;  // 1 = category grid, 2 = detail view
    let currentCatId = null;

    // ─────────────────────────────────────────────────────────────────
    // DOM REFS (assigned after DOMContentLoaded)
    // ─────────────────────────────────────────────────────────────────
    let ratesOverlay, ratesPanel, ratesScrollBody,
        ratesPanelTitle, ratesCloseBtn, ratesBackBtn,
        ratesMobileBar, ratesBarLabel,
        ratesDesktopPulse, ratesDesktopLabel;

    // ─────────────────────────────────────────────────────────────────
    // LEVEL 1: RENDER CATEGORY GRID
    // ─────────────────────────────────────────────────────────────────
    function renderCategories() {
        const data = RATES_DATA[currentLang];
        ratesScrollBody.innerHTML = '';
        currentLevel = 1;
        currentCatId = null;
        ratesBackBtn.classList.remove('visible');

        const grid = document.createElement('div');
        grid.className = 'rates-cat-grid';

        data.categories.forEach(cat => {
            // Section heading
            const heading = document.createElement('div');
            heading.className = 'rates-section-heading';
            heading.textContent = cat.section;
            grid.appendChild(heading);

            // Cards for each item in category
            cat.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'rates-cat-card';
                card.innerHTML = `
                    <img src="${item.icon}" alt="${item.label}" width="52" height="52">
                    <span class="rates-cat-card-label">${item.label}</span>
                `;
                card.addEventListener('mouseenter', playRatesHover);
                card.addEventListener('click', () => {
                    playRatesClick();
                    renderDetail(cat, item);
                });
                grid.appendChild(card);
            });
        });

        ratesScrollBody.appendChild(grid);
    }

    // ─────────────────────────────────────────────────────────────────
    // LEVEL 2: RENDER DETAIL VIEW
    // ─────────────────────────────────────────────────────────────────
    function renderDetail(cat, item) {
        ratesScrollBody.innerHTML = '';
        currentLevel = 2;
        currentCatId = cat.id;
        ratesBackBtn.classList.add('visible');

        const detail = document.createElement('div');
        detail.className = 'rates-detail-view';

        // Header with icon + name + price
        detail.innerHTML = `
            <div class="rates-detail-header">
                <img src="${item.icon}" alt="${item.label}" width="44" height="44">
                <h3>${item.label}</h3>
            </div>
            ${item.price ? `<div class="rates-price-tag">${item.price}</div>` : ''}
        `;

        // Milestone special layout
        if (item.milestone) {
            const milestonesDiv = document.createElement('div');
            milestonesDiv.innerHTML = buildMilestoneHTML();
            detail.appendChild(milestonesDiv);
        } else {
            const rows = document.createElement('div');
            rows.className = 'rates-detail-rows';

            if (item.scope) {
                rows.innerHTML += `
                    <div class="rates-detail-row">
                        <div class="rates-detail-row-icon"><img src="assets/stitch/scope_icon.svg" alt="Scope" width="26" height="26"></div>
                        <div class="rates-detail-row-content">
                            <div class="rates-detail-row-title">Scope</div>
                            <div class="rates-detail-row-text">${item.scope}</div>
                        </div>
                    </div>`;
            }

            if (item.terms) {
                rows.innerHTML += `
                    <div class="rates-detail-row">
                        <div class="rates-detail-row-icon"><img src="assets/stitch/terms_icon.svg" alt="Terms" width="26" height="26"></div>
                        <div class="rates-detail-row-content">
                            <div class="rates-detail-row-title">Terms</div>
                            <div class="rates-detail-row-text">${item.terms}</div>
                        </div>
                    </div>`;
            }

            // B2B block for b2b-notice item
            if (item.id === 'b2b-notice') {
                rows.innerHTML += `
                    <div class="rates-b2b-block">
                        <strong>W-8BEN</strong> — US clients: no US withholding tax due to the German-American double taxation treaty.<br>
                        <strong>Reverse Charge</strong> — EU B2B: VAT responsibility transfers to the client (§ 3a Abs. 2 UStG).
                    </div>`;
            }

            detail.appendChild(rows);
        }

        ratesScrollBody.appendChild(detail);
    }

    // ─────────────────────────────────────────────────────────────────
    // OPEN / CLOSE PANEL
    // ─────────────────────────────────────────────────────────────────
    function openRatesPanel() {
        if (panelOpen) return;
        panelOpen = true;

        // Detect language (sync with i18n if available)
        const htmlLang = document.documentElement.getAttribute('lang') || 'en';
        currentLang = RATES_DATA[htmlLang] ? htmlLang : 'en';

        // Set title
        ratesPanelTitle.textContent = RATES_DATA[currentLang].panelTitle;

        renderCategories();
        ratesOverlay.classList.add('active');
        ratesPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        playRatesOpen();
    }

    function closeRatesPanel() {
        if (!panelOpen) return;
        panelOpen = false;
        ratesOverlay.classList.remove('active');
        ratesPanel.classList.remove('active');
        document.body.style.overflow = '';
        playRatesClose();
    }

    // ─────────────────────────────────────────────────────────────────
    // MOBILE SCROLL TRIGGER
    // ─────────────────────────────────────────────────────────────────
    let scrollTriggerEl = null;

    function initMobileScrollTrigger() {
        // Find the subtitle / whoami section as the trigger anchor
        scrollTriggerEl = document.querySelector('.whoami') || document.querySelector('h2');
        if (!scrollTriggerEl || !ratesMobileBar) return;

        let lastScrollY = 0;

        const onScroll = () => {
            if (window.innerWidth > 900) return;  // desktop: skip
            const rect = scrollTriggerEl.getBoundingClientRect();
            const pastTrigger = rect.top < window.innerHeight * 0.7;

            if (pastTrigger) {
                ratesMobileBar.classList.add('rates-top-visible');
            } else {
                ratesMobileBar.classList.remove('rates-top-visible');
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // Add body top padding guard for the fixed bar
        function syncTopPadding() {
            if (window.innerWidth <= 900) {
                document.body.style.paddingTop = ratesMobileBar.offsetHeight + 'px';
            } else {
                document.body.style.paddingTop = '';
            }
        }
        document.addEventListener('DOMContentLoaded', syncTopPadding);
        window.addEventListener('resize', () => {
            onScroll();
            syncTopPadding();
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // DESKTOP PULSE LOOP (6s appear / 6s disappear)
    // ─────────────────────────────────────────────────────────────────
    let desktopPulseTimer = null;

    function initDesktopPulseLoop() {
        if (!ratesDesktopPulse) return;

        // Only visible on desktop
        if (window.innerWidth <= 900) return;

        ratesDesktopPulse.style.display = 'flex';

        let visible = false;

        const toggle = () => {
            visible = !visible;
            if (visible) {
                ratesDesktopPulse.classList.remove('rdp-hidden');
            } else {
                ratesDesktopPulse.classList.add('rdp-hidden');
            }
            desktopPulseTimer = setTimeout(toggle, 6000);
        };

        // Start: hidden, show after 6s first time
        ratesDesktopPulse.classList.add('rdp-hidden');
        desktopPulseTimer = setTimeout(toggle, 6000);

        // On resize: hide desktop pulse on mobile
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 900) {
                ratesDesktopPulse.style.display = 'none';
                clearTimeout(desktopPulseTimer);
            } else if (ratesDesktopPulse.style.display === 'none') {
                ratesDesktopPulse.style.display = 'flex';
                desktopPulseTimer = setTimeout(toggle, 6000);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // INIT
    // ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        ratesOverlay      = document.getElementById('rates-overlay');
        ratesPanel        = document.getElementById('rates-panel');
        ratesScrollBody   = document.getElementById('rates-scroll-body');
        ratesPanelTitle   = document.getElementById('rates-panel-title');
        ratesCloseBtn     = document.getElementById('rates-close-btn');
        ratesBackBtn      = document.getElementById('rates-back-btn');
        ratesMobileBar    = document.getElementById('rates-mobile-bar');
        ratesBarLabel     = document.getElementById('rates-bar-label');
        ratesDesktopPulse = document.getElementById('rates-desktop-pulse');
        ratesDesktopLabel = document.getElementById('rdp-label');

        if (!ratesOverlay || !ratesPanel) return;  // safety guard

        // Apply bilingual label to mobile bar and desktop pulse
        function applyLangLabels() {
            const htmlLang = document.documentElement.getAttribute('lang') || 'en';
            const lang = RATES_DATA[htmlLang] ? htmlLang : 'en';
            if (ratesBarLabel)     ratesBarLabel.textContent   = RATES_DATA[lang].barLabel;
            if (ratesDesktopLabel) ratesDesktopLabel.textContent = RATES_DATA[lang].barLabel;
            if (ratesBackBtn)      ratesBackBtn.textContent    = RATES_DATA[lang].backBtn;
        }
        applyLangLabels();

        // Watch for i18n lang changes (i18n stamps lang on <html>)
        const langObserver = new MutationObserver(applyLangLabels);
        langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

        // OPEN triggers
        if (ratesMobileBar) ratesMobileBar.addEventListener('click', () => { openRatesPanel(); });
        if (ratesDesktopPulse) ratesDesktopPulse.addEventListener('click', () => { openRatesPanel(); });
        if (ratesDesktopPulse) ratesDesktopPulse.addEventListener('mouseenter', playRatesHover);
        if (ratesMobileBar) ratesMobileBar.addEventListener('mouseenter', playRatesHover);

        // CLOSE triggers
        if (ratesCloseBtn)  ratesCloseBtn.addEventListener('click', closeRatesPanel);
        if (ratesOverlay)   ratesOverlay.addEventListener('click', (e) => {
            if (e.target === ratesOverlay) closeRatesPanel();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panelOpen) closeRatesPanel(); });

        // BACK button
        if (ratesBackBtn) ratesBackBtn.addEventListener('click', () => {
            playRatesClose();
            renderCategories();
        });

        // Start scroll trigger (mobile) and desktop pulse
        initMobileScrollTrigger();
        initDesktopPulseLoop();
    });

})();
