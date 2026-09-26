const PHONE_KEY = "brokenPhoneStateV3";

/*
  Your existing passcode.
  Change this if you want a different one.
*/
const PASSCODE = "0521";


const defaultState = {

  firstRun:true,

  hidden:false,

  unlocked:false,

  currentApp:"home",

  history:[]

};


let state = loadState();


const shell =
  document.getElementById("phoneShell");

const lockScreen =
  document.getElementById("lockScreen");

const homeScreen =
  document.getElementById("homeScreen");

const folderScreen =
  document.getElementById("folderScreen");

const appScreen =
  document.getElementById("appScreen");

const appFrame =
  document.getElementById("appFrame");

const toggle =
  document.getElementById("phoneToggle");


/*
=====================================
EXISTING APP CONNECTIONS
=====================================
*/

const appFiles = {

  messages:"messages.html",

  calls:"calls.html",

  gallery:"gallery.html",

  notes:"notes.html",

  contacts:"contacts.html",

  bank:"bank.html",

  settings:"settings.html",

  browser:"browser.html",

  music:"music.html",

  clock:"clock.html",

  camera:"camera.html"

};


/*
=====================================
FOLDER CONTENTS

These are only visual groupings.
They do NOT delete or disconnect
your existing HTML apps.
=====================================
*/

const folders = {

  school:[
    [
      "notes",
      "Notes",
      "✉",
      "mail-icon"
    ],

    [
      "clock",
      "Clock",
      "◷",
      "clock-icon"
    ],

    [
      "contacts",
      "Contacts",
      "♟",
      "life-icon"
    ],

    [
      "settings",
      "Settings",
      "⚙",
      "settings-icon"
    ],

    [
      "bank",
      "Bank",
      "$",
      "bank-icon"
    ]
  ],


  photo:[
    [
      "camera",
      "Camera",
      "◉",
      "camera-icon"
    ],

    [
      "gallery",
      "Photos",
      "✿",
      "photos-icon"
    ]
  ],


  lifestyle:[
    [
      "music",
      "Music",
      "♫",
      "music-icon"
    ],

    [
      "clock",
      "Clock",
      "◷",
      "clock-icon"
    ]
  ],


  social:[
    [
      "messages",
      "WhatsApp",
      "◔",
      "whatsapp-icon"
    ],

    [
      "calls",
      "Phone",
      "☎",
      "phone-icon"
    ],

    [
      "browser",
      "Browser",
      "◉",
      "safari-icon"
    ]
  ]

};


/*
=====================================
LOAD STATE
=====================================
*/

function loadState(){

  try{

    const saved =
      JSON.parse(
        localStorage.getItem(PHONE_KEY)
      );

    return {
      ...defaultState,
      ...(saved || {})
    };

  }catch(e){

    return {
      ...defaultState
    };

  }

}


/*
=====================================
SAVE STATE
=====================================
*/

function saveState(){

  localStorage.setItem(
    PHONE_KEY,
    JSON.stringify(state)
  );

}


/*
=====================================
SHOW ONLY ONE PHONE SCREEN
=====================================
*/

function showOnly(element){

  [
    lockScreen,
    homeScreen,
    folderScreen,
    appScreen
  ].forEach(screen => {

    screen.classList.add("hidden");

  });

  element.classList.remove("hidden");

}


/*
=====================================
MAIN RENDER
=====================================
*/

function render(){

  shell.classList.toggle(
    "hidden-phone",
    state.hidden
  );


  if(state.hidden){

    toggle.textContent = "PHONE";

    return;

  }


  toggle.textContent = "HIDE";


  /*
    Locked
  */

  if(!state.unlocked){

    showOnly(lockScreen);

    return;

  }


  /*
    Home
  */

  if(state.currentApp === "home"){

    showOnly(homeScreen);

    return;

  }


  /*
    Folder
  */

  if(
    state.currentApp.startsWith(
      "folder:"
    )
  ){

    showFolder(
      state.currentApp.split(":")[1]
    );

    return;

  }


  /*
    Normal application
  */

  showOnly(appScreen);


  const file =
    appFiles[state.currentApp];


  if(
    file &&
    !appFrame.src.endsWith(
      "/" + file
    )
  ){

    appFrame.src = file;

  }


  const appName =
    state.currentApp
      .charAt(0)
      .toUpperCase()
    +
    state.currentApp.slice(1);


  document.getElementById(
    "appTitle"
  ).textContent = appName;

}


/*
=====================================
GO HOME
=====================================
*/

function showHome(){

  state.currentApp = "home";

  state.history = [];

  saveState();

  render();

}


/*
=====================================
OPEN APP
=====================================
*/

function openApp(
  app,
  push = true
){

  if(!state.unlocked){
    return;
  }


  if(!appFiles[app]){
    return;
  }


  if(push){

    state.history.push(
      state.currentApp
    );

  }


  state.currentApp = app;

  saveState();

  render();

}


/*
=====================================
OPEN FOLDER
=====================================
*/

function openFolder(name){

  if(!state.unlocked){
    return;
  }


  state.history.push(
    state.currentApp
  );


  state.currentApp =
    "folder:" + name;


  saveState();

  render();

}


/*
=====================================
SHOW FOLDER
=====================================
*/

