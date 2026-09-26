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

        description:
            "A small precision screwdriver. Useful for removing the tiny screws holding the phone together.",

        required:true

    },


    replacement_battery:{

        name:"Replacement Battery",

        img:"replacement_battery.png",

        description:
            "A replacement battery compatible with the damaged phone.",

        required:true

    },


    screen_connector:{

        name:"Screen Connector",

        img:"screen_connector.png",

        description:
            "A replacement connector for the damaged screen assembly.",

        required:true

    },


    old_key:{

        name:"Old Key",

        img:"old_key.png",

        description:
            "An old key. It doesn't appear to have anything to do with the phone.",

        required:false

    },


    cassette_tape:{

        name:"Cassette Tape",

        img:"cassette_tape.png",

        description:
            "An old cassette tape. There is handwriting on the label.",

        required:false

    },


    paper_clip:{

        name:"Paper Clip",

        img:"paper_clip.png",

        description:
            "A simple paper clip. It could be useful, but probably not for repairing the phone.",

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
   INSPECTION ELEMENTS
========================================= */

const inspectOverlay =
    document.getElementById(
        "inspectOverlay"
    );


const inspectImage =
    document.getElementById(
        "inspectImage"
    );


const inspectName =
    document.getElementById(
        "inspectName"
    );


const inspectDescription =
    document.getElementById(
        "inspectDescription"
    );


const closeInspect =
    document.getElementById(
        "closeInspect"
    );


const closeInspectButton =
    document.getElementById(
        "closeInspectButton"
    );


const useForRepair =
    document.getElementById(
        "useForRepair"
    );


let inspectedItem = null;


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
                    alt="${ITEM_DATA[id].name}"
                >

                <span>
                    ${ITEM_DATA[id].name}
                </span>

            `;


            slot.addEventListener(
                "click",
                ()=>{
                    openInspect(id);
                }
            );

        }

        else{

            slot.classList.add(
                "empty"
            );

        }


        slots.appendChild(
            slot
        );

    }


    const found =
        REQUIRED.filter(
            id =>
                inventory.includes(id)
        ).length;


    status.textContent =
        `Repair parts found: ${found}/${REQUIRED.length}`;

}


/* =========================================
   OPEN INSPECT
========================================= */

function openInspect(id){

    const data =
        ITEM_DATA[id];


    if(!data)
        return;


    inspectedItem =
        id;


    inspectImage.src =
        data.img;


    inspectName.textContent =
        data.name;


    inspectDescription.textContent =
        data.description;


    inspectOverlay.classList.remove(
        "hidden"
    );


    play(clickSound);

}


/* =========================================
   CLOSE INSPECT
========================================= */

function closeInspection(){

    inspectOverlay.classList.add(
        "hidden"
    );


    inspectedItem =
        null;

}


closeInspect.addEventListener(
    "click",
    closeInspection
);


closeInspectButton.addEventListener(
    "click",
    closeInspection
);


/* =========================================
   USE FOR REPAIR
========================================= */

useForRepair.addEventListener(
    "click",
    ()=>{

        if(!inspectedItem)
            return;


        /*
           Remember which item
           the player inspected.
        */

        localStorage.setItem(
            "brokenPhoneRepairSelectedItem",
            inspectedItem
        );


        window.location.href =
            "repair.html";

    }
);


/* =========================================
   SOUND
========================================= */

function play(sound){

    if(!sound)
        return;


    sound.currentTime =
        0;


    sound.volume =
        .45;


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

        startSearch.disabled =
            true;


        intro.classList.add(
            "hand-leaving"
        );


        setTimeout(
            ()=>{

                intro.classList.add(
                    "leaving"
                );

            },
            150
        );


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
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            !inspectOverlay.classList.contains("hidden")
        ){

            closeInspection();

        }

    }
);


/* =========================================
   RESTORE
========================================= */

window.addEventListener(
    "pageshow",
    ()=>{

        renderInventory();

    }
);
