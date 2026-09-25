```javascript
/* =========================================
   BROKEN PHONE
   FILE CABINET
   INVENTORY + LEAF MATCHING MINI-GAME
========================================= */


/* =========================================
   INVENTORY
========================================= */

const KEY = "brokenPhoneInventory";

const DATA = {

    replacement_battery:{
        name:"Replacement Battery",
        img:"replacement_battery.png"
    },

    paper_clip:{
        name:"Paper Clip",
        img:"paper_clip.png"
    }

};


const slots =
    document.getElementById("inventorySlots");

const toast =
    document.getElementById("toast");


function inv(){

    try{

        return JSON.parse(
            localStorage.getItem(KEY)
        ) || [];

    }catch(e){

        return [];

    }

}


function save(a){

    localStorage.setItem(
        KEY,
        JSON.stringify(a)
    );

}


/* =========================================
   INVENTORY RENDER
========================================= */

function render(){

    slots.innerHTML = "";

    const a = inv();

    for(let i = 0; i < 8; i++){

        const s =
            document.createElement("div");

        s.className =
            "inventory-slot";


        if(a[i] && DATA[a[i]]){

            s.innerHTML = `
                <img src="${DATA[a[i]].img}">
                <span>${DATA[a[i]].name}</span>
            `;

        }


        slots.appendChild(s);

    }

}


/* =========================================
   COLLECT ITEM
========================================= */

function collect(id,el){

    let a = inv();


    if(a.includes(id)){

        showToast("Already collected.");

        return;

    }


    if(a.length >= 8){

        showToast("Inventory full.");

        return;

    }


    a.push(id);

    save(a);


    el.classList.add("hidden");

    render();


    document
        .getElementById("collectSound")
        .play()
        .catch(()=>{});


    showToast(
        `${DATA[id].name} added to inventory.`
    );

}


/* =========================================
   TOAST
========================================= */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },1600);

}


/* =========================================
   BACK BUTTON
========================================= */

document
    .getElementById("backButton")
    .onclick = () => {

        location.href =
            "investigation.html";

    };


/* =========================================
   COLLECTIBLE CLICK EVENTS
========================================= */

document
    .querySelectorAll(".item")
    .forEach(el => {

        el.onclick = () => {

            collect(
                el.dataset.item,
                el
            );

        };

    });


/* =========================================
   MUSIC
========================================= */

document
    .getElementById("music")
    .volume = .18;


document
    .getElementById("music")
    .play()
    .catch(()=>{});


/* =========================================
   RESTORE COLLECTED ITEMS
========================================= */

render();


inv().forEach(id => {

    const e =
        document.querySelector(
            `[data-item="${id}"]`
        );

    if(e){

        e.classList.add("hidden");

    }

});


/* =====================================================
   LEAF MATCHING MINI-GAME
===================================================== */


/* -----------------------------------------
   ELEMENTS
----------------------------------------- */

const puzzleButton =
    document.getElementById(
        "leafPuzzleButton"
    );


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


/* -----------------------------------------
   GAME VARIABLES
----------------------------------------- */

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;


/*
   IMPORTANT:

   Change this image later to your actual
   leaf PNG.

   For now you can simply use:
   leaf.png
*/

const LEAF_IMAGE =
    "leaf.png";


/*
   Other images are deliberately used as
   decoys.

   You can replace these later with your
   own investigation-object PNGs.
*/

const CARD_IMAGES = [

    "leaf.png",

    "paper_clip.png",

    "replacement_battery.png",

    "leaf.png",

    "paper_clip.png",

    "replacement_battery.png",

    "leaf.png",

    "paper_clip.png",

    "replacement_battery.png",

    "leaf.png",

    "paper_clip.png",

    "replacement_battery.png"

];


/* -----------------------------------------
   SHUFFLE
----------------------------------------- */

function shuffle(array){

    for(
        let i = array.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                Math.random() * (i + 1)
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


/* -----------------------------------------
   OPEN PUZZLE
----------------------------------------- */

puzzleButton.onclick = () => {

    openLeafPuzzle();

};


/* -----------------------------------------
   CREATE PUZZLE
----------------------------------------- */

function openLeafPuzzle(){

    puzzleOverlay.classList.remove(
        "hidden"
    );


    leafGrid.innerHTML = "";

    puzzleMessage.textContent = "";

    continuePuzzle.classList.add(
        "hidden"
    );


    firstCard = null;

    secondCard = null;

    lockBoard = false;

    matchedPairs = 0;


    /*
       Create 12 cards.

       There are 6 pairs.

       One of those pairs is the
       important matching leaf pair.
    */

    const cards = [

        {
            id:"leaf",
            image:LEAF_IMAGE
        },

        {
            id:"leaf",
            image:LEAF_IMAGE
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
            id:"leaf2",
            image:LEAF_IMAGE
        },

        {
            id:"leaf2",
            image:LEAF_IMAGE
        },

        {
            id:"clip2",
            image:"paper_clip.png"
        },

        {
            id:"clip2",
            image:"paper_clip.png"
        },

        {
            id:"battery2",
            image:"replacement_battery.png"
        },

        {
            id:"battery2",
            image:"replacement_battery.png"
        }

    ];


    shuffle(cards);


    cards.forEach(card => {

        createCard(card);

    });

}


/* -----------------------------------------
   CREATE INDIVIDUAL CARD
----------------------------------------- */

function createCard(card){

    const element =
        document.createElement("div");

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

        flipCard(element);

    };


    leafGrid.appendChild(element);

}


/* -----------------------------------------
   FLIP CARD
----------------------------------------- */

function flipCard(card){

    if(lockBoard)
        return;


    if(card === firstCard)
        return;


    if(card.classList.contains("matched"))
        return;


    card.classList.add("flipped");


    document
        .getElementById("flipSound")
        .play()
        .catch(()=>{});


    if(!firstCard){

        firstCard = card;

        return;

    }


    secondCard = card;

    checkMatch();

}


/* -----------------------------------------
   CHECK MATCH
----------------------------------------- */

function checkMatch(){

    const firstID =
        firstCard.dataset.id;

    const secondID =
        secondCard.dataset.id;


    if(firstID === secondID){

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );


        /*
           Only the actual leaf pair
           counts as the important
           discovery.

           Other pairs are just
           distractions.
        */

        if(
            firstID === "leaf" ||
            firstID === "leaf2"
        ){

            matchedPairs++;

            puzzleMessage.textContent =
                "The leaves match.";

            finishPuzzle();

        }else{

            matchedPairs++;

            puzzleMessage.textContent =
                "Matched.";

            resetTurn();

        }

    }else{

        lockBoard = true;

        puzzleMessage.textContent =
            "No match.";


        setTimeout(()=>{

            firstCard.classList.remove(
                "flipped"
            );

            secondCard.classList.remove(
                "flipped"
            );


            resetTurn();

        },700);

    }

}


/* -----------------------------------------
   RESET TURN
----------------------------------------- */

function resetTurn(){

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* -----------------------------------------
   FINISH PUZZLE
----------------------------------------- */

function finishPuzzle(){

    lockBoard = true;


    document
        .querySelectorAll(".leafCard")
        .forEach(card => {

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


/* -----------------------------------------
   CONTINUE AFTER PUZZLE
----------------------------------------- */

continuePuzzle.onclick = () => {

    puzzleOverlay.classList.add(
        "hidden"
    );


    clueOverlay.classList.remove(
        "hidden"
    );


    /*
       Save that the puzzle has been solved.

       This means it can later be connected
       to your investigation/objective system.
    */

    localStorage.setItem(
        "brokenPhone_leafPuzzleSolved",
        "true"
    );

};


/* -----------------------------------------
   CLOSE PUZZLE
----------------------------------------- */

closePuzzle.onclick = () => {

    puzzleOverlay.classList.add(
        "hidden"
    );

};


/* -----------------------------------------
   CLOSE CLUE
----------------------------------------- */

closeClue.onclick = () => {

    clueOverlay.classList.add(
        "hidden"
    );

};
```
