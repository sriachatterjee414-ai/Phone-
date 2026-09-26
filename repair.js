/* =========================================
   BROKEN PHONE
   PHONE REPAIR SYSTEM

   FLOW:

   INVESTIGATION
        ↓
   REPAIR.HTML
        ↓
   INSPECT INVENTORY
        ↓
   SELECT COMPONENT
        ↓
   CORRECT PART
        ↓
   REPAIR PROGRESS
        ↓
   ALL 3 REQUIRED PARTS
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
========================================= */


/* =========================================
   INVENTORY STORAGE
========================================= */

const INVENTORY_KEY =
    "brokenPhoneInventory";


/* =========================================
   REPAIR COMPLETE STORAGE
========================================= */

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

    precision_screwdriver: {

        name: "Precision Screwdriver",

        img: "precision_screwdriver.png",

        correct: true

    },


    replacement_battery: {

        name: "Replacement Battery",

        img: "replacement_battery.png",

        correct: true

    },


    screen_connector: {

        name: "Screen Connector",

        img: "screen_connector.png",

        correct: true

    },


    old_key: {

        name: "Old Key",

        img: "old_key.png",

        correct: false

    },


    cassette_tape: {

        name: "Cassette Tape",

        img: "cassette_tape.png",

        correct: false

    },


    paper_clip: {

        name: "Paper Clip",

        img: "paper_clip.png",

        correct: false

    }

};


/* =========================================
   ELEMENTS
========================================= */

const repair =
    document.getElementById("repair");


const phoneImage =
    document.getElementById("phoneImage");


const goodPhoneImage =
    document.getElementById("goodPhoneImage");


const inspectButton =
    document.getElementById("inspectButton");


const repairInventory =
    document.getElementById("repairInventory");


const closeInventory =
    document.getElementById("closeInventory");


const repairItems =
    document.getElementById("repairItems");


const inventoryEmpty =
    document.getElementById("inventoryEmpty");


const conditionMeter =
    document.getElementById("conditionMeter");


const conditionPercent =
    document.getElementById("conditionPercent");


const conditionText =
    document.getElementById("conditionText");


const repairMessage =
    document.getElementById("repairMessage");


const appliedParts =
    document.getElementById("appliedParts");


const toast =
    document.getElementById("toast");


const blackout =
    document.getElementById("blackout");


const completePanel =
    document.getElementById("completePanel");


const continueButton =
    document.getElementById("continueButton");


const repairSound =
    document.getElementById("repairSound");


const wrongSound =
    document.getElementById("wrongSound");


const completeSound =
    document.getElementById("completeSound");


/* =========================================
   REPAIR STATE
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
            JSON.parse(saved);

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
   SAVE REPAIR STATE
========================================= */

function saveRepairState() {

    localStorage.setItem(

        "brokenPhoneRepairUsedParts",

        JSON.stringify(
            usedParts
        )

    );

}


/* =========================================
   LOAD REPAIR STATE
========================================= */

function loadRepairState() {

    try {

        const saved =
            localStorage.getItem(
                "brokenPhoneRepairUsedParts"
            );


        if (!saved) {

            return [];

        }


        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {

            return [];

        }


        return parsed.filter(
            function(id) {

                return REQUIRED_PARTS.includes(id);

            }
        );

    }

    catch (error) {

        return [];

    }

}


/* =========================================
   CALCULATE REPAIR PROGRESS
========================================= */

function calculateCondition() {

    /*
       Three required components.

       We calculate from installed components
       instead of manually adding percentages.

       1 part  = 33%
       2 parts = 66%
       3 parts = 100%
    */

    if (usedParts.length === 0) {

        return 0;

    }


    if (usedParts.length === 1) {

        return 33;

    }


    if (usedParts.length === 2) {

        return 66;

    }


    return 100;

}


/* =========================================
   UPDATE METER
========================================= */

