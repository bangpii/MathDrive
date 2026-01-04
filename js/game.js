// ========== GAME SCRIPT ==========

let gameInstance = null;

// Fungsi untuk menampilkan game
function showGame() {
    // Hide semua page content
    document.querySelectorAll('.page-content').forEach(el => {
        el.classList.add('hidden');
    });

    // Show game content
    const gameContent = document.getElementById('game-content');
    gameContent.classList.remove('hidden');

    // Load game jika belum ada
    if (!gameInstance) {
        loadGame();
    } else {
        // Reset game jika sudah ada instance
        gameInstance.restartGame();
    }

    // Play sound
    playClickSound();

    // Update navigation
    setActivePage('game');
}

// Fungsi untuk memuat game
function loadGame() {
    const gameContainer = document.querySelector('#game-content .bg-white');

    // HTML game
    gameContainer.innerHTML = `
        <!-- BACKGROUND -->
        <div id="bg-strip" class="absolute top-0 left-0 h-full flex">
            <img src="public/1.png" class="h-full w-auto">
            <img src="public/2.png" class="h-full w-auto">
            <img src="public/3.png" class="h-full w-auto">
            <img src="public/pos1.png" class="h-full w-auto">
            <img src="public/4.png" class="h-full w-auto">
            <img src="public/pos2.png" class="h-full w-auto">
            <img src="public/5.png" class="h-full w-auto">
            <img src="public/pos3.png" class="h-full w-auto">
            <img src="public/6.png" class="h-full w-auto">
            <img src="public/pos4.png" class="h-full w-auto">
            <img src="public/7.png" class="h-full w-auto">
            <img src="public/pos5.png" class="h-full w-auto">
            <img src="public/8.png" class="h-full w-auto">
            <img src="public/akhir.png" class="h-full w-auto">
        </div>

        <!-- MOBIL -->
        <div id="car" class="absolute -bottom-2 left-10 z-10 transition-transform duration-100">
            <img src="public/mobil.png" class="w-auto h-[120px] md:h-[150px] lg:h-[180px] object-contain">
        </div>

        <!-- QUESTION BOX -->
        <div id="quizBox" class="hidden absolute inset-0 flex items-center justify-center z-20">
            <div class="p-6 rounded-xl text-center text-black w-[90%] max-w-md mx-4" style="
            background: linear-gradient(90deg, #00FFF5, #00BFFF);
            background-color: rgba(0, 255, 245, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 255, 245, 0.2);
        ">
                <h2 id="question" class="text-lg font-semibold mb-4"></h2>
                <div id="answers" class="space-y-2"></div>
            </div>
        </div>

        <!-- HEALTH BAR (SCORE) -->
        <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold z-10">
            <div class="flex items-center gap-2">
                <div class="w-24 md:w-32 h-3 md:h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div id="healthBar" class="h-full bg-red-500 rounded-full transition-all duration-300" style="width: 100%"></div>
                </div>
                <span id="scoreValue" class="text-sm md:text-base">100</span>
            </div>
        </div>

        <!-- CONTROLS INFO -->
          <div class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg font-medium z-10 text-sm">
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-1">
                    <span class="bg-gray-800 px-2 py-1 rounded">A</span>
                    <span class="text-xs">← Mundur</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="bg-gray-800 px-2 py-1 rounded">D</span>
                    <span class="text-xs">→ Maju</span>
                </div>
            </div>
        </div>

        <!-- GAME OVER OVERLAY -->
        <div id="gameOverOverlay" class="hidden absolute inset-0 bg-black/80 flex items-center justify-center z-30">
            <div class="text-center p-6 md:p-8 rounded-2xl w-[90%] max-w-md mx-4" style="
                background: linear-gradient(135deg, #FF416C, #FF4B2B);
                box-shadow: 0 20px 40px rgba(255, 65, 108, 0.4);
            ">
                <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">GAME OVER</h2>
                <p class="text-lg md:text-xl text-white/90 mb-6">Skor Akhir: <span id="finalScore" class="font-bold">0</span></p>
                <button onclick="gameInstance.restartGame()" class="bg-white text-red-600 font-bold px-6 py-2 md:px-8 md:py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-base md:text-lg">
                    MAIN LAGI
                </button>
            </div>
        </div>

        <!-- WINNER OVERLAY -->
        <div id="winnerOverlay" class="hidden absolute inset-0 bg-black/80 flex items-center justify-center z-30">
            <div class="text-center p-6 md:p-8 rounded-2xl w-[90%] max-w-md mx-4 bg-black border-4" style="
                border-color: #00FFF5;
                box-shadow: 0 0 30px rgba(0, 255, 245, 0.5), inset 0 0 20px rgba(0, 255, 245, 0.1);
            ">
                <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">WINNER!</h2>
                <div class="text-white/90 mb-6 space-y-3">
                    <p class="text-lg md:text-xl">Skor Akhir: <span id="winnerScore" class="font-bold text-xl md:text-2xl" style="color: #00FFF5;">100</span></p>
                    <div id="winnerMessage" class="text-base md:text-lg">
                        <!-- Message akan diisi oleh JavaScript -->
                    </div>
                </div>
                <button onclick="gameInstance.restartGame()" class="font-bold px-6 py-2 md:px-8 md:py-3 rounded-lg transition-colors duration-200 text-base md:text-lg" style="
                    background: #00FFF5;
                    color: black;
                ">
                    MAIN LAGI
                </button>
            </div>
        </div>

        <!-- AUDIO ELEMENT (HIDDEN) -->
        <audio id="carSound" preload="auto">
            <source src="public/music_mobil.mp3" type="audio/mpeg">
        </audio>
    `;

    // Initialize game
    gameInstance = new Game();
}

