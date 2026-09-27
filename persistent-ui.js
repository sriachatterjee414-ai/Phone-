/* ============================================================
   PERSISTENT-UI.JS

   Add this ONE line to every page that should have the
   persistent game UI:

       <script src="persistent-ui.js"></script>

   This file:
   - Saves shared game state in localStorage
   - Keeps characters between pages
   - Keeps suspects between pages
   - Keeps victim information between pages
   - Keeps clues between pages
   - Keeps phone repair/unlock state between pages
   - Creates the persistent game bar automatically
   - Provides window.GameUI for your existing JS files

   ============================================================ */

(function () {

    "use strict";

    /* ========================================================
       SAVE KEY
       ======================================================== */

    const STORAGE_KEY = "brokenPhoneGameState";


    /* ========================================================
       DEFAULT GAME STATE
       ======================================================== */

    const defaultState = {

        /* --------------------------------
           Characters
           --------------------------------

           Example:

           {
               id: "ryan",
               name: "Ryan Hale",
               img: "ryan_neutral.png",
               isVictim: false
           }
        */

        characters: [],


        /* --------------------------------
           Suspects

           Stores CHARACTER IDs only.

           Example:
           ["ryan", "officer_male"]
        */

        suspects: [],


        /* --------------------------------
           Victim

           Example:

           {
               id: "victim",
               name: "Victim Name",
               img: "victim.png",
               cause: "Cause of death",
               birthday: "12/05/1999"
           }
        */

        victim: null,


        /* --------------------------------
           Clues

           Stores unique clue IDs.

           Example:
           ["desk_file_01", "phone_note_03"]
        */

        clues: [],


        /* --------------------------------
           Total possible clues

           Change this later when you know
           the actual final number.
        */

        totalCluesPossible: 15,


        /* --------------------------------
           PHONE
           -------------------------------- */

        phone: {

            /* Has the phone been obtained? */
            obtained: false,

            /* Repair percentage */
            repairPercent: 0,

            /* Repair is completely finished */
            repaired: false,

            /* Password successfully entered */
            unlocked: false
        },


        /* --------------------------------
           STORY PROGRESS

           Useful later for Continue Game.
        */

        currentStory: "story",


        /* --------------------------------
           INVENTORY

           Stores item IDs.

           Example:
           ["precision_screwdriver", "battery"]
        */

        inventory: []
    };


    /* ========================================================
       SAFE CLONE
       ======================================================== */

    function cloneDefaultState() {

        return JSON.parse(
            JSON.stringify(defaultState)
        );

    }


    /* ========================================================
       LOAD STATE
       ======================================================== */

    function loadState() {

        try {

            const raw =
                localStorage.getItem(STORAGE_KEY);


            /* No previous save */
            if (!raw) {

                return cloneDefaultState();

            }


            const parsed = JSON.parse(raw);

            const fresh = cloneDefaultState();


            /* --------------------------------------------
               Merge top-level values
               -------------------------------------------- */

            Object.keys(parsed).forEach(key => {

                if (
                    key !== "phone" &&
                    parsed[key] !== undefined
                ) {

                    fresh[key] = parsed[key];

                }

            });


            /* --------------------------------------------
               Merge phone separately
               -------------------------------------------- */

            if (
                parsed.phone &&
                typeof parsed.phone === "object"
            ) {

                fresh.phone = {

                    ...fresh.phone,
                    ...parsed.phone

                };

            }


            /* --------------------------------------------
               Safety checks
               -------------------------------------------- */

            if (!Array.isArray(fresh.characters)) {

                fresh.characters = [];

            }

            if (!Array.isArray(fresh.suspects)) {

                fresh.suspects = [];

            }

            if (!Array.isArray(fresh.clues)) {

                fresh.clues = [];

            }

            if (!Array.isArray(fresh.inventory)) {

                fresh.inventory = [];

            }


            return fresh;

        }

        catch (error) {

            console.error(
                "GameUI: Could not load save.",
                error
            );

            return cloneDefaultState();

        }

    }


    /* ========================================================
       CURRENT STATE
       ======================================================== */

    let state = loadState();


    /* ========================================================
       SAVE STATE
       ======================================================== */

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );

        }

        catch (error) {

            console.error(
                "GameUI: Could not save game state.",
                error
            );

        }


        renderBar();

    }


    /* ========================================================
       CHARACTER FUNCTIONS
       ======================================================== */

    function addCharacter(id, name, img) {

        if (!id) {

            console.warn(
                "GameUI.addCharacter(): missing character ID."
            );

            return;

        }


        /* Don't add the same character twice */

        const alreadyExists =
            state.characters.some(
                character => character.id === id
            );


        if (alreadyExists) {

            return;

        }


        state.characters.push({

            id: id,

            name: name || "Unknown",

            img: img || "",

            isVictim: false

        });


        saveState();

    }


    function removeCharacter(id) {

        state.characters =
            state.characters.filter(
                character => character.id !== id
            );


        /* Also remove from suspects */

        state.suspects =
            state.suspects.filter(
                suspectID => suspectID !== id
            );


        saveState();

    }


    function hasCharacter(id) {

        return state.characters.some(
            character => character.id === id
        );

    }


    /* ========================================================
       VICTIM
       ======================================================== */

    function setVictim(
        name,
        img,
        cause,
        birthday
    ) {

        const victimID = "victim";


        state.victim = {

            id: victimID,

            name: name || "Unknown",

            img: img || "",

            cause: cause || "",

            birthday: birthday || ""

        };


        /* --------------------------------------------
           Make sure victim exists in Characters too.
           -------------------------------------------- */

        const victimAlreadyExists =
            state.characters.some(
                character => character.id === victimID
            );


        if (!victimAlreadyExists) {

            state.characters.push({

                id: victimID,

                name: name || "Unknown",

                img: img || "",

                isVictim: true

            });

        }


        /* --------------------------------------------
           If victim somehow existed as a suspect,
           remove them immediately.
           -------------------------------------------- */

        state.suspects =
            state.suspects.filter(
                id => id !== victimID
            );


        saveState();

    }


    function hasVictim() {

        return state.victim !== null;

    }


    /* ========================================================
       SUSPECT FUNCTIONS
       ======================================================== */

    function markSuspect(id) {

        if (!id) {

            return;

        }


        /* --------------------------------------------
           Victim can NEVER be a suspect.
           -------------------------------------------- */

        if (id === "victim") {

            return;

        }


        if (
            state.victim &&
            state.victim.id === id
        ) {

            return;

        }


        /* Only existing characters can become suspects */

        const exists =
            state.characters.some(
                character => character.id === id
            );


        if (!exists) {

            console.warn(
                "GameUI.markSuspect(): character does not exist:",
                id
            );

            return;

        }


        /* Don't duplicate */

        if (
            state.suspects.includes(id)
        ) {

            return;

        }


        state.suspects.push(id);

        saveState();

    }


    function removeSuspect(id) {

        state.suspects =
            state.suspects.filter(
                suspectID => suspectID !== id
            );

        saveState();

    }


    function isSuspect(id) {

        return state.suspects.includes(id);

    }


    /* ========================================================
       CLUE SYSTEM
       ======================================================== */

    function addClue(id) {

        if (!id) {

            console.warn(
                "GameUI.addClue(): missing clue ID."
            );

            return;

        }


        /* Prevent duplicate clues */

        if (
            state.clues.includes(id)
        ) {

            return;

        }


        state.clues.push(id);

        saveState();

    }


    function hasClue(id) {

        return state.clues.includes(id);

    }


    function getClueCount() {

        return state.clues.length;

    }


    function setTotalCluesPossible(number) {

        const value =
            Number(number);


        if (
            !Number.isFinite(value) ||
            value < 0
        ) {

            console.warn(
                "GameUI.setTotalCluesPossible(): invalid number."
            );

            return;

        }


        state.totalCluesPossible =
            Math.floor(value);

        saveState();

    }


    /* ========================================================
       ENDING SYSTEM
       ======================================================== */

    function getEndingTier() {

        const total =
            Number(state.totalCluesPossible);


        /* Avoid division by zero */

        if (
            !Number.isFinite(total) ||
            total <= 0
        ) {

            return "bad";

        }


        const ratio =
            state.clues.length / total;


        if (ratio >= 0.80) {

            return "good";

        }


        if (ratio >= 0.40) {

            return "medium";

        }


        return "bad";

    }


    /* ========================================================
       PHONE FUNCTIONS
       ======================================================== */

    function setPhoneObtained(value = true) {

        state.phone.obtained =
            Boolean(value);

        saveState();

    }


    function setRepairPercent(percent) {

        let value =
            Number(percent);


        if (!Number.isFinite(value)) {

            value = 0;

        }


        value =
            Math.max(
                0,
                Math.min(
                    100,
                    value
                )
            );


        state.phone.repairPercent =
            value;


        /* Automatically mark repaired at 100% */

        if (value >= 100) {

            state.phone.repaired = true;

            state.phone.obtained = true;

        }


        saveState();

    }


    function isPhoneRepaired() {

        return state.phone.repaired === true;

    }


    function unlockPhone() {

        /* --------------------------------------------
           Don't allow unlocking before repair.
           -------------------------------------------- */

        if (
            !state.phone.repaired
        ) {

            console.warn(
                "GameUI.unlockPhone(): phone is not repaired yet."
            );

            return;

        }


        state.phone.unlocked = true;

        state.phone.obtained = true;

        saveState();

    }


    function isPhoneUnlocked() {

        return state.phone.unlocked === true;

    }


    /* ========================================================
       INVENTORY
       ======================================================== */

    function addItem(id) {

        if (!id) {

            return;

        }


        if (
            !state.inventory.includes(id)
        ) {

            state.inventory.push(id);

            saveState();

        }

    }


    function removeItem(id) {

        state.inventory =
            state.inventory.filter(
                item => item !== id
            );

        saveState();

    }


    function hasItem(id) {

        return state.inventory.includes(id);

    }


    /* ========================================================
       STORY PROGRESS
       ======================================================== */

    function setCurrentStory(storyName) {

        state.currentStory =
            storyName || "story";

        saveState();

    }


    function getCurrentStory() {

        return state.currentStory;

    }


    /* ========================================================
       DEBUG
       ======================================================== */

    function getState() {

        return JSON.parse(
            JSON.stringify(state)
        );

    }


    /* ========================================================
       RESET GAME
       ======================================================== */

    function resetAll() {

        state =
            cloneDefaultState();


        saveState();

    }


    /* ========================================================
       PUBLIC GAMEUI API
       ======================================================== */

    window.GameUI = {

        /* Characters */
        addCharacter,
        removeCharacter,
        hasCharacter,

        /* Victim */
        setVictim,
        hasVictim,

        /* Suspects */
        markSuspect,
        removeSuspect,
        isSuspect,

        /* Clues */
        addClue,
        hasClue,
        getClueCount,
        setTotalCluesPossible,
        getEndingTier,

        /* Phone */
        setPhoneObtained,
        setRepairPercent,
        isPhoneRepaired,
        unlockPhone,
        isPhoneUnlocked,

        /* Inventory */
        addItem,
        removeItem,
        hasItem,

        /* Story */
        setCurrentStory,
        getCurrentStory,

        /* Debug */
        _debugGetState: getState,

        /* Reset */
        resetAll
    };


    /* ========================================================
       PERSISTENT UI
       ======================================================== */

    let barBuilt = false;


    function buildBar() {

        if (barBuilt) {

            return;

        }


        barBuilt = true;


        /* --------------------------------------------
           Main floating bar
           -------------------------------------------- */

        const bar =
            document.createElement("div");


        bar.id =
            "gameuiBar";


        bar.innerHTML = `

            <button
                class="gameui-btn"
                data-panel="characters">

                Characters

                <span
                    class="gameui-count"
                    id="gameuiCharCount">
                </span>

            </button>


            <button
                class="gameui-btn"
                data-panel="suspects">

                Suspects

                <span
                    class="gameui-count"
                    id="gameuiSuspectCount">
                </span>

            </button>


            <button
                class="gameui-btn"
                data-panel="victim">

                Victim

            </button>


            <button
                class="gameui-btn"
                data-panel="phone">

                Phone

            </button>


            <div
                class="gameui-clues"
                id="gameuiClueCount">

                Clues: 0/15

            </div>

        `;


        document.body.appendChild(bar);


        /* --------------------------------------------
           Modal overlay
           -------------------------------------------- */

        const overlay =
            document.createElement("div");


        overlay.id =
            "gameuiOverlay";


        overlay.className =
            "gameui-overlay hidden";


        overlay.innerHTML = `

            <div class="gameui-modal">

                <button
                    class="gameui-close"
                    id="gameuiClose">

                    ×

                </button>


                <div
                    id="gameuiModalBody">
                </div>

            </div>

        `;


        document.body.appendChild(overlay);


        /* --------------------------------------------
           Button events
           -------------------------------------------- */

        bar
            .querySelectorAll(".gameui-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        openPanel(
                            this.dataset.panel
                        );

                    }
                );

            });


        /* --------------------------------------------
           Close button
           -------------------------------------------- */

        document
            .getElementById("gameuiClose")
            .addEventListener(
                "click",
                closePanel
            );


        /* --------------------------------------------
           Click outside modal
           -------------------------------------------- */

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    closePanel();

                }

            }
        );

    }


    /* ========================================================
       CLOSE PANEL
       ======================================================== */

    function closePanel() {

        const overlay =
            document.getElementById(
                "gameuiOverlay"
            );


        if (overlay) {

            overlay.classList.add(
                "hidden"
            );

        }

    }


    /* ========================================================
       OPEN PANEL
       ======================================================== */

    function openPanel(panel) {

        const body =
            document.getElementById(
                "gameuiModalBody"
            );


        if (!body) {

            return;

        }


        /* ================================================
           CHARACTERS
           ================================================ */

        if (panel === "characters") {

            if (
                state.characters.length === 0
            ) {

                body.innerHTML = `

                    <h2>Characters</h2>

                    <p>
                        No characters have been discovered yet.
                    </p>

                `;

            }

            else {

                body.innerHTML = `

                    <h2>Characters</h2>

                    <div id="gameuiCharacters">

                        ${state.characters.map(character => {

                            const suspect =
                                state.suspects.includes(
                                    character.id
                                );


                            const isVictim =
                                character.id === "victim" ||
                                character.isVictim;


                            return `

                                <div
                                    class="gameui-card">

                                    ${
                                        character.img

                                        ?

                                        `
                                        <img
                                            src="${character.img}"
                                            alt="${character.name}">
                                        `

                                        :

                                        ""
                                    }


                                    <div
                                        class="gameui-card-name">

                                        ${character.name}

                                    </div>


                                    ${
                                        isVictim

                                        ?

                                        `
                                        <div
                                            class="gameui-tag">

                                            Victim

                                        </div>
                                        `

                                        :

                                        `
                                        <button
                                            class="gameui-small-btn"
                                            data-suspect="${character.id}">

                                            ${
                                                suspect
                                                ?
                                                "Remove from Suspects"
                                                :
                                                "Add to Suspects"
                                            }

                                        </button>
                                        `
                                    }

                                </div>

                            `;

                        }).join("")}

                    </div>

                `;


                /* ----------------------------------------
                   Suspect buttons
                   ---------------------------------------- */

                body
                    .querySelectorAll(
                        "[data-suspect]"
                    )
                    .forEach(button => {

                        button.addEventListener(
                            "click",
                            function () {

                                const id =
                                    this.dataset.suspect;


                                if (
                                    GameUI.isSuspect(id)
                                ) {

                                    GameUI.removeSuspect(id);

                                }

                                else {

                                    GameUI.markSuspect(id);

                                }


                                openPanel(
                                    "characters"
                                );

                            }
                        );

                    });

            }

        }


        /* ================================================
           SUSPECTS
           ================================================ */

        if (panel === "suspects") {

            const suspectCharacters =
                state.characters.filter(
                    character =>
                        state.suspects.includes(
                            character.id
                        )
                );


            body.innerHTML = `

                <h2>Suspects</h2>

                ${
                    suspectCharacters.length

                    ?

                    suspectCharacters.map(
                        character => `

                            <div
                                class="gameui-card">

                                ${
                                    character.img
                                    ?

                                    `
                                    <img
                                        src="${character.img}"
                                        alt="${character.name}">
                                    `

                                    :

                                    ""
                                }

                                <div
                                    class="gameui-card-name">

                                    ${character.name}

                                </div>

                            </div>

                        `
                    ).join("")

                    :

                    `
                    <p>
                        No suspects added yet.
                    </p>
                    `
                }

            `;

        }


        /* ================================================
           VICTIM
           ================================================ */

        if (panel === "victim") {

            const victim =
                state.victim;


            if (!victim) {

                body.innerHTML = `

                    <h2>Victim</h2>

                    <p>
                        Victim information has not been revealed yet.
                    </p>

                `;

            }

            else {

                body.innerHTML = `

                    <h2>Victim</h2>

                    <div
                        class="gameui-card">

                        ${
                            victim.img

                            ?

                            `
                            <img
                                src="${victim.img}"
                                alt="${victim.name}">
                            `

                            :

                            ""
                        }


                        <div
                            class="gameui-card-name">

                            ${victim.name}

                        </div>


                        ${
                            victim.cause

                            ?

                            `
                            <p>
                                <strong>
                                    Cause of Death:
                                </strong>

                                ${victim.cause}
                            </p>
                            `

                            :

                            ""
                        }


                        ${
                            victim.birthday

                            ?

                            `
                            <p>
                                <strong>
                                    Birthday:
                                </strong>

                                ${victim.birthday}
                            </p>
                            `

                            :

                            ""
                        }

                    </div>

                `;

            }

        }


        /* ================================================
           PHONE
           ================================================ */

        if (panel === "phone") {

            if (!state.phone.obtained) {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        The phone has not been obtained yet.
                    </p>

                `;

            }

            else if (
                !state.phone.repaired
            ) {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        Repair:
                        ${state.phone.repairPercent}%
                    </p>

                    <a
                        class="gameui-small-btn"
                        href="repair.html">

                        Continue Repair

                    </a>

                `;

            }

            else if (
                !state.phone.unlocked
            ) {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        The phone has been repaired.
                    </p>

                    <p>
                        It is still locked.
                    </p>

                    <a
                        class="gameui-small-btn"
                        href="victim-info.html">

                        View Victim Information

                    </a>

                `;

            }

            else {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        The phone is repaired and unlocked.
                    </p>

                    <a
                        class="gameui-small-btn"
                        href="phone.html">

                        Open Phone

                    </a>

                `;

            }

        }


        /* ================================================
           SHOW MODAL
           ================================================ */

        document
            .getElementById("gameuiOverlay")
            .classList.remove(
                "hidden"
            );

    }


    /* ========================================================
       UPDATE BAR COUNTERS
       ======================================================== */

    function renderBar() {

        if (!barBuilt) {

            return;

        }


        const characterCount =
            document.getElementById(
                "gameuiCharCount"
            );


        const suspectCount =
            document.getElementById(
                "gameuiSuspectCount"
            );


        const clueCount =
            document.getElementById(
                "gameuiClueCount"
            );


        if (characterCount) {

            characterCount.textContent =
                state.characters.length > 0
                ? ` (${state.characters.length})`
                : "";

        }


        if (suspectCount) {

            suspectCount.textContent =
                state.suspects.length > 0
                ? ` (${state.suspects.length})`
                : "";

        }


        if (clueCount) {

            clueCount.textContent =
                `Clues: ${state.clues.length}/${state.totalCluesPossible}`;

        }

    }


    /* ========================================================
       START UI AFTER PAGE LOAD
       ======================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            buildBar();

            renderBar();

        }
    );


})();
