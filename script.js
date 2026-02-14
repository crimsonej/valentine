gsap.registerPlugin(ScrollTrigger);

/* ===============================
   AUTO LOVE MUSIC (No Click Needed)
================================ */

const bgAudio = document.getElementById("bg-audio");
bgAudio.volume = 0;
bgAudio.play().then(() => {
    gsap.to(bgAudio, { volume: 0.5, duration: 3 });
}).catch(() => {
    // fallback for strict browsers
    document.addEventListener("click", () => {
        bgAudio.play();
        gsap.to(bgAudio, { volume: 0.5, duration: 3 });
    }, { once: true });
});

/* Click effects (delegated) */
window.addEventListener("click", e => {
    const target = e.target;

    // Music toggle: play/pause background audio
    const musicBtn = target.closest('.music-toggle');
    if (musicBtn) {
        if (bgAudio.paused) {
            bgAudio.play().catch(()=>{});
            gsap.to(musicBtn, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1 });
        } else {
            bgAudio.pause();
            gsap.to(musicBtn, { rotation: 15, duration: 0.12, yoyo: true, repeat: 1 });
        }
        return;
    }

    // Hero title / hero-content: bold pop + letter spacing pulse
    const hero = target.closest('.hero-content') || target.closest('.hero');
    if (hero) {
        const title = hero.querySelector('h1');
        if (title) {
            gsap.fromTo(title, { scale: 0.98, letterSpacing: '4px' }, { scale: 1.03, letterSpacing: '12px', duration: 0.28, yoyo: true, repeat: 1, ease: 'power2.out' });
        }
        return;
    }

    // Big quote span: color flash and small scale
    const bigQuoteSpan = target.closest('.big-quote') || target.matches('.big-quote span') && target;
    if (bigQuoteSpan) {
        const el = target.matches('.big-quote span') ? target : bigQuoteSpan.querySelector('span');
        if (el) {
            gsap.fromTo(el, { scale: 1 }, { scale: 1.08, color: 'var(--bright-red)', duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.out' });
        }
        return;
    }

    // Click on a feature card: small pop + floating hearts
    const card = target.closest('.feature-card');
    if (card) {
        gsap.fromTo(card, { scale: 0.98 }, { scale: 1.02, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
        // spawn 6 tiny hearts around click
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.style.left = (e.clientX + (Math.random() - 0.5) * 80) + 'px';
            heart.style.top = (e.clientY + (Math.random() - 0.5) * 40) + 'px';
            heart.style.fontSize = (8 + Math.random() * 12) + 'px';
            heart.style.opacity = 0.9;
            heart.innerHTML = '❤';
            document.body.appendChild(heart);
            gsap.to(heart, { y: '-=60', x: '+=' + (Math.random() * 40 - 20), opacity: 0, duration: 1 + Math.random() * 0.6, onComplete: () => heart.remove() });
        }
        return;
    }

    // Click on card header/text specifically: subtle tilt
    const cardText = target.closest('.card-text');
    if (cardText) {
        gsap.fromTo(cardText, { rotation: -2 }, { rotation: 2, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        return;
    }

    // Click on a slide (outside card): subtle bg flash
    const slide = target.closest('.slide');
    if (slide) {
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.inset = '0';
        flash.style.background = 'radial-gradient(circle at ' + (e.clientX / window.innerWidth * 100) + '% ' + (e.clientY / window.innerHeight * 100) + '%, rgba(255,31,68,0.12), transparent 40%)';
        flash.style.pointerEvents = 'none';
        slide.appendChild(flash);
        gsap.to(flash, { opacity: 0, duration: 0.8, onComplete: () => flash.remove() });
        return;
    }

    // Click on particle canvas: tiny burst particles
    const pCanvas = target.closest('#particle-canvas');
    if (pCanvas) {
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            dot.className = 'floating-heart';
            dot.style.left = (e.clientX + (Math.random() - 0.5) * 60) + 'px';
            dot.style.top = (e.clientY + (Math.random() - 0.5) * 60) + 'px';
            dot.style.fontSize = (6 + Math.random() * 8) + 'px';
            dot.style.opacity = 0.9;
            dot.innerHTML = '•';
            document.body.appendChild(dot);
            gsap.to(dot, { y: '-=80', x: '+=' + (Math.random() * 60 - 30), opacity: 0, duration: 0.9 + Math.random() * 0.5, onComplete: () => dot.remove() });
        }
        return;
    }

    // Click on 3D container: nudge camera for a brief tilt (if camera exists)
    const threeCont = target.closest('#three-canvas-container');
    if (threeCont && typeof camera !== 'undefined') {
        const origX = camera.position.x;
        const origY = camera.position.y;
        gsap.to(camera.position, { x: origX + 0.4, y: origY + 0.25, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        gsap.fromTo(threeCont, { filter: 'brightness(1)' }, { filter: 'brightness(1.08)', duration: 0.18, yoyo: true, repeat: 1 });
        return;
    }

    // Footer click: small upward pulse
    const footer = target.closest('.site-footer');
    if (footer) {
        gsap.fromTo(footer, { y: 0 }, { y: -8, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out' });
        return;
    }

    // Click on grid-item: quick pop
    const grid = target.closest('.grid-item');
    if (grid) {
        gsap.fromTo(grid, { y: 0 }, { y: -10, duration: 0.14, yoyo: true, repeat: 1, ease: 'power1.out' });
        return;
    }

    // Click on images: zoom pulse
    if (target.tagName === 'IMG') {
        gsap.fromTo(target, { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.out' });
        return;
    }

    // Default: small floating message (keeps original feeling)
    const msg = document.createElement('div');
    msg.className = 'love-message';
    msg.innerText = 'Forever ❤️';
    document.body.appendChild(msg);
    msg.style.left = e.clientX + 'px';
    msg.style.top = e.clientY + 'px';
    gsap.to(msg, { y: -100, opacity: 1, duration: 0.5 });
    gsap.to(msg, { opacity: 0, delay: 1, duration: 1, onComplete: () => msg.remove() });
});

gsap.from(".hero-content", {
    opacity: 0,
    y: 100,
    duration: 2,
    ease: "power4.out"
});

const horizontalInner = document.querySelector(".horizontal-inner");
const slides = gsap.utils.toArray(".slide");

// Run horizontal pin/scroll animation on all viewports (desktop and mobile)
gsap.to(slides, {
    xPercent: -100 * (slides.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: ".horizontal-outer",
        pin: true,
        scrub: 1,
        end: () => "+=" + horizontalInner.offsetWidth,
    }
});

/* ===============================
   THREE.JS WORLD
================================ */

const container = document.getElementById('three-canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const light = new THREE.PointLight(0xff1f44, 2, 50);
light.position.set(5,5,5);
scene.add(light);

/* --- Floating 3D Text --- */
const loader = new THREE.FontLoader();
loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", font => {
    const geo = new THREE.TextGeometry("Eli ❤️", {
        font: font,
        size: 0.5,
        height: 0.2
    });
    const mat = new THREE.MeshPhongMaterial({ color: 0xff1f44 });
    const textMesh = new THREE.Mesh(geo, mat);
    geo.center();
    textMesh.position.y = 2;
    scene.add(textMesh);

    gsap.to(textMesh.rotation, {
        y: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "none"
    });
});

/* --- Extra Floating Hearts --- */
for(let i=0;i<15;i++){
    const geo = new THREE.SphereGeometry(0.3,32,32);
    const mat = new THREE.MeshPhongMaterial({ color: 0xff1f44 });
    const mesh = new THREE.Mesh(geo,mat);
    mesh.position.set(
        (Math.random()-0.5)*10,
        (Math.random()-0.5)*10,
        (Math.random()-0.5)*5
    );
    scene.add(mesh);

    gsap.to(mesh.position,{
        y:"+=2",
        duration:3+Math.random()*3,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut"
    });
}

/* ===============================
   INTERACTIONS
================================ */

window.addEventListener("mousemove", e=>{
    const x = (e.clientX/window.innerWidth -0.5)*2;
    const y = (e.clientY/window.innerHeight -0.5)*2;
    camera.position.x = x*2;
    camera.position.y = -ScrollTrigger.getAll()[0]?.progress*2 + y;
});

/* Valentine Countdown */
const target = new Date("Feb 14, 2026 00:00:00").getTime();
setInterval(()=>{
    const now = new Date().getTime();
    const distance = target-now;
    const days = Math.floor(distance/(1000*60*60*24));
    document.title = `💘 ${days} Days Until Valentine`;
},1000);

/* ===============================
   ANIMATION LOOP
================================ */

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}
animate();

/* Resize */
window.addEventListener("resize",()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});

/* ===============================
   MOTION SENSITIVE BACKGROUND
================================ */
const motionBg = document.getElementById("motion-bg");
window.addEventListener("mousemove", e => {
    const scale = window.innerWidth < 768 ? 60 : 30;
    const x = (window.innerWidth/2 - e.clientX) / scale;
    const y = (window.innerHeight/2 - e.clientY) / scale;
    motionBg.style.transform = `translate(${x}px, ${y}px)`;
});

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", event => {
        const scale = window.innerWidth < 768 ? 12 : 8;
        const tiltX = event.gamma / scale;
        const tiltY = event.beta / scale;
        motionBg.style.transform = `translate(${tiltX}px, ${tiltY}px)`;
    });
}


/* ===============================
   CLICK TEXT EFFECT
================================ */

document.querySelectorAll(".click-animate").forEach(el => {
    el.addEventListener("click", () => {
        el.classList.remove("active");
        void el.offsetWidth;
        el.classList.add("active");
    });
});

// Add a 'mobile' class to body for CSS overrides
if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.body.classList.add("mobile");
}
