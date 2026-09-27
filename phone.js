/* =========================================================
   BROKEN PHONE
   PHONE CORE
   ========================================================= */

const PHONE_KEY = "brokenPhoneStateV6";

/*
    Change this if you want another password.
*/
const PASSCODE = "0521";


/* =========================================================
   APP FILES
   ALL FILES ARE DIRECTLY IN THE GITHUB ROOT
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

    files: "files.html"

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
    },

    files: {
        name: "Files",
        className: "files-icon"
    }

};


/* =========================================================
   STATE
   ========================================================= */

/*
    IMPORTANT:

    unlocked is NEVER loaded from localStorage.

    Therefore:
        refresh page -> LOCKED
        close phone -> LOCKED
        show phone -> LOCKED
        return from victim file -> phone stays protected
*/

const defaultState = {

    hidden: false,

    homePage: 0,

    currentApp: "home",

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
    document.getElementById("phoneToggleText");

const toggleSubtext =
    document.getElementById("phoneToggleSubtext");

const victimInfoButton =
    document.getElementById("victimInfoButton");

const victimPanel =
    document.getElementById("victimPanel");

const victimFrame =
    document.getElementById("victimFrame");

const closeVictimInfo =
    document.getElementById("closeVictimInfo");

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

            hidden:
                Boolean(parsed.hidden),

            homePage:
                Number.isFinite(Number(parsed.homePage))
                    ? Number(parsed.homePage)
                    : 0,

            currentApp:
                typeof parsed.currentApp === "string"
                    ? parsed.currentApp
                    : "home",

            history:
                Array.isArray(parsed.history)
                    ? parsed.history
                    : []

        };

    }catch(error){

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

        /*
            Notice:
            state.unlocked is NOT stored.
        */

        localStorage.setItem(
            PHONE_KEY,
            JSON.stringify({

                hidden:
                    state.hidden,

                homePage:
                    state.homePage,

                currentApp:
                    state.currentApp,

                history:
                    state.history

            })
        );

    }catch(error){

        console.error(
            "Could not save phone state:",
            error
        );

    }

}


/* =========================================================
   SHOW ONE PHONE SCREEN
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
   RENDER PHONE
   ========================================================= */

function render(){

    if(!shell) return;


    shell.classList.toggle(
        "hidden-phone",
        state.hidden
    );


    if(state.hidden){

        if(toggleText){

            toggleText.textContent =
                "OPEN DEVICE";

        }

        if(toggleSubtext){

            toggleSubtext.textContent =
                "PHONE IS LOCKED";

        }

        return;

    }


    if(toggleText){

        toggleText.textContent =
            "CLOSE DEVICE";

    }

    if(toggleSubtext){

        toggleSubtext.textContent =
            "SECURE PHONE";

    }


    /*
        THE PHONE IS LOCKED UNTIL THE
        USER ENTERS THE PASSWORD.
    */

    if(!state.unlocked){

        showOnly(lockScreen);

        if(androidNav){

            androidNav.classList.add("hidden");

        }

        return;

    }


    if(state.currentApp === "home"){

        showOnly(homeScreen);

        updateHomePage();

        if(androidNav){

            androidNav.classList.remove("hidden");

        }

        return;

    }


    showOnly(appScreen);

    if(androidNav){

        androidNav.classList.add("hidden");

    }

    loadApp(state.currentApp);

}


/* =========================================================
   OPEN APP
   ========================================================= */

function loadApp(app){

    if(!appFrame) return;


    const file =
        appFiles[app];


    if(!file){

        console.error(
            "Unknown app:",
            app
        );

        appFrame.removeAttribute("src");

        return;

    }


    const info =
        appInfo[app];


    if(info){

        const icon =
            document.getElementById(
                "appHeaderIcon"
            );

        const name =
            document.getElementById(
                "appHeaderName"
            );


        if(icon){

            icon.className =
                "header-app-icon " +
                info.className;

            icon.innerHTML = "";

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
   SHOW PASSCODE
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

    state.unlocked = false;

    showOnly(lockScreen);

}


/* =========================================================
   PASSCODE
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


    if(!pad) return;


    let entered = "";


    pad.innerHTML = "";


    const keys = [
        "1","2","3",
        "4","5","6",
        "7","8","9",
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
            document.createElement("button");


        if(letters[value]){

            button.innerHTML =
                `${value}<small>${letters[value]}</small>`;

        }else{

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


                if(entered === PASSCODE){

                    /*
                        CORRECT PASSWORD
                    */

                    state.unlocked = true;

                    state.currentApp =
                        "home";

                    state.homePage = 0;

                    state.history = [];

                    entered = "";

                    updateDots();


                    if(error){

                        error.textContent = "";

                    }


                    saveState();

                    render();

                }else{

                    if(error){

                        error.textContent =
                            "Incorrect passcode";

                    }


                    setTimeout(() => {

                        entered = "";

                        updateDots();


                        if(error){

                            error.textContent = "";

                        }

                    },700);

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

            error.textContent = "";

        }

    };

}


/* =========================================================
   HOME PAGES
   ========================================================= */

function updateHomePage(){

    if(!homePages) return;


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


    saveState();

}


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
   SWIPING
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


    /*
        LOCK SCREEN
        swipe up -> password
    */

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


    /*
        PASSCODE
        swipe down -> lock
    */

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


    /*
        HOME PAGE SWIPE
    */

    if(
        state.unlocked &&
        state.currentApp === "home" &&
        absX > 60 &&
        absX > absY
    ){

        if(deltaX < 0){

            nextHomePage();

        }else{

            previousHomePage();

        }

    }

}


