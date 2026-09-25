/* =========================================
   BROKEN PHONE
   PART 1 — OPENING SEQUENCE

   FLOW:

   MENU
      ↓
   SIGN IN
      ↓
   WAKE UP
      ↓
   RYAN HALE
      ↓
   PLAYER NAME
      ↓
   NORMAL PHONE ASSIGNMENT
      ↓
   SMALL MYSTERY
      ↓
   RYAN LEAVES
      ↓
   REPAIR THE DAMAGED PHONE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const roomImage =
    document.getElementById("roomImage");

const wakeOverlay =
    document.getElementById("wakeOverlay");

const blurLayer =
    document.getElementById("blurLayer");

const officer =
    document.getElementById("officer");

const officerImage =
    document.getElementById("officerImage");

const dialogueBox =
    document.getElementById("dialogueBox");

const speakerName =
    document.getElementById("speakerName");

const dialogueText =
    document.getElementById("dialogueText");

const nextDialogue =
    document.getElementById("nextDialogue");

const objective =
    document.getElementById("objective");

const investigationHUD =
    document.getElementById("investigationHUD");

const roomAmbience =
    document.getElementById("roomAmbience");

const wakeSound =
    document.getElementById("wakeSound");

const radioStatic =
    document.getElementById("radioStatic");

const doorOpen =
    document.getElementById("doorOpen");

const namePrompt =
    document.getElementById("namePrompt");

const storyPlayerName =
    document.getElementById("storyPlayerName");

const nameContinue =
    document.getElementById("nameContinue");


/* =========================================
   PLAYER NAME
========================================= */

let playerName =
    localStorage.getItem(
        "brokenPhonePlayerName"
    ) || "";


/* =========================================
   AUDIO
========================================= */

function startRoomAudio() {

    if (!roomAmbience) return;

    roomAmbience.volume = 0.42;

    roomAmbience
        .play()
        .catch(() => {
            console.log(
                "Room ambience waiting for user interaction."
            );
        });
}


function playSound(
    sound,
    volume = 0.7
) {

    if (!sound) return;

    sound.volume = volume;

    sound.currentTime = 0;

    sound
        .play()
        .catch(() => {});
}


/* =========================================
   OPENING
========================================= */

function beginOpening() {

    console.log(
        "BROKEN PHONE — OPENING STARTED"
    );


    /* Start room in waking state */

    if (roomImage) {

        roomImage.classList.add(
            "waking"
        );
    }


    /* Start ambience */

    startRoomAudio();


    /* Wake sound */

    setTimeout(() => {

        playSound(
            wakeSound,
            0.45
        );

    }, 900);


    /* Clear vision */

    setTimeout(() => {

        if (wakeOverlay) {

            wakeOverlay.classList.add(
                "opening"
            );
        }


        if (blurLayer) {

            blurLayer.classList.add(
                "clear"
            );
        }


        if (roomImage) {

            roomImage.classList.remove(
                "waking"
            );

            roomImage.classList.add(
                "awake"
            );
        }

    }, 1800);


    /* Ryan appears */

    setTimeout(() => {

        showOfficer();

    }, 5600);
}


/* =========================================
   RYAN
========================================= */

function showOfficer() {

    if (!officer) {

        console.error(
            "ERROR: #officer was not found."
        );

        return;
    }


    console.log(
        "Ryan Hale entering."
    );


    officer.classList.remove(
        "hidden"
    );


    officer.classList.remove(
        "approach"
    );


    /* Trigger CSS transition */

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            officer.classList.add(
                "approach"
            );

        });

    });


    /*
       IMPORTANT:
       Ask for the player's name only
       after Ryan has appeared.
    */

    setTimeout(() => {

        askPlayerName();

    }, 1800);
}


/* =========================================
   PLAYER NAME
========================================= */

