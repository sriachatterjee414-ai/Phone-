/* =========================================
   BROKEN PHONE
   DESK DRAWER
========================================= */


/* =========================================
   IMAGES
========================================= */

const DESK_LOCKED_IMAGE =
    "desk_drawer_locked.png";

const DESK_OPEN_IMAGE =
    "desk_drawer_open.png";


/* =========================================
   INVENTORY STORAGE
========================================= */

/*
   IMPORTANT:

   The drawer unlock state is NOT stored
   in localStorage anymore.

   This means:

   Enter desk
        ↓
   LOCKED

   Solve puzzle
        ↓
   UNLOCKED

   Collect items
        ↓
   BACK

   Return later
        ↓
   LOCKED AGAIN
*/


const INVENTORY_KEY =
    "brokenPhoneInventory";


/* =========================================
   ELEMENTS
========================================= */

const deskScene =
    document.getElementById("deskScene");

const unlockButton =
    document.getElementById("unlockButton");

const drawerPuzzle =
    document.getElementById("drawerPuzzle");

const closePuzzle =
    document.getElementById("closePuzzle");

const matchGrid =
    document.getElementById("matchGrid");

const matchCount =
    document.getElementById("matchCount");

const deskPuzzleMessage =
    document.getElementById("deskPuzzleMessage");

const continuePuzzle =
    document.getElementById("continuePuzzle");

const itemsLayer =
    document.getElementById("itemsLayer");

const inventorySlots =
    document.getElementById("inventorySlots");

const toast =
    document.getElementById("toast");

const music =
    document.getElementById("music");

const clickSound =
    document.getElementById("clickSound");

const unlockSound =
    document.getElementById("unlockSound");

const collectSound =
    document.getElementById("collectSound");


/* =========================================
   CURRENT VISIT STATE
========================================= */

/*
   This resets every time desk.html is opened.

   false = drawer locked
   true  = drawer unlocked
*/

let deskUnlocked = false;


/* =========================================
   ITEM DATA
========================================= */

const ITEM_DATA = {

    precision_screwdriver: {

        name:
            "Precision Screwdriver",

        img:
            "precision_screwdriver.png"

    },


    replacement_battery: {

        name:
            "Replacement Battery",

        img:
            "replacement_battery.png"

    },


    old_key: {

        name:
            "Old Key",

        img:
            "old_key.png"

    }

};


/* =========================================
   SYMBOLS
========================================= */

const SYMBOLS = [

    "●",
    "◆",
    "■",
    "★",
    "▲",
    "✚"

];


const BOARD_SIZE = 12;

const TOTAL_TILES =
    BOARD_SIZE * BOARD_SIZE;


/* =========================================
   PUZZLE STATE
========================================= */

let board = [];

let selectedTile = null;

let matches = 0;

let boardLocked = false;

