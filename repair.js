/* =========================================
   BROKEN PHONE
   PHONE REPAIR SYSTEM

   FLOW:

   INVESTIGATION
        ↓
   REPAIR.HTML
        ↓
   BROKEN PHONE
        ↓
   INSPECT INVENTORY
        ↓
   DRAG COMPONENT
        ↓
   DROP ON PHONE
        ↓
   CORRECT = +33%
   WRONG   = -15%
        ↓
   ALL 3 CORRECT PARTS
        ↓
   100%
        ↓
   BLACKOUT
        ↓
   GOOD PHONE
        ↓
   ACCESS PHONE
        ↓
   PHONE.HTML


   IMPORTANT:

   The fact that the phone was repaired before
   is remembered.

   However, every new visit to this page starts
   a fresh repair attempt.

   Therefore:

   PREVIOUSLY REPAIRED
        ↓
   REPAIR AGAIN
        OR
   SKIP REPAIR
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const INVENTORY_KEY =
    "brokenPhoneInventory";


const REPAIR_COMPLETE_KEY =
    "brokenPhoneRepairComplete";


/* =========================================
   REQUIRED REPAIR COMPONENTS
========================================= */

const REQUIRED_PARTS = [

    "precision_screwdriver",

    "replacement_battery",

    "screen_connector"

];


/* =========================================
   ITEM DATABASE
========================================= */

const ITEM_DATA = {


    /* =====================================
       CORRECT ITEMS
    ===================================== */

    precision_screwdriver: {

        name:
            "Precision Screwdriver",

        img:
            "precision_screwdriver.png",

        correct:
            true

    },


    replacement_battery: {

        name:
            "Replacement Battery",

        img:
            "replacement_battery.png",

        correct:
            true

    },


    screen_connector: {

        name:
            "Screen Connector",

        img:
            "screen_connector.png",

        correct:
            true

    },


    /* =====================================
       WRONG ITEMS
    ===================================== */

    old_key: {

        name:
            "Old Key",

        img:
            "old_key.png",

        correct:
            false

    },


    cassette_tape: {

        name:
            "Cassette Tape",

        img:
            "cassette_tape.png",

        correct:
            false

    },


    paper_clip: {

        name:
            "Paper Clip",

        img:
            "paper_clip.png",

        correct:
            false

    }

};


/* =========================================
   ELEMENTS
========================================= */

const repair =
    document.getElementById(
        "repair"
    );


const phoneDropZone =
    document.getElementById(
        "phoneDropZone"
    );


const phoneImage =
    document.getElementById(
        "phoneImage"
    );


const goodPhoneImage =
    document.getElementById(
        "goodPhoneImage"
    );


const inspectButton =
    document.getElementById(
        "inspectButton"
    );


const skipRepairButton =
    document.getElementById(
        "skipRepairButton"
    );


const repairInventory =
    document.getElementById(
        "repairInventory"
    );


const closeInventory =
    document.getElementById(
        "closeInventory"
    );


const repairItems =
    document.getElementById(
        "repairItems"
    );


const inventoryEmpty =
    document.getElementById(
        "inventoryEmpty"
    );


const conditionMeter =
    document.getElementById(
        "conditionMeter"
    );


const conditionPercent =
    document.getElementById(
        "conditionPercent"
    );


const conditionText =
    document.getElementById(
        "conditionText"
    );


const repairMessage =
    document.getElementById(
        "repairMessage"
    );


const appliedParts =
    document.getElementById(
        "appliedParts"
    );


const toast =
    document.getElementById(
        "toast"
    );


const blackout =
    document.getElementById(
        "blackout"
    );


const completePanel =
    document.getElementById(
        "completePanel"
    );


const continueButton =
    document.getElementById(
        "continueButton"
    );


const repairSound =
    document.getElementById(
        "repairSound"
    );


const wrongSound =
    document.getElementById(
        "wrongSound"
    );


const completeSound =
    document.getElementById(
        "completeSound"
    );


/* =========================================
   REPAIR STATE

   These reset every time repair.html opens.
========================================= */

let condition = 0;

let usedParts = [];

let repairFinished = false;


