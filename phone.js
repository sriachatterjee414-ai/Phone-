/* =========================================================
   BROKEN PHONE
   PHONE.JS
   =========================================================

   IMPORTANT STATE

   brokenPhoneRepaired
   -------------------
   false / missing = phone has not been repaired
   true            = phone permanently available

   brokenPhonePhoneVisible
   -----------------------
   true  = phone currently visible
   false = phone currently hidden

   The repaired state NEVER gets removed here.
========================================================= */


/* =========================================================
   DOM
========================================================= */

const phoneShell = document.getElementById("phoneShell");

const victimInfoButton = document.getElementById("victimInfoButton");

const phoneToggle = document.getElementById("phoneToggle");
const toggleText = document.getElementById("toggleText");

const lockScreen = document.getElementById("lockScreen");
const passcodeScreen = document.getElementById("passcodeScreen");
const homeScreen = document.getElementById("homeScreen");
const appScreen = document.getElementById("appScreen");

const lockTime = document.getElementById("lockTime");
const lockStatusTime = document.getElementById("lockStatusTime");

const passcodeTime = document.getElementById("passcodeTime");
const homeStatusTime = document.getElementById("homeStatusTime");
const homeBigTime = document.getElementById("homeBigTime");
const homeDate = document.getElementById("homeDate");

const passcodePad = document.getElementById("passcodePad");
const passcodeDots = document.getElementById("passcodeDots");
const passcodeError = document.getElementById("passcodeError");

const appFrame = document.getElementById("appFrame");
const appBack = document.getElementById("appBack");
const appHeaderName = document.getElementById("appHeaderName");
const appHeaderIcon = document.getElementById("appHeaderIcon");

const homePages = document.getElementById("homePages");
const pageDots = document.querySelectorAll("#pageDots span");

const searchInput = document.getElementById("appSearch");
const clearSearch = document.getElementById("clearSearch");
const searchResults = document.getElementById("searchResults");

const navBack = document.getElementById("navBack");
const navHome = document.getElementById("navHome");
const navRecent = document.getElementById("navRecent");

const recentPanel = document.getElementById("recentPanel");
const recentList = document.getElementById("recentList");
const closeRecent = document.getElementById("closeRecent");


/* =========================================================
   STORAGE KEYS
========================================================= */

const REPAIRED_KEY = "brokenPhoneRepaired";
const PHONE_VISIBLE_KEY = "brokenPhonePhoneVisible";


/* =========================================================
   BASIC STATE
========================================================= */

let phoneRepaired =
    localStorage.getItem(REPAIRED_KEY) === "true";

let phoneVisible =
    localStorage.getItem(PHONE_VISIBLE_KEY) !== "false";


/*
    Before repair:
    --------------------------------
    phone is hidden.

    After repair:
    --------------------------------
    phone automatically appears.

    We do NOT create another button.
*/

if (!phoneRepaired) {

    phoneVisible = false;

    localStorage.setItem(
        PHONE_VISIBLE_KEY,
        "false"
    );

}


/* =========================================================
   PHONE STATE
========================================================= */

function savePhoneVisibility() {

    localStorage.setItem(
        PHONE_VISIBLE_KEY,
        phoneVisible ? "true" : "false"
    );

}


/* =========================================================
   SHOW PHONE
========================================================= */

function showPhone(autoOpen = false) {

    phoneVisible = true;

    savePhoneVisibility();

    phoneShell.classList.remove("hidden-phone");

    updatePhoneToggle();


    /*
        If this is the first automatic opening after repair,
        keep the phone in its normal initial state.
    */

    if (autoOpen) {

        showScreen("lock");

    }

}


/* =========================================================
   HIDE PHONE
========================================================= */

function hidePhone() {

    phoneVisible = false;

    savePhoneVisibility();

    phoneShell.classList.add("hidden-phone");

    updatePhoneToggle();

}


/* =========================================================
   PHONE TOGGLE
========================================================= */

function updatePhoneToggle() {

    if (!phoneToggle) return;

    if (phoneVisible) {

        toggleText.textContent = "CLOSE PHONE";

    } else {

        toggleText.textContent = "OPEN PHONE";

    }

}


/* =========================================================
   PHONE TOGGLE BUTTON
========================================================= */

