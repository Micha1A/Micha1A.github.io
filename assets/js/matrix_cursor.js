// [2026-08-01] [JS, O(1), Mega High-Tech Matrix Cursor & Whoami Glitch, Zero-Allocation Engine] - Organized by Gemini

(function () {
    "use strict";

    const GLYPHS = "01010101_██▓▓▒▒░░-++~~=<>XΩΘΞΔΛΠΣΦΨΩ";
    const GLYPHS_LEN = GLYPHS.length;
    const MAX_TRAIL = 64;
    const MAX_PARTICLES = 32;

    const COLOR_PRIMARY = "rgba(255, 0, 60, ";
    const COLOR_CYAN = "rgba(0, 255, 255, ";
    const COLOR_GLITCH = "rgba(255, 30, 30, ";
    const COLOR_HUD = "#ff003c";
    const COLOR_HUD_CYAN = "#00ffff";
    const COLOR_HUD_DIM = "rgba(255, 0, 60, 0.4)";
    const COLOR_TEXT_SHADOW = "0 0 8px rgba(255, 0, 60, 0.8), 0 0 14px rgba(0, 255, 255, 0.6)";

    const trailX = new Float32Array(MAX_TRAIL);
    const trailY = new Float32Array(MAX_TRAIL);
    const trailVx = new Float32Array(MAX_TRAIL);
    const trailVy = new Float32Array(MAX_TRAIL);
    const trailLife = new Float32Array(MAX_TRAIL);
    const trailGlyph = new Uint16Array(MAX_TRAIL);
    const trailColorIdx = new Uint8Array(MAX_TRAIL);
    let trailHead = 0;
    let trailCount = 0;

    const partX = new Float32Array(MAX_PARTICLES);
    const partY = new Float32Array(MAX_PARTICLES);
    const partVx = new Float32Array(MAX_PARTICLES);
    const partVy = new Float32Array(MAX_PARTICLES);
    const partLife = new Float32Array(MAX_PARTICLES);
    const partMaxLife = new Float32Array(MAX_PARTICLES);
    let partHead = 0;
    let partCount = 0;

    let mouseX = 0;
    let mouseY = 0;
    let currX = 0;
    let currY = 0;
    let velX = 0;
    let velY = 0;
    let speed = 0;
    let isClicking = 0;
    let glitchIntensity = 0.0;
    let rotation = 0.0;
    let screenWidth = 0;
    let screenHeight = 0;
    let lastFrameTime = 0;
    let whoamiEl = null;

    let canvas = null;
    let ctx = null;

    const PI2 = Math.PI * 2;

    const ALPHA_RED = new Array(101);
    const ALPHA_CYAN = new Array(101);
    for (let i = 0; i <= 100; i++) {
        const a = (i / 100).toFixed(2);
        ALPHA_RED[i] = "rgba(255, 0, 60, " + a + ")";
        ALPHA_CYAN[i] = "rgba(0, 255, 255, " + a + ")";
    }

    const GLYPH_ARRAY = new Array(GLYPHS_LEN);
    for (let i = 0; i < GLYPHS_LEN; i++) {
        GLYPH_ARRAY[i] = GLYPHS.charAt(i);
    }

    function init() {
        if (window.innerWidth <= 900 || window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
            const whoami = document.querySelector(".whoami");
            if (whoami) {
                whoami.addEventListener("click", () => {
                    whoami.classList.add("matrix-glitching");
                    setTimeout(() => whoami.classList.remove("matrix-glitching"), 400);
                });
            }
            return;
        }

        canvas = document.getElementById("matrix-cursor-canvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "matrix-cursor-canvas";
            document.body.appendChild(canvas);
        }
        ctx = canvas.getContext("2d", { alpha: true });

        updateDimensions();
        window.addEventListener("resize", onResize, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mousedown", onMouseDown, { passive: true });
        window.addEventListener("mouseup", onMouseUp, { passive: true });

        whoamiEl = document.querySelector(".whoami");
        if (whoamiEl) {
            whoamiEl.addEventListener("mouseenter", onWhoamiEnter, { passive: true });
            whoamiEl.addEventListener("mouseleave", onWhoamiLeave, { passive: true });
            whoamiEl.addEventListener("click", onWhoamiClick, { passive: true });
        }

        mouseX = screenWidth >> 1;
        mouseY = screenHeight >> 1;
        currX = mouseX;
        currY = mouseY;

        lastFrameTime = performance.now();
        requestAnimationFrame(renderLoop);
    }

    function updateDimensions() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        if (canvas) {
            canvas.width = screenWidth;
            canvas.height = screenHeight;
        }
    }

    function onResize() {
        updateDimensions();
    }

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function onMouseDown() {
        isClicking = 1;
        glitchIntensity = 1.0;
        emitClickParticles(currX, currY);
        if (whoamiEl && isHoveringWhoami) {
            triggerWhoamiGlitch();
        }
    }

    function onMouseUp() {
        isClicking = 0;
    }

    let isHoveringWhoami = false;
    function onWhoamiEnter() {
        isHoveringWhoami = true;
        glitchIntensity = 0.8;
    }
    function onWhoamiLeave() {
        isHoveringWhoami = false;
    }
    function onWhoamiClick() {
        triggerWhoamiGlitch();
    }
    function triggerWhoamiGlitch() {
        if (!whoamiEl) return;
        whoamiEl.classList.add("matrix-glitching");
        resetWhoamiTimer();
    }

    let whoamiTimerId = 0;
    function resetWhoamiTimer() {
        if (whoamiTimerId !== 0) {
            clearTimeout(whoamiTimerId);
        }
        whoamiTimerId = setTimeout(clearWhoamiGlitch, 400);
    }
    function clearWhoamiGlitch() {
        if (whoamiEl) {
            whoamiEl.classList.remove("matrix-glitching");
        }
        whoamiTimerId = 0;
    }

    function emitClickParticles(x, y) {
        let i = 0;
        while (i < 12) {
            const idx = partHead;
            partX[idx] = x;
            partY[idx] = y;
            const angle = (i / 12) * PI2;
            const spd = 2.0 + (i % 3) * 1.5;
            partVx[idx] = Math.cos(angle) * spd;
            partVy[idx] = Math.sin(angle) * spd;
            partMaxLife[idx] = 20 + (i * 2);
            partLife[idx] = partMaxLife[idx];
            
            partHead = (partHead + 1) & (MAX_PARTICLES - 1);
            if (partCount < MAX_PARTICLES) partCount++;
            i++;
        }
    }

    function addTrailPoint(x, y, vx, vy, spd) {
        if (spd < 0.2 && glitchIntensity < 0.1 && isClicking === 0) return;
        const idx = trailHead;
        trailX[idx] = x;
        trailY[idx] = y;
        trailVx[idx] = -vx * 0.1;
        trailVy[idx] = -vy * 0.1 + 0.2;
        trailLife[idx] = 1.0;
        trailGlyph[idx] = Math.floor(Math.random() * GLYPHS_LEN);
        trailColorIdx[idx] = (Math.random() > 0.3 || glitchIntensity > 0.5) ? 0 : 1;

        trailHead = (trailHead + 1) & (MAX_TRAIL - 1);
        if (trailCount < MAX_TRAIL) trailCount++;
    }

    function renderLoop(timestamp) {
        requestAnimationFrame(renderLoop);

        const dt = (timestamp - lastFrameTime) * 0.001;
        lastFrameTime = timestamp;

        velX = mouseX - currX;
        velY = mouseY - currY;
        currX += velX * 0.4;
        currY += velY * 0.4;
        speed = Math.sqrt(velX * velX + velY * velY);

        rotation += 0.05 + (speed * 0.01) + (isClicking * 0.1);
        if (rotation > PI2) rotation -= PI2;

        if (glitchIntensity > 0.0) {
            glitchIntensity -= 0.04;
            if (glitchIntensity < 0.0) glitchIntensity = 0.0;
        }

        addTrailPoint(currX, currY, velX, velY, speed);

        ctx.clearRect(0, 0, screenWidth, screenHeight);

        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let i = 0;
        while (i < MAX_TRAIL) {
            if (trailLife[i] > 0.0) {
                trailX[i] += trailVx[i];
                trailY[i] += trailVy[i];
                trailLife[i] -= 0.035;

                if (trailLife[i] > 0.0) {
                    let alphaIdx = (trailLife[i] * 100) | 0;
                    if (alphaIdx > 100) alphaIdx = 100;
                    if (alphaIdx < 0) alphaIdx = 0;

                    ctx.fillStyle = (trailColorIdx[i] === 0) ? ALPHA_RED[alphaIdx] : ALPHA_CYAN[alphaIdx];
                    ctx.fillText(GLYPH_ARRAY[trailGlyph[i]], trailX[i], trailY[i]);
                }
            }
            i++;
        }

        i = 0;
        while (i < MAX_PARTICLES) {
            if (partLife[i] > 0) {
                partX[i] += partVx[i];
                partY[i] += partVy[i];
                partLife[i]--;

                let alphaIdx = ((partLife[i] / partMaxLife[i]) * 100) | 0;
                if (alphaIdx > 100) alphaIdx = 100;
                if (alphaIdx < 0) alphaIdx = 0;

                ctx.fillStyle = ALPHA_RED[alphaIdx];
                ctx.fillRect(partX[i] - 1, partY[i] - 1, 3, 3);
            }
            i++;
        }

        renderReticle(currX, currY, speed, isClicking, glitchIntensity, rotation);
    }

    function renderReticle(x, y, spd, clk, glitch, rot) {
        let gx = 0;
        let gy = 0;
        if (glitch > 0.1 || clk === 1) {
            gx = (Math.random() - 0.5) * glitch * 8;
            gy = (Math.random() - 0.5) * glitch * 8;
        }

        ctx.setTransform(1, 0, 0, 1, x + gx, y + gy);

        const radius = 14 + Math.min(spd * 0.2, 12) + (clk * 4) + (glitch * 4);

        ctx.strokeStyle = (glitch > 0.4 || clk === 1) ? COLOR_HUD_CYAN : COLOR_HUD;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, rot, rot + 1.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius, rot + Math.PI, rot + Math.PI + 1.2);
        ctx.stroke();

        ctx.strokeStyle = COLOR_HUD;
        ctx.lineWidth = 1.0;
        const cross = 6 + (clk * 2);
        const gap = 3;

        ctx.beginPath();
        ctx.moveTo(0, -gap);
        ctx.lineTo(0, -gap - cross);
        ctx.moveTo(0, gap);
        ctx.lineTo(0, gap + cross);
        ctx.moveTo(-gap, 0);
        ctx.lineTo(-gap - cross, 0);
        ctx.moveTo(gap, 0);
        ctx.lineTo(gap + cross, 0);
        ctx.stroke();

        ctx.fillStyle = (clk === 1) ? COLOR_HUD_CYAN : COLOR_HUD;
        ctx.fillRect(-1.5, -1.5, 3, 3);

        if (glitch > 0.2 || spd > 15) {
            ctx.strokeStyle = COLOR_HUD_CYAN;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-radius - 4, -4);
            ctx.lineTo(-radius - 4, 4);
            ctx.moveTo(radius + 4, -4);
            ctx.lineTo(radius + 4, 4);
            ctx.stroke();
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

})();
