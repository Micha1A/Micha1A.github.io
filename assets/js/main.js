// [2026-08-01] [JS, O(1) Engine, Easter Egg] - Organized by Gemini

document.addEventListener('DOMContentLoaded', () => {
    let clickCount = 0;
    let clickTimer = null;
    let keySequence = '';

    const avatar = document.getElementById('avatar-trigger');
    const toast = document.getElementById('terminal-toast');
    const content = document.getElementById('terminal-content');

    const activateConsole = () => {
        toast.classList.add('active');
        content.innerHTML = `
            > Booting absolute zero-allocation kernel...<br>
            > CPU Caches: FLUSHED<br>
            > Complexity: O(1)<br>
            > State: BARE-METAL SPEED UNLEASHED<br>
            > Telemetry: 100% efficiency<br>
            > AI Clusters: SYNCHRONIZED
        `;
        setTimeout(() => toast.classList.remove('active'), 5000);
    };

    if (avatar) {
        avatar.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 1) {
                clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
            } else if (clickCount >= 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                activateConsole();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();

        const key = e.key.toLowerCase();
        if (key === 'o' || key === '1') {
            keySequence += key;
            if (keySequence.includes('o1')) {
                activateConsole();
                keySequence = '';
            }
            if (keySequence.length > 2) keySequence = keySequence.substring(keySequence.length - 2);
        } else {
            keySequence = '';
        }
    });

    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalBodyContent = document.getElementById('modal-body-content');

    const modalData = {
        'modal-gcp': `
            <h3><img src="assets/stitch/security_badge.svg" style="width:40px;height:40px;" alt="Google Cloud Security Specialist Badge"> Google Cloud Expertise</h3>
            <ul>
                <li><strong>Google Cloud Security:</strong> Cybersecurity Certificate (ACE College Credit Endorsement)</li>
                <li><strong>Google AI & MLOps:</strong> Vertex AI Infrastructure, Gemini for DevOps & Security, RAG & Vector Search</li>
                <li><strong>Google Cloud AI School:</strong> GenAI & AgenticAI Architecture</li>
                <li><strong>Google AI Education:</strong> Google AI for Higher Education</li>
            </ul>
        `,
        'modal-badges': `
            <h3><img src="assets/stitch/ai_badge.svg" style="width:40px;height:40px;" alt="Verified Enterprise AI Specialist Badge"> Verified Creds</h3>
            <ul>
                <li><strong>Microsoft Azure AI:</strong> AI Agents & GenAI Apps, NLP & AI Workload Security</li>
                <li><strong>Enterprise Cyber Threat & ML:</strong> IBM Cybersecurity & ML, Cisco Cyber Threat Management</li>
                <li><strong>Modern AI Data Systems:</strong> MongoDB AI Agents & RAG Architecture</li>
                <li><strong>Network Security:</strong> <a href="https://www.credential.net/1e7b8bfe-fac0-436e-a787-2de6aa8f55ef" target="_blank" rel="noopener noreferrer" style="color:#ffffff; text-decoration:underline; text-decoration-style:dashed; text-underline-offset:3px;">ICSI | CNSS Certified Network Security Specialist</a></li>
            </ul>
        `,
        'modal-baremetal': `
            <h3><img src="assets/stitch/baremetal_badge.svg" style="width:40px;height:40px;" alt="Bare-Metal &amp; Audio Mastery Specialist Badge (Systemsoftware-Entwicklung, ONNX, WebNN)"> Bare-Metal &amp; Audio Mastery</h3>
            <ul>
                <li>Zero-Allocation O(1) Audio &amp; Digital Signal Processing &#9889; <a href="https://micha1a.gitlab.io/" target="_blank" rel="noopener noreferrer" style="color: #4CAF50; text-decoration: none; font-weight: bold; letter-spacing: 0.5px;">[ EXPLORE QUANTUM SYNTH LAB ]</a></li>
                <li>Assembly, Zig, Rust, WebAssembly &amp; High-Performance Computing</li>
                <li>Neural Network Interfaces: ONNX, WebNN &amp; WebGPU &#127919; <a href="https://hdnxx.gitlab.io" target="_blank" rel="noopener noreferrer" style="color: #FFC107; text-decoration: none; font-weight: bold; letter-spacing: 0.5px;">[ BEYOND-EDGE | LIVE UX/UI DEMO ]</a></li>
                <li>Certified Audiovisual Media Designer (IHK) &mdash; Field: Studio Production &amp; Outside Broadcasting</li>
                <li>Certified Event Management (IHK)</li>
            </ul>
        `
    };

    const openModal = (id) => {
        if (modalData[id] && modalBodyContent && modalOverlay) {
            modalBodyContent.innerHTML = modalData[id];
            modalOverlay.classList.add('active');
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            if (modalBodyContent) modalBodyContent.innerHTML = '';
        }
    };

    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const modalId = tile.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
});
