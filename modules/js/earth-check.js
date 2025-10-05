// ===================================
// Earth Check Module - Premier Satellite Earth Observation
// Version: 0.4.1 - FIXED: NASA EPIC 503 handling + hide zoom for EPIC (CORS)
// ===================================

(function() {
    'use strict';
    
    console.log('🌍 Earth Check Module v0.4.1 loading... (Better API error handling!)');

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

// Configuration
const EARTH_CONFIG = {
    // Three premier satellite sources for professional Earth observation
    sources: [
        {
            name: 'NOAA GOES-16 East',
            type: 'direct',
            imageUrl: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/1808x1808.jpg',
            description: 'Full Earth disc from GOES-16 - Americas & Atlantic',
            coverage: 'Americas, Atlantic Ocean, Western Europe, Western Africa',
            satellite: 'GOES-16 (GOES-East)',
            altitude: '35,786 km geostationary',
            position: '75.2°W longitude',
            updateFreq: 'Every 10 minutes'
        },
        {
            name: 'NOAA GOES-17 West',
            type: 'direct',
            imageUrl: 'https://cdn.star.nesdis.noaa.gov/GOES17/ABI/FD/GEOCOLOR/1808x1808.jpg',
            description: 'Full Earth disc from GOES-17 - Pacific Ocean',
            coverage: 'Pacific Ocean, Western Americas, Eastern Asia, Australia',
            satellite: 'GOES-17 (GOES-West)',
            altitude: '35,786 km geostationary',
            position: '137.2°W longitude',
            updateFreq: 'Every 10 minutes'
        },
        {
            name: 'Local Earth Animation',
            type: 'video',
            videoUrl: '../assets/images/animated-earth.mp4', // 9.9MB MP4 video
            description: 'High-quality Earth animation - 9.9MB MP4 video',
            coverage: 'Full Earth animation with day/night cycle',
            satellite: 'Multiple sources compiled',
            altitude: 'Various orbital altitudes',
            position: 'Multiple viewing angles',
            updateFreq: 'Continuous loop',
            features: 'Smooth animation, optimized for web, fast loading'
        },
        {
            name: 'NOAA Interactive Viewer',
            type: 'embedded',
            embedUrl: 'https://www.star.nesdis.noaa.gov/goes/fulldisk_band.php?sat=G19&band=GEOCOLOR&length=240&dim=0',
            description: '40-hour animated time-lapse - 240 images every 10 minutes',
            coverage: 'Full Earth disc with day/night cycle',
            satellite: 'GOES-19 (GOES-East)',
            altitude: '35,786 km geostationary',
            position: '75.2°W longitude',
            updateFreq: 'Every 10 minutes',
            features: 'Interactive controls, zoom, download, auto-refresh'
        }
    ],
    
    updateInterval: 60 * 60 * 1000, // 1 hour
    retryDelay: 2000,
    maxRetries: 3,
    currentSource: null  // Track which source is currently loaded
};

// State
const state = {
    currentZoom: 1,
    latestDate: null,
    currentImageUrl: null,  // Track current image URL for downloading
    currentSourceName: null,  // Track which source is loaded
    autoRefreshTimer: null,
    countdownTimer: null,
    isLoading: false,
    retryCount: 0
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ==========================================');
    console.log('🚀 EARTH CHECK MODULE v0.3.5 STARTING');
    console.log('🚀 ==========================================');
    
    // Start background music
    if (window.startBackgroundMusic) {
        window.startBackgroundMusic('module');
    }
    
    // Initialize sound toggle
    initSoundToggle();
    
    // Check canvas exists
    const canvas = document.getElementById('earthCanvas');
    if (!canvas) {
        console.error('❌ FATAL ERROR: Canvas #earthCanvas not found!');
        alert('CRITICAL ERROR: Canvas element not found! Check the HTML file.');
        return;
    }
    console.log('✅ Canvas element found:', canvas);
    
    // Check config
    console.log(`✅ ${EARTH_CONFIG.sources.length} image sources configured (with your NASA API key!):`);
    EARTH_CONFIG.sources.forEach((src, i) => {
        console.log(`   ${i+1}. ${src.name}`);
    });
    
    initializeModule();
    setupEventListeners();
    
    // Start automatic updates
    startAutoRefresh();
    
    console.log('🚀 Initialization complete!');
    console.log('🚀 ==========================================');
});

// ===================================
// Initialization
// ===================================

function initializeModule() {
    // Load video animation as default
    loadSpecificSource(2); // Load Local Earth Animation (video)
}

function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            playSound('click');
            loadLatestEarthImage(true);
        });
    }

    // Zoom button
    const zoomBtn = document.getElementById('zoomBtn');
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            toggleZoom();
            playSound('click');
        });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadCurrentImage();
            playSound('click');
        });
    }


    // Source selector button
    const loadSourceBtn = document.getElementById('loadSourceBtn');
    const sourceSelect = document.getElementById('sourceSelect');
    if (loadSourceBtn && sourceSelect) {
        loadSourceBtn.addEventListener('click', () => {
            const selectedIndex = parseInt(sourceSelect.value);
            playSound('click');
            loadSpecificSource(selectedIndex);
        });
    }

    // Sound toggle (from main.js)
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && window.ISSExplorer) {
        soundToggle.addEventListener('click', () => {
            window.ISSExplorer.state.soundEnabled = !window.ISSExplorer.state.soundEnabled;
            soundToggle.classList.toggle('muted', !window.ISSExplorer.state.soundEnabled);
            playSound('click');
        });
    }
}