// Game Class
class Game {
    constructor() {
        this.strip = document.getElementById('bg-strip');
        this.quizBox = document.getElementById('quizBox');
        this.questionEl = document.getElementById('question');
        this.answersEl = document.getElementById('answers');
        this.scoreValue = document.getElementById('scoreValue');
        this.healthBar = document.getElementById('healthBar');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.winnerOverlay = document.getElementById('winnerOverlay');
        this.winnerScore = document.getElementById('winnerScore');
        this.winnerMessage = document.getElementById('winnerMessage');
        this.finalScore = document.getElementById('finalScore');
        this.car = document.getElementById('car');
        this.carSound = document.getElementById('carSound');

        // Setup responsive dimensions
        this.setupResponsiveDimensions();
        
        this.position = 0;
        this.speed = 0;
        this.maxSpeed = 6;
        this.friction = 0.12;

        this.imgWidth = this.calculateImgWidth();
        this.leftLimit = 0;

        // POSISI CHECKPOINT
        this.posIndexes = [3, 5, 7, 9, 11];
        this.currentPos = 0;
        this.score = 100;
        this.finished = false;
        this.quizActive = false;
        this.answeredPositions = [false, false, false, false, false];
        this.wrongAnswers = 0;

        // VARIABEL UNTUK BATAS MOBIL
        this.carPosition = 0;
        this.maxCarPosition = window.innerWidth * 0.4; // Batas 40% dari lebar layar (lebih aman)
        this.minCarPosition = 10; // Batas minimal di kiri

        // Variabel untuk suara mobil
        this.isCarSoundPlaying = false;
        this.soundTimeout = null;

        // Array soal yang sudah ditentukan (5 soal tetap)
        this.questions = [{
                q: "Sebuah persegi memiliki sisi 12 cm. Keliling persegi tersebut adalah ...",
                correct: 48,
                options: [36, 40, 44, 48]
            },
            {
                q: "1 jam 30 menit sama dengan ... menit",
                correct: 90,
                options: [60, 70, 80, 90]
            },
            {
                q: "Hasil dari 84 × 6 adalah ...",
                correct: 504,
                options: [484, 494, 504, 514]
            },
            {
                q: "Hasil dari 875 + 246 adalah ...",
                correct: 1121,
                options: [1111, 1121, 1131, 1141]
            },
            {
                q: "3 hari sama dengan ... jam",
                correct: 72,
                options: [48, 60, 72, 84]
            }
        ];

        this.init();
        
        // Add resize listener
        window.addEventListener('resize', () => this.handleResize());
    }
    
