/* =====================================================
   VICTIM PHONE
   MAIN PHONE CONTROLLER
===================================================== */


/* =====================================================
   CONSTANTS
===================================================== */

const REPAIR_COMPLETE_KEY =
    "brokenPhoneRepairComplete";

const VICTIM_FILE_VIEWED_KEY =
    "victimFileViewed";


/*
    Evelyn Carter
    Birthday: May 21
    Phone password: 0521
*/

const PHONE_PASSWORD = "0521";


/* =====================================================
   REPAIR CHECK
===================================================== */

function checkRepairCompleted() {

    const repaired =
        localStorage.getItem(
            REPAIR_COMPLETE_KEY
        ) === "true";


    if (!repaired) {

        window.location.href =
            "../repair.html";

        return false;
    }


    return true;
}


/* =====================================================
   ELEMENTS
===================================================== */

const lockScreen =
    document.getElementById(
        "lockScreen"
    );

const homeScreen =
    document.getElementById(
        "homeScreen"
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

const deleteKey =
    document.getElementById(
        "deleteKey"
    );

const victimInfoButton =
    document.getElementById(
        "victimInfoButton"
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

const phoneHomeButton =
    document.getElementById(
        "phoneHomeButton"
    );


/* =====================================================
   PASSWORD
===================================================== */

let enteredPassword = "";


/* =====================================================
   VICTIM INFO
===================================================== */

if (victimInfoButton) {

    victimInfoButton.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                VICTIM_FILE_VIEWED_KEY,
                "true"
            );

            window.location.href =
                "../victim-info.html";

        }
    );

}


/* =====================================================
   KEYPAD
===================================================== */

document
    .querySelectorAll(
        ".keypad button[data-key]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        enteredPassword.length >= 4
                    ) {
                        return;
                    }


                    enteredPassword +=
                        button.dataset.key;


                    updatePasswordDots();

                }
            );

        }
    );


/* =====================================================
   DELETE
===================================================== */

if (deleteKey) {

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


/* =====================================================
   PASSWORD DOTS
===================================================== */

function updatePasswordDots() {

    passwordDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "filled",
                index <
                enteredPassword.length
            );

        }
    );

}


/* =====================================================
   UNLOCK
===================================================== */

if (unlockButton) {

    unlockButton.addEventListener(
        "click",
        checkPassword
    );

}


function checkPassword() {

    if (
        enteredPassword.length === 0
    ) {

        passwordError.textContent =
            "Enter a passcode.";

        return;
    }


    const victimFileViewed =
        localStorage.getItem(
            VICTIM_FILE_VIEWED_KEY
        ) === "true";


    if (!victimFileViewed) {

        passwordError.textContent =
            "Ryan should check the victim file first.";


        enteredPassword = "";

        updatePasswordDots();

        return;
    }


    if (
        enteredPassword ===
        PHONE_PASSWORD
    ) {

        passwordError.textContent = "";

        enteredPassword = "";

        updatePasswordDots();

        unlockPhone();

        return;
    }


    passwordError.textContent =
        "Incorrect passcode.";

    enteredPassword = "";

    updatePasswordDots();
}


/* =====================================================
   UNLOCK PHONE
===================================================== */

function unlockPhone() {

    lockScreen.classList.add(
        "hidden"
    );

    homeScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
   LOCK PHONE
===================================================== */

function lockPhone() {

    /*
        IMPORTANT:

        There is NO localStorage
        phone-unlocked variable.

        Every time Ryan leaves the
        phone, it becomes locked again.
    */

    homeScreen.classList.add(
        "hidden"
    );

    lockScreen.classList.remove(
        "hidden"
    );

    enteredPassword = "";

    updatePasswordDots();

    passwordError.textContent = "";

}


/* =====================================================
   OPEN APP
===================================================== */

document
    .querySelectorAll(
        "[data-app-url]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const destination =
                        button.dataset.appUrl;


                    /*
                        The app opens as a
                        completely separate
                        HTML document.

                        When that document
                        returns to phone.html,
                        the phone starts locked.
                    */

                    window.location.href =
                        destination;

                }
            );

        }
    );


/* =====================================================
   HOME BUTTON
===================================================== */

if (phoneHomeButton) {

    phoneHomeButton.addEventListener(
        "click",
        () => {

            lockPhone();

        }
    );

}


/* =====================================================
   CLOCK
===================================================== */

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
        `${hours}:${minutes}`;


    if (statusTime) {

        statusTime.textContent =
            time;

    }


    if (lockTime) {

        lockTime.textContent =
            time;

    }


    if (homeClock) {

        homeClock.textContent =
            time;

    }

}


updateClock();


setInterval(
    updateClock,
    1000
);


/* =====================================================
   INITIALIZE
===================================================== */

if (
    !checkRepairCompleted()
) {

    // Stop initialization.
}
