/* =========================================================
   BROKEN PHONE
   PHONE.JS
========================================================= */


/* =========================================================
   DOM
========================================================= */

const phoneShell =
    document.getElementById("phoneShell");

const phoneToggle =
    document.getElementById("phoneToggle");

const toggleText =
    document.getElementById("toggleText");

const victimInfoButton =
    document.getElementById("victimInfoButton");


const lockScreen =
    document.getElementById("lockScreen");

const passcodeScreen =
    document.getElementById("passcodeScreen");

const homeScreen =
    document.getElementById("homeScreen");

const appScreen =
    document.getElementById("appScreen");


const lockTime =
    document.getElementById("lockTime");

const lockStatusTime =
    document.getElementById("lockStatusTime");

const passcodeTime =
    document.getElementById("passcodeTime");

const homeStatusTime =
    document.getElementById("homeStatusTime");

const homeBigTime =
    document.getElementById("homeBigTime");

const homeDate =
    document.getElementById("homeDate");


const passcodePad =
    document.getElementById("passcodePad");

const passcodeDots =
    document.getElementById("passcodeDots");

const passcodeError =
    document.getElementById("passcodeError");


const appFrame =
    document.getElementById("appFrame");

const appBack =
    document.getElementById("appBack");

const appHeaderName =
    document.getElementById("appHeaderName");

const appHeaderIcon =
    document.getElementById("appHeaderIcon");


const homePages =
    document.getElementById("homePages");

const pageDots =
    document.querySelectorAll("#pageDots span");


const searchInput =
    document.getElementById("appSearch");

const clearSearch =
    document.getElementById("clearSearch");

const searchResults =
    document.getElementById("searchResults");


const navBack =
    document.getElementById("navBack");

const navHome =
    document.getElementById("navHome");

const navRecent =
    document.getElementById("navRecent");


const recentPanel =
    document.getElementById("recentPanel");

const recentList =
    document.getElementById("recentList");

const closeRecent =
    document.getElementById("closeRecent");


/* =========================================================
   STORAGE
========================================================= */

const REPAIRED_KEY =
    "brokenPhoneRepaired";

const PHONE_VISIBLE_KEY =
    "brokenPhonePhoneVisible";


/* =========================================================
   STATE
========================================================= */

let phoneRepaired =
    localStorage.getItem(REPAIRED_KEY) === "true";


let phoneVisible =
    localStorage.getItem(PHONE_VISIBLE_KEY) === "true";


/*
   IMPORTANT

   If the phone has NOT been repaired,
   it must always be hidden.
*/

if (!phoneRepaired) {

    phoneVisible = false;

    localStorage.setItem(
        PHONE_VISIBLE_KEY,
        "false"
    );
}


/* =========================================================
   SAVE VISIBILITY
========================================================= */

function savePhoneVisibility() {

    localStorage.setItem(
        PHONE_VISIBLE_KEY,
        phoneVisible
            ? "true"
            : "false"
    );

}


/* =========================================================
   UPDATE BUTTON TEXT
========================================================= */

function updatePhoneToggle() {

    if (!phoneToggle) {
        return;
    }

    if (phoneVisible) {

        toggleText.textContent =
            "CLOSE PHONE";

    } else {

        toggleText.textContent =
            "OPEN PHONE";
    }

}


/* =========================================================
   SHOW PHONE
========================================================= */

function showPhone(autoOpen = false) {

    /*
       Never allow the phone to appear
       before repair.
    */

    if (!phoneRepaired) {
        return;
    }


    phoneVisible = true;

    savePhoneVisibility();


    phoneShell.classList.remove(
        "hidden-phone"
    );


    updatePhoneToggle();


    /*
       When repair has JUST finished,
       start at lock screen.
    */

    if (autoOpen) {

        showScreen("lock");

    }

}


/* =========================================================
   HIDE PHONE
========================================================= */

function hidePhone() {

    /*
       Hiding the phone does NOT
       remove the repaired state.
    */

    phoneVisible = false;

    savePhoneVisibility();


    phoneShell.classList.add(
        "hidden-phone"
    );


    updatePhoneToggle();

}