    // Fungsi untuk setup dimensi responsif
    setupResponsiveDimensions() {
        const viewportWidth = window.innerWidth;
        
        // Tentukan base imgWidth berdasarkan viewport
        if (viewportWidth < 768) { // Mobile & Tablet kecil
            this.baseImgWidth = 600;
        } else if (viewportWidth < 1024) { // Tablet
            this.baseImgWidth = 800;
        } else if (viewportWidth < 1280) { // Laptop kecil
            this.baseImgWidth = 900;
        } else if (viewportWidth < 1536) { // Laptop standar
            this.baseImgWidth = 1000;
        } else { // Monitor besar
            this.baseImgWidth = 1100;
        }
    }
    
    // Hitung lebar gambar berdasarkan viewport
    calculateImgWidth() {
        const viewportWidth = window.innerWidth;
        
        // Pastikan gambar proporsional dengan viewport
        let imgWidth = this.baseImgWidth;
        
        // Adjust untuk layar sangat kecil
        if (viewportWidth < 640) {
            imgWidth = viewportWidth * 1.5; // Lebih lebar untuk scrolling yang smooth
        }
        
        // Adjust untuk layar sangat besar
        if (viewportWidth > 1920) {
            imgWidth = Math.min(imgWidth, 1200); // Batasi maksimal
        }
        
        return imgWidth;
    }
    
    // Handle resize event
    handleResize() {
        // Update semua nilai yang bergantung pada viewport
        this.setupResponsiveDimensions();
        this.imgWidth = this.calculateImgWidth();
        // Update batas maksimal posisi mobil (40% dari lebar layar)
        this.maxCarPosition = window.innerWidth * 0.4;
        
        // Update posisi car jika melebihi batas baru
        if (this.carPosition > this.maxCarPosition) {
            this.carPosition = this.maxCarPosition;
            this.updateCarPosition();
        }
    }

    init() {
        // Set initial strip width based on calculated imgWidth
        this.updateStripDimensions();
        this.update();
        this.setupEventListeners();
    }
    
    // Update dimensi strip background
    updateStripDimensions() {
        const images = this.strip.querySelectorAll('img');
        images.forEach(img => {
            img.style.width = `${this.imgWidth}px`;
        });
        
        // Update total width of strip
        this.strip.style.width = `${this.imgWidth * images.length}px`;
    }

    // Fungsi untuk memutar suara mobil
    playCarSound() {
        if (this.finished || this.quizActive) return;

        // Reset suara ke awal jika sudah selesai
        if (this.carSound.ended || this.carSound.currentTime > 1) {
            this.carSound.currentTime = 0;
        }

        // Putar suara jika belum diputar
        if (!this.isCarSoundPlaying) {
            this.carSound.play().catch(e => console.log("Audio error:", e));
            this.isCarSoundPlaying = true;
        }

        // Hentikan suara setelah 0.5 detik jika tidak ada input lagi
        clearTimeout(this.soundTimeout);
        this.soundTimeout = setTimeout(() => {
            this.carSound.pause();
            this.carSound.currentTime = 0;
            this.isCarSoundPlaying = false;
        }, 500);
    }

    // Fungsi untuk menghentikan suara mobil
    stopCarSound() {
        clearTimeout(this.soundTimeout);
        this.carSound.pause();
        this.carSound.currentTime = 0;
        this.isCarSoundPlaying = false;
    }

