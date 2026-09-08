const screens = [...document.querySelectorAll(".screen")];
const show = id => screens.forEach(s => s.classList.toggle("active", s.id === id));

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => show(btn.dataset.next));
});

const no = document.getElementById("no");
const tease = document.getElementById("tease");
let dodges = 0;

function dodge() {
  dodges++;
  const maxX = Math.min(window.innerWidth * .28, 180);
  const maxY = 80;
  no.style.transform = `translate(${(Math.random()-.5)*2*maxX}px, ${(Math.random()-.5)*2*maxY}px)`;
  const lines = [
    "Hmm... try again 😌",
    "That button seems shy 👀",
    "Are you sure? 🥺",
    "The universe says reconsider ✨",
    "I think you meant YES 😏"
  ];
  tease.textContent = lines[Math.min(dodges-1, lines.length-1)];
}
no.addEventListener("mouseenter", dodge);
no.addEventListener("touchstart", e => { e.preventDefault(); dodge(); });

document.getElementById("yes").addEventListener("click", async () => {
  show("success");
  confetti();
  playTone();

  // Notify the proposer by email without exposing the email API key in the browser.
  try {
    await fetch("/api/yes", { method: "POST" });
  } catch (error) {
    console.error("Could not send YES notification", error);
  }
});

document.getElementById("again").addEventListener("click", () => {
  no.style.transform = "";
  dodges = 0;
  tease.textContent = "Choose carefully... 😌";
  show("intro");
});

function confetti() {
  const symbols = ["♥","✦","•","♡","🎉"];
  for (let i=0;i<90;i++) {
    const el = document.createElement("div");
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    Object.assign(el.style, {
      position:"fixed", left:(Math.random()*100)+"vw", top:"-20px",
      zIndex:20, fontSize:(12+Math.random()*20)+"px", pointerEvents:"none",
      color: Math.random() > .5 ? "#d84b70" : "#301c24",
      transition:`transform ${1.8+Math.random()*1.6}s cubic-bezier(.2,.8,.2,1), opacity 2s`
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random()-.5)*240}px, ${window.innerHeight+80}px) rotate(${Math.random()*720-360}deg)`;
      el.style.opacity = "0";
    });
    setTimeout(()=>el.remove(), 3600);
  }
}

// Lightweight Web Audio chime; no external audio file required.
let audioCtx, soundOn = false;
const soundBtn = document.getElementById("sound");
const toast = document.getElementById("toast");

function playTone() {
  if (!soundOn) return;
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  [523.25, 659.25, 783.99].forEach((freq,i)=>{
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.frequency.value=freq; osc.type="sine";
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime+i*.12);
    gain.gain.exponentialRampToValueAtTime(.08,audioCtx.currentTime+i*.12+.03);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+i*.12+.5);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(audioCtx.currentTime+i*.12); osc.stop(audioCtx.currentTime+i*.12+.55);
  });
}
soundBtn.addEventListener("click", ()=>{
  soundOn=!soundOn;
  soundBtn.textContent=soundOn?"🔊":"♫";
  toast.textContent=soundOn?"Sound is on":"Sound is off";
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1200);
  if(soundOn) playTone();
});
