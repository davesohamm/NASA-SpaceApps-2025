// ===================================
// ISSperience - Main JavaScript
// ===================================

// Global State
const state = {
    soundEnabled: true,
    trophies: 0,
    maxTrophies: 12,
    particles: [],
    backgroundMusic: null,
    isHomepage: true,
    trophyProgress: {
        cupolaViewer: false,           // 1 trophy - 3 seconds
        lunarObservatory: false,       // 1 trophy - 3 seconds
        earthCheckEast: false,         // 1 trophy - 10 seconds
        earthCheckWest: false,          // 1 trophy - 10 seconds
        zeroGLevel1: false,            // 2 trophies - mission completion
        zeroGLevel2: false,            // 2 trophies - mission completion
        zeroGLevel3: false,            // 2 trophies - mission completion
        knowledgeQuiz: false,          // 1 trophy - quiz completion
        knowledgeNBL: false            // 1 trophy - 3 seconds viewing
    }
};

// ===================================
// Initialize on Page Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after page loads (only on landing page)
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            playSound('startup');
        }
    }, 1500);

    // Initialize components (will skip if elements don't exist)
    initFloatingParticles();
    initSoundToggle();
    initModuleCards();
    initGlobalClickSound();
    initStartButton();
    initScrollAnimations();
    initFloatingISS();
    initBackgroundMusic();
    initQuickLinks();
    
    // Load saved state
    loadState();
    
    // Ensure trophy display is updated
    updateTrophyDisplay();
    
    console.log('🚀 ISSperience initialized!');
});

// ===================================
// Floating Particles System
// ===================================

function initFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        console.log('ℹ️ Particles container not found (probably not on landing page)');
        return; // Not on landing page, skip
    }
    
    const particleEmojis = ['⭐', '✨', '🌟', '💫', '🛰️', '🔧', '🔬', '📡'];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, particleEmojis);
    }
}

function createParticle(container, emojis) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    container.appendChild(particle);
    state.particles.push(particle);
}

// ===================================
// Floating ISS Interaction
// ===================================

function initFloatingISS() {
    const floatingISS = document.getElementById('floatingISS');
    if (!floatingISS) {
        console.log('ℹ️ Floating ISS not found (probably not on landing page)');
        return; // Not on landing page, skip
    }
    
    let clickCount = 0;
    
    const issFacts = [
        "The ISS travels at 17,900 mph - that's 5 miles per second! 🚀",
        "The ISS orbits Earth every 90 minutes, seeing 16 sunrises daily! 🌅",
        "The ISS is as long as a football field and weighs 925,000 pounds! 🏈",
        "Astronauts on the ISS see a sunrise or sunset every 45 minutes! 🌍",
        "The ISS has been continuously occupied since November 2000! 🏠",
        "The ISS is a collaboration between 5 space agencies from 15 countries! 🌐",
        "Astronauts on the ISS consume about 3.8 pounds of food per day! 🍽️",
        "The ISS solar panels generate enough power to run 40 homes! ⚡",
        "The ISS is about 250 miles above Earth - closer than NYC to Boston! 📍",
        "Over 270 spacewalks have been conducted from the ISS! 👨‍🚀"
    ];
    
    if (!floatingISS) return;
    
    floatingISS.addEventListener('click', () => {
        clickCount++;
        playSound('woosh');
        
        // Trigger spin animation
        floatingISS.style.animation = 'none';
        setTimeout(() => {
            floatingISS.style.animation = 'issSpin 2s ease-in-out, issOrbit 20s infinite ease-in-out';
        }, 10);
        
        // Show random ISS fact
        const randomFact = issFacts[Math.floor(Math.random() * issFacts.length)];
        showNotification(randomFact, 'info');
        
        // Easter egg: After 5 clicks, show special message
        if (clickCount === 5) {
            setTimeout(() => {
                showNotification('🎉 ISSperience Expert! You\'ve discovered all the fun interactions!', 'success');
                playSound('achievement');
            }, 2500);
        }
        
        // Easter egg: After 10 clicks, unlock secret
        if (clickCount === 10) {
            setTimeout(() => {
                showNotification('🏆 Secret Unlocked: You\'re now an honorary ISS crew member!', 'success');
                playSound('achievement');
                // Add special glow effect
                floatingISS.style.filter = 'drop-shadow(0 0 60px rgba(255, 107, 53, 0.8))';
                setTimeout(() => {
                    floatingISS.style.filter = '';
                }, 3000);
            }, 2500);
        }
    });
    
    // Add a subtle pulsing glow every 10 seconds
    setInterval(() => {
        floatingISS.style.filter = 'drop-shadow(0 0 40px rgba(0, 217, 255, 0.8))';
        setTimeout(() => {
            floatingISS.style.filter = 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.3))';
        }, 1000);
    }, 10000);
}

