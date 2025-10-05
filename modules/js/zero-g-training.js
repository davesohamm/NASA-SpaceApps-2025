// ===================================
// Zero-G Training Module JavaScript
// ===================================

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

// Game State
const gameState = {
    currentLevel: null,
    tasks: {
        // Level 1 tasks
        monitor: { completed: false, description: "Fix monitor in bottom right corner" },
        cpu: { completed: false, description: "Connect CPU next to monitor" },
        screwdriver: { completed: false, description: "Use screwdriver to fix CPU" },
        toolbox: { completed: false, description: "Place toolbox in right bottom corner" },
        'screwdriver-toolbox': { completed: false, description: "Put screwdriver in toolbox" },
        // Level 2 tasks
        'water-collection': { completed: false, description: "Collect all 3 water drops in bottle" },
        'water-bottle': { completed: false, description: "Give water bottle to astronaut" },
        'sandwich': { completed: false, description: "Feed sandwich to astronaut" },
        'book': { completed: false, description: "Give book to astronaut" },
        // Level 3 tasks
        'phone-fix': { completed: false, description: "Fix phone with wrench" },
        'camera-fix': { completed: false, description: "Fix camera with screwdriver" },
        'toolbox-organization': { completed: false, description: "Put all tools and items in toolbox" },
        'toolbox-placement': { completed: false, description: "Place toolbox in designated area" }
    },
    objects: {},
    dropZones: {},
    physics: null,
    isDragging: false,
    draggedObject: null,
    collectedWater: 0,
    maxWater: 3
};

// Object configurations for Level 1
const level1Objects = {
    monitor: {
        src: '../assets/images/objects/monitor.png',
        width: 320, // 4x original size (2x from current)
        height: 320, // 4x original size (2x from current)
        x: 200,
        y: 200,
        tasks: ['monitor']
    },
    cpu: {
        src: '../assets/images/objects/cpu.png',
        width: 240, // 4x original size (2x from current)
        height: 240, // 4x original size (2x from current)
        x: 400,
        y: 300,
        tasks: ['cpu']
    },
    screwdriver: {
        src: '../assets/images/objects/screwdriver.png',
        width: 150, // 3x original size
        height: 150, // 3x original size
        x: 600,
        y: 250,
        tasks: ['screwdriver', 'screwdriver-toolbox']
    },
    toolbox: {
        src: '../assets/images/objects/toolbox.png',
        width: 280, // 4x original size (2x from current)
        height: 280, // 4x original size (2x from current)
        x: 300,
        y: 400,
        tasks: ['toolbox']
    }
};

// Object configurations for Level 2
const level2Objects = {
    astronaut: {
        src: '../assets/images/objects/normal_astronaut.png',
        width: 600, // 3x current size (200 * 3)
        height: 600, // 3x current size (200 * 3)
        x: 100,
        y: 100,
        tasks: ['water-bottle', 'sandwich', 'book'],
        isTarget: true // Astronaut is a target for other objects
    },
    bottle: {
        src: '../assets/images/objects/bottle.png',
        width: 120,
        height: 120,
        x: 400,
        y: 200,
        tasks: ['water-collection'],
        isCollector: true // Bottle can collect water
    },
    water1: {
        src: '../assets/images/objects/water.png',
        width: 80,
        height: 80,
        x: 300,
        y: 300,
        tasks: ['water-collection'],
        isCollectible: true
    },
    water2: {
        src: '../assets/images/objects/water.png',
        width: 80,
        height: 80,
        x: 500,
        y: 150,
        tasks: ['water-collection'],
        isCollectible: true
    },
    water3: {
        src: '../assets/images/objects/water.png',
        width: 80,
        height: 80,
        x: 600,
        y: 400,
        tasks: ['water-collection'],
        isCollectible: true
    },
    sandwich: {
        src: '../assets/images/objects/sandwich.png',
        width: 100,
        height: 100,
        x: 200,
        y: 350,
        tasks: ['sandwich'],
        isConsumable: true
    },
    book: {
        src: '../assets/images/objects/book.png',
        width: 90,
        height: 90,
        x: 700,
        y: 250,
        tasks: ['book'],
        isGrabable: true
    }
};

// Object configurations for Level 3
const level3Objects = {
    phone: {
        src: '../assets/images/objects/phone.png',
        width: 180,
        height: 180,
        x: 200,
        y: 200,
        tasks: ['phone-fix'],
        isFixable: true,
        needsTool: 'wrench'
    },
    camera: {
        src: '../assets/images/objects/camera.png',
        width: 150,
        height: 150,
        x: 400,
        y: 300,
        tasks: ['camera-fix'],
        isFixable: true,
        needsTool: 'screwdriver'
    },
    wrench: {
        src: '../assets/images/objects/wrench.png',
        width: 80,
        height: 80,
        x: 600,
        y: 150,
        tasks: ['phone-fix', 'toolbox-organization'],
        isTool: true,
        usedFor: 'phone'
    },
    screwdriver: {
        src: '../assets/images/objects/screwdriver.png',
        width: 80,
        height: 80,
        x: 500,
        y: 400,
        tasks: ['camera-fix', 'toolbox-organization'],
        isTool: true,
        usedFor: 'camera'
    },
    toolbox: {
        src: '../assets/images/objects/toolbox.png',
        width: 280,
        height: 280,
        x: 300,
        y: 500,
        tasks: ['toolbox-organization', 'toolbox-placement'],
        isContainer: true
    },
    cable: {
        src: '../assets/images/objects/cable.png',
        width: 90,
        height: 90,
        x: 700,
        y: 250,
        tasks: ['toolbox-organization'],
        isItem: true
    }
};

