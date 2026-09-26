/* =========================================
BROKEN PHONE
FILE CABINET — WORDLE

LOCKED
↓
WORDLE
↓
SOLVE / HINT
↓
UNLOCKED
↓
COLLECT ITEMS
↓
INVENTORY
========================================= */

/* =========================================
CABINET IMAGES
========================================= */

const CABINET_LOCKED_IMAGE =
"cabinet_locked.png";

const CABINET_UNLOCKED_IMAGE =
"cabinet_unlocked.png";

const CABINET_PUZZLE_KEY =
"brokenPhone_cabinetPuzzleSolved";

const cabinetScene =
document.getElementById(
"cabinetScene"
);

const unlockButton =
document.getElementById(
"unlockButton"
);

const itemsLayer =
document.getElementById(
"itemsLayer"
);

/* =========================================
CABINET STATE
========================================= */

function isCabinetUnlocked() {

return localStorage.getItem(
    CABINET_PUZZLE_KEY
) === "true";

}

/* =========================================
UPDATE CABINET
========================================= */

function updateCabinet() {

if (isCabinetUnlocked()) {

    cabinetScene.style.backgroundImage =
        `url("${CABINET_UNLOCKED_IMAGE}")`;

    unlockButton.classList.add(
        "hidden"
    );

    itemsLayer.classList.remove(
        "hidden"
    );

}

else {

    cabinetScene.style.backgroundImage =
        `url("${CABINET_LOCKED_IMAGE}")`;

    unlockButton.classList.remove(
        "hidden"
    );

    itemsLayer.classList.add(
        "hidden"
    );

}

}

/* =========================================
INVENTORY
========================================= */

const INVENTORY_KEY =
"brokenPhoneInventory";

const ITEM_DATA = {

replacement_battery: {

    name:
        "Replacement Battery",

    img:
        "replacement_battery.png"

},


paper_clip: {

    name:
        "Paper Clip",

    img:
        "paper_clip.png"

}

};

const inventorySlots =
document.getElementById(
"inventorySlots"
);

const toast =
document.getElementById(
"toast"
);

function getInventory() {

try {

    return JSON.parse(
        localStorage.getItem(
            INVENTORY_KEY
        )
    ) || [];

}

catch (error) {

    return [];

}

}

function saveInventory(items) {

localStorage.setItem(
    INVENTORY_KEY,
    JSON.stringify(items)
);

}

/* =========================================
INVENTORY DISPLAY
========================================= */

function renderInventory() {

inventorySlots.innerHTML = "";

const inventory =
    getInventory();


for (
    let i = 0;
    i < 8;
    i++
) {

    const slot =
        document.createElement(
            "div"
        );


    slot.className =
        "inventory-slot";


    if (
        inventory[i] &&
        ITEM_DATA[inventory[i]]
    ) {

        slot.innerHTML = `

            <img
                src="${ITEM_DATA[inventory[i]].img}"
                alt=""
            >

            <span>
                ${ITEM_DATA[inventory[i]].name}
            </span>

        `;

    }


    inventorySlots.appendChild(
        slot
    );

}

}

/* =========================================
COLLECT ITEM
========================================= */

function collectItem(
id,
element
) {

let inventory =
    getInventory();


if (
    inventory.includes(id)
) {

    showToast(
        "Already collected."
    );

    return;

}


if (
    inventory.length >= 8
) {

    showToast(
        "Inventory full."
    );

    return;

}


inventory.push(id);

saveInventory(
    inventory
);


element.classList.add(
    "hidden"
);


renderInventory();


const sound =
    document.getElementById(
        "collectSound"
    );


sound.currentTime = 0;

sound.play().catch(
    () => {}
);


showToast(
    `${ITEM_DATA[id].name} added to inventory.`
);

}

/* =========================================
COLLECTIBLE EVENTS
========================================= */

document
.querySelectorAll(".item")
.forEach(function(item) {

    item.onclick = function() {

        collectItem(
            item.dataset.item,
            item
        );

    };

});

/* =========================================
RESTORE COLLECTED ITEMS
========================================= */

function restoreCollectedItems() {

const inventory =
    getInventory();


inventory.forEach(function(id) {

    const item =
        document.querySelector(
            `[data-item="${id}"]`
        );


    if (item) {

        item.classList.add(
            "hidden"
        );

    }

});

}

/* =========================================
TOAST
========================================= */

function showToast(message) {

toast.textContent =
    message;


toast.classList.add(
    "show"
);


setTimeout(function() {

    toast.classList.remove(
        "show"
    );

}, 1600);

}

/* =========================================
BACK BUTTON
========================================= */

document
.getElementById("backButton")
.onclick = function() {

    location.href =
        "investigation.html";

};

/* =========================================
MUSIC
========================================= */

const music =
document.getElementById(
"music"
);

music.volume = 0.18;

music.play().catch(
() => {}
);

/* =========================================
WORDLE ELEMENTS
========================================= */

const puzzleOverlay =
document.getElementById(
"puzzleOverlay"
);

const closePuzzle =
document.getElementById(
"closePuzzle"
);

const wordleBoard =
document.getElementById(
"wordleBoard"
);

const guessInput =
document.getElementById(
"guessInput"
);

const submitGuess =
document.getElementById(
"submitGuess"
);

const hintButton =
document.getElementById(
"hintButton"
);

const puzzleMessage =
document.getElementById(
"puzzleMessage"
);

const continuePuzzle =
document.getElementById(
"continuePuzzle"
);

/* =========================================
WORD LIST
RANDOM WORD IS CHOSEN EACH TIME
========================================= */

