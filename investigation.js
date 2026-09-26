/* =========================================
   BROKEN PHONE
   INVESTIGATION
========================================= */


/* =========================================
   INVENTORY
========================================= */

const INVENTORY_KEY =
    "brokenPhoneInventory";


const REQUIRED = [
    "precision_screwdriver",
    "replacement_battery",
    "screen_connector"
];


const ITEM_DATA = {

    precision_screwdriver:{
        name:"Precision Screwdriver",
        img:"precision_screwdriver.png",
        required:true
    },

    replacement_battery:{
        name:"Replacement Battery",
        img:"replacement_battery.png",
        required:true
    },

    screen_connector:{
        name:"Screen Connector",
        img:"screen_connector.png",
        required:true
    },

    old_key:{
        name:"Old Key",
        img:"old_key.png",
        required:false
    },

    cassette_tape:{
        name:"Cassette Tape",
        img:"cassette_tape.png",
        required:false
    },

    paper_clip:{
        name:"Paper Clip",
        img:"paper_clip.png",
        required:false
    }

};


/* =========================================
   ELEMENTS
========================================= */

const intro =
    document.getElementById(
        "handIntro"
    );


const searchScreen =
    document.getElementById(
        "searchScreen"
    );


const startSearch =
    document.getElementById(
        "startSearch"
    );


const slots =
    document.getElementById(
        "inventorySlots"
    );


const status =
    document.getElementById(
        "statusMessage"
    );


const toast =
    document.getElementById(
        "toast"
    );


const bgMusic =
    document.getElementById(
        "bgMusic"
    );


const clickSound =
    document.getElementById(
        "clickSound"
    );


/* =========================================
   INVENTORY
========================================= */

function getInventory(){

    try{

        return JSON.parse(
            localStorage.getItem(
                INVENTORY_KEY
            )
        ) || [];

    }

    catch(e){

        return [];

    }

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


        const id =
            inventory[i];


        if(
            id &&
            ITEM_DATA[id]
        ){

            slot.innerHTML = `

                <img
                    src="${ITEM_DATA[id].img}"
                    alt=""
                >

                <span>
                    ${ITEM_DATA[id].name}
                </span>

            `;

        }


        slots.appendChild(slot);

    }


    const found =
        REQUIRED.filter(
            id => inventory.includes(id)
        ).length;


    status.textContent =
        `Repair parts found: ${found}/${REQUIRED.length}`;

}


/* =========================================
   SOUND
========================================= */

function play(sound){

    if(!sound)
        return;


    sound.currentTime = 0;

    sound.volume = .45;


    sound.play().catch(
        ()=>{}
    );

}


/* =========================================
   TOAST
========================================= */

function showToast(text){

    toast.textContent =
        text;


    toast.classList.add(
        "show"
    );


    setTimeout(
        ()=>{
            toast.classList.remove(
                "show"
            );
        },
        1800
    );

}


/* =========================================
   START SEARCH
========================================= */

startSearch.addEventListener(
    "click",
    ()=>{

        /*
           Stop the player from
           clicking START twice.
        */

        startSearch.disabled = true;


        /*
           Hand starts moving
           downward.
        */

        intro.classList.add(
            "hand-leaving"
        );


        /*
           Fade the intro away
           while the hand leaves.
        */

        setTimeout(
            ()=>{

                intro.classList.add(
                    "leaving"
                );

            },
            150
        );


        /*
           After the hand has
           disappeared, reveal
           the room options.
        */

        setTimeout(
            ()=>{

                intro.classList.add(
                    "hidden"
                );


                searchScreen.classList.remove(
                    "hidden"
                );


                searchScreen.classList.add(
                    "show-search"
                );


                play(bgMusic);

                renderInventory();

            },
            1000
        );

    }
);


/* =========================================
   LOCATION BUTTONS
========================================= */

document
    .querySelectorAll(
        ".location-choice"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                ()=>{

                    play(clickSound);


                    /*
                       Tell the other pages
                       where to return.
                    */

                    localStorage.setItem(
                        "brokenPhoneReturnPage",
                        "investigation.html"
                    );


                    window.location.href =
                        button.dataset.page;

                }
            );

        }
    );


/* =========================================
   DONE
========================================= */

document
    .getElementById(
        "doneButton"
    )
    .addEventListener(
        "click",
        ()=>{

            const inventory =
                getInventory();


            const missing =
                REQUIRED.filter(
                    id =>
                        !inventory.includes(id)
                );


            if(missing.length){

                showToast(
                    `You still need ${missing.length} repair part${missing.length > 1 ? "s" : ""}.`
                );

                return;

            }


            window.location.href =
                "repair.html";

        }
    );


/* =========================================
   RESTORE INVENTORY WHEN RETURNING
========================================= */

window.addEventListener(
    "pageshow",
    ()=>{
        renderInventory();
    }
);
