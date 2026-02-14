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

// Ambient Layer
const ambientAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_5b3f6b5a6f.mp3?filename=romantic-ambient-112997.mp3");
ambientAudio.loop = true;
ambientAudio.volume = 0.2;
ambientAudio.play().catch(()=>{});

/* ===============================
   CURSOR GLOW
================================ */

const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

window.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

/* ===============================
   PARTICLES (Your Original Engine Improved)
================================ */

const particleCanvas = document.getElementById('particle-canvas');
const ctx = particleCanvas.getContext('2d');
let w, h, hearts = [];

function initParticles() {
    w = particleCanvas.width = window.innerWidth;
    h = particleCanvas.height = window.innerHeight;
    hearts = [];
    for(let i = 0; i < 150; i++) {
        hearts.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.6 + 0.2
        });
    }
}

function loopParticles() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ff1f44';
    hearts.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        p.x += Math.sin(p.y / 20) * 0.5;
        if(p.y < 0) p.y = h;
    });
    requestAnimationFrame(loopParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
loopParticles();

/* ===============================
   GSAP MAGIC
================================ */

gsap.from(".hero-content", {
    opacity: 0,
    y: 100,
    duration: 2,
    ease: "power4.out"
});

const horizontalInner = document.querySelector(".horizontal-inner");
const slides = gsap.utils.toArray(".slide");

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

/* Click Floating Text */
window.addEventListener("click", e=>{
    const msg = document.createElement("div");
    msg.className="love-message";
    msg.innerText="Forever ❤️";
    document.body.appendChild(msg);
    msg.style.left=e.clientX+"px";
    msg.style.top=e.clientY+"px";

    gsap.to(msg,{y:-100,opacity:1,duration:0.5});
    gsap.to(msg,{opacity:0,delay:1,duration:1,onComplete:()=>msg.remove()});
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
    const x = (window.innerWidth/2 - e.clientX) / 30;
    const y = (window.innerHeight/2 - e.clientY) / 30;
    motionBg.style.transform = `translate(${x}px, ${y}px)`;
});

/* Device Tilt Support */
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", event => {
        const tiltX = event.gamma / 8;
        const tiltY = event.beta / 8;
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
