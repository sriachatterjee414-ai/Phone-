/* =========================================
   BROKEN PHONE
   SIGN IN
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const playerName =
    document.getElementById("playerName");

const playerPassword =
    document.getElementById("playerPassword");

const enterGame =
    document.getElementById("enterGame");

const backButton =
    document.getElementById("backButton");

const errorMessage =
    document.getElementById("errorMessage");


/* =========================================
   LOGIN FUNCTION
========================================= */

function enterStory() {

    const name =
        playerName.value.trim();

    const password =
        playerPassword.value.trim();


    /* =====================================
       CHECK NAME
    ===================================== */

    if (name === "") {

        errorMessage.textContent =
            "Please enter your ID / name.";

        playerName.focus();

        return;
    }


    /* =====================================
       CHECK PASSWORD
    ===================================== */

    if (password === "") {

        errorMessage.textContent =
            "Please enter your password.";

        playerPassword.focus();

        return;
    }


    /* =====================================
       CLEAR ERROR
    ===================================== */

    errorMessage.textContent = "";


    /* =====================================
       SAVE PLAYER NAME
    ===================================== */

    localStorage.setItem(
        "brokenPhonePlayerName",
        name
    );


    /* =====================================
       SAVE PASSWORD
    ===================================== */

    localStorage.setItem(
        "brokenPhonePlayerPassword",
        password
    );


    /* =====================================
       SAVE GAME STATE
    ===================================== */

    localStorage.setItem(
        "brokenPhoneStarted",
        "true"
    );


    localStorage.setItem(
        "brokenPhoneLastPage",
        "story.html"
    );


    /* =====================================
       ENTER STORY
    ===================================== */

    window.location.href =
        "story.html";
}


/* =========================================
   ENTER BUTTON
========================================= */

if (enterGame) {

    enterGame.addEventListener(
        "click",
        enterStory
    );
}


/* =========================================
   ENTER KEY SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            enterStory();
        }
    }
);


/* =========================================
   BACK TO MAIN MENU
========================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";
        }
    );
}


/* =========================================
   REMOVE ERROR WHEN USER TYPES
========================================= */

if (playerName) {

    playerName.addEventListener(
        "input",
        () => {

            if (errorMessage) {
                errorMessage.textContent = "";
            }
        }
    );
}


if (playerPassword) {

    playerPassword.addEventListener(
        "input",
        () => {

            if (errorMessage) {
                errorMessage.textContent = "";
            }
        }
    );
}
