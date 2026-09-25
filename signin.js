/* =========================================
   BROKEN PHONE
   SIGN IN
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


    /* -------------------------
       CHECK NAME
    ------------------------- */

    if (name === "") {

        errorMessage.textContent =
            "Please enter your ID / name.";

        playerName.focus();

        return;
    }


    /* -------------------------
       CHECK PASSWORD
    ------------------------- */

    if (password === "") {

        errorMessage.textContent =
            "Please enter your password.";

        playerPassword.focus();

        return;
    }


    /* -------------------------
       SAVE PLAYER DATA
    ------------------------- */

    localStorage.setItem(
        "brokenPhonePlayerName",
        name
    );

    localStorage.setItem(
        "brokenPhonePlayerPassword",
        password
    );

    localStorage.setItem(
        "brokenPhoneStarted",
        "true"
    );


    /* -------------------------
       ENTER STORY
       
       Your actual file is:
       story.html
    ------------------------- */

    window.location.href =
        "story.html";

});


/* =========================================
   ENTER WITH ENTER KEY
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            enterGame.click();

        }

    }
);


/* =========================================
   BACK TO MENU
========================================= */

backButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);