    // UPDATE: Fungsi untuk update posisi mobil dengan batasan yang fix
    updateCarPosition() {
        // HITUNG PROGRESS YANG TEPAT
        // Total jarak yang ditempuh = posisi background
        const currentDistance = Math.abs(this.position);
        
        // Jika mobil sudah jauh, kita perlambat pergerakan mobil ke kanan
        let progress;
        
        if (currentDistance > 0) {
            // Gunakan rumus yang lebih lambat untuk progress
            progress = Math.min(currentDistance / (this.imgWidth * 15), 0.6); // Maksimal 60% dari maxCarPosition
        } else {
            progress = 0;
        }
        
        // Update posisi mobil
        this.carPosition = progress * this.maxCarPosition;

        // PASTIKAN TIDAK MELEBIHI BATAS - FIX HARDCAP
        if (this.carPosition > this.maxCarPosition) {
            this.carPosition = this.maxCarPosition;
        }
        
        // Pastikan tidak kurang dari batas minimal
        if (this.carPosition < this.minCarPosition) {
            this.carPosition = this.minCarPosition;
        }

        // Apply transform
        this.car.style.transform = `translateX(${this.carPosition}px)`;
    }

    // Fungsi untuk mendapatkan soal berdasarkan posisi
    getQuestion() {
        // Return soal berdasarkan currentPos (0-4)
        if (this.currentPos >= 0 && this.currentPos < this.questions.length) {
            const questionData = {
                ...this.questions[this.currentPos]
            };
            // Acak urutan pilihan jawaban
            questionData.options = [...questionData.options].sort(() => Math.random() - 0.5);
            return questionData;
        }
        // Fallback jika terjadi error
        return {
            q: "8 × 7 = ?",
            correct: 56,
            options: [54, 55, 56, 57]
        };
    }

    showQuiz() {
        if (this.quizActive || this.finished || this.answeredPositions[this.currentPos]) return;

        this.quizActive = true;
        const data = this.getQuestion();

        this.quizBox.classList.remove('hidden');
        this.questionEl.textContent = data.q;
        this.answersEl.innerHTML = '';

        data.options.forEach(val => {
            const btn = document.createElement('button');
            btn.textContent = val;
            btn.className = 'w-full bg-white/80 hover:bg-white px-4 py-2 rounded font-medium transition-all duration-200 flex items-center justify-center relative text-sm md:text-base';
            btn.dataset.value = val;

            btn.onclick = () => this.handleAnswer(val, data.correct);
            this.answersEl.appendChild(btn);
        });
    }

    handleAnswer(selected, correct) {
        const buttons = this.answersEl.querySelectorAll('button');
        buttons.forEach(btn => {
            const btnVal = parseInt(btn.dataset.value);

            if (btnVal === correct) {
                btn.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
                btn.innerHTML = btnVal + ' <span class="ml-2 font-bold">✓</span>';
            } else if (btnVal === selected && selected !== correct) {
                btn.style.background = 'linear-gradient(90deg, #FF416C, #FF4B2B)';
                btn.innerHTML = btnVal + ' <span class="ml-2 font-bold">✗</span>';
            }

            btn.disabled = true;
        });

        setTimeout(() => {
            this.quizBox.classList.add('hidden');
            this.quizActive = false;

            this.answeredPositions[this.currentPos] = true;

            if (selected !== correct) {
                this.wrongAnswers++;
                this.score -= 20;
                this.scoreValue.textContent = this.score;
                this.healthBar.style.width = this.score + '%';

                if (this.score <= 0) {
                    this.showGameOver();
                    return;
                }
            }

            this.speed = -3;

            buttons.forEach(btn => {
                btn.style.background = '';
                btn.disabled = false;
                btn.innerHTML = btn.dataset.value;
            });
        }, 1500);
    }

    showGameOver() {
        this.finished = true;
        this.finalScore.textContent = this.score;
        this.stopCarSound();
        this.gameOverOverlay.classList.remove('hidden');
    }