function askPlayerName() {

    /*
       If the player already entered
       a name previously, don't ask
       them again.
    */

    if (playerName !== "") {

        console.log(
            "Saved player name:",
            playerName
        );

        startDialogue();

        return;
    }


    if (!namePrompt) {

        console.warn(
            "Name prompt not found. Starting dialogue."
        );

        startDialogue();

        return;
    }


    namePrompt.classList.remove(
        "hidden"
    );


    if (storyPlayerName) {

        storyPlayerName.value = "";

        setTimeout(() => {

            storyPlayerName.focus();

        }, 100);
    }
}


/* =========================================
   SAVE PLAYER NAME
========================================= */

function savePlayerName() {

    if (!storyPlayerName) return;


    const enteredName =
        storyPlayerName.value.trim();


    if (enteredName === "") {

        storyPlayerName.focus();

        return;
    }


    playerName =
        enteredName;


    localStorage.setItem(
        "brokenPhonePlayerName",
        playerName
    );


    console.log(
        "Player name saved:",
        playerName
    );


    if (namePrompt) {

        namePrompt.classList.add(
            "hidden"
        );
    }


    startDialogue();
}


/* =========================================
   NAME BUTTON
========================================= */

if (nameContinue) {

    nameContinue.addEventListener(
        "click",
        savePlayerName
    );
}


/* =========================================
   NAME ENTER KEY
========================================= */

if (storyPlayerName) {

    storyPlayerName.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                savePlayerName();
            }
        }
    );
}


/* =========================================
   COMPLETE STORY DIALOGUE
========================================= */

const dialogue = [

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Finally. You're awake."
    },

    {
        speaker: "Y/N",
        expression: "concerned",
        text:
            "Ryan?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Good. At least you remember my face."
    },

    {
        speaker: "Y/N",
        expression: "concerned",
        text:
            "Why wouldn't I?"
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "I don't know. You were sleeping like the dead."
    },

    {
        speaker: "Y/N",
        expression: "annoyed",
        text:
            "Very funny."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Thank you. I practice."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "How long was I out?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Long enough for me to finish two coffees."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "So, about ten minutes?"
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Three hours."
    },

    {
        speaker: "Y/N",
        expression: "surprised",
        text:
            "...Oh."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "You needed the rest."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "So why am I here?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Work."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "Of course it is."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Got something for you."
    },


    /* =====================================
       PHONE
    ===================================== */

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Another phone?"
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Congratulations. You've solved the mystery."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "I'm clearly ready for a promotion."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Don't get excited."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "It was recovered during an investigation. It's pretty badly damaged."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "How badly?"
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Bad enough that I didn't touch it after finding it."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "That's probably for the best."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Your usual job. Get it working, extract whatever data you can, and send it back to us."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Any special instructions?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Nope. Same procedure as always."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "So you woke me up for a broken phone."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Technically, I didn't wake you up."
    },

    {
        speaker: "Y/N",
        expression: "annoyed",
        text:
            "Ryan."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Fine. Yes. I woke you up for a broken phone."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Give it here."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "That's the spirit."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Try not to destroy it more than it already is."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "No promises."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "I'll leave you to it."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Ryan."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Yeah?"
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Coffee."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "You want coffee after sleeping for three hours?"
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "Yes."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "Unbelievable."
    },


    /* =====================================
       MYSTERY
    ===================================== */

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Actually..."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "What?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "There is one thing."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "I knew there was a catch."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "There's always a catch with you."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Ryan."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "The phone was found yesterday."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Okay."
    },

    {
        speaker: "RYAN",
        expression: "serious",
        text:
            "But the last activity recorded on it was this morning."
    },

    {
        speaker: "Y/N",
        expression: "surprised",
        text:
            "...This morning?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Yeah."
    },

    {
        speaker: "Y/N",
        expression: "serious",
        text:
            "That's not possible if it was already evidence."
    },

    {
        speaker: "RYAN",
        expression: "serious",
        text:
            "Exactly."
    },

    {
        speaker: "Y/N",
        expression: "concerned",
        text:
            "What kind of activity?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "We couldn't tell."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "And you didn't try to turn it on?"
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "You know me better than that."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "Unfortunately, I do."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "That's why it's yours."
    },

    {
        speaker: "Y/N",
        expression: "serious",
        text:
            "Anything else?"
    },

    {
        speaker: "RYAN",
        expression: "concerned",
        text:
            "There was one file name."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "What file?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "We couldn't open it."
    },

    {
        speaker: "Y/N",
        expression: "serious",
        text:
            "What's it called?"
    },

    {
        speaker: "RYAN",
        expression: "serious",
        text:
            "I don't remember the whole thing."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "Convenient."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "I was busy doing actual police work."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "And I'm apparently not."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Your words, not mine."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "What did you remember?"
    },

    {
        speaker: "RYAN",
        expression: "concerned",
        text:
            "Something about a date."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "A date?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Yeah."
    },

    {
        speaker: "RYAN",
        expression: "serious",
        text:
            "Tomorrow's date."
    },

    {
        speaker: "Y/N",
        expression: "surprised",
        text:
            "Tomorrow?"
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Probably nothing."
    },

    {
        speaker: "Y/N",
        expression: "serious",
        text:
            "You don't usually say 'probably nothing.'"
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "And you don't usually interrogate your coworkers before coffee."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "You brought me the suspicious phone."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Fair."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Just repair it."
    },

    {
        speaker: "RYAN",
        expression: "serious",
        text:
            "If there's anything important on there, we'll deal with it."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "You mean we'll deal with it."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "Exactly."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "Now go get my coffee."
    },

    {
        speaker: "RYAN",
        expression: "surprised",
        text:
            "Excuse me?"
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "You woke me up."
    },

    {
        speaker: "RYAN",
        expression: "sarcastic",
        text:
            "You're impossible."
    },

    {
        speaker: "Y/N",
        expression: "sarcastic",
        text:
            "And yet you keep coming back."
    },

    {
        speaker: "RYAN",
        expression: "neutral",
        text:
            "I'll see you later."
    },

    {
        speaker: "Y/N",
        expression: "neutral",
        text:
            "Yeah. Later."
    }

];


