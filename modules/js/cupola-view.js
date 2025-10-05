// ===================================
// Cupola View Module - ISS Window Experience
// Version: 1.0.4 - Fix: Auto-rotate now pauses correctly
// ===================================

(function() {
    'use strict';
    
    console.log('🪟 Cupola View Module v1.0.4 loading... (Auto-rotate pause fix)');

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

    // State
    const state = {
        globe: null,
        isRotating: false,
        isDayNight: false,
        showClouds: false,
        rotationSpeed: 0.5,
        currentLat: 0,
        currentLng: 0,
        cloudsMesh: null,
        cloudsAnimId: null
    };

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🌍 Initializing Globe...');
        initGlobe();
        initControls();
        updateLocationDisplay();
        initGlobalClickSound();
        // Start background music
        if (window.startBackgroundMusic) {
            window.startBackgroundMusic('module');
        }
        
        // Initialize sound toggle
        initSoundToggle();
        
        playSound('startup');
    });

    // ===================================
    // Globe Initialization
    // ===================================

    function initGlobe() {
        const globeContainer = document.getElementById('globeViz');
        if (!globeContainer) {
            console.error('Globe container not found!');
            return;
        }

        // Initialize Globe.gl
        state.globe = Globe()(globeContainer)
            .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
            .showAtmosphere(true)
            .atmosphereColor('#00D9FF')
            .atmosphereAltitude(0.15)
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight);

        // Set initial view (zoomed in for realistic ISS view)
        state.globe.pointOfView({ 
            lat: 20, 
            lng: 0, 
            altitude: 0.5  // Even closer for more realistic ISS view
        }, 0);

        // Handle window resize
        window.addEventListener('resize', () => {
            if (state.globe) {
                state.globe
                    .width(globeContainer.clientWidth)
                    .height(globeContainer.clientHeight);
            }
        });

        console.log('✅ Globe initialized successfully!');
        
        // Award trophy for viewing Earth from Cupola for 3 seconds
        if (window.ISSperience && window.ISSperience.awardTrophy) {
            setTimeout(() => {
                window.ISSperience.awardTrophy('cupolaViewer', 'Earth Observer', 'Viewed Earth from the Cupola for 3 seconds', 1);
            }, 3000); // Award trophy after 3 seconds of viewing
        }
    }

    // ===================================
    // Controls
    // ===================================

    function initControls() {
        // Auto-rotate button
        const rotateBtn = document.getElementById('rotateBtn');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                toggleRotation();
                playSound('click');
            });
        }

        // Day/Night button
        const dayNightBtn = document.getElementById('dayNightBtn');
        if (dayNightBtn) {
            dayNightBtn.addEventListener('click', () => {
                toggleDayNight();
                playSound('click');
            });
        }

        // Clouds button
        const cloudsBtn = document.getElementById('cloudsBtn');
        if (cloudsBtn) {
            cloudsBtn.addEventListener('click', () => {
                toggleClouds();
                playSound('click');
            });
        }

        // Reset view button
        const resetViewBtn = document.getElementById('resetViewBtn');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                resetView();
                playSound('click');
            });
        }

        console.log('🎮 Controls initialized');
    }

    // ===================================
    // Control Functions
    // ===================================

    function toggleRotation() {
        state.isRotating = !state.isRotating;
        const rotateBtn = document.getElementById('rotateBtn');
        
        if (state.isRotating) {
            rotateBtn.classList.add('active');
            // Explicitly enable controls auto-rotate
            const controls = state.globe && state.globe.controls ? state.globe.controls() : null;
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = state.rotationSpeed;
            }
            startRotation();
            showNotification('🔄 Auto-rotation enabled', 'info');
        } else {
            rotateBtn.classList.remove('active');
            // Explicitly disable controls auto-rotate
            const controls = state.globe && state.globe.controls ? state.globe.controls() : null;
            if (controls) {
                controls.autoRotate = false;
            }
            showNotification('⏸️ Auto-rotation paused', 'info');
        }
    }

    function startRotation() {
        if (!state.isRotating || !state.globe) return;

        const controls = state.globe.controls();
        controls.autoRotate = state.isRotating;
        controls.autoRotateSpeed = state.rotationSpeed;
        
        requestAnimationFrame(() => {
            if (state.isRotating) {
                startRotation();
            }
        });
    }

    function toggleDayNight() {
        state.isDayNight = !state.isDayNight;
        const dayNightBtn = document.getElementById('dayNightBtn');

        if (state.isDayNight) {
            dayNightBtn.classList.add('active');
            // Switch to night texture
            state.globe.globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');
            showNotification('🌙 Night view activated', 'success');
        } else {
            dayNightBtn.classList.remove('active');
            // Switch back to day texture
            state.globe.globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg');
            showNotification('☀️ Day view activated', 'success');
        }
    }

    function toggleClouds() {
        state.showClouds = !state.showClouds;
        const cloudsBtn = document.getElementById('cloudsBtn');

        if (state.showClouds) {
            cloudsBtn.classList.add('active');
            addClouds();
            showNotification('☁️ Clouds enabled', 'success');
        } else {
            cloudsBtn.classList.remove('active');
            removeClouds();
            showNotification('☀️ Clouds disabled', 'info');
        }
    }

    function addClouds() {
        if (!state.globe || state.cloudsMesh) return;

        // Import THREE.js dynamically
        import('https://esm.sh/three').then(THREE => {
            const CLOUDS_IMG_URL = '../assets/images/clouds.png';
            const CLOUDS_ALT = 0.004;
            const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(CLOUDS_IMG_URL, cloudsTexture => {
                const clouds = new THREE.Mesh(
                    new THREE.SphereGeometry(state.globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
                    new THREE.MeshPhongMaterial({ 
                        map: cloudsTexture, 
                        transparent: true,
                        opacity: 0.8
                    })
                );
                
                state.globe.scene().add(clouds);
                state.cloudsMesh = clouds;

                // Start cloud rotation animation
                function rotateClouds() {
                    if (state.cloudsMesh && state.showClouds) {
                        clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
                        state.cloudsAnimId = requestAnimationFrame(rotateClouds);
                    }
                }
                rotateClouds();
            }, undefined, error => {
                console.warn('Clouds texture failed to load:', error);
                showNotification('❌ Failed to load cloud texture', 'error');
            });
        }).catch(error => {
            console.error('Failed to load THREE.js:', error);
            showNotification('❌ Failed to load clouds', 'error');
        });
    }

    function removeClouds() {
        if (state.cloudsMesh && state.globe) {
            state.globe.scene().remove(state.cloudsMesh);
            state.cloudsMesh = null;
        }
        
        if (state.cloudsAnimId) {
            cancelAnimationFrame(state.cloudsAnimId);
            state.cloudsAnimId = null;
        }
    }

    function resetView() {
        if (!state.globe) return;

        // Reset to initial view (zoomed in for realistic ISS view)
        state.globe.pointOfView({ 
            lat: 20, 
            lng: 0, 
            altitude: 0.5  // Same as default view
        }, 1000);

        // Stop rotation if active
        if (state.isRotating) {
            toggleRotation();
        }

        // Reset clouds if active
        if (state.showClouds) {
            toggleClouds();
        }

        showNotification('🎯 View reset', 'info');
    }

    // ===================================
    // Location Display
    // ===================================

    function updateLocationDisplay() {
        if (!state.globe) return;

        // Get current view coordinates
        const pov = state.globe.pointOfView();
        state.currentLat = pov.lat;
        state.currentLng = pov.lng;

        // Update location display (simplified)
        const locationEl = document.getElementById('currentLocation');
        if (locationEl) {
            const latDir = state.currentLat >= 0 ? 'N' : 'S';
            const lngDir = state.currentLng >= 0 ? 'E' : 'W';
            locationEl.textContent = `${Math.abs(state.currentLat).toFixed(1)}°${latDir}, ${Math.abs(state.currentLng).toFixed(1)}°${lngDir}`;
        }

        // Update every second
        setTimeout(updateLocationDisplay, 1000);
    }

    // ===================================
    // Notifications
    // ===================================

    function showNotification(message, type = 'info') {
        // Use the global notification system from main.js if available
        if (window.ISSExplorer && window.ISSExplorer.showNotification) {
            window.ISSExplorer.showNotification(message, type);
        } else {
            console.log(`📢 ${message}`);
        }
    }

    // ===================================
    // Sound System
    // ===================================

    function playSound(soundName) {
        // Use the global sound system from main.js if available
        if (window.ISSExplorer && window.ISSExplorer.playSound) {
            window.ISSExplorer.playSound(soundName);
        }
    }

    // Expose to global scope if needed
    window.CupolaView = {
        state,
        toggleRotation,
        toggleDayNight,
        toggleClouds,
        addClouds,
        removeClouds,
        resetView
    };

    console.log('🪟 Cupola View Module v1.0.4 loaded successfully! (Auto-rotate pause fix)');

})(); // End of IIFE