// Drop zone configurations
const dropZones = {
    monitor: {
        x: 0.8, // 80% from left
        y: 0.6, // 60% from top (moved up from 80%)
        width: 0.15,
        height: 0.15
    },
    cpu: {
        x: 0.7, // 70% from left (next to monitor)
        y: 0.6, // 60% from top (moved up from 80%)
        width: 0.12,
        height: 0.12
    },
    toolbox: {
        x: 0.1, // 10% from left (left side)
        y: 0.5, // 50% from top (moved up from 70%)
        width: 0.12,
        height: 0.12
    },
    // Level 3 drop zone
    'toolbox-placement': {
        x: 0.8, // 80% from left
        y: 0.6, // 60% from top
        width: 0.15,
        height: 0.15
    }
};

// Initialize the module
document.addEventListener('DOMContentLoaded', () => {
    initZeroGTraining();
});

function initZeroGTraining() {
    console.log('🚀 Zero-G Training Module initialized!');
    
    // Initialize floating particles
    initFloatingParticles();
    
    // Set up level cards
    setupLevelCards();
    
    // Initialize global click sound
    initGlobalClickSound();
    
    // Start background music
    if (window.startBackgroundMusic) {
        window.startBackgroundMusic('module');
    }
    
    // Initialize sound toggle
    initSoundToggle();
    
    // Load saved progress
    loadProgress();
    
    // Award trophies for spending 30 seconds in Zero-G Training
    if (window.ISSperience && window.ISSperience.awardTrophy) {
        setTimeout(() => {
            window.ISSperience.awardTrophy('zeroGTraining', 'Zero-G Expert', 'Mastered zero gravity training', 6);
        }, 30000); // Award 6 trophies after 30 seconds in module
    }
}

function setupLevelCards() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
        const level = parseInt(card.dataset.level);
        
        // Update progress for all levels
        if (level === 1) {
            updateLevel1Progress();
        } else if (level === 2) {
            updateLevel2Progress();
        } else if (level === 3) {
            updateLevel3Progress();
        }
    });
}

function startLevel(levelNumber) {
    console.log(`🚀 Starting Level ${levelNumber}`);
    
    gameState.currentLevel = levelNumber;
    
    if (levelNumber === 1) {
        showBriefing();
    } else if (levelNumber === 2) {
        showLevel2Briefing();
    } else if (levelNumber === 3) {
        showLevel3Briefing();
    }
}

function showBriefing() {
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.add('active');
    
    // Set up briefing event listeners
    document.getElementById('cancelBriefing').addEventListener('click', cancelBriefing);
    document.getElementById('startGame').addEventListener('click', startLevel1);
}

function cancelBriefing() {
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.remove('active');
}

function showLevel2Briefing() {
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.add('active');
    
    // Update briefing content for Level 2
    const briefingHeader = briefingModal.querySelector('.briefing-header h2');
    const briefingSubtitle = briefingModal.querySelector('.briefing-header p');
    const taskGrid = briefingModal.querySelector('.task-grid');
    
    briefingHeader.textContent = '🚀 Level 2: Astronaut Survival';
    briefingSubtitle.textContent = 'Mission Briefing - Help the astronaut survive in zero gravity';
    
    taskGrid.innerHTML = `
        <div class="task-card">
            <div class="task-number">1</div>
            <div class="task-info">
                <h4>Collect Water</h4>
                <p>Use the bottle to collect all 3 floating water drops</p>
            </div>
        </div>
        <div class="task-card">
            <div class="task-number">2</div>
            <div class="task-info">
                <h4>Hydrate Astronaut</h4>
                <p>Give the water bottle to the astronaut</p>
            </div>
        </div>
        <div class="task-card">
            <div class="task-number">3</div>
            <div class="task-info">
                <h4>Feed Astronaut</h4>
                <p>Give the sandwich to the astronaut</p>
            </div>
        </div>
        <div class="task-card">
            <div class="task-number">4</div>
            <div class="task-info">
                <h4>Provide Entertainment</h4>
                <p>Give the book to the astronaut</p>
            </div>
        </div>
    `;
    
    // Set up briefing event listeners
    document.getElementById('cancelBriefing').addEventListener('click', cancelBriefing);
    document.getElementById('startGame').addEventListener('click', startLevel2);
}

function showLevel3Briefing() {
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.add('active');
    
    // Update briefing content for Level 3
    const briefingHeader = briefingModal.querySelector('.briefing-header h2');
    const briefingSubtitle = briefingModal.querySelector('.briefing-header p');
    const taskGrid = briefingModal.querySelector('.task-grid');
    
    briefingHeader.textContent = '🚀 Level 3: Equipment Maintenance';
    briefingSubtitle.textContent = 'Mission Briefing - Fix equipment and organize tools in zero gravity';
    
    taskGrid.innerHTML = `
        <div class="task-card">
            <div class="task-number">1</div>
            <div class="task-info">
                <h4>Fix Phone</h4>
                <p>Use the wrench to fix the floating phone</p>
            </div>
        </div>
        <div class="task-card">
            <div class="task-number">2</div>
            <div class="task-info">
                <h4>Fix Camera</h4>
                <p>Use the screwdriver to fix the floating camera</p>
            </div>
        </div>
        <div class="task-card">
            <div class="task-number">3</div>
            <div class="task-info">
                <h4>Organize Tools</h4>
                <p>Put all tools and items in the toolbox</p>
            </div>
        </div>
        <div class="task-card">
            <div class="task-number">4</div>
            <div class="task-info">
                <h4>Place Toolbox</h4>
                <p>Place the organized toolbox in the designated area</p>
            </div>
        </div>
    `;
    
    // Set up briefing event listeners
    document.getElementById('cancelBriefing').addEventListener('click', cancelBriefing);
    document.getElementById('startGame').addEventListener('click', startLevel3);
}

