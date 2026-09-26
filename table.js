/* =========================================
   BROKEN PHONE
   WORK TABLE

   FLOW:

   LOCKED
      ↓
   MATCHING PUZZLE
      ↓
   FIND LEAF PAIR
      ↓
   UNLOCK TABLE
      ↓
   UNLOCKED IMAGE
      ↓
   COLLECT ITEMS
      ↓
   INVENTORY
========================================= */


/* =========================================
   TABLE IMAGES
========================================= */

const TABLE_LOCKED_IMAGE =
    "table_locked.png";

const TABLE_UNLOCKED_IMAGE =
    "table_unlocked.png";


/* =========================================
   STORAGE KEYS
========================================= */

const TABLE_UNLOCKED_KEY =
    "brokenPhone_tableUnlocked";

const INVENTORY_KEY =
    "brokenPhoneInventory";


/* =========================================
   ELEMENTS
========================================= */

const tableScene =
    document.getElementById("tableScene");

const unlockButton =
    document.getElementById("unlockButton");

const itemsLayer =
    document.getElementById("itemsLayer");

const puzzleOverlay =
    document.getElementById("puzzleOverlay");

const closePuzzle =
    document.getElementById("closePuzzle");

const leafGrid =
    document.getElementById("leafGrid");

const puzzleMessage =
    document.getElementById("puzzleMessage");

const continuePuzzle =
    document.getElementById("continuePuzzle");

const clueOverlay =
    document.getElementById("clueOverlay");

const closeClue =
    document.getElementById("closeClue");

const inventorySlots =
    document.getElementById("inventorySlots");

const toast =
    document.getElementById("toast");

const music =
    document.getElementById("music");

const collectSound =
    document.getElementById("collectSound");

const flipSound =
    document.getElementById("flipSound");

const unlockSound =
    document.getElementById("unlockSound");


/* =========================================
   ITEM DATA
========================================= */

const ITEM_DATA = {

    screen_connector: {

        name:
            "Screen Connector",

        img:
            "screen_connector.png"

    },

    cassette_tape: {

        name:
            "Cassette Tape",

        img:
            "cassette_tape.png"

    }

};


/* =========================================
   PUZZLE STATE
========================================= */

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let puzzleComplete = false;


/* =========================================
   TABLE STATE
========================================= */

function isTableUnlocked() {

    return localStorage.getItem(
        TABLE_UNLOCKED_KEY
    ) === "true";

}


/* =========================================
   INVENTORY
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

        return [];

    }

}


function saveInventory(
    inventory
) {

    localStorage.setItem(
        INVENTORY_KEY,
        JSON.stringify(inventory)
    );

}


/* =========================================
   TOAST
========================================= */

function showToast(
    message
) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        1600
    );

}


/* =========================================
   AUDIO
========================================= */

function playSound(
    audio
) {

    if (!audio) {

        return;

    }

    audio.currentTime = 0;

    audio.play().catch(
        () => {}
    );

}


/* =========================================
   INVENTORY DISPLAY
========================================= */

