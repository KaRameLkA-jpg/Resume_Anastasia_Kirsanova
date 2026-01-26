// ============================================
// 🎬 LOADING SCREEN ANIMATION
// ============================================

(function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const percentElement = document.getElementById('loading-percent');
    const progressRing = document.querySelector('.ring-progress');
    
    if (!loadingScreen) return;
    
    // Lock body scroll during loading
    document.body.classList.add('loading-active');
    
    // Progress animation
    let progress = 0;
    const circumference = 2 * Math.PI * 45; // r=45 from SVG
    const duration = 2500; // Total loading time
    const startTime = performance.now();
    
    function updateProgress() {
        const elapsed = performance.now() - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth progress
        progress = easeOutQuart(rawProgress) * 100;
        
        // Update percentage text
        if (percentElement) {
            percentElement.textContent = Math.floor(progress);
        }
        
        // Update progress ring
        if (progressRing) {
            const offset = circumference - (progress / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }
        
        if (rawProgress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            // Trigger glitch effect once
            setTimeout(() => {
                loadingScreen.classList.add('glitch');
                setTimeout(() => loadingScreen.classList.remove('glitch'), 300);
            }, 100);
            
            // Complete loading sequence
            setTimeout(completeLoading, 500);
        }
    }
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function completeLoading() {
        // Flash effect
        loadingScreen.classList.add('flash');
        
        // Trigger zoom-in effect on main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        
        // Expand and fade out
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            document.body.classList.remove('loading-active');
            
            // Remove from DOM after transition
            setTimeout(() => {
                loadingScreen.remove();
            }, 800);
        }, 400);
    }
    
    // Start animation after brief delay
    setTimeout(() => {
        requestAnimationFrame(updateProgress);
    }, 400);
})();

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        document.querySelectorAll('.skill-card, .project-card, .skill-tag').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('animate-fadeInUp');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Initialize 3D Character
    init3DCharacter();
});

// ============================================
// 🖼️ PROJECT CAROUSEL
// ============================================
const carouselState = {
    jurmak: 0,
    foodgram: 0,
    neonplaner: 0
};

const projectImages = {
    jurmak: ['1jur.png', '2jur.png', '3jur.png', '4jur.png'],
    foodgram: ['food1.png', 'food2.png'],
    neonplaner: ['NP1.jpg', 'NP2.jpg', 'NP3.jpg', 'NP4.jpg', 'NP5.jpg']
};

let currentLightboxProject = null;
let currentLightboxIndex = 0;

function changeSlide(projectId, direction) {
    const carousel = document.querySelector(`.project-carousel[data-project="${projectId}"]`);
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll(`#${projectId}-dots .dot`);
    const totalSlides = images.length;
    
    // Remove active from current
    images[carouselState[projectId]].classList.remove('active');
    dots[carouselState[projectId]].classList.remove('active');
    
    // Calculate new index
    carouselState[projectId] = (carouselState[projectId] + direction + totalSlides) % totalSlides;
    
    // Add active to new
    images[carouselState[projectId]].classList.add('active');
    dots[carouselState[projectId]].classList.add('active');
}

function goToSlide(projectId, index) {
    const carousel = document.querySelector(`.project-carousel[data-project="${projectId}"]`);
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll(`#${projectId}-dots .dot`);
    
    // Remove active from current
    images[carouselState[projectId]].classList.remove('active');
    dots[carouselState[projectId]].classList.remove('active');
    
    // Set new index
    carouselState[projectId] = index;
    
    // Add active to new
    images[carouselState[projectId]].classList.add('active');
    dots[carouselState[projectId]].classList.add('active');
}

