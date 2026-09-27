/* =========================================================
   BROKEN PHONE
   PHONE SYSTEM
   ========================================================= */

const PHONE_KEY = "brokenPhoneStateV6";
const PASSCODE = "0521";

/* =========================================================
   APP FILES
   All files are directly in the GitHub root.
   ========================================================= */

const appFiles = {
    calls: "calls.html",
    messages: "messages.html",
    gallery: "gallery.html",
    notes: "notes.html",
    contacts: "contacts.html",
    browser: "browser.html",
    camera: "camera.html",
    bank: "bank.html",
    settings: "settings.html",
    music: "music.html",
    clock: "clock.html",
    "victim-info": "victim-info.html"
};


/* =========================================================
   APP INFORMATION
   ========================================================= */

const appInfo = {

    calls: {
        name: "Phone",
        icon: "☎",
        className: "phone-icon"
    },

    messages: {
        name: "Messages",
        icon: "▢",
        className: "messages-icon"
    },

    gallery: {
        name: "Gallery",
        icon: "◇",
        className: "gallery-icon"
    },

    notes: {
        name: "Notes",
        icon: "▤",
        className: "notes-icon"
    },

    contacts: {
        name: "Contacts",
        icon: "○",
        className: "contacts-icon"
    },

    browser: {
        name: "Browser",
        icon: "⌕",
        className: "browser-icon"
    },

    camera: {
        name: "Camera",
        icon: "▣",
        className: "camera-icon"
    },

    bank: {
        name: "Bank",
        icon: "▤",
        className: "bank-icon"
    },

    settings: {
        name: "Settings",
        icon: "⚙",
        className: "settings-icon"
    },

    music: {
        name: "Music",
        icon: "♪",
        className: "music-icon"
    },

    clock: {
        name: "Clock",
        icon: "◷",
        className: "clock-icon"
    },

    "victim-info": {
        name: "Victim Info",
        icon: "▤",
        className: "victim-icon"
    }
};


/* =========================================================
   DEFAULT STATE
   ========================================================= */

const defaultState = {

    hidden: false,

    /*
       IMPORTANT:
       The phone starts LOCKED every time phone.html is loaded.
    */
    unlocked: false,

    currentApp: "home",

    homePage: 0,

    history: []
};


/* =========================================================
   LOAD STATE
   ========================================================= */

function loadState() {

    try {

        const saved = localStorage.getItem(PHONE_KEY);

        if (!saved) {
            return {
                ...defaultState
            };
        }

        const parsed = JSON.parse(saved);

        return {

            ...defaultState,

            /*
               DO NOT restore unlocked state.
               Opening phone.html always requires password.
            */
            unlocked: false,

            hidden: Boolean(parsed.hidden),

            currentApp: "home",

            homePage: 0,

            history: []

        };

    } catch (error) {

        console.error(
            "Could not load phone state:",
            error
        );

        return {
            ...defaultState
        };
    }
}


let state = loadState();


/* =========================================================
   DOM
   ========================================================= */

const shell =
    document.getElementById("phoneShell");

const lockScreen =
    document.getElementById("lockScreen");

const passcodeScreen =
    document.getElementById("passcodeScreen");

const homeScreen =
    document.getElementById("homeScreen");

const appScreen =
    document.getElementById("appScreen");

const appFrame =
    document.getElementById("appFrame");

const toggle =
    document.getElementById("phoneToggle");

const victimInfoButton =
    document.getElementById("victimInfoButton");

const homePages =
    document.getElementById("homePages");

const pageDots =
    [...document.querySelectorAll(".page-dots span")];

const appBack =
    document.getElementById("appBack");

const navBack =
    document.getElementById("navBack");

const navHome =
    document.getElementById("navHome");

const navRecent =
    document.getElementById("navRecent");

const androidNav =
    document.getElementById("androidNav");

const recentPanel =
    document.getElementById("recentPanel");

const recentList =
    document.getElementById("recentList");

const closeRecent =
    document.getElementById("closeRecent");

const appSearch =
    document.getElementById("appSearch");

const clearSearch =
    document.getElementById("clearSearch");

const searchResults =
    document.getElementById("searchResults");


/* =========================================================
   SAVE
   ========================================================= */

function saveState() {

    try {

        localStorage.setItem(
            PHONE_KEY,
            JSON.stringify({
                hidden: state.hidden
            })
        );

    } catch (error) {

        console.error(
            "Could not save phone state:",
            error
        );
    }
}