/* =========================================================
   OPEN / CLOSE BUTTON
========================================================= */

phoneToggle.addEventListener(
    "click",
    () => {

        /*
           Before repair the button does
           absolutely nothing.
        */

        if (!phoneRepaired) {

            return;

        }


        if (phoneVisible) {

            hidePhone();

        } else {

            showPhone(false);

        }

    }
);


/* =========================================================
   REPAIR COMPLETE
========================================================= */

function completePhoneRepair() {

    /*
       Permanently remember repair.
    */

    phoneRepaired = true;

    localStorage.setItem(
        REPAIRED_KEY,
        "true"
    );


    /*
       Automatically show phone.
    */

    showPhone(true);

}


/* =========================================================
   CHECK REPAIR STATE
========================================================= */

function checkRepairState() {

    const repaired =
        localStorage.getItem(
            REPAIRED_KEY
        ) === "true";


    if (repaired) {

        phoneRepaired = true;

    } else {

        phoneRepaired = false;

    }

}


/* =========================================================
   REPAIR MESSAGE
========================================================= */

window.addEventListener(
    "message",
    event => {

        if (!event.data) {
            return;
        }


        if (
            event.data.type ===
            "PHONE_REPAIRED"
        ) {

            completePhoneRepair();

        }

    }
);


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(screenName) {

    lockScreen.classList.add(
        "hidden"
    );

    passcodeScreen.classList.add(
        "hidden"
    );

    homeScreen.classList.add(
        "hidden"
    );

    appScreen.classList.add(
        "hidden"
    );


    if (screenName === "lock") {

        lockScreen.classList.remove(
            "hidden"
        );

    }


    if (screenName === "passcode") {

        passcodeScreen.classList.remove(
            "hidden"
        );

    }


    if (screenName === "home") {

        homeScreen.classList.remove(
            "hidden"
        );

    }


    if (screenName === "app") {

        appScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   LOCK SCREEN SWIPE
========================================================= */

let unlockStartY = null;


lockScreen.addEventListener(
    "pointerdown",
    event => {

        unlockStartY =
            event.clientY;

    }
);


lockScreen.addEventListener(
    "pointerup",
    event => {

        if (
            unlockStartY === null
        ) {
            return;
        }


        const distance =
            unlockStartY -
            event.clientY;


        if (distance > 70) {

            showScreen(
                "passcode"
            );

        }


        unlockStartY = null;

    }
);


/*
   Desktop testing:
   double click lock screen.
*/

lockScreen.addEventListener(
    "dblclick",
    () => {

        showScreen(
            "passcode"
        );

    }
);


/* =========================================================
   PASSCODE
========================================================= */

const PHONE_PASSCODE =
    "0521";

let enteredPasscode = "";


function updatePasscodeDots() {

    const dots =
        passcodeDots.querySelectorAll(
            "span"
        );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "filled",
                index <
                enteredPasscode.length
            );

        }
    );

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

        clearPasscode();

        showScreen("home");

        return;

    }


    passcodeError.textContent =
        "Incorrect passcode";

    enteredPasscode = "";

    updatePasscodeDots();

}


function addPasscodeDigit(digit) {

    if (
        enteredPasscode.length >= 4
    ) {
        return;
    }


    enteredPasscode += digit;

    updatePasscodeDots();


    if (
        enteredPasscode.length === 4
    ) {

        setTimeout(
            checkPasscode,
            180
        );

    }

}


/* =========================================================
   PASSCODE PAD
========================================================= */

const passcodeNumbers = [

    "1", "2", "3",

    "4", "5", "6",

    "7", "8", "9",

    "⌫", "0", "✓"

];


passcodeNumbers.forEach(
    value => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.textContent =
            value;


        if (value === "⌫") {

            button.addEventListener(
                "click",
                () => {

                    enteredPasscode =
                        enteredPasscode.slice(
                            0,
                            -1
                        );

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

                    addPasscodeDigit(
                        value
                    );

                }
            );

        }


        passcodePad.appendChild(
            button
        );

    }
);


/* =========================================================
   PASSCODE SWIPE DOWN
========================================================= */

