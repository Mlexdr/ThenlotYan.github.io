// app.js

// ==== Split.js ====
Split(['#left', '#right'], { sizes: [50, 50], minSize: 150, gutterSize: 5 });
Split(['#top', '#bottom'], { direction: 'vertical', sizes: [75, 25], minSize: 150, gutterSize: 5 });

console.log("📌 Layout Ready.");
const terminal = document.getElementById("terminal");
terminal.innerHTML += "<br>> UI loaded";

// ==== AUDIO ====

let audio = new Audio();
audio.volume = 0.8;
window.audio = audio; // expose global pour vi·si·cal·i·ty

const radios = document.querySelectorAll('input[name="music"]');

radios.forEach(radio => {
  radio.addEventListener("change", () => {
    const choice = radio.value;
    audio.src = `musics/${choice}.mp3`;
    audio.play();

    terminal.innerHTML += `<br>> Playing: ${choice}`;
    terminal.scrollTop = terminal.scrollHeight;

    if (audioContext.state !== 'running') {
      audioContext.resume();
    }
  });
});

// ==== VISUALIZER VISI·CAL·I·TY ====

// Récupère le container canvas dans #left
const visualityContainer = document.getElementById('visuality-container');

// Crée le canvas et l'ajoute au container
const canvas = document.createElement('canvas');
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.display = "block"; // évite espace blanc inline
visualityContainer.appendChild(canvas);

// Setup AudioContext & Analyser
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Création source et analyser
const sourceNode = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

// Connection audio nodes
sourceNode.connect(analyser);
analyser.connect(audioContext.destination);

// Instance Visuality
let visualizer = new Visuality(canvas, {
  analyser: analyser,
  type: 'bars',
  barsCount: 32,
  barWidth: 10,
  barSpacing: 5,
  color: '#00ffff'
});

// Fonction pour gérer la taille du canvas et visualizer
function resizeCanvas() {
  const w = visualityContainer.clientWidth;
  const h = visualityContainer.clientHeight;

  // Attention, pour éviter flou, canvas.width et canvas.height en pixels physiques
  canvas.width = w * devicePixelRatio;
  canvas.height = h * devicePixelRatio;

  // style css
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  visualizer.resize(w, h);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Boucle d'animation
function animate() {
  visualizer.update();
  requestAnimationFrame(animate);
}
animate();