/* =========================================
   DIALOGUE STATE
========================================= */

let dialogueIndex = 0;


/* =========================================
   START DIALOGUE
========================================= */

function startDialogue() {

    if (!dialogueBox) {

        console.error(
            "ERROR: #dialogueBox not found."
        );

        return;
    }


    dialogueIndex = 0;

    dialogueBox.classList.remove(
        "hidden"
    );


    displayDialogue();
}


/* =========================================
   DISPLAY DIALOGUE
========================================= */

function displayDialogue() {

    if (
        dialogueIndex >=
        dialogue.length
    ) {

        finishDialogue();

        return;
    }


    const line =
        dialogue[dialogueIndex];


    if (speakerName) {

        speakerName.textContent =
            line.speaker;
    }


    /*
       Replace Y/N with the username.
    */

    let finalText =
        line.text;


    if (playerName !== "") {

        finalText =
            finalText.replace(
                /Y\/N/g,
                playerName
            );
    }


    if (dialogueText) {

        dialogueText.textContent =
            finalText;
    }


    changeOfficerExpression(
        line.expression
    );


    console.log(
        `${line.speaker}: ${finalText}`
    );
}


/* =========================================
   RYAN EXPRESSIONS
========================================= */

function changeOfficerExpression(
    expression
) {

    if (!officerImage) return;


    const expressionImages = {

        neutral:
            "officer_neutral.png",

        serious:
            "officer_serious.png",

        concerned:
            "officer_concerned.png",

        surprised:
            "officer_surprised.png",

        sarcastic:
            "officer_sarcastic.png",

        annoyed:
            "officer_annoyed.png"
    };


    const image =
        expressionImages[expression]
        ||
        expressionImages.neutral;


    officerImage.src =
        image;
}


