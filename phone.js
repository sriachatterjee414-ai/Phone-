/* =========================================================
   BROKEN PHONE
   REALISTIC PHONE SYSTEM

   IMPORTANT:
   All phone apps are in the GitHub ROOT.

   Example:

   phone.html
   phone.css
   phone.js
   messages.html
   gallery.html
   victim-info.html

   No folder is required.
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const PASSCODE = "0521";

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

    "victim-info": {
        name: "Recovered File",
        className: "notes-icon"
    }

};


/* =========================================================
   PHONE STATE
========================================================= */

/*
   DO NOT save "unlocked".

   Every time phone.html is opened,
   the device starts LOCKED.

   This is intentional.
*/

const state = {

    unlocked: false,

    hidden: false,

    currentApp: "home",

    homePage: 0,

    history: []

};


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

const phoneToggle =
    document.getElementById("phoneToggle");

const phoneToggleText =
    document.getElementById("phoneToggleText");

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

const recoveredFile =
    document.getElementById("recoveredFile");

const appSearch =
    document.getElementById("appSearch");

const clearSearch =
    document.getElementById("clearSearch");

const searchResults =
    document.getElementById("searchResults");


/* =========================================================
   SCREEN SWITCHING
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
   RENDER
========================================================= */

function render(){

    if(!shell) return;


    shell.classList.toggle(
        "hidden-phone",
        state.hidden
    );


    if(state.hidden){

        phoneToggleText.textContent =
            "OPEN DEVICE";

        return;

    }


    phoneToggleText.textContent =
        "CLOSE DEVICE";


    /*
       DEVICE IS LOCKED
    */

    if(!state.unlocked){

        showOnly(lockScreen);

        androidNav.classList.add("hidden");

        return;

    }


    /*
       HOME
    */

    if(state.currentApp === "home"){

        showOnly(homeScreen);

        androidNav.classList.remove("hidden");

        updateHomePage();

        return;

    }


    /*
       APPLICATION
    */

    showOnly(appScreen);

    androidNav.classList.add("hidden");

    loadApp(state.currentApp);

}


/* =========================================================
   OPEN APP
========================================================= */

