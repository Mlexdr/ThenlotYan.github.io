let sound, fft;
let currentMusic = null;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight * 0.75);
    canvas.parent("visualizer2D");

    fft = new p5.FFT();
    noLoop();
}

function draw() {
    background(10);
    if (!sound || !sound.isPlaying()) return;

    let spectrum = fft.analyze();

    noStroke();
    fill(0, 200, 255);

    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = map(spectrum[i], 0, 255, 0, height);

        rect(x, height - h, width / spectrum.length, h);
    }
}

function loadMusic(file){
    if (sound) sound.stop();
    sound = loadSound("music/" + file, () => {
        sound.play();
        loop(); // relance draw
    });
}

// 🎧 Radio bouton
document.querySelectorAll('input[name="music"]').forEach(radio => {
    radio.addEventListener("change", (e)=>{
        loadMusic(e.target.value);
    });
});
