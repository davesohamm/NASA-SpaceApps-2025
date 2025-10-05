// ===================================
// Knowledge Center Module - ISS & NBL Learning Experience
// Version: 1.0.0 - Complete functionality with comprehensive data
// ===================================

(function() {
    'use strict';
    
    console.log('📚 Knowledge Center Module v1.0.0 loading...');

    // ===================================
    // Global Variables
    // ===================================
    
    let currentTimelineIndex = 0;
    let currentQuizAnswers = {};
    let soundEnabled = true;

    // ===================================
    // Sound System
    // ===================================
    
    function initSoundToggle() {
        const soundToggle = document.getElementById('soundToggle');
        if (!soundToggle) return;
        
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.classList.toggle('muted', !soundEnabled);
            
            const soundIcon = soundToggle.querySelector('.sound-icon');
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
            
            playSound('click');
        });
    }

    function playSound(soundName) {
        if (!soundEnabled) return;
        
        try {
            const audio = new Audio(`../assets/sounds/${soundName}.wav`);
            audio.volume = 0.3;
            audio.play().catch(err => console.log('Audio play failed:', err));
        } catch (error) {
            console.log(`Sound file not found: ${soundName}.wav`);
        }
    }

    // ===================================
    // ISS Timeline Data
    // ===================================
    
    const issTimelineData = [
        {
            year: 1998,
            title: "ISS Assembly Begins",
            description: "First module Zarya launched from Kazakhstan",
            image: "../assets/images/iss_smol.png",
            story: "The International Space Station assembly began with the launch of the Russian Zarya module on November 20, 1998, marking the dawn of a new era in space exploration. This 20-ton module, meaning 'sunrise' in Russian, was built by Russia but funded by the United States, symbolizing the international cooperation that would define the ISS. Zarya provided the station's initial power and propulsion capabilities, serving as the foundation for all future modules. The module's solar arrays, spanning 24 meters, generated 3 kilowatts of power, while its 16 fuel tanks could hold 6 tons of propellant. This launch represented the culmination of years of planning between NASA, Roscosmos, and international partners, setting the stage for humanity's most ambitious space project. The successful deployment of Zarya proved that complex space assembly missions were possible, paving the way for the continuous human presence in space that would follow.",
            quiz: [
                {
                    question: "What does 'Zarya' mean in Russian?",
                    options: ["Sunrise", "Star", "Space", "Station"],
                    correct: 0
                },
                {
                    question: "How much did the Zarya module weigh?",
                    options: ["10 tons", "15 tons", "20 tons", "25 tons"],
                    correct: 2
                }
            ]
        },
        {
            year: 2000,
            title: "First Permanent Crew",
            description: "Expedition 1 crew arrives at ISS",
            image: "../assets/images/iss_smol.png",
            story: "On November 2, 2000, history was made when the first permanent crew arrived at the International Space Station, marking the beginning of continuous human presence in space. Expedition 1 consisted of Commander Bill Shepherd (USA), Flight Engineer Sergei Krikalev (Russia), and Flight Engineer Yuri Gidzenko (Russia), representing the international cooperation that defines the ISS. These three astronauts spent an incredible 136 days aboard the station, establishing the foundation for all future space missions. During their mission, they activated the station's life support systems, conducted the first spacewalks, and proved that humans could live and work in space for extended periods. Commander Shepherd, a Navy SEAL, brought military precision to space operations, while Krikalev, a veteran of the Mir space station, provided crucial Russian expertise. Their mission demonstrated that international cooperation in space was not only possible but essential for humanity's future in space exploration.",
            quiz: [
                {
                    question: "How long did Expedition 1 stay aboard the ISS?",
                    options: ["90 days", "136 days", "200 days", "365 days"],
                    correct: 1
                },
                {
                    question: "Who was the Commander of Expedition 1?",
                    options: ["Sergei Krikalev", "Bill Shepherd", "Yuri Gidzenko", "John Glenn"],
                    correct: 1
                }
            ]
        },
        {
            year: 2001,
            title: "Destiny Laboratory",
            description: "US Laboratory module added to ISS",
            image: "../assets/images/iss_smol.png",
            story: "The Destiny laboratory module, the centerpiece of the US segment, was added to the International Space Station in February 2001, transforming the station into a world-class research facility. This 16-ton module, measuring 8.5 meters long and 4.3 meters in diameter, houses most of the station's research equipment and provides a pressurized environment for scientific experiments in microgravity. Destiny contains 13 racks for scientific equipment, including the Microgravity Science Glovebox, the Materials Science Research Rack, and the Human Research Facility. The module's large windows allow astronauts to observe Earth and conduct experiments requiring natural lighting. Destiny's advanced life support systems can maintain a crew of six astronauts, making it the heart of the US segment. This laboratory has been the site of groundbreaking research in biology, physics, materials science, and human physiology, contributing to our understanding of how things behave in the unique environment of space.",
            quiz: [
                {
                    question: "What is the Destiny module primarily used for?",
                    options: ["Sleeping quarters", "Scientific research", "Storage", "Exercise"],
                    correct: 1
                }
            ]
        },
        {
            year: 2003,
            title: "Columbia Tragedy",
            description: "Space Shuttle Columbia disaster affects ISS",
            image: "../assets/images/iss_smol.png",
            story: "The Columbia disaster on February 1, 2003, marked one of the darkest days in space exploration history, when the Space Shuttle Columbia disintegrated during re-entry, claiming the lives of seven astronauts. This tragic event grounded the Space Shuttle fleet for over two years, forcing the International Space Station to operate with reduced crews and delaying the addition of major modules. The disaster forced NASA to completely rethink its approach to space safety, implementing new inspection procedures and emergency protocols. During this period, the ISS relied entirely on Russian Soyuz spacecraft for crew transport and resupply missions, demonstrating the importance of international partnerships in space exploration. The station's crew was reduced to just two astronauts for extended periods, limiting scientific research but maintaining the continuous human presence in space. This tragedy ultimately led to improved safety measures and a renewed commitment to the safety of astronauts, while also highlighting the resilience of the international space community in the face of adversity.",
            quiz: [
                {
                    question: "How long was the Space Shuttle fleet grounded after Columbia?",
                    options: ["6 months", "1 year", "Over 2 years", "5 years"],
                    correct: 2
                }
            ]
        },
        {
            year: 2006,
            title: "Solar Arrays Deployed",
            description: "Major power expansion for ISS",
            image: "../assets/images/iss_smol.png",
            story: "The International Space Station received a major power upgrade with the deployment of new solar arrays in 2006, significantly expanding the station's capabilities for scientific research and crew operations. These massive arrays, spanning 240 feet (73 meters) from tip to tip, provide the station with 84 kilowatts of power, enough to support a small neighborhood on Earth. The solar arrays are made up of thousands of individual solar cells that convert sunlight into electricity, with each array containing over 32,000 solar cells. These arrays can rotate to track the Sun as the station orbits Earth, maximizing power generation during the station's 16 daily sunrises and sunsets. The additional power capacity enabled the station to support larger crews, more scientific experiments, and the addition of new modules. This power upgrade was crucial for the station's growth and demonstrated the importance of renewable energy in space exploration, setting the stage for future missions to Mars and beyond.",
            quiz: [
                {
                    question: "How much power do the ISS solar arrays generate?",
                    options: ["42 kilowatts", "84 kilowatts", "120 kilowatts", "200 kilowatts"],
                    correct: 1
                }
            ]
        },
        {
            year: 2008,
            title: "Harmony Node",
            description: "Connecting hub for international modules",
            image: "../assets/images/iss_smol.png",
            story: "The Harmony node, also known as Node 2, was added to the International Space Station in 2008, serving as a crucial connecting hub that exemplifies the international cooperation that makes the ISS possible. This 14-ton module, measuring 7.2 meters long and 4.4 meters in diameter, provides six docking ports for connecting various modules and spacecraft. Harmony serves as the connecting point for the European Columbus laboratory and the Japanese Kibo laboratory, symbolizing the truly international nature of the space station. The module contains advanced life support systems, including oxygen generation and water recycling capabilities, making it essential for supporting larger crews. Harmony's name reflects its role in bringing together different international partners in a harmonious working environment. This module also houses the station's main control center for coordinating operations between different international segments, demonstrating how space exploration can transcend political boundaries and unite humanity in the pursuit of scientific knowledge.",
            quiz: [
                {
                    question: "What is Harmony also known as?",
                    options: ["Node 1", "Node 2", "Node 3", "Node 4"],
                    correct: 1
                }
            ]
        },
        {
            year: 2010,
            title: "Cupola Window",
            description: "Seven-windowed observatory module added",
            image: "../assets/images/cupola.png",
            story: "The Cupola, a seven-windowed observatory module, was added to the International Space Station in February 2010, providing astronauts with an unparalleled 360-degree view of Earth and space. This unique module, measuring 1.5 meters in diameter and 1.5 meters tall, features six side windows and one large overhead window, each made of high-strength glass that can withstand the harsh conditions of space. The Cupola serves as the station's primary observation deck, allowing astronauts to monitor spacewalks, dock incoming spacecraft, and conduct Earth observation experiments. It has become one of the most photographed locations on the station, with astronauts capturing stunning images of Earth's auroras, hurricanes, and city lights from this vantage point. The module's design includes workstations for controlling the station's robotic arm and conducting scientific observations. The Cupola represents the perfect marriage of functionality and beauty in space engineering, providing both practical operational capabilities and an inspiring view that reminds astronauts of the fragile beauty of our home planet.",
            quiz: [
                {
                    question: "How many windows does the Cupola have?",
                    options: ["5", "6", "7", "8"],
                    correct: 2
                },
                {
                    question: "What is the Cupola primarily used for?",
                    options: ["Sleeping", "Eating", "Observing Earth", "Exercise"],
                    correct: 2
                }
            ]
        },
        {
            year: 2011,
            title: "Space Shuttle Program Ends",
            description: "Final Space Shuttle mission to ISS",
            image: "../assets/images/iss_smol.png",
            story: "The Space Shuttle program ended with the final mission of Atlantis in July 2011, marking the end of an era that had defined American spaceflight for over three decades. This historic mission, STS-135, delivered critical supplies and equipment to the International Space Station, including the Multi-Purpose Logistics Module Raffaello. The end of the Shuttle program forced the ISS to rely entirely on Russian Soyuz spacecraft for crew transport, highlighting the importance of international partnerships in space exploration. The Shuttle program had been instrumental in building the ISS, with 37 missions dedicated to station assembly and maintenance. The retirement of the Shuttle fleet created a gap in American human spaceflight capability that would last for nearly a decade. This transition period demonstrated the resilience of the international space community and the importance of having multiple transportation options for space missions. The end of the Shuttle era also marked the beginning of a new chapter in space exploration, with private companies stepping up to fill the transportation gap.",
            quiz: [
                {
                    question: "Which Space Shuttle made the final mission to the ISS?",
                    options: ["Discovery", "Endeavour", "Atlantis", "Columbia"],
                    correct: 2
                }
            ]
        },
        {
            year: 2012,
            title: "Dragon Cargo Mission",
            description: "First commercial spacecraft to dock with ISS",
            image: "../assets/images/iss_smol.png",
            story: "SpaceX's Dragon spacecraft became the first commercial vehicle to dock with the International Space Station in May 2012, marking the beginning of a revolutionary new era in space transportation. This historic mission, CRS-1, demonstrated that private companies could successfully deliver cargo to the ISS, opening the door for a new commercial space industry. The Dragon spacecraft, capable of carrying over 6,000 pounds of cargo, represented a significant advancement in space technology with its reusable design and advanced navigation systems. This mission proved that commercial spaceflight was not only possible but could be more cost-effective than traditional government programs. The success of Dragon paved the way for other commercial space companies and established SpaceX as a major player in the space industry. This achievement marked a fundamental shift in how space missions are conducted, with private companies now playing a crucial role in supporting the ISS and future space exploration missions.",
            quiz: [
                {
                    question: "Which company's Dragon spacecraft first docked with the ISS?",
                    options: ["Boeing", "SpaceX", "Lockheed Martin", "Northrop Grumman"],
                    correct: 1
                }
            ]
        },
        {
            year: 2015,
            title: "One Year Mission",
            description: "Scott Kelly and Mikhail Kornienko's year-long stay",
            image: "../assets/images/iss_smol.png",
            story: "Astronaut Scott Kelly and cosmonaut Mikhail Kornienko completed a groundbreaking one-year mission aboard the International Space Station, studying the effects of long-duration spaceflight on the human body. This historic mission, which began in March 2015, was twice as long as typical ISS missions and provided crucial data for future missions to Mars. The two astronauts conducted hundreds of experiments, including studies on bone density loss, muscle atrophy, vision changes, and psychological effects of long-term space isolation. Scott Kelly's identical twin brother, Mark Kelly, remained on Earth, providing a unique control group for comparing genetic changes between space and Earth environments. The mission revealed significant insights into how the human body adapts to microgravity, including changes in gene expression, immune system function, and cardiovascular health. This research is essential for planning future long-duration missions to Mars, where astronauts will spend months in space. The one-year mission demonstrated the resilience of the human spirit and the importance of international cooperation in advancing our understanding of space medicine.",
            quiz: [
                {
                    question: "How long was Scott Kelly's mission aboard the ISS?",
                    options: ["6 months", "1 year", "18 months", "2 years"],
                    correct: 1
                }
            ]
        },
        {
            year: 2020,
            title: "Commercial Crew",
            description: "SpaceX Crew Dragon launches with astronauts",
            image: "../assets/images/iss_smol.png",
            story: "SpaceX's Crew Dragon successfully launched NASA astronauts Bob Behnken and Doug Hurley to the International Space Station in May 2020, marking the return of human spaceflight capability to the United States and the beginning of the commercial crew era. This historic mission, known as Demo-2, was the first time a commercial spacecraft carried astronauts to the ISS, ending nearly a decade of reliance on Russian Soyuz spacecraft. The Crew Dragon spacecraft, with its sleek design and advanced safety systems, represented a new generation of human spaceflight vehicles. The mission demonstrated the success of NASA's Commercial Crew Program, which partnered with private companies to develop cost-effective transportation to the ISS. This achievement marked a fundamental shift in how space missions are conducted, with private companies now playing a leading role in human spaceflight. The success of Crew Dragon opened the door for regular commercial flights to the ISS and paved the way for future missions to the Moon and Mars. This mission proved that the partnership between government and private industry could achieve remarkable results in space exploration.",
            quiz: [
                {
                    question: "What was the name of SpaceX's crew vehicle?",
                    options: ["Falcon", "Dragon", "Crew Dragon", "Starship"],
                    correct: 2
                }
            ]
        },
        {
            year: 2023,
            title: "25th Anniversary",
            description: "ISS celebrates 25 years of continuous operation",
            image: "../assets/images/iss_smol.png",
            story: "The International Space Station celebrated its 25th anniversary in 2023, marking a quarter-century of continuous human presence in space and representing one of humanity's greatest achievements in space exploration. Since its first module launch in 1998, the ISS has hosted over 270 astronauts from 20 countries, representing the most diverse and international space program in history. The station has conducted thousands of scientific experiments across multiple disciplines, including biology, physics, materials science, and human physiology. These experiments have led to breakthroughs in cancer research, drug development, and our understanding of how the human body adapts to space. The ISS has served as a testbed for technologies that will be crucial for future missions to the Moon and Mars, including advanced life support systems, water recycling, and 3D printing in space. The station has also been a symbol of international cooperation, demonstrating that nations can work together peacefully in space despite political differences on Earth. As the ISS approaches the end of its operational life, it leaves behind a legacy of scientific discovery, international cooperation, and technological innovation that will inspire future generations of space explorers.",
            quiz: [
                {
                    question: "How many countries have sent astronauts to the ISS?",
                    options: ["15", "20", "25", "30"],
                    correct: 1
                }
            ]
        }
    ];

    // ===================================
    // NBL History Data
    // ===================================
    
    const nblHistoryData = [
        {
            title: "NBL Construction",
            icon: "🏗️",
            front: "NBL Construction",
            back: "The Neutral Buoyancy Laboratory was built in 1995 at NASA's Johnson Space Center. The pool is 202 feet long, 102 feet wide, and 40 feet deep, containing 6.2 million gallons of water - enough to fill 9 Olympic-sized swimming pools!"
        },
        {
            title: "First Training",
            icon: "🚀",
            front: "First Astronaut Training",
            back: "The first astronaut training in the NBL took place in 1996. Astronauts train for 6-8 hours underwater to simulate a 6-hour spacewalk, learning to work in bulky spacesuits with limited mobility and visibility."
        },
        {
            title: "Pool Temperature",
            icon: "🌡️",
            front: "Perfect Temperature",
            back: "The NBL pool is maintained at 84-86°F (29-30°C) - the same temperature as a warm swimming pool. This prevents astronauts from getting too cold during long training sessions while wearing their spacesuits."
        },
        {
            title: "Famous Astronauts",
            icon: "👨‍🚀",
            front: "Famous Trainees",
            back: "Every astronaut who has performed a spacewalk has trained in the NBL, including Neil Armstrong, Buzz Aldrin, and all ISS crew members. The facility has trained over 200 astronauts for spacewalk missions."
        },
        {
            title: "Training Hours",
            icon: "⏰",
            front: "Intensive Training",
            back: "Astronauts typically spend 40-60 hours training in the NBL for each spacewalk they will perform. This includes practicing specific tasks, emergency procedures, and learning to work with the tools they'll use in space."
        },
        {
            title: "Safety Divers",
            icon: "🤿",
            front: "Safety Team",
            back: "A team of 12-15 safety divers monitors each training session, ready to assist astronauts if they get into trouble. These divers are highly trained in emergency procedures and work closely with the astronaut training team."
        }
    ];

    // ===================================
    // NBL Fun Facts Data
    // ===================================
    
    const nblFactsData = [
        {
            title: "Pool Size",
            icon: "🏊",
            front: "Massive Pool",
            back: "The NBL pool is so large that it could hold the entire Statue of Liberty (minus the base) with room to spare! It's one of the largest indoor pools in the world."
        },
        {
            title: "Water Weight",
            icon: "💧",
            front: "Heavy Water",
            back: "The 6.2 million gallons of water in the NBL weigh approximately 52 million pounds (23.6 million kg) - that's equivalent to 26,000 cars or 4,000 elephants!"
        },
        {
            title: "Neutral Buoyancy",
            icon: "⚖️",
            front: "Perfect Balance",
            back: "Astronauts are weighted to achieve neutral buoyancy - they neither sink nor float. This perfectly simulates the weightlessness of space, allowing them to practice tasks exactly as they would in orbit."
        },
        {
            title: "Spacesuit Weight",
            icon: "👨‍🚀",
            front: "Heavy Suits",
            back: "The spacesuits used in NBL training weigh about 280 pounds (127 kg) on land, but in the water they feel weightless. This is the same suit astronauts wear during actual spacewalks."
        },
        {
            title: "Training Frequency",
            icon: "📅",
            front: "Regular Training",
            back: "The NBL operates 5 days a week, 50 weeks per year, conducting over 200 training sessions annually. Each session can last up to 8 hours, with astronauts taking breaks every 2 hours."
        },
        {
            title: "International Use",
            icon: "🌍",
            front: "Global Training",
            back: "Astronauts from all ISS partner countries train at the NBL, including NASA, ESA (Europe), JAXA (Japan), and CSA (Canada). The facility represents true international cooperation in space exploration."
        }
    ];

    // ===================================
    // Card Selection System
    // ===================================
    
    function initCardSelection() {
        const issCard = document.querySelector('[data-card="iss"]');
        const nblCard = document.querySelector('[data-card="nbl"]');

        if (issCard) {
            issCard.addEventListener('click', (e) => {
                e.preventDefault();
                playSound('click');
                showSection('iss');
                initTimeline();
            });
        }

        if (nblCard) {
            nblCard.addEventListener('click', (e) => {
                e.preventDefault();
                playSound('click');
                showSection('nbl');
                initNBL();
            });
        }
    }

    function showSection(sectionName) {
        const cardSelection = document.getElementById('cardSelection');
        const issSection = document.getElementById('issSection');
        const nblSection = document.getElementById('nblSection');
        const backButton = document.querySelector('.back-button');

        console.log(`📚 Switching to section: ${sectionName}`);

        // Hide all sections first
        if (cardSelection) cardSelection.style.display = 'none';
        if (issSection) issSection.style.display = 'none';
        if (nblSection) nblSection.style.display = 'none';

        // Update back button text based on current section
        if (backButton) {
            const backText = backButton.querySelector('.back-text');
            if (sectionName === 'cards') {
                backText.textContent = 'Back to Station';
            } else if (sectionName === 'iss' || sectionName === 'nbl') {
                backText.textContent = 'Back to Cards';
            }
        }

        // Show the selected section
        if (sectionName === 'cards' && cardSelection) {
            cardSelection.style.display = 'block';
            console.log('📚 Showing card selection');
        } else if (sectionName === 'iss' && issSection) {
            issSection.style.display = 'block';
            console.log('📚 Showing ISS section');
        } else if (sectionName === 'nbl' && nblSection) {
            nblSection.style.display = 'block';
            console.log('📚 Showing NBL section');
        } else {
            console.log('📚 Section not found:', sectionName);
        }
    }

    // ===================================
    // Back to Cards Functionality
    // ===================================
    
    function initBackToCards() {
        const mainBackButton = document.querySelector('.back-button');

        function goBackToCards() {
            playSound('click');
            showSection('cards');
        }

        function goBackToStation() {
            playSound('click');
            window.location.href = '../index.html';
        }

        // Handle main back button (top-left)
        if (mainBackButton) {
            mainBackButton.addEventListener('click', (e) => {
                e.preventDefault();
                const backText = mainBackButton.querySelector('.back-text');
                
                if (backText.textContent === 'Back to Station') {
                    goBackToStation();
                } else {
                    goBackToCards();
                }
            });
        }
    }

    // ===================================
    // ISS Timeline System
    // ===================================
    
    let currentQuizIndex = 0;
    
    function initTimeline() {
        const timelineTrack = document.getElementById('timelineTrack');
        const timelineContent = document.getElementById('timelineContent');
        
        if (!timelineTrack || !timelineContent) return;

        // Create timeline items
        timelineTrack.innerHTML = '';
        issTimelineData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            if (index === 0) timelineItem.classList.add('active');
            
            timelineItem.innerHTML = `
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-description">${item.description}</div>
            `;
            
            timelineItem.addEventListener('click', () => {
                currentTimelineIndex = index;
                selectTimelineItem(index);
                scrollToActiveTimelineItem();
            });
            
            timelineTrack.appendChild(timelineItem);
        });

        // Initialize navigation
        initTimelineNavigation();
        
        // Show first timeline detail
        showTimelineDetail(0);
    }

    function selectTimelineItem(index) {
        currentTimelineIndex = index;
        
        // Update active timeline item
        document.querySelectorAll('.timeline-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Show timeline detail
        showTimelineDetail(index);
        
        // Update progress
        updateTimelineProgress();
        
        playSound('click');
    }

    function showTimelineDetail(index) {
        const timelineContent = document.getElementById('timelineContent');
        const item = issTimelineData[index];
        
        if (!timelineContent) return;

        currentQuizIndex = 0; // Reset quiz index for new timeline item
        
        timelineContent.innerHTML = `
            <div class="timeline-detail active">
                <div class="detail-story">${item.story}</div>
                <div class="quiz-container">
                     <div class="quiz-header">
                         <h3>Interactive Quiz</h3>
                         <div class="quiz-progress">
                             <span id="currentQuestion">1</span> of <span id="totalQuestions">${Array.isArray(item.quiz) ? item.quiz.length : 1}</span>
                         </div>
                     </div>
                    <div class="quiz-image-container">
                        <img src="../assets/images/quiz/${index + 1}.jpg" alt="Quiz Image ${index + 1}" class="quiz-image" id="quizImage">
                    </div>
                    <div class="quiz-content">
                        <div class="quiz-question" id="quizQuestion">${Array.isArray(item.quiz) ? item.quiz[0].question : item.quiz.question}</div>
                        <div class="quiz-options" id="quizOptions">
                            ${(Array.isArray(item.quiz) ? item.quiz[0].options : item.quiz.options).map((option, i) => `
                                <div class="quiz-option" data-answer="${i}">${option}</div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="quiz-navigation">
                        <button class="quiz-nav-btn" id="prevQuiz" disabled>← Previous</button>
                        <button class="quiz-nav-btn" id="nextQuiz">Next →</button>
                        <button class="quiz-nav-btn" id="closeQuiz">Close Quiz</button>
                    </div>
                </div>
                <div class="quiz-reopen-container" style="display: none;">
                    <button class="quiz-reopen-btn" id="reopenQuiz">
                        <span class="reopen-icon">🧠</span>
                        <span>Reopen Quiz</span>
                    </button>
                </div>
            </div>
        `;

        // Add quiz functionality
        initQuizNavigation(index);
    }

    function initQuizNavigation(timelineIndex) {
        const item = issTimelineData[timelineIndex];
        const prevBtn = document.getElementById('prevQuiz');
        const nextBtn = document.getElementById('nextQuiz');
        const closeBtn = document.getElementById('closeQuiz');
        const quizOptions = document.querySelectorAll('.quiz-option');

        // Handle quiz option clicks
        quizOptions.forEach((option, i) => {
            option.addEventListener('click', () => {
                handleQuizAnswer(timelineIndex, i);
            });
        });

        // Handle navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentQuizIndex > 0) {
                    currentQuizIndex--;
                    updateQuizDisplay(timelineIndex);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const quizLength = Array.isArray(item.quiz) ? item.quiz.length : 1;
                if (currentQuizIndex < quizLength - 1) {
                    currentQuizIndex++;
                    updateQuizDisplay(timelineIndex);
                } else {
                    // Quiz completed - show congratulations
                    showQuizCompletionMessage(timelineIndex);
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeQuiz();
            });
        }

        // Handle reopen button
        const reopenBtn = document.getElementById('reopenQuiz');
        if (reopenBtn) {
            reopenBtn.addEventListener('click', () => {
                reopenQuiz();
            });
        }

        // Update button states
        updateQuizButtons(timelineIndex);
    }

    function updateQuizDisplay(timelineIndex) {
        const item = issTimelineData[timelineIndex];
        const currentQuiz = Array.isArray(item.quiz) ? item.quiz[currentQuizIndex] : item.quiz;
        
        const quizQuestion = document.getElementById('quizQuestion');
        const quizOptions = document.getElementById('quizOptions');
        const currentQuestion = document.getElementById('currentQuestion');
        
        if (quizQuestion) quizQuestion.textContent = currentQuiz.question;
        if (currentQuestion) {
            currentQuestion.textContent = currentQuizIndex + 1;
            console.log(`📚 Quiz Progress: ${currentQuizIndex + 1} of ${Array.isArray(item.quiz) ? item.quiz.length : 1}`);
        }
        
        if (quizOptions) {
            quizOptions.innerHTML = currentQuiz.options.map((option, i) => `
                <div class="quiz-option" data-answer="${i}">${option}</div>
            `).join('');
            
            // Re-add event listeners
            quizOptions.querySelectorAll('.quiz-option').forEach((option, i) => {
                option.addEventListener('click', () => {
                    handleQuizAnswer(timelineIndex, i);
                });
            });
        }
        
        updateQuizButtons(timelineIndex);
    }

    function updateQuizButtons(timelineIndex) {
        const item = issTimelineData[timelineIndex];
        const prevBtn = document.getElementById('prevQuiz');
        const nextBtn = document.getElementById('nextQuiz');
        const quizLength = Array.isArray(item.quiz) ? item.quiz.length : 1;
        
        if (prevBtn) {
            prevBtn.disabled = currentQuizIndex === 0;
        }
        
        if (nextBtn) {
            const isLastQuestion = currentQuizIndex === quizLength - 1;
            // Don't disable the button on the last question - we need it to complete the quiz
            nextBtn.disabled = false;
            
            // Update button text for last question
            if (isLastQuestion) {
                nextBtn.textContent = 'Complete Quiz';
                nextBtn.classList.add('complete-btn');
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.classList.remove('complete-btn');
            }
        }
    }

    function handleQuizAnswer(timelineIndex, answerIndex) {
        const item = issTimelineData[timelineIndex];
        const currentQuiz = Array.isArray(item.quiz) ? item.quiz[currentQuizIndex] : item.quiz;
        const quizOptions = document.querySelectorAll('.quiz-option');
        
        // Remove previous selections
        quizOptions.forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
        
        // Mark correct answer
        quizOptions[currentQuiz.correct].classList.add('correct');
        
        // Mark selected answer
        if (answerIndex !== currentQuiz.correct) {
            quizOptions[answerIndex].classList.add('incorrect');
        }
        
        // Store answer
        if (!currentQuizAnswers[timelineIndex]) {
            currentQuizAnswers[timelineIndex] = {};
        }
        currentQuizAnswers[timelineIndex][currentQuizIndex] = answerIndex === currentQuiz.correct;
        
        playSound(answerIndex === currentQuiz.correct ? 'click' : 'click');
    }

    function showQuizCompletionMessage(timelineIndex) {
        const item = issTimelineData[timelineIndex];
        const quizLength = Array.isArray(item.quiz) ? item.quiz.length : 1;
        
        // Calculate score
        let correctAnswers = 0;
        if (currentQuizAnswers[timelineIndex]) {
            Object.values(currentQuizAnswers[timelineIndex]).forEach(isCorrect => {
                if (isCorrect) correctAnswers++;
            });
        }
        
        const score = Math.round((correctAnswers / quizLength) * 100);
        
        // Create congratulations modal
        const modal = document.createElement('div');
        modal.className = 'quiz-completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <div class="completion-icon">🎉</div>
                <h2 class="completion-title">Quiz Complete!</h2>
                <p class="completion-message">
                    Congratulations! You've completed the ${item.year} quiz.
                </p>
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">Score:</span>
                        <span class="stat-value">${score}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Correct:</span>
                        <span class="stat-value">${correctAnswers}/${quizLength}</span>
                    </div>
                </div>
                <div class="completion-actions">
                    <button class="completion-btn primary" id="closeCompletion">Continue Learning</button>
                    <button class="completion-btn secondary" id="retakeQuiz">Retake Quiz</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Add completion content styles
        const completionContent = modal.querySelector('.completion-content');
        completionContent.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.95), rgba(43, 75, 115, 0.95));
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            color: white;
            max-width: 400px;
            width: 90%;
            border: 2px solid rgba(0, 217, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.4s ease-out;
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('#closeCompletion');
        const retakeBtn = modal.querySelector('#retakeQuiz');
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
            closeQuiz();
        });
        
        retakeBtn.addEventListener('click', () => {
            modal.remove();
            // Reset quiz state
            currentQuizIndex = 0;
            currentQuizAnswers[timelineIndex] = {};
            updateQuizDisplay(timelineIndex);
        });
        
        // Play completion sound
        playSound('click');
        
        // Award trophy for completing quiz
        if (window.ISSperience && window.ISSperience.awardTrophy) {
            window.ISSperience.awardTrophy('knowledgeQuiz', 'ISS Scholar', 'Completed ISS Knowledge quiz', 1);
        }
        
        // Add fade in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { 
                    opacity: 0; 
                    transform: translateY(50px) scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
        `;
        document.head.appendChild(style);
    }

    function closeQuiz() {
        const timelineContent = document.getElementById('timelineContent');
        if (timelineContent) {
            const quizContainer = timelineContent.querySelector('.quiz-container');
            const reopenContainer = timelineContent.querySelector('.quiz-reopen-container');
            
            if (quizContainer) {
                quizContainer.style.display = 'none';
            }
            
            if (reopenContainer) {
                reopenContainer.style.display = 'block';
            }
        }
    }

    function reopenQuiz() {
        const timelineContent = document.getElementById('timelineContent');
        if (timelineContent) {
            const quizContainer = timelineContent.querySelector('.quiz-container');
            const reopenContainer = timelineContent.querySelector('.quiz-reopen-container');
            
            if (quizContainer) {
                quizContainer.style.display = 'block';
            }
            
            if (reopenContainer) {
                reopenContainer.style.display = 'none';
            }
            
            // Reset quiz to first question
            currentQuizIndex = 0;
            updateQuizDisplay(currentTimelineIndex);
        }
    }

    function initTimelineNavigation() {
        const prevBtn = document.getElementById('prevTimeline');
        const nextBtn = document.getElementById('nextTimeline');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentTimelineIndex > 0) {
                    selectTimelineItem(currentTimelineIndex - 1);
                    scrollToActiveTimelineItem();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentTimelineIndex < issTimelineData.length - 1) {
                    selectTimelineItem(currentTimelineIndex + 1);
                    scrollToActiveTimelineItem();
                }
            });
        }
    }

    function scrollToActiveTimelineItem() {
        const timelineTrack = document.getElementById('timelineTrack');
        const activeItem = timelineTrack?.querySelector('.timeline-item.active');
        
        if (timelineTrack && activeItem) {
            // Get the position of the active item relative to the track
            const itemIndex = Array.from(timelineTrack.children).indexOf(activeItem);
            const itemWidth = 300; // Fixed width from CSS
            const gap = 32; // Gap between items (2rem = 32px)
            const trackPadding = 32; // Track padding (2rem = 32px)
            
            // Calculate the scroll position to center the item
            const itemPosition = (itemIndex * (itemWidth + gap)) + trackPadding;
            const trackWidth = timelineTrack.clientWidth;
            const scrollPosition = itemPosition - (trackWidth / 2) + (itemWidth / 2);
            
            // Smooth scroll to the calculated position
            timelineTrack.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }

    function updateTimelineProgress() {
        const progressBar = document.getElementById('timelineProgress');
        const progressText = document.getElementById('timelineProgressText');
        const prevBtn = document.getElementById('prevTimeline');
        const nextBtn = document.getElementById('nextTimeline');
        
        if (progressBar) {
            const progress = ((currentTimelineIndex + 1) / issTimelineData.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${currentTimelineIndex + 1} of ${issTimelineData.length}`;
            console.log(`📚 Timeline Progress: ${currentTimelineIndex + 1} of ${issTimelineData.length}`);
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentTimelineIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentTimelineIndex === issTimelineData.length - 1;
        }
        
        // Force scroll to active item after a short delay
        setTimeout(() => {
            scrollToActiveTimelineItem();
        }, 100);
    }

    // ===================================
    // NBL System
    // ===================================
    
    function initNBL() {
        initNBLTabs();
        initBuoyancySimulator();
        initHistoryCards();
        initFactsCards();
        
        // Award trophy for experiencing NBL simulation for 3 seconds
        if (window.ISSperience && window.ISSperience.awardTrophy) {
            setTimeout(() => {
                window.ISSperience.awardTrophy('knowledgeNBL', 'NBL Trainee', 'Experienced Neutral Buoyancy Laboratory for 3 seconds', 1);
            }, 3000); // Award trophy after 3 seconds of NBL experience
        }
    }

    function initNBLTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}Tab`) {
                        content.classList.add('active');
                    }
                });
                
                playSound('click');
            });
        });
    }

    function initBuoyancySimulator() {
        const weightSlider = document.getElementById('weightSlider');
        const foamSlider = document.getElementById('foamSlider');
        const taskComplexity = document.getElementById('taskComplexity');
        const astronautFloat = document.getElementById('astronautFloat');
        const buoyancyIndicator = document.getElementById('buoyancyIndicator');
        
        const weightValue = document.getElementById('weightValue');
        const foamValue = document.getElementById('foamValue');
        const buoyancyStatus = document.getElementById('buoyancyStatus');
        const taskTimeImpact = document.getElementById('taskTimeImpact');
        const trainingDifficulty = document.getElementById('trainingDifficulty');
        
        function updateSimulator() {
            const weight = parseInt(weightSlider.value);
            const foam = parseInt(foamSlider.value);
            const complexity = taskComplexity.value;
            
            // Update display values
            weightValue.textContent = `${weight} kg`;
            foamValue.textContent = `${foam}%`;
            
            // Calculate buoyancy
            const buoyancy = calculateBuoyancy(weight, foam);
            const astronautTop = calculateAstronautPosition(buoyancy);
            
            // Update astronaut position
            if (astronautFloat) {
                astronautFloat.style.top = `${astronautTop}%`;
                
                // Update astronaut visual class
                astronautFloat.className = 'astronaut-float';
                if (buoyancy > 0.1) {
                    astronautFloat.classList.add('floating');
                } else if (buoyancy < -0.1) {
                    astronautFloat.classList.add('sinking');
                } else {
                    astronautFloat.classList.add('neutral');
                }
            }
            
            // Update indicators
            updateBuoyancyIndicator(buoyancy, buoyancyIndicator, buoyancyStatus);
            updateTaskImpact(buoyancy, complexity, taskTimeImpact, trainingDifficulty);
            updatePhysicsInfo(buoyancy, weight, foam);
        }
        
        // Add event listeners
        if (weightSlider) weightSlider.addEventListener('input', updateSimulator);
        if (foamSlider) foamSlider.addEventListener('input', updateSimulator);
        if (taskComplexity) taskComplexity.addEventListener('change', updateSimulator);
        
        // Initial update
        updateSimulator();
    }

    function calculateBuoyancy(weight, foam) {
        // Realistic buoyancy physics calculation
        // Based on Archimedes' principle: F_buoyant = ρ_water * g * V_displaced
        
        // Constants
        const WATER_DENSITY = 1000; // kg/m³
        const GRAVITY = 9.81; // m/s²
        const PERSON_DENSITY = 1010; // kg/m³ (slightly denser than water)
        
        // Convert foam percentage to density (0-100% -> 0-1000 kg/m³)
        // Foam density ranges from 0 (air) to 1000 (water density)
        const foamDensity = (foam / 100) * WATER_DENSITY;
        
        // Calculate person's volume (assuming average human density)
        const personVolume = weight / PERSON_DENSITY; // m³
        
        // Calculate foam volume needed for neutral buoyancy
        // For neutral buoyancy: ρ_water * V_total = weight
        // V_total = V_person + V_foam
        // ρ_water * (V_person + V_foam) = weight
        // V_foam = (weight / ρ_water) - V_person
        const neutralFoamVolume = (weight / WATER_DENSITY) - personVolume;
        
        // Calculate actual foam volume based on foam density
        // Higher foam density = less volume needed
        const actualFoamVolume = neutralFoamVolume * (WATER_DENSITY / foamDensity);
        
        // Calculate buoyant force
        const totalVolume = personVolume + actualFoamVolume;
        const buoyantForce = WATER_DENSITY * GRAVITY * totalVolume;
        const weightForce = weight * GRAVITY;
        
        // Net force (positive = floating, negative = sinking, zero = neutral)
        const netForce = buoyantForce - weightForce;
        
        // Convert to buoyancy ratio (-1 to 1)
        // -1 = sinking, 0 = neutral, 1 = floating
        const buoyancyRatio = Math.max(-1, Math.min(1, netForce / (weight * GRAVITY)));
        
        return buoyancyRatio;
    }

    function calculateAstronautPosition(buoyancy) {
        // Convert buoyancy (-1 to 1) to position (20% to 80%)
        // Positive buoyancy (floating) = higher position (lower percentage from top)
        // Negative buoyancy (sinking) = lower position (higher percentage from top)
        return 50 - (buoyancy * 30);
    }

    function updateBuoyancyIndicator(buoyancy, indicator, status) {
        if (!indicator || !status) return;
        
        let statusText, indicatorText, indicatorClass;
        
        if (buoyancy > 0.1) {
            statusText = 'Floating';
            indicatorText = 'Floating';
            indicatorClass = 'floating';
        } else if (buoyancy < -0.1) {
            statusText = 'Sinking';
            indicatorText = 'Sinking';
            indicatorClass = 'sinking';
        } else {
            statusText = 'Neutral';
            indicatorText = 'Neutral';
            indicatorClass = 'neutral';
        }
        
        status.textContent = statusText;
        indicator.textContent = indicatorText;
        indicator.className = `buoyancy-indicator ${indicatorClass}`;
    }

    function updateTaskImpact(buoyancy, complexity, taskTime, difficulty) {
        if (!taskTime || !difficulty) return;
        
        // More realistic task impact based on buoyancy physics
        const buoyancyEffect = Math.abs(buoyancy);
        const complexityMultiplier = complexity === 'simple' ? 1 : complexity === 'moderate' ? 1.5 : 2;
        
        let timeImpact, difficultyLevel;
        
        // Neutral buoyancy (close to 0) is optimal for tasks
        if (buoyancyEffect < 0.1) {
            timeImpact = 'Optimal';
            difficultyLevel = 'Easy';
        } else if (buoyancyEffect < 0.3) {
            timeImpact = 'Slightly Slower';
            difficultyLevel = 'Moderate';
        } else if (buoyancyEffect < 0.6) {
            timeImpact = 'Much Slower';
            difficultyLevel = 'Difficult';
        } else {
            timeImpact = 'Very Slow';
            difficultyLevel = 'Very Difficult';
        }
        
        // Adjust for task complexity
        if (complexity === 'complex' && buoyancyEffect > 0.2) {
            timeImpact = 'Extremely Slow';
            difficultyLevel = 'Extremely Difficult';
        } else if (complexity === 'simple' && buoyancyEffect < 0.4) {
            timeImpact = 'Manageable';
            difficultyLevel = 'Moderate';
        }
        
        taskTime.textContent = timeImpact;
        difficulty.textContent = difficultyLevel;
    }

    function updatePhysicsInfo(buoyancy, weight, foam) {
        const physicsInfo = document.getElementById('physicsInfo');
        if (!physicsInfo) return;
        
        // Calculate foam density for display
        const foamDensity = (foam / 100) * 1000; // kg/m³
        const personDensity = 1010; // kg/m³
        
        let physicsText;
        
        if (Math.abs(buoyancy) < 0.1) {
            physicsText = `Neutral: ρ_foam=${foamDensity.toFixed(0)}kg/m³`;
        } else if (buoyancy > 0) {
            physicsText = `Floating: F_b > W (${foamDensity.toFixed(0)}kg/m³)`;
        } else {
            physicsText = `Sinking: F_b < W (${foamDensity.toFixed(0)}kg/m³)`;
        }
        
        physicsInfo.textContent = physicsText;
    }

    function initHistoryCards() {
        const historyDeck = document.getElementById('historyCardsDeck');
        if (!historyDeck) return;
        
        historyDeck.innerHTML = '';
        
        nblHistoryData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-icon">${item.icon}</div>
                        <div class="card-title">${item.front}</div>
                    </div>
                    <div class="card-back">
                        <div class="card-text">${item.back}</div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                playSound('click');
            });
            
            historyDeck.appendChild(card);
        });
    }

    function initFactsCards() {
        const factsDeck = document.getElementById('factsCardsDeck');
        if (!factsDeck) return;
        
        factsDeck.innerHTML = '';
        
        nblFactsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'fact-card';
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-icon">${item.icon}</div>
                        <div class="card-title">${item.front}</div>
                    </div>
                    <div class="card-back">
                        <div class="card-text">${item.back}</div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                playSound('click');
            });
            
            factsDeck.appendChild(card);
        });
    }

    // ===================================
    // Initialize Module
    // ===================================
    
    function init() {
        console.log('📚 Initializing Knowledge Center...');
        
        initSoundToggle();
        initCardSelection();
        initBackToCards();
        
        // Set initial back button text
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            const backText = backButton.querySelector('.back-text');
            if (backText) {
                backText.textContent = 'Back to Station';
            }
        }
        
        console.log('📚 Knowledge Center initialized successfully!');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
