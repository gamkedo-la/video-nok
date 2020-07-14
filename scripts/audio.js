let audio;

function initAudio() {
    audio = new AudioEventManager();
    audio.createEvent('railBounce', './assets/rail-bounce', 1);
	audio.createEvent('strike', './assets/strike', 1);
	audio.createEvent('goal', './assets/goal', 1);
}

class AudioEventManager {
    constructor() {
        this.buffers = {};
        this.format = this.getFormat();
    }

    createEvent(name, path, bufferSize) {
        let buffer = [];
        for(let i=0; i < bufferSize; i++) {
            buffer.push(new Audio(path + this.format));
        }
        this.buffers[name] = buffer;
    }

    playEvent(eventName) {
        let buffer = this.buffers[eventName];
        for (let audioElement of buffer) {
            if (audioElement.paused || audioElement.ended) {
                audioElement.play();
                return;
            }
        }
    }

    stopEvent(eventName) {
        let buffer = this.buffers[eventName];
        for (let audioElement of buffer) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }

    setVolume(eventName, vol) {
        let buffer = this.buffers[eventName];
        for (let audioElement of buffer) {
            audioElement.volume = clamp(vol, 0, 1);
        }
    }

    stopAll() {
        for (let event in this.buffers) {
            this.stopEvent(event);
        }
    }

    getFormat() {
        let test = new Audio();
        /*
        if (test.canPlayType("audio/ogg")) {
            return ".ogg";
        }
        */

        return ".mp3";
    }
}