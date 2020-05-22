class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playButton = document.querySelector(".play");
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    this.selects = document.querySelectorAll("select");
    this.muteButtons = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
    this.index = 0;
    this.bpm = 150; // bits per minute
    this.isPlaying = null;
    this.currentKick = "./sounds/kick-classic.wav";
    this.currentSnare = "./sounds/snare-808.wav";
    this.currentHihat = "./sounds/hihat-808.wav";
  }

  activePad() {
    this.classList.toggle("active");
  }

  repeat() {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`.b${step}`);

    //Loop over the pads
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;

      // play the sound when pad is active
      if (bar.classList.contains("active")) {
        if (bar.classList.contains("kick-pad")) {
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }

        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }

        if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }

  start() {
    const interval = (60 / this.bpm) * 1000;

    // Only starts a the application when it is not already playing
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
      this.index = 0;
    }
  }

  updateButton() {
    if (this.isPlaying) {
      this.playButton.innerText = "Play";
      this.playButton.classList.remove("active");
    } else {
      this.playButton.innerText = "Stop";
      this.playButton.classList.add("active");
    }
  }

  changeSound(event) {
    const selectionName = event.target.name;
    const selectionValue = event.target.value;

    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue;
        break;
    }
  }

  muteSound(event) {
    const button = event.target;
    const muteIndex = button.getAttribute("data-track");

    button.classList.toggle("active");

    if (button.classList.contains("active")) {
      // button.innerHTML = '<i class="fas fa-volume-up"></i>';
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }

  changeTempo(event) {
    const tempoText = document.querySelector(".tempo-number");
    this.bpm = event.target.value;

    tempoText.innerText = event.target.value;
  }

  updateTempo() {
    clearInterval(this.isPlaying);
    this.isPlaying = null;

    const playButton = document.querySelector(".play");

    if (playButton.classList.contains("active")) {
      this.start();
    }
  }
}

const drumKit = new DrumKit();

// Event listeners

drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playButton.addEventListener("click", () => {
  drumKit.updateButton();
  drumKit.start();
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", function (event) {
    drumKit.changeSound(event);
  });
});

drumKit.muteButtons.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    drumKit.muteSound(event);
  });
});

drumKit.tempoSlider.addEventListener("input", function (event) {
  drumKit.changeTempo(event);
});

drumKit.tempoSlider.addEventListener("change", function (event) {
  drumKit.updateTempo();
});
