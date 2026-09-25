/* =========================================
   BROKEN PHONE
   SIGN IN
========================================= */

document.addEventListener("DOMContentLoaded", () => {

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


    /* =====================================
       LOGIN
    ===================================== */

    function enterStory() {

        const name =
            playerName.value.trim();

        const password =
            playerPassword.value.trim();


        /* CHECK NAME */

        if (name === "") {

            errorMessage.textContent =
                "Please enter your ID / name.";

            playerName.focus();

            return;
        }


        /* CHECK PASSWORD */

        if (password === "") {

            errorMessage.textContent =
                "Please enter your password.";

            playerPassword.focus();

            return;
        }


        /* CLEAR ERROR */

        errorMessage.textContent = "";


        /* SAVE NAME */

        localStorage.setItem(
            "brokenPhonePlayerName",
            name
        );


        /* SAVE PASSWORD */

        localStorage.setItem(
            "brokenPhonePlayerPassword",
            password
        );


        /* SAVE GAME STATE */

        localStorage.setItem(
            "brokenPhoneStarted",
            "true"
        );


        localStorage.setItem(
            "brokenPhoneLastPage",
            "story.html"
        );


        /* GO TO STORY */

        window.location.assign("story.html");
    }


    /* =====================================
       ENTER BUTTON
    ===================================== */

    enterGame.addEventListener(
        "click",
        enterStory
    );


    /* =====================================
       ENTER KEY
    ===================================== */

    playerName.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                enterStory();
            }
        }
    );


    playerPassword.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                enterStory();
            }
        }
    );


    /* =====================================
       BACK BUTTON
    ===================================== */

    backButton.addEventListener(
        "click",
        () => {

            window.location.assign(
                "index.html"
            );
        }
    );


    /* =====================================
       REMOVE ERROR WHEN TYPING
    ===================================== */

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

});
