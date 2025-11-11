/**
 * Pottery Sound Effects
 *
 * Uses Web Audio API to generate ceramic and gold sounds
 */

let audioContext: AudioContext | null = null;

// Initialize audio context (lazy)
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      return null;
    }
  }

  return audioContext;
}

/**
 * Play ceramic crack sound (sharp, brittle)
 */
export function playCrackSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Create a short noise burst for crack sound
    const duration = 0.15;
    const now = ctx.currentTime;

    // White noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // High-pass filter for sharp ceramic sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    // Envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connect nodes
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play
    noise.start(now);
    noise.stop(now + duration);
  } catch (error) {
    console.error('Error playing crack sound:', error);
  }
}

/**
 * Play gold filling sound (warm, shimmering)
 */
export function playGoldFillSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.8;
    const now = ctx.currentTime;

    // Create oscillator for shimmer effect
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';

    // Golden frequencies (harmonious)
    oscillator1.frequency.setValueAtTime(880, now); // A5
    oscillator2.frequency.setValueAtTime(1320, now); // E6

    // Slight vibrato
    oscillator1.frequency.linearRampToValueAtTime(920, now + duration);
    oscillator2.frequency.linearRampToValueAtTime(1360, now + duration);

    // Envelope for warm swell
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.2);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.linearRampToValueAtTime(800, now + duration);
    filter.Q.value = 1;

    // Connect
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ctx.destination);

    // Play
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + duration);
    oscillator2.stop(now + duration);
  } catch (error) {
    console.error('Error playing gold fill sound:', error);
  }
}

/**
 * Play pottery selection chime (soft, ceramic clink)
 */
export function playPotterySelectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.5;
    const now = ctx.currentTime;

    // Bell-like tone
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1760, now); // A6

    // Envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connect
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    console.error('Error playing selection sound:', error);
  }
}

/**
 * Play golden seam completion sound (celebratory chime)
 */
export function playGoldenSeamCompleteSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Three-note ascending chime
    const notes = [880, 1100, 1320]; // A5, C#6, E6

    notes.forEach((freq, index) => {
      const startTime = now + (index * 0.15);
      const duration = 0.6;

      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.error('Error playing completion sound:', error);
  }
}

/**
 * Check if sounds are enabled (could be a user preference)
 */
export function areSoundsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check localStorage for user preference
  const pref = localStorage.getItem('kintsugi_sounds_enabled');
  return pref !== 'false'; // Default to enabled
}

/**
 * Toggle sound preference
 */
export function toggleSounds(): boolean {
  if (typeof window === 'undefined') return true;

  const current = areSoundsEnabled();
  localStorage.setItem('kintsugi_sounds_enabled', String(!current));
  return !current;
}