/* =========================================================
   SHOW ONE SCREEN
   ========================================================= */

function showOnly(element) {

    [
        lockScreen,
        passcodeScreen,
        homeScreen,
        appScreen
    ].forEach(screen => {

        if (screen) {
            screen.classList.add("hidden");
        }

    });

    if (element) {
        element.classList.remove("hidden");
    }
}


/* =========================================================
   RENDER
   ========================================================= */

function render() {

    if (!shell) return;


    shell.classList.toggle(
        "hidden-phone",
        state.hidden
    );


    if (state.hidden) {

        if (toggle) {
            toggle.textContent = "SHOW PHONE";
        }

        return;
    }


    if (toggle) {
        toggle.textContent = "HIDE PHONE";
    }


    /*
       LOCKED
    */

    if (!state.unlocked) {

        showOnly(lockScreen);

        if (androidNav) {
            androidNav.classList.add("hidden");
        }

        return;
    }


    /*
       HOME
    */

    if (state.currentApp === "home") {

        showOnly(homeScreen);

        updateHomePage();

        if (androidNav) {
            androidNav.classList.remove("hidden");
        }

        return;
    }


    /*
       APP
    */

    showOnly(appScreen);

    if (androidNav) {
        androidNav.classList.add("hidden");
    }

    loadApp(state.currentApp);
}


/* =========================================================
   LOAD APP
   ========================================================= */

function loadApp(app) {

    if (!appFrame) return;

    const file = appFiles[app];

    if (!file) {

        console.error(
            "Unknown app:",
            app
        );

        appFrame.removeAttribute("src");

        return;
    }


    const info = appInfo[app];


    if (info) {

        const icon =
            document.getElementById("appHeaderIcon");

        const name =
            document.getElementById("appHeaderName");


        if (icon) {

            icon.textContent = info.icon;

            icon.className =
                "header-app-icon " +
                info.className;
        }


        if (name) {
            name.textContent = info.name;
        }
    }


    const current =
        appFrame.getAttribute("src") || "";


    if (!current.endsWith(file)) {

        appFrame.src = file;
    }
}


/* =========================================================
   PASSCODE
   ========================================================= */

function showPasscode() {

    if (state.unlocked) {
        return;
    }

    showOnly(passcodeScreen);

    if (
        typeof window.clearPasscode ===
        "function"
    ) {
        window.clearPasscode();
    }
}


function returnToLock() {

    if (state.unlocked) {
        return;
    }

    showOnly(lockScreen);
}


/* =========================================================
   PASSCODE PAD
   ========================================================= */

function setupPasscode() {

    const pad =
        document.getElementById("passcodePad");

    const dots =
        [
            ...document.querySelectorAll(
                "#passcodeDots span"
            )
        ];

    const error =
        document.getElementById("passcodeError");


    if (!pad) return;


    let entered = "";

    pad.innerHTML = "";


    const keys = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0"
    ];


    const letters = {

        "2": "ABC",
        "3": "DEF",
        "4": "GHI",
        "5": "JKL",
        "6": "MNO",
        "7": "PQRS",
        "8": "TUV",
        "9": "WXYZ"

    };


    keys.forEach(value => {

        const button =
            document.createElement("button");


        if (letters[value]) {

            button.innerHTML =
                `${value}<small>${letters[value]}</small>`;

        } else {

            button.textContent = value;
        }


        button.addEventListener(
            "click",
            () => {

                if (
                    entered.length >=
                    PASSCODE.length
                ) {
                    return;
                }


                entered += value;

                updateDots();


                if (
                    entered.length !==
                    PASSCODE.length
                ) {
                    return;
                }


                /*
                   CORRECT PASSWORD
                */

                if (entered === PASSCODE) {

                    state.unlocked = true;

                    state.currentApp = "home";

                    state.homePage = 0;

                    state.history = [];

                    entered = "";

                    updateDots();

                    if (error) {
                        error.textContent = "";
                    }

                    /*
                       Do NOT save unlocked=true.
                       This means reopening phone.html
                       requires password again.
                    */

                    saveState();

                    render();

                } else {

                    if (error) {
                        error.textContent =
                            "Incorrect passcode";
                    }


                    setTimeout(() => {

                        entered = "";

                        updateDots();

                        if (error) {
                            error.textContent = "";
                        }

                    }, 700);
                }

            }
        );


        pad.appendChild(button);

    });


    function updateDots() {

        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "filled",
                    index < entered.length
                );

            }
        );
    }


    window.clearPasscode = () => {

        entered = "";

        updateDots();

        if (error) {
            error.textContent = "";
        }
    };
}


