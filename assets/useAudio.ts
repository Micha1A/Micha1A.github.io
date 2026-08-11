// ============================================================
// 4u4me  |  useAudio v3 – Cyberpunk Connect-4 Audio Engine
// Micha - g.dev/avx
//
// Sound palette:
//   drop        = sub-bass thud + metallic click (column selected)
//   fall-impact = MASSIVE kick + distorted crunch + Z-bounce sync
//   win         = Shepard swell + euphoric chord cascade (screen-dominating)
//   thinking    = pink noise LFO (AI calculating)
//   ambient     = 4-osc drone
//   anticipation = anticipation sweep (hovering win cell)
// ============================================================
import { useCallback, useEffect, useRef } from 'react';
import { useFractalStore } from '../store/fractalStore';
import { useDopamineSoul } from '../game/DopamineSoul';

// ── Anticipation Sweep (exported so MicroCell can use it) ─
let antOsc: OscillatorNode | null    = null;
let antFilter: BiquadFilterNode | null = null;
let antGain: GainNode | null          = null;

export function startAnticipationSweep() {
  stopAnticipationSweep();
  const ctx = getCtx();
  const out = getMaster();
  const now = ctx.currentTime;

  antOsc = ctx.createOscillator();
  antOsc.type = 'sine';
  antOsc.frequency.value = 140;

  antFilter = ctx.createBiquadFilter();
  antFilter.type = 'lowpass';
  antFilter.frequency.setValueAtTime(180, now);
  antFilter.frequency.exponentialRampToValueAtTime(1800, now + 1.4);
  antFilter.Q.value = 10;

  antGain = ctx.createGain();
  antGain.gain.setValueAtTime(0, now);
  antGain.gain.linearRampToValueAtTime(0.22, now + 0.7);

  antOsc.connect(antFilter);
  antFilter.connect(antGain);
  antGain.connect(out);
  antOsc.start(now);
}

export function stopAnticipationSweep() {
  if (!antGain) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  try {
    antGain.gain.cancelScheduledValues(now);
    antGain.gain.setValueAtTime(antGain.gain.value, now);
    antGain.gain.linearRampToValueAtTime(0, now + 0.12);
    const o = antOsc;
    setTimeout(() => { try { o?.stop(); } catch { /**/ } }, 180);
  } catch { /**/ }
  antOsc = null; antFilter = null; antGain = null;
}

function impulseResponse(ctx: AudioContext, duration: number, decay: number) {
  const length = ctx.sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
    }
  }
  return impulse;
}

// ── Shared AudioContext ───────────────────────────────────
let sharedCtx: AudioContext | null = null;
let masterOut: GainNode | null     = null;
export let dryNode: GainNode | null = null;
export let wetNode: GainNode | null = null;
export let bassFilter: BiquadFilterNode | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx) {
    sharedCtx = new AudioContext();
    masterOut  = sharedCtx.createGain();
    masterOut.gain.value = 0.75;
    
    bassFilter = sharedCtx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 150;
    bassFilter.gain.value = 0;
    
    const convolver = sharedCtx.createConvolver();
    convolver.buffer = impulseResponse(sharedCtx, 3.5, 3.0); // Big hall
    
    dryNode = sharedCtx.createGain();
    wetNode = sharedCtx.createGain();
    dryNode.gain.value = 0.4;
    wetNode.gain.value = 0.8;
    
    masterOut.connect(bassFilter);
    bassFilter.connect(dryNode);
    bassFilter.connect(convolver);
    convolver.connect(wetNode);
    
    dryNode.connect(sharedCtx.destination);
    wetNode.connect(sharedCtx.destination);
  }
  if (sharedCtx.state === 'suspended') sharedCtx.resume();
  return sharedCtx;
}
function getMaster(): GainNode { getCtx(); return masterOut!; }

// ── Dopamine pitch modifier ────────────────────────────────
function pm(dopamine: number): number { return 0.88 + dopamine * 0.24; }

// ── WaveShaper glitch distortion ─────────────────────────
function makeGlitch(ctx: AudioContext, amount: number): WaveShaperNode {
  const ws = ctx.createWaveShaper();
  const n  = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  ws.curve = curve;
  ws.oversample = '4x';
  return ws;
}

// ── Pink noise buffer ─────────────────────────────────────
function makePinkNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d   = buf.getChannelData(0);
  let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522; b5 =-0.7616 *b5 - w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.12;
    b6 = w * 0.115926;
  }
  return buf;
}

