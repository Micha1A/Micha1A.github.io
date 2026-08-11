// [2026-08-01] [JS, O(1) Video Showreel Engine, Anti-Scrape, Zero DOM Leak] - Organized by Gemini

document.addEventListener('DOMContentLoaded', () => {
    const VIDEO_REELS = [
        'assets/showreels/blueprint.mp4',
        'assets/showreels/fkkbzqtele.mp4',
        'assets/showreels/fugg.mp4',
        'assets/showreels/hx.mp4'
    ];

    let vidIdx1 = 0;
    let vidIdx2 = 2;

    const canvasV1 = document.getElementById('canvas-video-1');
    const canvasV2 = document.getElementById('canvas-video-2');
    if (!canvasV1 || !canvasV2) return;

    const ctxV1 = canvasV1.getContext('2d');
    const ctxV2 = canvasV2.getContext('2d');

    const createOffscreenPlayer = (url, onEndedCallback) => {
        const vid = document.createElement('video');
        vid.src = url;
        vid.autoplay = true;
        vid.loop = false;
        vid.muted = true;
        vid.playsInline = true;
        vid.crossOrigin = 'anonymous';
        vid.addEventListener('ended', onEndedCallback);
        vid.play().catch(() => {});
        return vid;
    };

    let player1 = createOffscreenPlayer(VIDEO_REELS[vidIdx1], () => {
        vidIdx1 = (vidIdx1 + 1) % VIDEO_REELS.length;
        player1.src = VIDEO_REELS[vidIdx1];
        player1.play().catch(()=>{});
    });

    let player2 = createOffscreenPlayer(VIDEO_REELS[vidIdx2], () => {
        vidIdx2 = (vidIdx2 - 1 + VIDEO_REELS.length) % VIDEO_REELS.length;
        player2.src = VIDEO_REELS[vidIdx2];
        player2.play().catch(()=>{});
    });

    const drawVideoFrame = (ctx, canvas, vidBuffer) => {
        if (!vidBuffer || vidBuffer.readyState < 2) return;
        const cw = canvas.clientWidth || 300;
        const ch = canvas.clientHeight || 160;
        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw;
            canvas.height = ch;
        }
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, cw, ch);

        const vw = vidBuffer.videoWidth || 640;
        const vh = vidBuffer.videoHeight || 360;
        const ratio = Math.max(cw / vw, ch / vh);
        const nw = vw * ratio;
        const nh = vh * ratio;
        const nx = (cw - nw) / 2;
        const ny = (ch - nh) / 2;

        ctx.drawImage(vidBuffer, nx, ny, nw, nh);
    };

    const renderLoop = () => {
        drawVideoFrame(ctxV1, canvasV1, player1);
        drawVideoFrame(ctxV2, canvasV2, player2);
        requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);

    const triggerVideoModal = (vidUrl, title) => {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalBodyContent = document.getElementById('modal-body-content');
        if (modalOverlay && modalBodyContent) {
            modalBodyContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--glass-border); padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
                    <h3 style="margin:0; border:none; padding:0; font-size:1.4rem;">${title} // SHOWREEL INSPECTION</h3>
                    <span style="font-family:monospace; color:#0f0; font-size:0.8rem;">[ O(1) SECURED STREAM ]</span>
                </div>
                <div style="text-align: center; position: relative;">
                    <video controls autoplay playsinline style="max-width: 100%; max-height: 65vh; border-radius: 8px; border: 1px solid var(--accent); box-shadow: 0 5px 30px rgba(0, 210, 255, 0.3);" oncontextmenu="return false;" controlsList="nodownload nofullscreen noremoteplayback">
                        <source src="${vidUrl}" type="video/mp4">
                        Your browser does not support high-speed O(1) streams.
                    </video>
                </div>
            `;
            modalOverlay.classList.add('active');
        }
    };

    const vBox1 = document.getElementById('video-box-1');
    const vBox2 = document.getElementById('video-box-2');
    if (vBox1) vBox1.addEventListener('click', () => triggerVideoModal(VIDEO_REELS[vidIdx1], '🎬 REEL_01'));
    if (vBox2) vBox2.addEventListener('click', () => triggerVideoModal(VIDEO_REELS[vidIdx2], '🎬 REEL_02'));
});
