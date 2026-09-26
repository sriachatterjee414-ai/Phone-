/* =========================================
   BROKEN PHONE
   VICTIM PHONE SYSTEM
========================================= */


/* =========================================
   REPAIR COMPLETION
========================================= */

const REPAIR_COMPLETE_KEY =
    "brokenPhoneRepairComplete";


/* =========================================
   PASSWORD
========================================= */

/*
   Victim birthday.

   Example:

   May 21

   Password:

   0521
*/

const VICTIM_BIRTHDAY =
    "0521";


/* =========================================
   STORAGE
========================================= */

const PHONE_UNLOCKED_KEY =
    "brokenPhoneUnlocked";


const PHONE_CLUES_KEY =
    "brokenPhoneClues";


/* =========================================
   REPAIR COMPLETION CHECK
========================================= */

function checkRepairCompleted(){

    const repaired =
        localStorage.getItem(
            REPAIR_COMPLETE_KEY
        ) === "true";


    if(!repaired){

        /*
           Player has not repaired the phone.

           Do NOT allow direct access
           to the phone.

           Send player back to repair.
        */

        window.location.href =
            "repair.html";

        return false;

    }


    return true;

}


/* =========================================
   ELEMENTS
========================================= */

const lockScreen =
    document.getElementById(
        "lockScreen"
    );


const homeScreen =
    document.getElementById(
        "homeScreen"
    );


const appScreen =
    document.getElementById(
        "appScreen"
    );


const appTitle =
    document.getElementById(
        "appTitle"
    );


const appBack =
    document.getElementById(
        "appBack"
    );


const phoneHomeButton =
    document.getElementById(
        "phoneHomeButton"
    );


const passwordDots =
    document.querySelectorAll(
        "#passwordDots span"
    );


const passwordError =
    document.getElementById(
        "passwordError"
    );


const unlockButton =
    document.getElementById(
        "unlockButton"
    );


const statusTime =
    document.getElementById(
        "statusTime"
    );


const lockTime =
    document.getElementById(
        "lockTime"
    );


const homeClock =
    document.getElementById(
        "homeClock"
    );


/* =========================================
   APP ELEMENTS
========================================= */

const messagesApp =
    document.getElementById(
        "messagesApp"
    );


const chatApp =
    document.getElementById(
        "chatApp"
    );


const galleryApp =
    document.getElementById(
        "galleryApp"
    );


const contactsApp =
    document.getElementById(
        "contactsApp"
    );


const phoneApp =
    document.getElementById(
        "phoneApp"
    );


const notesApp =
    document.getElementById(
        "notesApp"
    );


const noteView =
    document.getElementById(
        "noteView"
    );


const contactView =
    document.getElementById(
        "contactView"
    );


const chatMessages =
    document.getElementById(
        "chatMessages"
    );


/* =========================================
   IMAGE VIEWER
========================================= */

const imageViewer =
    document.getElementById(
        "imageViewer"
    );


const viewerImage =
    document.getElementById(
        "viewerImage"
    );


const closeImage =
    document.getElementById(
        "closeImage"
    );


const clueText =
    document.getElementById(
        "clueText"
    );


/* =========================================
   PASSWORD INPUT
========================================= */

let enteredPassword = "";


/* =========================================
   KEYPAD
========================================= */

document
    .querySelectorAll(
        ".keypad button[data-key]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if(
                        enteredPassword.length >=
                        VICTIM_BIRTHDAY.length
                    ){

                        return;

                    }


                    enteredPassword +=
                        button.dataset.key;


                    updatePasswordDots();

                }
            );

        }
    );


/* =========================================
   DELETE PASSWORD
========================================= */

document
    .getElementById(
        "deleteKey"
    )
    .addEventListener(
        "click",
        () => {

            enteredPassword =
                enteredPassword.slice(
                    0,
                    -1
                );


            updatePasswordDots();

        }
    );


/* =========================================
   PASSWORD DOTS
========================================= */

function updatePasswordDots(){

    passwordDots.forEach(
        (dot,index) => {

            dot.classList.toggle(
                "filled",
                index <
                enteredPassword.length
            );

        }
    );

}


/* =========================================
   UNLOCK
========================================= */

unlockButton.addEventListener(
    "click",
    checkPassword
);


function checkPassword(){

    if(
        enteredPassword ===
        VICTIM_BIRTHDAY
    ){

        localStorage.setItem(
            PHONE_UNLOCKED_KEY,
            "true"
        );


        passwordError.textContent =
            "";


        enteredPassword =
            "";


        updatePasswordDots();


        unlockPhone();

    }

    else{

        passwordError.textContent =
            "Incorrect passcode.";


        enteredPassword =
            "";


        updatePasswordDots();

    }

}