// ===================================
// NASA EPIC Image Loading
// ===================================

// Load a specific source by index
// Function to clean up all previous content before loading new source
function cleanupPreviousContent() {
    console.log('🧹 Cleaning up previous content...');
    
    // Reset canvas
    const canvas = document.getElementById('earthCanvas');
    if (canvas) {
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('🖼️ Canvas reset and made visible');
    }
    
    // Hide embedded viewer
    const embedContainer = document.getElementById('embeddedViewer');
    if (embedContainer) {
        embedContainer.style.display = 'none';
    }
    
    // Remove video container and any video elements
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
        videoContainer.remove();
        console.log('🗑️ Removed video container');
    }
    
    // Remove any existing video elements from canvas
    const existingVideo = canvas?.querySelector('video');
    if (existingVideo) {
        existingVideo.remove();
        console.log('🗑️ Removed video element from canvas');
    }
    
    // Ensure canvas is visible and properly sized
    if (canvas) {
        canvas.style.display = 'block';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        console.log('🖼️ Canvas made visible and resized');
    }
    
    
    console.log('✅ Previous content cleaned up');
}

async function loadSpecificSource(sourceIndex) {
    if (sourceIndex < 0 || sourceIndex >= EARTH_CONFIG.sources.length) {
        showNotification('❌ Invalid source selected', 'warning');
        return;
    }

    // Clean up any previous content first
    cleanupPreviousContent();
    
    state.isLoading = true;
    showLoading();

    const source = EARTH_CONFIG.sources[sourceIndex];
    console.log(`🛰️ Loading specific source: ${source.name}`);
    
    // Hide zoom button for NASA EPIC (CORS restrictions prevent canvas manipulation)
    const zoomBtn = document.getElementById('zoomBtn');
    if (zoomBtn) {
        if (source.name.includes('NASA EPIC')) {
            zoomBtn.style.display = 'none';
            console.log('🔒 Zoom disabled for NASA EPIC (CORS restrictions)');
        } else {
            zoomBtn.style.display = 'flex';
        }
    }

    try {
        if (source.type === 'direct') {
            // Direct image URL
            await loadDirectImage(source);
            state.latestDate = new Date();
            state.currentImageUrl = source.imageUrl;
            state.currentSourceName = source.name;
            EARTH_CONFIG.currentSource = source.name;
            updateCaptureTime(state.latestDate);
            updateSourceInfo(source);
            
            hideLoading();
            showNotification(`🌍 Loaded from ${source.name}!`, 'success');
            console.log(`✅ Successfully loaded from ${source.name}`);
            
            // Award trophies for spending 10 seconds in Earth Check module
            if (window.ISSperience && window.ISSperience.awardTrophy) {
                setTimeout(() => {
                    window.ISSperience.awardTrophy('earthCheckModule', 'Earth Watcher', 'Monitored Earth from space', 2);
                }, 10000); // Award 2 trophies after 10 seconds in module
            }
            
        } else if (source.type === 'api') {
            // API-based (like NASA EPIC)
            const data = await getAPIImage(source);
            if (data) {
                const imageUrl = await loadAPIBasedImage(source, data);
                state.latestDate = new Date(data.date);
                state.currentImageUrl = imageUrl;
                state.currentSourceName = source.name;
                EARTH_CONFIG.currentSource = source.name;
                updateCaptureTime(state.latestDate);
                updateSourceInfo(source);
                
                hideLoading();
                showNotification(`🌍 Loaded from ${source.name}!`, 'success');
                console.log(`✅ Successfully loaded from ${source.name}`);
            } else {
                throw new Error('Failed to fetch API data');
            }
        } else if (source.type === 'embedded') {
            // Embedded viewer (like NOAA GOES-19 animated loop)
            loadEmbeddedViewer(source);
            state.latestDate = new Date();
            state.currentSourceName = source.name;
            EARTH_CONFIG.currentSource = source.name;
            updateCaptureTime(state.latestDate);
            updateSourceInfo(source);
            
            hideLoading();
            showNotification(`🎬 Loaded ${source.name}!`, 'success');
            console.log(`✅ Successfully loaded embedded viewer: ${source.name}`);
        } else if (source.type === 'video') {
            // Video animation (like the 9.9MB Earth animation)
            loadVideoAnimation(source);
            state.latestDate = new Date();
            state.currentSourceName = source.name;
            EARTH_CONFIG.currentSource = source.name;
            updateCaptureTime(state.latestDate);
            updateSourceInfo(source);
            
            hideLoading();
            showNotification(`🎞️ Loaded ${source.name}!`, 'success');
            console.log(`✅ Successfully loaded video animation: ${source.name}`);
        }
        
    } catch (error) {
        console.error(`❌ Failed to load from ${source.name}:`, error);
        hideLoading();
        
        // More helpful error message based on error type
        if (source.name.includes('NASA EPIC')) {
            if (error.message.includes('503')) {
                showNotification(`⚠️ NASA EPIC API is temporarily down. Try NOAA GOES instead! 🛰️`, 'warning');
            } else if (error.message.includes('429')) {
                showNotification(`⚠️ NASA EPIC rate limit exceeded. Try again in a few minutes or use NOAA GOES! 🛰️`, 'warning');
            } else if (error.message.includes('CORS')) {
                showNotification(`❌ NASA EPIC has CORS restrictions. Try NOAA sources instead! ✅`, 'warning');
            } else {
                showNotification(`❌ NASA EPIC unavailable. Try NOAA GOES-16 or GOES-17! 🛰️`, 'warning');
            }
        } else {
            showNotification(`❌ Failed to load ${source.name}. Try another source.`, 'warning');
        }
    } finally {
        state.isLoading = false;
    }
}