function updateMeter() {

    condition =
        calculateCondition();


    /*
       SAFETY LIMIT
    */

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
       CONDITION TEXT
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

function showToast(message) {

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

function playSound(sound) {

    if (!sound) {

        return;

    }


    sound.currentTime = 0;


    sound.play().catch(
        function() {}
    );

}


/* =========================================
   RENDER INVENTORY
========================================= */

function renderRepairInventory() {

    repairItems.innerHTML = "";


    const inventory =
        getInventory();


    console.log(
        "Repair inventory:",
        inventory
    );


    /*
       Only display recognized items.
    */

    const available =
        inventory.filter(
            function(id) {

                return ITEM_DATA[id];

            }
        );


    if (available.length === 0) {

        inventoryEmpty.classList.remove(
            "hidden"
        );

        return;

    }


    inventoryEmpty.classList.add(
        "hidden"
    );


    /*
       Remove duplicate IDs from
       display.
    */

    const uniqueItems =
        [...new Set(available)];


    uniqueItems.forEach(
        function(id) {

            const data =
                ITEM_DATA[id];


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "repairItem";


            /*
               Correct part already installed.
            */

            if (
                usedParts.includes(id)
            ) {

                button.classList.add(
                    "used"
                );

            }


            button.innerHTML = `

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


            button.onclick =
                function() {

                    applyItem(
                        id,
                        button
                    );

                };


            repairItems.appendChild(
                button
            );

        }
    );

}


/* =========================================
   OPEN INVENTORY
========================================= */

inspectButton.onclick =
    function() {

        renderRepairInventory();


        repairInventory.classList.remove(
            "hidden"
        );


        repairMessage.textContent =
            "Select a component to use on the phone.";

    };


/* =========================================
   CLOSE INVENTORY
========================================= */

closeInventory.onclick =
    function() {

        repairInventory.classList.add(
            "hidden"
        );

    };


/* =========================================
   APPLY ITEM
========================================= */

function applyItem(
    id,
    button
) {

    if (repairFinished) {

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
        usedParts.includes(id)
    ) {

        showToast(
            "This component has already been installed."
        );

        return;

    }


    /* =====================================
       WRONG ITEM
    ===================================== */

    if (!data.correct) {

        playSound(
            wrongSound
        );


        repairMessage.textContent =
            `${data.name} does not belong in the phone.`;


        showToast(
            "Wrong component."
        );


        return;

    }


    /* =====================================
       CORRECT ITEM
    ===================================== */

    usedParts.push(
        id
    );


    saveRepairState();


    playSound(
        repairSound
    );


    /*
       Mark button as used.
    */

    button.classList.add(
        "used"
    );


    /*
       Add installed component.
    */

    addAppliedPart(
        data.name
    );


    /*
       Update meter.
    */

    updateMeter();


    repairMessage.textContent =
        `${data.name} installed correctly.`;


    showToast(
        `${data.name} installed.`
    );


    /*
       Close inventory after
       successfully installing part.
    */

    repairInventory.classList.add(
        "hidden"
    );


    /*
       Check whether ALL THREE
       required parts are installed.
    */

    checkRepairCompletion();

}


/* =========================================
   ADD APPLIED PART
========================================= */

function addAppliedPart(
    name
) {

    /*
       Prevent duplicate visual entries.
    */

    const existing =
        [...appliedParts.children]
        .some(
            function(element) {

                return element.dataset.name === name;

            }
        );


    if (existing) {

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


    element.textContent =
        "✓ " + name;


    appliedParts.appendChild(
        element
    );

}


/* =========================================
   RESTORE INSTALLED PARTS
========================================= */

function restoreAppliedParts() {

    usedParts.forEach(
        function(id) {

            const data =
                ITEM_DATA[id];


            if (!data) {

                return;

            }


            addAppliedPart(
                data.name
            );

        }
    );

}


/* =========================================
   CHECK REPAIR COMPLETION
========================================= */

function checkRepairCompletion() {

    /*
       The phone is repaired ONLY when
       all three required components
       have been installed.
    */

    const allPartsInstalled =
        REQUIRED_PARTS.every(
            function(part) {

                return usedParts.includes(
                    part
                );

            }
        );


    if (!allPartsInstalled) {

        return;

    }


    completeRepair();

}


/* =========================================
   COMPLETE REPAIR
========================================= */

function completeRepair() {

    if (repairFinished) {

        return;

    }


    repairFinished = true;


    /*
       THREE PARTS = 100%
    */

    condition = 100;


    updateMeter();


    /*
       SAVE COMPLETION
    */

    localStorage.setItem(
        REPAIR_COMPLETE_KEY,
        "true"
    );


    /*
       Disable inspect button.
    */

    inspectButton.disabled =
        true;


    inspectButton.classList.add(
        "hidden"
    );


    /*
       Close inventory.
    */

    repairInventory.classList.add(
        "hidden"
    );


    /*
       Update message.
    */

    repairMessage.textContent =
        "DEVICE RESTORED. SYSTEM REBOOTING...";


    /*
       Start blackout.
    */

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


    /*
       Reveal good phone.
    */

    setTimeout(
        function() {

            repair.classList.add(
                "restored"
            );

        },
        1500
    );


    /*
       Show completion panel.
    */

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
   BACK BUTTON
========================================= */

document
    .getElementById("backButton")
    .onclick =
    function() {

        window.location.href =
            "investigation.html";

    };


/* =========================================
   ACCESS PHONE
========================================= */

continueButton.onclick =
    function() {

        window.location.href =
            "phone.html";

    };


/* =========================================
   RESTORE COMPLETED REPAIR
========================================= */

function restoreCompletedRepair() {

    const completed =
        localStorage.getItem(
            REPAIR_COMPLETE_KEY
        ) === "true";


    if (!completed) {

        return;

    }


    repairFinished = true;


    condition = 100;


    /*
       Show repaired phone.
    */

    repair.classList.add(
        "restored"
    );


    /*
       Hide inspect.
    */

    inspectButton.classList.add(
        "hidden"
    );


    /*
       Restore meter.
    */

    conditionMeter.style.width =
        "100%";


    conditionPercent.textContent =
        "100%";


    conditionText.textContent =
        "DEVICE RESTORED";


    repairMessage.textContent =
        "DEVICE RESTORED.";


    /*
       Show completion panel.
    */

    completePanel.classList.remove(
        "hidden"
    );

}


/* =========================================
   INITIALIZE
========================================= */

usedParts =
    loadRepairState();


restoreAppliedParts();


updateMeter();


restoreCompletedRepair();