// ===================================
// Sound System
// ===================================

function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    soundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundToggle.classList.toggle('muted', !state.soundEnabled);
        
        // Update icon
        const soundIcon = soundToggle.querySelector('.sound-icon');
        if (soundIcon) {
            if (state.soundEnabled) {
                soundIcon.textContent = '🔊';
                soundToggle.setAttribute('aria-label', 'Toggle sound on/off');
            } else {
                soundIcon.textContent = '🔇';
                soundToggle.setAttribute('aria-label', 'Sound is muted - click to unmute');
            }
        }
        
        // Control background music based on sound toggle
        if (state.soundEnabled) {
            // Restart background music (same music for homepage and modules)
            startBackgroundMusic('homepage');
        } else {
            // Stop background music
            stopBackgroundMusic();
        }
        
        playSound('click');
        saveState();
    });
}

// Sound playing function with actual audio files
function playSound(soundName) {
    if (!state.soundEnabled) return;
    
    try {
        // Use MP3 for achievement, WAV for others. Use absolute path to work from modules/* pages
        const isAchievement = soundName === 'achievement';
        const filePath = isAchievement 
            ? `/assets/sounds/achievement.mp3`
            : `/assets/sounds/${soundName}.wav`;
        const audio = new Audio(filePath);
        audio.volume = 0.3;
        audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
        console.log('Sound play error:', error);
    }
}

// ===================================
// Background Music System
// ===================================

function initBackgroundMusic() {
    // Start background music (same for homepage and modules)
    startBackgroundMusic('homepage');
}

function startBackgroundMusic(type) {
    if (!state.soundEnabled) return;
    
    // Stop current music if playing
    stopBackgroundMusic();
    
    let musicFile;
    // Use earth_and_moon_bg.mp3 for both homepage and modules
    musicFile = 'assets/sounds/earth_and_moon_bg.mp3';
    state.isHomepage = (type === 'homepage');
    
    try {
        state.backgroundMusic = new Audio(musicFile);
        state.backgroundMusic.loop = true;
        state.backgroundMusic.volume = 0.3; // 30% volume for background music
        state.backgroundMusic.play().catch(err => {
            console.log('Background music play failed:', err);
        });
        
        console.log(`🎵 Started ${type} background music: ${musicFile}`);
    } catch (error) {
        console.log(`Background music file not found: ${musicFile}`);
    }
}

// Make functions and state globally accessible for modules
window.startBackgroundMusic = startBackgroundMusic;
window.stopBackgroundMusic = stopBackgroundMusic;
window.state = state;
window.saveState = saveState;

function stopBackgroundMusic() {
    if (state.backgroundMusic) {
        state.backgroundMusic.pause();
        state.backgroundMusic.currentTime = 0;
        state.backgroundMusic = null;
    }
}

// ===================================
// Global Click Sound System
// ===================================

function initGlobalClickSound() {
    // Add click sound to all clickable elements
    document.addEventListener('click', (event) => {
        // Only play sound for actual user clicks, not programmatic ones
        if (event.isTrusted) {
            playSound('click');
        }
    });
}

// ===================================
// Module Cards Interaction
// ===================================

function initModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        // Hover sound
        card.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        // Click interaction
        card.addEventListener('click', () => {
            const moduleName = card.dataset.module;
            playSound('click');
            handleModuleClick(moduleName);
        });
        
        // Add parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function handleModuleClick(moduleName) {
    // Navigate to module if available
    const modulePages = {
        'cupola': 'modules/cupola-view.html',
        'earth': 'modules/earth-check.html',
        'moon': 'modules/lunar-observatory.html',
        'zerog': 'modules/zero-g-training.html',
        'knowledge': 'modules/knowledge-center.html',
        'certification': 'modules/astronaut-certificate.html',
        // Add more modules as they're built
    };
    
    if (modulePages[moduleName]) {
        // Gate certification behind trophies completion
        if (moduleName === 'certification' && state.trophies < state.maxTrophies) {
            showNotification('Earn all 12/12 trophies to unlock certification.', 'warning');
            return;
        }
        playSound('launch');
        window.location.href = modulePages[moduleName];
    } else {
        // Show notification that module is coming soon
        showNotification(`${getModuleName(moduleName)} is coming soon! 🚀`, 'info');
    }
}

function getModuleName(module) {
    const names = {
        'cupola': 'Cupola Window',
        'earth': 'Is My World Okay?!',
        'zerog': 'Zero-G Training Lab',
        'moon': 'Lunar Observatory',
        'knowledge': 'Knowledge Center',
        'certification': 'Astronaut Certification'
    };
    return names[module] || 'Module';
}

// ===================================
// Start Button
// ===================================

