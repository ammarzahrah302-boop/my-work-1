const messages = [
  "You’re not just an ordinary person to me...",
  "You make even simple days feel special.",
  "I love your energy.",
  "I’m really happy that I met you.",
  "You are the best person hoe i known 🤍"
];

const lines = [
  document.getElementById("line1"),
  document.getElementById("line2"),
  document.getElementById("line3"),
  document.getElementById("line4"),
  document.getElementById("line5")
];

const flowerButton = document.getElementById("flowerButton");
const revealButton = document.getElementById("revealButton");
let activeIndex = 0;
let isAnimating = false;

function revealNextMessage() {
  if (activeIndex >= messages.length || isAnimating) return;
  isAnimating = true;
  const line = lines[activeIndex];
  line.textContent = messages[activeIndex];
  requestAnimationFrame(() => {
    line.classList.add("visible");
    activeIndex += 1;
    setTimeout(() => {
      isAnimating = false;
    }, 850);
  });
}

flowerButton.addEventListener("click", (event) => {
  event.stopPropagation();
  revealNextMessage();
});

revealButton.addEventListener("click", (event) => {
  event.stopPropagation();
  revealNextMessage();
});

window.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary) return;
  if (event.target.closest("#flowerButton") || event.target.closest("#revealButton")) return;
  if (event.target.closest(".scene")) {
    revealNextMessage();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    revealNextMessage();
  }
});

function createPetal() {
  const petal = document.createElement("div");
  petal.className = "petal floating-petal";
  const size = Math.random() * 18 + 12;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.4}px`;
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.top = `-8%`;
  petal.style.opacity = (Math.random() * 0.3 + 0.7).toString();
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;
  petal.style.animationDuration = `${Math.random() * 10 + 10}s`;
  petal.style.animationDelay = `${Math.random() * 5}s`;
  document.querySelector(".petal-layer").appendChild(petal);
  setTimeout(() => {
    petal.remove();
  }, 22000);
}

for (let i = 0; i < 14; i += 1) {
  setTimeout(createPetal, i * 600);
}
setInterval(() => {
  createPetal();
}, 1200);

function buildMusic() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const gain = context.createGain();
  gain.gain.value = 0.13;
  gain.connect(context.destination);

  const notes = [440, 523.25, 659.25, 587.33, 698.46];
  let step = 0;

  function scheduleTone(time, freq) {
    const osc = context.createOscillator();
    const env = context.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(env);
    env.connect(gain);
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(0.11, time + 0.06);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 1.4);
    osc.start(time);
    osc.stop(time + 1.4);
  }

  function playLoop() {
    const now = context.currentTime;
    scheduleTone(now + 0.1, notes[step % notes.length]);
    step += 1;
    setTimeout(playLoop, 800);
  }

  const unlock = () => {
    if (context.state === "suspended") {
      context.resume();
    }
    document.removeEventListener("click", unlock);
    document.removeEventListener("keydown", unlock);
    playLoop();
  };

  document.addEventListener("click", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });
  document.addEventListener("touchstart", unlock, { once: true });
}

buildMusic();