function startLevel1() {
    // Hide briefing modal
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.remove('active');
    
    // Show game container
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.add('active');
    
    // Set background
    const gameArea = document.getElementById('gameArea');
    gameArea.style.backgroundImage = 'url(../assets/images/levels/inside-1.jpg)';
    
    // Initialize physics
    initPhysics();
    
    // Create objects
    createLevel1Objects();
    
    // Create drop zones
    createDropZones();
    
    // Set up event listeners
    setupGameEventListeners();
    
    // Reset tasks
    resetTasks();
    updateTaskList();
}

function startLevel2() {
    // Hide briefing modal
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.remove('active');
    
    // Show game container
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.add('active');
    
    // Update game title
    const gameTitle = document.querySelector('.game-title h2');
    const gameSubtitle = document.querySelector('.game-title p');
    gameTitle.textContent = 'Level 2: Astronaut Survival';
    gameSubtitle.textContent = 'Help the astronaut survive in zero gravity';
    
    // Set background
    const gameArea = document.getElementById('gameArea');
    gameArea.style.backgroundImage = 'url(../assets/images/levels/inside-2.jpg)';
    
    // Initialize physics
    initPhysics();
    
    // Create objects
    createLevel2Objects();
    
    // Set up event listeners
    setupGameEventListeners();
    
    // Reset tasks
    resetLevel2Tasks();
    updateLevel2TaskList();
    
    // Update task list for Level 2
    updateLevel2TaskListHTML();
}

function startLevel3() {
    // Hide briefing modal
    const briefingModal = document.getElementById('briefingModal');
    briefingModal.classList.remove('active');
    
    // Show game container
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.add('active');
    
    // Update game title
    const gameTitle = document.querySelector('.game-title h2');
    const gameSubtitle = document.querySelector('.game-title p');
    gameTitle.textContent = 'Level 3: Equipment Maintenance';
    gameSubtitle.textContent = 'Fix equipment and organize tools in zero gravity';
    
    // Set background
    const gameArea = document.getElementById('gameArea');
    gameArea.style.backgroundImage = 'url(../assets/images/levels/inside-3.jpg)';
    
    // Initialize physics
    initPhysics();
    
    // Create objects
    createLevel3Objects();
    
    // Create drop zones
    createDropZones();
    
    // Set up event listeners
    setupGameEventListeners();
    
    // Reset tasks
    resetLevel3Tasks();
    updateLevel3TaskList();
    
    // Update task list for Level 3
    updateLevel3TaskListHTML();
    
    // Update progress
    updateLevel3Progress();
}

function updateLevel2TaskListHTML() {
    const taskItems = document.getElementById('taskItems');
    taskItems.innerHTML = `
        <li class="task-item" data-task="water-collection">1. Collect all 3 water drops in bottle</li>
        <li class="task-item" data-task="water-bottle">2. Give water bottle to astronaut</li>
        <li class="task-item" data-task="sandwich">3. Feed sandwich to astronaut</li>
        <li class="task-item" data-task="book">4. Give book to astronaut</li>
    `;
}

function updateLevel3TaskListHTML() {
    const taskItems = document.getElementById('taskItems');
    taskItems.innerHTML = `
        <li class="task-item" data-task="phone-fix">1. Fix phone with wrench</li>
        <li class="task-item" data-task="camera-fix">2. Fix camera with screwdriver</li>
        <li class="task-item" data-task="toolbox-organization">3. Put all tools and items in toolbox</li>
        <li class="task-item" data-task="toolbox-placement">4. Place toolbox in designated area</li>
    `;
}

function resetLevel3Tasks() {
    // Reset Level 3 specific tasks
    gameState.tasks['phone-fix'].completed = false;
    gameState.tasks['camera-fix'].completed = false;
    gameState.tasks['toolbox-organization'].completed = false;
    gameState.tasks['toolbox-placement'].completed = false;
}

function updateLevel3TaskList() {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const taskId = item.dataset.task;
        if (gameState.tasks[taskId] && gameState.tasks[taskId].completed) {
            item.classList.add('completed');
        }
    });
}

// Remove duplicate function - this is handled in the new startLevel1 function above

function initPhysics() {
    // Simple floating animation without complex physics
    addFloatingPhysics();
}

function createLevel1Objects() {
    const floatingObjects = document.getElementById('floatingObjects');
    floatingObjects.innerHTML = '';
    
    Object.keys(level1Objects).forEach(objectId => {
        const config = level1Objects[objectId];
        const object = createFloatingObject(objectId, config);
        floatingObjects.appendChild(object);
        gameState.objects[objectId] = object;
    });
}

