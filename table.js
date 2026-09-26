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
   BACK
      ↓
   LOCKED AGAIN

   IMPORTANT:

   The TABLE UNLOCK state is temporary.

   The INVENTORY is permanent.
========================================= */


/* =========================================
   TABLE IMAGES
========================================= */

const TABLE_LOCKED_IMAGE =
    "table_locked.png";

const TABLE_UNLOCKED_IMAGE =
    "table_unlocked.png";


/* =========================================
   INVENTORY STORAGE
========================================= */

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
   CURRENT VISIT TABLE STATE
========================================= */

/*
   IMPORTANT:

   This variable is NOT saved.

   Every time table.html is opened,
   JavaScript starts again and this becomes:

       false

   Therefore the table is always locked
   when you enter the page.
*/

let tableUnlocked = false;


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
        JSON.stringify(
            inventory
        )
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
   RESTORE COLLECTED ITEMS
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

                else {

                    item.classList.remove(
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


    /*
       Already collected.
    */

    if (
        inventory.includes(id)
    ) {

        showToast(
            "Already collected."
        );

        return;

    }


    /*
       Inventory limit.
    */

    if (
        inventory.length >= 8
    ) {

        showToast(
            "Inventory full."
        );

        return;

    }


    /*
       Invalid item.
    */

    if (
        !ITEM_DATA[id]
    ) {

        return;

    }


    /*
       Permanently save item
       to the shared inventory.
    */

    inventory.push(id);


    saveInventory(
        inventory
    );


    /*
       Hide item from table.
    */

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
   UPDATE TABLE
========================================= */

function updateTable() {

    /*
       TABLE IS CURRENTLY UNLOCKED
    */

    if (
        tableUnlocked
    ) {

        tableScene.style.backgroundImage =
            `url("${TABLE_UNLOCKED_IMAGE}")`;


        unlockButton.classList.add(
            "hidden"
        );


        itemsLayer.classList.remove(
            "hidden"
        );


        /*
           Items that were already
           collected remain hidden.
        */

        restoreCollectedItems();

    }


    /*
       TABLE IS CURRENTLY LOCKED
    */

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
       The table should only open
       the puzzle when currently locked.
    */

    if (
        tableUnlocked
    ) {

        return;

    }


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
       Card pairs.
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


    shuffle(
        cards
    );


    cards.forEach(
        card => {

            createCard(
                card
            );

        }
    );


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

    if (
        lockBoard
    ) {

        return;

    }


    if (
        puzzleComplete
    ) {

        return;

    }


    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    if (
        card === firstCard
    ) {

        return;

    }


    card.classList.add(
        "flipped"
    );


    playSound(
        flipSound
    );


    if (
        firstCard === null
    ) {

        firstCard =
            card;

        return;

    }


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
           LEAF PAIR SOLVES PUZZLE.
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

    /*
       IMPORTANT:

       We DO NOT use localStorage here.

       The unlock exists only for this
       visit to table.html.
    */

    tableUnlocked = true;


    playSound(
        unlockSound
    );


    puzzleOverlay.classList.add(
        "hidden"
    );


    updateTable();


    /*
       Show the unlock message.
    */

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

            /*
               Explicitly lock the table
               before leaving.

               This is technically unnecessary
               because tableUnlocked is temporary,
               but it makes the intended behavior
               completely clear.
            */

            tableUnlocked = false;


            /*
               Close any open overlays.
            */

            puzzleOverlay.classList.add(
                "hidden"
            );


            clueOverlay.classList.add(
                "hidden"
            );


            /*
               Return to investigation.
            */

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

music.volume =
    0.18;


music.play().catch(
    () => {}
);


/* =========================================
   INITIALIZE
========================================= */

/*
   Every new visit starts here:

       tableUnlocked = false

   Therefore:

       LOCKED IMAGE
       +
       UNLOCK BUTTON
       +
       ITEMS HIDDEN
*/

tableUnlocked = false;


renderInventory();

updateTable();

restoreCollectedItems();