/* =========================================
   ADVANCE DIALOGUE
========================================= */

function advanceDialogue() {

    if (!dialogueBox) return;


    if (
        dialogueBox.classList.contains(
            "hidden"
        )
    ) {

        return;
    }


    dialogueIndex++;

    displayDialogue();
}


/* =========================================
   BUTTON
========================================= */

if (nextDialogue) {

    nextDialogue.addEventListener(
        "click",
        advanceDialogue
    );
}


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code === "Space" ||
            event.code === "Enter"
        ) {

            if (
                dialogueBox &&
                !dialogueBox.classList.contains(
                    "hidden"
                )
            ) {

                /*
                   Don't advance dialogue
                   when typing the username.
                */

                if (
                    document.activeElement ===
                    storyPlayerName
                ) {

                    return;
                }


                event.preventDefault();

                advanceDialogue();
            }
        }
    }
);


/* =========================================
   FINISH DIALOGUE
========================================= */

function finishDialogue() {

    console.log(
        "Ryan's conversation finished."
    );


    if (dialogueBox) {

        dialogueBox.classList.add(
            "hidden"
        );
    }


    changeOfficerExpression(
        "neutral"
    );


    /*
       Ryan leaves.
    */

    setTimeout(() => {

        if (officer) {

            officer.classList.remove(
                "approach"
            );

            officer.style.transform =
                "translateX(calc(-50% + 180px)) scale(0.98)";

            officer.style.opacity =
                "0";
        }


        playSound(
            doorOpen,
            0.55
        );

    }, 500);


    /*
       Show objective after Ryan leaves.
    */

    setTimeout(() => {

        showObjective();

    }, 2200);
}


/* =========================================
   OBJECTIVE
========================================= */

function showObjective() {

    if (!objective) {

        console.error(
            "ERROR: #objective not found."
        );

        enableInvestigation();

        return;
    }


    objective.classList.remove(
        "hidden"
    );


    const objectiveLabel =
        objective.querySelector(
            ".objective-label"
        );


    const objectiveText =
        objective.querySelector(
            ".objective-text"
        );


    if (objectiveLabel) {

        objectiveLabel.textContent =
            "NEW OBJECTIVE";
    }


    if (objectiveText) {

        objectiveText.textContent =
            "Repair the damaged phone.";
    }


    /*
       Keep objective visible
       for a few seconds.
    */

    setTimeout(() => {

        objective.classList.add(
            "hidden"
        );


        if (investigationHUD) {

            investigationHUD.classList.remove(
                "hidden"
            );
        }


        enableInvestigation();

    }, 3500);
}


/* =========================================
   INVESTIGATION MODE
========================================= */

function enableInvestigation() {

    console.log(
        "================================="
    );

    console.log(
        "INVESTIGATION MODE ACTIVE"
    );

    console.log(
        "PLAYER:",
        playerName
    );

    console.log(
        "OBJECTIVE: Repair the damaged phone."
    );

    console.log(
        "================================="
    );


    if (roomImage) {

        roomImage.style.cursor =
            "default";
    }


    /*
       This is where the next stage
       of the game can be connected:

       - Desk
       - Damaged phone
       - Computer
       - Evidence board
       - Drawers
       - Papers
       - Search system
       - Repair mini-game
    */

    document.dispatchEvent(
        new CustomEvent(
            "investigationStarted",
            {
                detail: {
                    playerName:
                        playerName
                }
            }
        )
    );
}


/* =========================================
   START GAME
========================================= */

window.addEventListener(
    "load",
    () => {

        console.log(
            "Broken Phone story.html loaded."
        );


        /*
           Small delay so the transition
           from the previous screen feels
           intentional.
        */

        setTimeout(() => {

            beginOpening();

        }, 700);
    }
);