// ── C-Major Snap ──────────────────────────────────────────
const cMajorFreqs = [
  261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, // C4 to C5
  587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50,        // D5 to C6
  1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53            // D6 to B6
];
function snapToCMajor(freq: number) {
  return cMajorFreqs.reduce((prev, curr) => Math.abs(curr - freq) < Math.abs(prev - freq) ? curr : prev);
}

// ── DROP – bright C-Major synth (X) / square chirp (O) ─────────────────
function synthDrop(dopamine: number, player: 'X' | 'O') {
  const ctx = getCtx();
  const out = getMaster();
  const pitchMatrix = 0.95 + Math.random() * 0.10;
  const p   = pm(dopamine) * pitchMatrix;
  const now = ctx.currentTime;

  const osc  = ctx.createOscillator();
  const oscG = ctx.createGain();

  if (player === 'X') {
    // C-Major Drop for X (Restricted to 250-2000 Hz)
    osc.type = 'sine';
    const startFreq = snapToCMajor(523.25 * p);
    const endFreq   = snapToCMajor(261.63 * p);
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.28);
    oscG.gain.setValueAtTime(0.65, now);
    oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  } else {
    // Square-wave chirp for O (C-Major)
    osc.type = 'square';
    const startFreq = snapToCMajor(659.25 * p);
    const endFreq   = snapToCMajor(329.63 * p);
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.2);
    oscG.gain.setValueAtTime(0.25, now);
    oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  }

  osc.connect(oscG);

  // WaveShaper glitch when dopamine drops below 38%
  let routeEnd = oscG as AudioNode;
  if (dopamine < 0.38) {
    const ws = makeGlitch(ctx, 40);
    oscG.connect(ws);
    routeEnd = ws;
  }

  // Phase 10.2: Chorus / Detune when hover jitter is high (uncertainty)
  // jitter passed from hook via closure — if not available this is a no-op
  routeEnd.connect(out);

  // Metallic click
  const clickLen = Math.floor(ctx.sampleRate * 0.06);
  const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
  const cd       = clickBuf.getChannelData(0);
  for (let i = 0; i < clickLen; i++) cd[i] = (Math.random()*2-1) * Math.max(0, 1 - i/2000);
  const clickSrc = ctx.createBufferSource();
  clickSrc.buffer = clickBuf;
  const bpf  = ctx.createBiquadFilter();
  bpf.type   = 'bandpass';
  bpf.frequency.value = 2800 * p;
  bpf.Q.value = 3.2;
  const clickG = ctx.createGain();
  clickG.gain.setValueAtTime(0.62, now);
  clickG.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

  clickSrc.connect(bpf); bpf.connect(clickG); clickG.connect(out);

  osc.start(now); osc.stop(now + 0.4);
  clickSrc.start(now); clickSrc.stop(now + 0.07);
}

// ── FEVER DROP – aggressive 13Hz sawtooth pulse ─────────────
// for Phase 9 fever-mode: replaces normal drop when feverMode is on
function synthFeverDrop(dopamine: number) {
  const ctx = getCtx();
  const out = getMaster();
  const p = pm(dopamine);
  const now = ctx.currentTime;

  // Sawtooth aggressive burst
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  const startF = snapToCMajor(880 * p); // A5
  const endF   = snapToCMajor(440 * p); // A4
  osc.frequency.setValueAtTime(startF, now);
  osc.frequency.exponentialRampToValueAtTime(endF, now + 0.18);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.55, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  // Distort through wave shaper for grittiness
  const ws = makeGlitch(ctx, 25);
  osc.connect(g); g.connect(ws); ws.connect(out);
  osc.start(now); osc.stop(now + 0.25);

  // High-freq tick burst for kinetic feel
  for (let i = 0; i < 3; i++) {
    const t = now + i * 0.04;
    const tick = ctx.createOscillator();
    tick.type = 'square';
    tick.frequency.value = 1760 * p + Math.random() * 400;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0.08, t);
    tg.gain.exponentialRampToValueAtTime(0.001, t + 0.038);
    tick.connect(tg); tg.connect(out);
    tick.start(t); tick.stop(t + 0.04);
  }
}

// ── CHORUS DETUNE helper ──────────────────────────────
// Used when jitter > 0.5 to signal uncertainty/hesitation
function synthDropWithChorus(dopamine: number, player: 'X' | 'O') {
  // Play base drop
  synthDrop(dopamine, player);

  // Add subtle detuned chorus voices
  const ctx = getCtx();
  const out = getMaster();
  const p   = pm(dopamine);
  const now = ctx.currentTime;
  const detuneAmounts = [-12, 14]; // cents
  for (const cents of detuneAmounts) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.detune.value = cents;
    osc.frequency.value = snapToCMajor(523.25 * p);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(g); g.connect(out);
    osc.start(now); osc.stop(now + 0.32);
  }
}