async function loadLatestEarthImage(forceRefresh = false) {
    if (state.isLoading && !forceRefresh) {
        console.log('Already loading...');
        return;
    }

    state.isLoading = true;
    showLoading();

    try {
        console.log('🌍 Loading Earth image...');
        
        // Try each source until one works
        for (let i = 0; i < EARTH_CONFIG.sources.length; i++) {
            const source = EARTH_CONFIG.sources[i];
            console.log(`Trying source ${i + 1}/${EARTH_CONFIG.sources.length}: ${source.name}`);
            
            try {
                if (source.type === 'direct') {
                    // Direct image URL - simplest and most reliable
                    await loadDirectImage(source);
                    state.latestDate = new Date();
                    state.currentImageUrl = source.imageUrl;  // Save for download
                    state.currentSourceName = source.name;
                    EARTH_CONFIG.currentSource = source.name;
                    updateCaptureTime(state.latestDate);
                    updateSourceInfo(source);
                    
                    // Success!
                    state.retryCount = 0;
                    hideLoading();
                    showNotification(`🌍 Loaded from ${source.name}!`, 'success');
                    console.log(`✅ Successfully loaded from ${source.name}`);
                    console.log(`   ${source.description}`);
                    return; // Exit on success
                    
                } else if (source.type === 'api') {
                    // API-based (like EPIC)
                    const data = await getAPIImage(source);
                    if (data) {
                        const imageUrl = await loadAPIBasedImage(source, data);
                        state.latestDate = new Date(data.date);
                        state.currentImageUrl = imageUrl;  // Save for download
                        state.currentSourceName = source.name;
                        EARTH_CONFIG.currentSource = source.name;
                        updateCaptureTime(state.latestDate);
                        updateSourceInfo(source);
                        
                        // Success!
                        state.retryCount = 0;
                        hideLoading();
                        showNotification(`🌍 Loaded from ${source.name}!`, 'success');
                        console.log(`✅ Successfully loaded from ${source.name}`);
                        console.log(`   ${source.description}`);
                        return; // Exit on success
                    }
                } else if (source.type === 'embedded') {
                    // Embedded viewer (like NOAA GOES-19 animated loop)
                    loadEmbeddedViewer(source);
                    state.latestDate = new Date();
                    state.currentSourceName = source.name;
                    EARTH_CONFIG.currentSource = source.name;
                    updateCaptureTime(state.latestDate);
                    updateSourceInfo(source);
                    
                    // Success!
                    state.retryCount = 0;
                    hideLoading();
                    showNotification(`🎬 Loaded ${source.name}!`, 'success');
                    console.log(`✅ Successfully loaded embedded viewer: ${source.name}`);
                    console.log(`   ${source.description}`);
                    return; // Exit on success
                } else if (source.type === 'video') {
                    // Video animation (like the 9.9MB Earth animation)
                    // STOP ALL LOADING IMMEDIATELY
                    state.isLoading = false;
                    state.retryCount = 0;
                    
                    // Force hide loading overlay
                    const overlay = document.getElementById('loadingOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                        overlay.classList.add('hidden');
                    }
                    
                    // Clear any progress
                    const progressEl = document.getElementById('loadingProgress');
                    if (progressEl) {
                        progressEl.textContent = '';
                    }
                    
                    // Load video directly
                    loadVideoAnimation(source);
                    state.latestDate = new Date();
                    state.currentSourceName = source.name;
                    EARTH_CONFIG.currentSource = source.name;
                    updateCaptureTime(state.latestDate);
                    updateSourceInfo(source);
                    
                    console.log(`✅ Video animation setup complete: ${source.name}`);
                    console.log(`   ${source.description}`);
                    return; // Exit on success
                }
            } catch (error) {
                console.warn(`Failed to load from ${source.name}:`, error);
                // Continue to next source
            }
        }
        
        // If all sources failed
        throw new Error('All image sources failed');

    } catch (error) {
        console.error('❌ Failed to load Earth image from all sources:', error);
        handleLoadError();
    } finally {
        state.isLoading = false;
    }
}