/* =========================================
   GET INVENTORY
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
            JSON.parse(
                saved
            );


        if (!Array.isArray(parsed)) {

            return [];

        }


        return parsed;

    }

    catch (error) {

        console.error(
            "Could not read inventory:",
            error
        );

        return [];

    }

}


/* =========================================
   SAVE PREVIOUS REPAIR

   This does NOT save the individual parts.

   It only remembers that the phone has
   successfully been repaired at least once.
========================================= */

function saveRepairCompletion() {

    localStorage.setItem(

        REPAIR_COMPLETE_KEY,

        "true"

    );

}


/* =========================================
   WAS PHONE REPAIRED BEFORE?
========================================= */

function wasPhoneRepairedBefore() {

    return (

        localStorage.getItem(
            REPAIR_COMPLETE_KEY
        ) === "true"

    );

}


/* =========================================
   UPDATE METER
========================================= */

function updateMeter() {


    condition =
        Math.max(
            0,
            Math.min(
                100,
                condition
            )
        );


    conditionMeter.style.width =
        condition + "%";


    conditionPercent.textContent =
        condition + "%";


    /* =====================================
       STATUS TEXT
    ===================================== */

    if (condition === 0) {

        conditionText.textContent =
            "PHONE DAMAGED";

    }

    else if (condition < 34) {

        conditionText.textContent =
            "CRITICAL DAMAGE";

    }

    else if (condition < 67) {

        conditionText.textContent =
            "PARTIALLY REPAIRED";

    }

    else if (condition < 100) {

        conditionText.textContent =
            "REPAIR IN PROGRESS";

    }

    else {

        conditionText.textContent =
            "DEVICE RESTORED";

    }

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


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            1700
        );

}


/* =========================================
   PLAY SOUND
========================================= */

function playSound(
    sound
) {


    if (!sound) {

        return;

    }


    sound.currentTime =
        0;


    sound.play().catch(
        function() {

            /*
               Browser may block audio until
               the player has interacted with
               the page.

               Nothing needs to happen here.
            */

        }
    );

}


/* =========================================
   PHONE FLASH
========================================= */

function phoneFlash() {


    phoneDropZone.classList.remove(
        "flash"
    );


    /*
       Force browser to restart animation.
    */

    void phoneDropZone.offsetWidth;


    phoneDropZone.classList.add(
        "flash"
    );

}


/* =========================================
   RENDER INVENTORY
========================================= */

function renderRepairInventory() {


    repairItems.innerHTML =
        "";


    const inventory =
        getInventory();


    console.log(
        "Repair inventory:",
        inventory
    );


    const available =
        inventory.filter(
            function(id) {

                return ITEM_DATA[id];

            }
        );


    /* =====================================
       NO ITEMS
    ===================================== */

    if (
        available.length === 0
    ) {

        inventoryEmpty.classList.remove(
            "hidden"
        );

        return;

    }


    inventoryEmpty.classList.add(
        "hidden"
    );


    /*
       Remove duplicate inventory IDs.
    */

    const uniqueItems =
        [
            ...new Set(
                available
            )
        ];


    uniqueItems.forEach(
        function(id) {


            const data =
                ITEM_DATA[id];


            /* =================================
               CREATE ITEM
            ================================= */

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "repairItem";


            item.draggable =
                true;


            item.dataset.itemId =
                id;


            /* =================================
               USED STATE
            ================================= */

            if (
                usedParts.includes(
                    id
                )
            ) {

                item.classList.add(
                    "used"
                );

            }


            /* =================================
               HTML
            ================================= */

            item.innerHTML = `

                <img
                    src="${data.img}"
                    alt="${data.name}"
                    onerror="
                        this.style.display='none';
                    "
                >

                <span class="repairItemName">
                    ${data.name}
                </span>

            `;


            /* =================================
               DRAG START
            ================================= */

            item.addEventListener(
                "dragstart",
                function(event) {


                    if (
                        usedParts.includes(
                            id
                        )
                    ) {

                        event.preventDefault();

                        return;

                    }


                    event.dataTransfer.setData(
                        "text/plain",
                        id
                    );


                    event.dataTransfer.effectAllowed =
                        "move";


                    item.classList.add(
                        "dragging"
                    );

                }
            );


            /* =================================
               DRAG END
            ================================= */

            item.addEventListener(
                "dragend",
                function() {

                    item.classList.remove(
                        "dragging"
                    );

                }
            );


            repairItems.appendChild(
                item
            );

        }
    );

}


/* =========================================
   OPEN INVENTORY
========================================= */