function createLevel2Objects() {
    const floatingObjects = document.getElementById('floatingObjects');
    floatingObjects.innerHTML = '';
    
    Object.keys(level2Objects).forEach(objectId => {
        const config = level2Objects[objectId];
        const object = createFloatingObject(objectId, config);
        floatingObjects.appendChild(object);
        gameState.objects[objectId] = object;
    });
}

function createLevel3Objects() {
    const floatingObjects = document.getElementById('floatingObjects');
    floatingObjects.innerHTML = '';
    
    Object.keys(level3Objects).forEach(objectId => {
        const config = level3Objects[objectId];
        const object = createFloatingObject(objectId, config);
        floatingObjects.appendChild(object);
        gameState.objects[objectId] = object;
    });
}

function createFloatingObject(id, config) {
    const object = document.createElement('div');
    object.className = 'floating-object';
    object.id = `object-${id}`;
    object.dataset.objectId = id;
    
    // Set image
    const img = document.createElement('img');
    img.src = config.src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    object.appendChild(img);
    
    // Set size and position
    object.style.width = `${config.width}px`;
    object.style.height = `${config.height}px`;
    object.style.left = `${config.x}px`;
    object.style.top = `${config.y}px`;
    
    // Add floating animation
    addFloatingAnimation(object);
    
    return object;
}

function addFloatingPhysics() {
    // Simple floating animation using CSS transforms
    Object.values(gameState.objects).forEach(object => {
        if (!object.classList.contains('placed')) {
            // Add random floating movement
            const duration = 3000 + Math.random() * 2000; // 3-5 seconds
            const amplitude = 15 + Math.random() * 10; // 15-25px movement
            
            object.style.animation = `float-gentle ${duration}ms ease-in-out infinite`;
            object.style.animationDelay = `${Math.random() * 2000}ms`;
        }
    });
}

