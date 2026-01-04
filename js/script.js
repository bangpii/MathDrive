// ========== LOADING SCRIPT ==========
function startLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingContent = document.getElementById('loading-content');
    const startButtonContainer = document.getElementById('start-button-container');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingPercentage = document.getElementById('loading-percentage');
    const startButton = document.getElementById('start-button');
    const loadingMusic = document.getElementById('loading-music');
    const backgroundMusic = document.getElementById('background-music');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer') || document.querySelector('[class*="fixed"][class*="bottom-0"]');
    const splineTextSection = document.getElementById('spline-text-section');
    const mobileContent = document.getElementById('mobile-content');

    let progress = 0;
    let musicStarted = false;

    // Sembunyikan semua element saat loading
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (splineTextSection) splineTextSection.style.display = 'none';
    if (mobileContent) mobileContent.style.display = 'none';

    function simulateLoading() {
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 4;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingContent.classList.add('hidden');
                    startButtonContainer.classList.remove('hidden');
                }, 300);
            }
            loadingProgress.style.width = progress + '%';
            loadingPercentage.textContent = Math.floor(progress) + '%';

            // Mulai musik saat progress 90%
            if (progress >= 90 && !musicStarted) {
                musicStarted = true;
                loadingMusic.volume = 0.3;
                loadingMusic.play().catch(e => {
                    console.log('Music autoplay blocked, waiting for user interaction');
                });
            }
        }, 150);
    }

    // Fungsi untuk memainkan sound effect
    function playClickSound() {
        const clickSound = new Audio('public/music.mp3');
        clickSound.volume = 0.3;
        clickSound.play().catch(e => console.log('Sound play failed'));
    }

    // Setup sound untuk semua button
    function setupSoundForButtons() {
        const addSoundToElement = (element) => {
            if (!element) return;

            element.addEventListener('click', function(e) {
                // Jangan mainkan sound untuk disabled elements
                if (this.disabled) return;

                playClickSound();

                // Feedback visual untuk mobile
                if (window.innerWidth < 768) {
                    const originalTransform = this.style.transform;
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = originalTransform;
                    }, 150);
                }
            });
        };

        // Tambahkan sound ke semua button
        document.querySelectorAll('button').forEach(addSoundToElement);

        // Tambahkan sound ke navigation links
        document.querySelectorAll('.nav-link, .mobile-toggle-item').forEach(addSoundToElement);

        // Tambahkan sound ke popup close button
        const closePopup = document.getElementById('closePopup');
        if (closePopup) addSoundToElement(closePopup);

        // Tambahkan sound ke menu button
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) addSoundToElement(menuBtn);
    }

    // Fungsi untuk mengatur tampilan berdasarkan device
    function setupResponsiveDisplay() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Tampilkan mobile content, sembunyikan 3D section
            if (mobileContent) mobileContent.style.display = 'flex';
            if (splineTextSection) splineTextSection.style.display = 'none';
        } else {
            // Tampilkan 3D section, sembunyikan mobile content
            if (mobileContent) mobileContent.style.display = 'none';
            if (splineTextSection) splineTextSection.style.display = 'block';

            // Setup 3D text effects hanya untuk desktop
            setup3DTextEffects();
        }
    }

    startButton.addEventListener('click', function() {
        // Mainkan sound click
        playClickSound();

        // Stop loading music
        loadingMusic.pause();
        loadingMusic.currentTime = 0;

        // Start background music
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().then(() => {
            console.log('Background music started');
        }).catch(error => {
            console.log('Background music autoplay blocked');
        });

        // Fade out loading screen
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';

            // Tampilkan semua element
            if (header) header.style.display = '';
            if (footer) footer.style.display = '';

            // Setup responsive display
            setupResponsiveDisplay();

            // Setup sound untuk semua button
            setupSoundForButtons();

            // Jalankan logika header
            initHeaderFunctions();

            // Show home page by default
            showPage('home');
        }, 500);
    });

    // Setup responsive saat resize
    window.addEventListener('resize', setupResponsiveDisplay);

    // Start loading process
    simulateLoading();
}

