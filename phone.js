/* =========================================================
   BROKEN PHONE
   VICTIM PHONE SYSTEM
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const REPAIR_COMPLETE_KEY =
    "brokenPhoneRepairComplete";


const PHONE_UNLOCKED_KEY =
    "brokenPhoneUnlocked";


const PHONE_CLUES_KEY =
    "brokenPhoneClues";


const VICTIM_FILE_VIEWED_KEY =
    "victimFileViewed";


const FIRST_PASSWORD_ATTEMPT_KEY =
    "phoneFirstAttemptMade";


/* =========================================================
   VICTIM BIRTHDAY
========================================================= */

/*
    Victim:

    Evelyn Carter

    Birthday:

    May 21

    Actual phone passcode:

    0521
*/

const VICTIM_BIRTHDAY =
    "0521";


/* =========================================================
   FIRST AUTOMATIC ATTEMPT
========================================================= */

/*
    Ryan initially guesses incorrectly.

    This is NOT the real password.

    The player will later manually enter
    the real birthday after checking the
    victim information.
*/

const FIRST_AUTOMATIC_PASSWORD =
    "0520";



/* =========================================================
   REPAIR CHECK
========================================================= */

function checkRepairCompleted(){

    const repaired =
        localStorage.getItem(
            REPAIR_COMPLETE_KEY
        ) === "true";


    if(!repaired){

        window.location.href =
            "repair.html";

        return false;

    }


    return true;

}



/* =========================================================
   ELEMENTS
========================================================= */

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


const victimInfoButton =
    document.getElementById(
        "victimInfoButton"
    );



/* =========================================================
   APP ELEMENTS
========================================================= */

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



/* =========================================================
   IMAGE VIEWER
========================================================= */

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



/* =========================================================
   PASSWORD STATE
========================================================= */

let enteredPassword = "";



/* =========================================================
   VICTIM INFO BUTTON
========================================================= */

/*
    This button is permanently available.

    It does NOT depend on the phone being unlocked.

    The player can use it while looking at
    the locked phone.
*/

if(victimInfoButton){

    victimInfoButton.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                VICTIM_FILE_VIEWED_KEY,
                "true"
            );


            window.location.href =
                "victim-info.html";

        }
    );

}



/* =========================================================
   PASSWORD KEYPAD
========================================================= */

