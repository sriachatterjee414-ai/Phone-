/* =========================================
   BROKEN PHONE
   INVESTIGATION
========================================= */


/* =========================================
   INVENTORY
========================================= */

const INVENTORY_KEY =
    "brokenPhoneInventory";


/* =========================================
   REQUIRED REPAIR PARTS
========================================= */

const REQUIRED = [

    "precision_screwdriver",

    "replacement_battery",

    "screen_connector"

];


/* =========================================
   ITEM DATA
========================================= */

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


const deleteItem =
    document.getElementById(
        "deleteItem"
    );


/* =========================================
   CURRENTLY INSPECTED ITEM
========================================= */

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

    catch(error){

        return [];

    }

}


/* =========================================
   SAVE INVENTORY
========================================= */

function saveInventory(inventory){

    localStorage.setItem(

        INVENTORY_KEY,

        JSON.stringify(inventory)

    );

}


/* =========================================
   RENDER INVENTORY
========================================= */

function renderInventory(){

    slots.innerHTML = "";


    const inventory =
        getInventory();


    /*
       Always create 8 inventory slots.
    */

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


        /*
           ITEM EXISTS
        */

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


            /*
               Click item → inspect.
            */

            slot.addEventListener(

                "click",

                ()=>{

                    openInspect(id);

                }

            );

        }


        /*
           EMPTY SLOT
        */

        else{

            slot.classList.add(
                "empty"
            );

        }


        slots.appendChild(
            slot
        );

    }


    /*
       Count required parts.
    */

    const found =
        REQUIRED.filter(

            id =>
                inventory.includes(id)

        ).length;


    status.textContent =

        `Repair parts found: ${found}/${REQUIRED.length}`;

}


/* =========================================
   OPEN INSPECTION
========================================= */

function openInspect(id){

    const data =
        ITEM_DATA[id];


    if(!data)
        return;


    /*
       Remember item.
    */

    inspectedItem =
        id;


    /*
       Fill inspection window.
    */

    inspectImage.src =
        data.img;


    inspectImage.alt =
        data.name;


    inspectName.textContent =
        data.name;


    inspectDescription.textContent =
        data.description;


    /*
       Required repair parts:
       ENABLE USE FOR REPAIR.
    */

    if(data.required){

        useForRepair.disabled =
            false;


        useForRepair.textContent =
            "USE FOR REPAIR";

    }


    /*
       Unneeded items:
       DISABLE USE FOR REPAIR.
    */

    else{

        useForRepair.disabled =
            true;


        useForRepair.textContent =
            "NOT NEEDED";

    }


    /*
       Open overlay.
    */

    inspectOverlay.classList.remove(
        "hidden"
    );


    play(clickSound);

}


/* =========================================
   CLOSE INSPECTION
========================================= */

function closeInspection(){

    inspectOverlay.classList.add(
        "hidden"
    );


    inspectedItem =
        null;

}


/* =========================================
   CLOSE BUTTON
========================================= */

closeInspect.addEventListener(

    "click",

    ()=>{

        closeInspection();

    }

);


/* =========================================
   CLOSE BUTTON 2
========================================= */

closeInspectButton.addEventListener(

    "click",

    ()=>{

        closeInspection();

    }

);


/* =========================================
   DELETE ITEM
========================================= */

deleteItem.addEventListener(

    "click",

    ()=>{

        /*
           Nothing selected.
        */

        if(!inspectedItem)
            return;


        const data =
            ITEM_DATA[inspectedItem];


        const inventory =
            getInventory();


        /*
           Find item.
        */

        const index =
            inventory.indexOf(
                inspectedItem
            );


        /*
           Item isn't in inventory.
        */

        if(index === -1){

            closeInspection();

            renderInventory();

            return;

        }


        /*
           Remove item.
        */

        inventory.splice(

            index,

            1

        );


        /*
           Save updated inventory.
        */

        saveInventory(
            inventory
        );


        /*
           Close inspection.
        */

        closeInspection();


        /*
           Immediately update screen.
        */

        renderInventory();


        play(clickSound);


        showToast(

            `${data.name} removed from inventory.`

        );

    }

);


/* =========================================
   USE FOR REPAIR
========================================= */

useForRepair.addEventListener(

    "click",

    ()=>{

        /*
           Nothing selected.
        */

        if(!inspectedItem)
            return;


        const data =
            ITEM_DATA[inspectedItem];


        /*
           Only required parts
           can be used.
        */

        if(

            !data ||

            !data.required

        ){

            showToast(
                "This item is not needed for the repair."
            );

            return;

        }


        /*
           Remember selected item.
        */

        localStorage.setItem(

            "brokenPhoneRepairSelectedItem",

            inspectedItem

        );


        /*
           Go to repair screen.
        */

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

        /*
           Prevent double clicking.
        */

        startSearch.disabled =
            true;


        /*
           Hand leaves.
        */

        intro.classList.add(
            "hand-leaving"
        );


        /*
           Begin intro fade.
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
           Reveal search screen.
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

                    play(
                        clickSound
                    );


                    /*
                       Tell location pages
                       where to return.
                    */

                    localStorage.setItem(

                        "brokenPhoneReturnPage",

                        "investigation.html"

                    );


                    /*
                       Open location.
                    */

                    window.location.href =
                        button.dataset.page;

                }

            );

        }

    );


/* =========================================
   DONE BUTTON
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


            /*
               Find missing repair parts.
            */

            const missing =
                REQUIRED.filter(

                    id =>
                        !inventory.includes(id)

                );


            /*
               Still missing parts.
            */

            if(missing.length){

                showToast(

                    `You still need ${missing.length} repair part${missing.length > 1 ? "s" : ""}.`

                );

                return;

            }


            /*
               All parts collected.
               Go to repair.
            */

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

            !inspectOverlay.classList.contains(
                "hidden"
            )

        ){

            closeInspection();

        }

    }

);


/* =========================================
   RESTORE INVENTORY
========================================= */

window.addEventListener(

    "pageshow",

    ()=>{

        renderInventory();

    }

);