// ========== 3D TEXT EFFECTS (Hanya untuk Desktop) ==========
function setup3DTextEffects() {
    const title = document.getElementById('main-3d-title');
    if (!title) return;

    // 1. Efek glow interaktif berdasarkan mouse movement
    document.addEventListener('mousemove', (e) => {
        // Hitung posisi mouse relatif
        const xPercent = e.clientX / window.innerWidth;
        const yPercent = e.clientY / window.innerHeight;

        // Intensitas glow berdasarkan posisi mouse
        const glowIntensity = 0.4 + (yPercent * 0.3); // 40% - 70%

        // Update glow effect dengan warna #00FFF5
        const glow = `
            0 0 1px rgba(0, 0, 0, 0.9),
            0 0 2px rgba(0, 0, 0, 0.7),
            0 0 40px rgba(0, 255, 245, ${glowIntensity}),
            0 0 80px rgba(0, 255, 245, ${glowIntensity * 0.7}),
            0 0 120px rgba(0, 255, 245, ${glowIntensity * 0.5}),
            ${(xPercent - 0.5) * 20}px ${(yPercent - 0.5) * 10}px 50px rgba(0, 0, 0, 0.6)
        `;

        title.style.textShadow = glow;

        // Subtle parallax effect
        const moveX = (xPercent - 0.5) * 15; // ±7.5px
        const moveY = (yPercent - 0.5) * 15; // ±7.5px

        title.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // 2. Reset efek saat mouse keluar
    document.addEventListener('mouseleave', () => {
        // Reset ke shadow default dengan warna #00FFF5
        const defaultShadow = `
            0 0 1px rgba(0, 0, 0, 0.8),
            0 0 2px rgba(0, 0, 0, 0.6),
            0 0 3px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(0, 255, 245, 0.5),
            0 0 60px rgba(0, 255, 245, 0.3),
            0 0 90px rgba(0, 255, 245, 0.2),
            0 10px 30px rgba(0, 0, 0, 0.5)
        `;

        title.style.textShadow = defaultShadow;
        title.style.transform = 'translate(0, 0)';
    });

    // 3. Auto glow pulse effect dengan warna #00FFF5
    setInterval(() => {
        // Jika belum ada animasi, tambahkan
        if (!title.style.animation.includes('text-glow')) {
            title.style.animation = 'text-glow 3s ease-in-out infinite';
        }
    }, 100);

    console.log('🎮 3D Text Effects loaded for desktop');
}

// ========== LOGIKA HEADER ==========
function initHeaderFunctions() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileToggleMenu = document.getElementById('mobileToggleMenu');
    const popupNotification = document.getElementById('popupNotification');
    const popupMessage = document.getElementById('popupMessage');
    const closePopup = document.getElementById('closePopup');

    const pages = {
        home: 'Home',
        about: 'About',
        tujuan: 'Tujuan',
        contact: 'Contact',
        game: 'Game'
    };

    let isMobileMenuOpen = false;
    let isAnimating = false;

    function showPopup(pageName) {
        popupMessage.textContent = `Berpindah ke halaman ${pages[pageName]}`;
        popupNotification.style.animation = 'none';
        popupNotification.offsetHeight;
        popupNotification.style.animation = 'popupSlide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        popupNotification.classList.remove('hidden');
        if (window.popupTimeout) clearTimeout(window.popupTimeout);
        window.popupTimeout = setTimeout(() => hidePopup(), 3000);
    }

    function hidePopup() {
        popupNotification.style.animation = 'popupFadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            popupNotification.classList.add('hidden');
            popupNotification.style.animation = '';
        }, 300);
    }

    function openMobileMenu() {
        if (isAnimating) return;
        isAnimating = true;
        isMobileMenuOpen = true;
        mobileToggleMenu.classList.remove('hidden');
        mobileToggleMenu.classList.remove('mobile-menu-slide-out');
        mobileToggleMenu.classList.add('mobile-menu-slide-in');
        setTimeout(() => {
            mobileToggleMenu.classList.remove('transform', 'translate-x-full');
            isAnimating = false;
        }, 10);
        menuBtn.innerHTML = '<i class="bx bx-x text-2xl"></i>';
        menuBtn.classList.add('bg-[#00FFF5]/30');
    }

    function closeMobileMenu() {
        if (isAnimating) return;
        isAnimating = true;
        mobileToggleMenu.classList.remove('mobile-menu-slide-in');
        mobileToggleMenu.classList.add('mobile-menu-slide-out');
        setTimeout(() => {
            mobileToggleMenu.classList.add('hidden');
            mobileToggleMenu.classList.remove('mobile-menu-slide-out');
            mobileToggleMenu.classList.add('transform', 'translate-x-full');
            isMobileMenuOpen = false;
            isAnimating = false;
            menuBtn.innerHTML = '<i class="bx bx-menu text-2xl"></i>';
            menuBtn.classList.remove('bg-[#00FFF5]/30');
        }, 300);
    }

    function toggleMobileMenu() {
        if (isAnimating) return;
        if (isMobileMenuOpen) closeMobileMenu();
        else openMobileMenu();
    }

    // Event listener untuk menu button
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileMenu();
        });
    }

    // Close mobile menu ketika klik di luar
    document.addEventListener('click', function(e) {
        if (mobileToggleMenu && menuBtn && !mobileToggleMenu.contains(e.target) && !menuBtn.contains(e.target) && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // Close popup button
    if (closePopup) {
        closePopup.addEventListener('click', function(e) {
            e.preventDefault();
            hidePopup();
        });
    }

    // Navigation links event listeners
    document.querySelectorAll('.nav-link, .mobile-toggle-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');

            if (page === 'game') {
                showGame();
            } else {
                setActivePage(page);
            }

            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        });
    });

    // Setup Escape key untuk close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isMobileMenuOpen) closeMobileMenu();
            if (popupNotification && !popupNotification.classList.contains('hidden')) hidePopup();
        }
    });

    // Setup window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && isMobileMenuOpen) closeMobileMenu();
    });

    console.log('✅ Header navigation initialized');
}

