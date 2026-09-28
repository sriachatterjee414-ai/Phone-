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

const isContinueFlow =
    new URLSearchParams(window.location.search).get("continue") === "1";

if (isContinueFlow) {
    playerName.value =
        localStorage.getItem("brokenPhonePlayerName") || "";

    playerPassword.value =
        localStorage.getItem("brokenPhonePlayerPassword") || "";
}


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

    let destination = "story.html";

    if (isContinueFlow) {
        const resumePage =
            localStorage.getItem("brokenPhoneResumePage");

        const allowedPages = new Set([
            "story.html",
            "investigation.html",
            "desk.html",
            "cabinet.html",
            "table.html",
            "repair.html",
            "phone.html",
            "story2.html",
            "messages.html",
            "calls.html",
            "contacts.html",
            "gallery.html",
            "notes.html",
            "browser.html",
            "camera.html",
            "bank.html",
            "music.html",
            "clock.html",
            "settings.html",
            "victim-info.html"
        ]);

        if (allowedPages.has(resumePage)) {
            destination = resumePage === "story2.html"
                ? "story2.html?v=save-slot-3"
                : resumePage;
        } else if (localStorage.getItem("brokenPhoneStory2Started") === "true") {
            destination =
                localStorage.getItem("brokenPhoneStory2Complete") === "true"
                    ? "phone.html"
                    : "story2.html?v=save-slot-3";
        } else if (localStorage.getItem("brokenPhoneRepairComplete") === "true") {
            destination = "phone.html";
        } else if (localStorage.getItem("brokenPhoneStory1Complete") === "true") {
            destination = "investigation.html";
        }
    }

    window.location.href = destination;

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
