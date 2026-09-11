// Native Web Audio API Cosmic Sound Synthesizer - Zero external audio files required!

let audioCtx = null;
let droneOsc1 = null;
let droneOsc2 = null;
let gainNode = null;
let filterNode = null;
let isPlaying = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

export function toggleAmbientSound(forceState) {
  initAudio();
  if (!audioCtx) return false;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const targetState = forceState !== undefined ? forceState : !isPlaying;

  if (targetState && !isPlaying) {
    // Start ambient space drone
    try {
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(220, audioCtx.currentTime);

      // Low frequency drone
      droneOsc1 = audioCtx.createOscillator();
      droneOsc1.type = 'sine';
      droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note

      // Detuned harmonic drone
      droneOsc2 = audioCtx.createOscillator();
      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(110.5, audioCtx.currentTime); // A2 slight beating

      droneOsc1.connect(filterNode);
      droneOsc2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      droneOsc1.start();
      droneOsc2.start();
      isPlaying = true;
    } catch (e) {
      console.warn("Audio start error:", e);
    }
  } else if (!targetState && isPlaying) {
    // Stop drone smoothly
    try {
      if (gainNode) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
        setTimeout(() => {
          if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); }
          if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); }
          isPlaying = false;
        }, 1000);
      }
    } catch (e) {
      isPlaying = false;
    }
  }

  return isPlaying;
}

export function playPlanetTransitionChime(freq = 440) {
  initAudio();
  if (!audioCtx || audioCtx.state === 'suspended') return;

  try {
    const osc = audioCtx.createOscillator();
    const chimeGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.3);

    chimeGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

    osc.connect(chimeGain);
    chimeGain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}
