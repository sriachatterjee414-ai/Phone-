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

const investigationControls =
    document.getElementById("investigationControls");


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

   IMPORTANT:
   repair.js uses:

   brokenPhoneRepairComplete

   Therefore phone.js MUST use the same key.
========================================================= */

const REPAIRED_KEY =
    "brokenPhoneRepairComplete";

const PHONE_VISIBLE_KEY =
    "brokenPhonePhoneVisible";

const STORY_PHONE_OVERLAY =
    new URLSearchParams(window.location.search).get("storyOverlay") === "1";

if (STORY_PHONE_OVERLAY) {

    document.documentElement.classList.add(
        "story-phone-iframe"
    );

}

const STORY2_COMPLETE_KEY =
    "brokenPhoneStory2Complete";


/* =========================================================
   STATE
========================================================= */

let phoneRepaired =
    localStorage.getItem(REPAIRED_KEY) === "true";


let phoneVisible =
    localStorage.getItem(PHONE_VISIBLE_KEY) === "true";


/* =========================================================
   SAVE PHONE VISIBILITY
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
   UPDATE OPEN / HIDE BUTTON
========================================================= */

function updatePhoneToggle() {

    if (!phoneToggle || !toggleText) {
        return;
    }


    if (phoneVisible) {

        toggleText.textContent =
            "HIDE PHONE";

    }

    else {

        toggleText.textContent =
            "OPEN PHONE";

    }

}


/* =========================================================
   SHOW PHONE
========================================================= */

function showPhone(autoOpen = false) {

    /*
       Phone cannot be opened until
       repair has been completed.
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
       When the phone is newly repaired,
       start at the lock screen.
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
       Hiding the phone does NOT reset
       repair progress or phone data.
    */

    phoneVisible = false;


    savePhoneVisibility();


    phoneShell.classList.add(
        "hidden-phone"
    );


    updatePhoneToggle();


    if (STORY_PHONE_OVERLAY) {

        window.parent.postMessage(
            { type: "broken-phone-hidden" },
            window.location.origin
        );

        return;

    }


    if (
        localStorage.getItem(STORY2_COMPLETE_KEY) !== "true"
    ) {

        localStorage.setItem(
            "brokenPhoneStory2Started",
            "true"
        );

        window.location.href =
            "story2.html?v=ryan-frames-7";

    }

}


/* =========================================================
   OPEN / HIDE PHONE BUTTON
========================================================= */

if (phoneToggle) {

    phoneToggle.addEventListener(
        "click",
        function() {

            /*
               Phone must be repaired first.
            */

            if (!phoneRepaired) {

                return;

            }


            if (phoneVisible) {

                hidePhone();

            }

            else {

                showPhone(false);

            }

        }
    );

}


/* =========================================================
   CHECK REPAIR STATE
========================================================= */

function checkRepairState() {

    phoneRepaired =
        localStorage.getItem(
            REPAIRED_KEY
        ) === "true";

}


/* =========================================================
   REPAIR COMPLETE
========================================================= */

function completePhoneRepair() {

    /*
       Permanently remember that the phone
       has been repaired.
    */

    phoneRepaired = true;


    localStorage.setItem(
        REPAIRED_KEY,
        "true"
    );


    /*
       Phone automatically becomes visible.
    */

    phoneVisible = true;


    localStorage.setItem(
        PHONE_VISIBLE_KEY,
        "true"
    );


    phoneShell.classList.remove(
        "hidden-phone"
    );


    updatePhoneToggle();


    showScreen("lock");

}


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(screenName) {

    if (lockScreen) {

        lockScreen.classList.add(
            "hidden"
        );

    }


    if (passcodeScreen) {

        passcodeScreen.classList.add(
            "hidden"
        );

    }


    if (homeScreen) {

        homeScreen.classList.add(
            "hidden"
        );

    }


    if (appScreen) {

        appScreen.classList.add(
            "hidden"
        );

    }


    if (investigationControls) {

        investigationControls.style.display =
            screenName === "app"
                ? "none"
                : "flex";

    }


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
    function(event) {

        unlockStartY =
            event.clientY;

    }
);


