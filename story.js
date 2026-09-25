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
   ASK PLAYER NAME
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


/* =========================================
   PLAYER NAME ELEMENTS
========================================= */

const namePrompt =
    document.getElementById("namePrompt");

const storyPlayerName =
    document.getElementById("storyPlayerName");

const nameContinue =
    document.getElementById("nameContinue");


/* =========================================
   PLAYER NAME
========================================= */

/*
   IMPORTANT:

   We intentionally DO NOT automatically
   use an old saved name here.

   This means every NEW GAME / story start
   can ask the player for their name.
*/

let playerName = "";


/* =========================================
   AUDIO
========================================= */

function startRoomAudio() {

    if (!roomAmbience) return;

    roomAmbience.volume = 0.42;

    roomAmbience
        .play()
        .catch(() => {
            /*
                Browser may block autoplay.
                Audio will simply remain silent.
            */
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
   OPENING SEQUENCE
========================================= */

function beginOpening() {

    /*
        Start room dark and blurred.
    */

    if (roomImage) {

        roomImage.classList.add(
            "waking"
        );
    }


    /*
        Start ambience.
    */

    startRoomAudio();


    /*
        Waking sound.
    */

    setTimeout(() => {

        playSound(
            wakeSound,
            0.45
        );

    }, 900);


    /*
        Vision begins clearing.
    */

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


    /*
        Ryan appears.
    */

    setTimeout(() => {

        showOfficer();

    }, 5600);
}


/* =========================================
   RYAN HALE APPEARS
========================================= */

function showOfficer() {

    if (!officer) return;


    /*
        Make Ryan visible.
    */

    officer.classList.remove(
        "hidden"
    );


    /*
        Start from farther away.
    */

    officer.classList.remove(
        "approach"
    );


    /*
        Ryan approaches.
    */

    setTimeout(() => {

        officer.classList.add(
            "approach"
        );

    }, 100);


    /*
        IMPORTANT:

        Do NOT start dialogue yet.

        First ask for the player's name.
    */

    setTimeout(() => {

        askPlayerName();

    }, 1800);
}


/* =========================================
   ASK PLAYER NAME
========================================= */

function askPlayerName() {

    /*
        Make absolutely sure dialogue
        cannot appear before the name.
    */

    if (dialogueBox) {

        dialogueBox.classList.add(
            "hidden"
        );
    }


    /*
        If the name prompt exists,
        show it.
    */

    if (namePrompt) {

        namePrompt.classList.remove(
            "hidden"
        );

        /*
            Clear previous input.
        */

        if (storyPlayerName) {

            storyPlayerName.value = "";

            setTimeout(() => {

                storyPlayerName.focus();

            }, 150);
        }

        return;
    }


    /*
        Fallback if HTML name prompt
        is somehow missing.

        This should NOT normally happen.
    */

    console.error(
        "namePrompt was not found in story.html"
    );

    /*
        Do not start dialogue with Y/N.
    */
}


/* =========================================
   SAVE PLAYER NAME
========================================= */

function savePlayerName() {

    if (!storyPlayerName) {

        console.error(
            "storyPlayerName input was not found."
        );

        return;
    }


    const enteredName =
        storyPlayerName.value.trim();


    /*
        Don't allow blank names.
    */

    if (enteredName === "") {

        storyPlayerName.focus();

        return;
    }


    /*
        Save name in memory.
    */

    playerName =
        enteredName;


    /*
        Save name for this game.
    */

    localStorage.setItem(
        "brokenPhonePlayerName",
        playerName
    );


    /*
        Hide name prompt.
    */

    if (namePrompt) {

        namePrompt.classList.add(
            "hidden"
        );
    }


    /*
        NOW dialogue is allowed.
    */

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
        function(event) {

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

    /* =====================================
       Y/N WAKES
    ===================================== */

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
       SMALL MYSTERY
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


let dialogueIndex = 0;


/* =========================================
   START DIALOGUE
========================================= */

function startDialogue() {

    /*
        Safety check:
        NEVER start dialogue without
        a player name.
    */

    if (!playerName ||
        playerName.trim() === "") {

        askPlayerName();

        return;
    }


    if (!dialogueBox) {

        console.error(
            "dialogueBox was not found."
        );

        return;
    }


    /*
        Make sure name prompt is hidden.
    */

    if (namePrompt) {

        namePrompt.classList.add(
            "hidden"
        );
    }


    dialogueBox.classList.remove(
        "hidden"
    );


    dialogueIndex = 0;


    displayDialogue();
}


/* =========================================
   DISPLAY DIALOGUE
========================================= */

function displayDialogue() {

    /*
        End of conversation.
    */

    if (
        dialogueIndex >=
        dialogue.length
    ) {

        finishDialogue();

        return;
    }


    const line =
        dialogue[dialogueIndex];


    /* =====================================
       SPEAKER NAME
    ===================================== */

    if (line.speaker === "Y/N") {

        speakerName.textContent =
            playerName;

    } else {

        speakerName.textContent =
            line.speaker;
    }


    /* =====================================
       DIALOGUE TEXT
    ===================================== */

    const finalText =
        line.text.replace(
            /Y\/N/g,
            playerName
        );


    dialogueText.textContent =
        finalText;


    /* =====================================
       RYAN EXPRESSION
    ===================================== */

    changeOfficerExpression(
        line.expression
    );
}


/* =========================================
   RYAN EXPRESSIONS
========================================= */

function changeOfficerExpression(
    expression
) {

    if (!officerImage) return;


    switch (expression) {

        case "serious":

            officerImage.src =
                "officer_serious.png";

            break;


        case "concerned":

            officerImage.src =
                "officer_concerned.png";

            break;


        case "surprised":

            officerImage.src =
                "officer_surprised.png";

            break;


        case "sarcastic":

            officerImage.src =
                "officer_sarcastic.png";

            break;


        case "annoyed":

            officerImage.src =
                "officer_annoyed.png";

            break;


        case "neutral":

        default:

            officerImage.src =
                "officer_neutral.png";

            break;
    }
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
   NEXT BUTTON
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
    function(event) {

        /*
            Don't advance dialogue while
            typing the player's name.
        */

        if (
            namePrompt &&
            !namePrompt.classList.contains(
                "hidden"
            )
        ) {

            return;
        }


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

                event.preventDefault();

                advanceDialogue();
            }
        }
    }
);


/* =========================================
   FINISH CONVERSATION
========================================= */

function finishDialogue() {

    if (dialogueBox) {
        dialogueBox.classList.add("hidden");
    }

    changeOfficerExpression("neutral");


    /* ================================
       RYAN LEAVES
    ================================= */

    setTimeout(() => {

        if (officer) {

            officer.classList.remove("approach");

            officer.style.transform =
                "translateX(180px) scale(0.98)";

            officer.style.opacity = "0";
        }

        playSound(
            doorOpen,
            0.55
        );

    }, 500);


    /* ================================
       SHOW OBJECTIVE
    ================================= */

    setTimeout(() => {

        showObjective();

    }, 2200);


    /* ================================
       GO TO INVESTIGATION
       AFTER OBJECTIVE
    ================================= */

    setTimeout(() => {

        window.location.href =
            "investigation.html";

    }, 5200);

}/* =========================================
   OBJECTIVE
========================================= */

function showObjective() {

    if (!objective) return;


    objective.classList.remove(
        "hidden"
    );


    const objectiveLabel =
        objective.querySelector(
            ".objective-label"
        );


    const objectiveTitle =
        objective.querySelector(
            ".objective-title"
        );


    const objectiveText =
        objective.querySelector(
            ".objective-text"
        );


    if (objectiveLabel) {

        objectiveLabel.textContent =
            "NEW OBJECTIVE";
    }


    if (objectiveTitle) {

        objectiveTitle.textContent =
            "NEW OBJECTIVE";
    }


    if (objectiveText) {

        objectiveText.textContent =
            "Repair the damaged phone.";
    }


    /*
        Hide objective and activate
        investigation mode.
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

    if (roomImage) {

        roomImage.style.cursor =
            "default";
    }


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
}


/* =========================================
   START
========================================= */

window.addEventListener(
    "load",
    function() {

        /*
            Small delay after story.html
            loads.
        */

        setTimeout(() => {

            beginOpening();

        }, 700);

    }
);
