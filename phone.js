/* =========================================================
   BROKEN PHONE — PHONE SYSTEM
   ALL HTML FILES ARE IN THE SAME GITHUB ROOT FOLDER
========================================================= */

const PHONE_KEY = "brokenPhoneStateV4";

/* =========================================================
   PASSWORD
========================================================= */

const PASSCODE = "0521";


/* =========================================================
   APP FILES
   IMPORTANT:
   Every file is directly in the GitHub repository.
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
    clock: "clock.html"

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
        icon: "●",
        className: "messages-icon"
    },

    gallery: {
        name: "Gallery",
        icon: "✿",
        className: "gallery-icon"
    },

    notes: {
        name: "Notes",
        icon: "✉",
        className: "notes-icon"
    },

    contacts: {
        name: "Contacts",
        icon: "♟",
        className: "contacts-icon"
    },

    browser: {
        name: "Browser",
        icon: "◉",
        className: "browser-icon"
    },

    camera: {
        name: "Camera",
        icon: "◉",
        className: "camera-icon"
    },

    bank: {
        name: "Bank",
        icon: "$",
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
    }

};


/* =========================================================
   DEFAULT STATE
========================================================= */

const defaultState = {

    hidden: false,

    unlocked: false,

    currentApp: "home",

    homePage: 0,

    history: []

};


/* =========================================================
   LOAD STATE
========================================================= */

let state = loadState();


function loadState() {

    try {

        const saved =
            localStorage.getItem(PHONE_KEY);

        if (!saved) {

            return {
                ...defaultState
            };

        }

        const parsed =
            JSON.parse(saved);

        return {

            ...defaultState,

            ...parsed,

            history:
                Array.isArray(parsed.history)
                    ? parsed.history
                    : []

        };

    }

    catch (error) {

        console.error(
            "Could not load phone state:",
            error
        );

        return {
            ...defaultState
        };

    }

}


/* =========================================================
   SAVE STATE
========================================================= */

function saveState() {

    try {

        localStorage.setItem(
            PHONE_KEY,
            JSON.stringify(state)
        );

    }

    catch (error) {

        console.error(
            "Could not save phone state:",
            error
        );

    }

}


/* =========================================================
   ELEMENTS
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

const homePages =
    document.getElementById("homePages");

const pageDots =
    [...document.querySelectorAll(".page-dots span")];

const appBack =
    document.getElementById("appBack");


/* =========================================================
   SAFETY CHECK
========================================================= */

if (!shell) {

    console.error(
        "ERROR: #phoneShell was not found."
    );

}


/* =========================================================
   SHOW ONLY ONE SCREEN
========================================================= */

