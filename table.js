```javascript
/* =========================================
   BROKEN PHONE
   WORK TABLE
   INVENTORY + FLIP/MATCH MINI-GAME
========================================= */


/* =========================================
   INVENTORY
========================================= */

const KEY = "brokenPhoneInventory";


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


function inv(){

    try{

        return JSON.parse(
            localStorage.getItem(KEY)
        ) || [];

    }

    catch(e){

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


    for(let i=0;i<8;i++){

        const s =
            document.createElement("div");


        s.className =
            "inventory-slot";


        if(
            a[i] &&
            DATA[a[i]]
        ){

            s.innerHTML = `

                <img
                    src="${DATA[a[i]].img}"
                    alt=""
                >

                <span>
                    ${DATA[a[i]].name}
                </span>

            `;

        }


        slots.appendChild(s);

    }

}


/* =========================================
   TOAST
========================================= */

function showToast(message){

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

    },1600);

}


/* =========================================
   COLLECT
========================================= */

function collect(id,el){

    let a = inv();


    if(a.includes(id)){

        showToast(
            "Already collected."
        );

        return;

    }


    if(a.length >= 8){

        showToast(
            "Inventory full."
        );

        return;

    }


    a.push(id);

    save(a);


    el.classList.add(
        "hidden"
    );


    render();


    document
        .getElementById(
            "collectSound"
        )
        .play()
        .catch(()=>{});


    showToast(
        `${DATA[id].name} added to inventory.`
    );

}


/* =========================================
   BACK
========================================= */

document
    .getElementById("backButton")
    .onclick = () => {

        location.href =
            "investigation.html";

    };


/* =========================================
   COLLECTIBLE EVENTS
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

const music =
    document.getElementById(
        "music"
    );


music.volume = .18;

music.play().catch(()=>{});


/* =========================================
   RESTORE INVENTORY
========================================= */

render();


inv().forEach(id => {

    const element =
        document.querySelector(
            `[data-item="${id}"]`
        );


    if(element){

        element.classList.add(
            "hidden"
        );

    }

});


/* =====================================================
   FLIP & MATCH MINI-GAME
===================================================== */


/* =========================================
   ELEMENTS
========================================= */

const puzzleTrigger =
    document.getElementById(
        "leafPuzzleTrigger"
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


/* =========================================
   PUZZLE STATE
========================================= */

let firstCard = null;

let secondCard = null;

let lockBoard = false;


/* =========================================
   PUZZLE IMAGE
========================================= */

/*
   PUT YOUR LEAF PNG IN THIS FOLDER:

       leaf.png

   Later we can replace this with
   the actual leaf from your story.
*/

const LEAF_IMAGE =
    "leaf.png";


/* =========================================
   OPEN PUZZLE
========================================= */

puzzleTrigger.onclick = () => {

    openPuzzle();

};


/* =========================================
   CREATE PUZZLE
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

       The important pair is LEAF.

       The remaining pairs are decoys.
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
            id:"leafSmall",
            image:"leaf.png"
        },

        {
            id:"leafSmall",
            image:"leaf.png"
        }

    ];


    shuffle(cards);


    cards.forEach(card => {

        createCard(card);

    });

}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array){

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

}


/* =========================================
   CREATE CARD
========================================= */

function createCard(card){

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

        flipCard(element);

    };


    leafGrid.appendChild(
        element
    );

}


/* =========================================
   FLIP
========================================= */

function flipCard(card){

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
        .catch(()=>{});


    if(!firstCard){

        firstCard = card;

        return;

    }


    secondCard = card;


    checkMatch();

}


/* =========================================
   MATCH
========================================= */

function checkMatch(){

    const first =
        firstCard.dataset.id;


    const second =
        secondCard.dataset.id;


    if(first === second){

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );


        /*
           The player has found the
           matching leaf.

           We don't require them to
           match every decoy pair.
        */

        if(
            first === "leaf" ||
            first === "leafSmall"
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


    /* WRONG MATCH */

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


/* =========================================
   RESET TURN
========================================= */

function resetTurn(){

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* =========================================
   FINISH
========================================= */

function finishPuzzle(){

    lockBoard = true;


    document
        .querySelectorAll(
            ".leafCard"
        )
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


    /*
       Save completion.

       We can later connect this
       directly to the investigation
       objective system.
    */

    localStorage.setItem(
        "brokenPhone_leafPuzzleSolved",
        "true"
    );

}


/* =========================================
   CONTINUE
========================================= */

continuePuzzle.onclick = () => {

    puzzleOverlay.classList.add(
        "hidden"
    );


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
```
