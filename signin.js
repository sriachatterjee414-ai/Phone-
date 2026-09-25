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
    /* -------------------------
      CHECK NAME
    ===================================== */
    ------------------------- */

if (name === "") {

errorMessage.textContent =
"Please enter your ID / name.";

playerName.focus();

return;
}


    /* =====================================
    /* -------------------------
      CHECK PASSWORD
    ===================================== */
    ------------------------- */

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
    /* -------------------------
       SAVE PLAYER DATA
    ------------------------- */

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
        "brokenPhonePlayerPassword",
        password
);


    /*
       We can use this later for
       Continue Game.
    */

localStorage.setItem(
        "brokenPhoneLastPage",
        "story.html"
        "brokenPhoneStarted",
        "true"
);


    /* =====================================
    /* -------------------------
      ENTER STORY
    ===================================== */
       
       Your actual file is:
       story.html
    ------------------------- */

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
   ENTER WITH ENTER KEY
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
        if (event.key === "Enter") {

enterGame.click();

}

}
);


/* =========================================
   REMOVE ERROR WHEN USER TYPES
   BACK TO MENU
========================================= */

playerName.addEventListener(
    "input",
    () => {

        errorMessage.textContent = "";

    }
);


playerPassword.addEventListener(
    "input",
backButton.addEventListener(
    "click",
() => {

        errorMessage.textContent = "";
        window.location.href =
            "index.html";

}
);