/* =========================================================
   HOME PAGE
   ========================================================= */

function updateHomePage() {

    if (!homePages) return;


    const page =
        Math.max(
            0,
            Math.min(
                2,
                Number(state.homePage) || 0
            )
        );


    state.homePage = page;


    homePages.style.transform =
        `translateX(-${page * 33.333333}%)`;


    pageDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === page
            );

        }
    );
}


function nextHomePage() {

    if (state.homePage >= 2) {
        return;
    }

    state.homePage++;

    updateHomePage();
}


function previousHomePage() {

    if (state.homePage <= 0) {
        return;
    }

    state.homePage--;

    updateHomePage();
}


/* =========================================================
   TOUCH / SWIPE
   ========================================================= */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;


function startTouch(event) {

    if (!event.touches?.[0]) {
        return;
    }

    touchStartX =
        event.touches[0].clientX;

    touchStartY =
        event.touches[0].clientY;
}


function endTouch(event) {

    if (!event.changedTouches?.[0]) {
        return;
    }

    touchEndX =
        event.changedTouches[0].clientX;

    touchEndY =
        event.changedTouches[0].clientY;

    handleSwipe();
}


function handleSwipe() {

    const deltaX =
        touchEndX - touchStartX;

    const deltaY =
        touchEndY - touchStartY;

    const absX =
        Math.abs(deltaX);

    const absY =
        Math.abs(deltaY);


    /*
       LOCK SCREEN
    */

    if (
        !state.unlocked &&
        !lockScreen.classList.contains("hidden")
    ) {

        if (
            deltaY < -60 &&
            absY > absX
        ) {
            showPasscode();
        }

        return;
    }


    /*
       PASSCODE SCREEN
    */

    if (
        !state.unlocked &&
        !passcodeScreen.classList.contains("hidden")
    ) {

        if (
            deltaY > 60 &&
            absY > absX
        ) {
            returnToLock();
        }

        return;
    }


    /*
       HOME SCREEN
    */

    if (
        state.unlocked &&
        state.currentApp === "home" &&
        absX > 60 &&
        absX > absY
    ) {

        if (deltaX < 0) {
            nextHomePage();
        } else {
            previousHomePage();
        }
    }
}


[
    lockScreen,
    passcodeScreen,
    homeScreen
].forEach(screen => {

    if (!screen) return;

    screen.addEventListener(
        "touchstart",
        startTouch,
        { passive: true }
    );

    screen.addEventListener(
        "touchend",
        endTouch,
        { passive: true }
    );
});


/* =========================================================
   MOUSE SWIPE
   ========================================================= */

let mouseDown = false;


function mouseStart(event) {

    mouseDown = true;

    touchStartX = event.clientX;

    touchStartY = event.clientY;
}


function mouseEnd(event) {

    if (!mouseDown) {
        return;
    }

    mouseDown = false;

    touchEndX = event.clientX;

    touchEndY = event.clientY;

    handleSwipe();
}


[
    homeScreen,
    lockScreen,
    passcodeScreen
].forEach(screen => {

    if (!screen) return;

    screen.addEventListener(
        "mousedown",
        mouseStart
    );

    screen.addEventListener(
        "mouseup",
        mouseEnd
    );
});


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp(app) {

    if (!state.unlocked) {
        return;
    }


    if (!appFiles[app]) {

        console.error(
            "Unknown app:",
            app
        );

        return;
    }


    /*
       Save the current app in history.
    */

    if (
        state.currentApp !== app &&
        state.currentApp !== "home"
    ) {

        state.history.push(
            state.currentApp
        );
    }


    state.currentApp = app;


    closeRecentPanel();

    clearSearchResults();

    render();
}


/* =========================================================
   BACK INSIDE PHONE
   ========================================================= */

function goBack() {

    /*
       IMPORTANT:
       THIS FUNCTION NEVER LOCKS THE PHONE.
    */

    if (!state.unlocked) {
        return;
    }


    /*
       If currently inside an app,
       return to previous app or home.
    */

    if (state.currentApp !== "home") {

        const previous =
            state.history.pop();


        state.currentApp =
            previous || "home";


        closeRecentPanel();

        clearSearchResults();

        render();

        return;
    }


    /*
       If already home, just move between
       home pages rather than locking.
    */

    previousHomePage();
}


