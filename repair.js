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
SELECT ITEM
↓
APPLY ITEM
↓
CORRECT = +25%
WRONG   = -10%
↓
100%
↓
BLACKOUT
↓
GOOD PHONE
========================================= */

/* =========================================
INVENTORY
========================================= */

const INVENTORY_KEY =
"brokenPhoneInventory";

/* =========================================
REPAIR SAVE
========================================= */

const REPAIR_COMPLETE_KEY =
"brokenPhoneRepairComplete";

/* =========================================
ITEMS
========================================= */

const ITEM_DATA = {

precision_screwdriver: {

    name:
        "Precision Screwdriver",

    img:
        "precision_screwdriver.png",

    correct:
        true,

    value:
        25

},


replacement_battery: {

    name:
        "Replacement Battery",

    img:
        "replacement_battery.png",

    correct:
        true,

    value:
        25

},


screen_connector: {

    name:
        "Screen Connector",

    img:
        "screen_connector.png",

    correct:
        true,

    value:
        25

},


old_key: {

    name:
        "Old Key",

    img:
        "old_key.png",

    correct:
        false,

    value:
        -10

},


cassette_tape: {

    name:
        "Cassette Tape",

    img:
        "cassette_tape.png",

    correct:
        false,

    value:
        -10

},


paper_clip: {

    name:
        "Paper Clip",

    img:
        "paper_clip.png",

    correct:
        false,

    value:
        -10

}

};

/* =========================================
REQUIRED REPAIR PARTS
========================================= */

const REQUIRED_PARTS = [

"precision_screwdriver",

"replacement_battery",

"screen_connector"

];

/* =========================================
ELEMENTS
========================================= */

const repair =
document.getElementById(
"repair"
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
========================================= */

let condition = 0;

let usedParts = [];

let repairFinished = false;

/* =========================================
GET INVENTORY
========================================= */

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

if (!sound)
    return;


sound.currentTime = 0;

sound.play().catch(
    function() {}
);

}

/* =========================================
UPDATE METER
========================================= */

function updateMeter() {

/*
   Never allow the meter
   below 0 or above 100.
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

if (condition <= 0) {

    conditionText.textContent =
        "PHONE DAMAGED";

}

else if (condition < 25) {

    conditionText.textContent =
        "CRITICAL DAMAGE";

}

else if (condition < 50) {

    conditionText.textContent =
        "PARTIALLY REPAIRED";

}

else if (condition < 75) {

    conditionText.textContent =
        "REPAIR IN PROGRESS";

}

else if (condition < 100) {

    conditionText.textContent =
        "ALMOST RESTORED";

}

else {

    conditionText.textContent =
        "DEVICE RESTORED";

}

}

/* =========================================
RENDER INVENTORY
========================================= */

function renderRepairInventory() {

repairItems.innerHTML = "";


const inventory =
    getInventory();


/*
   Only show items that actually
   exist in the player's inventory.
*/

const available =
    inventory.filter(
        function(id) {

            return ITEM_DATA[id];

        }
    );


if (!available.length) {

    inventoryEmpty.classList.remove(
        "hidden"
    );

    return;

}


inventoryEmpty.classList.add(
    "hidden"
);


available.forEach(
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
           If this item was already
           successfully used, disable it.
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

if (repairFinished)
    return;


/*
   Make sure the item exists.
*/

const data =
    ITEM_DATA[id];


if (!data)
    return;


/*
   Do not allow the same correct
   component to be used twice.
*/

if (
    usedParts.includes(id)
) {

    showToast(
        "This component has already been installed."
    );

    return;

}


/* =====================================
   CORRECT ITEM
===================================== */

if (data.correct) {

    condition +=
        data.value;


    /*
       Remember this component.
    */

    usedParts.push(id);


    /*
       Disable its inventory button.
    */

    button.classList.add(
        "used"
    );


    /*
       Add to assembly status.
    */

    addAppliedPart(
        data.name
    );


    playSound(
        repairSound
    );


    repairMessage.textContent =
        `${data.name} installed correctly.`;


    showToast(
        `${data.name} installed. +${data.value}%`
    );


    updateMeter();


    /*
       Check for completion.
    */

    if (
        condition >= 100
    ) {

        completeRepair();

    }

}


/* =====================================
   WRONG ITEM
===================================== */

else {

    condition +=
        data.value;


    /*
       Wrong components are NOT
       permanently consumed.
    */

    playSound(
        wrongSound
    );


    repairMessage.textContent =
        `${data.name} does not belong in the phone.`;


    showToast(
        `Wrong component. ${data.value}%`
    );


    updateMeter();

}

}

/* =========================================
ADD APPLIED PART
========================================= */

function addAppliedPart(name) {

const element =
    document.createElement(
        "div"
    );


element.className =
    "appliedPart";


element.textContent =
    "✓ " + name;


appliedParts.appendChild(
    element
);

}

/* =========================================
COMPLETE REPAIR
========================================= */

function completeRepair() {

if (repairFinished)
    return;


repairFinished = true;


condition = 100;


updateMeter();


/*
   Save completion so the repaired
   phone remains restored if the
   player returns later.
*/

localStorage.setItem(
    REPAIR_COMPLETE_KEY,
    "true"
);


/*
   Disable interaction.
*/

inspectButton.disabled =
    true;


inspectButton.classList.add(
    "hidden"
);


repairInventory.classList.add(
    "hidden"
);


repairMessage.textContent =
    "DEVICE RESTORED. SYSTEM REBOOTING...";


/*
   Start blackout sequence.
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
   After the blackout,
   reveal the repaired phone.
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
   Remove blackout and show
   final message.
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
.getElementById(
"backButton"
)
.onclick =
function() {

    window.location.href =
        "investigation.html";

};

/* =========================================
CONTINUE
========================================= */

continueButton.onclick =
function() {

    window.location.href =
        "investigation.html";

};

/* =========================================
RESTORE COMPLETED PHONE
========================================= */

function restoreCompletedRepair() {

const completed =
    localStorage.getItem(
        REPAIR_COMPLETE_KEY
    ) === "true";


if (!completed)
    return;


repairFinished = true;

condition = 100;


repair.classList.add(
    "restored"
);


inspectButton.classList.add(
    "hidden"
);


repairMessage.textContent =
    "DEVICE RESTORED.";


conditionText.textContent =
    "DEVICE RESTORED";


conditionMeter.style.width =
    "100%";


conditionPercent.textContent =
    "100%";


completePanel.classList.remove(
    "hidden"
);

}

/* =========================================
INITIALIZE
========================================= */

updateMeter();

restoreCompletedRepair();