function initStartButton() {
    const startButton = document.getElementById('startButton');
    if (!startButton) {
        console.log('ℹ️ Start button not found (probably not on landing page)');
        return;
    }
    
    startButton.addEventListener('click', () => {
        playSound('launch');
        animateStartButton(startButton);
        
        // Scroll to modules section
        setTimeout(() => {
            const modulesSection = document.querySelector('.modules-section');
            modulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    });
}

function animateStartButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ===================================
// Scroll Animations
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all module cards
    document.querySelectorAll('.module-card').forEach(card => {
        observer.observe(card);
    });
}

// ===================================
// Notification System
// ===================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Different colors for different types
    let bgGradient, borderColor, shadowColor;
    if (type === 'success') {
        bgGradient = 'linear-gradient(135deg, rgba(76, 217, 100, 0.95), rgba(52, 199, 89, 0.95))';
        borderColor = 'rgba(76, 217, 100, 0.5)';
        shadowColor = 'rgba(76, 217, 100, 0.3)';
    } else if (type === 'warning') {
        bgGradient = 'linear-gradient(135deg, rgba(255, 159, 10, 0.95), rgba(255, 149, 0, 0.95))';
        borderColor = 'rgba(255, 159, 10, 0.5)';
        shadowColor = 'rgba(255, 159, 10, 0.3)';
    } else {
        bgGradient = 'linear-gradient(135deg, rgba(0, 217, 255, 0.95), rgba(43, 75, 115, 0.95))';
        borderColor = 'rgba(0, 217, 255, 0.3)';
        shadowColor = 'rgba(0, 217, 255, 0.3)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${bgGradient};
        backdrop-filter: blur(10px);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border: 2px solid ${borderColor};
        box-shadow: 0 10px 30px ${shadowColor};
        z-index: 9999;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
        line-height: 1.5;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds (or 4 for success messages)
    const duration = type === 'success' ? 4000 : 3000;
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(40);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===================================
// Trophy Management System
// ===================================

function awardTrophy(trophyKey, trophyName, description, trophyCount = 1) {
    if (!state.trophyProgress[trophyKey]) {
        state.trophyProgress[trophyKey] = true;
        state.trophies += trophyCount;
        
        // Save state
        saveState();
        
        // Update UI
        updateTrophyDisplay();
        
        // Show notification
        showNotification(`🏆 Trophy Earned!`, 'success');
        
        // Play achievement sound
        playSound('achievement');
        
        console.log(`🏆 Trophy earned: ${trophyName} (${state.trophies}/${state.maxTrophies})`);
        return true;
    }
    return false;
}

function updateTrophyDisplay() {
    const badgeNumber = document.querySelector('.badge-number');
    if (badgeNumber) {
        badgeNumber.textContent = `${state.trophies}/${state.maxTrophies}`;
        
        // Add glow effect when trophies are earned
        if (state.trophies > 0) {
            badgeNumber.style.animation = 'badgeGlow 0.5s ease-out';
            setTimeout(() => {
                badgeNumber.style.animation = '';
            }, 500);
        }
    }

    // Toggle certification card lock state on homepage
    try {
        const certCard = document.querySelector('.module-card[data-module="certification"]');
        if (certCard) {
            const badge = certCard.querySelector('.card-badge');
            const btn = certCard.querySelector('.card-button');
            if (state.trophies >= state.maxTrophies) {
                badge.classList.remove('locked');
                badge.classList.add('unlocked');
                const icon = badge.querySelector('.badge-icon');
                const text = badge.querySelector('.badge-text');
                if (icon) icon.textContent = '✅';
                if (text) text.textContent = 'Available';
                btn.disabled = false;
                btn.innerHTML = '<span>Enter Module</span>';
            } else {
                badge.classList.add('locked');
                badge.classList.remove('unlocked');
                const icon = badge.querySelector('.badge-icon');
                const text = badge.querySelector('.badge-text');
                if (icon) icon.textContent = '🔒';
                if (text) text.textContent = 'Locked';
                btn.disabled = true;
                btn.innerHTML = '<span>Coming Soon</span>';
            }
        }
    } catch (e) { /* noop */ }
}

// Trophy definitions
const trophyDefinitions = {
    cupolaViewer: { name: 'Earth Observer', description: 'Viewed Earth from the Cupola', count: 1 },
    lunarObservatory: { name: 'Lunar Explorer', description: 'Explored the Moon', count: 1 },
    earthCheckModule: { name: 'Earth Watcher', description: 'Monitored Earth from space', count: 2 },
    zeroGTraining: { name: 'Zero-G Expert', description: 'Mastered zero gravity training', count: 6 },
    knowledgeQuiz: { name: 'ISS Scholar', description: 'Completed ISS Knowledge quiz', count: 1 },
    knowledgeNBL: { name: 'NBL Trainee', description: 'Experienced Neutral Buoyancy Laboratory', count: 1 }
};

// ===================================
// State Management
// ===================================

function saveState() {
    localStorage.setItem('issExplorerState', JSON.stringify({
        soundEnabled: state.soundEnabled,
        trophies: state.trophies,
        trophyProgress: state.trophyProgress
    }));
}

function loadState() {
    const savedState = localStorage.getItem('issExplorerState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            state.soundEnabled = parsed.soundEnabled ?? true;
            state.trophies = parsed.trophies ?? 0;
            state.trophyProgress = parsed.trophyProgress ?? {
                cupolaViewer: false,
                lunarObservatory: false,
                earthCheckModule: false,
                zeroGTraining: false,
                knowledgeQuiz: false,
                knowledgeNBL: false
            };
            
            // Update UI
            const soundToggle = document.getElementById('soundToggle');
            if (soundToggle) {
                soundToggle.classList.toggle('muted', !state.soundEnabled);
            }
            
            updateTrophyDisplay();
            console.log('🏆 Loaded trophy state:', state.trophies, 'trophies');
        } catch (error) {
            console.error('Error loading state:', error);
            // Reset to default state
            state.trophies = 0;
            state.trophyProgress = {
                cupolaViewer: false,
                lunarObservatory: false,
                earthCheckModule: false,
                zeroGTraining: false,
                knowledgeQuiz: false,
                knowledgeNBL: false
            };
        }
    } else {
        // No saved state, start fresh
        state.trophies = 0;
        state.trophyProgress = {
            cupolaViewer: false,
            lunarObservatory: false,
            earthCheckModule: false,
            zeroGTraining: false,
            knowledgeQuiz: false,
            knowledgeNBL: false
        };
    }

    // Ensure UI reflects lock/unlock right after load
    try { updateTrophyDisplay(); } catch(e) {}
}

// ===================================
// Easter Eggs & Fun Interactions
// ===================================

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    playSound('achievement');
    showNotification('🎮 Secret astronaut mode activated! You found the Konami code!', 'success');
    
    // Add special visual effect
    document.body.style.animation = 'rainbow 2s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

const rainbowStyles = document.createElement('style');
rainbowStyles.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyles);