/* =========================================================
   HOME BUTTON
   ========================================================= */

function goHome() {

    if (!state.unlocked) {
        return;
    }


    state.currentApp = "home";

    state.history = [];

    state.homePage = 0;

    closeRecentPanel();

    clearSearchResults();

    render();
}


/* =========================================================
   EXPLICITLY CLOSE PHONE
   =========================================================
   
   THIS is one of the ONLY places that locks it.
   ========================================================= */

function closePhone() {

    /*
       Close phone = lock phone.
    */

    state.hidden = true;

    state.unlocked = false;

    state.currentApp = "home";

    state.homePage = 0;

    state.history = [];


    closeRecentPanel();

    clearSearchResults();


    saveState();

    render();
}


/* =========================================================
   SHOW PHONE
   ========================================================= */

function showPhone() {

    state.hidden = false;

    /*
       ALWAYS start locked after closing.
    */

    state.unlocked = false;

    state.currentApp = "home";

    state.homePage = 0;

    state.history = [];


    saveState();

    render();
}


/* =========================================================
   OUTSIDE PHONE BUTTON
   ========================================================= */

if (toggle) {

    toggle.addEventListener(
        "click",
        () => {

            if (state.hidden) {

                showPhone();

            } else {

                closePhone();

            }

        }
    );
}


/* =========================================================
   VICTIM INFO
   ========================================================= */

if (victimInfoButton) {

    victimInfoButton.addEventListener(
        "click",
        () => {

            if (!state.unlocked) {
                return;
            }

            openApp("victim-info");

        }
    );
}


/* =========================================================
   APP BACK BUTTON
   ========================================================= */

if (appBack) {

    appBack.addEventListener(
        "click",
        goBack
    );
}


/* =========================================================
   ANDROID NAVIGATION
   ========================================================= */

if (navBack) {

    navBack.addEventListener(
        "click",
        () => {

            /*
               Android back DOES NOT lock phone.
            */

            goBack();

        }
    );
}


if (navHome) {

    navHome.addEventListener(
        "click",
        () => {

            /*
               Home DOES NOT lock phone.
            */

            goHome();

        }
    );
}


if (navRecent) {

    navRecent.addEventListener(
        "click",
        openRecentPanel
    );
}


/* =========================================================
   RECENT APPS
   ========================================================= */

function openRecentPanel() {

    if (
        !state.unlocked ||
        !recentPanel
    ) {
        return;
    }


    buildRecentApps();

    recentPanel.classList.remove(
        "hidden"
    );
}


function closeRecentPanel() {

    if (recentPanel) {

        recentPanel.classList.add(
            "hidden"
        );
    }
}


function buildRecentApps() {

    if (!recentList) {
        return;
    }


    recentList.innerHTML = "";


    const apps = [
        ...state.history
    ];


    if (state.currentApp !== "home") {

        apps.unshift(
            state.currentApp
        );
    }


    const uniqueApps = [];


    apps.forEach(app => {

        if (
            app &&
            app !== "home" &&
            appFiles[app] &&
            !uniqueApps.includes(app)
        ) {

            uniqueApps.push(app);
        }

    });


    if (!uniqueApps.length) {

        const empty =
            document.createElement("div");

        empty.className =
            "recent-card";

        empty.textContent =
            "No recent apps";

        recentList.appendChild(
            empty
        );

        return;
    }


    uniqueApps.forEach(app => {

        const info =
            appInfo[app];

        if (!info) {
            return;
        }


        const card =
            document.createElement("div");

        card.className =
            "recent-card";


        const button =
            document.createElement("button");

        button.className =
            "recent-open";


        button.innerHTML =
            `
            <span class="real-icon ${info.className}">
                ${info.icon}
            </span>

            <span>
                ${info.name}
            </span>
            `;


        button.addEventListener(
            "click",
            () => {

                state.currentApp =
                    app;

                closeRecentPanel();

                render();

            }
        );


        card.appendChild(button);

        recentList.appendChild(card);

    });
}


