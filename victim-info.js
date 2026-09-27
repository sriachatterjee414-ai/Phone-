/* ============================================================
   BROKEN PHONE
   VICTIM INFORMATION / CASE FILE

   IMPORTANT:

   This page is NOT locked behind the phone password.

   The victim information is a police case file outside
   the victim's phone.

   Therefore:
   - Victim information is always accessible.
   - Crime scene is always accessible.
   - Forensic information is always accessible.
   - The birthday/passcode information is accessible.
   - Suspects synchronize with brokenPhoneGameState.
============================================================ */


/* ============================================================
   STORAGE
============================================================ */

const GAME_STATE_KEY =
    "brokenPhoneGameState";


const PHONE_RETURN_KEY =
    "victimInfoReturnPage";


/* ============================================================
   DEFAULT VICTIM
============================================================ */

const DEFAULT_VICTIM = {

    id:
        "evelyn-carter",

    name:
        "Evelyn Carter",

    img:
        "victim_portrait.png",

    birthday:
        "May 21, 2001",

    age:
        "24",

    sex:
        "Female",

    occupation:
        "Unknown",

    address:
        "Unknown",

    emergency:
        "Unknown",

    phoneStatus:
        "RECOVERED — DAMAGED",

    caseStatus:
        "ACTIVE",

    cause:
        "UNDER INVESTIGATION",

    timeOfDeath:
        "UNKNOWN",

    discoveryLocation:
        "UNKNOWN",

    dateDiscovered:
        "OCTOBER 17",

    crimeSceneImage:
        "crime_scene.png",

    deathEvidenceImage:
        "death_scene.png"

};


/* ============================================================
   LOAD GAME STATE
============================================================ */

function loadGameState() {

    try {

        const raw =
            localStorage.getItem(
                GAME_STATE_KEY
            );


        if (!raw) {

            return {

                characters: [],

                suspects: [],

                victim: null

            };

        }


        const state =
            JSON.parse(raw);


        return {

            characters:
                Array.isArray(state.characters)
                    ? state.characters
                    : [],

            suspects:
                Array.isArray(state.suspects)
                    ? state.suspects
                    : [],

            victim:
                state.victim || null

        };

    }

    catch (error) {

        console.error(
            "Victim Info: Could not load game state.",
            error
        );


        return {

            characters: [],

            suspects: [],

            victim: null

        };

    }

}


/* ============================================================
   GET VICTIM
============================================================ */

function getVictim() {

    const state =
        loadGameState();


    if (state.victim) {

        return {

            ...DEFAULT_VICTIM,

            ...state.victim

        };

    }


    return {
        ...DEFAULT_VICTIM
    };

}


/* ============================================================
   ELEMENTS
============================================================ */

const victimName =
    document.getElementById(
        "victimName"
    );


const victimPortrait =
    document.getElementById(
        "victimPortrait"
    );


const victimBirthday =
    document.getElementById(
        "victimBirthday"
    );


const victimAge =
    document.getElementById(
        "victimAge"
    );


const victimSex =
    document.getElementById(
        "victimSex"
    );


const victimOccupation =
    document.getElementById(
        "victimOccupation"
    );


const victimAddress =
    document.getElementById(
        "victimAddress"
    );


const victimEmergency =
    document.getElementById(
        "victimEmergency"
    );


const victimPhoneStatus =
    document.getElementById(
        "victimPhoneStatus"
    );


const caseStatus =
    document.getElementById(
        "caseStatus"
    );


const crimeSceneImage =
    document.getElementById(
        "crimeSceneImage"
    );


const crimeSceneCaption =
    document.getElementById(
        "crimeSceneCaption"
    );


const deathEvidenceImage =
    document.getElementById(
        "deathEvidenceImage"
    );


const deathEvidenceCaption =
    document.getElementById(
        "deathEvidenceCaption"
    );


const causeOfDeath =
    document.getElementById(
        "causeOfDeath"
    );


const timeOfDeath =
    document.getElementById(
        "timeOfDeath"
    );


const discoveryLocation =
    document.getElementById(
        "discoveryLocation"
    );