const WORDS = [

"PHONE",
"CABLE",
"DRIVE",
"TRACE",
"FRAME",
"LIGHT",
"LOCKS",
"RADIO",
"WIRES",
"PROBE",
"FILES",
"CODES",
"NIGHT",
"WATCH",
"VOICE",
"SOUND",
"POWER",
"SCREEN",
"ERROR",
"MOUSE"

];

/* =========================================
WORDLE STATE
========================================= */

let secretWord = "";

let currentRow = 0;

let puzzleSolved = false;

let hintUsed = false;

/* =========================================
CREATE EMPTY BOARD
========================================= */

function createWordleBoard() {

wordleBoard.innerHTML = "";


for (
    let row = 0;
    row < 6;
    row++
) {

    for (
        let col = 0;
        col < 5;
        col++
    ) {

        const tile =
            document.createElement(
                "div"
            );


        tile.className =
            "wordleTile";


        tile.dataset.row =
            row;

        tile.dataset.col =
            col;


        wordleBoard.appendChild(
            tile
        );

    }

}

}

/* =========================================
RANDOM WORD
========================================= */

function chooseRandomWord() {

const randomIndex =
    Math.floor(
        Math.random() *
        WORDS.length
    );


secretWord =
    WORDS[randomIndex];

}

/* =========================================
OPEN WORDLE
========================================= */

function openPuzzle() {

puzzleOverlay.classList.remove(
    "hidden"
);


currentRow = 0;

puzzleSolved = false;

hintUsed = false;


puzzleMessage.textContent =
    "Six attempts. Find the five-letter word.";


continuePuzzle.classList.add(
    "hidden"
);


guessInput.disabled = false;

submitGuess.disabled = false;

hintButton.disabled = false;


guessInput.value = "";

createWordleBoard();

chooseRandomWord();

setTimeout(function() {

    guessInput.focus();

}, 100);

}

/* =========================================
START WORDLE
========================================= */

unlockButton.onclick = function() {

openPuzzle();

};

/* =========================================
SUBMIT GUESS
========================================= */

function submitWord() {

if (puzzleSolved)
    return;


const guess =
    guessInput.value
        .trim()
        .toUpperCase();


if (guess.length !== 5) {

    puzzleMessage.textContent =
        "Enter exactly five letters.";

    return;

}


/*
   Only letters.
*/

if (!/^[A-Z]{5}$/.test(guess)) {

    puzzleMessage.textContent =
        "Letters only.";

    return;

}


/*
   Put letters into current row.
*/

const tiles =
    [...document.querySelectorAll(
        `.wordleTile[data-row="${currentRow}"]`
    )];


for (
    let i = 0;
    i < 5;
    i++
) {

    tiles[i].textContent =
        guess[i];

}


/*
   Evaluate letters.
*/

const result =
    evaluateGuess(
        guess,
        secretWord
    );


for (
    let i = 0;
    i < 5;
    i++
) {

    tiles[i].classList.add(
        result[i]
    );

}


/*
   Correct word.
*/

if (
    guess === secretWord
) {

    puzzleSolved = true;

    guessInput.disabled = true;

    submitGuess.disabled = true;

    hintButton.disabled = true;


    puzzleMessage.textContent =
        "Correct. The cabinet lock releases.";


    continuePuzzle.classList.remove(
        "hidden"
    );


    return;

}


currentRow++;

guessInput.value = "";


/*
   Out of attempts.
*/

if (
    currentRow >= 6
) {

    guessInput.disabled = true;

    submitGuess.disabled = true;

    hintButton.disabled = true;


    puzzleMessage.innerHTML =
        `LOCKED. The word was <strong>${secretWord}</strong>. Close the puzzle and try again.`;

    return;

}


puzzleMessage.textContent =
    `${6 - currentRow} attempts remaining.`;

}

/* =========================================
WORD EVALUATION
========================================= */

function evaluateGuess(
guess,
answer
) {

const result =
    Array(5).fill(
        "wrong"
    );


const remaining =
    answer.split("");


/*
   FIRST:
   Correct positions.
*/

for (
    let i = 0;
    i < 5;
    i++
) {

    if (
        guess[i] === answer[i]
    ) {

        result[i] =
            "correct";

        remaining[i] =
            null;

    }

}


/*
   SECOND:
   Correct letter,
   wrong position.
*/

for (
    let i = 0;
    i < 5;
    i++
) {

    if (
        result[i] === "correct"
    )
        continue;


    const index =
        remaining.indexOf(
            guess[i]
        );


    if (
        index !== -1
    ) {

        result[i] =
            "present";

        remaining[index] =
            null;

    }

}


return result;

}

/* =========================================
ENTER KEY
========================================= */

guessInput.addEventListener(
"keydown",
function(event) {

    if (
        event.key === "Enter"
    ) {

        submitWord();

    }

}

);

/* =========================================
CHECK BUTTON
========================================= */

submitGuess.onclick =
function() {

    submitWord();

};

/* =========================================
HINT
========================================= */

hintButton.onclick =
function() {

    /*
       As requested:
       the hint directly gives
       the answer.
    */

    puzzleMessage.innerHTML =
        `HINT: <strong>${secretWord}</strong>`;

    hintUsed = true;

};

/* =========================================
UNLOCK CABINET
========================================= */

continuePuzzle.onclick =
function() {

    localStorage.setItem(
        CABINET_PUZZLE_KEY,
        "true"
    );


    puzzleOverlay.classList.add(
        "hidden"
    );


    updateCabinet();


    showToast(
        "Cabinet unlocked."
    );

};

/* =========================================
CLOSE PUZZLE
========================================= */

closePuzzle.onclick =
function() {

    puzzleOverlay.classList.add(
        "hidden"
    );

};

/* =========================================
INITIALIZE
========================================= */

renderInventory();

restoreCollectedItems();

updateCabinet();
