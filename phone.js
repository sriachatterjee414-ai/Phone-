/* =========================================================
   BROKEN PHONE
   PHONE LOGIC
========================================================= */

const PHONE_KEY = "brokenPhoneStateV6";

const PASSCODE = "0521";


/* =========================================================
   DIRECT ROOT FILES
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
        className: "phone-icon"
    },

    messages: {
        name: "Messages",
        className: "messages-icon"
    },

    gallery: {
        name: "Gallery",
        className: "gallery-icon"
    },

    notes: {
        name: "Notes",
        className: "notes-icon"
    },

    contacts: {
        name: "Contacts",
        className: "contacts-icon"
    },

    browser: {
        name: "Browser",
        className: "browser-icon"
    },

    camera: {
        name: "Camera",
        className: "camera-icon"
    },

    bank: {
        name: "Bank",
        className: "bank-icon"
    },

    settings: {
        name: "Settings",
        className: "settings-icon"
    },

    music: {
        name: "Music",
        className: "music-icon"
    },

    clock: {
        name: "Clock",
        className: "clock-icon"
    }

};


/* =========================================================
   DEFAULT PHONE STATE
========================================================= */

const defaultState = {

    hidden: false,

    unlocked: false,

    currentApp: "home",

    homePage: 0,

    history: []

};


let state = loadState();


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

const toggleText =
    document.getElementById("toggleText");

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
   LOAD STATE
========================================================= */