function showFolder(name){

  showOnly(folderScreen);


  const title =
    document.getElementById(
      "folderTitle"
    );


  const apps =
    document.getElementById(
      "folderApps"
    );


  if(name === "photo"){

    title.textContent =
      "Photo & Video";

  }else if(name === "social"){

    title.textContent =
      "Social media";

  }else{

    title.textContent =
      name.charAt(0).toUpperCase()
      +
      name.slice(1);

  }


  apps.innerHTML = "";


  /*
    Create the app icons inside
    the selected folder.
  */

  (
    folders[name] || []
  ).forEach(
    ([app,label,symbol,iconClass]) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "ios-app";


      button.innerHTML = `

        <span
          class="real-icon ${iconClass}">
          ${symbol}
        </span>

        <label>
          ${label}
        </label>

      `;


      button.addEventListener(
        "click",
        () => openApp(app)
      );


      apps.appendChild(button);

    }
  );

}


/*
=====================================
BACK BUTTON
=====================================
*/

function goBack(){

  if(state.currentApp === "home"){
    return;
  }


  const previous =
    state.history.pop()
    ||
    "home";


  state.currentApp =
    previous;


  saveState();

  render();

}


/*
=====================================
PHONE SHOW / HIDE
=====================================
*/

toggle.addEventListener(
  "click",
  () => {

    state.hidden =
      !state.hidden;


    /*
      Hiding the phone locks it.
    */

    if(state.hidden){

      state.unlocked = false;

      state.currentApp = "home";

      state.history = [];

    }


    saveState();

    render();

  }
);


/*
=====================================
HOME SCREEN APP BUTTONS
=====================================
*/

document
  .querySelectorAll("[data-app]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openApp(
          button.dataset.app
        );

      }
    );

  });


/*
=====================================
FOLDER BUTTONS
=====================================
*/

document
  .querySelectorAll("[data-folder]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openFolder(
          button.dataset.folder
        );

      }
    );

  });


/*
=====================================
NAVIGATION BUTTONS
=====================================
*/

document
  .getElementById("folderBack")
  .addEventListener(
    "click",
    goBack
  );


document
  .getElementById("appBack")
  .addEventListener(
    "click",
    goBack
  );


document
  .getElementById("appHome")
  .addEventListener(
    "click",
    showHome
  );


/*
=====================================
CANCEL PASSCODE
=====================================
*/

document
  .getElementById("cancelPasscode")
  .addEventListener(
    "click",
    () => {

      state.unlocked = false;

      state.currentApp = "home";

      state.history = [];

      saveState();

      render();

    }
  );


/*
=====================================
PASSCODE KEYPAD
=====================================
*/

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


  let entered = "";


  /*
    iPhone-style keypad.
  */

  const keys = [

    ["1",""],

    ["2","ABC"],

    ["3","DEF"],

    ["4","GHI"],

    ["5","JKL"],

    ["6","MNO"],

    ["7","PQRS"],

    ["8","TUV"],

    ["9","WXYZ"],

    ["0",""]

  ];


  keys.forEach(
    ([value,letters]) => {

      const button =
        document.createElement(
          "button"
        );


      button.innerHTML = `

        ${value}

        ${
          letters
          ?
          `<small>${letters}</small>`
          :
          ""
        }

      `;


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


          /*
            Fill the dots.
          */

          dots.forEach(
            (dot,index) => {

              dot.classList.toggle(
                "filled",
                index < entered.length
              );

            }
          );


          /*
            Check password once
            all digits are entered.
          */

          if(
            entered.length ===
            PASSCODE.length
          ){

            if(
              entered === PASSCODE
            ){

              state.unlocked = true;

              state.hidden = false;

              state.currentApp = "home";

              state.history = [];


              saveState();


              entered = "";


              dots.forEach(
                dot =>
                  dot.classList.remove(
                    "filled"
                  )
              );


              error.textContent = "";


              render();


            }else{

              error.textContent =
                "Incorrect Passcode";


              setTimeout(
                () => {

                  entered = "";


                  dots.forEach(
                    dot =>
                      dot.classList.remove(
                        "filled"
                      )
                  );


                  error.textContent = "";

                },
                650
              );

            }

          }

        }
      );


      pad.appendChild(button);

    }
  );

}


/*
=====================================
LIVE CLOCK
=====================================
*/

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


  const date =
    now.toLocaleDateString(
      [],
      {
        weekday:"long",
        month:"long",
        day:"numeric"
      }
    );


  const day =
    now.toLocaleDateString(
      [],
      {
        weekday:"long"
      }
    ).toLowerCase();


  const shortDate =
    now.toLocaleDateString(
      [],
      {
        month:"long",
        day:"numeric"
      }
    ).toUpperCase();


  const values = {

    lockStatusTime:time,

    lockTime:time,

    homeTime:time,

    folderTime:time,

    homeBigTime:time,

    lockDate:date,

    homeDay:day,

    homeWidgetDate:shortDate

  };


  Object.entries(values)
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


/*
=====================================
MESSAGES FROM EXISTING APP PAGES
=====================================
*/

window.addEventListener(
  "message",
  event => {

    const data =
      event.data || {};


    if(
      data.type ===
      "PHONE_HOME"
    ){

      showHome();

    }


    if(
      data.type ===
      "PHONE_BACK"
    ){

      goBack();

    }


    if(
      data.type ===
      "PHONE_OPEN_APP"
    ){

      openApp(
        data.app,
        true
      );

    }


    if(
      data.type ===
      "PHONE_HIDE"
    ){

      state.hidden = true;

      state.unlocked = false;

      state.currentApp = "home";

      state.history = [];


      saveState();

      render();

    }

  }
);


/*
=====================================
INITIALIZE
=====================================
*/

setupPasscode();

updateClock();

setInterval(
  updateClock,
  1000
);


/*
  A fresh installation starts
  on the lock screen.
*/

if(state.firstRun){

  state.firstRun = false;

  state.hidden = false;

  state.unlocked = false;

  state.currentApp = "home";

  state.history = [];


  saveState();

}


render();