let passStartY = null;


passcodeScreen.addEventListener(
    "pointerdown",
    event => {

        passStartY =
            event.clientY;

    }
);


passcodeScreen.addEventListener(
    "pointerup",
    event => {

        if (
            passStartY === null
        ) {
            return;
        }


        const distance =
            event.clientY -
            passStartY;


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

    const now =
        new Date();


    let hours =
        now.getHours();


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    hours =
        hours % 12 || 12;


    const time =
        `${String(hours).padStart(2, "0")}:${minutes}`;


    const date =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );


    lockTime.textContent =
        time;

    lockStatusTime.textContent =
        time;

    passcodeTime.textContent =
        time;

    homeStatusTime.textContent =
        time;

    homeBigTime.textContent =
        time;

    homeDate.textContent =
        date;

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   APPS
========================================================= */

const apps = {

    calls: {
        name: "Phone",
        file: "phone-calls.html"
    },

    messages: {
        name: "Messages",
        file: "messages.html"
    },

    gallery: {
        name: "Gallery",
        file: "gallery.html"
    },

    notes: {
        name: "Notes",
        file: "notes.html"
    },

    contacts: {
        name: "Contacts",
        file: "contacts.html"
    },

    browser: {
        name: "Browser",
        file: "browser.html"
    },

    camera: {
        name: "Camera",
        file: "camera.html"
    },

    settings: {
        name: "Settings",
        file: "settings.html"
    },

    bank: {
        name: "Bank",
        file: "bank.html"
    },

    music: {
        name: "Music",
        file: "music.html"
    },

    clock: {
        name: "Clock",
        file: "clock.html"
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


    recentApps.unshift(
        appId
    );


    if (
        recentApps.length > 6
    ) {

        recentApps =
            recentApps.slice(
                0,
                6
            );

    }

}


/* =========================================================
   ICON
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


    if (!app) {
        return;
    }


    addRecentApp(
        appId
    );


    appHeaderName.textContent =
        app.name;


    appHeaderIcon.innerHTML =
        getIconHTML(appId);


    appFrame.src =
        app.file;


    showScreen(
        "app"
    );

}


/* =========================================================
   APP BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-app]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openApp(
                        button.dataset.app
                    );

                }
            );

        }
    );


/* =========================================================
   APP BACK
========================================================= */

function returnHome() {

    appFrame.src = "";

    showScreen(
        "home"
    );

}


appBack.addEventListener(
    "click",
    returnHome
);


/* =========================================================
   ANDROID BACK
========================================================= */

navBack.addEventListener(
    "click",
    () => {

        if (
            !appScreen.classList.contains(
                "hidden"
            )
        ) {

            returnHome();

            return;

        }


        if (
            !passcodeScreen.classList.contains(
                "hidden"
            )
        ) {

            clearPasscode();

            showScreen(
                "lock"
            );

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

        recentPanel.classList.add(
            "hidden"
        );

        showScreen(
            "home"
        );

    }
);


/* =========================================================
   RECENT APPS
========================================================= */

function renderRecentApps() {

    recentList.innerHTML = "";


    if (
        recentApps.length === 0
    ) {

        recentList.innerHTML = `
            <div class="recent-card">
                No recent apps
            </div>
        `;

        return;

    }


    recentApps.forEach(
        appId => {

            const app =
                apps[appId];


            if (!app) {
                return;
            }


            const card =
                document.createElement(
                    "div"
                );


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
                .querySelector(
                    ".recent-open"
                )
                .addEventListener(
                    "click",
                    () => {

                        recentPanel.classList.add(
                            "hidden"
                        );

                        openApp(
                            appId
                        );

                    }
                );


            recentList.appendChild(
                card
            );

        }
    );

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
   HOME PAGE SWIPE
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
        (dot, index) => {

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

        homeStartX =
            event.clientX;

        homeStartY =
            event.clientY;

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
            event.clientX -
            homeStartX;


        const dy =
            event.clientY -
            homeStartY;


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
                ([id, app]) =>
                    app.name
                        .toLowerCase()
                        .includes(query)
            );


    if (
        matches.length === 0
    ) {

        searchResults.innerHTML = `
            <div class="search-result">
                No apps found
            </div>
        `;

    }

    else {

        matches.forEach(
            ([id, app]) => {

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

                        openApp(
                            id
                        );

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
   SEARCH OUTSIDE CLICK
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

        if (!event.data) {
            return;
        }


        /*
           Phone app asks to go back.
        */

        if (
            event.data.type ===
            "PHONE_BACK"
        ) {

            returnHome();

        }


        /*
           Phone app asks to open another
           phone app.
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
           Repair page tells this page
           that the phone has been repaired.
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
   VICTIM FILE
========================================================= */

function createVictimFile() {

    let existing =
        document.getElementById(
            "victimFileOverlay"
        );


    if (existing) {

        existing.classList.remove(
            "hidden"
        );

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "victimFileOverlay";


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
                        <span>FULL NAME</span>
                        <strong>Evelyn Carter</strong>
                    </div>

                    <div class="victim-field">
                        <span>DATE OF BIRTH</span>
                        <strong>May 21, 2002</strong>
                    </div>

                    <div class="victim-field">
                        <span>AGE</span>
                        <strong>24</strong>
                    </div>

                    <div class="victim-field">
                        <span>SEX</span>
                        <strong>Female</strong>
                    </div>

                    <div class="victim-field">
                        <span>OCCUPATION</span>
                        <strong>Unknown</strong>
                    </div>

                    <div class="victim-field">
                        <span>ADDRESS</span>
                        <strong>Unknown</strong>
                    </div>

                    <div class="victim-field">
                        <span>CASE TYPE</span>
                        <strong>Homicide</strong>
                    </div>

                    <div class="victim-field">
                        <span>STATUS</span>
                        <strong>Active Investigation</strong>
                    </div>

                    <div class="victim-field">
                        <span>EMERGENCY CONTACT</span>
                        <strong>Unknown</strong>
                    </div>

                    <div class="victim-field">
                        <span>CAUSE</span>
                        <strong>Stabbing</strong>
                    </div>

                    <div class="victim-field victim-wide">
                        <span>LOCATION</span>
                        <strong>
                            Woodland / Forest Area
                        </strong>
                    </div>

                    <div class="victim-field victim-wide">
                        <span>DISCOVERY</span>
                        <strong>
                            Victim was found restrained
                            to a tree in a wooded area.
                        </strong>
                    </div>

                </div>


                <div class="victim-notes">

                    <div class="victim-section-title">
                        INVESTIGATION NOTES
                    </div>

                    <p>
                        Victim was discovered deceased
                        at the scene. The case remains
                        under active investigation.
                    </p>

                    <p>
                        The recovered mobile phone is
                        being examined as a potential
                        source of digital evidence.
                    </p>

                </div>

            </div>

        </section>
    `;


    document.body.appendChild(
        overlay
    );


    const closeButton =
        document.getElementById(
            "victimFileClose"
        );


    const backdrop =
        overlay.querySelector(
            ".victim-file-backdrop"
        );


    function closeVictimFile() {

        overlay.classList.add(
            "hidden"
        );

    }


    closeButton.addEventListener(
        "click",
        closeVictimFile
    );


    backdrop.addEventListener(
        "click",
        closeVictimFile
    );

}


victimInfoButton.addEventListener(
    "click",
    createVictimFile
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializePhone() {

    checkRepairState();


    if (!phoneRepaired) {

        /*
           Not repaired.
           Phone MUST remain hidden.
        */

        phoneVisible = false;

        phoneShell.classList.add(
            "hidden-phone"
        );


        localStorage.setItem(
            PHONE_VISIBLE_KEY,
            "false"
        );

    }

    else {

        /*
           Repaired.

           If no visibility state exists,
           default to OPEN.
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

        }

        else {

            phoneVisible = false;

            phoneShell.classList.add(
                "hidden-phone"
            );

        }

    }


    updatePhoneToggle();


    /*
       Start repaired phone on lock screen.
    */

    if (phoneRepaired) {

        showScreen("lock");

    }

}


/* =========================================================
   START
========================================================= */

initializePhone();