let puzzleWon = false;


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


        const id =
            inventory[i];


        if (
            id &&
            ITEM_DATA[id]
        ) {

            slot.innerHTML = `

                <img
                    src="${ITEM_DATA[id].img}"
                    alt="${ITEM_DATA[id].name}"
                >

                <span>
                    ${ITEM_DATA[id].name}
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

/*
   IMPORTANT:

   Even though the drawer resets to locked,
   collected items remain collected.

   Example:

   First visit:
       Unlock
       Collect screwdriver
       Collect battery
       BACK

   Second visit:
       Locked
       Unlock again
       Screwdriver = gone
       Battery = gone
       Key = still available
*/

function restoreCollectedItems() {

    const inventory =
        getInventory();


    document
        .querySelectorAll(".item")
        .forEach(
            item => {

                if (
                    inventory.includes(
                        item.dataset.item
                    )
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
   UPDATE DESK
========================================= */

function updateDesk() {

    if (
        deskUnlocked
    ) {

        /*
           Drawer is currently unlocked.
        */

        deskScene.classList.remove(
            "locked"
        );

        deskScene.classList.add(
            "open"
        );


        unlockButton.classList.add(
            "hidden"
        );


        itemsLayer.classList.remove(
            "hidden"
        );


        /*
           Hide items already collected.
        */

        restoreCollectedItems();

    }

    else {

        /*
           Drawer is currently locked.
        */

        deskScene.classList.remove(
            "open"
        );

        deskScene.classList.add(
            "locked"
        );


        unlockButton.classList.remove(
            "hidden"
        );


        itemsLayer.classList.add(
            "hidden"
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


    /*
       Add item permanently
       to inventory.
    */

    inventory.push(id);

    saveInventory(
        inventory
    );


    /*
       Hide item from drawer.
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
   CREATE BOARD
========================================= */

function createBoard() {

    board = [];

    selectedTile = null;

    matchGrid.innerHTML =
        "";


    for (
        let i = 0;
        i < TOTAL_TILES;
        i++
    ) {

        board.push(
            Math.floor(
                Math.random() *
                SYMBOLS.length
            )
        );

    }


    renderBoard();

}


/* =========================================
   RENDER BOARD
========================================= */

function renderBoard() {

    matchGrid.innerHTML =
        "";


    board.forEach(
        (symbol, index) => {

            const tile =
                document.createElement(
                    "button"
                );


            tile.type =
                "button";


            tile.className =
                "tile";


            tile.textContent =
                SYMBOLS[symbol];


            tile.dataset.index =
                index;


            if (
                index === selectedTile
            ) {

                tile.classList.add(
                    "selected"
                );

            }


            tile.addEventListener(
                "click",
                () => {

                    tileClicked(
                        index
                    );

                }
            );


            matchGrid.appendChild(
                tile
            );

        }
    );

}


/* =========================================
   TILE CLICK
========================================= */

function tileClicked(
    index
) {

    if (
        boardLocked ||
        puzzleWon
    ) {

        return;

    }


    if (
        selectedTile === null
    ) {

        selectedTile =
            index;

        renderBoard();

        return;

    }


    if (
        selectedTile === index
    ) {

        selectedTile = null;

        renderBoard();

        return;

    }


    const firstRow =
        Math.floor(
            selectedTile /
            BOARD_SIZE
        );


    const firstCol =
        selectedTile %
        BOARD_SIZE;


    const secondRow =
        Math.floor(
            index /
            BOARD_SIZE
        );


    const secondCol =
        index %
        BOARD_SIZE;


    const distance =
        Math.abs(
            firstRow -
            secondRow
        ) +
        Math.abs(
            firstCol -
            secondCol
        );


    if (
        distance !== 1
    ) {

        deskPuzzleMessage.textContent =
            "You can only swap adjacent symbols.";

        selectedTile = null;

        renderBoard();

        return;

    }


    const first =
        selectedTile;

    const second =
        index;


    [
        board[first],
        board[second]
    ] =
    [
        board[second],
        board[first]
    ];


    selectedTile = null;


    renderBoard();


    resolveMatches();

}


/* =========================================
   FIND MATCHES
========================================= */

function findMatches() {

    const matched =
        new Set();


    /*
       HORIZONTAL
    */

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        let start = 0;


        for (
            let col = 1;
            col <= BOARD_SIZE;
            col++
        ) {

            const current =
                col < BOARD_SIZE
                    ? board[
                        row *
                        BOARD_SIZE +
                        col
                    ]
                    : null;


            const previous =
                board[
                    row *
                    BOARD_SIZE +
                    (col - 1)
                ];


            if (
                col < BOARD_SIZE &&
                current === previous
            ) {

                continue;

            }


            const runLength =
                col - start;


            if (
                runLength >= 3
            ) {

                for (
                    let c = start;
                    c < col;
                    c++
                ) {

                    matched.add(
                        row *
                        BOARD_SIZE +
                        c
                    );

                }

            }


            start = col;

        }

    }


    /*
       VERTICAL
    */

    for (
        let col = 0;
        col < BOARD_SIZE;
        col++
    ) {

        let start = 0;


        for (
            let row = 1;
            row <= BOARD_SIZE;
            row++
        ) {

            const current =
                row < BOARD_SIZE
                    ? board[
                        row *
                        BOARD_SIZE +
                        col
                    ]
                    : null;


            const previous =
                board[
                    (row - 1) *
                    BOARD_SIZE +
                    col
                ];


            if (
                row < BOARD_SIZE &&
                current === previous
            ) {

                continue;

            }


            const runLength =
                row - start;


            if (
                runLength >= 3
            ) {

                for (
                    let r = start;
                    r < row;
                    r++
                ) {

                    matched.add(
                        r *
                        BOARD_SIZE +
                        col
                    );

                }

            }


            start = row;

        }

    }


    return matched;

}


/* =========================================
   RESOLVE MATCHES
========================================= */

function resolveMatches() {

    const matched =
        findMatches();


    if (
        matched.size === 0
    ) {

        deskPuzzleMessage.textContent =
            "No match. Swap another pair.";

        return;

    }


    matches++;


    matchCount.textContent =
        Math.min(
            matches,
            10
        );


    deskPuzzleMessage.textContent =
        matched.size >= 6
            ? "Large match found."
            : "Match found.";


    matched.forEach(
        index => {

            board[index] =
                Math.floor(
                    Math.random() *
                    SYMBOLS.length
                );

        }
    );


    renderBoard();


    if (
        matches >= 10
    ) {

        finishPuzzle();

        return;

    }


    setTimeout(
        () => {

            const chain =
                findMatches();


            if (
                chain.size > 0
            ) {

                chain.forEach(
                    index => {

                        board[index] =
                            Math.floor(
                                Math.random() *
                                SYMBOLS.length
                            );

                    }
                );


                renderBoard();

            }

        },
        120
    );

}


/* =========================================
   OPEN PUZZLE
========================================= */

function openPuzzle() {

    /*
       Safety check.
    */

    if (
        deskUnlocked
    ) {

        return;

    }


    playSound(
        clickSound
    );


    matches = 0;

    boardLocked = false;

    puzzleWon = false;

    selectedTile = null;


    matchCount.textContent =
        "0";


    deskPuzzleMessage.textContent =
        "Swap adjacent symbols to make matches.";


    continuePuzzle.classList.add(
        "hidden"
    );


    createBoard();


    drawerPuzzle.classList.remove(
        "hidden"
    );

}


/* =========================================
   FINISH PUZZLE
========================================= */

function finishPuzzle() {

    puzzleWon = true;

    boardLocked = true;

    selectedTile = null;


    deskPuzzleMessage.textContent =
        "The lock mechanism clicks into place.";


    continuePuzzle.classList.remove(
        "hidden"
    );

}


/* =========================================
   UNLOCK DRAWER
========================================= */

function unlockDesk() {

    /*
       IMPORTANT:

       This is NOT saved to localStorage.

       It only exists while this page
       is open.
    */

    deskUnlocked = true;


    playSound(
        unlockSound
    );


    drawerPuzzle.classList.add(
        "hidden"
    );


    updateDesk();


    showToast(
        "Desk drawer unlocked."
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
   CONTINUE BUTTON
========================================= */

continuePuzzle.addEventListener(
    "click",
    () => {

        unlockDesk();

    }
);


/* =========================================
   CLOSE PUZZLE
========================================= */

closePuzzle.addEventListener(
    "click",
    () => {

        drawerPuzzle.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   BACK BUTTON
========================================= */

document
    .getElementById("backButton")
    .addEventListener(
        "click",
        () => {

            /*
               Reset drawer for the
               next visit.

               We don't actually need
               to save anything because
               deskUnlocked is temporary.
            */

            deskUnlocked = false;


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
   Every time this page loads:

       deskUnlocked = false

   Therefore the drawer ALWAYS starts
   locked.
*/

deskUnlocked = false;


renderInventory();

updateDesk();

restoreCollectedItems();