// ========== PAGE NAVIGATION FUNCTION ==========
function showPage(pageId) {
    console.log('Navigating to:', pageId);

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

function setActivePage(page) {
    console.log('Setting active page:', page);

    // Update nav links
    document.querySelectorAll('.nav-link, .mobile-toggle-item').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
        link.classList.add('active');
    });

    // Tampilkan popup notification (kecuali untuk first visit)
    const isFirstVisit = !sessionStorage.getItem('firstVisit');
    if (!(page === 'home' && isFirstVisit)) {
        const popupNotification = document.getElementById('popupNotification');
        const popupMessage = document.getElementById('popupMessage');
        if (popupNotification && popupMessage) {
            const pageNames = {
                'home': 'Home',
                'about': 'About',
                'tujuan': 'Tujuan Pembelajaran',
                'contact': 'Contact',
                'game': 'Game'
            };
            popupMessage.textContent = `Berpindah ke halaman ${pageNames[page] || page}`;
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

    // Save to localStorage
    localStorage.setItem('activePage', page);
}

// ========== START EVERYTHING ==========
document.addEventListener('DOMContentLoaded', startLoading);

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Ambil nilai dari form
            const email = document.getElementById('emailInput').value;
            const phone = document.getElementById('phoneInput').value;
            const message = document.getElementById('messageInput').value;

            // Format pesan untuk WhatsApp
            const whatsappMessage = `*Pesan dari Math Drive Website*%0A%0A📧 *Email:* ${email || 'Tidak diisi'}%0A📱 *Nomor Telepon:* ${phone || 'Tidak diisi'}%0A💬 *Pesan:* ${message || 'Tidak diisi'}`;

            // Nomor WhatsApp yang dituju (sesuaikan dengan format internasional)
            const phoneNumber = "6285769537327"; // Tanpa tanda + dan spasi

            // Buat URL WhatsApp
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

            // Buka WhatsApp di tab baru
            window.open(whatsappURL, '_blank');

            // Reset form (opsional)
            contactForm.reset();
        });
    }
});