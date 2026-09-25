/* =========================================
   BROKEN PHONE
   FILE CABINET

   FLOW:

   LOCKED CABINET
        ↓
   UNLOCK
        ↓
   MINI-GAME
        ↓
   SOLVED
        ↓
   UNLOCKED CABINET
        ↓
   COLLECT ITEMS
        ↓
   INVENTORY
        ↓
   BACK TO INVESTIGATION
========================================= */


/* =========================================
   CABINET IMAGES
========================================= */

const CABINET_LOCKED_IMAGE =
    "cabinet_locked.png";

const CABINET_UNLOCKED_IMAGE =
    "cabinet_unlocked.png";


const cabinetScene =
    document.getElementById("cabinetScene");

const unlockButton =
    document.getElementById("unlockButton");

const itemsLayer =
    document.getElementById("itemsLayer");


/* =========================================
   CABINET PUZZLE SAVE
========================================= */

const CABINET_PUZZLE_KEY =
    "brokenPhone_cabinetPuzzleSolved";


/* =========================================
   UPDATE CABINET
========================================= */

function updateCabinet() {

    const solved =
        localStorage.getItem(
            CABINET_PUZZLE_KEY
        ) === "true";


    if (solved) {

        /* -----------------------------
           UNLOCKED
        ----------------------------- */

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

        /* -----------------------------
           LOCKED
        ----------------------------- */

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
   RENDER INVENTORY
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

function collectItem(id, element) {

    let inventory =
        getInventory();


    /* Already collected */

    if (
        inventory.includes(id)
    ) {

        showToast(
            "Already collected."
        );

        return;

    }


    /* Inventory full */

    if (
        inventory.length >= 8
    ) {

        showToast(
            "Inventory full."
        );

        return;

    }


    /* Add item */

    inventory.push(id);

    saveInventory(
        inventory
    );


    /* Hide item */

    element.classList.add(
        "hidden"
    );


    /* Update inventory */

    renderInventory();


    /* Sound */

    const sound =
        document.getElementById(
            "collectSound"
        );


    sound.play().catch(
        () => {}
    );


    showToast(
        `${ITEM_DATA[id].name} added to inventory.`
    );

}


/* =========================================
   COLLECTIBLE BUTTONS
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
   MINI-GAME ELEMENTS
========================================= */

const puzzleOverlay =
    document.getElementById(
        "puzzleOverlay"
    );


const closePuzzle =
    document.getElementById(
        "closePuzzle"
    );


const leafGrid =
    document.getElementById(
        "leafGrid"
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
   PUZZLE VARIABLES
========================================= */

let firstCard = null;

let secondCard = null;

let lockBoard = false;


/* =========================================
   LEAF IMAGE
========================================= */

const LEAF_IMAGE =
    "leaf.png";


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

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
   CLICK UNLOCK
========================================= */

unlockButton.onclick = function() {

    openPuzzle();

};


/* =========================================
   OPEN PUZZLE
========================================= */

function openPuzzle() {

    puzzleOverlay.classList.remove(
        "hidden"
    );


    leafGrid.innerHTML = "";

    puzzleMessage.textContent =
        "";

    continuePuzzle.classList.add(
        "hidden"
    );


    firstCard = null;

    secondCard = null;

    lockBoard = false;


    createPuzzle();

}


/* =========================================
   CREATE PUZZLE
========================================= */

function createPuzzle() {

    const cards = [

        {
            id: "leaf",
            image: LEAF_IMAGE
        },

        {
            id: "leaf",
            image: LEAF_IMAGE
        },


        {
            id: "clip",
            image: "paper_clip.png"
        },

        {
            id: "clip",
            image: "paper_clip.png"
        },


        {
            id: "battery",
            image: "replacement_battery.png"
        },

        {
            id: "battery",
            image: "replacement_battery.png"
        },


        {
            id: "leaf2",
            image: LEAF_IMAGE
        },

        {
            id: "leaf2",
            image: LEAF_IMAGE
        },


        {
            id: "clip2",
            image: "paper_clip.png"
        },

        {
            id: "clip2",
            image: "paper_clip.png"
        },


        {
            id: "battery2",
            image: "replacement_battery.png"
        },

        {
            id: "battery2",
            image: "replacement_battery.png"
        }

    ];


    shuffle(cards);


    cards.forEach(function(card) {

        createCard(card);

    });

}


/* =========================================
   CREATE CARD
========================================= */

function createCard(card) {

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
                ?
            </div>

            <div class="cardFront">

                <img
                    src="${card.image}"
                    alt=""
                >

            </div>

        </div>

    `;


    element.onclick = function() {

        flipCard(element);

    };


    leafGrid.appendChild(
        element
    );

}


/* =========================================
   FLIP CARD
========================================= */

function flipCard(card) {

    if (lockBoard)
        return;


    if (card === firstCard)
        return;


    if (
        card.classList.contains(
            "matched"
        )
    )
        return;


    card.classList.add(
        "flipped"
    );


    const sound =
        document.getElementById(
            "flipSound"
        );


    sound.play().catch(
        () => {}
    );


    if (!firstCard) {

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

    const firstID =
        firstCard.dataset.id;


    const secondID =
        secondCard.dataset.id;


    /* =====================================
       MATCH
    ===================================== */

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
           Either leaf pair counts as
           finding the evidence.
        */

        if (
            firstID === "leaf" ||
            firstID === "leaf2"
        ) {

            puzzleMessage.textContent =
                "The leaves match.";

            finishPuzzle();

        }

        else {

            puzzleMessage.textContent =
                "Matched.";

            resetTurn();

        }

    }

    else {

        /* =================================
           WRONG MATCH
        ================================= */

        lockBoard = true;


        puzzleMessage.textContent =
            "No match.";


        setTimeout(function() {

            firstCard.classList.remove(
                "flipped"
            );


            secondCard.classList.remove(
                "flipped"
            );


            resetTurn();

        }, 700);

    }

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

    lockBoard = true;


    document
        .querySelectorAll(
            ".leafCard"
        )
        .forEach(function(card) {

            card.classList.add(
                "disabled"
            );

        });


    puzzleMessage.textContent =
        "Matching evidence found.";


    continuePuzzle.classList.remove(
        "hidden"
    );

}


/* =========================================
   UNLOCK CABINET
========================================= */

continuePuzzle.onclick = function() {

    /*
       Save ONLY the cabinet puzzle.

       This does NOT unlock the table.
    */

    localStorage.setItem(
        CABINET_PUZZLE_KEY,
        "true"
    );


    /* Close puzzle */

    puzzleOverlay.classList.add(
        "hidden"
    );


    /* Change locked → unlocked */

    updateCabinet();


    showToast(
        "Cabinet unlocked."
    );

};


/* =========================================
   CLOSE PUZZLE
========================================= */

closePuzzle.onclick = function() {

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