if (closeRecent) {

    closeRecent.addEventListener(
        "click",
        closeRecentPanel
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

function performSearch() {

    if (
        !appSearch ||
        !searchResults
    ) {
        return;
    }


    const query =
        appSearch.value
            .trim()
            .toLowerCase();


    searchResults.innerHTML = "";


    if (!query) {

        clearSearchResults();

        return;
    }


    const matches =
        Object.keys(appInfo)
            .filter(app => {

                const name =
                    appInfo[app]
                        .name
                        .toLowerCase();

                return (
                    name.includes(query) ||
                    app.includes(query)
                );

            });


    if (!matches.length) {

        const empty =
            document.createElement("div");

        empty.className =
            "search-result";

        empty.textContent =
            "No apps found";

        searchResults.appendChild(
            empty
        );

        searchResults.classList.remove(
            "hidden"
        );

        return;
    }


    matches.forEach(app => {

        const info =
            appInfo[app];


        const button =
            document.createElement("button");

        button.className =
            "search-result";


        button.innerHTML =
            `
            <span class="real-icon ${info.className}">
                ${info.icon}
            </span>

            <span>
                ${info.name}
            </span>
            `;


        button.addEventListener(
            "click",
            () => openApp(app)
        );


        searchResults.appendChild(
            button
        );

    });


    searchResults.classList.remove(
        "hidden"
    );
}


function clearSearchResults() {

    if (!searchResults) {
        return;
    }

    searchResults.innerHTML = "";

    searchResults.classList.add(
        "hidden"
    );
}


if (appSearch) {

    appSearch.addEventListener(
        "input",
        performSearch
    );


    appSearch.addEventListener(
        "focus",
        () => {

            if (
                appSearch.value.trim()
            ) {
                performSearch();
            }

        }
    );


    appSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                const first =
                    searchResults?.querySelector(
                        ".search-result"
                    );

                if (first) {
                    first.click();
                }

            }

        }
    );
}


if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            if (appSearch) {

                appSearch.value = "";

                appSearch.focus();

            }

            clearSearchResults();

        }
    );
}


/* =========================================================
   APP BUTTONS
   ========================================================= */

document
    .querySelectorAll("[data-app]")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openApp(
                    button.dataset.app
                );

            }
        );

    });


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );


    const weekday =
        now.toLocaleDateString(
            [],
            {
                weekday: "long"
            }
        );


    const month =
        now.toLocaleDateString(
            [],
            {
                month: "long"
            }
        );


    const day =
        now.toLocaleDateString(
            [],
            {
                day: "numeric"
            }
        );


    const elements = {

        lockTime: time,

        lockStatusTime: time,

        lockDate:
            `${weekday}, ${month} ${day}`,

        passcodeTime: time,

        homeStatusTime: time,

        homeBigTime: time,

        homeDate:
            `${weekday}, ${month} ${day}`

    };


    Object.entries(elements)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.textContent =
                        value;
                }

            }
        );
}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   MESSAGES FROM OTHER PAGES
   ========================================================= */

window.addEventListener(
    "message",
    event => {

        const data =
            event.data || {};


        /*
           RETURN HOME

           This NEVER locks the phone.
        */

        if (
            data.type ===
            "PHONE_HOME"
        ) {

            goHome();

            return;
        }


        /*
           BACK

           This NEVER locks the phone.
        */

        if (
            data.type ===
            "PHONE_BACK"
        ) {

            goBack();

            return;
        }


        /*
           OPEN APP
        */

        if (
            data.type ===
                "PHONE_OPEN_APP" &&
            data.app
        ) {

            openApp(
                data.app
            );

            return;
        }


        /*
           PHONE_CLOSE

           Only an explicit CLOSE command
           is allowed to hide/lock the phone.
        */

        if (
            data.type ===
                "PHONE_CLOSE"
        ) {

            closePhone();

            return;
        }


        /*
           OLD PHONE_HIDE messages are
           intentionally ignored.

           This prevents an app's own Back
           button from accidentally locking
           the entire phone.
        */

        if (
            data.type ===
                "PHONE_HIDE"
        ) {

            /*
               DO NOTHING.

               Apps are no longer allowed
               to lock the phone using this
               generic message.
            */

            console.warn(
                "Ignored PHONE_HIDE from app."
            );

            return;
        }


        /*
           REPAIR.HTML CAN EXPLICITLY
           LOCK THE PHONE.
        */

        if (
            data.type ===
                "PHONE_LOCK_AFTER_REPAIR"
        ) {

            closePhone();

            return;
        }

    }
);


/* =========================================================
   START
   ========================================================= */

setupPasscode();

updateClock();

render();
