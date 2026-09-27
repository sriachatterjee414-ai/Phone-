/* ============================================================
   PERSISTENT-UI.JS
   BROKEN PHONE — SHARED GAME SYSTEM

   Add this to every page that should have the permanent UI:

       <script src="persistent-ui.js"></script>

   This file handles:
   - Characters
   - Suspects
   - Victim
   - Phone
   - Clues
   - Phone repair progress
   - Phone unlock state

   Everything is stored in localStorage.
   ============================================================ */

(function () {

    const STORAGE_KEY = "brokenPhoneGameState";


    /* ============================================================
       DEFAULT GAME STATE
    ============================================================ */

    const defaultState = {

        characters: [],
        // {
        //   id,
        //   name,
        //   img,
        //   isVictim
        // }

        suspects: [],

        victim: null,
        // {
        //   id,
        //   name,
        //   img,
        //   cause,
        //   birthday
        // }

        clues: [],

        totalCluesPossible: 15,

        phone: {

            repairPercent: 0,

            unlocked: false

        }

    };


    /* ============================================================
       CLONE DEFAULT STATE
    ============================================================ */

    function cloneDefaultState() {

        return JSON.parse(
            JSON.stringify(defaultState)
        );

    }


    /* ============================================================
       LOAD STATE
    ============================================================ */

    function loadState() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!raw) {

                return cloneDefaultState();

            }


            const parsed =
                JSON.parse(raw);


            const fresh =
                cloneDefaultState();


            /*
                Merge safely.
            */

            return {

                ...fresh,

                ...parsed,

                characters:
                    Array.isArray(parsed.characters)
                        ? parsed.characters
                        : [],

                suspects:
                    Array.isArray(parsed.suspects)
                        ? parsed.suspects
                        : [],

                clues:
                    Array.isArray(parsed.clues)
                        ? parsed.clues
                        : [],

                phone: {

                    ...fresh.phone,

                    ...(parsed.phone || {})

                }

            };

        }

        catch (error) {

            console.error(
                "GameUI: Could not load game state.",
                error
            );

            return cloneDefaultState();

        }

    }


    let state = loadState();


    /* ============================================================
       SAVE STATE
    ============================================================ */

    function saveState() {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(state)

        );


        renderBar();

    }


    /* ============================================================
       PUBLIC GAME UI
    ============================================================ */

    const GameUI = {


        /* ========================================================
           CHARACTERS
        ======================================================== */

        addCharacter(
            id,
            name,
            img
        ) {

            /*
                Prevent duplicates.
            */

            if (
                state.characters.some(
                    character =>
                        character.id === id
                )
            ) {

                return;

            }


            state.characters.push({

                id: id,

                name: name,

                img: img || "",

                isVictim: false

            });


            saveState();

        },


        /* ========================================================
           VICTIM
        ======================================================== */

        setVictim(
            id,
            name,
            img,
            cause,
            birthday
        ) {

            /*
                Save victim information.
            */

            state.victim = {

                id: id,

                name: name,

                img: img || "",

                cause: cause || "",

                birthday: birthday || ""

            };


            /*
                Make sure victim appears
                in Characters too.
            */

            const existingCharacter =
                state.characters.find(
                    character =>
                        character.id === id
                );


            if (!existingCharacter) {

                state.characters.push({

                    id: id,

                    name: name,

                    img: img || "",

                    isVictim: true

                });

            }

            else {

                existingCharacter.isVictim =
                    true;

            }


            /*
                Safety:
                remove victim from suspects
                if somehow added before.
            */

            state.suspects =
                state.suspects.filter(
                    suspectId =>
                        suspectId !== id
                );


            saveState();

        },


        /* ========================================================
           ADD SUSPECT
        ======================================================== */

        markSuspect(id) {

            /*
                Victim can NEVER be a suspect.
            */

            if (
                state.victim &&
                state.victim.id === id
            ) {

                return;

            }


            /*
                Only characters can become suspects.
            */

            const character =
                state.characters.find(
                    c => c.id === id
                );


            if (!character) {

                return;

            }


            if (
                !state.suspects.includes(id)
            ) {

                state.suspects.push(id);

                saveState();

            }

        },


        /* ========================================================
           REMOVE SUSPECT
        ======================================================== */

        removeSuspect(id) {

            state.suspects =
                state.suspects.filter(
                    suspectId =>
                        suspectId !== id
                );


            saveState();

        },


        /* ========================================================
           CHECK SUSPECT
        ======================================================== */

        isSuspect(id) {

            return state.suspects.includes(id);

        },


        /* ========================================================
           CLUES
        ======================================================== */

        addClue(id) {

            if (
                !state.clues.includes(id)
            ) {

                state.clues.push(id);

                saveState();

            }

        },


        getClueCount() {

            return state.clues.length;

        },


        setTotalCluesPossible(number) {

            const value =
                Number(number);


            if (
                Number.isFinite(value) &&
                value > 0
            ) {

                state.totalCluesPossible =
                    value;

                saveState();

            }

        },


        /* ========================================================
           ENDING
        ======================================================== */

        getEndingTier() {

            const total =
                state.totalCluesPossible;


            if (!total) {

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

        },


        /* ========================================================
           PHONE REPAIR
        ======================================================== */

        setRepairPercent(percent) {

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


            saveState();

        },


        getRepairPercent() {

            return state.phone.repairPercent;

        },


        /* ========================================================
           PHONE UNLOCK
        ======================================================== */

        unlockPhone() {

            state.phone.unlocked =
                true;


            saveState();

        },


        isPhoneUnlocked() {

            return state.phone.unlocked;

        },


        /* ========================================================
           DEBUG
        ======================================================== */

        _debugGetState() {

            return JSON.parse(
                JSON.stringify(state)
            );

        },


        /* ========================================================
           RESET GAME
        ======================================================== */

        resetAll() {

            state =
                cloneDefaultState();


            saveState();

        }

    };


    window.GameUI = GameUI;


    /* ============================================================
       BUILD PERMANENT BAR
    ============================================================ */

    let barBuilt = false;


    function buildBarOnce() {

        if (barBuilt) {

            return;

        }


        barBuilt = true;


        /* ========================================================
           BAR
        ======================================================== */

        const bar =
            document.createElement("div");


        bar.id =
            "gameuiBar";


        bar.innerHTML = `

            <button
                class="gameui-btn"
                data-panel="characters"
            >
                Characters
                <span
                    class="gameui-count"
                    id="gameuiCharCount"
                ></span>
            </button>


            <button
                class="gameui-btn"
                data-panel="suspects"
            >
                Suspects
                <span
                    class="gameui-count"
                    id="gameuiSuspectCount"
                ></span>
            </button>


            <button
                class="gameui-btn"
                data-panel="victim"
            >
                Victim
            </button>


            <button
                class="gameui-btn"
                data-panel="phone"
            >
                Phone
            </button>


            <div
                class="gameui-clues"
                id="gameuiClueCount"
            >
            </div>

        `;


        document.body.appendChild(bar);


        /* ========================================================
           OVERLAY
        ======================================================== */

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
                    id="gameuiClose"
                >
                    ×
                </button>

                <div
                    id="gameuiModalBody"
                ></div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        /* ========================================================
           BUTTON EVENTS
        ======================================================== */

        bar
            .querySelectorAll(".gameui-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        openPanel(
                            button.dataset.panel
                        );

                    }
                );

            });


        document
            .getElementById("gameuiClose")
            .addEventListener(
                "click",
                closePanel
            );


        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    closePanel();

                }

            }
        );

    }


    /* ============================================================
       CLOSE PANEL
    ============================================================ */

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


    /* ============================================================
       OPEN PANEL
    ============================================================ */

    function openPanel(panel) {

        const body =
            document.getElementById(
                "gameuiModalBody"
            );


        if (!body) {

            return;

        }


        /* ========================================================
           CHARACTERS
        ======================================================== */

        if (panel === "characters") {

            body.innerHTML = `

                <h2>Characters</h2>

                ${
                    state.characters.length

                    ?

                    state.characters
                        .map(character => `

                            <div
                                class="gameui-character-card"
                            >

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
                                    ""
                                }


                                <div
                                    class="gameui-card-name"
                                >
                                    ${character.name}
                                </div>


                                ${
                                    character.isVictim

                                    ?

                                    `
                                    <span
                                        class="gameui-tag"
                                    >
                                        VICTIM
                                    </span>
                                    `

                                    :

                                    `
                                    <button
                                        class="gameui-small-btn"
                                        data-suspect="${character.id}"
                                    >
                                        ${
                                            state.suspects.includes(
                                                character.id
                                            )
                                            ?
                                            "Remove from Suspects"
                                            :
                                            "Add to Suspects"
                                        }
                                    </button>
                                    `
                                }

                            </div>

                        `)
                        .join("")

                    :

                    `
                    <p>
                        No characters have appeared yet.
                    </p>
                    `
                }

            `;


            body
                .querySelectorAll(
                    "[data-suspect]"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.dataset.suspect;


                            if (
                                state.suspects.includes(
                                    id
                                )
                            ) {

                                GameUI.removeSuspect(
                                    id
                                );

                            }

                            else {

                                GameUI.markSuspect(
                                    id
                                );

                            }


                            openPanel(
                                "characters"
                            );

                        }
                    );

                });

        }


        /* ========================================================
           SUSPECTS
        ======================================================== */

        if (panel === "suspects") {

            const suspects =
                state.characters.filter(
                    character =>
                        state.suspects.includes(
                            character.id
                        )
                );


            body.innerHTML = `

                <h2>Suspects</h2>

                ${
                    suspects.length

                    ?

                    suspects
                        .map(character => `

                            <div
                                class="gameui-character-card"
                            >

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
                                    ""
                                }

                                <div
                                    class="gameui-card-name"
                                >
                                    ${character.name}
                                </div>

                            </div>

                        `)
                        .join("")

                    :

                    `
                    <p>
                        No suspects added yet.
                    </p>
                    `
                }

            `;

        }


        /* ========================================================
           VICTIM
        ======================================================== */

        if (panel === "victim") {

            const victim =
                state.victim;


            body.innerHTML = `

                <h2>Victim</h2>

                ${
                    victim

                    ?

                    `

                    <div
                        class="gameui-character-card"
                    >

                        ${
                            victim.img

                            ?

                            `
                            <img
                                src="${victim.img}"
                                alt="${victim.name}"
                            >
                            `

                            :

                            ""
                        }


                        <div
                            class="gameui-card-name"
                        >
                            ${victim.name}
                        </div>


                        ${
                            victim.cause

                            ?

                            `<p>
                                ${victim.cause}
                            </p>`

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


                        <span
                            class="gameui-tag"
                        >
                            VICTIM — NOT A SUSPECT
                        </span>

                    </div>

                    `

                    :

                    `
                    <p>
                        Victim information has not
                        been revealed yet.
                    </p>
                    `
                }

            `;

        }


        /* ========================================================
           PHONE
        ======================================================== */

        if (panel === "phone") {

            const repair =
                state.phone.repairPercent;


            if (
                state.phone.unlocked
            ) {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        Phone repaired and unlocked.
                    </p>

                    <a
                        class="gameui-small-btn"
                        href="phone.html"
                    >
                        OPEN PHONE
                    </a>

                `;

            }

            else if (
                repair >= 100
            ) {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        Repair complete.
                    </p>

                    <p>
                        You still need the
                        victim's birthday.
                    </p>

                    <a
                        class="gameui-small-btn"
                        href="victim-info.html"
                    >
                        VIEW VICTIM INFO
                    </a>

                `;

            }

            else {

                body.innerHTML = `

                    <h2>Phone</h2>

                    <p>
                        Repair:
                        ${repair}%
                    </p>

                    <a
                        class="gameui-small-btn"
                        href="repair.html"
                    >
                        CONTINUE REPAIR
                    </a>

                `;

            }

        }


        /* ========================================================
           SHOW OVERLAY
        ======================================================== */

        const overlay =
            document.getElementById(
                "gameuiOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "hidden"
            );

        }

    }


    /* ============================================================
       RENDER COUNTS
    ============================================================ */

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
                state.characters.length
                    ? ` (${state.characters.length})`
                    : "";

        }


        if (suspectCount) {

            suspectCount.textContent =
                state.suspects.length
                    ? ` (${state.suspects.length})`
                    : "";

        }


        if (clueCount) {

            clueCount.textContent =
                `Clues: ${state.clues.length}/${state.totalCluesPossible}`;

        }

    }


    /* ============================================================
       START
    ============================================================ */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            buildBarOnce();

            renderBar();

        }
    );

})();