// ── FALL IMPACT – massive kick + crunch + distortion ────────────
function synthFallImpact(dopamine: number) {
  const ctx = getCtx();
  const out = getMaster();
  const p   = pm(dopamine);
  const now = ctx.currentTime;

  // Kick body — deep sine sweep
  const kick = ctx.createOscillator();
  kick.type  = 'sine';
  kick.frequency.setValueAtTime(140 * p, now);
  kick.frequency.exponentialRampToValueAtTime(28 * p, now + 0.18);
  const kickG = ctx.createGain();
  kickG.gain.setValueAtTime(1.4, now);
  kickG.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  // Distortion on kick
  const ws = makeGlitch(ctx, 18 + dopamine * 22);
  kick.connect(kickG); kickG.connect(ws); ws.connect(out);
  kick.start(now); kick.stop(now + 0.5);

  // Noise crunch burst
  const crunchLen = Math.floor(ctx.sampleRate * 0.22);
  const crunchBuf = ctx.createBuffer(1, crunchLen, ctx.sampleRate);
  const cd        = crunchBuf.getChannelData(0);
  for (let i = 0; i < crunchLen; i++) cd[i] = (Math.random()*2-1) * Math.pow(1 - i/crunchLen, 1.6);
  const crunchSrc = ctx.createBufferSource();
  crunchSrc.buffer = crunchBuf;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1200;
  const crunchG = ctx.createGain(); crunchG.gain.setValueAtTime(1.2, now);
  crunchG.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
  crunchSrc.connect(lp); lp.connect(crunchG); crunchG.connect(out);
  crunchSrc.start(now); crunchSrc.stop(now + 0.25);

  // Sub-harmonic rumble
  const sub = ctx.createOscillator();
  sub.type  = 'sine';
  sub.frequency.setValueAtTime(38 * p, now);
  sub.frequency.exponentialRampToValueAtTime(12 * p, now + 0.6);
  const subG = ctx.createGain();
  subG.gain.setValueAtTime(0.9, now);
  subG.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
  sub.connect(subG); subG.connect(out);
  sub.start(now); sub.stop(now + 0.7);
}

// ── WIN – Shepard swell + euphoric chord cascade ──────────
function synthWin4(dopamine: number) {
  const ctx = getCtx();
  const out = getMaster();
  const p   = pm(dopamine);
  const now = ctx.currentTime;

  // Shepard rising layers (6 octave-stacked)
  for (let layer = 0; layer < 6; layer++) {
    const base = 82 * Math.pow(2, layer / 6) * p;
    const osc  = ctx.createOscillator();
    osc.type   = layer % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 2.2, now + 2.4);
    const env    = ctx.createGain();
    const envAmt = Math.sin((layer / 6) * Math.PI) * 0.38;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(envAmt, now + 0.32);
    env.gain.setValueAtTime(envAmt, now + 1.6);
    env.gain.linearRampToValueAtTime(0, now + 2.6);
    osc.connect(env); env.connect(out);
    osc.start(now); osc.stop(now + 2.7);
  }

  // Euphoric chord cascade: C-Maj → E-Maj → G-Maj stagger
  const chordFreqs = [
    261.63, 329.63, 392.0, 523.25,  // C5 Major
    330.0,  440.0,  523.25, 659.25, // E5 Major
    392.0,  523.25, 659.25, 783.99, // G5 Major
  ];
  chordFreqs.forEach((freq, i) => {
    const t   = now + 0.05 * i;
    const osc = ctx.createOscillator();
    osc.type  = 'sine';
    osc.frequency.value = freq * p;
    const g   = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.24, t + 0.055);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    osc.connect(g); g.connect(out);
    osc.start(t); osc.stop(t + 1.2);
  });

  // Impact hit
  const impLen = Math.floor(ctx.sampleRate * 0.18);
  const impBuf = ctx.createBuffer(1, impLen, ctx.sampleRate);
  const id     = impBuf.getChannelData(0);
  for (let i = 0; i < impLen; i++) id[i] = (Math.random()*2-1) * Math.pow(1-i/impLen, 2);
  const impSrc = ctx.createBufferSource();
  impSrc.buffer = impBuf;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320;
  const ig = ctx.createGain(); ig.gain.value = 1.1;
  impSrc.connect(lp); lp.connect(ig); ig.connect(out);
  impSrc.start(now);
}

