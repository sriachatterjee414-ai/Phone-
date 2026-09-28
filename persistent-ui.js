/* ============================================================
   PERSISTENT-UI.JS
   BROKEN PHONE — SHARED GAME SYSTEM

   Handles:
   - Characters
   - Suspects
   - Victim
   - Victim File
   - Phone
   - Clues
   - Phone repair
   - Phone unlock

   State persists through localStorage.
============================================================ */


(function () {


    /* ============================================================
       STORAGE
    ============================================================ */

    const STORAGE_KEY =
        "brokenPhoneGameState";


    /* ============================================================
       DEFAULT STATE
    ============================================================ */

    const defaultState = {

        characters: [],

        suspects: [],

        victim: null,

        clues: [],

        totalCluesPossible: 15,

        phone: {

            repairPercent: 0,

            unlocked: false

        }

    };


    /* ============================================================
       CLONE DEFAULT
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


    let state =
        loadState();


    /* ============================================================
       SAVE
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
           ADD CHARACTER
        ======================================================== */

        addCharacter(
            id,
            name,
            img
        ) {

            if (
                state.characters.some(
                    character =>
                        character.id === id
                )
            ) {

                return;

            }


            state.characters.push({

                id:id,

                name:name,

                img:img || "",

                isVictim:false

            });


            saveState();

        },


        updateCharacter(
            id,
            name,
            img
        ) {

            const character =
                state.characters.find(
                    entry => entry.id === id
                );


            if (!character) {

                this.addCharacter(id, name, img);

                return;

            }


            character.name = name;
            character.img = img || character.img;

            saveState();

        },


        /* ========================================================
           SET VICTIM

           The old five arguments still work.

           Optional sixth argument can contain
           additional victim information.
        ======================================================== */

        setVictim(
            id,
            name,
            img,
            cause,
            birthday,
            extra
        ) {

            extra =
                extra || {};


            state.victim = {

                id:id,

                name:name,

                img:img || "",

                cause:cause || "",

                birthday:birthday || "",

                age:extra.age || "",

                sex:extra.sex || "",

                occupation:
                    extra.occupation || "",

                address:
                    extra.address || "",

                emergencyContact:
                    extra.emergencyContact || "",

                caseNumber:
                    extra.caseNumber ||
                    "1996-549764",

                caseType:
                    extra.caseType ||
                    "HOMICIDE",

                caseStatus:
                    extra.caseStatus ||
                    "ACTIVE INVESTIGATION",

                location:
                    extra.location ||
                    "UNKNOWN",

                date:
                    extra.date ||
                    "",

                dateDiscovered:
                    extra.dateDiscovered ||
                    "",

                phoneStatus:
                    extra.phoneStatus ||
                    "",

                timeOfDeath:
                    extra.timeOfDeath ||
                    "",

                deathImage:
                    extra.deathImage ||
                    "",

                crimeSceneImage:
                    extra.crimeSceneImage ||
                    "",

                notes:
                    extra.notes ||
                    ""

            };


            const existingCharacter =
                state.characters.find(
                    character =>
                        character.id === id
                );


            if (!existingCharacter) {

                state.characters.push({

                    id:id,

                    name:name,

                    img:img || "",

                    isVictim:true

                });

            }

            else {

                existingCharacter.name =
                    name;

                existingCharacter.img =
                    img || "";

                existingCharacter.isVictim =
                    true;

            }


            state.suspects =
                state.suspects.filter(
                    suspectId =>
                        suspectId !== id
                );


            saveState();

        },


        /* ========================================================
           SUSPECT
        ======================================================== */

        markSuspect(id) {

            if (
                state.victim &&
                state.victim.id === id
            ) {

                return;

            }


            const character =
                state.characters.find(
                    c =>
                        c.id === id
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
                state.clues.length /
                total;


            if (ratio >= .80) {

                return "good";

            }


            if (ratio >= .40) {

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


            if (
                !Number.isFinite(value)
            ) {

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
           RESET
        ======================================================== */

        resetAll() {

            state =
                cloneDefaultState();


            saveState();

        }

    };


    window.GameUI =
        GameUI;


    /* ============================================================
       BAR
    ============================================================ */

    let barBuilt =
        false;


    function buildBarOnce() {

        if (barBuilt) {

            return;

        }


        barBuilt = true;


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
            ></div>

        `;


        document.body.appendChild(
            bar
        );


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
           BUTTONS
        ======================================================== */

        bar
            .querySelectorAll(".gameui-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        openPanel(
                            button.dataset.panel
                        );

                    }
                );

            });


        document
            .getElementById(
                "gameuiClose"
            )
            .addEventListener(
                "click",
                closePanel
            );


        overlay.addEventListener(
            "click",
            function(event){

                if(
                    event.target === overlay
                ){

                    closePanel();

                }

            }
        );

    }


    /* ============================================================
       CLOSE
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

        if (
            panel === "characters"
        ) {

            renderCharacters();

        }


        /* ========================================================
           SUSPECTS
        ======================================================== */

        if (
            panel === "suspects"
        ) {

            renderSuspects();

        }


        /* ========================================================
           VICTIM
        ======================================================== */

        if (
            panel === "victim"
        ) {

            renderVictimFile();

        }


        /* ========================================================
           PHONE
        ======================================================== */

        if (
            panel === "phone"
        ) {

            renderPhone();

        }


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
       CHARACTERS
    ============================================================ */

    let selectedCharacterId =
        null;


    function renderCharacters() {

        const body =
            document.getElementById(
                "gameuiModalBody"
            );


        if (
            !state.characters.length
        ) {

            body.innerHTML = `

                <h2>Characters</h2>

                <div class="gameui-empty">
                    No characters have appeared yet.
                </div>

            `;

            return;

        }


        if (
            !selectedCharacterId ||
            !state.characters.some(
                character =>
                    character.id ===
                    selectedCharacterId
            )
        ) {

            selectedCharacterId =
                state.characters[0].id;

        }


        const selected =
            state.characters.find(
                character =>
                    character.id ===
                    selectedCharacterId
            );


        body.innerHTML = `

            <div
                class="gameui-character-viewer"
            >

                <h2>
                    Characters
                </h2>


                <div
                    class="gameui-character-main"
                >

                    ${
                        selected.img

                        ?

                        `
                        <img
                            src="${selected.img}"
                            alt="${selected.name}"
                                onerror="this.remove()"
                        >
                        `

                        :

                        ""
                    }


                    <div
                        class="gameui-character-main-info"
                    >

                        <div
                            class="gameui-character-main-name"
                        >
                            ${selected.name}
                        </div>


                        <div
                            class="gameui-character-main-role"
                        >

                            ${
                                selected.isVictim
                                    ? "VICTIM"
                                    : state.suspects.includes(
                                        selected.id
                                    )
                                    ? "SUSPECT"
                                    : "CHARACTER"
                            }

                        </div>


                        ${
                            !selected.isVictim

                            ?

                            `
                            <br>

                            <button
                                class="gameui-character-action"
                                id="mainSuspectButton"
                            >
                                ${
                                    state.suspects.includes(
                                        selected.id
                                    )
                                    ?
                                    "REMOVE FROM SUSPECTS"
                                    :
                                    "ADD TO SUSPECTS"
                                }
                            </button>
                            `

                            :

                            ""
                        }

                    </div>

                </div>


                <div
                    class="gameui-character-list"
                >

                    ${
                        state.characters
                            .map(
                                character => `

                                <div
                                    class="
                                        gameui-character-card
                                        ${
                                            character.id ===
                                            selected.id
                                            ? "active"
                                            : ""
                                        }
                                    "
                                    data-character-id="${character.id}"
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
                                        class="gameui-character-card-info"
                                    >
                                        ${character.name}
                                    </div>

                                </div>

                            `
                            )
                            .join("")
                    }

                </div>

            </div>

        `;


        /* ========================================================
           CHARACTER SELECTION
        ======================================================== */

        body
            .querySelectorAll(
                "[data-character-id]"
            )
            .forEach(card => {

                card.addEventListener(
                    "click",
                    function(){

                        selectedCharacterId =
                            card.dataset.characterId;

                        renderCharacters();

                    }
                );

            });


        /* ========================================================
           SUSPECT BUTTON
        ======================================================== */

        const mainSuspectButton =
            document.getElementById(
                "mainSuspectButton"
            );


        if (mainSuspectButton) {

            mainSuspectButton.addEventListener(
                "click",
                function(){

                    if (
                        state.suspects.includes(
                            selected.id
                        )
                    ) {

                        GameUI.removeSuspect(
                            selected.id
                        );

                    }

                    else {

                        GameUI.markSuspect(
                            selected.id
                        );

                    }


                    renderCharacters();

                }
            );

        }

    }


    /* ============================================================
       SUSPECTS
    ============================================================ */

    function renderSuspects() {

        const body =
            document.getElementById(
                "gameuiModalBody"
            );


        const suspects =
            state.characters.filter(
                character =>
                    state.suspects.includes(
                        character.id
                    )
            );


        body.innerHTML = `

            <h2>
                Suspects
            </h2>


            ${
                suspects.length

                ?

                `
                <div
                    class="gameui-file-suspects"
                >

                    ${
                        suspects
                            .map(
                                character => `

                                <div
                                    class="gameui-file-suspect"
                                >

                                    <div
                                        class="gameui-file-suspect-photo"
                                    >

                                        ${
                                            character.img

                                            ?

                                            `
                                            <img
                                                src="${character.img}"
                                                alt="${character.name}"
                                                onerror="this.remove()"
                                            >
                                            `

                                            :

                                            `?`
                                        }

                                    </div>


                                    <div
                                        class="gameui-file-suspect-info"
                                    >

                                        <div
                                            class="gameui-file-suspect-name"
                                        >
                                            ${character.name}
                                        </div>


                                        <span
                                            class="gameui-file-suspect-status"
                                        >
                                            SUSPECT
                                        </span>

                                    </div>

                                </div>

                            `
                            )
                            .join("")
                    }

                </div>
                `

                :

                `
                <div class="gameui-empty">

                    No suspects have been identified.

                </div>
                `
            }

        `;

    }


    /* ============================================================
       VICTIM FILE
    ============================================================ */

    function renderVictimFile() {

        const body =
            document.getElementById(
                "gameuiModalBody"
            );


        const victim =
            state.victim;


        if (!victim) {

            body.innerHTML = `

                <h2>
                    Victim File
                </h2>


                <div class="gameui-empty">

                    Victim information has not
                    been revealed yet.

                </div>

            `;

            return;

        }


        const suspects =
            state.characters.filter(
                character =>
                    state.suspects.includes(
                        character.id
                    )
            );


        body.innerHTML = `

            <div
                class="gameui-victim-file"
            >


                <!-- ====================================
                     HEADER
                ===================================== -->

                <div
                    class="gameui-victim-header"
                >

                    <div>

                        <div
                            class="gameui-victim-label"
                        >
                            POLICE DEPARTMENT
                        </div>


                        <div
                            class="gameui-victim-title"
                        >
                            VICTIM INFORMATION
                        </div>


                        <div
                            class="gameui-victim-case"
                        >
                            CASE #${victim.caseNumber}
                        </div>

                    </div>


                    <div
                        class="gameui-victim-status"
                    >
                        ${victim.caseStatus}
                    </div>

                </div>



                <!-- ====================================
                     VICTIM MAIN
                ===================================== -->

                <div
                    class="gameui-victim-main"
                >


                    <!-- PORTRAIT -->

                    <div
                        class="gameui-victim-portrait"
                    >

                        ${
                            victim.img

                            ?

                            `
                            <img
                                src="${victim.img}"
                                alt="${victim.name}"
                                onerror="this.remove()"
                            >
                            `

                            :

                            `
                            <div
                                class="gameui-empty"
                            >
                                NO PHOTOGRAPH
                            </div>
                            `
                        }


                        <div
                            class="gameui-victim-portrait-label"
                        >
                            VICTIM PHOTOGRAPH
                        </div>

                    </div>



                    <!-- DETAILS -->

                    <div
                        class="gameui-victim-details"
                    >

                        ${victimInfoRow(
                            "NAME",
                            victim.name
                        )}

                        ${victimInfoRow(
                            "DATE OF BIRTH",
                            victim.birthday
                        )}

                        ${victimInfoRow(
                            "AGE",
                            victim.age
                        )}

                        ${victimInfoRow(
                            "SEX",
                            victim.sex
                        )}

                        ${victimInfoRow(
                            "OCCUPATION",
                            victim.occupation
                        )}

                        ${victimInfoRow(
                            "ADDRESS",
                            victim.address
                        )}

                        ${victimInfoRow(
                            "EMERGENCY CONTACT",
                            victim.emergencyContact
                        )}

                        ${victimInfoRow(
                            "CAUSE OF DEATH",
                            victim.cause
                        )}

                    </div>

                </div>



                <!-- ====================================
                     CASE INFORMATION
                ===================================== -->

                <section
                    class="gameui-dossier-section"
                >

                    <div
                        class="gameui-dossier-title"
                    >
                        CASE INFORMATION
                    </div>


                    <div
                        class="gameui-case-grid"
                    >

                        ${caseGridItem(
                            "CASE TYPE",
                            victim.caseType
                        )}

                        ${caseGridItem(
                            "STATUS",
                            victim.caseStatus
                        )}

                        ${caseGridItem(
                            "LOCATION",
                            victim.location
                        )}

                        ${caseGridItem(
                            "DATE",
                            victim.date
                        )}

                        ${caseGridItem(
                            "DISCOVERED",
                            victim.dateDiscovered
                        )}

                        ${caseGridItem(
                            "PHONE STATUS",
                            victim.phoneStatus
                        )}

                    </div>

                </section>



                <!-- ====================================
                     DEATH / CRIME EVIDENCE
                ===================================== -->

                ${
                    victim.deathImage ||
                    victim.crimeSceneImage

                    ?

                    `
                    <section
                        class="gameui-dossier-section"
                    >

                        <div
                            class="gameui-dossier-title"
                        >
                            DEATH / CRIME SCENE
                        </div>


                        <div
                            class="gameui-evidence-grid"
                        >

                            ${
                                victim.deathImage

                                ?

                                `
                                <div
                                    class="gameui-evidence-card"
                                >

                                    <img
                                        src="${victim.deathImage}"
                                        alt="Death evidence"
                                        onerror="this.onerror=null;this.src='death_scene.png'"
                                    >

                                    <div
                                        class="gameui-evidence-label"
                                    >
                                        DEATH RECORD
                                    </div>

                                </div>
                                `

                                :

                                ""
                            }


                            ${
                                victim.crimeSceneImage

                                ?

                                `
                                <div
                                    class="gameui-evidence-card"
                                >

                                    <img
                                        src="${victim.crimeSceneImage}"
                                        alt="Crime scene"
                                        onerror="this.onerror=null;this.src='crime_scene.png'"
                                    >

                                    <div
                                        class="gameui-evidence-label"
                                    >
                                        CRIME SCENE
                                    </div>

                                </div>
                                `

                                :

                                ""
                            }

                        </div>

                    </section>
                    `

                    :

                    ""
                }



                <!-- ====================================
                     CASE NOTES
                ===================================== -->

                ${
                    victim.notes

                    ?

                    `
                    <section
                        class="gameui-dossier-section"
                    >

                        <div
                            class="gameui-dossier-title"
                        >
                            INVESTIGATION NOTES
                        </div>


                        <p
                            style="
                                margin:0;
                                color:#c9c2b2;
                                line-height:1.8;
                                font-size:13px;
                            "
                        >
                            ${victim.notes}
                        </p>

                    </section>
                    `

                    :

                    ""
                }



                <!-- ====================================
                     SUSPECTS
                ===================================== -->

                <section
                    class="gameui-dossier-section"
                >

                    <div
                        class="gameui-dossier-title"
                    >
                        IDENTIFIED SUSPECTS
                    </div>


                    ${
                        suspects.length

                        ?

                        `
                        <div
                            class="gameui-file-suspects"
                        >

                            ${
                                suspects
                                    .map(
                                        character => `

                                        <div
                                            class="gameui-file-suspect"
                                        >

                                            <div
                                                class="gameui-file-suspect-photo"
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

                                                    "?"
                                                }

                                            </div>


                                            <div
                                                class="gameui-file-suspect-info"
                                            >

                                                <div
                                                    class="gameui-file-suspect-name"
                                                >
                                                    ${character.name}
                                                </div>


                                                <span
                                                    class="gameui-file-suspect-status"
                                                >
                                                    SUSPECT
                                                </span>

                                            </div>

                                        </div>

                                    `
                                    )
                                    .join("")
                            }

                        </div>
                        `

                        :

                        `
                        <div
                            class="gameui-empty"
                        >
                            No suspects have been identified.
                        </div>
                        `
                    }

                </section>


            </div>

        `;

    }


    /* ============================================================
       VICTIM INFO ROW HELPER
    ============================================================ */

    function victimInfoRow(
        label,
        value
    ) {

        return `

            <div
                class="gameui-victim-info-row"
            >

                <span
                    class="gameui-victim-info-label"
                >
                    ${label}
                </span>


                <span
                    class="gameui-victim-info-value"
                >
                    ${value || "—"}
                </span>

            </div>

        `;

    }


    /* ============================================================
       CASE GRID HELPER
    ============================================================ */

    function caseGridItem(
        label,
        value
    ) {

        return `

            <div
                class="gameui-case-grid-item"
            >

                <span>
                    ${label}
                </span>


                <strong>
                    ${value || "UNKNOWN"}
                </strong>

            </div>

        `;

    }


    /* ============================================================
       PHONE
    ============================================================ */

    function renderPhone() {

        const body =
            document.getElementById(
                "gameuiModalBody"
            );


        const repair =
            state.phone.repairPercent;


        if (
            state.phone.unlocked
        ) {

            body.innerHTML = `

                <div
                    class="gameui-phone-panel"
                >

                    <h2>
                        Phone
                    </h2>


                    <p>
                        Phone repaired and unlocked.
                    </p>


                    <a
                        class="gameui-small-btn"
                        href="phone.html"
                    >
                        OPEN PHONE
                    </a>

                </div>

            `;

        }

        else if (
            repair >= 100
        ) {

            body.innerHTML = `

                <div
                    class="gameui-phone-panel"
                >

                    <h2>
                        Phone
                    </h2>


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

                </div>

            `;

        }

        else {

            body.innerHTML = `

                <div
                    class="gameui-phone-panel"
                >

                    <h2>
                        Phone
                    </h2>


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

                </div>

            `;

        }

    }


    /* ============================================================
       RENDER BAR
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
        function(){

            buildBarOnce();

            renderBar();

        }
    );


})();