phoneToggle.addEventListener("click", () => {

    /*
        Phone cannot be manually opened before repair.
        There is deliberately no separate "repair/open" button.
    */

    if (!phoneRepaired) {

        return;

    }


    if (phoneVisible) {

        hidePhone();

    } else {

        showPhone(false);

    }

});


/* =========================================================
   REPAIR COMPLETED
   repair.html can trigger this in two ways:

   1. localStorage:
      brokenPhoneRepaired = true

   2. postMessage:
      { type: "PHONE_REPAIRED" }
========================================================= */

function completePhoneRepair() {

    phoneRepaired = true;

    localStorage.setItem(
        REPAIRED_KEY,
        "true"
    );


    /*
        IMPORTANT:

        The phone becomes visible automatically.
        No extra button is created.
    */

    showPhone(true);

}


/* =========================================================
   LISTEN FOR REPAIR PAGE
========================================================= */

window.addEventListener("message", event => {

    if (!event.data) return;


    if (event.data.type === "PHONE_REPAIRED") {

        completePhoneRepair();

    }

});


/* =========================================================
   ALSO CHECK LOCAL STORAGE
   Useful when repair.html navigates directly back
========================================================= */

function checkRepairState() {

    const repairedNow =
        localStorage.getItem(REPAIRED_KEY) === "true";


    if (repairedNow && !phoneRepaired) {

        phoneRepaired = true;

        showPhone(true);

    }

}


/* =========================================================
   VICTIM FILE
========================================================= */

function createVictimFile() {

    /*
        Do not use the phone iframe for Victim File.

        This is an OUTSIDE-THE-PHONE investigation control.
    */

    let existing =
        document.getElementById("victimFileOverlay");

    if (existing) {

        existing.classList.remove("hidden");

        return;

    }


    const overlay =
        document.createElement("div");

    overlay.id = "victimFileOverlay";

    overlay.innerHTML = `

        <div class="victim-file-backdrop"></div>

        <section class="victim-file-panel">

            <button
                type="button"
                class="victim-file-close"
                id="victimFileClose">
                ×
            </button>


            <div class="victim-file-header">

                <div class="victim-file-kicker">
                    POLICE INVESTIGATION DEPARTMENT
                </div>

                <h1>
                    VICTIM FILE
                </h1>

                <div class="victim-file-case">
                    CASE #1996-549764
                </div>

            </div>


            <div class="victim-file-content">

                <div class="victim-profile">

                    <div class="victim-photo">

                        <div class="victim-photo-placeholder">
                            NO PHOTO
                        </div>

                    </div>


                    <div class="victim-basic">

                        <h2>
                            Evelyn Carter
                        </h2>

                        <p>
                            HOMICIDE VICTIM
                        </p>

                    </div>

                </div>


                <div class="victim-info-grid">

                    <div class="victim-field">

                        <span>
                            FULL NAME
                        </span>

                        <strong>
                            Evelyn Carter
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            DATE OF BIRTH
                        </span>

                        <strong>
                            May 21, 2002
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            AGE
                        </span>

                        <strong>
                            24
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            SEX
                        </span>

                        <strong>
                            Female
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            OCCUPATION
                        </span>

                        <strong>
                            Unknown
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            ADDRESS
                        </span>

                        <strong>
                            Unknown
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            CASE TYPE
                        </span>

                        <strong>
                            Homicide
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            STATUS
                        </span>

                        <strong>
                            Active Investigation
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            EMERGENCY CONTACT
                        </span>

                        <strong>
                            Unknown
                        </strong>

                    </div>


                    <div class="victim-field">

                        <span>
                            CAUSE
                        </span>

                        <strong>
                            Stabbing
                        </strong>

                    </div>


                    <div class="victim-field victim-wide">

                        <span>
                            LOCATION
                        </span>

                        <strong>
                            Woodland / Forest Area
                        </strong>

                    </div>


                    <div class="victim-field victim-wide">

                        <span>
                            DISCOVERY
                        </span>

                        <strong>
                            Victim was found restrained to a tree
                            in a wooded area.
                        </strong>

                    </div>

                </div>


                <div class="victim-notes">

                    <div class="victim-section-title">
                        INVESTIGATION NOTES
                    </div>

                    <p>
                        Victim was discovered deceased at the
                        scene. The case remains under active
                        investigation.
                    </p>

                    <p>
                        The recovered mobile phone is being
                        examined as a potential source of
                        digital evidence.
                    </p>

                </div>

            </div>

        </section>
    `;


    document.body.appendChild(overlay);


    /*
        CLOSE
    */

    const closeButton =
        document.getElementById("victimFileClose");

    const backdrop =
        overlay.querySelector(
            ".victim-file-backdrop"
        );


    closeButton.addEventListener(
        "click",
        closeVictimFile
    );


    backdrop.addEventListener(
        "click",
        closeVictimFile
    );


    function closeVictimFile() {

        overlay.classList.add("hidden");

    }

}