function openApp(app){

    if(!state.unlocked){

        return;

    }


    if(!appFiles[app]){

        console.error(
            "Unknown phone app:",
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


    state.currentApp = app;


    closeRecentPanel();

    clearSearchResults();

    render();

}


/* =========================================================
   LOAD APP
========================================================= */

function loadApp(app){

    const file =
        appFiles[app];

    if(!file){

        return;

    }


    const info =
        appInfo[app];


    const header =
        document.getElementById(
            "appHeaderIcon"
        );


    const title =
        document.getElementById(
            "appHeaderName"
        );


    if(info){

        header.className =
            "header-app-icon " +
            info.className;

        /*
           Small SVG-style visual
           instead of ugly characters.
        */

        header.innerHTML =
            createHeaderIcon(app);


        title.textContent =
            info.name;

    }


    /*
       IMPORTANT:

       Files are directly in GitHub root.

       Therefore:

       messages.html

       NOT:

       broken-phone/messages.html
    */

    if(
        !appFrame.src ||
        !appFrame.src.endsWith(file)
    ){

        appFrame.src = file;

    }

}


/* =========================================================
   HEADER ICONS
========================================================= */

function createHeaderIcon(app){

    const icons = {

        calls: `
            <svg viewBox="0 0 24 24">
                <path d="M6.6 3.5l3 2.5-1.8 3
                c1 2 2.7 3.7 4.7 4.7
                l3-1.8 2.5 3
                c.6.7.5 1.7-.2 2.2-1
                .8-2.1 1.1-3.2.7-4.2
                -1.3-7.1-4.1-8.4-8.4
                -.4-1.1-.1-2.2.7-3.2
                .5-.7 1.5-.8 2.2-.2z"/>
            </svg>
        `,

        messages: `
            <svg viewBox="0 0 24 24">
                <path d="M4 5.5A2.5 2.5 0 0 1
                6.5 3h11A2.5 2.5 0 0 1
                20 5.5v8A2.5 2.5 0 0 1
                17.5 16H10l-4.5 4V16h-1
                A2.5 2.5 0 0 1 2 13.5v-8z"/>
                <path d="M7 8h10M7 11.5h6"/>
            </svg>
        `,

        gallery: `
            <svg viewBox="0 0 24 24">
                <rect x="3" y="4"
                width="18" height="16" rx="2"/>
                <circle cx="8" cy="9" r="1.5"/>
                <path d="M4 17l5-5
                3 3 2-2 6 5"/>
            </svg>
        `,

        notes: `
            <svg viewBox="0 0 24 24">
                <path d="M6 3h12
                a2 2 0 0 1 2 2v14
                a2 2 0 0 1-2 2H6
                a2 2 0 0 1-2-2V5
                a2 2 0 0 1 2-2z"/>
                <path d="M7.5 8h9
                M7.5 11.5h9
                M7.5 15h6"/>
            </svg>
        `,

        browser: `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"/>
                <path d="M3 12h18"/>
                <path d="M12 3
                c3 3 3 15 0 18"/>
            </svg>
        `,

        settings: `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19 13.5l1.5 1-2 3
                -1.8-.8a7 7 0 0 1-2 1.2
                L14.5 20h-3l-.2-2.1
                a7 7 0 0 1-2-1.2l-1.8.8
                -2-3 1.5-1a7 7 0 0 1 0-3
                l-1.5-1 2-3 1.8.8
                a7 7 0 0 1 2-1.2L11.5 4h3
                l.2 2.1a7 7 0 0 1 2 1.2
                l1.8-.8 2 3-1.5 1
                a7 7 0 0 1 0 3z"/>
            </svg>
        `

    };


    return icons[app] || icons.notes;

}


/* =========================================================
   PASSCODE
========================================================= */

let enteredCode = "";


function setupPasscode(){

    const pad =
        document.getElementById(
            "passcodePad"
        );

    const dots =
        [...document.querySelectorAll(
            "#passcodeDots span"
        )];

    const error =
        document.getElementById(
            "passcodeError"
        );


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
            document.createElement(
                "button"
            );


        if(letters[value]){

            button.innerHTML =
                `${value}<small>
                    ${letters[value]}
                 </small>`;

        }else{

            button.textContent =
                value;

        }


        button.addEventListener(
            "click",
            () => {

                if(
                    enteredCode.length >=
                    PASSCODE.length
                ){

                    return;

                }


                enteredCode += value;

                updatePasscodeDots();


                if(
                    enteredCode.length !==
                    PASSCODE.length
                ){

                    return;

                }


                if(
                    enteredCode === PASSCODE
                ){

                    /*
                       CORRECT PASSWORD

                       New phone session begins.
                    */

                    state.unlocked = true;

                    state.currentApp = "home";

                    state.homePage = 0;

                    state.history = [];

                    enteredCode = "";

                    updatePasscodeDots();

                    error.textContent = "";

                    render();

                }else{

                    error.textContent =
                        "Incorrect passcode";

                    setTimeout(() => {

                        enteredCode = "";

                        updatePasscodeDots();

                        error.textContent = "";

                    },700);

                }

            }
        );


        pad.appendChild(button);

    });

}


function updatePasscodeDots(){

    const dots =
        [...document.querySelectorAll(
            "#passcodeDots span"
        )];


    dots.forEach(
        (dot,index) => {

            dot.classList.toggle(
                "filled",
                index <
                enteredCode.length
            );

        }
    );

}


/* =========================================================
   CANCEL PASSCODE
========================================================= */

const passcodeCancel =
    document.getElementById(
        "passcodeCancel"
    );


if(passcodeCancel){

    passcodeCancel.addEventListener(
        "click",
        () => {

            enteredCode = "";

            updatePasscodeDots();

            document
                .getElementById(
                    "passcodeError"
                )
                .textContent = "";

            showOnly(lockScreen);

        }
    );

}


/* =========================================================
   SHOW PASSCODE
========================================================= */

function showPasscode(){

    if(state.unlocked){

        return;

    }


    enteredCode = "";

    updatePasscodeDots();

    document
        .getElementById(
            "passcodeError"
        )
        .textContent = "";


    showOnly(passcodeScreen);

}


/* =========================================================
   LOCK DEVICE
========================================================= */

function lockDevice(){

    /*
       THIS IS THE IMPORTANT FIX.

       Closing the phone destroys the
       unlocked session.

       Next opening requires 0521 again.
    */

    state.hidden = true;

    state.unlocked = false;

    state.currentApp = "home";

    state.homePage = 0;

    state.history = [];

    enteredCode = "";

    clearSearchResults();

    closeRecentPanel();

    appFrame.removeAttribute("src");

    render();

}


/* =========================================================
   PHONE TOGGLE
========================================================= */

