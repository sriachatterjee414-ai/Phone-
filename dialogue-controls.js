/* =========================================
   BROKEN PHONE
   DIALOGUE CONTROLS

   PREVIOUS
   SKIP
   ALL DIALOGUE
========================================= */

let dialogueHistory = [];
let controlsCreated = false;


/* =========================================
   CREATE BUTTONS
========================================= */

function createDialogueControls() {

    if (controlsCreated) return;

    if (typeof dialogueBox === "undefined" || !dialogueBox) {
        console.error("Dialogue box not found.");
        return;
    }

    controlsCreated = true;

    const controls = document.createElement("div");

    controls.id = "dialogueControls";

    controls.innerHTML = `
        <button id="previousDialogue" type="button">
            PREVIOUS
        </button>

        <button id="skipDialogue" type="button">
            SKIP
        </button>

        <button id="allDialogue" type="button">
            ALL DIALOGUE
        </button>
    `;

    document.body.appendChild(controls);

    createHistoryPanel();

    document
        .getElementById("previousDialogue")
        .addEventListener("click", previousDialogueLine);

    document
        .getElementById("skipDialogue")
        .addEventListener("click", skipDialogue);

    document
        .getElementById("allDialogue")
        .addEventListener("click", openDialogueHistory);

    updatePreviousButton();
    updateControlsVisibility();
}


/* =========================================
   DIALOGUE HISTORY WINDOW
========================================= */

function createHistoryPanel() {

    const panel = document.createElement("div");

    panel.id = "dialogueHistoryPanel";

    panel.innerHTML = `
        <div id="dialogueHistoryBox">

            <div id="dialogueHistoryHeader">

                <span>DIALOGUE HISTORY</span>

                <button
                    id="closeDialogueHistory"
                    type="button">
                    ×
                </button>

            </div>

            <div id="dialogueHistoryContent"></div>

        </div>
    `;

    document.body.appendChild(panel);

    document
        .getElementById("closeDialogueHistory")
        .addEventListener("click", closeDialogueHistory);

    panel.addEventListener("click", function(event) {

        if (event.target === panel) {
            closeDialogueHistory();
        }

    });
}


/* =========================================
   SAVE CURRENT DIALOGUE
========================================= */

function recordCurrentDialogue() {

    if (typeof dialogueIndex === "undefined") return;

    if (typeof dialogue === "undefined") return;

    const line = dialogue[dialogueIndex];

    if (!line) return;

    const alreadySaved = dialogueHistory.some(
        entry => entry.index === dialogueIndex
    );

    if (!alreadySaved) {

        dialogueHistory.push({
            index: dialogueIndex,
            speaker: line.speaker,
            text: line.text
        });

    }
}


/* =========================================
   SHOW ALL DIALOGUE
========================================= */

function refreshDialogueHistory() {

    const content =
        document.getElementById("dialogueHistoryContent");

    if (!content) return;

    content.innerHTML = "";

    if (dialogueHistory.length === 0) {

        content.innerHTML = `
            <div class="historyEmpty">
                No dialogue yet.
            </div>
        `;

        return;
    }


    dialogueHistory.forEach(function(entry) {

        const item = document.createElement("div");

        item.className = "dialogueHistoryEntry";


        const speaker =
            entry.speaker === "Y/N"
                ? (
                    typeof playerName !== "undefined"
                        ? playerName
                        : "Y/N"
                )
                : entry.speaker;


        const text =
            entry.text.replace(
                /Y\/N/g,
                typeof playerName !== "undefined"
                    ? playerName
                    : "Y/N"
            );


        const speakerElement =
            document.createElement("div");

        speakerElement.className = "historySpeaker";

        speakerElement.textContent = speaker;


        const textElement =
            document.createElement("div");

        textElement.className = "historyText";

        textElement.textContent = text;


        item.appendChild(speakerElement);
        item.appendChild(textElement);

        content.appendChild(item);

    });


    content.scrollTop = content.scrollHeight;
}


/* =========================================
   OPEN HISTORY
========================================= */

function openDialogueHistory() {

    recordCurrentDialogue();

    refreshDialogueHistory();

    const panel =
        document.getElementById("dialogueHistoryPanel");

    if (panel) {
        panel.classList.add("active");
    }
}


/* =========================================
   CLOSE HISTORY
========================================= */

function closeDialogueHistory() {

    const panel =
        document.getElementById("dialogueHistoryPanel");

    if (panel) {
        panel.classList.remove("active");
    }
}


/* =========================================
   PREVIOUS DIALOGUE
========================================= */

function previousDialogueLine() {

    if (typeof dialogueIndex === "undefined") {
        return;
    }

    if (dialogueIndex <= 0) {
        return;
    }

    dialogueIndex--;

    if (typeof displayDialogue === "function") {
        displayDialogue();
    }

    updatePreviousButton();
}


/* =========================================
   UPDATE PREVIOUS BUTTON
========================================= */

function updatePreviousButton() {

    const button =
        document.getElementById("previousDialogue");

    if (!button) return;

    if (
        typeof dialogueIndex === "undefined" ||
        dialogueIndex <= 0
    ) {

        button.disabled = true;

    } else {

        button.disabled = false;

    }
}


/* =========================================
   SKIP WHOLE CURRENT DIALOGUE
========================================= */

function skipDialogue() {

    closeDialogueHistory();

    /*
       The current scene decides what happens
       after the dialogue.

       For the current story:
       finishDialogue()
       → Ryan leaves
       → Objective
       → Investigation
    */

    if (typeof finishDialogue === "function") {

        finishDialogue();

    } else {

        console.error(
            "finishDialogue() was not found."
        );

    }
}


/* =========================================
   SHOW / HIDE BUTTONS
========================================= */

function updateControlsVisibility() {

    const controls =
        document.getElementById("dialogueControls");

    if (!controls) return;

    if (
        typeof dialogueBox === "undefined" ||
        !dialogueBox
    ) {

        controls.style.display = "none";

        return;
    }


    const isHidden =
        dialogueBox.style.display === "none";


    controls.style.display =
        isHidden ? "none" : "flex";
}


/* =========================================
   WATCH DIALOGUE
========================================= */

let lastDialogueIndex = -1;

setInterval(function() {

    if (typeof dialogueIndex === "undefined") {
        return;
    }


    if (dialogueIndex !== lastDialogueIndex) {

        lastDialogueIndex = dialogueIndex;

        recordCurrentDialogue();

        updatePreviousButton();

    }


    updateControlsVisibility();

}, 100);


/* =========================================
   START
========================================= */

window.addEventListener("load", function() {

    setTimeout(function() {

        createDialogueControls();

    }, 100);

});