// ── NEAR-MISS – rising tension that abruptly stops ────────
function synthNearMiss(dopamine: number) {
  const ctx = getCtx();
  const out = getMaster();
  const now = ctx.currentTime;
  const p = pm(dopamine);
  
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(261.63 * p, now); // C4
  osc.frequency.exponentialRampToValueAtTime(1046.50 * p, now + 1.2); // Up to C6
  
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.3, now);
  // abrupt emotional cut
  g.gain.setValueAtTime(0.3, now + 0.85); 
  g.gain.linearRampToValueAtTime(0.001, now + 0.86);
  
  osc.connect(g); g.connect(out);
  osc.start(now); osc.stop(now + 0.9);
}

// ── LDW (LOSS DISGUISED AS WIN) – fat C-Maj + coin rain ───
function synthLDW(dopamine: number) {
  const ctx = getCtx();
  const out = getMaster();
  const now = ctx.currentTime;
  const p = pm(dopamine);

  // Fat C-Major Chord
  [261.63, 329.63, 392.00, 523.25].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq * p;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.18, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(g); g.connect(out);
    osc.start(now); osc.stop(now + 1.5);
  });

  // Coin Rain
  for (let c=0; c<6; c++) {
    const t = now + c * 0.14;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + Math.random()*400, t);
    osc.frequency.exponentialRampToValueAtTime(2200, t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g); g.connect(out);
    osc.start(t); osc.stop(t + 0.2);
  }
}

// ── Thinking noise loop ───────────────────────────────────
let thinkSrc:  AudioBufferSourceNode | null = null;
let thinkGain: GainNode | null              = null;
let thinkLfo:  OscillatorNode | null        = null;

export function startThinkingAudio() {
  stopThinkingAudio();
  const ctx = getCtx();
  const out = getMaster();

  const pinkBuf = makePinkNoise(ctx, 3.5);
  const src     = ctx.createBufferSource();
  src.buffer    = pinkBuf;
  src.loop      = true;

  const filter        = ctx.createBiquadFilter();
  filter.type         = 'bandpass';
  filter.frequency.value = 720;
  filter.Q.value      = 7;

  const lfo      = ctx.createOscillator();
  lfo.type       = 'sine';
  lfo.frequency.value = 0.32;
  const lfoGain  = ctx.createGain();
  lfoGain.gain.value = 380;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gNode    = ctx.createGain();
  gNode.gain.setValueAtTime(0, ctx.currentTime);
  gNode.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 1.6);

  src.connect(filter);
  filter.connect(gNode);
  gNode.connect(out);

  lfo.start();
  src.start();
  thinkSrc  = src;
  thinkGain = gNode;
  thinkLfo  = lfo;
}

export function stopThinkingAudio() {
  if (!thinkSrc) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  try {
    thinkGain?.gain.setValueAtTime(thinkGain.gain.value, now);
    thinkGain?.gain.linearRampToValueAtTime(0, now + 0.4);
    const src = thinkSrc;
    const lfo = thinkLfo;
    setTimeout(() => {
      try { src.stop(); } catch { /**/ }
      try { lfo?.stop(); } catch { /**/ }
    }, 500);
  } catch { /**/ }
  thinkSrc = null; thinkGain = null; thinkLfo = null;
}

// ── Tooltip spawn pop-click ───────────────────────────────
export function playTooltipSpawn() {
  const ctx = getCtx();
  const out = getMaster();
  const now = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * 0.032);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 2.6);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp  = ctx.createBiquadFilter();
  hp.type   = 'highpass';
  hp.frequency.value = 5200;
  const g   = ctx.createGain();
  g.gain.value = 0.42;
  src.connect(hp); hp.connect(g); g.connect(out);
  src.start(now);
}