    showWinner() {
        this.finished = true;
        this.winnerScore.textContent = this.score;
        this.stopCarSound();

        let message = "";
        if (this.wrongAnswers === 0) {
            message = "Selamat! Anda tidak terlambat";
        } else if (this.wrongAnswers === 1) {
            message = "Anda terlambat 5 menit";
        } else if (this.wrongAnswers === 2) {
            message = "Anda terlambat 10 menit";
        } else if (this.wrongAnswers === 3) {
            message = "Anda terlambat 15 menit";
        } else if (this.wrongAnswers === 4) {
            message = "Anda terlambat 20 menit";
        } else if (this.wrongAnswers >= 5) {
            message = "Anda terlambat terlalu lama untuk kuliah. Coba lagi!";
        }

        this.winnerMessage.innerHTML = `<p class="text-base md:text-lg">${message}</p>`;
        this.winnerOverlay.classList.remove('hidden');
    }

    restartGame() {
        this.position = 0;
        this.speed = 0;
        this.currentPos = 0;
        this.score = 100;
        this.wrongAnswers = 0;
        this.finished = false;
        this.quizActive = false;
        this.answeredPositions = [false, false, false, false, false];
        this.carPosition = 0;

        this.scoreValue.textContent = this.score;
        this.healthBar.style.width = '100%';
        this.gameOverOverlay.classList.add('hidden');
        this.winnerOverlay.classList.add('hidden');
        this.strip.style.transform = `translateX(${this.position}px)`;
        this.car.style.transform = `translateX(0px)`;

        this.stopCarSound();

        this.update();
    }

    update() {
        if (this.finished || this.quizActive) {
            requestAnimationFrame(() => this.update());
            return;
        }

        this.position += this.speed;
        this.speed *= (1 - this.friction);
        if (Math.abs(this.speed) < 0.05) this.speed = 0;

        if (this.position > this.leftLimit) {
            this.position = this.leftLimit;
            this.speed = 0;
        }

        if (this.currentPos < this.posIndexes.length) {
            const stopPoint = -this.imgWidth * this.posIndexes[this.currentPos];

            if (this.position <= stopPoint && !this.answeredPositions[this.currentPos] && !this.quizActive) {
                this.position = stopPoint;
                this.speed = 0;
                this.showQuiz();
            }

            if (this.answeredPositions[this.currentPos] && this.position < stopPoint) {
                this.currentPos++;
            }
        }

        const finishPoint = -this.imgWidth * 12;
        if (this.position <= finishPoint) {
            this.position = finishPoint;
            this.speed = 0;
            this.finished = true;

            if (this.score > 0 && this.wrongAnswers < 5) {
                setTimeout(() => {
                    this.showWinner();
                }, 500);
            } else {
                setTimeout(() => {
                    this.showGameOver();
                }, 500);
            }
        }

        this.strip.style.transform = `translateX(${this.position}px)`;
        this.updateCarPosition();
        requestAnimationFrame(() => this.update());
    }

    setupEventListeners() {
        // LOGIKA ORIGINAL: A untuk mundur, D untuk maju - TIDAK DIUBAH
        document.addEventListener('keydown', e => {
            if (this.finished || this.quizActive) return;

            if (e.key === 'd' || e.key === 'ArrowRight') {
                this.speed = Math.max(this.speed - 0.8, -this.maxSpeed);
                this.playCarSound();
            }
            if (e.key === 'a' || e.key === 'ArrowLeft') {
                this.speed = Math.min(this.speed + 0.8, this.maxSpeed);
                this.playCarSound();
            }
        });

        // Touch controls untuk mobile
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', e => {
            if (this.finished || this.quizActive) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', e => {
            if (this.finished || this.quizActive) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Jika swipe horizontal (bukan vertical scroll)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                if (diffX > 0) {
                    // Swipe kanan = maju
                    this.speed = Math.max(this.speed - 0.8, -this.maxSpeed);
                } else {
                    // Swipe kiri = mundur
                    this.speed = Math.min(this.speed + 0.8, this.maxSpeed);
                }
                this.playCarSound();
            }
        });
    }
}

// ========== PAGE NAVIGATION ==========
function showPage(pageId) {
    // Hide semua page content
    document.querySelectorAll('.page-content').forEach(el => {
        el.classList.add('hidden');
    });

    // Show requested page
    const pageContent = document.getElementById(pageId + '-content');
    if (pageContent) {
        pageContent.classList.remove('hidden');
    }

    // Update navigation
    setActivePage(pageId);
}