/* =========================================================
   VICTIM BUTTON
========================================================= */

victimInfoButton.addEventListener(
    "click",
    () => {

        createVictimFile();

    }
);


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(screenName) {

    lockScreen.classList.add("hidden");
    passcodeScreen.classList.add("hidden");
    homeScreen.classList.add("hidden");
    appScreen.classList.add("hidden");


    if (screenName === "lock") {

        lockScreen.classList.remove("hidden");

    }


    if (screenName === "passcode") {

        passcodeScreen.classList.remove("hidden");

    }


    if (screenName === "home") {

        homeScreen.classList.remove("hidden");

    }


    if (screenName === "app") {

        appScreen.classList.remove("hidden");

    }

}


/* =========================================================
   LOCK SCREEN
========================================================= */

let unlockStartY = null;
let unlockEndY = null;

lockScreen.addEventListener(
    "pointerdown",
    event => {

        unlockStartY = event.clientY;

    }
);


lockScreen.addEventListener(
    "pointerup",
    event => {

        if (unlockStartY === null) return;

        unlockEndY = event.clientY;

        const distance =
            unlockStartY - unlockEndY;


        if (distance > 70) {

            showScreen("passcode");

        }


        unlockStartY = null;

    }
);


/*
    Also allow clicking the lock screen
    for desktop testing.
*/

lockScreen.addEventListener(
    "dblclick",
    () => {

        showScreen("passcode");

    }
);


/* =========================================================
   PASSCODE
========================================================= */

const PHONE_PASSCODE = "0521";

let enteredPasscode = "";


function updatePasscodeDots() {

    const dots =
        passcodeDots.querySelectorAll("span");


    dots.forEach((dot, index) => {

        if (index < enteredPasscode.length) {

            dot.classList.add("filled");

        } else {

            dot.classList.remove("filled");

        }

    });

}


function clearPasscode() {

    enteredPasscode = "";

    updatePasscodeDots();

    passcodeError.textContent = "";

}


function checkPasscode() {

    if (
        enteredPasscode ===
        PHONE_PASSCODE
    ) {

        passcodeError.textContent = "";

        showScreen("home");

        clearPasscode();

        return;

    }


    passcodeError.textContent =
        "Incorrect passcode";

    enteredPasscode = "";

    updatePasscodeDots();

}


function addPasscodeDigit(digit) {

    if (enteredPasscode.length >= 4) {

        return;

    }


    enteredPasscode += digit;

    updatePasscodeDots();


    if (enteredPasscode.length === 4) {

        setTimeout(
            checkPasscode,
            180
        );

    }

}


/* =========================================================
   BUILD PASSCODE PAD
========================================================= */

const passcodeNumbers = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    "⌫","0","✓"
];


passcodeNumbers.forEach(value => {

    const button =
        document.createElement("button");

    button.type = "button";

    button.textContent = value;


    if (value === "⌫") {

        button.addEventListener(
            "click",
            () => {

                enteredPasscode =
                    enteredPasscode.slice(0,-1);

                updatePasscodeDots();

            }
        );

    }

    else if (value === "✓") {

        button.addEventListener(
            "click",
            checkPasscode
        );

    }

    else {

        button.addEventListener(
            "click",
            () => {

                addPasscodeDigit(value);

            }
        );

    }


    passcodePad.appendChild(button);

});


/* =========================================================
   PASSCODE SWIPE DOWN
========================================================= */

let passStartY = null;

passcodeScreen.addEventListener(
    "pointerdown",
    event => {

        passStartY = event.clientY;

    }
);