// ============================================
// 🔍 LIGHTBOX
// ============================================
function openLightbox(projectId, index) {
    currentLightboxProject = projectId;
    currentLightboxIndex = index;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const dotsContainer = document.getElementById('lightbox-dots');
    
    // Set image
    lightboxImg.src = projectImages[projectId][index];
    
    // Create dots
    dotsContainer.innerHTML = '';
    projectImages[projectId].forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === index ? ' active' : '');
        dot.onclick = (e) => { e.stopPropagation(); goToLightboxSlide(i); };
        dotsContainer.appendChild(dot);
    });
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('lightbox-close')) return;
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightboxSlide(direction) {
    const images = projectImages[currentLightboxProject];
    const totalSlides = images.length;
    
    currentLightboxIndex = (currentLightboxIndex + direction + totalSlides) % totalSlides;
    
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = images[currentLightboxIndex];
    
    // Update dots
    const dots = document.querySelectorAll('#lightbox-dots .dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentLightboxIndex);
    });
}

function goToLightboxSlide(index) {
    currentLightboxIndex = index;
    
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = projectImages[currentLightboxProject][index];
    
    // Update dots
    const dots = document.querySelectorAll('#lightbox-dots .dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightboxSlide(-1);
    if (e.key === 'ArrowRight') changeLightboxSlide(1);
});