// Update function setActivePage di script.js
function setActivePage(page) {
    document.querySelectorAll('.nav-link, .mobile-toggle-item').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
        link.classList.add('active');
    });

    // Show page
    showPage(page);

    const isFirstVisit = !sessionStorage.getItem('firstVisit');
    if (!(page === 'home' && isFirstVisit)) {
        // Show popup notification
        const popupNotification = document.getElementById('popupNotification');
        const popupMessage = document.getElementById('popupMessage');
        if (popupNotification && popupMessage) {
            popupMessage.textContent = `Berpindah ke halaman ${page.charAt(0).toUpperCase() + page.slice(1)}`;
            popupNotification.style.animation = 'none';
            popupNotification.offsetHeight;
            popupNotification.style.animation = 'popupSlide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            popupNotification.classList.remove('hidden');
            if (window.popupTimeout) clearTimeout(window.popupTimeout);
            window.popupTimeout = setTimeout(() => {
                popupNotification.classList.add('hidden');
            }, 3000);
        }
    }

    localStorage.setItem('activePage', page);
}

// Setup close buttons
document.addEventListener('DOMContentLoaded', function() {
    // Close game button
    const closeGameBtn = document.getElementById('close-game');
    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', function() {
            document.getElementById('game-content').classList.add('hidden');
            showPage('home');
            playClickSound();
        });
    }

    // Close page buttons
    document.querySelectorAll('.close-page').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.page-content').classList.add('hidden');
            showPage('home');
            playClickSound();
        });
    });

    // Start game text click
    const startGameText = document.getElementById('start-game-text');
    const startGameTextMobile = document.getElementById('start-game-text-mobile');

    if (startGameText) {
        startGameText.addEventListener('click', showGame);
    }

    if (startGameTextMobile) {
        startGameTextMobile.addEventListener('click', showGame);
    }
});

// Fungsi untuk memainkan sound effect
function playClickSound() {
    try {
        const clickSound = new Audio('public/music.mp3');
        clickSound.volume = 0.3;
        clickSound.play().catch(e => console.log('Sound play failed'));
    } catch (error) {
        console.log('Error playing click sound:', error);
    }
}

// Fungsi untuk mengontrol scroll body
function toggleBodyScroll(enable) {
    if (enable) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
    } else {
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    }
}

// Modifikasi fungsi showPage untuk mengontrol scroll
function showPage(pageId) {
    // Jika bukan home page, disable body scroll
    if (pageId !== 'home') {
        toggleBodyScroll(false);
    } else {
        toggleBodyScroll(true);
    }

    // Hide semua page content
    document.querySelectorAll('.page-content').forEach(el => {
        el.classList.add('hidden');
    });

    // Show requested page
    const pageContent = document.getElementById(pageId + '-content');
    if (pageContent) {
        pageContent.classList.remove('hidden');
    }

    // Update navigation
    setActivePage(pageId);
}

// Modifikasi fungsi untuk close page
document.addEventListener('DOMContentLoaded', function() {
    // Close game button
    const closeGameBtn = document.getElementById('close-game');
    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', function() {
            document.getElementById('game-content').classList.add('hidden');
            toggleBodyScroll(true);
            showPage('home');
            playClickSound();
        });
    }

    // Close page buttons
    document.querySelectorAll('.close-page').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.page-content').classList.add('hidden');
            toggleBodyScroll(true);
            showPage('home');
            playClickSound();
        });
    });
});

// Setup event listeners untuk tombol start game
document.addEventListener('DOMContentLoaded', function() {
    // Setup start game buttons (ditambahkan untuk memastikan)
    const startGameText = document.getElementById('start-game-text');
    const startGameTextMobile = document.getElementById('start-game-text-mobile');

    if (startGameText) {
        startGameText.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showGame();
        });
    }

    if (startGameTextMobile) {
        startGameTextMobile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showGame();
        });
    }
});