inspectButton.addEventListener(
    "click",
    function() {


        if (
            repairFinished
        ) {

            return;

        }


        renderRepairInventory();


        repairInventory.classList.remove(
            "hidden"
        );


        repairMessage.textContent =
            "Drag a component onto the phone.";

    }
);


/* =========================================
   CLOSE INVENTORY
========================================= */

closeInventory.addEventListener(
    "click",
    function() {

        repairInventory.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   DRAG OVER PHONE
========================================= */

phoneDropZone.addEventListener(
    "dragover",
    function(event) {


        event.preventDefault();


        if (
            repairFinished
        ) {

            return;

        }


        event.dataTransfer.dropEffect =
            "move";


        phoneDropZone.classList.add(
            "dragTarget"
        );

    }
);


/* =========================================
   DRAG LEAVE PHONE
========================================= */

phoneDropZone.addEventListener(
    "dragleave",
    function(event) {


        /*
           Prevent flickering when moving
           between children of the drop zone.
        */

        if (
            event.relatedTarget &&
            phoneDropZone.contains(
                event.relatedTarget
            )
        ) {

            return;

        }


        phoneDropZone.classList.remove(
            "dragTarget"
        );

    }
);


/* =========================================
   DROP ON PHONE
========================================= */

phoneDropZone.addEventListener(
    "drop",
    function(event) {


        event.preventDefault();


        phoneDropZone.classList.remove(
            "dragTarget"
        );


        if (
            repairFinished
        ) {

            return;

        }


        const id =
            event.dataTransfer.getData(
                "text/plain"
            );


        if (!id) {

            return;

        }


        applyDraggedItem(
            id
        );

    }
);


/* =========================================
   APPLY DRAGGED ITEM
========================================= */

function applyDraggedItem(
    id
) {


    if (
        repairFinished
    ) {

        return;

    }


    const data =
        ITEM_DATA[id];


    if (!data) {

        return;

    }


    /* =====================================
       ALREADY USED
    ===================================== */

    if (
        usedParts.includes(
            id
        )
    ) {

        showToast(
            "This component has already been used."
        );

        return;

    }


    /* =====================================
       CONSUME COMPONENT
    ===================================== */

    usedParts.push(
        id
    );


    phoneFlash();


    /* =====================================
       CORRECT COMPONENT
    ===================================== */

    if (
        data.correct
    ) {


        condition += 33;


        condition =
            Math.min(
                condition,
                100
            );


        playSound(
            repairSound
        );


        addAppliedPart(
            data.name,
            true
        );


        repairMessage.textContent =
            `${data.name} installed correctly.`;


        showToast(
            "+33% — CORRECT COMPONENT"
        );

    }


    /* =====================================
       WRONG COMPONENT
    ===================================== */

    else {


        condition -= 15;


        condition =
            Math.max(
                condition,
                0
            );


        playSound(
            wrongSound
        );


        addAppliedPart(
            data.name,
            false
        );


        repairMessage.textContent =
            `${data.name} does not belong in the phone.`;


        showToast(
            "-15% — WRONG COMPONENT"
        );

    }


    /* =====================================
       UPDATE
    ===================================== */

    updateMeter();


    renderRepairInventory();


    /* =====================================
       CLOSE INVENTORY
    ===================================== */

    repairInventory.classList.add(
        "hidden"
    );


    /* =====================================
       CHECK COMPLETION
    ===================================== */

    checkRepairCompletion();

}


/* =========================================
   ADD APPLIED PART
========================================= */

function addAppliedPart(
    name,
    correct
) {


    const existing =
        [
            ...appliedParts.children
        ].some(
            function(element) {

                return (
                    element.dataset.name ===
                    name
                );

            }
        );


    if (
        existing
    ) {

        return;

    }


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "appliedPart";


    element.dataset.name =
        name;


    /* =====================================
       CORRECT
    ===================================== */

    if (
        correct
    ) {

        element.classList.add(
            "correctPart"
        );


        element.textContent =
            "✓ " + name;

    }


    /* =====================================
       WRONG
    ===================================== */

    else {

        element.classList.add(
            "wrongPart"
        );


        element.textContent =
            "✕ " + name;

    }


    appliedParts.appendChild(
        element
    );

}


/* =========================================
   CHECK COMPLETION
========================================= */

function checkRepairCompletion() {


    /*
       Completion is based ONLY on whether
       all three required correct components
       have been installed.

       Wrong components do not prevent
       completion.
    */

    const allPartsInstalled =
        REQUIRED_PARTS.every(
            function(part) {

                return usedParts.includes(
                    part
                );

            }
        );


    if (
        !allPartsInstalled
    ) {

        return;

    }


    /*
       Safety check:
       all three correct components
       should bring the meter to 100%.
    */

    condition =
        100;


    updateMeter();


    completeRepair();

}


/* =========================================
   COMPLETE REPAIR
========================================= */

function completeRepair() {


    if (
        repairFinished
    ) {

        return;

    }


    repairFinished =
        true;


    condition =
        100;


    updateMeter();


    /* =====================================
       REMEMBER SUCCESS
    ===================================== */

    saveRepairCompletion();


    /* =====================================
       DISABLE INTERACTION
    ===================================== */

    inspectButton.disabled =
        true;


    inspectButton.classList.add(
        "hidden"
    );


    skipRepairButton.classList.add(
        "hidden"
    );


    repairInventory.classList.add(
        "hidden"
    );


    /* =====================================
       MESSAGE
    ===================================== */

    repairMessage.textContent =
        "DEVICE RESTORED. SYSTEM REBOOTING...";


    /* =====================================
       WAIT
    ===================================== */

    setTimeout(
        function() {

            startBlackout();

        },
        800
    );

}


/* =========================================
   BLACKOUT / REVEAL
========================================= */

function startBlackout() {


    playSound(
        completeSound
    );


    blackout.classList.remove(
        "hidden"
    );


    /* =====================================
       REVEAL GOOD PHONE
    ===================================== */

    setTimeout(
        function() {

            repair.classList.add(
                "restored"
            );

        },
        1500
    );


    /* =====================================
       SHOW COMPLETE PANEL
    ===================================== */

    setTimeout(
        function() {


            blackout.classList.add(
                "hidden"
            );


            completePanel.classList.remove(
                "hidden"
            );


        },
        3000
    );

}


/* =========================================
   SKIP REPAIR
========================================= */

skipRepairButton.addEventListener(
    "click",
    function() {


        /*
           Only allow skip if the phone
           has genuinely been repaired before.
        */

        if (
            !wasPhoneRepairedBefore()
        ) {

            return;

        }


        window.location.href =
            "phone.html";

    }
);


/* =========================================
   BACK BUTTON
========================================= */

const backButton =
    document.getElementById(
        "backButton"
    );


if (
    backButton
) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "investigation.html";

        }
    );

}


