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


enterGame.addEventListener("click", () => {

    const name =
        playerName.value.trim();

    const password =
        playerPassword.value.trim();


    if (name === "") {

        errorMessage.textContent =
            "Please enter your ID / name.";

        return;
    }


    if (password === "") {

        errorMessage.textContent =
            "Please enter your password.";

        return;
    }


    // Save the player's name
    localStorage.setItem(
        "brokenPhonePlayerName",
        name
    );


    // Save a simple game-state flag
    localStorage.setItem(
        "brokenPhoneStarted",
        "true"
    );


    /*
       THIS IS WHERE OUR NEXT GAME SECTION
       WILL CONNECT.

       For now, it goes to game.html.
    */

    window.location.href = "game.html";

});


backButton.addEventListener("click", () => {

    window.location.href = "index.html";

});
