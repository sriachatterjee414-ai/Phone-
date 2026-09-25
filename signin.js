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
   ENTER GAME
========================================= */

enterGame.addEventListener("click", () => {

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
       SAVE GAME STATE
    ===================================== */

    localStorage.setItem(
        "brokenPhoneStarted",
        "true"
    );


    /*
       We can use this later for
       Continue Game.
    */

    localStorage.setItem(
        "brokenPhoneLastPage",
        "story.html"
    );


    /* =====================================
       ENTER STORY
    ===================================== */

    window.location.href =
        "story.html";

});


/* =========================================
   BACK TO MAIN MENU
========================================= */

backButton.addEventListener("click", () => {

    window.location.href =
        "index.html";

});


/* =========================================
   ENTER KEY SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            /*
               Don't submit twice while
               the button is being used.
            */

            event.preventDefault();

            enterGame.click();
        }
    }
);


/* =========================================
   REMOVE ERROR WHEN USER TYPES
========================================= */

playerName.addEventListener(
    "input",
    () => {

        errorMessage.textContent = "";

    }
);


playerPassword.addEventListener(
    "input",
    () => {

        errorMessage.textContent = "";

    }
);