// Double-click the astronaut for a surprise
document.addEventListener('DOMContentLoaded', () => {
    const astronaut = document.querySelector('.astronaut-character');
    if (astronaut) {
        astronaut.addEventListener('dblclick', () => {
            playSound('woosh');
            astronaut.style.animation = 'none';
            setTimeout(() => {
                astronaut.style.animation = 'floatAnimation 6s infinite ease-in-out, spin 1s ease-in-out';
            }, 10);
            
            setTimeout(() => {
                astronaut.style.animation = 'floatAnimation 6s infinite ease-in-out';
            }, 1000);
            
            showNotification('🎉 The astronaut is happy you interacted!', 'info');
        });
    }
});

// ===================================
// Performance Monitoring
// ===================================

// Log performance metrics
window.addEventListener('load', () => {
    try {
        const [nav] = performance.getEntriesByType('navigation');
        const pageLoadTime = nav ? Math.round(nav.loadEventEnd) : Math.round(performance.now());
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    } catch (e) {
        console.log(`⚡ Page loaded`);
    }
});

// ===================================
// Utility Functions
// ===================================

// Add smooth scroll to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            playSound('click');
        }
    });
});

// Detect if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    console.log('♿ Reduced motion preference detected');
}

// Export functions for use in other modules (when building module pages)
window.ISSperience = {
    playSound,
    showNotification,
    state,
    awardTrophy,
    updateTrophyDisplay,
    trophyDefinitions
};
// Backward compatibility for modules still referencing the old globals
window.ISSExplorer = window.ISSperience;
window.ExploreISS = window.ISSperience;

console.log('🌟 ISSperience ready for launch!');

// ===================================
// Quick Links Modal
// ===================================

function initQuickLinks() {
    const openBtn = document.getElementById('quickLinksButton');
    const modal = document.getElementById('quickLinksModal');
    const closeBtn = document.getElementById('quickLinksClose');
    if (!openBtn || !modal || !closeBtn) return;

    let lastFocusedElement = null;

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        playSound('woosh');
        const title = document.getElementById('quickLinksTitle');
        if (title && title.focus) title.focus();
        trapFocus(modal);
    }

    function closeModal() {
        modal.hidden = true;
        playSound('click');
        if (lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (modal.hidden) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    });
}

function trapFocus(container) {
    const focusableSelectors = [
        'a[href]', 'button:not([disabled])', 'textarea', 'input', 'select', '[tabindex]:not([tabindex="-1"])'
    ];
    const focusable = container.querySelectorAll(focusableSelectors.join(','));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handle(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    container.addEventListener('keydown', handle);
}