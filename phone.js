/* =========================================================
   PHONE SETTINGS
========================================================= */

const PHONE_KEY = "brokenPhoneStateV3";

/*
    CHANGE THIS IF YOU WANT A DIFFERENT PASSWORD
*/
const PASSCODE = "0521";


/* =========================================================
   APP FILES
========================================================= */

const appFiles = {

    calls: "calls.html",

    messages: "messages.html",

    gallery: "gallery.html",

    notes: "notes.html",

    contacts: "contacts.html",

    bank: "bank.html",

    settings: "settings.html",

    browser: "browser.html",

    music: "music.html",

    clock: "clock.html",

    camera: "camera.html"

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

    browser: {
        name: "Browser",
        icon: "◉",
        className: "browser-icon"
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

    camera: {
        name: "Camera",
        icon: "◉",
        className: "camera-icon"
    }

};


/* =========================================================
   STATE
========================================================= */

const defaultState = {

    hidden: false,

    unlocked: false,

    currentApp: "home",

    homePage: 0,

    history: []

};


let state = loadState();


function loadState() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(PHONE_KEY)
            );

        return {
            ...defaultState,
            ...(saved || {})
        };

    } catch {

        return {
            ...defaultState
        };

    }

}


function saveState() {

    localStorage.setItem(
        PHONE_KEY,
        JSON.stringify(state)
    );

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
   SCREEN CONTROL
========================================================= */

function showOnly(element) {

    [
        lockScreen,
        passcodeScreen,
        homeScreen,
        appScreen

    ].forEach(screen => {

        screen.classList.add("hidden");

    });

    element.classList.remove("hidden");

}


/* =========================================================
   RENDER
========================================================= */

function render() {

    shell.classList.toggle(
        "hidden-phone",
        state.hidden
    );


    if (state.hidden) {

        toggle.innerHTML = "<span>PHONE</span>";

        return;

    }


    toggle.innerHTML = "<span>HIDE</span>";


    /*
        LOCKED
    */

    if (!state.unlocked) {

        /*
            Do NOT automatically show passcode.
            User must swipe upward.
        */

        showOnly(lockScreen);

        return;

    }


    /*
        HOME
    */

    if (state.currentApp === "home") {

        showOnly(homeScreen);

        updateHomePage();

        return;

    }


    /*
        APP
    */

    showOnly(appScreen);

    loadApp(state.currentApp);

}


/* =========================================================
   LOAD APP
========================================================= */

function loadApp(app) {

    const file = appFiles[app];

    if (!file) return;


    const info = appInfo[app];

    if (info) {

        const icon =
            document.getElementById(
                "appHeaderIcon"
            );

        const name =
            document.getElementById(
                "appHeaderName"
            );


        icon.textContent = info.icon;

        icon.className =
            "header-app-icon " +
            info.className;


        name.textContent =
            info.name;

    }


    /*
        Don't unnecessarily reload
        the same app.
    */

    const currentSource =
        appFrame.getAttribute("src");


    if (!currentSource.endsWith(file)) {

        appFrame.src = file;

    }

}


/* =========================================================
   UNLOCK
========================================================= */

function showPasscode() {

    if (state.unlocked) return;

    showOnly(passcodeScreen);

    clearPasscode();

}


function returnToLock() {

    if (state.unlocked) return;

    showOnly(lockScreen);

}


/* =========================================================
   PASSCODE
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


    let entered = "";


    const keys = [
        "1","2","3",
        "4","5","6",
        "7","8","9",
        "0"
    ];


    keys.forEach(value => {

        const button =
            document.createElement("button");


        button.textContent = value;


        if (value !== "0") {

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


            if (letters[value]) {

                button.innerHTML =
                    value +
                    "<small>" +
                    letters[value] +
                    "</small>";

            }

        }


        button.addEventListener(
            "click",
            () => {

                if (entered.length >= 4)
                    return;


                entered += value;


                dots.forEach(
                    (dot, index) => {

                        dot.classList.toggle(
                            "filled",
                            index <
                            entered.length
                        );

                    }
                );


                if (entered.length === 4) {

                    if (
                        entered === PASSCODE
                    ) {

                        state.unlocked = true;

                        state.currentApp =
                            "home";

                        state.homePage = 0;

                        state.history = [];

                        saveState();

                        entered = "";

                        clearDots();

                        render();

                    } else {

                        document
                            .getElementById(
                                "passcodeError"
                            )
                            .textContent =
                            "Incorrect passcode";


                        setTimeout(() => {

                            entered = "";

                            clearDots();

                            document
                                .getElementById(
                                    "passcodeError"
                                )
                                .textContent = "";

                        }, 700);

                    }

                }

            }
        );


        pad.appendChild(button);

    });


    function clearDots() {

        dots.forEach(dot => {

            dot.classList.remove(
                "filled"
            );

        });

    }


    window.clearPasscode = function() {

        entered = "";

        clearDots();

        document
            .getElementById(
                "passcodeError"
            )
            .textContent = "";

    };

}


setupPasscode();


/* =========================================================
   HOME PAGE SLIDER
========================================================= */

function updateHomePage() {

    const page =
        Math.max(
            0,
            Math.min(
                2,
                state.homePage
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


    saveState();

}


/* =========================================================
   NEXT / PREVIOUS PAGE
========================================================= */

function nextHomePage() {

    if (state.homePage >= 2)
        return;


    state.homePage++;

    updateHomePage();

}


function previousHomePage() {

    if (state.homePage <= 0)
        return;


    state.homePage--;

    updateHomePage();

}


/* =========================================================
   TOUCH SWIPES
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;


function startTouch(event) {

    const touch =
        event.touches[0];


    touchStartX =
        touch.clientX;

    touchStartY =
        touch.clientY;

}


function endTouch(event) {

    const touch =
        event.changedTouches[0];


    touchEndX =
        touch.clientX;

    touchEndY =
        touch.clientY;


    handleSwipe();

}


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
        LOCK SCREEN:
        SWIPE UP
    */

    if (
        !state.unlocked &&
        lockScreen &&
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
        PASSCODE:
        SWIPE DOWN
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
        HOME:
        HORIZONTAL SWIPE
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

            } else {

                previousHomePage();

            }

        }

    }

}