/* =========================================
   UNLOCK PHONE
========================================= */

function unlockPhone(){

    lockScreen.classList.add(
        "hidden"
    );


    homeScreen.classList.remove(
        "hidden"
    );

}


/* =========================================
   CHECK SAVED UNLOCK
========================================= */

function checkSavedUnlock(){

    const unlocked =
        localStorage.getItem(
            PHONE_UNLOCKED_KEY
        );


    if(unlocked === "true"){

        lockScreen.classList.add(
            "hidden"
        );


        homeScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   CLOCK
========================================= */

function updateClock(){

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
        `${hours}:${minutes}`;


    statusTime.textContent =
        time;


    lockTime.textContent =
        time;


    homeClock.textContent =
        time;

}


updateClock();


setInterval(
    updateClock,
    1000
);


/* =========================================
   OPEN APP
========================================= */

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


/* =========================================
   OPEN APP
========================================= */

function openApp(app){

    homeScreen.classList.add(
        "hidden"
    );


    appScreen.classList.remove(
        "hidden"
    );


    hideAllApps();


    switch(app){

        case "messages":

            appTitle.textContent =
                "Messages";

            messagesApp.classList.remove(
                "hidden"
            );

            break;


        case "gallery":

            appTitle.textContent =
                "Photos";

            galleryApp.classList.remove(
                "hidden"
            );

            renderGallery();

            break;


        case "contacts":

            appTitle.textContent =
                "Contacts";

            contactsApp.classList.remove(
                "hidden"
            );

            break;


        case "phone":

            appTitle.textContent =
                "Phone";

            phoneApp.classList.remove(
                "hidden"
            );

            break;


        case "notes":

            appTitle.textContent =
                "Notes";

            notesApp.classList.remove(
                "hidden"
            );

            break;

    }

}


/* =========================================
   HIDE ALL APPS
========================================= */

function hideAllApps(){

    messagesApp.classList.add(
        "hidden"
    );


    chatApp.classList.add(
        "hidden"
    );


    galleryApp.classList.add(
        "hidden"
    );


    contactsApp.classList.add(
        "hidden"
    );


    phoneApp.classList.add(
        "hidden"
    );


    notesApp.classList.add(
        "hidden"
    );


    if(noteView){

        noteView.classList.add(
            "hidden"
        );

    }


    if(contactView){

        contactView.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   BACK BUTTON
========================================= */

appBack.addEventListener(
    "click",
    () => {

        /*
           Inside message conversation
        */

        if(
            !chatApp.classList.contains(
                "hidden"
            )
        ){

            hideAllApps();


            messagesApp.classList.remove(
                "hidden"
            );


            appTitle.textContent =
                "Messages";


            return;

        }


        /*
           Inside note
        */

        if(
            noteView &&
            !noteView.classList.contains(
                "hidden"
            )
        ){

            hideAllApps();


            notesApp.classList.remove(
                "hidden"
            );


            appTitle.textContent =
                "Notes";


            return;

        }


        /*
           Inside contact
        */

        if(
            contactView &&
            !contactView.classList.contains(
                "hidden"
            )
        ){

            hideAllApps();


            contactsApp.classList.remove(
                "hidden"
            );


            appTitle.textContent =
                "Contacts";


            return;

        }


        closeApp();

    }
);


/* =========================================
   CLOSE APP
========================================= */

function closeApp(){

    appScreen.classList.add(
        "hidden"
    );


    homeScreen.classList.remove(
        "hidden"
    );


    hideAllApps();

}


/* =========================================
   HOME BUTTON
========================================= */

if(phoneHomeButton){

    phoneHomeButton.addEventListener(
        "click",
        closeApp
    );

}


/* =========================================
   MESSAGES
========================================= */

const conversations = {

    unknown:{

        name:"Unknown Number",

        messages:[

            {
                type:"them",
                text:"Are you still coming tonight?",
                time:"2:31 PM"
            },

            {
                type:"me",
                text:"I don't know yet.",
                time:"2:34 PM"
            },

            {
                type:"them",
                text:"You need to decide.",
                time:"2:35 PM"
            },

            {
                type:"them",
                text:"And don't tell anyone about this.",
                time:"2:36 PM"
            }

        ]

    },


    emma:{

        name:"Emma",

        messages:[

            {
                type:"them",
                text:"Hehe",
                time:"9:54 AM"
            },

            {
                type:"me",
                text:"What?",
                time:"9:55 AM"
            },

            {
                type:"them",
                text:"Nothing 😂",
                time:"9:55 AM"
            },

            {
                type:"them",
                text:"You seemed really nervous yesterday.",
                time:"9:56 AM"
            }

        ]

    },


    unknown2:{

        name:"52927",

        messages:[

            {
                type:"them",
                text:"Don't forget what we discussed.",
                time:"9:47 AM"
            },

            {
                type:"me",
                text:"I haven't forgotten.",
                time:"9:48 AM"
            },

            {
                type:"them",
                text:"Good.",
                time:"9:48 AM"
            }

        ]

    },


    eve:{

        name:"Evelyn",

        messages:[

            {
                type:"them",
                text:"Aaa",
                time:"Yesterday"
            },

            {
                type:"me",
                text:"What happened?",
                time:"Yesterday"
            },

            {
                type:"them",
                text:"Can we talk somewhere private?",
                time:"Yesterday"
            }

        ]

    },


    jane:{

        name:"Jenzia",

        messages:[

            {
                type:"them",
                text:"We need to talk.",
                time:"Yesterday"
            },

            {
                type:"me",
                text:"About what?",
                time:"Yesterday"
            },

            {
                type:"them",
                text:"About what you saw.",
                time:"Yesterday"
            }

        ]

    },


    mother:{

        name:"Mom",

        messages:[

            {
                type:"them",
                text:"Call me when you get home.",
                time:"Tuesday"
            },

            {
                type:"me",
                text:"I will.",
                time:"Tuesday"
            }

        ]

    },


    unknown3:{

        name:"32665",

        messages:[

            {
                type:"them",
                text:"Your verification code is 397275.",
                time:"Saturday"
            }

        ]

    },


    unknown4:{

        name:"28581",

        messages:[

            {
                type:"them",
                text:"Your account notification is available.",
                time:"6/2/23"
            }

        ]

    }

};


/* =========================================
   OPEN CONVERSATION
========================================= */

document
    .querySelectorAll(
        ".message-row"
    )
    .forEach(
        row => {

            row.addEventListener(
                "click",
                () => {

                    const id =
                        row.dataset.chat;


                    openConversation(id);

                }
            );

        }
    );


/* =========================================
   RENDER CONVERSATION
========================================= */

function openConversation(id){

    const conversation =
        conversations[id];


    if(!conversation){

        return;

    }


    messagesApp.classList.add(
        "hidden"
    );


    chatApp.classList.remove(
        "hidden"
    );


    appTitle.textContent =
        conversation.name;


    chatMessages.innerHTML = `

        <div class="chat-date">
            Conversation
        </div>

    `;


    conversation.messages.forEach(
        message => {

            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                `chat-bubble ${message.type}`;


            bubble.innerHTML = `

                ${message.text}

                <span class="chat-time">
                    ${message.time}
                </span>

            `;


            chatMessages.appendChild(
                bubble
            );

        }
    );


    requestAnimationFrame(
        () => {

            chatApp.scrollTop =
                chatApp.scrollHeight;

        }
    );

}


/* =========================================
   GALLERY DATA
========================================= */

const galleryImages = [

    {
        file:"gallery/photo1.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo2.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo3.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo4.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo5.png",
        clue:true,
        text:
            "Something is wrong with this photograph. Look closely."
    },

    {
        file:"gallery/photo6.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo7.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo8.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo9.png",
        clue:true,
        text:
            "A detail in the background may be important."
    },

    {
        file:"gallery/photo10.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo11.png",
        clue:false,
        text:""
    },

    {
        file:"gallery/photo12.png",
        clue:false,
        text:""
    }

];


/* =========================================
   RENDER GALLERY
========================================= */

function renderGallery(){

    const grid =
        document.getElementById(
            "galleryGrid"
        );


    if(!grid){

        return;

    }


    grid.innerHTML = "";


    galleryImages.forEach(
        (image,index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "gallery-item";


            if(image.clue){

                item.classList.add(
                    "clue"
                );

            }


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image.file;


            img.alt =
                `Gallery image ${index + 1}`;


            img.onerror =
                () => {

                    item.style.background =
                        "linear-gradient(135deg,#303030,#111)";


                    img.style.display =
                        "none";

                };


            item.appendChild(
                img
            );


            item.addEventListener(
                "click",
                () => {

                    openGalleryImage(
                        image
                    );

                }
            );


            grid.appendChild(
                item
            );

        }
    );

}


/* =========================================
   OPEN GALLERY IMAGE
========================================= */

function openGalleryImage(image){

    if(!imageViewer){

        return;

    }


    viewerImage.src =
        image.file;


    viewerImage.onerror =
        () => {

            viewerImage.style.display =
                "none";

        };


    viewerImage.style.display =
        "block";


    if(image.clue){

        clueText.textContent =
            image.text;

    }

    else{

        clueText.textContent =
            "";

    }


    imageViewer.classList.remove(
        "hidden"
    );


    /* =====================================
       SAVE CLUE DISCOVERY
    ===================================== */

    if(image.clue){

        let clues = [];


        try{

            clues =
                JSON.parse(
                    localStorage.getItem(
                        PHONE_CLUES_KEY
                    )
                ) || [];

        }

        catch(error){

            clues = [];

        }


        if(
            !clues.includes(
                image.file
            )
        ){

            clues.push(
                image.file
            );

        }


        localStorage.setItem(
            PHONE_CLUES_KEY,
            JSON.stringify(
                clues
            )
        );

    }

}


/* =========================================
   CLOSE IMAGE
========================================= */

if(closeImage){

    closeImage.addEventListener(
        "click",
        () => {

            imageViewer.classList.add(
                "hidden"
            );


            viewerImage.src =
                "";


            clueText.textContent =
                "";

        }
    );

}


/* =========================================
   ESCAPE IMAGE
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            imageViewer &&
            !imageViewer.classList.contains(
                "hidden"
            )
        ){

            imageViewer.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================
   CONTACTS
========================================= */

const contacts = {

    Emma:{
        number:"+1 555 0134",
        letter:"E"
    },

    Evelyn:{
        number:"+1 555 0198",
        letter:"E"
    },

    Jenzia:{
        number:"+1 555 0162",
        letter:"J"
    },

    Mom:{
        number:"+1 555 0117",
        letter:"M"
    }

};


/* =========================================
   CONTACT CLICK
========================================= */

document
    .querySelectorAll(
        ".contact"
    )
    .forEach(
        contact => {

            contact.addEventListener(
                "click",
                () => {

                    const name =
                        contact.dataset.contact;


                    openContact(
                        name
                    );

                }
            );

        }
    );


/* =========================================
   OPEN CONTACT
========================================= */

function openContact(name){

    const contact =
        contacts[name];


    if(!contact){

        return;

    }


    contactsApp.classList.add(
        "hidden"
    );


    if(!contactView){

        return;

    }


    contactView.classList.remove(
        "hidden"
    );


    appTitle.textContent =
        name;


    const avatar =
        document.getElementById(
            "contactDetailAvatar"
        );


    const detailName =
        document.getElementById(
            "contactDetailName"
        );


    const detailNumber =
        document.getElementById(
            "contactDetailNumber"
        );


    if(avatar){

        avatar.textContent =
            contact.letter;

    }


    if(detailName){

        detailName.textContent =
            name;

    }


    if(detailNumber){

        detailNumber.textContent =
            contact.number;

    }

}


/* =========================================
   NOTES
========================================= */

const notes = {

    note1:
`Things to remember

Don't forget the meeting.

Do not write the address anywhere.

Call E after 8 PM.`,


    note2:
`Meeting

Thursday
8:30 PM

Same place as before.

Come alone.`,


    note3:
`Shopping

Milk
Batteries
Coffee`

};


/* =========================================
   NOTE CLICK
========================================= */

document
    .querySelectorAll(
        ".note"
    )
    .forEach(
        note => {

            note.addEventListener(
                "click",
                () => {

                    openNote(
                        note.dataset.note
                    );

                }
            );

        }
    );


/* =========================================
   OPEN NOTE
========================================= */

function openNote(id){

    if(!noteView){

        return;

    }


    notesApp.classList.add(
        "hidden"
    );


    noteView.classList.remove(
        "hidden"
    );


    appTitle.textContent =
        "Note";


    const noteContent =
        document.getElementById(
            "noteContent"
        );


    if(noteContent){

        noteContent.textContent =
            notes[id] ||
            "Empty note.";

    }

}


/* =========================================
   INITIALIZE
========================================= */

/*
   IMPORTANT:

   The phone can ONLY initialize if
   the repair has been completed.

   If repair is incomplete:
       phone.html → repair.html

   If repair is complete:
       continue normally.
*/

if(
    checkRepairCompleted()
){

    checkSavedUnlock();

}
