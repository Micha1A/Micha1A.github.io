// [2026-08-01] [JS, O(1) Web Audio Synthesizer & Booking Dispatch Suite] - Organized by Gemini

document.addEventListener('DOMContentLoaded', () => {
    let audioCtx = null;
    let lfoOsc = null;
    let lfoGain = null;
    let subOsc = null;
    let subGain = null;
    let isSubActive = false;

    let antOsc = null;
    let antFilter = null;
    let antGain = null;

    let activeTarget = 'whatsapp';

    const cMajorFreqs = [
        261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
        587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50,
        1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53
    ];

    const initAudio = () => {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    const playHoverChirp = () => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.018);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
    };

    const playModalOpen = () => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const sub = audioCtx.createOscillator();
        const subG = audioCtx.createGain();
        sub.type = 'square';
        sub.frequency.setValueAtTime(70, now);
        sub.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        subG.gain.setValueAtTime(0.12, now);
        subG.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        sub.connect(subG);
        subG.connect(audioCtx.destination);
        sub.start(now);
        sub.stop(now + 0.15);

        const sweep = audioCtx.createOscillator();
        const sweepG = audioCtx.createGain();
        sweep.type = 'sawtooth';
        sweep.frequency.setValueAtTime(350, now);
        sweep.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
        sweepG.gain.setValueAtTime(0.05, now);
        sweepG.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        sweep.connect(sweepG);
        sweepG.connect(audioCtx.destination);
        sweep.start(now);
        sweep.stop(now + 0.13);
    };

    const playModalClose = () => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    };

    const playGlitchPulse = () => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(300, now + 0.03);
        osc.frequency.setValueAtTime(1100, now + 0.06);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    };

    const playTypingBeep = (keyIndex) => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const freq = cMajorFreqs[(keyIndex || Math.floor(Math.random() * cMajorFreqs.length)) % cMajorFreqs.length];

        const osc = audioCtx.createOscillator();
        const oscG = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.04);
        oscG.gain.setValueAtTime(0.06, now);
        oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(oscG);
        oscG.connect(audioCtx.destination);

        const clickLen = Math.floor(audioCtx.sampleRate * 0.02);
        const clickBuf = audioCtx.createBuffer(1, clickLen, audioCtx.sampleRate);
        const cd = clickBuf.getChannelData(0);
        for (let i = 0; i < clickLen; i++) cd[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / clickLen);
        const clickSrc = audioCtx.createBufferSource();
        clickSrc.buffer = clickBuf;
        
        const bpf = audioCtx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 2800;
        bpf.Q.value = 3.0;
        
        const clickG = audioCtx.createGain();
        clickG.gain.setValueAtTime(0.04, now);
        clickG.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        clickSrc.connect(bpf);
        bpf.connect(clickG);
        clickG.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
        clickSrc.start(now);
        clickSrc.stop(now + 0.03);
    };

    const startAnticipationSweep = () => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        stopAnticipationSweep();
        const now = audioCtx.currentTime;

        antOsc = audioCtx.createOscillator();
        antOsc.type = 'sine';
        antOsc.frequency.value = 140;

        antFilter = audioCtx.createBiquadFilter();
        antFilter.type = 'lowpass';
        antFilter.frequency.setValueAtTime(180, now);
        antFilter.frequency.exponentialRampToValueAtTime(1800, now + 1.4);
        antFilter.Q.value = 8;

        antGain = audioCtx.createGain();
        antGain.gain.setValueAtTime(0, now);
        antGain.gain.linearRampToValueAtTime(0.05, now + 0.6);

        antOsc.connect(antFilter);
        antFilter.connect(antGain);
        antGain.connect(audioCtx.destination);
        antOsc.start(now);
    };

    const stopAnticipationSweep = () => {
        if (!antGain || !audioCtx) return;
        const now = audioCtx.currentTime;
        try {
            antGain.gain.cancelScheduledValues(now);
            antGain.gain.setValueAtTime(antGain.gain.value, now);
            antGain.gain.linearRampToValueAtTime(0, now + 0.15);
            const o = antOsc;
            setTimeout(() => { try { o?.stop(); } catch {} }, 180);
        } catch {}
        antOsc = null; antFilter = null; antGain = null;
    };

    const playEuphoricWin = () => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        stopAnticipationSweep();
        const now = audioCtx.currentTime;

        const kick = audioCtx.createOscillator();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(140, now);
        kick.frequency.exponentialRampToValueAtTime(28, now + 0.2);
        const kickG = audioCtx.createGain();
        kickG.gain.setValueAtTime(0.25, now);
        kickG.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        kick.connect(kickG);
        kickG.connect(audioCtx.destination);
        kick.start(now);
        kick.stop(now + 0.45);

        const chordFreqs = [
            261.63, 329.63, 392.0, 523.25,
            330.0, 440.0, 523.25, 659.25,
            392.0, 523.25, 659.25, 783.99
        ];
        chordFreqs.forEach((freq, i) => {
            const t = now + 0.04 * i;
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.07, t + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 1.0);
        });
    };

    const trigger7_5HzResonance = (enable) => {
        initAudio();
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;

        if (enable && !isSubActive) {
            isSubActive = true;
            subOsc = audioCtx.createOscillator();
            subGain = audioCtx.createGain();
            lfoOsc = audioCtx.createOscillator();
            lfoGain = audioCtx.createGain();

            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(60, now);
            subGain.gain.setValueAtTime(0.01, now);
            subGain.gain.linearRampToValueAtTime(0.10, now + 0.5);

            lfoOsc.type = 'square';
            lfoOsc.frequency.setValueAtTime(7.5, now);
            lfoGain.gain.setValueAtTime(0.15, now);

            lfoOsc.connect(subGain.gain);
            subOsc.connect(subGain);
            subGain.connect(audioCtx.destination);
            subOsc.start(now);
            lfoOsc.start(now);
        } else if (!enable && isSubActive && subGain) {
            isSubActive = false;
            subGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            setTimeout(() => {
                if (subOsc) { subOsc.stop(); subOsc.disconnect(); subOsc = null; }
                if (lfoOsc) { lfoOsc.stop(); lfoOsc.disconnect(); lfoOsc = null; }
                subGain = null; lfoGain = null;
            }, 350);
        }
    };

    const dispatchBookingCommand = () => {
        playEuphoricWin();
        const inputEl = document.getElementById('booking-prompt-input');
        const userText = (inputEl && inputEl.value.trim()) 
            ? inputEl.value.trim() 
            : "IHN BRAUCHEN WIR! We need your O(1) architectural mastery immediately.";
        
        if (activeTarget === 'whatsapp') {
            const targetUrl = `https://wa.me/491628927068?text=${encodeURIComponent(userText)}`;
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
            const subject = encodeURIComponent("EXECUTIVE BOOKING // O(1) ARCHITECTURE");
            const body = encodeURIComponent(userText);
            const targetUrl = `mailto:micha@tutamail.com?subject=${subject}&body=${body}`;
            window.location.href = targetUrl;
        }
    };

    const interactiveSelectors = '.tile, .sub-tile, .stream-container, .links a, .avatar-container, .whoami, .target-badge, .dispatch-btn, .booking-spacer-box';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => playHoverChirp());
    });

    const clickSelectors = '.tile, .sub-tile, .stream-container';
    document.querySelectorAll(clickSelectors).forEach(el => {
        el.addEventListener('click', () => playModalOpen());
    });

    const modalCloseBtn = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', playModalClose);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) playModalClose();
        });
    }

    const whoamiBox = document.querySelector('.whoami');
    if (whoamiBox) whoamiBox.addEventListener('click', () => playGlitchPulse());

    const targetBadges = document.querySelectorAll('.target-badge');
    targetBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            targetBadges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
            activeTarget = badge.getAttribute('data-target') || 'whatsapp';
            playGlitchPulse();
        });
    });

    const bookingSpacer = document.querySelector('.booking-spacer-box');
    const bookingContainer = document.querySelector('.booking-command-container');
    const bookingOverlay = document.getElementById('booking-overlay');
    const bookingClose = document.getElementById('booking-close');

    function toggleBookingModal(forceState) {
        if (!bookingContainer) return;
        const isActive = forceState !== undefined ? forceState : !bookingContainer.classList.contains('active');
        bookingContainer.classList.toggle('active', isActive);
        if (bookingSpacer) bookingSpacer.classList.toggle('active', isActive);
        if (bookingOverlay) bookingOverlay.classList.toggle('active', isActive);
        const glitchSpan = bookingSpacer ? bookingSpacer.querySelector('.spacer-glitch-text') : null;
        
        const transitionScreen = document.getElementById('booking-transition-screen');
        const mainUI = document.getElementById('booking-main-ui');
        
        if (isActive) {
            playModalOpen();
            if (glitchSpan) glitchSpan.innerHTML = '&gt; [ TERMINAL_ACTIVE // READY ] &lt;';
            if (transitionScreen && mainUI) {
                transitionScreen.style.display = 'flex';
                transitionScreen.style.opacity = '1';
                mainUI.style.display = 'none';
                mainUI.style.opacity = '0';
                setTimeout(() => {
                    transitionScreen.style.opacity = '0';
                    setTimeout(() => {
                        transitionScreen.style.display = 'none';
                        mainUI.style.display = 'block';
                        setTimeout(() => {
                            mainUI.style.opacity = '1';
                            const inp = document.getElementById('booking-prompt-input');
                            if (inp) inp.focus();
                        }, 50);
                    }, 280);
                }, 1500);
            } else {
                setTimeout(() => {
                    const inp = document.getElementById('booking-prompt-input');
                    if (inp) inp.focus();
                }, 150);
            }
        } else {
            playModalClose();
            if (glitchSpan) glitchSpan.innerHTML = '&gt; book_me _here &lt;';
            if (transitionScreen && mainUI) {
                transitionScreen.style.display = 'none';
                mainUI.style.display = 'block';
                mainUI.style.opacity = '1';
            }
        }
    }

    if (bookingSpacer) bookingSpacer.addEventListener('click', () => toggleBookingModal());
    if (bookingOverlay) bookingOverlay.addEventListener('click', () => toggleBookingModal(false));
    if (bookingClose) bookingClose.addEventListener('click', () => toggleBookingModal(false));

    const bookingInput = document.getElementById('booking-prompt-input');
    const bookingBtn = document.getElementById('booking-dispatch-btn');
    if (bookingInput) {
        bookingInput.addEventListener('focus', () => startAnticipationSweep());
        bookingInput.addEventListener('blur', () => stopAnticipationSweep());
        bookingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                dispatchBookingCommand();
            } else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt') {
                playTypingBeep(e.keyCode || e.key.charCodeAt(0));
            }
        });
    }
    if (bookingBtn) {
        bookingBtn.addEventListener('click', () => {
            dispatchBookingCommand();
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const toast = document.getElementById('terminal-toast');
                if (toast && toast.classList.contains('active')) {
                    trigger7_5HzResonance(true);
                } else {
                    trigger7_5HzResonance(false);
                }
            }
        });
    });

    const terminalToast = document.getElementById('terminal-toast');
    if (terminalToast) observer.observe(terminalToast, { attributes: true });

    window.O1_AUDIO_ENGINE = {
        playHoverChirp,
        playModalOpen,
        playModalClose,
        playGlitchPulse,
        playTypingBeep,
        startAnticipationSweep,
        stopAnticipationSweep,
        playEuphoricWin,
        trigger7_5HzResonance
    };
});

// [2026-08-02] [mobile, O(1), sticky booking bar padding guard] - Organized by Gemini
(function() {
    const MOBILE_BP = 900;
    function syncBodyPadding() {
        const spacer = document.querySelector('.booking-spacer-box');
        if (!spacer) return;
        if (window.innerWidth <= MOBILE_BP) {
            document.body.style.paddingBottom = spacer.offsetHeight + 'px';
        } else {
            document.body.style.paddingBottom = '';
        }
    }
    document.addEventListener('DOMContentLoaded', syncBodyPadding);
    window.addEventListener('resize', syncBodyPadding);
})();
