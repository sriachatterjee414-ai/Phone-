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
   BACK
   ↓
   CABINET LOCKS AGAIN
========================================= */


/* =========================================
   CABINET IMAGES
========================================= */

const CABINET_LOCKED_IMAGE =
    "cabinet_locked.png";

const CABINET_UNLOCKED_IMAGE =
    "cabinet_unlocked.png";


/* =========================================
   CABINET ELEMENTS
========================================= */

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

   IMPORTANT:
   This is NOT saved in localStorage.

   Every time the cabinet page opens,
   it starts LOCKED again.
========================================= */

let cabinetUnlocked = false;


/* =========================================
   UPDATE CABINET
========================================= */

function updateCabinet() {

    if (cabinetUnlocked) {

        /* ===============================
           UNLOCKED
        =============================== */

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

        /* ===============================
           LOCKED
        =============================== */

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


/* =========================================
   CABINET ITEM DATA
========================================= */

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


/* =========================================
   INVENTORY ELEMENTS
========================================= */

const inventorySlots =
    document.getElementById(
        "inventorySlots"
    );

const toast =
    document.getElementById(
        "toast"
    );


/* =========================================
   GET INVENTORY
========================================= */

function getInventory() {

    try {

        const saved =
            localStorage.getItem(
                INVENTORY_KEY
            );

        if (!saved) {

            return [];

        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "Inventory could not be loaded:",
            error
        );

        return [];

    }

}


/* =========================================
   SAVE INVENTORY
========================================= */

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


    /*
       Always create 8 slots.
    */

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


        const itemID =
            inventory[i];


        if (
            itemID &&
            ITEM_DATA[itemID]
        ) {

            slot.innerHTML = `

                <img
                    src="${ITEM_DATA[itemID].img}"
                    alt="${ITEM_DATA[itemID].name}"
                >

                <span>
                    ${ITEM_DATA[itemID].name}
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


    /* ===============================
       INVALID ITEM
    =============================== */

    if (!ITEM_DATA[id]) {

        console.error(
            "Unknown cabinet item:",
            id
        );

        return;

    }


    /* ===============================
       ALREADY COLLECTED
    =============================== */

    if (
        inventory.includes(id)
    ) {

        showToast(
            "Already collected."
        );

        /*
           Hide it anyway so the cabinet
           stays visually correct.
        */

        element.classList.add(
            "hidden"
        );

        return;

    }


    /* ===============================
       INVENTORY FULL
    =============================== */

    if (
        inventory.length >= 8
    ) {

        showToast(
            "Inventory full."
        );

        return;

    }


    /* ===============================
       ADD ITEM
    =============================== */

    inventory.push(id);


    saveInventory(
        inventory
    );


    /* ===============================
       REMOVE ITEM FROM CABINET
    =============================== */

    element.classList.add(
        "hidden"
    );


    /* ===============================
       UPDATE INVENTORY
    =============================== */

    renderInventory();


    /* ===============================
       SOUND
    =============================== */

    const sound =
        document.getElementById(
            "collectSound"
        );


    if (sound) {

        sound.currentTime = 0;

        sound.play().catch(
            () => {}
        );

    }


    /* ===============================
       MESSAGE
    =============================== */

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

        item.addEventListener(
            "click",
            function() {

                collectItem(

                    item.dataset.item,

                    item

                );

            }
        );

    });


/* =========================================
   RESTORE COLLECTED ITEMS
========================================= */

function restoreCollectedItems() {

    const inventory =
        getInventory();


    document
        .querySelectorAll(".item")
        .forEach(function(item) {

            const id =
                item.dataset.item;


            /*
               If this item is already
               in the global inventory,
               don't show it again.
            */

            if (
                inventory.includes(id)
            ) {

                item.classList.add(
                    "hidden"
                );

            }

            else {

                /*
                   If it hasn't been
                   collected, make sure
                   it is available after
                   unlocking.
                */

                item.classList.remove(
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


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        1600
    );

}


/* =========================================
   BACK BUTTON
========================================= */

document
    .getElementById("backButton")
    .addEventListener(
        "click",
        function() {

            /*
               IMPORTANT:

               The cabinet is only unlocked
               during the current visit.

               We don't need to save anything.

               When cabinet.html loads again,
               cabinetUnlocked starts as false.
            */

            cabinetUnlocked =
                false;


            updateCabinet();


            location.href =
                "investigation.html";

        }
    );


/* =========================================
   MUSIC
========================================= */

const music =
    document.getElementById(
        "music"
    );

if (music) {

    music.volume = 0.18;

    music.play().catch(
        () => {}
    );

}


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


    guessInput.disabled =
        false;

    submitGuess.disabled =
        false;

    hintButton.disabled =
        false;


    guessInput.value = "";


    createWordleBoard();

    chooseRandomWord();


    setTimeout(
        function() {

            guessInput.focus();

        },
        100
    );

}


/* =========================================
   START WORDLE
========================================= */

unlockButton.onclick =
    function() {

        openPuzzle();

    };


/* =========================================
   SUBMIT WORD
========================================= */

function submitWord() {

    if (puzzleSolved)
        return;


    const guess =
        guessInput.value
            .trim()
            .toUpperCase();


    if (
        guess.length !== 5
    ) {

        puzzleMessage.textContent =
            "Enter exactly five letters.";

        return;

    }


    if (
        !/^[A-Z]{5}$/.test(guess)
    ) {

        puzzleMessage.textContent =
            "Letters only.";

        return;

    }


    const tiles =
        [
            ...document.querySelectorAll(
                `.wordleTile[data-row="${currentRow}"]`
            )
        ];


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        tiles[i].textContent =
            guess[i];

    }


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


    /* ===============================
       CORRECT
    =============================== */

    if (
        guess === secretWord
    ) {

        puzzleSolved = true;


        guessInput.disabled =
            true;

        submitGuess.disabled =
            true;

        hintButton.disabled =
            true;


        puzzleMessage.textContent =
            "Correct. The cabinet lock releases.";


        continuePuzzle.classList.remove(
            "hidden"
        );


        return;

    }


    currentRow++;

    guessInput.value = "";


    /* ===============================
       OUT OF ATTEMPTS
    =============================== */

    if (
        currentRow >= 6
    ) {

        guessInput.disabled =
            true;

        submitGuess.disabled =
            true;

        hintButton.disabled =
            true;


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
       Correct positions first.
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

        puzzleMessage.innerHTML =
            `HINT: <strong>${secretWord}</strong>`;

        hintUsed = true;

    };


/* =========================================
   UNLOCK CABINET
========================================= */

continuePuzzle.onclick =
    function() {

        /*
           IMPORTANT:

           Do NOT save this to localStorage.

           It only lasts while this cabinet
           page is open.
        */

        cabinetUnlocked =
            true;


        puzzleOverlay.classList.add(
            "hidden"
        );


        updateCabinet();


        /*
           Restore only items that have
           NOT already been collected.
        */

        restoreCollectedItems();


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

/*
   Every visit starts LOCKED.
*/

cabinetUnlocked =
    false;


/*
   Show locked cabinet.
*/

updateCabinet();


/*
   Hide items that were already
   collected in previous visits.
*/

restoreCollectedItems();


/*
   Show current global inventory.
*/

renderInventory();