function loadState(){

    try{

        const saved =
            localStorage.getItem(PHONE_KEY);

        if(!saved){

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

    catch(error){

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

function saveState(){

    try{

        localStorage.setItem(
            PHONE_KEY,
            JSON.stringify(state)
        );

    }

    catch(error){

        console.error(
            "Could not save phone state:",
            error
        );

    }

}


/* =========================================================
   SHOW ONE SCREEN
========================================================= */

function showOnly(element){

    [
        lockScreen,
        passcodeScreen,
        homeScreen,
        appScreen

    ].forEach(screen => {

        if(screen){

            screen.classList.add("hidden");

        }

    });


    if(element){

        element.classList.remove("hidden");

    }

}


/* =========================================================
   LOCK PHONE
========================================================= */

function lockPhone(){

    state.unlocked = false;

    state.currentApp = "home";

    state.homePage = 0;

    state.history = [];

    closeRecentPanel();

    clearSearchResults();

    if(appFrame){

        appFrame.src = "";

    }

    saveState();

    render();

}


/* =========================================================
   RENDER
========================================================= */

function render(){

    if(!shell){

        return;

    }


    shell.classList.toggle(
        "hidden-phone",
        state.hidden
    );


    if(state.hidden){

        toggleText.textContent =
            "OPEN PHONE";

        return;

    }


    toggleText.textContent =
        "CLOSE PHONE";


    /* -------------------------
       LOCKED
    ------------------------- */

    if(!state.unlocked){

        showOnly(lockScreen);

        if(androidNav){

            androidNav.classList.add("hidden");

        }

        return;

    }


    /* -------------------------
       HOME
    ------------------------- */

    if(state.currentApp === "home"){

        showOnly(homeScreen);

        updateHomePage();

        if(androidNav){

            androidNav.classList.remove("hidden");

        }

        return;

    }


    /* -------------------------
       APP
    ------------------------- */

    showOnly(appScreen);

    if(androidNav){

        androidNav.classList.add("hidden");

    }

    loadApp(
        state.currentApp
    );

}


/* =========================================================
   LOAD APP
========================================================= */

function loadApp(app){

    if(!appFrame){

        return;

    }


    const file =
        appFiles[app];


    if(!file){

        console.error(
            "Unknown app:",
            app
        );

        return;

    }


    const info =
        appInfo[app];


    const icon =
        document.getElementById(
            "appHeaderIcon"
        );

    const name =
        document.getElementById(
            "appHeaderName"
        );


    if(info){

        if(icon){

            icon.className =
                "header-app-icon " +
                info.className;

            icon.innerHTML =
                getHeaderIcon(app);

        }


        if(name){

            name.textContent =
                info.name;

        }

    }


    const current =
        appFrame.getAttribute("src") || "";


    if(!current.endsWith(file)){

        appFrame.src = file;

    }

}


/* =========================================================
   HEADER ICON SVG
========================================================= */

function getHeaderIcon(app){

    const icons = {

        calls: `
            <svg viewBox="0 0 24 24">
                <path d="M6.5 3.5l3 3-2 2.2c1.2 2.4 3 4.1 5.3 5.3l2.2-2 3 3c.6.6.6 1.5 0 2.1l-1.4 1.4c-.8.8-2 1.1-3.1.7-4.8-1.7-8.5-5.4-10.2-10.2-.4-1.1-.1-2.3.7-3.1l1.4-1.4c.6-.6 1.5-.6 2.1 0z"/>
            </svg>
        `,

        messages: `
            <svg viewBox="0 0 24 24">
                <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2h9A3.5 3.5 0 0 1 20 5.5v7a3.5 3.5 0 0 1-3.5 3.5H11l-4.5 4v-4.2A3.5 3.5 0 0 1 4 12.5z"/>
            </svg>
        `,

        gallery: `
            <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8" cy="8" r="1.8"/>
                <path d="M4.5 18l5-5 3.5 3 2.5-2.5 4 4.5"/>
            </svg>
        `,

        notes: `
            <svg viewBox="0 0 24 24">
                <rect x="5" y="3" width="14" height="18" rx="2"/>
                <path d="M8 8h8"/>
                <path d="M8 12h8"/>
                <path d="M8 16h5"/>
            </svg>
        `,

        contacts: `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3"/>
                <path d="M6.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6"/>
            </svg>
        `,

        browser: `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8"/>
                <path d="M4 12h16"/>
                <path d="M12 4c2.2 2.3 3.2 5 3.2 8S14.2 17.7 12 20"/>
                <path d="M12 4c-2.2 2.3-3.2 5-3.2 8S9.8 17.7 12 20"/>
            </svg>
        `,

        camera: `
            <svg viewBox="0 0 24 24">
                <path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/>
                <circle cx="12" cy="13" r="4"/>
            </svg>
        `,

        settings: `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19 13.5v-3l-2-.6a7 7 0 0 0-.7-1.7l.9-1.8-2.1-2.1-1.8.9a7 7 0 0 0-1.7-.7L11 2.5h-3l-.6 2a7 7 0 0 0-1.7.7l-1.8-.9-2.1 2.1.9 1.8a7 7 0 0 0-.7 1.7l-2 .6v3l2 .6c.2.6.4 1.2.7 1.7l-.9 1.8 2.1 2.1 1.8-.9c.5.3 1.1.5 1.7.7l.6 2h3l.6-2c.6-.2 1.2-.4 1.7-.7l1.8.9 2.1-2.1-.9-1.8c.3-.5.5-1.1.7-1.7z"/>
            </svg>
        `

    };

    return icons[app] || "";

}


/* =========================================================
   PASSCODE
========================================================= */

function showPasscode(){

    if(state.unlocked){

        return;

    }

    showOnly(passcodeScreen);

    if(typeof window.clearPasscode === "function"){

        window.clearPasscode();

    }

}


/* =========================================================
   RETURN TO LOCK
========================================================= */

function returnToLock(){

    if(state.unlocked){

        return;

    }

    showOnly(lockScreen);

}


/* =========================================================
   PASSCODE SETUP
========================================================= */

function setupPasscode(){

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


    if(!pad){

        return;

    }


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

        "2":"ABC",
        "3":"DEF",
        "4":"GHI",
        "5":"JKL",
        "6":"MNO",
        "7":"PQRS",
        "8":"TUV",
        "9":"WXYZ"

    };


    keys.forEach(value => {

        const button =
            document.createElement(
                "button"
            );


        if(letters[value]){

            button.innerHTML =
                `${value}<small>${letters[value]}</small>`;

        }

        else{

            button.textContent =
                value;

        }


        button.addEventListener(
            "click",
            () => {

                if(
                    entered.length >=
                    PASSCODE.length
                ){

                    return;

                }


                entered += value;

                updateDots();


                if(
                    entered.length !==
                    PASSCODE.length
                ){

                    return;

                }


                if(
                    entered === PASSCODE
                ){

                    state.unlocked = true;

                    state.currentApp =
                        "home";

                    state.homePage = 0;

                    state.history = [];

                    entered = "";

                    updateDots();

                    if(error){

                        error.textContent =
                            "";

                    }

                    saveState();

                    render();

                }

                else{

                    if(error){

                        error.textContent =
                            "Incorrect passcode";

                    }


                    setTimeout(
                        () => {

                            entered = "";

                            updateDots();

                            if(error){

                                error.textContent =
                                    "";

                            }

                        },
                        700
                    );

                }

            }
        );


        pad.appendChild(button);

    });


    function updateDots(){

        dots.forEach(
            (dot,index) => {

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

        if(error){

            error.textContent =
                "";

        }

    };

}


/* =========================================================
   HOME PAGE
========================================================= */

function updateHomePage(){

    if(!homePages){

        return;

    }


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
        `translateX(-${page * 33.333333}%)`;


    pageDots.forEach(
        (dot,index) => {

            dot.classList.toggle(
                "active",
                index === page
            );

        }
    );

}


/* =========================================================
   HOME PAGE NAVIGATION
========================================================= */

function nextHomePage(){

    if(state.homePage >= 2){

        return;

    }

    state.homePage++;

    updateHomePage();

}


function previousHomePage(){

    if(state.homePage <= 0){

        return;

    }

    state.homePage--;

    updateHomePage();

}


/* =========================================================
   SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;


function startTouch(event){

    if(!event.touches?.[0]){

        return;

    }

    touchStartX =
        event.touches[0].clientX;

    touchStartY =
        event.touches[0].clientY;

}


function endTouch(event){

    if(!event.changedTouches?.[0]){

        return;

    }

    touchEndX =
        event.changedTouches[0].clientX;

    touchEndY =
        event.changedTouches[0].clientY;

    handleSwipe();

}


function handleSwipe(){

    const deltaX =
        touchEndX - touchStartX;

    const deltaY =
        touchEndY - touchStartY;

    const absX =
        Math.abs(deltaX);

    const absY =
        Math.abs(deltaY);


    /* LOCK SCREEN */

    if(
        !state.unlocked &&
        !lockScreen.classList.contains("hidden")
    ){

        if(
            deltaY < -60 &&
            absY > absX
        ){

            showPasscode();

        }

        return;

    }


    /* PASSCODE */

    if(
        !state.unlocked &&
        !passcodeScreen.classList.contains("hidden")
    ){

        if(
            deltaY > 60 &&
            absY > absX
        ){

            returnToLock();

        }

        return;

    }


    /* HOME SCREEN */

    if(
        state.unlocked &&
        state.currentApp === "home" &&
        absX > 60 &&
        absX > absY
    ){

        if(deltaX < 0){

            nextHomePage();

        }

        else{

            previousHomePage();

        }

    }

}


/* =========================================================
   TOUCH LISTENERS
========================================================= */

[
    lockScreen,
    passcodeScreen,
    homeScreen

].forEach(screen => {

    if(!screen){

        return;

    }

    screen.addEventListener(
        "touchstart",
        startTouch,
        {passive:true}
    );

    screen.addEventListener(
        "touchend",
        endTouch,
        {passive:true}
    );

});


/* =========================================================
   MOUSE SWIPE
========================================================= */

let mouseDown = false;


function mouseStart(event){

    mouseDown = true;

    touchStartX =
        event.clientX;

    touchStartY =
        event.clientY;

}


function mouseEnd(event){

    if(!mouseDown){

        return;

    }

    mouseDown = false;

    touchEndX =
        event.clientX;

    touchEndY =
        event.clientY;

    handleSwipe();

}


[
    homeScreen,
    lockScreen,
    passcodeScreen

].forEach(screen => {

    if(!screen){

        return;

    }

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

function openApp(app){

    if(!state.unlocked){

        return;

    }


    if(!appFiles[app]){

        console.error(
            "Unknown app:",
            app
        );

        return;

    }


    state.currentApp =
        app;


    saveState();

    render();

}


/* =========================================================
   BACK
========================================================= */

function goBack(){

    /*
       IMPORTANT:

       Leaving an application
       LOCKS THE PHONE.

       This gives you the realistic
       investigation flow:

       LOCK
         ↓
       PASSWORD
         ↓
       HOME
         ↓
       APP
         ↓
       BACK
         ↓
       LOCK
    */


    if(
        state.currentApp !== "home"
    ){

        lockPhone();

        return;

    }


    lockPhone();

}


/* =========================================================
   HOME BUTTON
========================================================= */

function goHome(){

    /*
       Home button also locks the
       victim's phone instead of
       leaving an unlocked device
       sitting on screen.
    */

    lockPhone();

}


/* =========================================================
   CLOSE PHONE
========================================================= */

if(toggle){

    toggle.addEventListener(
        "click",
        () => {

            if(state.hidden){

                /*
                   OPENING THE PHONE
                   ALWAYS STARTS LOCKED.
                */

                state.hidden = false;

                state.unlocked = false;

                state.currentApp =
                    "home";

                state.homePage = 0;

                state.history = [];

                saveState();

                render();

                return;

            }


            /*
               CLOSING PHONE
               ALWAYS LOCKS IT.
            */

            state.hidden = true;

            state.unlocked = false;

            state.currentApp =
                "home";

            state.homePage = 0;

            state.history = [];

            closeRecentPanel();

            clearSearchResults();

            saveState();

            render();

        }
    );

}


/* =========================================================
   VICTIM FILE
   OUTSIDE THE PHONE
========================================================= */

if(victimInfoButton){

    victimInfoButton.addEventListener(
        "click",
        () => {

            /*
               This is NOT a phone app.

               It is the investigator's
               external victim file.
            */

            window.location.href =
                "victim-info.html";

        }
    );

}


/* =========================================================
   APP BACK
========================================================= */

if(appBack){

    appBack.addEventListener(
        "click",
        goBack
    );

}


/* =========================================================
   ANDROID BACK
========================================================= */

if(navBack){

    navBack.addEventListener(
        "click",
        () => {

            if(
                state.currentApp === "home"
            ){

                previousHomePage();

            }

            else{

                goBack();

            }

        }
    );

}


/* =========================================================
   ANDROID HOME
========================================================= */

if(navHome){

    navHome.addEventListener(
        "click",
        goHome
    );

}


/* =========================================================
   RECENT APPS
========================================================= */

if(navRecent){

    navRecent.addEventListener(
        "click",
        openRecentPanel
    );

}


function openRecentPanel(){

    if(
        !state.unlocked ||
        !recentPanel
    ){

        return;

    }


    /*
       Recent apps are only visual.
       Opening one still requires the
       phone to remain unlocked.
    */

    buildRecentApps();

    recentPanel.classList.remove(
        "hidden"
    );

}


function closeRecentPanel(){

    if(recentPanel){

        recentPanel.classList.add(
            "hidden"
        );

    }

}


function buildRecentApps(){

    if(!recentList){

        return;

    }


    recentList.innerHTML = "";


    const apps =
        state.currentApp !== "home"
            ? [state.currentApp]
            : [];


    if(!apps.length){

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "recent-card";

        empty.textContent =
            "No recent apps";

        recentList.appendChild(
            empty
        );

        return;

    }


    apps.forEach(app => {

        const info =
            appInfo[app];


        if(!info){

            return;

        }


        const card =
            document.createElement(
                "div"
            );

        card.className =
            "recent-card";


        const button =
            document.createElement(
                "button"
            );

        button.className =
            "recent-open";


        button.innerHTML = `

            <span class="real-icon ${info.className}">
                ${getHeaderIcon(app)}
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

                saveState();

                render();

            }
        );


        card.appendChild(
            button
        );

        recentList.appendChild(
            card
        );

    });

}


if(closeRecent){

    closeRecent.addEventListener(
        "click",
        closeRecentPanel
    );

}


/* =========================================================
   SEARCH
========================================================= */

function performSearch(){

    if(
        !appSearch ||
        !searchResults
    ){

        return;

    }


    const query =
        appSearch.value
            .trim()
            .toLowerCase();


    searchResults.innerHTML = "";


    if(!query){

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


    if(!matches.length){

        const empty =
            document.createElement(
                "div"
            );

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
            document.createElement(
                "button"
            );


        button.className =
            "search-result";


        button.innerHTML = `

            <span class="real-icon ${info.className}">
                ${getHeaderIcon(app)}
            </span>

            <span>
                ${info.name}
            </span>

        `;


        button.addEventListener(
            "click",
            () => {

                openApp(app);

            }
        );


        searchResults.appendChild(
            button
        );

    });


    searchResults.classList.remove(
        "hidden"
    );

}


function clearSearchResults(){

    if(!searchResults){

        return;

    }

    searchResults.innerHTML = "";

    searchResults.classList.add(
        "hidden"
    );

}


if(appSearch){

    appSearch.addEventListener(
        "input",
        performSearch
    );


    appSearch.addEventListener(
        "focus",
        () => {

            if(
                appSearch.value.trim()
            ){

                performSearch();

            }

        }
    );


    appSearch.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Enter"
            ){

                const first =
                    searchResults
                        ?.querySelector(
                            ".search-result"
                        );

                if(first){

                    first.click();

                }

            }

        }
    );

}


if(clearSearch){

    clearSearch.addEventListener(
        "click",
        () => {

            if(appSearch){

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

function updateClock(){

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour:"2-digit",
                minute:"2-digit",
                hour12:false
            }
        );


    const weekday =
        now.toLocaleDateString(
            [],
            {
                weekday:"long"
            }
        );


    const month =
        now.toLocaleDateString(
            [],
            {
                month:"long"
            }
        );


    const day =
        now.toLocaleDateString(
            [],
            {
                day:"numeric"
            }
        );


    const elements = {

        lockTime:time,

        lockStatusTime:time,

        lockDate:
            `${weekday}, ${month} ${day}`,

        passcodeTime:time,

        homeStatusTime:time,

        homeBigTime:time,

        homeDate:
            `${weekday}, ${month} ${day}`

    };


    Object.entries(elements)
        .forEach(
            ([id,value]) => {

                const element =
                    document.getElementById(id);

                if(element){

                    element.textContent =
                        value;

                }

            }
        );

}


/* =========================================================
   IFRAME COMMUNICATION
========================================================= */

window.addEventListener(
    "message",
    event => {

        const data =
            event.data || {};


        if(
            data.type ===
            "PHONE_HOME"
        ){

            goHome();

        }


        if(
            data.type ===
            "PHONE_BACK"
        ){

            goBack();

        }


        if(
            data.type ===
            "PHONE_OPEN_APP" &&
            data.app
        ){

            openApp(
                data.app
            );

        }


        if(
            data.type ===
            "PHONE_HIDE"
        ){

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

setupPasscode();

updateClock();

setInterval(
    updateClock,
    1000
);

render();