// Load image directly from URL (most reliable)
async function loadDirectImage(source) {
    return new Promise((resolve, reject) => {
        console.log(`📥 Attempting to load image from: ${source.imageUrl}`);
        updateLoadingProgress(10);
        
        const canvas = document.getElementById('earthCanvas');
        if (!canvas) {
            console.error('❌ CRITICAL: Canvas element not found!');
            reject(new Error('Canvas not found'));
            return;
        }
        
        // Clean up any previous content
        cleanupPreviousContent();
        
        const ctx = canvas.getContext('2d');
        console.log(`✅ Canvas found:`, canvas.width, 'x', canvas.height);
        
        const img = new Image();
        // DON'T set crossOrigin - external servers don't allow it!

        img.onload = () => {
            console.log(`✅ Image loaded! Original dimensions: ${img.width}x${img.height}`);
            updateLoadingProgress(50);
            
            // Keep full resolution - no resizing
            const displayWidth = img.width;
            const displayHeight = img.height;
            console.log(`📏 Keeping full resolution: ${displayWidth}x${displayHeight}`);
            
            // Set canvas size to resized dimensions
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            console.log(`✅ Canvas resized to: ${canvas.width}x${canvas.height}`);
            
            // Clear and draw with scaling
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
            console.log(`✅ Image drawn to canvas with scaling!`);
            
            // Make sure canvas is visible
            canvas.style.display = 'block';
            canvas.style.visibility = 'visible';
            
            updateLoadingProgress(100);
            resolve();
        };

        img.onerror = (error) => {
            console.error(`❌ Failed to load image from ${source.name}:`, error);
            console.error(`   URL was: ${source.imageUrl}`);
            console.error(`   💡 This source may have CORS restrictions or the URL may have changed`);
            console.error(`   🔧 NOAA sources (GOES-16/17) have the best compatibility`);
            reject(new Error(`Failed to load ${source.name} - CORS or network error`));
        };

        // No crossOrigin attribute - external servers block CORS requests!
        
        // Add timestamp to prevent caching (only if not already present)
        let finalUrl = source.imageUrl;
        if (!finalUrl.includes('?t=')) {
            const timestamp = new Date().getTime();
            finalUrl = `${source.imageUrl}?t=${timestamp}`;
        }
        console.log(`🔄 Setting image source: ${finalUrl}`);
        img.src = finalUrl;
    });
}