document
    .querySelectorAll(
        ".keypad button[data-key]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {


                    /*
                        Maximum four digits.
                    */

                    if(
                        enteredPassword.length >= 4
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



/* =========================================================
   DELETE PASSWORD
========================================================= */

const deleteKey =
    document.getElementById(
        "deleteKey"
    );


if(deleteKey){

    deleteKey.addEventListener(
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

}



/* =========================================================
   PASSWORD DOTS
========================================================= */

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



/* =========================================================
   UNLOCK BUTTON
========================================================= */

if(unlockButton){

    unlockButton.addEventListener(
        "click",
        checkPassword
    );

}



/* =========================================================
   PASSWORD CHECK
========================================================= */

function checkPassword(){


    /*
        Nothing entered.
    */

    if(
        enteredPassword.length === 0
    ){

        passwordError.textContent =
            "Enter a passcode.";

        return;

    }



    /*
        Correct birthday.

        IMPORTANT:

        The birthday has to have been
        discovered first.
    */

    if(
        enteredPassword ===
        VICTIM_BIRTHDAY
    ){

        const victimFileViewed =
            localStorage.getItem(
                VICTIM_FILE_VIEWED_KEY
            ) === "true";


        if(!victimFileViewed){

            passwordError.textContent =
                "Ryan hesitates. He should check the victim file first.";


            enteredPassword =
                "";


            updatePasswordDots();


            return;

        }



        /*
            Correct password.
        */

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


        return;

    }



    /*
        WRONG PASSWORD
    */

    passwordError.textContent =
        "Incorrect passcode.";


    enteredPassword =
        "";


    updatePasswordDots();

}



/* =========================================================
   AUTOMATIC FIRST ATTEMPT
========================================================= */

/*
    Ryan automatically tries a password
    when the repaired phone is first opened.

    It happens only once.

    After this, the player controls
    the keypad manually.
*/

function runFirstAutomaticAttempt(){

    const alreadyAttempted =
        localStorage.getItem(
            FIRST_PASSWORD_ATTEMPT_KEY
        ) === "true";


    if(alreadyAttempted){

        return;

    }


    /*
        Mark as attempted immediately
        so refreshing the page doesn't
        repeat the sequence.
    */

    localStorage.setItem(
        FIRST_PASSWORD_ATTEMPT_KEY,
        "true"
    );


    /*
        Short delay so the player can
        actually see the phone.
    */

    setTimeout(
        () => {

            autoTypePassword(
                FIRST_AUTOMATIC_PASSWORD
            );

        },
        900
    );

}



/* =========================================================
   AUTOMATIC PASSWORD TYPING
========================================================= */

function autoTypePassword(password){

    let index = 0;


    const typingInterval =
        setInterval(
            () => {


                if(
                    index >= password.length
                ){

                    clearInterval(
                        typingInterval
                    );


                    setTimeout(
                        () => {

                            checkPassword();

                        },
                        350
                    );


                    return;

                }


                enteredPassword +=
                    password[index];


                updatePasswordDots();


                index++;


            },
            250
        );

}



/* =========================================================
   UNLOCK PHONE
========================================================= */

function unlockPhone(){

    lockScreen.classList.add(
        "hidden"
    );


    homeScreen.classList.remove(
        "hidden"
    );

}



/* =========================================================
   CHECK SAVED UNLOCK
========================================================= */

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



/* =========================================================
   CLOCK
========================================================= */

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


    if(statusTime){

        statusTime.textContent =
            time;

    }


    if(lockTime){

        lockTime.textContent =
            time;

    }


    if(homeClock){

        homeClock.textContent =
            time;

    }

}


updateClock();


setInterval(
    updateClock,
    1000
);



/* =========================================================
   OPEN APP
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
   OPEN APP
========================================================= */

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



/* =========================================================
   HIDE ALL APPS
========================================================= */

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



/* =========================================================
   BACK BUTTON
========================================================= */

if(appBack){

    appBack.addEventListener(
        "click",
        () => {


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

}



/* =========================================================
   CLOSE APP
========================================================= */

function closeApp(){

    appScreen.classList.add(
        "hidden"
    );


    homeScreen.classList.remove(
        "hidden"
    );


    hideAllApps();

}



/* =========================================================
   HOME BUTTON
========================================================= */

if(phoneHomeButton){

    phoneHomeButton.addEventListener(
        "click",
        closeApp
    );

}



/* =========================================================
   MESSAGES
========================================================= */

const conversations = {


    unknown:{

        name:
            "Unknown Number",

        messages:[

            {
                type:"them",
                text:
                    "Are you still coming tonight?",
                time:
                    "2:31 PM"
            },

            {
                type:"me",
                text:
                    "I don't know yet.",
                time:
                    "2:34 PM"
            },

            {
                type:"them",
                text:
                    "You need to decide.",
                time:
                    "2:35 PM"
            },

            {
                type:"them",
                text:
                    "And don't tell anyone about this.",
                time:
                    "2:36 PM"
            }

        ]

    },



    emma:{

        name:
            "Emma",

        messages:[

            {
                type:"them",
                text:
                    "Hehe",
                time:
                    "9:54 AM"
            },

            {
                type:"me",
                text:
                    "What?",
                time:
                    "9:55 AM"
            },

            {
                type:"them",
                text:
                    "Nothing 😂",
                time:
                    "9:55 AM"
            },

            {
                type:"them",
                text:
                    "You seemed really nervous yesterday.",
                time:
                    "9:56 AM"
            }

        ]

    },



    unknown2:{

        name:
            "52927",

        messages:[

            {
                type:"them",
                text:
                    "Don't forget what we discussed.",
                time:
                    "9:47 AM"
            },

            {
                type:"me",
                text:
                    "I haven't forgotten.",
                time:
                    "9:48 AM"
            },

            {
                type:"them",
                text:
                    "Good.",
                time:
                    "9:48 AM"
            }

        ]

    },



    eve:{

        name:
            "Evelyn",

        messages:[

            {
                type:"them",
                text:
                    "Aaa",
                time:
                    "Yesterday"
            },

            {
                type:"me",
                text:
                    "What happened?",
                time:
                    "Yesterday"
            },

            {
                type:"them",
                text:
                    "Can we talk somewhere private?",
                time:
                    "Yesterday"
            }

        ]

    },



    jane:{

        name:
            "Jenzia",

        messages:[

            {
                type:"them",
                text:
                    "We need to talk.",
                time:
                    "Yesterday"
            },

            {
                type:"me",
                text:
                    "About what?",
                time:
                    "Yesterday"
            },

            {
                type:"them",
                text:
                    "About what you saw.",
                time:
                    "Yesterday"
            }

        ]

    },



    mother:{

        name:
            "Mom",

        messages:[

            {
                type:"them",
                text:
                    "Call me when you get home.",
                time:
                    "Tuesday"
            },

            {
                type:"me",
                text:
                    "I will.",
                time:
                    "Tuesday"
            }

        ]

    },



    unknown3:{

        name:
            "32665",

        messages:[

            {
                type:"them",
                text:
                    "Your verification code is 397275.",
                time:
                    "Saturday"
            }

        ]

    },



    unknown4:{

        name:
            "28581",

        messages:[

            {
                type:"them",
                text:
                    "Your account notification is available.",
                time:
                    "6/2/23"
            }

        ]

    }

};



/* =========================================================
   OPEN CONVERSATION
========================================================= */

document
    .querySelectorAll(
        ".message-row"
    )
    .forEach(
        row => {

            row.addEventListener(
                "click",
                () => {

                    openConversation(
                        row.dataset.chat
                    );

                }
            );

        }
    );



/* =========================================================
   RENDER CONVERSATION
========================================================= */

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

}



/* =========================================================
   GALLERY DATA
========================================================= */

const galleryImages = [

    {
        file:
            "gallery/photo1.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo2.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo3.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo4.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo5.png",
        clue:true,
        text:
            "Something is wrong with this photograph. Look closely."
    },

    {
        file:
            "gallery/photo6.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo7.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo8.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo9.png",
        clue:true,
        text:
            "A detail in the background may be important."
    },

    {
        file:
            "gallery/photo10.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo11.png",
        clue:false,
        text:""
    },

    {
        file:
            "gallery/photo12.png",
        clue:false,
        text:""
    }

];



/* =========================================================
   RENDER GALLERY
========================================================= */

function renderGallery(){

    const grid =
        document.getElementById(
            "galleryGrid"
        );


    if(!grid){

        return;

    }


    grid.innerHTML =
        "";


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



/* =========================================================
   OPEN GALLERY IMAGE
========================================================= */

function openGalleryImage(image){

    if(!imageViewer){

        return;

    }


    viewerImage.src =
        image.file;


    viewerImage.style.display =
        "block";


    viewerImage.onerror =
        () => {

            viewerImage.style.display =
                "none";

        };


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



/* =========================================================
   CLOSE IMAGE
========================================================= */

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



/* =========================================================
   ESCAPE IMAGE
========================================================= */

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



/* =========================================================
   CONTACTS
========================================================= */

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



/* =========================================================
   CONTACT CLICK
========================================================= */

document
    .querySelectorAll(
        ".contact"
    )
    .forEach(
        contact => {

            contact.addEventListener(
                "click",
                () => {

                    openContact(
                        contact.dataset.contact
                    );

                }
            );

        }
    );



/* =========================================================
   OPEN CONTACT
========================================================= */

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



/* =========================================================
   NOTES
========================================================= */

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



/* =========================================================
   NOTE CLICK
========================================================= */

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



/* =========================================================
   OPEN NOTE
========================================================= */

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



/* =========================================================
   INITIALIZE
========================================================= */

if(
    checkRepairCompleted()
){

    checkSavedUnlock();


    /*
        Only run the automatic
        first attempt if the phone
        hasn't already been unlocked.
    */

    const unlocked =
        localStorage.getItem(
            PHONE_UNLOCKED_KEY
        ) === "true";


    if(!unlocked){

        runFirstAutomaticAttempt();

    }

}