const dateDiscovered =
    document.getElementById(
        "dateDiscovered"
    );


const investigationStatus =
    document.getElementById(
        "investigationStatus"
    );


const forensicTimeOfDeath =
    document.getElementById(
        "forensicTimeOfDeath"
    );


const forensicLocation =
    document.getElementById(
        "forensicLocation"
    );


const forensicDate =
    document.getElementById(
        "forensicDate"
    );


const forensicCaseStatus =
    document.getElementById(
        "forensicCaseStatus"
    );


const fileVictimName =
    document.getElementById(
        "fileVictimName"
    );


const fileVictimBirthday =
    document.getElementById(
        "fileVictimBirthday"
    );


const phonePasscode =
    document.getElementById(
        "phonePasscode"
    );


const suspectList =
    document.getElementById(
        "suspectList"
    );


const showBirthdayButton =
    document.getElementById(
        "showBirthdayButton"
    );


const birthdayFile =
    document.getElementById(
        "birthdayFile"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


/* ============================================================
   BIRTHDAY → PHONE PASSCODE
============================================================ */

function getBirthdayPasscode(birthday) {

    if (!birthday) {

        return "----";

    }


    const match =
        birthday.match(
            /([A-Za-z]+)\s+(\d{1,2})/
        );


    if (!match) {

        return "----";

    }


    const monthName =
        match[1].toLowerCase();


    const day =
        match[2].padStart(2, "0");


    const months = {

        january: "01",

        february: "02",

        march: "03",

        april: "04",

        may: "05",

        june: "06",

        july: "07",

        august: "08",

        september: "09",

        october: "10",

        november: "11",

        december: "12"

    };


    const month =
        months[monthName];


    if (!month) {

        return "----";

    }


    return month + day;

}


/* ============================================================
   UPDATE VICTIM
============================================================ */

function updateVictimInformation() {

    const victim =
        getVictim();


    victimName.textContent =
        victim.name;


    victimPortrait.src =
        victim.img ||
        "victim_portrait.png";


    victimPortrait.alt =
        victim.name;


    victimBirthday.textContent =
        victim.birthday ||
        "Unknown";


    victimAge.textContent =
        victim.age ||
        "Unknown";


    victimSex.textContent =
        victim.sex ||
        "Unknown";


    victimOccupation.textContent =
        victim.occupation ||
        "Unknown";


    victimAddress.textContent =
        victim.address ||
        "Unknown";


    victimEmergency.textContent =
        victim.emergency ||
        "Unknown";


    victimPhoneStatus.textContent =
        victim.phoneStatus ||
        "Unknown";


    caseStatus.textContent =
        victim.caseStatus ||
        "ACTIVE INVESTIGATION";


    /* ========================================================
       CRIME SCENE
    ======================================================== */

    crimeSceneImage.src =
        victim.crimeSceneImage ||
        "crime_scene.png";


    crimeSceneImage.alt =
        "Crime scene — " +
        victim.name;


    crimeSceneCaption.textContent =
        "Primary crime scene photograph associated with " +
        victim.name +
        ". Scene remains under investigation.";


    /* ========================================================
       FORENSIC IMAGE
    ======================================================== */

    deathEvidenceImage.src =
        victim.deathEvidenceImage ||
        "death_scene.png";


    deathEvidenceImage.alt =
        "Forensic evidence — " +
        victim.name;


    deathEvidenceCaption.textContent =
        "Forensic evidence photograph currently associated " +
        "with the homicide investigation.";


    /* ========================================================
       CASE INFORMATION
    ======================================================== */

    causeOfDeath.textContent =
        victim.cause ||
        "UNDER INVESTIGATION";


    timeOfDeath.textContent =
        victim.timeOfDeath ||
        "UNKNOWN";


    discoveryLocation.textContent =
        victim.discoveryLocation ||
        "UNKNOWN";


    dateDiscovered.textContent =
        victim.dateDiscovered ||
        "UNKNOWN";


    investigationStatus.textContent =
        victim.caseStatus ||
        "ACTIVE";


    forensicTimeOfDeath.textContent =
        victim.timeOfDeath ||
        "UNKNOWN";


    forensicLocation.textContent =
        victim.discoveryLocation ||
        "UNKNOWN";


    forensicDate.textContent =
        victim.dateDiscovered ||
        "UNKNOWN";


    forensicCaseStatus.textContent =
        victim.caseStatus ||
        "ACTIVE";


    /* ========================================================
       IDENTIFICATION FILE
    ======================================================== */

    fileVictimName.textContent =
        victim.name;


    fileVictimBirthday.textContent =
        victim.birthday ||
        "UNKNOWN";


    phonePasscode.textContent =
        getBirthdayPasscode(
            victim.birthday
        );

}


/* ============================================================
   SUSPECT STATUS
============================================================ */

function getSuspectStatus() {

    return "PERSON OF INTEREST";

}


/* ============================================================
   RENDER SUSPECTS
============================================================ */

function renderSuspects() {

    const state =
        loadGameState();


    const characters =
        state.characters;


    const suspectIds =
        state.suspects;


    const victim =
        state.victim;


    const suspects =
        characters.filter(
            character => {

                if (
                    !suspectIds.includes(
                        character.id
                    )
                ) {

                    return false;

                }


                if (
                    victim &&
                    victim.id === character.id
                ) {

                    return false;

                }


                return true;

            }
        );


    if (!suspects.length) {

        suspectList.innerHTML = `

            <div class="no-suspects">

                NO PERSONS OF INTEREST
                HAVE BEEN IDENTIFIED.

            </div>

        `;

        return;

    }


    suspectList.innerHTML =
        suspects.map(
            character => `

                <article
                    class="suspect-card"
                >

                    <div class="suspect-photo">

                        ${
                            character.img

                            ?

                            `
                            <img
                                src="${character.img}"
                                alt="${character.name}"
                            >
                            `

                            :

                            `
                            <div
                                class="unknown-silhouette"
                            >
                                ?
                            </div>
                            `
                        }

                    </div>


                    <div class="suspect-information">

                        <div class="suspect-status">

                            ${getSuspectStatus()}

                        </div>


                        <h2>
                            ${character.name}
                        </h2>


                        <div class="suspect-row">

                            <span>
                                STATUS
                            </span>

                            <strong>
                                Under investigation
                            </strong>

                        </div>


                        <div class="suspect-row">

                            <span>
                                CONNECTION
                            </span>

                            <strong>
                                Pending investigation
                            </strong>

                        </div>


                        <div class="suspect-row">

                            <span>
                                EVIDENCE
                            </span>

                            <strong>
                                Flagged by investigator
                            </strong>

                        </div>

                    </div>

                </article>

            `
        ).join("");

}


/* ============================================================
   BIRTHDAY FILE
============================================================ */

showBirthdayButton.addEventListener(
    "click",
    function () {

        birthdayFile.classList.remove(
            "hidden"
        );


        showBirthdayButton.textContent =
            "IDENTIFICATION FILE OPEN";


        showBirthdayButton.disabled =
            true;

    }
);


/* ============================================================
   BACK
============================================================ */

function returnToPreviousPage() {

    const returnPage =
        localStorage.getItem(
            PHONE_RETURN_KEY
        );


    if (returnPage) {

        localStorage.removeItem(
            PHONE_RETURN_KEY
        );


        window.location.href =
            returnPage;


        return;

    }


    window.location.href =
        "story.html";

}


backButton.addEventListener(
    "click",
    returnToPreviousPage
);


/* ============================================================
   IMAGE FALLBACKS
============================================================ */

victimPortrait.addEventListener(
    "error",
    function () {

        this.style.display =
            "none";

    }
);


crimeSceneImage.addEventListener(
    "error",
    function () {

        this.style.display =
            "none";

    }
);


deathEvidenceImage.addEventListener(
    "error",
    function () {

        this.style.display =
            "none";

    }
);


/* ============================================================
   INITIALIZE
============================================================ */

function initializeVictimFile() {

    updateVictimInformation();

    renderSuspects();

}


initializeVictimFile();