[
    lockScreen,
    passcodeScreen,
    homeScreen

].forEach(screen => {

    if(!screen) return;


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

    if(!screen) return;


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


    if(
        state.currentApp !== app &&
        state.currentApp !== "home"
    ){

        state.history.push(
            state.currentApp
        );

    }


    state.currentApp =
        app;


    closeRecentPanel();

    clearSearchResults();

    saveState();

    render();

}


/* =========================================================
   BACK
   ========================================================= */

function goBack(){

    if(state.currentApp === "home"){

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
   HOME
   ========================================================= */

function goHome(){

    state.currentApp =
        "home";

    state.history = [];

    state.homePage = 0;

    closeRecentPanel();

    clearSearchResults();

    saveState();

    render();

}


/* =========================================================
   CLOSE / OPEN PHONE
   ========================================================= */

if(toggle){

    toggle.addEventListener(
        "click",
        () => {

            /*
                CLOSING PHONE
                ALWAYS LOCK IT.
            */

            if(!state.hidden){

                state.hidden = true;

                state.unlocked = false;

                state.currentApp =
                    "home";

                state.homePage = 0;

                state.history = [];

                closeRecentPanel();

                saveState();

                render();

                return;

            }


            /*
                OPENING PHONE
                ALWAYS START AT LOCK SCREEN.
            */

            state.hidden = false;

            state.unlocked = false;

            state.currentApp =
                "home";

            state.homePage = 0;

            state.history = [];


            closeRecentPanel();

            saveState();

            render();

        }
    );

}


/* =========================================================
   VICTIM INFO
   OUTSIDE PHONE
   ========================================================= */

function openVictimInfo(){

    if(!victimPanel){

        return;

    }


    /*
        Load the victim file only when opened.
        All files are directly in GitHub root.
    */

    if(
        victimFrame &&
        !victimFrame.getAttribute("src")
    ){

        victimFrame.src =
            "victim-info.html";

    }


    victimPanel.classList.remove(
        "hidden"
    );

}


function closeVictimInfoPanel(){

    if(!victimPanel){

        return;

    }


    victimPanel.classList.add(
        "hidden"
    );

}


if(victimInfoButton){

    victimInfoButton.addEventListener(
        "click",
        openVictimInfo
    );

}


if(closeVictimInfo){

    closeVictimInfo.addEventListener(
        "click",
        closeVictimInfoPanel
    );

}


/* =========================================================
   PHONE NAVIGATION
   ========================================================= */

if(appBack){

    appBack.addEventListener(
        "click",
        goBack
    );

}


if(navBack){

    navBack.addEventListener(
        "click",
        () => {

            if(state.currentApp === "home"){

                previousHomePage();

            }else{

                goBack();

            }

        }
    );

}


if(navHome){

    navHome.addEventListener(
        "click",
        goHome
    );

}


if(navRecent){

    navRecent.addEventListener(
        "click",
        openRecentPanel
    );

}


/* =========================================================
   RECENTS
   ========================================================= */

function openRecentPanel(){

    if(
        !state.unlocked ||
        !recentPanel
    ){

        return;

    }


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
        [...state.history];


    if(
        state.currentApp !== "home"
    ){

        apps.unshift(
            state.currentApp
        );

    }


    const uniqueApps = [];


    apps.forEach(app => {

        if(
            app &&
            app !== "home" &&
            appFiles[app] &&
            !uniqueApps.includes(app)
        ){

            uniqueApps.push(app);

        }

    });


    if(!uniqueApps.length){

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


        if(!info){

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


        const icon =
            document.createElement("span");

        icon.className =
            "real-icon " +
            info.className;


        const name =
            document.createElement("span");

        name.textContent =
            info.name;


        button.appendChild(icon);

        button.appendChild(name);


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


        card.appendChild(button);

        recentList.appendChild(card);

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
                    appInfo[app].name
                        .toLowerCase();

                return (
                    name.includes(query) ||
                    app.includes(query)
                );

            });


    if(!matches.length){

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


        const icon =
            document.createElement("span");

        icon.className =
            "real-icon " +
            info.className;


        const name =
            document.createElement("span");

        name.textContent =
            info.name;


        button.appendChild(icon);

        button.appendChild(name);


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

            if(event.key === "Enter"){

                const first =
                    searchResults?.querySelector(
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

        lockTime:
            time,

        lockStatusTime:
            time,

        lockDate:
            `${weekday}, ${month} ${day}`,

        passcodeTime:
            time,

        homeStatusTime:
            time,

        homeBigTime:
            time,

        homeDate:
            `${weekday}, ${month} ${day}`

    };


    Object.entries(elements)
        .forEach(([id,value]) => {

            const element =
                document.getElementById(id);


            if(element){

                element.textContent =
                    value;

            }

        });

}


/* =========================================================
   MESSAGES FROM OTHER GAME FILES
   ========================================================= */

window.addEventListener(
    "message",
    event => {

        const data =
            event.data || {};


        if(data.type === "PHONE_HOME"){

            goHome();

        }


        if(data.type === "PHONE_BACK"){

            goBack();

        }


        if(
            data.type ===
            "PHONE_OPEN_APP" &&
            data.app
        ){

            openApp(data.app);

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


/*
    CRITICAL:
    Even if an older V5 localStorage entry says
    "unlocked:true", we intentionally ignore it.

    The phone always starts locked.
*/

state.unlocked = false;

render();