function addFloatingAnimation(object) {
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds
    const amplitude = 20 + Math.random() * 10; // 20-30px
    const delay = Math.random() * 2000; // 0-2 seconds
    
    object.style.animation = `float ${duration}ms ease-in-out infinite`;
    object.style.animationDelay = `${delay}ms`;
    
    // Add CSS animation if not exists
    if (!document.getElementById('float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-${amplitude}px) rotate(1deg); }
                50% { transform: translateY(-${amplitude/2}px) rotate(0deg); }
                75% { transform: translateY(-${amplitude}px) rotate(-1deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createDropZones() {
    const gameArea = document.getElementById('gameArea');
    
    // Clear existing drop zones
    const existingZones = gameArea.querySelectorAll('.drop-zone');
    existingZones.forEach(zone => zone.remove());
    gameState.dropZones = {};
    
    console.log(`Creating drop zones for Level ${gameState.currentLevel}`); // Debug log
    
    // Create drop zones based on current level
    if (gameState.currentLevel === 1) {
        // Level 1 drop zones
        const level1Zones = ['monitor', 'cpu', 'toolbox'];
        level1Zones.forEach(zoneId => {
            createSingleDropZone(zoneId, gameArea);
        });
    } else if (gameState.currentLevel === 3) {
        // Level 3 drop zone
        console.log('Creating toolbox-placement drop zone'); // Debug log
        createSingleDropZone('toolbox-placement', gameArea);
    }
}

function createSingleDropZone(zoneId, gameArea) {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.id = `drop-${zoneId}`;
    zone.dataset.zoneId = zoneId;
    
    const config = dropZones[zoneId];
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    zone.style.left = `${config.x * gameAreaRect.width}px`;
    zone.style.top = `${config.y * gameAreaRect.height}px`;
    zone.style.width = `${config.width * gameAreaRect.width}px`;
    zone.style.height = `${config.height * gameAreaRect.height}px`;
    
    gameArea.appendChild(zone);
    gameState.dropZones[zoneId] = zone;
    
    console.log(`Created drop zone: ${zoneId} at (${zone.style.left}, ${zone.style.top})`); // Debug log
}

function setupGameEventListeners() {
    // Object drag events
    Object.values(gameState.objects).forEach(object => {
        object.addEventListener('mousedown', startDrag);
        object.addEventListener('touchstart', startDrag);
    });
    
    // Global mouse/touch events
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    // Game control buttons
    document.getElementById('showTasksButton').addEventListener('click', toggleTasks);
    document.getElementById('pauseButton').addEventListener('click', pauseGame);
    document.getElementById('restartButton').addEventListener('click', restartLevel);
    document.getElementById('closeButton').addEventListener('click', closeGame);
}

function startDrag(e) {
    e.preventDefault();
    gameState.isDragging = true;
    gameState.draggedObject = e.currentTarget;
    gameState.draggedObject.classList.add('dragging');
    
    // Stop floating animation while dragging
    gameState.draggedObject.style.animation = 'none';
    
    // Show relevant drop zones based on current level
    const objectId = gameState.draggedObject.dataset.objectId;
    
    if (gameState.currentLevel === 1) {
        const config = level1Objects[objectId];
        if (config) {
            config.tasks.forEach(task => {
                if (task === 'monitor' && !gameState.tasks.monitor.completed) {
                    showDropZone('monitor');
                } else if (task === 'cpu' && !gameState.tasks.cpu.completed) {
                    showDropZone('cpu');
                } else if (task === 'toolbox' && !gameState.tasks.toolbox.completed) {
                    showDropZone('toolbox');
                }
            });
        }
    } else if (gameState.currentLevel === 3) {
        const config = level3Objects[objectId];
        console.log(`Level 3 drag: ${objectId}, config:`, config); // Debug log
        if (config) {
            config.tasks.forEach(task => {
                console.log(`Checking task: ${task}, completed: ${gameState.tasks[task]?.completed}`); // Debug log
                if (task === 'toolbox-placement' && !gameState.tasks['toolbox-placement'].completed) {
                    console.log('Showing toolbox-placement drop zone'); // Debug log
                    showDropZone('toolbox-placement');
                }
            });
        }
    }
}

function drag(e) {
    if (!gameState.isDragging || !gameState.draggedObject) return;
    
    e.preventDefault();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const gameArea = document.getElementById('gameArea');
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    const x = clientX - gameAreaRect.left - (gameState.draggedObject.offsetWidth / 2);
    const y = clientY - gameAreaRect.top - (gameState.draggedObject.offsetHeight / 2);
    
    gameState.draggedObject.style.left = `${Math.max(0, Math.min(x, gameAreaRect.width - gameState.draggedObject.offsetWidth))}px`;
    gameState.draggedObject.style.top = `${Math.max(0, Math.min(y, gameAreaRect.height - gameState.draggedObject.offsetHeight))}px`;
}

function endDrag(e) {
    if (!gameState.isDragging || !gameState.draggedObject) return;
    
    e.preventDefault();
    
    const objectId = gameState.draggedObject.dataset.objectId;
    const objectRect = gameState.draggedObject.getBoundingClientRect();
    
    // Check for drop zone collisions (Level 1)
    let dropped = false;
    
    if (gameState.currentLevel === 1) {
        Object.keys(gameState.dropZones).forEach(zoneId => {
            const zone = gameState.dropZones[zoneId];
            const zoneRect = zone.getBoundingClientRect();
            
            if (isOverlapping(objectRect, zoneRect)) {
                handleObjectDrop(objectId, zoneId);
                dropped = true;
            }
        });
        
        // If not dropped in a zone, check for toolbox interactions
        if (!dropped) {
            checkToolboxInteraction(objectId, objectRect);
        }
    } else if (gameState.currentLevel === 3) {
        // Check for drop zone collisions (Level 3)
        Object.keys(gameState.dropZones).forEach(zoneId => {
            const zone = gameState.dropZones[zoneId];
            const zoneRect = zone.getBoundingClientRect();
            
            if (isOverlapping(objectRect, zoneRect)) {
                handleObjectDrop(objectId, zoneId);
                dropped = true;
            }
        });
        
        // If not dropped in a zone, check for other interactions
        if (!dropped) {
            checkLevel3Interactions(objectId, objectRect);
        }
    } else if (gameState.currentLevel === 2) {
        // Level 2 interactions
        checkLevel2Interactions(objectId, objectRect);
    }
    
    // Re-enable floating animation if not placed
    if (!gameState.draggedObject.classList.contains('placed')) {
        const duration = 3000 + Math.random() * 2000;
        gameState.draggedObject.style.animation = `float-gentle ${duration}ms ease-in-out infinite`;
    }
    
    // Clean up
    gameState.draggedObject.classList.remove('dragging');
    gameState.isDragging = false;
    gameState.draggedObject = null;
    
    // Hide all drop zones
    Object.values(gameState.dropZones).forEach(zone => {
        zone.classList.remove('active');
    });
}

function isOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function handleObjectDrop(objectId, zoneId) {
    const object = gameState.objects[objectId];
    const zone = gameState.dropZones[zoneId];
    
    // Position object in drop zone
    const zoneRect = zone.getBoundingClientRect();
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    
    object.style.left = `${zoneRect.left - gameAreaRect.left}px`;
    object.style.top = `${zoneRect.top - gameAreaRect.top}px`;
    object.classList.add('placed');
    
    // Stop floating animation for placed objects
    object.style.animation = 'none';
    
    // Mark zone as occupied
    zone.classList.add('occupied');
    
    // Complete task
    if (objectId === 'monitor' && zoneId === 'monitor') {
        completeTask('monitor');
    } else if (objectId === 'cpu' && zoneId === 'cpu') {
        completeTask('cpu');
        // Show CPU fixing animation
        showCPUFixingAnimation(object);
    } else if (objectId === 'toolbox' && zoneId === 'toolbox') {
        completeTask('toolbox');
    } else if (objectId === 'toolbox' && zoneId === 'toolbox-placement') {
        completeTask('toolbox-placement');
    }
}

function showCPUFixingAnimation(cpuObject) {
    // Create spinning animation element
    const animation = document.createElement('div');
    animation.className = 'cpu-fixing-animation';
    
    // Position it over the CPU
    const cpuRect = cpuObject.getBoundingClientRect();
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    
    animation.style.left = `${cpuRect.left - gameAreaRect.left + cpuRect.width / 2}px`;
    animation.style.top = `${cpuRect.top - gameAreaRect.top + cpuRect.height / 2}px`;
    
    // Add to game area
    document.getElementById('gameArea').appendChild(animation);
    
    // Remove after 2 seconds and complete screwdriver task
    setTimeout(() => {
        animation.remove();
        completeTask('screwdriver'); // CPU is fixed with screwdriver
    }, 2000);
}

function checkToolboxInteraction(objectId, objectRect) {
    if (objectId === 'screwdriver' && gameState.tasks.toolbox.completed) {
        const toolbox = gameState.objects.toolbox;
        const toolboxRect = toolbox.getBoundingClientRect();
        
        if (isOverlapping(objectRect, toolboxRect)) {
            // Put screwdriver in toolbox and hide it
            const toolboxCenterX = toolboxRect.left + toolboxRect.width / 2;
            const toolboxCenterY = toolboxRect.top + toolboxRect.height / 2;
            
            const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
            gameState.objects.screwdriver.style.left = `${toolboxCenterX - gameAreaRect.left - 25}px`;
            gameState.objects.screwdriver.style.top = `${toolboxCenterY - gameAreaRect.top - 25}px`;
            gameState.objects.screwdriver.classList.add('placed', 'hidden');
            
            completeTask('screwdriver-toolbox');
        }
    }
}

function checkLevel2Interactions(objectId, objectRect) {
    const config = level2Objects[objectId];
    if (!config) return;
    
    // Check water collection (bottle collecting water)
    if (objectId === 'bottle' && config.isCollector) {
        Object.keys(gameState.objects).forEach(targetId => {
            const targetConfig = level2Objects[targetId];
            if (targetConfig && targetConfig.isCollectible && targetId.startsWith('water')) {
                const targetObject = gameState.objects[targetId];
                const targetRect = targetObject.getBoundingClientRect();
                
                if (isOverlapping(objectRect, targetRect)) {
                    collectWater(targetId);
                }
            }
        });
    }
    
    // Check astronaut interactions
    const astronaut = gameState.objects.astronaut;
    if (astronaut) {
        const astronautRect = astronaut.getBoundingClientRect();
        
        if (isOverlapping(objectRect, astronautRect)) {
            handleAstronautInteraction(objectId, objectRect, astronautRect);
        }
    }
}

function collectWater(waterId) {
    const waterObject = gameState.objects[waterId];
    if (waterObject && !waterObject.classList.contains('hidden')) {
        // Hide the water drop
        waterObject.classList.add('hidden');
        gameState.collectedWater++;
        
        // Check if all water is collected
        if (gameState.collectedWater >= gameState.maxWater) {
            completeTask('water-collection');
        }
    }
}

function handleAstronautInteraction(objectId, objectRect, astronautRect) {
    const config = level2Objects[objectId];
    if (!config) return;
    
    // Position object near astronaut
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    const object = gameState.objects[objectId];
    
    if (objectId === 'bottle' && gameState.tasks['water-collection'].completed) {
        // Give water bottle to astronaut
        object.style.left = `${astronautRect.left - gameAreaRect.left + 50}px`;
        object.style.top = `${astronautRect.top - gameAreaRect.top + 50}px`;
        object.classList.add('placed', 'hidden');
        completeTask('water-bottle');
        
    } else if (objectId === 'sandwich' && config.isConsumable) {
        // Feed sandwich to astronaut
        object.style.left = `${astronautRect.left - gameAreaRect.left + 30}px`;
        object.style.top = `${astronautRect.top - gameAreaRect.top + 30}px`;
        object.classList.add('placed', 'hidden');
        completeTask('sandwich');
        
    } else if (objectId === 'book' && config.isGrabable) {
        // Give book to astronaut - attach to astronaut
        object.style.left = `${astronautRect.left - gameAreaRect.left + 20}px`;
        object.style.top = `${astronautRect.top - gameAreaRect.top + 20}px`;
        object.classList.add('placed');
        completeTask('book');
    }
}

function checkLevel3Interactions(objectId, objectRect) {
    const config = level3Objects[objectId];
    if (!config) return;
    
    // Check fixing interactions (tools with equipment)
    if (config.isTool) {
        Object.keys(gameState.objects).forEach(targetId => {
            const targetConfig = level3Objects[targetId];
            if (targetConfig && targetConfig.isFixable && targetConfig.needsTool === objectId) {
                const targetObject = gameState.objects[targetId];
                const targetRect = targetObject.getBoundingClientRect();
                
                if (isOverlapping(objectRect, targetRect)) {
                    handleFixingInteraction(objectId, targetId);
                }
            }
        });
    }
    
    // Check toolbox interactions
    const toolbox = gameState.objects.toolbox;
    if (toolbox) {
        const toolboxRect = toolbox.getBoundingClientRect();
        
        if (isOverlapping(objectRect, toolboxRect)) {
            handleToolboxInteraction(objectId, objectRect, toolboxRect);
        }
    }
    
    // Toolbox placement is now handled in the main drop zone collision detection
}

function handleFixingInteraction(toolId, equipmentId) {
    const tool = gameState.objects[toolId];
    const equipment = gameState.objects[equipmentId];
    
    // Position tool near equipment
    const equipmentRect = equipment.getBoundingClientRect();
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    
    tool.style.left = `${equipmentRect.left - gameAreaRect.left + 20}px`;
    tool.style.top = `${equipmentRect.top - gameAreaRect.top + 20}px`;
    tool.classList.add('placed');
    
    // Show fixing animation
    showFixingAnimation(equipment);
    
    // Complete the fixing task
    if (equipmentId === 'phone') {
        completeTask('phone-fix');
    } else if (equipmentId === 'camera') {
        completeTask('camera-fix');
    }
}

function showFixingAnimation(equipment) {
    // Create fixing animation element
    const animation = document.createElement('div');
    animation.className = 'cpu-fixing-animation'; // Reuse the same animation style
    
    // Position it over the equipment
    const equipmentRect = equipment.getBoundingClientRect();
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    
    animation.style.left = `${equipmentRect.left - gameAreaRect.left + equipmentRect.width / 2}px`;
    animation.style.top = `${equipmentRect.top - gameAreaRect.top + equipmentRect.height / 2}px`;
    
    // Add to game area
    document.getElementById('gameArea').appendChild(animation);
    
    // Remove after 2 seconds
    setTimeout(() => {
        animation.remove();
    }, 2000);
}

function handleToolboxInteraction(objectId, objectRect, toolboxRect) {
    const config = level3Objects[objectId];
    if (!config) return;
    
    // Check if tools can be put in toolbox (only after fixing is done)
    if (config.isTool) {
        const toolUsedFor = config.usedFor;
        const fixingTask = toolUsedFor + '-fix';
        
        // Only allow tools in toolbox if their fixing task is completed
        if (gameState.tasks[fixingTask] && gameState.tasks[fixingTask].completed) {
            putObjectInToolbox(objectId, objectRect, toolboxRect);
        }
    } else if (config.isItem) {
        // Items can always be put in toolbox
        putObjectInToolbox(objectId, objectRect, toolboxRect);
    }
}

function putObjectInToolbox(objectId, objectRect, toolboxRect) {
    const object = gameState.objects[objectId];
    
    // Position object in toolbox
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    object.style.left = `${toolboxRect.left - gameAreaRect.left + toolboxRect.width / 2 - object.offsetWidth / 2}px`;
    object.style.top = `${toolboxRect.top - gameAreaRect.top + toolboxRect.height / 2 - object.offsetHeight / 2}px`;
    object.classList.add('placed', 'hidden');
    
    // Check if all items are in toolbox
    checkToolboxOrganization();
}

function checkToolboxOrganization() {
    const allItems = ['wrench', 'screwdriver', 'cable'];
    const allInToolbox = allItems.every(itemId => {
        const item = gameState.objects[itemId];
        return item && item.classList.contains('hidden');
    });
    
    if (allInToolbox) {
        completeTask('toolbox-organization');
    }
}

// handleToolboxPlacement is now handled in handleObjectDrop function

function showDropZone(zoneId) {
    const zone = gameState.dropZones[zoneId];
    if (zone) {
        zone.classList.add('active');
        console.log(`Showing drop zone: ${zoneId}`); // Debug log
    } else {
        console.log(`Drop zone not found: ${zoneId}`); // Debug log
    }
}

function completeTask(taskId) {
    if (gameState.tasks[taskId]) {
        gameState.tasks[taskId].completed = true;
        updateTaskList();
        
        // Update progress based on current level
        if (gameState.currentLevel === 1) {
            updateLevel1Progress();
        } else if (gameState.currentLevel === 2) {
            updateLevel2Progress();
        } else if (gameState.currentLevel === 3) {
            updateLevel3Progress();
        }
        
        saveProgress();
        
        // Check if level is complete
        if (isLevelComplete()) {
            showLevelCompletion();
        }
    }
}

function updateTaskList() {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const taskId = item.dataset.task;
        if (gameState.tasks[taskId] && gameState.tasks[taskId].completed) {
            item.classList.add('completed');
        }
    });
}

function updateLevel1Progress() {
    // Level 1 specific tasks
    const level1TaskIds = ['monitor', 'cpu', 'screwdriver', 'toolbox', 'screwdriver-toolbox'];
    const completedTasks = level1TaskIds.filter(taskId => gameState.tasks[taskId].completed).length;
    const totalTasks = level1TaskIds.length;
    const progress = (completedTasks / totalTasks) * 100;
    
    const progressFill = document.getElementById('level1Progress');
    const progressText = document.getElementById('level1ProgressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completedTasks}/${totalTasks} Tasks`;
    }
    
    // Update level card
    const level1Card = document.getElementById('level1Card');
    if (completedTasks === totalTasks) {
        level1Card.querySelector('.level-badge').innerHTML = '<span class="badge-icon">✅</span><span class="badge-text">Completed!</span>';
        level1Card.querySelector('.level-badge').classList.remove('unlocked');
        level1Card.querySelector('.level-badge').classList.add('completed');
    }
}

function updateLevel2Progress() {
    const level2Tasks = ['water-collection', 'water-bottle', 'sandwich', 'book'];
    const completedTasks = level2Tasks.filter(taskId => gameState.tasks[taskId].completed).length;
    const totalTasks = level2Tasks.length;
    const progress = (completedTasks / totalTasks) * 100;
    
    const progressFill = document.getElementById('level2Progress');
    const progressText = document.getElementById('level2ProgressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completedTasks}/${totalTasks} Tasks`;
    }
    
    // Update level card
    const level2Card = document.getElementById('level2Card');
    if (completedTasks === totalTasks) {
        level2Card.querySelector('.level-badge').innerHTML = '<span class="badge-icon">✅</span><span class="badge-text">Completed!</span>';
        level2Card.querySelector('.level-badge').classList.remove('unlocked');
        level2Card.querySelector('.level-badge').classList.add('completed');
    }
}

function updateLevel3Progress() {
    const level3Tasks = ['phone-fix', 'camera-fix', 'toolbox-organization', 'toolbox-placement'];
    const completedTasks = level3Tasks.filter(taskId => gameState.tasks[taskId].completed).length;
    const totalTasks = level3Tasks.length;
    const progress = (completedTasks / totalTasks) * 100;
    
    const progressFill = document.getElementById('level3Progress');
    const progressText = document.getElementById('level3ProgressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completedTasks}/${totalTasks} Tasks`;
    }
    
    // Update level card
    const level3Card = document.getElementById('level3Card');
    if (completedTasks === totalTasks) {
        level3Card.querySelector('.level-badge').innerHTML = '<span class="badge-icon">✅</span><span class="badge-text">Completed!</span>';
        level3Card.querySelector('.level-badge').classList.remove('unlocked');
        level3Card.querySelector('.level-badge').classList.add('completed');
    }
}

function isLevelComplete() {
    if (gameState.currentLevel === 1) {
        // Level 1 tasks
        return gameState.tasks.monitor.completed && 
               gameState.tasks.cpu.completed && 
               gameState.tasks.screwdriver.completed && 
               gameState.tasks.toolbox.completed && 
               gameState.tasks['screwdriver-toolbox'].completed;
    } else if (gameState.currentLevel === 2) {
        // Level 2 tasks
        return gameState.tasks['water-collection'].completed && 
               gameState.tasks['water-bottle'].completed && 
               gameState.tasks.sandwich.completed && 
               gameState.tasks.book.completed;
    } else if (gameState.currentLevel === 3) {
        // Level 3 tasks
        return gameState.tasks['phone-fix'].completed && 
               gameState.tasks['camera-fix'].completed && 
               gameState.tasks['toolbox-organization'].completed && 
               gameState.tasks['toolbox-placement'].completed;
    }
    return false;
}

function showLevelCompletion() {
    const completionDiv = document.createElement('div');
    completionDiv.className = 'completion-animation';
    
    if (gameState.currentLevel === 1) {
        completionDiv.innerHTML = `
            <h2>🎉 Level 1 Complete!</h2>
            <p>Excellent work, astronaut! You've successfully set up the computer station in zero gravity.</p>
            <button class="control-button" onclick="closeGame()">Continue</button>
        `;
    } else if (gameState.currentLevel === 2) {
        completionDiv.innerHTML = `
            <h2>🎉 Level 2 Complete!</h2>
            <p>Outstanding work! You've successfully helped the astronaut survive in zero gravity. Mission accomplished!</p>
            <button class="control-button" onclick="closeGame()">Continue</button>
        `;
    } else if (gameState.currentLevel === 3) {
        completionDiv.innerHTML = `
            <h2>🎉 Level 3 Complete!</h2>
            <p>Excellent work! You've successfully maintained equipment and organized tools in zero gravity. Mission accomplished!</p>
            <button class="control-button" onclick="closeGame()">Continue</button>
        `;
    }
    
    document.body.appendChild(completionDiv);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (completionDiv.parentNode) {
            completionDiv.remove();
        }
    }, 5000);
}

function resetTasks() {
    Object.keys(gameState.tasks).forEach(taskId => {
        gameState.tasks[taskId].completed = false;
    });
}

function resetLevel2Tasks() {
    // Reset Level 2 specific tasks
    gameState.tasks['water-collection'].completed = false;
    gameState.tasks['water-bottle'].completed = false;
    gameState.tasks['sandwich'].completed = false;
    gameState.tasks['book'].completed = false;
    gameState.collectedWater = 0;
}

function updateLevel2TaskList() {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const taskId = item.dataset.task;
        if (gameState.tasks[taskId] && gameState.tasks[taskId].completed) {
            item.classList.add('completed');
        }
    });
}

