/* =========================================
   BROKEN PHONE
   WORK TABLE
   LOCKED → MINI-GAME → UNLOCKED
   → COLLECT ITEMS → INVENTORY
========================================= */


/* =========================================
   TABLE IMAGES
========================================= */

const TABLE_LOCKED_IMAGE =
    "table_locked.png";


const TABLE_UNLOCKED_IMAGE =
    "table_unlocked.png";


const tableScene =
    document.getElementById(
        "tableScene"
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
   CHECK IF TABLE IS ALREADY UNLOCKED
========================================= */

const TABLE_UNLOCKED_KEY =
    "brokenPhone_tableUnlocked";


function isTableUnlocked(){

    return localStorage.getItem(
        TABLE_UNLOCKED_KEY
    ) === "true";

}


/* =========================================
   UPDATE TABLE IMAGE
========================================= */

function updateTableImage(){

    if(isTableUnlocked()){

        tableScene.style.backgroundImage =
            `url("${TABLE_UNLOCKED_IMAGE}")`;

        /*
           Show collectible items.
        */

        itemsLayer.classList.remove(
            "hidden"
        );


        /*
           Hide unlock button.
        */

        unlockButton.classList.add(
            "hidden"
        );

    }
    else{

        tableScene.style.backgroundImage =
            `url("${TABLE_LOCKED_IMAGE}")`;

        /*
           Hide items while locked.
        */

        itemsLayer.classList.add(
            "hidden"
        );


        /*
           Show unlock button.
        */

        unlockButton.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   INVENTORY
========================================= */

const INVENTORY_KEY =
    "brokenPhoneInventory";


const DATA = {

    screen_connector:{
        name:"Screen Connector",
        img:"screen_connector.png"
    },


    cassette_tape:{
        name:"Cassette Tape",
        img:"cassette_tape.png"
    }

};


const slots =
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

function getInventory(){

    try{

        return JSON.parse(
            localStorage.getItem(
                INVENTORY_KEY
            )
        ) || [];

    }
    catch(error){

        return [];

    }

}


/* =========================================
   SAVE INVENTORY
========================================= */

function saveInventory(
    inventory
){

    localStorage.setItem(
        INVENTORY_KEY,
        JSON.stringify(
            inventory
        )
    );

}


/* =========================================
   RENDER INVENTORY
========================================= */

function renderInventory(){

    slots.innerHTML = "";

    const inventory =
        getInventory();


    for(
        let i = 0;
        i < 8;
        i++
    ){

        const slot =
            document.createElement(
                "div"
            );


        slot.className =
            "inventory-slot";


        if(
            inventory[i] &&
            DATA[inventory[i]]
        ){

            slot.innerHTML = `

                <img
                    src="${DATA[inventory[i]].img}"
                    alt=""
                >

                <span>
                    ${DATA[inventory[i]].name}
                </span>

            `;

        }


        slots.appendChild(
            slot
        );

    }

}


/* =========================================
   TOAST
========================================= */

function showToast(
    message
){

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    },1600);

}


/* =========================================
   COLLECT ITEM
========================================= */

function collectItem(
    id,
    element
){

    let inventory =
        getInventory();


    /*
       Already collected.
    */

    if(
        inventory.includes(id)
    ){

        showToast(
            "Already collected."
        );

        return;

    }


    /*
       Inventory full.
    */

    if(
        inventory.length >= 8
    ){

        showToast(
            "Inventory full."
        );

        return;

    }


    /*
       Add item.
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


    /*
       Update inventory UI.
    */

    renderInventory();


    /*
       Sound.
    */

    document
        .getElementById(
            "collectSound"
        )
        .play()
        .catch(() => {});


    showToast(
        `${DATA[id].name} added to inventory.`
    );

}


/* =========================================
   BACK BUTTON
========================================= */

document
    .getElementById(
        "backButton"
    )
    .onclick = () => {

        window.location.href =
            "investigation.html";

    };


/* =========================================
   COLLECTIBLE EVENTS
========================================= */

document
    .querySelectorAll(
        ".item"
    )
    .forEach(
        element => {

            element.onclick = () => {

                collectItem(
                    element.dataset.item,
                    element
                );

            };

        }
    );


/* =========================================
   RESTORE COLLECTED ITEMS
========================================= */

function restoreCollectedItems(){

    const inventory =
        getInventory();


    document
        .querySelectorAll(
            ".item"
        )
        .forEach(
            element => {

                if(
                    inventory.includes(
                        element.dataset.item
                    )
                ){

                    element.classList.add(
                        "hidden"
                    );

                }

            }
        );

}


/* =========================================
   MUSIC
========================================= */

const music =
    document.getElementById(
        "music"
    );


music.volume = 0.18;


music.play()
    .catch(() => {});


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


const clueOverlay =
    document.getElementById(
        "clueOverlay"
    );


const closeClue =
    document.getElementById(
        "closeClue"
    );


/* =========================================
   PUZZLE STATE
========================================= */

let firstCard = null;

let secondCard = null;

let lockBoard = false;


/* =========================================
   OPEN MINI-GAME
========================================= */

unlockButton.onclick = () => {

    openPuzzle();

};


/* =========================================
   OPEN PUZZLE
========================================= */

function openPuzzle(){

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


    /*
       12 cards.

       One important leaf pair.

       Other pairs are decoys.
    */

    const cards = [

        {
            id:"leaf",
            image:"leaf.png"
        },

        {
            id:"leaf",
            image:"leaf.png"
        },


        {
            id:"clip",
            image:"paper_clip.png"
        },

        {
            id:"clip",
            image:"paper_clip.png"
        },


        {
            id:"battery",
            image:"replacement_battery.png"
        },

        {
            id:"battery",
            image:"replacement_battery.png"
        },


        {
            id:"connector",
            image:"screen_connector.png"
        },

        {
            id:"connector",
            image:"screen_connector.png"
        },


        {
            id:"tape",
            image:"cassette_tape.png"
        },

        {
            id:"tape",
            image:"cassette_tape.png"
        },


        {
            id:"paper",
            image:"paper_clip.png"
        },

        {
            id:"paper",
            image:"paper_clip.png"
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

}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(
    array
){

    for(
        let i = array.length - 1;
        i > 0;
        i--
    ){

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
){

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


    element.onclick = () => {

        flipCard(
            element
        );

    };


    leafGrid.appendChild(
        element
    );

}


/* =========================================
   FLIP CARD
========================================= */

function flipCard(
    card
){

    if(lockBoard)
        return;


    if(card === firstCard)
        return;


    if(
        card.classList.contains(
            "matched"
        )
    )
        return;


    card.classList.add(
        "flipped"
    );


    document
        .getElementById(
            "flipSound"
        )
        .play()
        .catch(() => {});


    if(!firstCard){

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

function checkMatch(){

    const firstID =
        firstCard.dataset.id;


    const secondID =
        secondCard.dataset.id;


    /*
       MATCH
    */

    if(
        firstID === secondID
    ){

        firstCard.classList.add(
            "matched"
        );


        secondCard.classList.add(
            "matched"
        );


        /*
           IMPORTANT:
           Finding the leaf pair
           finishes the game.
        */

        if(
            firstID === "leaf"
        ){

            puzzleMessage.textContent =
                "The leaves match.";


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
        "No match.";


    setTimeout(() => {

        firstCard.classList.remove(
            "flipped"
        );


        secondCard.classList.remove(
            "flipped"
        );


        resetTurn();

    },700);

}


/* =========================================
   RESET TURN
========================================= */

function resetTurn(){

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* =========================================
   PUZZLE COMPLETE
========================================= */

function finishPuzzle(){

    lockBoard = true;


    document
        .querySelectorAll(
            ".leafCard"
        )
        .forEach(
            card => {

                card.classList.add(
                    "disabled"
                );

            }
        );


    puzzleMessage.textContent =
        "Matching evidence found.";


    continuePuzzle.classList.remove(
        "hidden"
    );

}


/* =========================================
   UNLOCK TABLE
========================================= */

continuePuzzle.onclick = () => {

    /*
       Save table as unlocked.
    */

    localStorage.setItem(
        TABLE_UNLOCKED_KEY,
        "true"
    );


    /*
       Change:

       table_locked.png
              ↓
       table_unlocked.png
    */

    updateTableImage();


    /*
       Close mini-game.
    */

    puzzleOverlay.classList.add(
        "hidden"
    );


    /*
       Show information window.
    */

    clueOverlay.classList.remove(
        "hidden"
    );

};


/* =========================================
   CLOSE PUZZLE
========================================= */

closePuzzle.onclick = () => {

    puzzleOverlay.classList.add(
        "hidden"
    );

};


/* =========================================
   CLOSE CLUE
========================================= */

closeClue.onclick = () => {

    clueOverlay.classList.add(
        "hidden"
    );

};


/* =========================================
   INITIALIZE
========================================= */

renderInventory();

updateTableImage();

restoreCollectedItems();
