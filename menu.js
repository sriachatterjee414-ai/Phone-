const newGameBtn = document.getElementById("newGameBtn");
const continueBtn = document.getElementById("continueBtn");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");

const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");

const quitBtn = document.getElementById("quitBtn");
const quitMessage = document.getElementById("quitMessage");

const stayBtn = document.getElementById("stayBtn");
const leaveBtn = document.getElementById("leaveBtn");


// ===============================
// NEW GAME
// ===============================

newGameBtn.addEventListener("click", () => {

    window.location.href = "signin.html";

});


// ===============================
// CONTINUE
// ===============================

continueBtn.addEventListener("click", () => {

    const savedName = localStorage.getItem("brokenPhonePlayerName");

    if (savedName) {

        window.location.href = "signin.html";

    } else {

        alert("No saved game found.");

    }

});


// ===============================
// SETTINGS
// ===============================

settingsBtn.addEventListener("click", () => {

    settingsPanel.classList.add("active");

});

closeSettings.addEventListener("click", () => {

    settingsPanel.classList.remove("active");

});


// ===============================
// VOLUME
// ===============================

volume.addEventListener("input", () => {

    volumeValue.textContent = volume.value + "%";

    localStorage.setItem(
        "brokenPhoneVolume",
        volume.value
    );

});


// Load saved volume

const savedVolume =
    localStorage.getItem("brokenPhoneVolume");

if (savedVolume !== null) {

    volume.value = savedVolume;

    volumeValue.textContent =
        savedVolume + "%";

}


// ===============================
// QUIT
// ===============================

quitBtn.addEventListener("click", () => {

    quitMessage.classList.add("active");

});

stayBtn.addEventListener("click", () => {

    quitMessage.classList.remove("active");

});

leaveBtn.addEventListener("click", () => {

    /*
       Browsers normally don't allow a webpage
       to close itself.

       For now we return to a blank screen.
    */

    document.body.innerHTML = "";

});