phoneToggle.addEventListener(
    "click",
    () => {

        if(state.hidden){

            /*
               Open device.

               It is STILL LOCKED.
            */

            state.hidden = false;

            state.unlocked = false;

            state.currentApp = "home";

            state.homePage = 0;

            state.history = [];

            render();

            return;

        }


        /*
           Close device.
        */

        lockDevice();

    }
);


/* =========================================================
   HOME PAGE
========================================================= */

function updateHomePage(){

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
        (dot,index) => {

            dot.classList.toggle(
                "active",
                index === page
            );

        }
    );

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
   RECOVERED FILE
========================================================= */

if(recoveredFile){

    recoveredFile.addEventListener(
        "click",
        () => {

            openApp(
                "victim-info"
            );

        }
    );

}


/* =========================================================
   APP BACK
========================================================= */

function goBack(){

    if(
        state.currentApp ===
        "home"
    ){

        return;

    }


    /*
       If we are viewing the
       recovered victim file,
       back returns to phone home.
    */

    if(
        state.currentApp ===
        "victim-info"
    ){

        state.currentApp =
            "home";

        state.history = [];

        render();

        return;

    }


    const previous =
        state.history.pop();


    state.currentApp =
        previous || "home";


    render();

}


appBack.addEventListener(
    "click",
    goBack
);


/* =========================================================
   HOME BUTTON
========================================================= */

function goHome(){

    state.currentApp =
        "home";

    state.history = [];

    state.homePage = 0;

    closeRecentPanel();

    clearSearchResults();

    render();

}


navHome.addEventListener(
    "click",
    goHome
);


/* =========================================================
   BACK BUTTON
========================================================= */

navBack.addEventListener(
    "click",
    () => {

        if(
            state.currentApp ===
            "home"
        ){

            previousHomePage();

        }else{

            goBack();

        }

    }
);


/* =========================================================
   RECENT APPS
========================================================= */

function openRecentPanel(){

    if(!state.unlocked){

        return;

    }


    buildRecentApps();

    recentPanel.classList.remove(
        "hidden"
    );

}


function closeRecentPanel(){

    recentPanel.classList.add(
        "hidden"
    );

}


navRecent.addEventListener(
    "click",
    openRecentPanel
);


closeRecent.addEventListener(
    "click",
    closeRecentPanel
);


function buildRecentApps(){

    recentList.innerHTML = "";


    const apps = [
        ...state.history
    ];


    if(
        state.currentApp !==
        "home"
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

        recentList.innerHTML =
            `
            <div class="recent-card">
                No recent applications
            </div>
            `;

        return;

    }


    uniqueApps.forEach(app => {

        const info =
            appInfo[app];


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


        button.innerHTML =
            `
            <span
                class="real-icon ${info.className}">
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


/* =========================================================
   SEARCH
========================================================= */

function performSearch(){

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

        searchResults.innerHTML =
            `
            <div class="search-result">
                No apps found
            </div>
            `;

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


        button.innerHTML =
            `
            <span
                class="real-icon ${info.className}">
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

    searchResults.innerHTML = "";

    searchResults.classList.add(
        "hidden"
    );

}


appSearch.addEventListener(
    "input",
    performSearch
);


clearSearch.addEventListener(
    "click",
    () => {

        appSearch.value = "";

        clearSearchResults();

        appSearch.focus();

    }
);


/* =========================================================
   APP BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-app]"
    )
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


    const values = {

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


    Object.entries(values)
        .forEach(
            ([id,value]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if(element){

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
   TOUCH SWIPES
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;


function startTouch(event){

    if(
        !event.touches ||
        !event.touches[0]
    ){

        return;

    }


    touchStartX =
        event.touches[0].clientX;

    touchStartY =
        event.touches[0].clientY;

}


function endTouch(event){

    if(
        !event.changedTouches ||
        !event.changedTouches[0]
    ){

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
       LOCK SCREEN
       Swipe up -> passcode
    */

    if(
        !state.unlocked &&
        !lockScreen.classList.contains(
            "hidden"
        )
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
       Swipe down -> lock screen
    */

    if(
        !state.unlocked &&
        !passcodeScreen.classList.contains(
            "hidden"
        )
    ){

        if(
            deltaY > 60 &&
            absY > absX
        ){

            showOnly(lockScreen);

        }

        return;

    }


    /*
       HOME
       Horizontal swipe
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
]
.forEach(screen => {

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
   MOUSE SWIPE SUPPORT
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
    lockScreen,
    passcodeScreen,
    homeScreen
]
.forEach(screen => {

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
            "PHONE_LOCK"
        ){

            lockDevice();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

setupPasscode();

updateClock();

render();
