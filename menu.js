/* =========================================
   BROKEN PHONE — MAIN MENU
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const newGameBtn =
    document.getElementById("newGameBtn");

const continueBtn =
    document.getElementById("continueBtn");

const settingsBtn =
    document.getElementById("settingsBtn");

const settingsPanel =
    document.getElementById("settingsPanel");

const closeSettings =
    document.getElementById("closeSettings");

const volume =
    document.getElementById("volume");

const volumeValue =
    document.getElementById("volumeValue");

const muteButton =
    document.getElementById("muteButton");

const quitBtn =
    document.getElementById("quitBtn");

const quitMessage =
    document.getElementById("quitMessage");

const stayBtn =
    document.getElementById("stayBtn");

const leaveBtn =
    document.getElementById("leaveBtn");

const particleContainer =
    document.getElementById("particles");

const audioIndicator =
    document.getElementById("audioIndicator");

const hallAmbience =
    document.getElementById("hallAmbience");

const radioStatic =
    document.getElementById("radioStatic");


/* =========================================
   AUDIO SETTINGS
========================================= */

let soundEnabled = true;

let audioStarted = false;

let radioTimer = null;


/* =========================================
   LOAD SAVED SETTINGS
========================================= */

const savedVolume =
    localStorage.getItem(
        "brokenPhoneVolume"
    );


if (savedVolume !== null) {

    volume.value =
        savedVolume;

    volumeValue.textContent =
        savedVolume + "%";
}


const savedSound =
    localStorage.getItem(
        "brokenPhoneSound"
    );


if (savedSound === "off") {

    soundEnabled = false;

    updateSoundButton();
}


/* =========================================
   APPLY VOLUME
========================================= */

function applyVolume() {

    const volumeLevel =
        Number(volume.value) / 100;


    /*
       Hall ambience is deliberately
       quieter than the master volume.
    */

    hallAmbience.volume =
        volumeLevel * 0.45;


    /*
       Radio static is louder so it can
       actually be heard when it happens.
    */

    radioStatic.volume =
        volumeLevel * 0.75;
}


/* =========================================
   START MENU AUDIO
========================================= */

function startMenuAudio() {

    if (!soundEnabled) {
        return;
    }


    applyVolume();


    /*
       The browser allows audio after
       the user has interacted with
       the page.
    */

    if (!audioStarted) {

        hallAmbience.currentTime = 0;

        hallAmbience
            .play()
            .then(() => {

                audioStarted = true;

                startRadioStatic();

            })
            .catch(() => {

                /*
                   If the browser blocks it,
                   the next click will try again.
                */

                audioStarted = false;
            });

    }
}


/* =========================================
   RANDOM RADIO STATIC
========================================= */

function startRadioStatic() {

    if (radioTimer !== null) {
        clearTimeout(radioTimer);
    }


    const delay =
        12000 +
        Math.random() * 22000;


    radioTimer =
        setTimeout(() => {

            playRadioStatic();

            startRadioStatic();

        }, delay);
}


/* =========================================
   PLAY RADIO STATIC
========================================= */

function playRadioStatic() {

    if (!soundEnabled) {
        return;
    }


    radioStatic.currentTime = 0;


    radioStatic
        .play()
        .catch(() => {
            // Browser may block it until interaction.
        });
}


/* =========================================
   STOP AUDIO
========================================= */

function stopMenuAudio() {

    hallAmbience.pause();

    radioStatic.pause();

    radioStatic.currentTime = 0;


    if (radioTimer !== null) {

        clearTimeout(
            radioTimer
        );

        radioTimer = null;
    }
}


/* =========================================
   MUTE / UNMUTE
========================================= */

function updateSoundButton() {

    if (soundEnabled) {

        muteButton.textContent =
            "SOUND: ON";

        audioIndicator.textContent =
            "♪";

        audioIndicator.classList.remove(
            "muted"
        );

    } else {

        muteButton.textContent =
            "SOUND: OFF";

        audioIndicator.textContent =
            "×";

        audioIndicator.classList.add(
            "muted"
        );
    }
}


function toggleSound() {

    soundEnabled =
        !soundEnabled;


    localStorage.setItem(
        "brokenPhoneSound",
        soundEnabled
            ? "on"
            : "off"
    );


    updateSoundButton();


    if (soundEnabled) {

        startMenuAudio();

    } else {

        stopMenuAudio();
    }
}


muteButton.addEventListener(
    "click",
    toggleSound
);


audioIndicator.addEventListener(
    "click",
    toggleSound
);


/* =========================================
   VOLUME SLIDER
========================================= */

volume.addEventListener(
    "input",
    () => {

        const value =
            volume.value;


        volumeValue.textContent =
            value + "%";


        localStorage.setItem(
            "brokenPhoneVolume",
            value
        );


        applyVolume();


        /*
           A volume change is also
           user interaction, so try
           starting the ambience.
        */

        startMenuAudio();
    }
);


/* =========================================
   PARTICLES
========================================= */

function createParticles() {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.classList.add(
            "particle"
        );


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.top =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            (5 + Math.random() * 8) + "s";


        particle.style.animationDelay =
            (Math.random() * 8) + "s";


        const size =
            1 + Math.random() * 3;


        particle.style.width =
            size + "px";


        particle.style.height =
            size + "px";


        particleContainer.appendChild(
            particle
        );
    }
}


createParticles();


/* =========================================
   START AUDIO ON FIRST MENU INTERACTION
========================================= */

document.addEventListener(
    "click",
    () => {

        startMenuAudio();

    },
    {
        once: true
    }
);


/* =========================================
   NEW GAME
========================================= */

newGameBtn.addEventListener(
    "click",
    () => {

        startMenuAudio();


        /*
           Give the audio a moment to start
           before changing pages.
        */

        setTimeout(() => {

            window.location.href =
                "signin.html";

        }, 150);

    }
);


/* =========================================
   CONTINUE
========================================= */

continueBtn.addEventListener(
    "click",
    () => {

        startMenuAudio();


        const savedName =
            localStorage.getItem(
                "brokenPhonePlayerName"
            );


        if (savedName) {

            setTimeout(() => {

                window.location.href =
                    "signin.html";

            }, 150);

        } else {

            alert(
                "No saved game found."
            );
        }
    }
);


/* =========================================
   SETTINGS
========================================= */

settingsBtn.addEventListener(
    "click",
    () => {

        startMenuAudio();


        settingsPanel.classList.add(
            "active"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsPanel.classList.remove(
            "active"
        );

    }
);


/* =========================================
   QUIT
========================================= */

quitBtn.addEventListener(
    "click",
    () => {

        startMenuAudio();


        quitMessage.classList.add(
            "active"
        );

    }
);


/* =========================================
   STAY
========================================= */

stayBtn.addEventListener(
    "click",
    () => {

        quitMessage.classList.remove(
            "active"
        );

    }
);


/* =========================================
   LEAVE
========================================= */

leaveBtn.addEventListener(
    "click",
    () => {

        stopMenuAudio();


        document.body.innerHTML = `

            <div style="
                width:100vw;
                height:100vh;
                background:#080504;
                color:#eee2d2;
                display:flex;
                align-items:center;
                justify-content:center;
                font-family:'Courier New',monospace;
                letter-spacing:4px;
            ">

                GAME CLOSED

            </div>

        `;
    }
);


/* =========================================
   INITIALIZE
========================================= */

updateSoundButton();

applyVolume();