/* =========================================
   ACCESS PHONE
========================================= */

if (
    continueButton
) {

    continueButton.addEventListener(
        "click",
        function() {


            const completed =
                wasPhoneRepairedBefore();


            if (
                !completed
            ) {

                return;

            }


            window.location.href =
                "phone.html";

        }
    );

}


/* =========================================
   PREVIOUSLY REPAIRED PHONE
========================================= */

function setupPreviousRepairState() {


    if (
        !wasPhoneRepairedBefore()
    ) {

        /*
           First repair attempt.
        */

        return;

    }


    /*
       IMPORTANT:

       Do NOT show good phone.

       The player sees the broken phone
       again and may repair it again.
    */

    skipRepairButton.classList.remove(
        "hidden"
    );


    repairMessage.textContent =
        "PHONE PREVIOUSLY RESTORED. REPAIR AGAIN OR SKIP.";


    showToast(
        "Previous repair detected."
    );

}


/* =========================================
   RESET VISUAL REPAIR STATE
========================================= */

function resetCurrentRepairAttempt() {


    repair.classList.remove(
        "restored"
    );


    completePanel.classList.add(
        "hidden"
    );


    blackout.classList.add(
        "hidden"
    );


    condition =
        0;


    usedParts =
        [];


    repairFinished =
        false;


    appliedParts.innerHTML =
        "";


    conditionMeter.style.width =
        "0%";


    conditionPercent.textContent =
        "0%";


    conditionText.textContent =
        "PHONE DAMAGED";


    inspectButton.disabled =
        false;


    inspectButton.classList.remove(
        "hidden"
    );


    updateMeter();

}


/* =========================================
   INITIALIZE
========================================= */

resetCurrentRepairAttempt();


setupPreviousRepairState();