passcodeScreen.addEventListener(
    "pointerup",
    event => {

        if (passStartY === null) return;

        const distance =
            event.clientY - passStartY;


        if (distance > 70) {

            clearPasscode();

            showScreen("lock");

        }


        passStartY = null;

    }
);


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now = new Date();


    let hours =
        now.getHours();

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2,"0");


    const ampm =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    const time =
        `${String(hours).padStart(2,"0")}:${minutes}`;


    const date =
        now.toLocaleDateString(
            "en-US",
            {
                weekday:"long",
                month:"long",
                day:"numeric"
            }
        );


    lockTime.textContent = time;

    lockStatusTime.textContent = time;

    passcodeTime.textContent = time;

    homeStatusTime.textContent = time;

    homeBigTime.textContent =
        `${String(hours).padStart(2,"0")}:${minutes}`;


    homeDate.textContent = date;

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   APP DATA
========================================================= */

const apps = {

    calls: {
        name:"Phone",
        file:"phone-calls.html"
    },

    messages: {
        name:"Messages",
        file:"messages.html"
    },

    gallery: {
        name:"Gallery",
        file:"gallery.html"
    },

    notes: {
        name:"Notes",
        file:"notes.html"
    },

    contacts: {
        name:"Contacts",
        file:"contacts.html"
    },

    browser: {
        name:"Browser",
        file:"browser.html"
    },

    camera: {
        name:"Camera",
        file:"camera.html"
    },

    settings: {
        name:"Settings",
        file:"settings.html"
    },

    bank: {
        name:"Bank",
        file:"bank.html"
    },

    music: {
        name:"Music",
        file:"music.html"
    },

    clock: {
        name:"Clock",
        file:"clock.html"
    }

};


/* =========================================================
   RECENT APPS
========================================================= */

let recentApps = [];


function addRecentApp(appId) {

    recentApps =
        recentApps.filter(
            id => id !== appId
        );


    recentApps.unshift(appId);


    if (recentApps.length > 6) {

        recentApps =
            recentApps.slice(0,6);

    }

}


/* =========================================================
   APP ICON
========================================================= */

function getIconHTML(appId) {

    const source =
        document.querySelector(
            `[data-app="${appId}"] .real-icon`
        );


    if (!source) {

        return "";

    }


    return source.outerHTML;

}


/* =========================================================
   OPEN APP
========================================================= */

function openApp(appId) {

    const app =
        apps[appId];


    if (!app) return;


    addRecentApp(appId);

    appHeaderName.textContent =
        app.name;


    appHeaderIcon.innerHTML =
        getIconHTML(appId);


    appFrame.src =
        app.file;


    showScreen("app");

}


/* =========================================================
   ALL APP BUTTONS
========================================================= */

document
    .querySelectorAll("[data-app]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const appId =
                    button.dataset.app;

                openApp(appId);

            }
        );

    });


/* =========================================================
   APP BACK
========================================================= */

appBack.addEventListener(
    "click",
    () => {

        appFrame.src = "";

        showScreen("home");

    }
);


/* =========================================================
   ANDROID BACK
========================================================= */

navBack.addEventListener(
    "click",
    () => {

        if (
            !appScreen.classList.contains("hidden")
        ) {

            appFrame.src = "";

            showScreen("home");

            return;

        }


        if (
            !passcodeScreen.classList.contains("hidden")
        ) {

            clearPasscode();

            showScreen("lock");

            return;

        }

    }
);


/* =========================================================
   ANDROID HOME
========================================================= */

navHome.addEventListener(
    "click",
    () => {

        appFrame.src = "";

        recentPanel.classList.add("hidden");

        showScreen("home");

    }
);


/* =========================================================
   RECENT APPS
========================================================= */

function renderRecentApps() {

    recentList.innerHTML = "";


    if (recentApps.length === 0) {

        recentList.innerHTML = `
            <div class="recent-card">
                No recent apps
            </div>
        `;

        return;

    }


    recentApps.forEach(appId => {

        const app =
            apps[appId];


        if (!app) return;


        const card =
            document.createElement("div");

        card.className =
            "recent-card";


        card.innerHTML = `

            <button
                type="button"
                class="recent-open">

                ${getIconHTML(appId)}

                <span>
                    ${app.name}
                </span>

            </button>

        `;


        card
            .querySelector(".recent-open")
            .addEventListener(
                "click",
                () => {

                    recentPanel.classList.add(
                        "hidden"
                    );

                    openApp(appId);

                }
            );


        recentList.appendChild(card);

    });

}


navRecent.addEventListener(
    "click",
    () => {

        renderRecentApps();

        recentPanel.classList.remove(
            "hidden"
        );

    }
);