function renderInventory() {

    inventorySlots.innerHTML =
        "";

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
   HIDE ALREADY COLLECTED ITEMS
========================================= */

function restoreCollectedItems() {

    const inventory =
        getInventory();


    document
        .querySelectorAll(".item")
        .forEach(
            item => {

                const id =
                    item.dataset.item;


                if (
                    inventory.includes(id)
                ) {

                    item.classList.add(
                        "hidden"
                    );

                }

            }
        );

}


/* =========================================
   COLLECT ITEM
========================================= */

function collectItem(
    id,
    element
) {

    const inventory =
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


    if (
        !ITEM_DATA[id]
    ) {

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


    playSound(
        collectSound
    );


    showToast(
        `${ITEM_DATA[id].name} added to inventory.`
    );

}


/* =========================================
   TABLE IMAGE / STATE
========================================= */

function updateTable() {

    if (
        isTableUnlocked()
    ) {

        tableScene.style.backgroundImage =
            `url("${TABLE_UNLOCKED_IMAGE}")`;


        unlockButton.classList.add(
            "hidden"
        );


        itemsLayer.classList.remove(
            "hidden"
        );


        restoreCollectedItems();

    }

    else {

        tableScene.style.backgroundImage =
            `url("${TABLE_LOCKED_IMAGE}")`;


        unlockButton.classList.remove(
            "hidden"
        );


        itemsLayer.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   OPEN PUZZLE
========================================= */

function openPuzzle() {

    /*
       Reset puzzle state.
    */

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    puzzleComplete = false;


    /*
       Reset interface.
    */

    puzzleMessage.textContent =
        "Find the matching pairs.";


    continuePuzzle.classList.add(
        "hidden"
    );


    leafGrid.innerHTML =
        "";


    /*
       Create cards.
    */

    const cards = [

        {
            id: "leaf",
            emoji: "🍃"
        },

        {
            id: "leaf",
            emoji: "🍃"
        },


        {
            id: "gear",
            emoji: "⚙️"
        },

        {
            id: "gear",
            emoji: "⚙️"
        },


        {
            id: "key",
            emoji: "🔑"
        },

        {
            id: "key",
            emoji: "🔑"
        },


        {
            id: "phone",
            emoji: "📱"
        },

        {
            id: "phone",
            emoji: "📱"
        },


        {
            id: "battery",
            emoji: "🔋"
        },

        {
            id: "battery",
            emoji: "🔋"
        },


        {
            id: "lock",
            emoji: "🔒"
        },

        {
            id: "lock",
            emoji: "🔒"
        }

    ];


    shuffle(cards);


    cards.forEach(
        card => {

            createCard(
                card
            );

        }
    );


    /*
       Show puzzle.
    */

    puzzleOverlay.classList.remove(
        "hidden"
    );

}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(
    array
) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array;

}


/* =========================================
   CREATE CARD
========================================= */

function createCard(
    card
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "leafCard";


    element.dataset.id =
        card.id;


    element.innerHTML = `

        <div class="cardInner">

            <div class="cardBack">
                ◆
            </div>

            <div class="cardFront">

                <span class="cardEmoji">
                    ${card.emoji}
                </span>

            </div>

        </div>

    `;


    element.addEventListener(
        "click",
        () => {

            flipCard(
                element
            );

        }
    );


    leafGrid.appendChild(
        element
    );

}


/* =========================================
   FLIP CARD
========================================= */

function flipCard(
    card
) {

    /*
       Don't interact while
       checking two cards.
    */

    if (
        lockBoard
    ) {

        return;

    }


    /*
       Puzzle already complete.
    */

    if (
        puzzleComplete
    ) {

        return;

    }


    /*
       Don't click an already
       matched card.
    */

    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    /*
       Don't click the same
       card twice.
    */

    if (
        card === firstCard
    ) {

        return;

    }


    /*
       Flip card.
    */

    card.classList.add(
        "flipped"
    );


    playSound(
        flipSound
    );


    /*
       First card.
    */

    if (
        firstCard === null
    ) {

        firstCard =
            card;

        return;

    }


    /*
       Second card.
    */

    secondCard =
        card;


    checkMatch();

}


/* =========================================
   CHECK MATCH
========================================= */

function checkMatch() {

    if (
        !firstCard ||
        !secondCard
    ) {

        return;

    }


    const firstID =
        firstCard.dataset.id;

    const secondID =
        secondCard.dataset.id;


    /*
       MATCH
    */

    if (
        firstID === secondID
    ) {

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );


        /*
           LEAF PAIR
           = puzzle solution
        */

        if (
            firstID === "leaf"
        ) {

            finishPuzzle();

            return;

        }


        puzzleMessage.textContent =
            "Match found.";


        resetTurn();

        return;

    }


    /*
       WRONG MATCH
    */

    lockBoard = true;

    puzzleMessage.textContent =
        "No match. Try again.";


    setTimeout(
        () => {

            if (firstCard) {

                firstCard.classList.remove(
                    "flipped"
                );

            }


            if (secondCard) {

                secondCard.classList.remove(
                    "flipped"
                );

            }


            resetTurn();

        },
        700
    );

}


/* =========================================
   RESET TURN
========================================= */

function resetTurn() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* =========================================
   PUZZLE COMPLETE
========================================= */

function finishPuzzle() {

    puzzleComplete = true;

    lockBoard = true;


    document
        .querySelectorAll(".leafCard")
        .forEach(
            card => {

                card.classList.add(
                    "disabled"
                );

            }
        );


    puzzleMessage.textContent =
        "The matching leaves reveal the lock mechanism.";


    continuePuzzle.classList.remove(
        "hidden"
    );

}


/* =========================================
   UNLOCK TABLE
========================================= */

function unlockTable() {

    localStorage.setItem(
        TABLE_UNLOCKED_KEY,
        "true"
    );


    playSound(
        unlockSound
    );


    puzzleOverlay.classList.add(
        "hidden"
    );


    updateTable();


    clueOverlay.classList.remove(
        "hidden"
    );


    showToast(
        "Work table unlocked."
    );

}


/* =========================================
   UNLOCK BUTTON
========================================= */

unlockButton.addEventListener(
    "click",
    () => {

        openPuzzle();

    }
);


/* =========================================
   CONTINUE / UNLOCK
========================================= */

continuePuzzle.addEventListener(
    "click",
    () => {

        unlockTable();

    }
);


/* =========================================
   CLOSE PUZZLE
========================================= */

closePuzzle.addEventListener(
    "click",
    () => {

        puzzleOverlay.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   CLOSE CLUE
========================================= */

closeClue.addEventListener(
    "click",
    () => {

        clueOverlay.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   BACK
========================================= */

document
    .getElementById("backButton")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "investigation.html";

        }
    );


/* =========================================
   COLLECTIBLE EVENTS
========================================= */

document
    .querySelectorAll(".item")
    .forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    collectItem(
                        item.dataset.item,
                        item
                    );

                }
            );

        }
    );


/* =========================================
   MUSIC
========================================= */

music.volume = 0.18;

music.play().catch(
    () => {}
);


/* =========================================
   INITIALIZE
========================================= */

renderInventory();

updateTable();

restoreCollectedItems();