// Get image data from API
async function getAPIImage(source) {
    try {
        // Build API URL with API key if provided
        let apiUrl = source.apiUrl;
        if (source.apiKey) {
            apiUrl += `?api_key=${source.apiKey}`;
        }
        
        console.log(`Fetching from API: ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.error(`❌ NASA EPIC API error! Status: ${response.status}`);
            
            // Specific error messages for common status codes
            if (response.status === 503) {
                console.error('   Service temporarily unavailable. NASA servers may be down for maintenance.');
                throw new Error('NASA EPIC API temporarily unavailable (503)');
            } else if (response.status === 429) {
                console.error('   Rate limit exceeded. Try again later.');
                throw new Error('NASA EPIC API rate limit exceeded (429)');
            } else if (response.status === 403) {
                console.error('   API key may be invalid or expired.');
                throw new Error('NASA EPIC API access denied (403)');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('API response:', data);
        
        if (!data || (Array.isArray(data) && data.length === 0)) {
            console.warn('No data available from API');
            return null;
        }

        // Get the most recent image (first in array if array)
        const latest = Array.isArray(data) ? data[0] : data;
        console.log('Latest API data:', latest);
        
        return latest;

    } catch (error) {
        console.error('Failed to fetch from API:', error);
        return null;
    }
}

// Load image from API data
async function loadAPIBasedImage(source, data) {
    return new Promise((resolve, reject) => {
        // Clean up any previous content
        cleanupPreviousContent();
        
        // Extract date from image filename (more reliable than date field)
        // Image name format: epic_1b_20250715035255
        // Extract: YYYYMMDD from the image name
        const imageName = data.image;
        const dateMatch = imageName.match(/(\d{8})/); // Extract YYYYMMDD
        
        let year, month, day;
        if (dateMatch) {
            const dateStr = dateMatch[1];
            year = dateStr.substring(0, 4);
            month = dateStr.substring(4, 6);
            day = dateStr.substring(6, 8);
            console.log(`📅 Extracted date from filename: ${year}/${month}/${day}`);
        } else {
            // Fallback to date field if parsing fails
            const date = new Date(data.date);
            year = date.getUTCFullYear();
            month = String(date.getUTCMonth() + 1).padStart(2, '0');
            day = String(date.getUTCDate()).padStart(2, '0');
            console.log(`📅 Using date field: ${year}/${month}/${day}`);
        }
        
        let imageUrl = source.imageUrlTemplate
            .replace('{year}', year)
            .replace('{month}', month)
            .replace('{day}', day)
            .replace('{image}', data.image);
        
        console.log('Loading API image from:', imageUrl);
        updateLoadingProgress(20);
        
        const img = new Image();
        // DON'T set crossOrigin - external servers don't allow it!

        img.onload = () => {
            console.log('API image loaded successfully');
            updateLoadingProgress(60);
            
            const canvas = document.getElementById('earthCanvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Clear and draw
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            updateLoadingProgress(100);
            resolve(imageUrl);  // Return the URL for downloading
        };

        img.onerror = (error) => {
            console.error('Failed to load API image:', error);
            console.error('   This might be due to CORS restrictions from NASA archive servers');
            console.error('   Try using NOAA sources instead - they have better CORS support');
            reject(new Error('CORS or network error loading NASA EPIC image'));
        };

        img.src = imageUrl;
    });
}

// ===================================
// UI Updates
// ===================================

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    
    // Reset loading state
    state.isLoading = false;
    
    // Clear any loading progress
    updateLoadingProgress(0);
}

function updateLoadingProgress(percent) {
    const progressEl = document.getElementById('loadingProgress');
    if (progressEl) {
        progressEl.textContent = `${Math.round(percent)}%`;
    }
    
    // Don't update progress for video sources
    if (state.currentSourceName && state.currentSourceName.includes('Animation')) {
        return;
    }
}

function updateCaptureTime(date) {
    const timeEl = document.getElementById('captureTime');
    if (timeEl) {
        const formatted = formatDateTime(date);
        timeEl.textContent = formatted;
    }
}

function updateSourceInfo(source) {
    // Log source information
    console.log(`📡 Active Source: ${source.name}`);
    if (source.description) {
        console.log(`   Description: ${source.description}`);
    }
    
    // Update UI elements if they exist
    const sourceElement = document.getElementById('imageSource');
    if (sourceElement) {
        sourceElement.textContent = source.name;
    }
    
    const descriptionElement = document.getElementById('sourceDescription');
    if (descriptionElement) {
        descriptionElement.textContent = source.description || '';
    }
}

function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
}

// ===================================
// Zoom Controls
// ===================================

function toggleZoom() {
    // For NASA EPIC, we just toggle between fit and actual size
    const canvas = document.getElementById('earthCanvas');
    state.currentZoom = state.currentZoom === 1 ? 2 : 1;
    
    const zoomLevelEl = document.getElementById('zoomLevel');
    if (zoomLevelEl) {
        zoomLevelEl.textContent = state.currentZoom === 1 ? 'Fit' : 'Actual Size';
    }

    // Toggle canvas CSS sizing
    if (state.currentZoom === 2) {
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = 'none';
        showNotification('🔍 Viewing at actual size', 'info');
    } else {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '1100px';
        showNotification('🔍 Fit to screen', 'info');
    }
}

// ===================================
// Download Functionality
// ===================================

function downloadCurrentImage() {
    // Check if we have a current image URL
    if (!state.currentImageUrl) {
        showNotification('❌ No image loaded yet', 'warning');
        return;
    }
    
    try {
        // Direct download from the image URL
        const a = document.createElement('a');
        a.href = state.currentImageUrl;
        a.target = '_blank';  // Open in new tab (browser will download it)
        
        // Generate filename with timestamp and source
        const timestamp = state.latestDate ? 
            state.latestDate.toISOString().slice(0, 19).replace(/:/g, '-') :
            new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        const sourceName = state.currentSourceName || 'earth';
        const cleanSource = sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        a.download = `earth-${cleanSource}-${timestamp}.jpg`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('💾 Download started! Check your downloads folder.', 'success');
        console.log(`📥 Downloading image from: ${state.currentImageUrl}`);
        
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('❌ Failed to download image. You can right-click the image to save it.', 'warning');
    }
}

// ===================================
// Auto-refresh System
// ===================================

function startAutoRefresh() {
    // Clear existing timers
    if (state.autoRefreshTimer) {
        clearInterval(state.autoRefreshTimer);
    }
    if (state.countdownTimer) {
        clearInterval(state.countdownTimer);
    }

    // Refresh every hour (NASA EPIC updates every 1-2 hours)
    state.autoRefreshTimer = setInterval(() => {
        console.log('🔄 Auto-refresh triggered');
        loadLatestEarthImage(true);
    }, EARTH_CONFIG.updateInterval);

    // Update countdown display
    startCountdown();
}

function startCountdown() {
    let secondsRemaining = EARTH_CONFIG.updateInterval / 1000;

    state.countdownTimer = setInterval(() => {
        secondsRemaining--;

        if (secondsRemaining <= 0) {
            secondsRemaining = EARTH_CONFIG.updateInterval / 1000;
        }

        updateCountdownDisplay(secondsRemaining);
    }, 1000);
}

function updateCountdownDisplay(seconds) {
    const nextUpdateEl = document.getElementById('nextUpdate');
    if (!nextUpdateEl) return;

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    nextUpdateEl.textContent = `${minutes}:${String(secs).padStart(2, '0')}`;
}

// ===================================
// Error Handling
// ===================================

function handleLoadError() {
    state.retryCount++;
    console.error(`❌ Load failed. Retry count: ${state.retryCount}/${EARTH_CONFIG.maxRetries}`);

    if (state.retryCount < EARTH_CONFIG.maxRetries) {
        showNotification(`⚠️ Loading failed. Retrying... (${state.retryCount}/${EARTH_CONFIG.maxRetries})`, 'warning');
        
        setTimeout(() => {
            console.log('🔄 Retrying load...');
            loadLatestEarthImage(true);
        }, EARTH_CONFIG.retryDelay);
    } else {
        hideLoading();
        showNotification('❌ All sources failed. Please check console and try manual refresh.', 'warning');
        console.error('❌ ALL SOURCES EXHAUSTED. Check:');
        console.error('   1. Internet connection');
        console.error('   2. Firewall/proxy settings');
        console.error('   3. Browser console for specific errors');
        state.retryCount = 0;
    }
}

// ===================================
// Utility Functions
// ===================================

function playSound(soundName) {
    try {
        const audio = new Audio(`../assets/sounds/${soundName}.wav`);
        audio.volume = 0.3;
        audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
        console.log(`Sound file not found: ${soundName}.wav`);
    }
}

function showNotification(message, type = 'info') {
    if (window.ISSExplorer && window.ISSExplorer.showNotification) {
        window.ISSExplorer.showNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ===================================
// Video Animation System
// ===================================

function loadVideoAnimation(source) {
    const canvas = document.getElementById('earthCanvas');
    if (!canvas) {
        console.error('Canvas not found for video animation');
        return;
    }
    
    // STOP ALL LOADING SYSTEMS
    state.isLoading = false;
    
    // Force hide loading overlay
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.add('hidden');
    }
    
    // Clean up any previous content
    cleanupPreviousContent();
    
    // Hide the canvas and show video
    canvas.style.display = 'none';
    
    // Hide any existing embedded viewer
    const embedContainer = document.getElementById('embeddedViewer');
    if (embedContainer) {
        embedContainer.style.display = 'none';
    }
    
    // Create video element
    const video = document.createElement('video');
    video.controls = true;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.preload = 'metadata'; // Load metadata first
    video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
        max-width: 100%;
        max-height: 100%;
    `;
    
    // Add source element for better compatibility
    const sourceElement = document.createElement('source');
    sourceElement.src = source.videoUrl;
    sourceElement.type = 'video/mp4';
    video.appendChild(sourceElement);
    
    // Fallback: try direct src if source element fails
    video.src = source.videoUrl;
    
    // No poster image needed - video will show first frame
    
    console.log(`🎬 Video source: ${source.videoUrl}`);
    console.log(`🎬 Video element created:`, video);
    
    // Create video container
    let videoContainer = document.getElementById('videoContainer');
    if (!videoContainer) {
        videoContainer = document.createElement('div');
        videoContainer.id = 'videoContainer';
        videoContainer.style.cssText = `
            width: 33.33%;
            height: 33.33%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid #00D9FF;
            margin: auto;
        `;
        
        // Insert after the canvas
        canvas.parentNode.insertBefore(videoContainer, canvas.nextSibling);
    }
    
    // Clear and add video
    videoContainer.innerHTML = '';
    videoContainer.appendChild(video);
    
    // Debug: Check if video is properly added
    console.log('🎬 Video container:', videoContainer);
    console.log('🎬 Video element:', video);
    console.log('🎬 Video source:', video.src);
    console.log('🎬 Video ready state:', video.readyState);
    console.log('🎬 Video container display:', videoContainer.style.display);
    console.log('🎬 Video container visible:', videoContainer.offsetWidth, 'x', videoContainer.offsetHeight);
    
    // NO LOADING NOTIFICATIONS - Direct video setup
    console.log('🎬 Setting up video animation...');
    video.load(); // Force load attempt
    
    // Ensure video container is visible
    videoContainer.style.display = 'flex';
    
    video.onloadstart = () => {
        console.log('📥 Video loading started');
    };
    
    video.onloadedmetadata = () => {
        console.log('📊 Video metadata loaded');
        console.log(`📊 Video duration: ${video.duration}s`);
        console.log(`📊 Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
    };
    
    video.onerror = (e) => {
        console.error(`❌ Video error:`, e);
        console.error(`❌ Video error code:`, video.error?.code);
        console.error(`❌ Video error message:`, video.error?.message);
        console.error(`❌ Failed to load video: ${source.videoUrl}`);
    };
    
    video.onstalled = () => {
        console.warn('⚠️ Video loading stalled');
    };
    
    // Add timeout to detect if video fails to load
    const loadTimeout = setTimeout(() => {
        if (video.readyState < 2) { // HAVE_CURRENT_DATA
            console.error('⏰ Video loading timeout');
        }
    }, 10000); // 10 second timeout
    
    video.oncanplay = () => {
        clearTimeout(loadTimeout);
        console.log(`✅ Video animation loaded: ${source.name}`);
        
        // Ensure video starts playing
        video.play().catch(error => {
            console.warn('⚠️ Autoplay failed:', error);
        });
    };
    
    console.log(`🎞️ Loading video animation: ${source.name}`);
}

// ===================================
// Embedded Viewer System
// ===================================

function loadEmbeddedViewer(source) {
    const canvas = document.getElementById('earthCanvas');
    if (!canvas) {
        console.error('Canvas not found for embedded viewer');
        return;
    }
    
    // Clean up any previous content
    cleanupPreviousContent();
    
    // Hide the canvas and show redirect message
    canvas.style.display = 'none';
    
    // Create or update embedded viewer container
    let embedContainer = document.getElementById('embeddedViewer');
    if (!embedContainer) {
        embedContainer = document.createElement('div');
        embedContainer.id = 'embeddedViewer';
        embedContainer.style.cssText = `
            width: 100%;
            height: 100%;
            min-height: 600px;
            border: 2px solid #00D9FF;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(255, 107, 53, 0.05));
            text-align: center;
            padding: 2rem;
        `;
        
        // Insert after the canvas
        canvas.parentNode.insertBefore(embedContainer, canvas.nextSibling);
    }
    
    // Create redirect interface instead of iframe
    embedContainer.innerHTML = `
        <div style="max-width: 600px;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
            <h2 style="color: #00D9FF; margin-bottom: 1rem; font-family: 'Orbitron', sans-serif;">
                NOAA GOES-19 Animated Loop
            </h2>
            <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem; line-height: 1.6;">
                Experience a stunning 40-hour time-lapse of Earth with 240 images captured every 10 minutes. 
                Watch the day/night cycle, weather patterns, and cloud formations evolve in real-time.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem;">
                <div style="background: rgba(0, 217, 255, 0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                    📅 40 Hours
                </div>
                <div style="background: rgba(0, 217, 255, 0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                    🖼️ 240 Images
                </div>
                <div style="background: rgba(0, 217, 255, 0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                    ⏱️ 10min Updates
                </div>
            </div>
            <button id="openNoaaViewer" style="
                background: linear-gradient(135deg, #00D9FF, #FF6B35);
                border: none;
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(0, 217, 255, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 24px rgba(0, 217, 255, 0.4)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0, 217, 255, 0.3)'">
                🚀 Open NOAA Interactive Viewer
            </button>
            <p style="color: rgba(255, 255, 255, 0.6); margin-top: 1rem; font-size: 0.9rem;">
                Opens in a new tab with full interactive controls
            </p>
        </div>
    `;
    
    // Add click handler for the button
    const openButton = document.getElementById('openNoaaViewer');
    if (openButton) {
        openButton.addEventListener('click', () => {
            window.open(source.embedUrl, '_blank', 'noopener,noreferrer');
            showNotification('🚀 Opening NOAA Interactive Viewer in new tab...', 'success');
        });
    }
    
    console.log(`🎬 NOAA viewer interface loaded: ${source.name}`);
}


// ===================================
// Cleanup on page unload
// ===================================

window.addEventListener('beforeunload', () => {
    if (state.autoRefreshTimer) {
        clearInterval(state.autoRefreshTimer);
    }
    if (state.countdownTimer) {
        clearInterval(state.countdownTimer);
    }
});

console.log('🌍 Earth Check module v0.4.1 loaded successfully! (NASA EPIC error handling improved!)');

})(); // End of IIFE