function toggleTasks() {
    const gameUI = document.getElementById('gameUI');
    const showTasksButton = document.getElementById('showTasksButton');
    
    if (gameUI.classList.contains('hidden')) {
        gameUI.classList.remove('hidden');
        showTasksButton.textContent = '🎮 Hide Tasks';
    } else {
        gameUI.classList.add('hidden');
        showTasksButton.textContent = '📋 Tasks';
    }
}

function pauseGame() {
    // Implement pause functionality
    console.log('Game paused');
}

function restartLevel() {
    // Clear any completion animations
    const completionDiv = document.querySelector('.completion-animation');
    if (completionDiv) {
        completionDiv.remove();
    }
    
    if (gameState.currentLevel === 1) {
        // Reset Level 1
        resetTasks();
        createLevel1Objects();
        updateTaskList();
        updateLevel1Progress();
    } else if (gameState.currentLevel === 2) {
        // Reset Level 2
        resetLevel2Tasks();
        createLevel2Objects();
        updateLevel2TaskList();
        updateLevel2Progress();
        updateLevel2TaskListHTML();
    } else if (gameState.currentLevel === 3) {
        // Reset Level 3
        resetLevel3Tasks();
        createLevel3Objects();
        updateLevel3TaskList();
        updateLevel3TaskListHTML();
        updateLevel3Progress();
    }
}

function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.remove('active');
    
    // Clean up
    if (gameState.physics) {
        Matter.Engine.clear(gameState.physics);
    }
    
    // Remove completion animation if exists
    const completion = document.querySelector('.completion-animation');
    if (completion) {
        completion.remove();
    }
}

function loadProgress() {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('zeroGProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        // Apply saved progress
        console.log('Loaded progress:', progress);
    }
}

function saveProgress() {
    // Save progress to localStorage
    const progress = {
        level1: {
            completed: isLevelComplete(),
            tasks: gameState.tasks
        }
    };
    localStorage.setItem('zeroGProgress', JSON.stringify(progress));
}

// Initialize floating particles for the training module
function initFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        particlesContainer.appendChild(particle);
    }
}