function showOnly(element) {

    const screens = [

        lockScreen,
        passcodeScreen,
        homeScreen,
        appScreen

    ];


    screens.forEach(screen => {

        if (screen) {

            screen.classList.add(
                "hidden"
            );

        }

    });


    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   RENDER PHONE
========================================================= */

function render() {

    if (!shell) return;


    /*
       PHONE HIDDEN
    */

    shell.classList.toggle(
        "hidden-phone",
        state.hidden
    );


    if (state.hidden) {

        if (toggle) {

            toggle.innerHTML =
                "<span>PHONE</span>";

        }

        return;

    }


    /*
       PHONE VISIBLE
    */

    if (toggle) {

        toggle.innerHTML =
            "<span>HIDE</span>";

    }


    /*
       LOCKED
    */

    if (!state.unlocked) {

        showOnly(lockScreen);

        return;

    }


    /*
       HOME
    */

    if (
        state.currentApp === "home"
    ) {

        showOnly(homeScreen);

        updateHomePage();

        return;

    }


    /*
       APP
    */

    showOnly(appScreen);

    loadApp(
        state.currentApp
    );

}


/* =========================================================
   LOAD APP
========================================================= */

function loadApp(app) {

    if (!appFrame) {

        console.error(
            "ERROR: appFrame was not found."
        );

        return;

    }


    const file =
        appFiles[app];


    /*
       APP DOES NOT EXIST
    */

    if (!file) {

        console.error(
            "No HTML file configured for:",
            app
        );

        appFrame.removeAttribute(
            "src"
        );

        return;

    }


    /*
       APP HEADER
    */

    const info =
        appInfo[app];


    if (info) {

        const icon =
            document.getElementById(
                "appHeaderIcon"
            );

        const name =
            document.getElementById(
                "appHeaderName"
            );


        if (icon) {

            icon.textContent =
                info.icon;

            icon.className =
                "header-app-icon " +
                info.className;

        }


        if (name) {

            name.textContent =
                info.name;

        }

    }


    /*
       IMPORTANT FIX:
       Don't call .endsWith() on null.
    */

    const currentSource =
        appFrame.getAttribute("src") || "";


    /*
       Only change iframe when necessary.
    */

    if (
        !currentSource.endsWith(file)
    ) {

        appFrame.src =
            file;

    }

}


/* =========================================================
   SHOW PASSCODE
========================================================= */

function showPasscode() {

    if (state.unlocked) return;

    showOnly(
        passcodeScreen
    );

    if (
        typeof clearPasscode ===
        "function"
    ) {

        clearPasscode();

    }

}


/* =========================================================
   RETURN TO LOCK SCREEN
========================================================= */

function returnToLock() {

    if (state.unlocked) return;

    showOnly(
        lockScreen
    );

}


/* =========================================================
   PASSCODE SETUP
========================================================= */

function setupPasscode() {

    const pad =
        document.getElementById(
            "passcodePad"
        );


    const dots =
        [
            ...document.querySelectorAll(
                "#passcodeDots span"
            )
        ];


    const error =
        document.getElementById(
            "passcodeError"
        );


    if (!pad) {

        console.error(
            "Passcode pad not found."
        );

        return;

    }


    let entered = "";


    /*
       Prevent duplicate keypad creation
       if the script somehow initializes twice.
    */

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
            document.createElement(
                "button"
            );


        if (letters[value]) {

            button.innerHTML =
                value +
                "<small>" +
                letters[value] +
                "</small>";

        }

        else {

            button.textContent =
                value;

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


                /*
                   CHECK PASSWORD
                */

                if (
                    entered.length ===
                    PASSCODE.length
                ) {

                    if (
                        entered ===
                        PASSCODE
                    ) {

                        state.unlocked =
                            true;

                        state.currentApp =
                            "home";

                        state.homePage =
                            0;

                        state.history =
                            [];

                        saveState();


                        entered = "";

                        updateDots();

                        if (error) {

                            error.textContent =
                                "";

                        }


                        render();

                    }

                    else {

                        if (error) {

                            error.textContent =
                                "Incorrect passcode";

                        }


                        setTimeout(
                            () => {

                                entered = "";

                                updateDots();

                                if (error) {

                                    error.textContent =
                                        "";

                                }

                            },
                            700
                        );

                    }

                }

            }
        );


        pad.appendChild(
            button
        );

    });


    function updateDots() {

        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "filled",
                    index <
                    entered.length
                );

            }
        );

    }


    window.clearPasscode =
        function() {

            entered = "";

            updateDots();

            if (error) {

                error.textContent =
                    "";

            }

        };

}


setupPasscode();


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


    state.homePage =
        page;


    homePages.style.transform =
        "translateX(-" +
        (page * 33.333333) +
        "%)";


    pageDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === page
            );

        }
    );


    saveState();

}


/* =========================================================
   NEXT PAGE
========================================================= */

function nextHomePage() {

    if (
        state.homePage >= 2
    ) {

        return;

    }


    state.homePage++;

    updateHomePage();

}


/* =========================================================
   PREVIOUS PAGE
========================================================= */

function previousHomePage() {

    if (
        state.homePage <= 0
    ) {

        return;

    }


    state.homePage--;

    updateHomePage();

}


/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;


function startTouch(event) {

    if (
        !event.touches ||
        !event.touches[0]
    ) {

        return;

    }


    const touch =
        event.touches[0];


    touchStartX =
        touch.clientX;

    touchStartY =
        touch.clientY;

}


function endTouch(event) {

    if (
        !event.changedTouches ||
        !event.changedTouches[0]
    ) {

        return;

    }


    const touch =
        event.changedTouches[0];


    touchEndX =
        touch.clientX;

    touchEndY =
        touch.clientY;


    handleSwipe();

}


/* =========================================================
   HANDLE SWIPE
========================================================= */