/* Lock screen */

lockScreen.addEventListener(
    "touchstart",
    startTouch,
    {passive:true}
);

lockScreen.addEventListener(
    "touchend",
    endTouch,
    {passive:true}
);


/* Passcode */

passcodeScreen.addEventListener(
    "touchstart",
    startTouch,
    {passive:true}
);

passcodeScreen.addEventListener(
    "touchend",
    endTouch,
    {passive:true}
);


/* Home */

homeScreen.addEventListener(
    "touchstart",
    startTouch,
    {passive:true}
);

homeScreen.addEventListener(
    "touchend",
    endTouch,
    {passive:true}
);


/* =========================================================
   MOUSE SWIPE SUPPORT
   Useful when testing on PC
========================================================= */

let mouseDown = false;


homeScreen.addEventListener(
    "mousedown",
    event => {

        mouseDown = true;

        touchStartX =
            event.clientX;

        touchStartY =
            event.clientY;

    }
);


homeScreen.addEventListener(
    "mouseup",
    event => {

        if (!mouseDown) return;

        mouseDown = false;

        touchEndX =
            event.clientX;

        touchEndY =
            event.clientY;

        handleSwipe();

    }
);


lockScreen.addEventListener(
    "mousedown",
    event => {

        mouseDown = true;

        touchStartX =
            event.clientX;

        touchStartY =
            event.clientY;

    }
);


lockScreen.addEventListener(
    "mouseup",
    event => {

        if (!mouseDown) return;

        mouseDown = false;

        touchEndX =
            event.clientX;

        touchEndY =
            event.clientY;

        handleSwipe();

    }
);


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

    if (!state.unlocked)
        return;

    if (!appFiles[app])
        return;


    if (
        state.currentApp !== "home" &&
        state.currentApp !== app
    ) {

        state.history.push(
            state.currentApp
        );

    } else if (
        state.currentApp === "home"
    ) {

        state.history.push(
            "home"
        );

    }


    state.currentApp = app;

    saveState();

    render();

}


/* =========================================================
   APP BACK BUTTON
========================================================= */

appBack.addEventListener(
    "click",
    () => {

        goBack();

    }
);


function goBack() {

    if (
        state.currentApp === "home"
    ) {

        return;

    }


    const previous =
        state.history.pop() ||
        "home";


    state.currentApp =
        previous;


    saveState();

    render();

}


/* =========================================================
   PHONE HIDE BUTTON
========================================================= */

toggle.addEventListener(
    "click",
    () => {

        state.hidden =
            !state.hidden;


        if (state.hidden) {

            /*
                Hiding the phone
                locks it again.
            */

            state.unlocked = false;

            state.currentApp =
                "home";

            state.homePage = 0;

            state.history = [];

        }


        saveState();

        render();

    }
);


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


    /*
        LOCK
    */

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
        lockTime.textContent = time;


    if (lockStatus)
        lockStatus.textContent = time;


    if (lockDate)
        lockDate.textContent =
            `${weekday}, ${month} ${day}`;


    /*
        PASSCODE
    */

    const passcodeTime =
        document.getElementById(
            "passcodeTime"
        );


    if (passcodeTime)
        passcodeTime.textContent =
            time;


    /*
        HOME
    */

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


    /*
        DATE WIDGET
    */

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
   MESSAGES FROM OTHER APP FILES
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

            state.history = [];

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

            state.hidden = true;

            state.unlocked = false;

            state.currentApp =
                "home";

            state.homePage = 0;

            state.history = [];

            saveState();

            render();

        }

    }
);


/* =========================================================
   START
========================================================= */

render();
