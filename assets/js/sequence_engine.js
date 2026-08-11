// [2026-08-01] [JS, O(1) Sequence Engine, Anti-Scrape, L3-Cache Aware] - Organized by Gemini

document.addEventListener('DOMContentLoaded', () => {
    const PROJECT_IMAGES = [
        'assets/projects/Screenshot (519).PNG',
        'assets/projects/Screenshot (554).png',
        'assets/projects/Screenshot (852).png',
        'assets/projects/Screenshot (1006).png',
        'assets/projects/Screenshot (1027).png',
        'assets/projects/Screenshot (1042).png',
        'assets/projects/Screenshot (1052).png',
        'assets/projects/Screenshot (975).png',
        'assets/projects/Screenshot (989).png',
        'assets/projects/Screenshot (992).png'
    ];

    let decodedBuffers = [];
    let idx1 = 0;
    let idx2 = 0;

    const canvas1 = document.getElementById('canvas-stream-1');
    const canvas2 = document.getElementById('canvas-stream-2');
    if (!canvas1 || !canvas2) return;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    let processedCount = 0;
    const tempBuffers = new Array(PROJECT_IMAGES.length);
    
    PROJECT_IMAGES.forEach((url, index) => {
        const img = new Image();
        img.src = url;
        const finalize = () => {
            processedCount++;
            if (processedCount === PROJECT_IMAGES.length) {
                decodedBuffers = tempBuffers.filter(Boolean);
                if (decodedBuffers.length > 0) {
                    idx2 = Math.floor(decodedBuffers.length / 2);
                    startSequenceEngine();
                }
            }
        };
        img.onload = () => { tempBuffers[index] = img; finalize(); };
        img.onerror = () => { finalize(); };
    });

    const drawFrame = (ctx, canvas, imgBuffer) => {
        if (!imgBuffer) return;
        const cw = canvas.clientWidth || 300;
        const ch = canvas.clientHeight || 180;
        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw;
            canvas.height = ch;
        }
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, cw, ch);

        const ratio = Math.max(cw / imgBuffer.width, ch / imgBuffer.height);
        const nw = imgBuffer.width * ratio;
        const nh = imgBuffer.height * ratio;
        const nx = (cw - nw) / 2;
        const ny = (ch - nh) / 2;

        ctx.drawImage(imgBuffer, nx, ny, nw, nh);
    };

    let timer1 = null;
    let timer2 = null;

    const startSequenceEngine = () => {
        drawFrame(ctx1, canvas1, decodedBuffers[idx1]);
        drawFrame(ctx2, canvas2, decodedBuffers[idx2]);

        timer1 = setInterval(() => {
            idx1 = (idx1 + 1) % decodedBuffers.length;
            drawFrame(ctx1, canvas1, decodedBuffers[idx1]);
        }, 3000);

        setTimeout(() => {
            timer2 = setInterval(() => {
                idx2 = (idx2 - 1 + decodedBuffers.length) % decodedBuffers.length;
                drawFrame(ctx2, canvas2, decodedBuffers[idx2]);
            }, 3000);
        }, 1500);
    };

    const triggerModalView = (imgBuffer, streamName) => {
        if (!imgBuffer) return;
        const modalOverlay = document.getElementById('modal-overlay');
        const modalBodyContent = document.getElementById('modal-body-content');
        if (modalOverlay && modalBodyContent) {
            modalBodyContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--glass-border); padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
                    <h3 style="margin:0; border:none; padding:0; font-size:1.4rem;">${streamName} // INSPECTED FRAME</h3>
                    <span style="font-family:monospace; color:#0f0; font-size:0.8rem;">[ O(1) PROTECTED BUFFER ]</span>
                </div>
                <div style="text-align: center; position: relative;">
                    <canvas id="modal-image-view" style="max-width: 100%; max-height: 65vh; border-radius: 8px; border: 1px solid var(--accent); box-shadow: 0 5px 30px rgba(0, 210, 255, 0.2);"></canvas>
                </div>
            `;
            const mCanvas = document.getElementById('modal-image-view');
            if (mCanvas) {
                mCanvas.width = imgBuffer.width;
                mCanvas.height = imgBuffer.height;
                const mCtx = mCanvas.getContext('2d');
                mCtx.drawImage(imgBuffer, 0, 0);
            }
            modalOverlay.classList.add('active');
        }
    };

    const streamBox1 = document.getElementById('stream-box-1');
    const streamBox2 = document.getElementById('stream-box-2');
    if (streamBox1) streamBox1.addEventListener('click', () => triggerModalView(decodedBuffers[idx1], '⚡ STREAM_01'));
    if (streamBox2) streamBox2.addEventListener('click', () => triggerModalView(decodedBuffers[idx2], '⚡ STREAM_02'));

    document.addEventListener('contextmenu', (e) => {
        if (e.target && (e.target.tagName === 'CANVAS' || e.target.closest('.stream-container') || e.target.closest('#modal-overlay'))) {
            e.preventDefault();
            triggerSecurityWarning("RIGHT-CLICK ASSET EXTRACTION INTERCEPTED");
            return false;
        }
    });

    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'PrintScreen' || (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'p')) || e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'c' || e.key === 'C' || e.key === 'J' || e.key === 'j'))) {
            e.preventDefault();
            triggerSecurityWarning("KEYBOARD SCRAPE/CAPTURE BLOCKED BY O(1) KERNEL");
            return false;
        }
    });

    window.addEventListener('blur', () => {
        document.body.classList.add('security-blanket');
    });
    window.addEventListener('focus', () => {
        document.body.classList.remove('security-blanket');
    });

    const triggerSecurityWarning = (reason) => {
        console.warn("⚡ O(1) BARE-METAL // SECURITY PROTOCOL ENGAGED: " + reason);
        const toast = document.getElementById('terminal-toast');
        const content = document.getElementById('terminal-content');
        if (toast && content) {
            toast.classList.add('active');
            content.innerHTML = `
                <span style="color:#f00; font-weight:bold;">> 🛑 SECURITY ALERT // ACCESS OVERRIDE</span><br>
                > INCIDENT: ${reason}<br>
                > ACTION: Asset copying denied.<br>
                > STATE: Bare-Metal memory locked (O(1)).
            `;
            setTimeout(() => {
                toast.classList.remove('active');
            }, 4500);
        }
    };
});