closeRecent.addEventListener(
    "click",
    () => {

        recentPanel.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   HOME PAGE SWIPING
========================================================= */

let currentPage = 0;

let homeStartX = null;
let homeStartY = null;


function goToPage(page) {

    currentPage =
        Math.max(
            0,
            Math.min(
                2,
                page
            )
        );


    homePages.style.transform =
        `translateX(-${currentPage * 33.333333}%)`;


    pageDots.forEach(
        (dot,index) => {

            dot.classList.toggle(
                "active",
                index === currentPage
            );

        }
    );

}


homeScreen.addEventListener(
    "pointerdown",
    event => {

        homeStartX = event.clientX;

        homeStartY = event.clientY;

    }
);


homeScreen.addEventListener(
    "pointerup",
    event => {

        if (
            homeStartX === null ||
            homeStartY === null
        ) {

            return;

        }


        const dx =
            event.clientX - homeStartX;

        const dy =
            event.clientY - homeStartY;


        if (
            Math.abs(dx) > 60 &&
            Math.abs(dx) > Math.abs(dy)
        ) {

            if (dx < 0) {

                goToPage(
                    currentPage + 1
                );

            } else {

                goToPage(
                    currentPage - 1
                );

            }

        }


        homeStartX = null;
        homeStartY = null;

    }
);


/* =========================================================
   SEARCH
========================================================= */

function performSearch(value) {

    const query =
        value
            .trim()
            .toLowerCase();


    searchResults.innerHTML = "";


    if (!query) {

        searchResults.classList.add(
            "hidden"
        );

        return;

    }


    const matches =
        Object.entries(apps)
            .filter(
                ([id,app]) =>
                    app.name
                        .toLowerCase()
                        .includes(query)
            );


    if (matches.length === 0) {

        searchResults.innerHTML = `
            <div class="search-result">
                No apps found
            </div>
        `;

    }

    else {

        matches.forEach(
            ([id,app]) => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "search-result";


                button.innerHTML = `

                    ${getIconHTML(id)}

                    <span>
                        ${app.name}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        searchInput.value =
                            "";

                        searchResults.classList.add(
                            "hidden"
                        );

                        openApp(id);

                    }
                );


                searchResults.appendChild(
                    button
                );

            }
        );

    }


    searchResults.classList.remove(
        "hidden"
    );

}


searchInput.addEventListener(
    "input",
    () => {

        performSearch(
            searchInput.value
        );

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value =
            "";

        searchResults.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   CLICK OUTSIDE SEARCH
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".google-search"
            ) &&
            !event.target.closest(
                ".search-results"
            )
        ) {

            searchResults.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   IFRAME COMMUNICATION
========================================================= */

window.addEventListener(
    "message",
    event => {

        if (!event.data) return;


        /*
            PHONE BACK

            Used by phone apps such as
            messages.html / notes.html.
        */

        if (
            event.data.type ===
            "PHONE_BACK"
        ) {

            appFrame.src = "";

            showScreen("home");

        }


        /*
            APP OPEN REQUEST

            Allows an app inside the phone
            to request another phone app.
        */

        if (
            event.data.type ===
            "OPEN_PHONE_APP"
        ) {

            openApp(
                event.data.app
            );

        }


        /*
            REPAIR COMPLETE

            This is deliberately here too,
            so repair.html can notify phone.html
            if it is still open in another context.
        */

        if (
            event.data.type ===
            "PHONE_REPAIRED"
        ) {

            completePhoneRepair();

        }

    }
);


/* =========================================================
   INITIAL PHONE STATE
========================================================= */

function initializePhone() {

    checkRepairState();


    if (phoneRepaired) {

        /*
            Repaired phone is automatically
            available.

            If the player has never manually
            hidden it, it opens automatically.
        */

        const savedVisibility =
            localStorage.getItem(
                PHONE_VISIBLE_KEY
            );


        if (
            savedVisibility === null ||
            savedVisibility === "true"
        ) {

            phoneVisible = true;

            phoneShell.classList.remove(
                "hidden-phone"
            );

        } else {

            phoneVisible = false;

            phoneShell.classList.add(
                "hidden-phone"
            );

        }

    }

    else {

        /*
            BEFORE REPAIR:
            phone is not available.
        */

        phoneVisible = false;

        phoneShell.classList.add(
            "hidden-phone"
        );

    }


    updatePhoneToggle();

}


/* =========================================================
   START
========================================================= */

initializePhone();
