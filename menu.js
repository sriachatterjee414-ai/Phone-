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


/* =========================================
   HORROR AMBIENCE
   Browser-generated audio.

   No MP3 required.
========================================= */

let audioContext = null;

let masterGain = null;

let droneOscillator = null;

let droneGain = null;

let audioStarted = false;


/* Start the atmospheric sound */

function startHorrorAmbience() {

    if (audioStarted) {
        return;
    }

    audioStarted = true;


    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    masterGain =
        audioContext.createGain();


    masterGain.gain.value = 0.08;


    masterGain.connect(
        audioContext.destination
    );


    /*
       Very low drone.
       This is deliberately subtle.
    */

    droneOscillator =
        audioContext.createOscillator();


    droneGain =
        audioContext.createGain();


    droneOscillator.type = "sine";

    droneOscillator.frequency.value = 55;

    droneGain.gain.value = 0.18;


    droneOscillator.connect(
        droneGain
    );

    droneGain.connect(
        masterGain
    );


    droneOscillator.start();


    /*
       Second quieter tone gives the
       ambience a little movement.
    */

    const secondOscillator =
        audioContext.createOscillator();


    const secondGain =
        audioContext.createGain();


    secondOscillator.type =
        "triangle";

    secondOscillator.frequency.value =
        82.4;

    secondGain.gain.value =
        0.025;


    secondOscillator.connect(
        secondGain
    );

    secondGain.connect(
        masterGain
    );


    secondOscillator.start();


    /*
       Slow volume breathing.
    */

    setInterval(() => {

        if (!audioContext) {
            return;
        }

        const now =
            audioContext.currentTime;

        masterGain.gain.cancelScheduledValues(
            now
        );

        masterGain.gain.setValueAtTime(
            0.045,
            now
        );

        masterGain.gain.linearRampToValueAtTime(
            0.08,
            now + 3
        );

        masterGain.gain.linearRampToValueAtTime(
            0.045,
            now + 6
        );

    }, 6000);
}


/* =========================================
   PARTICLES
========================================= */

function createParticles() {

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("span");


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
   NEW GAME
========================================= */

newGameBtn.addEventListener(
    "click",
    () => {

        startHorrorAmbience();

        window.location.href =
            "signin.html";

    }
);


/* =========================================
   CONTINUE
========================================= */

continueBtn.addEventListener(
    "click",
    () => {

        startHorrorAmbience();


        const savedName =
            localStorage.getItem(
                "brokenPhonePlayerName"
            );


        if (savedName) {

            window.location.href =
                "signin.html";

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

        startHorrorAmbience();

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
   VOLUME
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


        if (masterGain) {

            masterGain.gain.value =
                Number(value) / 100 * 0.12;
        }

    }
);


/* Load saved volume */

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


/* =========================================
   QUIT
========================================= */

quitBtn.addEventListener(
    "click",
    () => {

        startHorrorAmbience();

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

        /*
           Browsers normally prevent a webpage
           from closing itself.

           So for the prototype, we show a
           simple exit state.
        */

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