// ============================================
// 🍎 APPLE-STYLE 3D CHARACTER
// ============================================
function init3DCharacter() {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    // ==================== SCENE SETUP ====================
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(35, container.offsetWidth / container.offsetHeight, 0.1, 100);
    camera.position.set(0, 0.2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ==================== LIGHTING ====================
    // Soft main light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(2, 3, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xeef0ff, 0.5);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    // Ambient
    const ambientLight = new THREE.AmbientLight(0x6060a0, 0.4);
    scene.add(ambientLight);

    // Purple accent rim
    const rimLight = new THREE.PointLight(0xc770f0, 0.6, 6);
    rimLight.position.set(0, 0.5, -2);
    scene.add(rimLight);

    // ==================== ANIMATION STATE ====================
    const state = {
        mouse: { x: 0, y: 0 },
        smoothMouse: { x: 0, y: 0 },
        scroll: 0,
        smoothScroll: 0,
        time: 0,
        blink: { active: false, progress: 0 },
        typing: true
    };

    // Smooth interpolation
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // ==================== CHARACTER ====================
    const character = new THREE.Group();
    character.name = 'character';

    // ========== MATERIALS (Apple style - clean, soft) ==========
    const materials = {
        skin: new THREE.MeshStandardMaterial({
            color: 0xffdbcc,
            roughness: 0.5,
            metalness: 0.0
        }),
        hair: new THREE.MeshStandardMaterial({
            color: 0x8B7355, // Русый цвет волос
            roughness: 0.65,
            metalness: 0.05
        }),
        cloth: new THREE.MeshStandardMaterial({
            color: 0x2d2d3a,
            roughness: 0.8,
            metalness: 0.0
        }),
        eyeWhite: new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.0
        }),
        iris: new THREE.MeshStandardMaterial({
            color: 0x5588bb,
            roughness: 0.2,
            metalness: 0.0
        }),
        pupil: new THREE.MeshBasicMaterial({ color: 0x111111 }),
        eyeHighlight: new THREE.MeshBasicMaterial({ color: 0xffffff }),
        lip: new THREE.MeshStandardMaterial({
            color: 0xdd9999,
            roughness: 0.4,
            metalness: 0.0
        }),
        desk: new THREE.MeshStandardMaterial({
            color: 0x1a1a22,
            roughness: 0.6,
            metalness: 0.3
        }),
        laptop: new THREE.MeshStandardMaterial({
            color: 0x888899,
            roughness: 0.2,
            metalness: 0.8
        }),
        screen: new THREE.MeshBasicMaterial({ color: 0x1a1a2a }),
        headphones: new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.3,
            metalness: 0.6
        }),
        headphonesBand: new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,
            roughness: 0.4,
            metalness: 0.5
        })
    };

    // ========== HEAD ==========
    const head = new THREE.Group();
    head.name = 'head';

    // Нижняя часть головы (лицо) - видимая часть
    const faceMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 64, 64),
        materials.skin
    );
    faceMesh.scale.set(0.9, 0.95, 0.85);
    faceMesh.castShadow = true;
    head.add(faceMesh);

    // Верхняя часть черепа (будет скрыта волосами)
    const skullTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
        materials.skin
    );
    skullTop.position.y = 0.08;
    skullTop.scale.set(0.95, 0.7, 0.9);
    head.add(skullTop);

    // Ears
    [-1, 1].forEach(side => {
        const ear = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 24, 24),
            materials.skin
        );
        ear.position.set(side * 0.3, 0, -0.02);
        ear.scale.set(0.4, 0.7, 0.5);
        head.add(ear);
    });

    // ========== EYES ==========
    const eyes = new THREE.Group();
    eyes.name = 'eyes';

    [-1, 1].forEach(side => {
        const eyeGroup = new THREE.Group();
        eyeGroup.name = side === -1 ? 'leftEye' : 'rightEye';
        eyeGroup.position.set(side * 0.12, 0.05, 0.28);

        // Eyeball (white)
        const eyeball = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 32, 32),
            materials.eyeWhite
        );
        eyeball.scale.set(1, 1, 0.6);
        eyeGroup.add(eyeball);

        // Iris
        const iris = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 24, 24),
            materials.iris
        );
        iris.name = side === -1 ? 'leftIris' : 'rightIris';
        iris.position.z = 0.035;
        iris.scale.set(1, 1, 0.4);
        eyeGroup.add(iris);

        // Pupil
        const pupil = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 16, 16),
            materials.pupil
        );
        pupil.name = side === -1 ? 'leftPupil' : 'rightPupil';
        pupil.position.z = 0.05;
        eyeGroup.add(pupil);

        // Highlight
        const highlight = new THREE.Mesh(
            new THREE.SphereGeometry(0.01, 8, 8),
            materials.eyeHighlight
        );
        highlight.position.set(0.015, 0.02, 0.055);
        eyeGroup.add(highlight);

        // Upper eyelid (for blinking)
        const eyelid = new THREE.Mesh(
            new THREE.SphereGeometry(0.075, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5),
            materials.skin
        );
        eyelid.name = side === -1 ? 'leftEyelid' : 'rightEyelid';
        eyelid.rotation.x = Math.PI * 0.5;
        eyelid.position.z = 0.01;
        eyelid.scale.set(1, 0.6, 0.15);
        eyelid.visible = false; // Hidden unless blinking
        eyeGroup.add(eyelid);

        eyes.add(eyeGroup);
    });

    head.add(eyes);

    // ========== EYEBROWS ==========
    [-1, 1].forEach(side => {
        const brow = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.015, 0.02),
            materials.hair
        );
        brow.name = side === -1 ? 'leftBrow' : 'rightBrow';
        brow.position.set(side * 0.12, 0.16, 0.28);
        brow.rotation.z = side * -0.1;
        head.add(brow);
    });

    // ========== NOSE ==========
    const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 24, 24),
        materials.skin
    );
    nose.position.set(0, -0.04, 0.34);
    nose.scale.set(0.8, 0.5, 0.6);
    head.add(nose);

    // ========== MOUTH ==========
    const mouth = new THREE.Group();
    mouth.name = 'mouth';
    mouth.position.set(0, -0.14, 0.28);

    // Smile curve - улыбка (уголки вверх)
    const smileGeom = new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI);
    const smile = new THREE.Mesh(smileGeom, materials.lip);
    smile.rotation.x = 0;
    smile.rotation.z = Math.PI;
    mouth.add(smile);

    head.add(mouth);

    // ========== HAIR (Русое каре) ==========
    const hair = new THREE.Group();
    hair.name = 'hair';

    // Основной объем волос сверху (макушка) - поднята выше
    const hairTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
        materials.hair
    );
    hairTop.position.y = 0.18;
    hairTop.scale.set(0.95, 0.65, 0.92);
    hair.add(hairTop);

    // Соединительный эллипс между макушкой и боками (левый) - сдвинут внутрь
    const connectorLeft = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        materials.hair
    );
    connectorLeft.position.set(-0.20, 0.08, -0.02);
    connectorLeft.scale.set(0.8, 0.7, 0.8);
    hair.add(connectorLeft);

    // Соединительный эллипс между макушкой и боками (правый) - сдвинут внутрь
    const connectorRight = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        materials.hair
    );
    connectorRight.position.set(0.20, 0.08, -0.02);
    connectorRight.scale.set(0.8, 0.7, 0.8);
    hair.add(connectorRight);

    // ========== НАУШНИКИ ==========
    const headphones = new THREE.Group();
    headphones.name = 'headphones';

    // Левый наушник (амбушюра) - сбоку головы на уровне ушей
    const earCupLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24),
        materials.headphones
    );
    earCupLeft.position.set(-0.34, 0.0, -0.02);
    earCupLeft.rotation.z = Math.PI / 2;
    headphones.add(earCupLeft);

    // Подушечка левого наушника
    const earPadLeft = new THREE.Mesh(
        new THREE.TorusGeometry(0.09, 0.02, 12, 24),
        materials.headphones
    );
    earPadLeft.position.set(-0.31, 0.0, -0.02);
    earPadLeft.rotation.y = Math.PI / 2;
    headphones.add(earPadLeft);

    // Правый наушник (амбушюра)
    const earCupRight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24),
        materials.headphones
    );
    earCupRight.position.set(0.34, 0.0, -0.02);
    earCupRight.rotation.z = Math.PI / 2;
    headphones.add(earCupRight);

    // Подушечка правого наушника
    const earPadRight = new THREE.Mesh(
        new THREE.TorusGeometry(0.09, 0.02, 12, 24),
        materials.headphones
    );
    earPadRight.position.set(0.31, 0.0, -0.02);
    earPadRight.rotation.y = Math.PI / 2;
    headphones.add(earPadRight);

    // Дуга наушников (оголовье) - идёт через макушку слева направо
    const headband = new THREE.Mesh(
        new THREE.TorusGeometry(0.34, 0.02, 12, 32, Math.PI),
        materials.headphonesBand
    );
    headband.position.set(0, 0.0, -0.02);
    headband.rotation.x = 0;  // дуга в плоскости XY
    headband.rotation.y = 0;
    headband.rotation.z = 0;  // полукруг открыт вниз, идёт сверху
    headphones.add(headband);

    // Подушечка оголовья сверху на макушке
    const headbandPad = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.025, 0.06),
        materials.headphones
    );
    headbandPad.position.set(0, 0.34, -0.02);
    headphones.add(headbandPad);

    // Наушники добавляются после волос (см. ниже)

    // Эллипс для мягкого перехода к затылку сверху
    const hairTopBack = new THREE.Mesh(
        new THREE.SphereGeometry(0.30, 24, 24),
        materials.hair
    );
    hairTopBack.position.set(0, 0.12, -0.1);
    hairTopBack.scale.set(1.2, 0.6, 0.8);
    hair.add(hairTopBack);

    // Затылок - объемная часть сзади (шире)
    const hairBack = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 32, 32),
        materials.hair
    );
    hairBack.position.set(0, 0.02, -0.12);
    hairBack.scale.set(1.1, 0.85, 0.7);
    hair.add(hairBack);

    // Левая сторона каре - сдвинута внутрь чтобы не перекрывать наушники
    const hairLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.08, 0.35, 16),
        materials.hair
    );
    hairLeft.position.set(-0.22, -0.08, -0.04);
    hairLeft.rotation.z = 0.15;
    hairLeft.scale.set(1, 1, 0.7);
    hair.add(hairLeft);

    // Закругление снизу левой стороны
    const hairLeftBottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        materials.hair
    );
    hairLeftBottom.position.set(-0.20, -0.24, -0.04);
    hairLeftBottom.scale.set(1, 0.5, 0.7);
    hair.add(hairLeftBottom);

    // Правая сторона каре - сдвинута внутрь
    const hairRight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.08, 0.35, 16),
        materials.hair
    );
    hairRight.position.set(0.22, -0.08, -0.04);
    hairRight.rotation.z = -0.15;
    hairRight.scale.set(1, 1, 0.7);
    hair.add(hairRight);

    // Закругление снизу правой стороны
    const hairRightBottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        materials.hair
    );
    hairRightBottom.position.set(0.20, -0.24, -0.04);
    hairRightBottom.scale.set(1, 0.5, 0.7);
    hair.add(hairRightBottom);

    // Плавные соединители между макушкой и боковыми прядями (средний уровень)
    const midConnectorLeft = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        materials.hair
    );
    midConnectorLeft.position.set(-0.22, 0.0, -0.04);
    midConnectorLeft.scale.set(0.7, 0.9, 0.8);
    hair.add(midConnectorLeft);

    const midConnectorRight = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        materials.hair
    );
    midConnectorRight.position.set(0.22, 0.0, -0.04);
    midConnectorRight.scale.set(0.7, 0.9, 0.8);
    hair.add(midConnectorRight);

    // Соединители между затылком и боковыми прядями
    const backSideConnectorLeft = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        materials.hair
    );
    backSideConnectorLeft.position.set(-0.22, -0.02, -0.06);
    backSideConnectorLeft.scale.set(0.8, 0.95, 0.8);
    hair.add(backSideConnectorLeft);

    const backSideConnectorRight = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        materials.hair
    );
    backSideConnectorRight.position.set(0.22, -0.02, -0.06);
    backSideConnectorRight.scale.set(0.8, 0.95, 0.8);
    hair.add(backSideConnectorRight);

    // Нижние соединители для плавного перехода к кончикам
    const lowerConnectorLeft = new THREE.Mesh(
        new THREE.SphereGeometry(0.10, 16, 16),
        materials.hair
    );
    lowerConnectorLeft.position.set(-0.20, -0.12, -0.04);
    lowerConnectorLeft.scale.set(0.7, 0.8, 0.8);
    hair.add(lowerConnectorLeft);

    const lowerConnectorRight = new THREE.Mesh(
        new THREE.SphereGeometry(0.10, 16, 16),
        materials.hair
    );
    lowerConnectorRight.position.set(0.20, -0.12, -0.04);
    lowerConnectorRight.scale.set(0.7, 0.8, 0.8);
    hair.add(lowerConnectorRight);

    // Задняя часть волос (спускается до плеч)
    const hairBackLower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.20, 0.55, 16),
        materials.hair
    );
    hairBackLower.position.set(0, -0.22, -0.16);
    hairBackLower.scale.set(1.1, 1, 0.6);
    hair.add(hairBackLower);

    // Средняя часть задних волос
    const hairBackMid = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        materials.hair
    );
    hairBackMid.position.set(0, -0.35, -0.14);
    hairBackMid.scale.set(1.1, 0.6, 0.6);
    hair.add(hairBackMid);

    // Закругление задней нижней части (кончики у плеч)
    const hairBackBottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.20, 16, 16),
        materials.hair
    );
    hairBackBottom.position.set(0, -0.48, -0.12);
    hairBackBottom.scale.set(1.2, 0.35, 0.6);
    hair.add(hairBackBottom);

    // Левая прядь сзади (длинная)
    const hairBackLeftLong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.06, 0.35, 12),
        materials.hair
    );
    hairBackLeftLong.position.set(-0.18, -0.38, -0.12);
    hairBackLeftLong.rotation.z = 0.1;
    hairBackLeftLong.scale.set(1, 1, 0.7);
    hair.add(hairBackLeftLong);

    // Правая прядь сзади (длинная)
    const hairBackRightLong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.06, 0.35, 12),
        materials.hair
    );
    hairBackRightLong.position.set(0.18, -0.38, -0.12);
    hairBackRightLong.rotation.z = -0.1;
    hairBackRightLong.scale.set(1, 1, 0.7);
    hair.add(hairBackRightLong);

    head.add(hair);

    // Добавляем наушники поверх волос
    head.add(headphones);

    head.position.y = 0.55;
    character.add(head);

    // ========== NECK ==========
    const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.12, 16),
        materials.skin
    );
    neck.position.y = 0.2;
    character.add(neck);

    // ========== BODY ==========
    const body = new THREE.Group();
    body.name = 'body';

    // Torso
    const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.26, 0.5, 24),
        materials.cloth
    );
    torso.name = 'torso';
    torso.position.y = -0.12;
    torso.castShadow = true;
    body.add(torso);

    // Shoulders
    [-1, 1].forEach(side => {
        const shoulder = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 20, 20),
            materials.cloth
        );
        shoulder.name = side === -1 ? 'leftShoulder' : 'rightShoulder';
        shoulder.position.set(side * 0.26, 0.05, 0);
        shoulder.castShadow = true;
        body.add(shoulder);
    });

    character.add(body);

    // ========== ARMS ==========
    const arms = new THREE.Group();
    arms.name = 'arms';

    [-1, 1].forEach(side => {
        const armGroup = new THREE.Group();
        armGroup.name = side === -1 ? 'leftArmGroup' : 'rightArmGroup';

        // Upper arm
        const upperArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.055, 0.05, 0.25, 12),
            materials.cloth
        );
        upperArm.name = side === -1 ? 'leftUpperArm' : 'rightUpperArm';
        upperArm.position.y = -0.12;
        upperArm.castShadow = true;
        armGroup.add(upperArm);

        // Lower arm
        const lowerArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045, 0.04, 0.22, 12),
            materials.cloth
        );
        lowerArm.name = side === -1 ? 'leftLowerArm' : 'rightLowerArm';
        lowerArm.position.y = -0.35;
        lowerArm.castShadow = true;
        armGroup.add(lowerArm);

        // Hand
        const hand = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 16, 16),
            materials.skin
        );
        hand.name = side === -1 ? 'leftHand' : 'rightHand';
        hand.position.y = -0.48;
        hand.scale.set(1, 0.6, 1.1);
        armGroup.add(hand);

        // Position arm group - руки направлены к клавиатуре
        armGroup.position.set(side * 0.28, 0.05, 0.12);
        armGroup.rotation.x = -0.75;
        armGroup.rotation.z = side * 0.15;

        arms.add(armGroup);
    });

    character.add(arms);

    // ========== WORKSPACE ==========
    const workspace = new THREE.Group();
    workspace.name = 'workspace';

    // Desk - поднят ближе к рукам
    const desk = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.04, 0.7),
        materials.desk
    );
    desk.position.set(0, -0.42, 0.35);
    desk.receiveShadow = true;
    workspace.add(desk);

    // Клавиатура
    const keyboardBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.02, 0.15),
        materials.laptop
    );
    keyboardBase.position.set(0, -0.39, 0.45);
    workspace.add(keyboardBase);

    // Клавиши клавиатуры
    const keyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.5,
        metalness: 0.3
    });
    
    // Ряды клавиш
    for (let row = 0; row < 4; row++) {
        const keysInRow = row === 3 ? 8 : 12;
        const rowWidth = row === 3 ? 0.32 : 0.40;
        const keyWidth = rowWidth / keysInRow - 0.005;
        
        for (let i = 0; i < keysInRow; i++) {
            const key = new THREE.Mesh(
                new THREE.BoxGeometry(keyWidth, 0.008, 0.025),
                keyMaterial
            );
            const xOffset = (i - keysInRow / 2 + 0.5) * (rowWidth / keysInRow);
            key.position.set(xOffset, -0.375, 0.40 + row * 0.032);
            workspace.add(key);
        }
    }

    // Пробел (большая клавиша)
    const spaceBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.008, 0.025),
        keyMaterial
    );
    spaceBar.position.set(0, -0.375, 0.53);
    workspace.add(spaceBar);

    // Монитор (вместо ноутбука) - за клавиатурой
    const monitorStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.05, 0.08, 12),
        materials.laptop
    );
    monitorStand.position.set(0, -0.36, 0.15);
    workspace.add(monitorStand);

    const monitorBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.01, 0.08),
        materials.laptop
    );
    monitorBase.position.set(0, -0.39, 0.15);
    workspace.add(monitorBase);

    // Экран монитора
    const monitorScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.32, 0.02),
        materials.laptop
    );
    monitorScreen.position.set(0, -0.18, 0.12);
    monitorScreen.rotation.x = -0.1;
    workspace.add(monitorScreen);

    // Дисплей монитора
    const screenDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(0.46, 0.28),
        materials.screen
    );
    screenDisplay.position.set(0, -0.18, 0.135);
    screenDisplay.rotation.x = -0.1;
    workspace.add(screenDisplay);

    // Code lines on screen
    const codeColors = [0xc770f0, 0x66aaff, 0x77dd77, 0xffaa55];
    for (let i = 0; i < 6; i++) {
        const lineWidth = 0.06 + Math.random() * 0.2;
        const line = new THREE.Mesh(
            new THREE.PlaneGeometry(lineWidth, 0.012),
            new THREE.MeshBasicMaterial({ 
                color: codeColors[i % codeColors.length],
                transparent: true,
                opacity: 0.8
            })
        );
        line.position.set(-0.08, -0.08 - i * 0.03, 0.14);
        line.rotation.x = -0.1;
        workspace.add(line);
    }

    // Screen glow
    const screenGlow = new THREE.PointLight(0x6655cc, 0.4, 1.5);
    screenGlow.position.set(0, -0.15, 0.4);
    workspace.add(screenGlow);

    character.add(workspace);

    // Position entire character
    character.position.y = -0.1;
    scene.add(character);

    // ==================== ANIMATION FUNCTIONS ====================

    // Blink animation
    function updateBlink(delta) {
        // Random blink trigger
        if (!state.blink.active && Math.random() < 0.003) {
            state.blink.active = true;
            state.blink.progress = 0;
        }

        if (state.blink.active) {
            state.blink.progress += delta * 6;

            const blinkAmount = state.blink.progress < 0.5
                ? ease(state.blink.progress * 2)
                : ease(1 - (state.blink.progress - 0.5) * 2);

            // Scale eyes vertically for blink effect
            const leftEye = character.getObjectByName('leftEye');
            const rightEye = character.getObjectByName('rightEye');
            
            if (leftEye && rightEye) {
                const scaleY = 1 - blinkAmount * 0.9;
                leftEye.scale.y = scaleY;
                rightEye.scale.y = scaleY;
            }

            if (state.blink.progress >= 1) {
                state.blink.active = false;
                if (leftEye) leftEye.scale.y = 1;
                if (rightEye) rightEye.scale.y = 1;
            }
        }
    }

    // Eye tracking - more pronounced movement
    function updateEyes() {
        const offset = {
            x: state.smoothMouse.x * 0.025,
            y: state.smoothMouse.y * 0.018
        };

        ['left', 'right'].forEach(side => {
            const iris = character.getObjectByName(`${side}Iris`);
            const pupil = character.getObjectByName(`${side}Pupil`);
            
            if (iris) {
                iris.position.x = offset.x;
                iris.position.y = offset.y;
            }
            if (pupil) {
                pupil.position.x = offset.x * 1.1;
                pupil.position.y = offset.y * 1.1;
            }
        });
    }

    // Head tracking - faster and more responsive
    function updateHead() {
        const headGroup = character.getObjectByName('head');
        if (headGroup) {
            const targetY = state.smoothMouse.x * 0.35;
            const targetX = -state.smoothMouse.y * 0.22;

            headGroup.rotation.y = lerp(headGroup.rotation.y, targetY, 0.15);
            headGroup.rotation.x = lerp(headGroup.rotation.x, targetX, 0.15);
        }
    }

    // Breathing animation
    function updateBreathing(time) {
        const torso = character.getObjectByName('torso');
        const breathe = Math.sin(time * 0.8) * 0.02;

        if (torso) {
            torso.scale.x = 1 + breathe;
            torso.scale.z = 1 + breathe * 0.5;
        }

        // Subtle shoulder movement
        ['left', 'right'].forEach(side => {
            const shoulder = character.getObjectByName(`${side}Shoulder`);
            if (shoulder) {
                shoulder.position.y = 0.05 + breathe * 0.15;
            }
        });
    }

    // Typing animation - more visible keyboard typing motion
    function updateTyping(time) {
        if (!state.typing) return;

        ['left', 'right'].forEach((side, i) => {
            const hand = character.getObjectByName(`${side}Hand`);
            const lowerArm = character.getObjectByName(`${side}LowerArm`);
            const armGroup = character.getObjectByName(`${side}ArmGroup`);
            
            if (hand) {
                // Faster, more pronounced typing motion
                const phase = time * 12 + i * Math.PI;
                const altPhase = time * 15 + i * Math.PI * 0.7;
                
                // Vertical movement (pressing keys)
                hand.position.y = -0.48 + Math.sin(phase) * 0.025;
                // Slight horizontal movement (moving between keys)
                hand.position.x = Math.sin(altPhase * 0.6) * 0.012;
                // Subtle rotation for natural finger movement
                hand.rotation.x = Math.sin(phase) * 0.15;
            }
            
            if (lowerArm) {
                // Subtle forearm movement following hands
                const armPhase = time * 10 + i * Math.PI;
                lowerArm.rotation.x = Math.sin(armPhase) * 0.04;
            }
            
            if (armGroup) {
                // Very subtle arm group movement for natural typing posture
                const groupPhase = time * 6 + i * Math.PI * 0.5;
                armGroup.rotation.x = -0.75 + Math.sin(groupPhase) * 0.02;
            }
        });
    }

    // Idle micro-movements
    function updateIdle(time) {
        // Very subtle body sway
        character.position.y = -0.1 + Math.sin(time * 0.5) * 0.005;
        
        // Subtle head tilt
        const headGroup = character.getObjectByName('head');
        if (headGroup && !state.blink.active) {
            headGroup.rotation.z = Math.sin(time * 0.3) * 0.015;
        }
    }

    // Scroll-based pose
    function updateScrollPose() {
        const progress = state.smoothScroll;

        // Stop typing on scroll
        state.typing = progress < 0.15;

        // Body lean
        const bodyGroup = character.getObjectByName('body');
        if (bodyGroup) {
            bodyGroup.rotation.x = -progress * 0.1;
        }

        // Arms relax
        const rightArm = character.getObjectByName('rightArmGroup');
        if (rightArm && progress > 0.3) {
            const relax = (progress - 0.3) * 0.5;
            rightArm.rotation.z = -0.2 - relax * 0.3;
        }

        // Camera adjustment
        camera.position.z = 4 - progress * 0.5;
        camera.position.y = 0.2 + progress * 0.15;
    }

    // ==================== EVENT HANDLERS ====================
    document.addEventListener('mousemove', (e) => {
        state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        state.scroll = Math.min(window.scrollY / (maxScroll * 0.25), 1);
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    // ==================== RENDER LOOP ====================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        state.time = clock.getElapsedTime();

        // Smooth interpolation - faster response for head/eyes
        state.smoothMouse.x = lerp(state.smoothMouse.x, state.mouse.x, 0.18);
        state.smoothMouse.y = lerp(state.smoothMouse.y, state.mouse.y, 0.18);
        state.smoothScroll = lerp(state.smoothScroll, state.scroll, 0.06);

        // Run animations
        updateBlink(delta);
        updateEyes();
        updateHead();
        updateBreathing(state.time);
        updateTyping(state.time);
        updateIdle(state.time);
        updateScrollPose();

        renderer.render(scene, camera);
    }

    animate();
}

// ============================================
// 🔄 INVERT CURSOR EFFECT
// ============================================

document.addEventListener('DOMContentLoaded', function initInvertCursor() {
    const cursor = document.getElementById('cursor-invert');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const ease = 0.15;

    // Show cursor when mouse enters window
    document.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!cursor.classList.contains('active')) {
            cursor.classList.add('active');
        }
    });

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .skill-tag, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
});