lockScreen.addEventListener(
    "pointerup",
    function(event) {

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


/* =========================================================
   DESKTOP DOUBLE CLICK TO UNLOCK
========================================================= */

lockScreen.addEventListener(
    "dblclick",
    function() {

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


let enteredPasscode =
    "";


/* =========================================================
   PASSCODE DOTS
========================================================= */

function updatePasscodeDots() {

    const dots =
        passcodeDots.querySelectorAll(
            "span"
        );


    dots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "filled",
                index <
                enteredPasscode.length
            );

        }
    );

}


/* =========================================================
   CLEAR PASSCODE
========================================================= */

function clearPasscode() {

    enteredPasscode =
        "";


    updatePasscodeDots();


    passcodeError.textContent =
        "";

}


/* =========================================================
   CHECK PASSCODE
========================================================= */

function checkPasscode() {

    if (
        enteredPasscode ===
        PHONE_PASSCODE
    ) {

        passcodeError.textContent =
            "";


        clearPasscode();


        showScreen(
            "home"
        );


        return;

    }


    passcodeError.textContent =
        "Incorrect passcode";


    enteredPasscode =
        "";


    updatePasscodeDots();

}


/* =========================================================
   ADD PASSCODE DIGIT
========================================================= */

function addPasscodeDigit(
    digit
) {

    if (
        enteredPasscode.length >= 4
    ) {

        return;

    }


    enteredPasscode +=
        digit;


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
    function(value) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.textContent =
            value;


        /* BACKSPACE */

        if (
            value === "⌫"
        ) {

            button.addEventListener(
                "click",
                function() {

                    enteredPasscode =
                        enteredPasscode.slice(
                            0,
                            -1
                        );


                    updatePasscodeDots();

                }
            );

        }


        /* CONFIRM */

        else if (
            value === "✓"
        ) {

            button.addEventListener(
                "click",
                checkPasscode
            );

        }


        /* NUMBER */

        else {

            button.addEventListener(
                "click",
                function() {

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
    function(event) {

        passStartY =
            event.clientY;

    }
);


passcodeScreen.addEventListener(
    "pointerup",
    function(event) {

        if (
            passStartY === null
        ) {

            return;

        }


        const distance =
            event.clientY -
            passStartY;


        if (
            distance > 70
        ) {

            clearPasscode();


            showScreen(
                "lock"
            );

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
        ).padStart(
            2,
            "0"
        );


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
        file: "calls.html"
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


function addRecentApp(
    appId
) {

    recentApps =
        recentApps.filter(
            function(id) {

                return id !== appId;

            }
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
   GET APP ICON
========================================================= */

function getIconHTML(
    appId
) {

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

function openApp(
    appId
) {

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
        getIconHTML(
            appId
        );


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
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    openApp(
                        button.dataset.app
                    );

                }
            );

        }
    );


/* =========================================================
   RETURN HOME
========================================================= */

function returnHome() {

    appFrame.src =
        "";


    showScreen(
        "home"
    );

}


/* =========================================================
   APP BACK
========================================================= */

appBack.addEventListener(
    "click",
    returnHome
);


/* =========================================================
   ANDROID BACK
========================================================= */

navBack.addEventListener(
    "click",
    function() {

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
    function() {

        appFrame.src =
            "";


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

    recentList.innerHTML =
        "";


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
        function(appId) {

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
                    function() {

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
    function() {

        renderRecentApps();


        recentPanel.classList.remove(
            "hidden"
        );

    }
);


closeRecent.addEventListener(
    "click",
    function() {

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


function goToPage(
    page
) {

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
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index === currentPage
            );

        }
    );

}


homeScreen.addEventListener(
    "pointerdown",
    function(event) {

        homeStartX =
            event.clientX;


        homeStartY =
            event.clientY;

    }
);


homeScreen.addEventListener(
    "pointerup",
    function(event) {

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

            if (
                dx < 0
            ) {

                goToPage(
                    currentPage + 1
                );

            }

            else {

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

function performSearch(
    value
) {

    const query =
        value
            .trim()
            .toLowerCase();


    searchResults.innerHTML =
        "";


    if (!query) {

        searchResults.classList.add(
            "hidden"
        );


        return;

    }


    const matches =
        Object.entries(apps)
            .filter(
                function([id, app]) {

                    return app.name
                        .toLowerCase()
                        .includes(query);

                }
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
            function([id, app]) {

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
                    function() {

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
    function() {

        performSearch(
            searchInput.value
        );

    }
);


clearSearch.addEventListener(
    "click",
    function() {

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
    function(event) {

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
    function(event) {

        if (!event.data) {

            return;

        }


        /* PHONE APP → BACK */

        if (
            event.data.type ===
            "PHONE_BACK"
        ) {

            returnHome();

        }


        /* PHONE APP → OPEN ANOTHER APP */

        if (
            event.data.type ===
            "OPEN_PHONE_APP"
        ) {

            openApp(
                event.data.app
            );

        }


        /* REPAIR PAGE → PHONE REPAIRED */

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
   INITIALIZE PHONE
========================================================= */

function initializePhone() {

    checkRepairState();


    if (STORY_PHONE_OVERLAY) {

        if (!phoneRepaired) {

            window.location.replace("repair.html");

            return;

        }


        phoneVisible = true;

        savePhoneVisibility();

        phoneShell.classList.remove(
            "hidden-phone"
        );

        updatePhoneToggle();

        showScreen("lock");

        return;

    }


    /* =====================================================
       PHONE NOT REPAIRED
    ===================================================== */

    if (!phoneRepaired) {

        phoneVisible =
            false;


        phoneShell.classList.add(
            "hidden-phone"
        );


        localStorage.setItem(
            PHONE_VISIBLE_KEY,
            "false"
        );


        updatePhoneToggle();


        /*
           Keep the phone's internal screen
           ready at the lock screen.
        */

        showScreen(
            "lock"
        );


        return;

    }


    /* =====================================================
       PHONE HAS BEEN REPAIRED
    ===================================================== */

    const savedVisibility =
        localStorage.getItem(
            PHONE_VISIBLE_KEY
        );


    /*
       If this is the first time phone.html
       is being opened after repair,
       automatically show the phone.
    */

    if (
        savedVisibility === null
    ) {

        phoneVisible =
            true;


        localStorage.setItem(
            PHONE_VISIBLE_KEY,
            "true"
        );

    }

    else {

        phoneVisible =
            savedVisibility === "true";

    }


    /* =====================================================
       APPLY PHONE VISIBILITY
    ===================================================== */

    if (phoneVisible) {

        phoneShell.classList.remove(
            "hidden-phone"
        );

    }

    else {

        phoneShell.classList.add(
            "hidden-phone"
        );

    }


    updatePhoneToggle();


    /* =====================================================
       START AT LOCK SCREEN
    ===================================================== */

    showScreen(
        "lock"
    );

}


/* =========================================================
   START
========================================================= */

initializePhone();
