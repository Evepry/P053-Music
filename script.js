const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // Puedes cambiar el tipo de onda según tus necesidades
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playSequence(sequence) {
    const commands = sequence.split(";");
    let time = audioContext.currentTime;

    commands.forEach(command => {
        const parts = command.trim().split(" ");
        if (parts.length === 2) {
            const [directive, value] = parts;
            if (directive === ":beep") {
                const [property, frequency, length] = value.split("=");

                if (property === "frequency" && frequency && length) {
                    setTimeout(() => {
                        playSound(parseInt(frequency), parseInt(length));
                    }, time * 1000);

                    time += (parseInt(length) + 300) / 1000; // Agrega un retardo entre cada sonido
                }
            } else if (directive === ":delay") {
                const [delay] = value.split("=");

                if (delay) {
                    time += parseInt(delay) / 1000;
                }
            }
        }
    });
}

const sequence = `
    :beep frequency=466 length=275;
    :delay 300;
    :beep frequency=440 length=275;
    :delay 300;
    // ... Más comandos aquí
`;

const playButton = document.getElementById("playButton");

playButton.addEventListener("click", function() {
    playSequence(sequence);
});