function handleSwipe() {

    const deltaX =
        touchEndX -
        touchStartX;

    const deltaY =
        touchEndY -
        touchStartY;


    const absX =
        Math.abs(deltaX);

    const absY =
        Math.abs(deltaY);


    /*
       LOCK SCREEN → SWIPE UP
    */

    if (
        !state.unlocked &&
        lockScreen &&
        !lockScreen.classList.contains(
            "hidden"
        )
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
       PASSCODE → SWIPE DOWN
    */

    if (
        !state.unlocked &&
        passcodeScreen &&
        !passcodeScreen.classList.contains(
            "hidden"
        )
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
       HOME → HORIZONTAL
    */

    if (
        state.unlocked &&
        state.currentApp === "home"
    ) {

        if (
            absX > 60 &&
            absX > absY
        ) {

            if (deltaX < 0) {

                nextHomePage();

            }

            else {

                previousHomePage();

            }

        }

    }

}


/* =========================================================
   TOUCH EVENTS
========================================================= */

if (lockScreen) {

    lockScreen.addEventListener(
        "touchstart",
        startTouch,
        { passive: true }
    );

    lockScreen.addEventListener(
        "touchend",
        endTouch,
        { passive: true }
    );

}


if (passcodeScreen) {

    passcodeScreen.addEventListener(
        "touchstart",
        startTouch,
        { passive: true }
    );

    passcodeScreen.addEventListener(
        "touchend",
        endTouch,
        { passive: true }
    );

}


if (homeScreen) {

    homeScreen.addEventListener(
        "touchstart",
        startTouch,
        { passive: true }
    );

    homeScreen.addEventListener(
        "touchend",
        endTouch,
        { passive: true }
    );

}


/* =========================================================
   MOUSE SWIPE SUPPORT
========================================================= */

let mouseDown = false;


function mouseStart(event) {

    mouseDown = true;

    touchStartX =
        event.clientX;

    touchStartY =
        event.clientY;

}


function mouseEnd(event) {

    if (!mouseDown) return;

    mouseDown = false;

    touchEndX =
        event.clientX;

    touchEndY =
        event.clientY;

    handleSwipe();

}


if (homeScreen) {

    homeScreen.addEventListener(
        "mousedown",
        mouseStart
    );

    homeScreen.addEventListener(
        "mouseup",
        mouseEnd
    );

}


if (lockScreen) {

    lockScreen.addEventListener(
        "mousedown",
        mouseStart
    );

    lockScreen.addEventListener(
        "mouseup",
        mouseEnd
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
            () => {

                const app =
                    button.dataset.app;

                openApp(app);

            }
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
       SAVE CURRENT SCREEN
       FOR BACK BUTTON
    */

    if (
        state.currentApp !== app
    ) {

        state.history.push(
            state.currentApp
        );

    }


    state.currentApp =
        app;


    saveState();

    render();

}


/* =========================================================
   APP BACK
========================================================= */

if (appBack) {

    appBack.addEventListener(
        "click",
        goBack
    );

}


function goBack() {

    if (
        state.currentApp ===
        "home"
    ) {

        return;

    }


    const previous =
        state.history.pop();


    state.currentApp =
        previous || "home";


    saveState();

    render();

}


/* =========================================================
   HIDE PHONE
========================================================= */

if (toggle) {

    toggle.addEventListener(
        "click",
        () => {

            state.hidden =
                !state.hidden;


            if (state.hidden) {

                /*
                   Hiding the phone resets
                   the phone to the lock screen.
                */

                state.unlocked =
                    false;

                state.currentApp =
                    "home";

                state.homePage =
                    0;

                state.history =
                    [];

            }


            saveState();

            render();

        }
    );

}


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


    const monthUpper =
        month.toUpperCase();


    const lockTime =
        document.getElementById(
            "lockTime"
        );

    const lockStatus =
        document.getElementById(
            "lockStatusTime"
        );

    const lockDate =
        document.getElementById(
            "lockDate"
        );


    if (lockTime)
        lockTime.textContent =
            time;


    if (lockStatus)
        lockStatus.textContent =
            time;


    if (lockDate)
        lockDate.textContent =
            `${weekday}, ${month} ${day}`;


    const passcodeTime =
        document.getElementById(
            "passcodeTime"
        );


    if (passcodeTime)
        passcodeTime.textContent =
            time;


    const homeTime =
        document.getElementById(
            "homeTime"
        );

    const bigTime =
        document.getElementById(
            "homeBigTime"
        );


    if (homeTime)
        homeTime.textContent =
            time;


    if (bigTime)
        bigTime.textContent =
            time;


    const dayName =
        document.getElementById(
            "dayName"
        );

    const monthName =
        document.getElementById(
            "monthName"
        );

    const dayNumber =
        document.getElementById(
            "dayNumber"
        );


    if (dayName)
        dayName.textContent =
            weekday;


    if (monthName)
        monthName.textContent =
            monthUpper;


    if (dayNumber)
        dayNumber.textContent =
            day;

}


updateClock();


setInterval(
    updateClock,
    1000
);


/* =========================================================
   MESSAGES FROM CHILD APPS
========================================================= */

window.addEventListener(
    "message",
    event => {

        const data =
            event.data || {};


        if (
            data.type ===
            "PHONE_HOME"
        ) {

            state.currentApp =
                "home";

            state.history =
                [];

            saveState();

            render();

        }


        if (
            data.type ===
            "PHONE_BACK"
        ) {

            goBack();

        }


        if (
            data.type ===
            "PHONE_OPEN_APP"
        ) {

            openApp(
                data.app
            );

        }


        if (
            data.type ===
            "PHONE_HIDE"
        ) {

            state.hidden =
                true;

            state.unlocked =
                false;

            state.currentApp =
                "home";

            state.homePage =
                0;

            state.history =
                [];

            saveState();

            render();

        }

    }
);


/* =========================================================
   START
========================================================= */

render();