// ══════════════════════════════════════════════════════════
// HOOK
// ══════════════════════════════════════════════════════════
export function useAudio() {
  const settings       = useFractalStore(s => s.settings);
  const lastSoundEvent = useFractalStore(s => s.lastSoundEvent);
  const aiThinking     = useFractalStore(s => s.aiThinking);
  const playerProfile  = useFractalStore(s => s.playerProfile);
  const phase          = useFractalStore(s => s.phase);
  const currentPlayer  = useFractalStore(s => s.gameState.currentPlayer);
  const feverMode      = useFractalStore(s => s.feverMode);
  const hoverJitter    = useFractalStore(s => s.hoverJitter);
  const cells          = useFractalStore(s => s.gameState.cells);

  const lastEventIdRef = useRef<string | null>(null);
  const ambientRef     = useRef<{ masterGain: GainNode; oscs: OscillatorNode[] } | null>(null);

  const dopamine = playerProfile.dopamineCurve;

  // ── Phase 12: Spatial Audio Claustrophobia ────────────────
  useEffect(() => {
    let tokensPlaced = 0;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (cells[r][c] !== null) tokensPlaced++;
      }
    }
    
    if (dryNode && wetNode && bassFilter && sharedCtx) {
       const ratio = tokensPlaced / 42; 
       const wetLvl = 0.8 * Math.pow(1 - ratio, 2); 
       const dryLvl = 0.4 + (0.6 * ratio);
       const bassLvl = 6 * ratio; // 0 to 6 dB boost
       
       const now = sharedCtx.currentTime;
       wetNode.gain.setTargetAtTime(wetLvl, now, 0.2);
       dryNode.gain.setTargetAtTime(dryLvl, now, 0.2);
       bassFilter.gain.setTargetAtTime(bassLvl, now, 0.2);
    }
  }, [cells]);

  // ── Sound events ─────────────────────────────────────────
  useEffect(() => {
    if (!lastSoundEvent || lastSoundEvent.id === lastEventIdRef.current) return;
    lastEventIdRef.current = lastSoundEvent.id;
    if (!settings.soundEnabled) return;

    switch (lastSoundEvent.type) {
      case 'drop':
      case 'x':
      case 'o':
        // Phase 9: Fever mode uses aggressive sawtooth
        if (feverMode) { synthFeverDrop(dopamine); break; }
        // Phase 10.2: High jitter = chorus/detune (uncertain player)
        if (hoverJitter > 0.5) { synthDropWithChorus(dopamine, currentPlayer); break; }
        synthDrop(dopamine, currentPlayer);
        break;
      case 'fall-impact':
      case 'lock':
        synthFallImpact(dopamine);
        break;
      case 'win':
      case 'micro-win':
        synthWin4(dopamine);
        break;
      case 'near-miss':
        synthNearMiss(dopamine);
        break;
      case 'ldw':
        synthLDW(dopamine);
        break;
    }
  }, [lastSoundEvent, settings.soundEnabled, dopamine, phase, feverMode, hoverJitter]);

  // ── Thinking audio loop ───────────────────────────────────
  useEffect(() => {
    if (!settings.soundEnabled) { stopThinkingAudio(); return; }
    if (aiThinking) startThinkingAudio();
    else            stopThinkingAudio();
  }, [aiThinking, settings.soundEnabled]);

  // ── Anticipation Sweep ────────────────────────────────────
  const hoveringWin = useDopamineSoul(s => s.hoveringWin);
  useEffect(() => {
    if (!settings.soundEnabled) { stopAnticipationSweep(); return; }
    if (hoveringWin) startAnticipationSweep();
    else             stopAnticipationSweep();
  }, [hoveringWin, settings.soundEnabled]);

  // ── Ambient drone ─────────────────────────────────────────
  const startAmbient = useCallback(() => {
    if (ambientRef.current) return;
    const ctx        = getCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.032, ctx.currentTime + 4);
    masterGain.connect(ctx.destination);
    const oscs: OscillatorNode[] = [44, 66, 88, 132].map((freq, i) => {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.06 + i * 0.035;
      lfoG.gain.value = freq * 0.008;
      lfo.connect(lfoG); lfoG.connect(osc.frequency);
      osc.type = 'sine'; osc.frequency.value = freq;
      osc.connect(masterGain); osc.start(); lfo.start();
      return osc;
    });
    ambientRef.current = { masterGain, oscs };
  }, []);

  const stopAmbient = useCallback(() => {
    if (!ambientRef.current) return;
    const { masterGain, oscs } = ambientRef.current;
    const ctx = getCtx();
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
    setTimeout(() => oscs.forEach(o => { try { o.stop(); } catch { /**/ } }), 2500);
    ambientRef.current = null;
  }, []);

  useEffect(() => {
    if (settings.ambientEnabled) startAmbient(); else stopAmbient();
  }, [settings.ambientEnabled, startAmbient, stopAmbient]);

  useEffect(() => {
    const h = () => { if (settings.ambientEnabled) startAmbient(); };
    document.addEventListener('pointerdown', h, { once: true });
    return () => document.removeEventListener('pointerdown', h);
  }, [settings.ambientEnabled, startAmbient]);
}
