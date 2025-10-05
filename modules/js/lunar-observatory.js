// Lunar Observatory v0.1.0
(function(){
  'use strict';
  console.log('🌙 Lunar Observatory v0.1.0 loading...');

  // Background music is handled by main.js

  // ===================================
  // Sound Toggle System
  // ===================================

  function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    soundToggle.addEventListener('click', () => {
      // Toggle global sound state
      if (window.state) {
        window.state.soundEnabled = !window.state.soundEnabled;
        soundToggle.classList.toggle('muted', !window.state.soundEnabled);
        
        // Update icon
        const soundIcon = soundToggle.querySelector('.sound-icon');
        if (window.state.soundEnabled) {
          soundIcon.textContent = '🔊';
          soundToggle.setAttribute('aria-label', 'Toggle sound on/off');
        } else {
          soundIcon.textContent = '🔇';
          soundToggle.setAttribute('aria-label', 'Sound is muted - click to unmute');
        }
        
        // Control background music
        if (window.state.soundEnabled) {
          if (window.startBackgroundMusic) {
            window.startBackgroundMusic('module');
          }
        } else {
          if (window.stopBackgroundMusic) {
            window.stopBackgroundMusic();
          }
        }
        
        // Save state
        if (window.saveState) {
          window.saveState();
        }
      }
      
      playSound('click');
    });
    
    // Update button state based on global sound state
    if (window.state) {
      soundToggle.classList.toggle('muted', !window.state.soundEnabled);
      
      // Update icon and aria-label
      const soundIcon = soundToggle.querySelector('.sound-icon');
      if (window.state.soundEnabled) {
        soundIcon.textContent = '🔊';
        soundToggle.setAttribute('aria-label', 'Toggle sound on/off');
      } else {
        soundIcon.textContent = '🔇';
        soundToggle.setAttribute('aria-label', 'Sound is muted - click to unmute');
      }
    }
  }

  // Sound playing function
  function playSound(soundName) {
    try {
      const audio = new Audio(`../assets/sounds/${soundName}.wav`);
      audio.volume = 0.3;
      audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
      console.log(`Sound file not found: ${soundName}.wav`);
    }
  }

  // Global click sound system
  function initGlobalClickSound() {
    // Add click sound to all clickable elements
    document.addEventListener('click', (event) => {
      // Only play sound for actual user clicks, not programmatic ones
      if (event.isTrusted) {
        playSound('click');
      }
    });
  }

  const state = {
    moon: null,
    isRotating: false,
    rotationSpeed: 0.4,
    _dirLight: null
  };

  document.addEventListener('DOMContentLoaded', () => {
    initMoon();
    initControls();
    updatePOVBadge();
    // Start background music
    if (window.startBackgroundMusic) {
      window.startBackgroundMusic('module');
    }
    
    // Initialize sound toggle
    initSoundToggle();
    
    initGlobalClickSound();
  });

  function initMoon(){
    const el = document.getElementById('moonViz');
    if(!el){ console.error('moonViz not found'); return; }
    const moon = Globe()(el)
      .globeImageUrl('../globe.gl-master/globe.gl-master/example/moon-landing-sites/lunar_surface.jpg')
      .bumpImageUrl('../globe.gl-master/globe.gl-master/example/moon-landing-sites/lunar_bumpmap.jpg')
      .backgroundImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
      .showAtmosphere(false)
      .width(el.clientWidth)
      .height(el.clientHeight);

    moon.pointOfView({ lat: 10, lng: 0, altitude: 2.2 }, 0);

    state.moon = moon;
    
    // Award trophy for viewing the Moon for 3 seconds
    if (window.ISSperience && window.ISSperience.awardTrophy) {
      setTimeout(() => {
        window.ISSperience.awardTrophy('lunarObservatory', 'Lunar Explorer', 'Explored the Moon for 3 seconds', 1);
      }, 3000); // Award trophy after 3 seconds of viewing
    }
    
    window.addEventListener('resize', () => {
      moon.width(el.clientWidth).height(el.clientHeight);
    });
  }

  function initControls(){
    const rotateBtn = document.getElementById('rotateBtn');
    if(rotateBtn){
      rotateBtn.addEventListener('click', () => {
        state.isRotating = !state.isRotating;
        const controls = state.moon && state.moon.controls ? state.moon.controls() : null;
        if(controls){
          controls.autoRotate = state.isRotating;
          controls.autoRotateSpeed = state.rotationSpeed;
        }
        rotateBtn.classList.toggle('active', state.isRotating);
        if(!state.isRotating){
          // Nudge render to apply immediately
          if(state.moon && state.moon.renderer){ state.moon.renderer().render(state.moon.scene(), state.moon.camera()); }
        }
      });
    }

    // Phase and Apollo-11 controls removed

    const resetViewBtn = document.getElementById('resetViewBtn');
    if(resetViewBtn){
      resetViewBtn.addEventListener('click', () => {
        resetView();
      });
    }
  }

  // Phase & Apollo-11 functions removed

  function resetView(){
    if(!state.moon) return;
    const controls = state.moon.controls ? state.moon.controls() : null;
    if(controls){
      controls.autoRotate = false;
      controls.update();
    }
    state.isRotating = false;
    const btn = document.getElementById('rotateBtn');
    if(btn){ btn.classList.remove('active'); }
    state.moon.pointOfView({ lat: 10, lng: 0, altitude: 2.2 }, 800);
  }

  function updatePOVBadge(){
    if(!state.moon) { setTimeout(updatePOVBadge, 500); return; }
    const pov = state.moon.pointOfView();
    const el = document.getElementById('povValue');
    if(el){
      const latDir = pov.lat >= 0 ? 'N' : 'S';
      const lngDir = pov.lng >= 0 ? 'E' : 'W';
      el.textContent = `${Math.abs(pov.lat).toFixed(1)}°${latDir}, ${Math.abs(pov.lng).toFixed(1)}°${lngDir}`;
    }
    setTimeout(updatePOVBadge, 1000);
  }

})();


