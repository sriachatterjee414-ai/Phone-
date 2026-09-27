/* ============================================================
   PERSISTENT-UI.JS
   BROKEN PHONE — SHARED GAME SYSTEM

   Persistent systems:
   - Characters
   - Suspects
   - Victim
   - Victim File
   - Phone
   - Clues
   - Repair progress
   - Phone unlock state

   Everything is stored in localStorage.
   ============================================================ */

(function () {

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
                    Array.isArray(
                        parsed.characters
                    )
                        ? parsed.characters
                        : [],

                suspects:
                    Array.isArray(
                        parsed.suspects
                    )
                        ? parsed.suspects
                        : [],

                clues:
                    Array.isArray(
                        parsed.clues
                    )
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
                "GameUI: Could not load state.",
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
       GAME UI API
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


        /* ========================================================
           SET VICTIM
        ======================================================== */

        setVictim(
            id,
            name,
            img,
            cause,
            birthday,
            location
        ) {

            state.victim = {

                id:id,

                name:name,

                img:img || "",

                cause:cause || "",

                birthday:birthday || "",

                location:location || ""

            };


            const existing =
                state.characters.find(
                    character =>
                        character.id === id
                );


            if (!existing) {

                state.characters.push({

                    id:id,

                    name:name,

                    img:img || "",

                    isVictim:true

                });

            }

            else {

                existing.isVictim =
                    true;

                existing.name =
                    name;

                existing.img =
                    img || existing.img;

            }


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

            if (
                state.victim &&
                state.victim.id === id
            ) {

                return;

            }


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
           SUSPECT CHECK
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


            state.phone.repairPercent =
                100;


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


        barBuilt =
            true;


        /* ========================================================
           TOP BAR
        ======================================================== */

        const bar =
            document.createElement(
                "div"
            );


        bar.id =
            "gameuiBar";


        bar.innerHTML = `

            <button
                class="gameui-btn"
                data-panel="characters"
            >
                CHARACTERS
                <span
                    class="gameui-count"
                    id="gameuiCharCount"
                ></span>
            </button>


            <button
                class="gameui-btn"
                data-panel="suspects"
            >
                SUSPECTS
                <span
                    class="gameui-count"
                    id="gameuiSuspectCount"
                ></span>
            </button>


            <button
                class="gameui-btn"
                data-panel="victim"
            >
                VICTIM
            </button>


            <button
                class="gameui-btn"
                data-panel="phone"
            >
                PHONE
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
            document.createElement(
                "div"
            );


        overlay.id =
            "gameuiOverlay";


        overlay.className =
            "gameui-overlay hidden";


        overlay.innerHTML = `

            <div class="gameui-modal">

                <button
                    class="gameui-close"
                    id="gameuiClose"
                    aria-label="Close"
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
           BAR BUTTONS
        ======================================================== */

        bar
            .querySelectorAll(
                ".gameui-btn"
            )
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


        /* ========================================================
           CLOSE
        ======================================================== */

        document
            .getElementById(
                "gameuiClose"
            )
            .addEventListener(
                "click",
                closePanel
            );


        /* ========================================================
           CLICK OUTSIDE
        ======================================================== */

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


        /* ========================================================
           ESC
        ======================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
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

        if (
            panel === "characters"
        ) {

            renderCharacters(
                body
            );

        }


        /* ========================================================
           SUSPECTS
        ======================================================== */

        if (
            panel === "suspects"
        ) {

            renderSuspects(
                body
            );

        }


        /* ========================================================
           VICTIM
        ======================================================== */

        if (
            panel === "victim"
        ) {

            renderVictim(
                body
            );

        }


        /* ========================================================
           VICTIM FILE
        ======================================================== */

        if (
            panel === "victim-file"
        ) {

            renderVictimFile(
                body
            );

        }


        /* ========================================================
           PHONE
        ======================================================== */

        if (
            panel === "phone"
        ) {

            renderPhone(
                body
            );

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
       CHARACTER GALLERY
    ============================================================ */

    let selectedCharacterId =
        null;


    function renderCharacters(body) {

        const characters =
            state.characters;


        if (!characters.length) {

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
            !characters.some(
                character =>
                    character.id ===
                    selectedCharacterId
            )
        ) {

            selectedCharacterId =
                characters[0].id;

        }


        const selected =
            characters.find(
                character =>
                    character.id ===
                    selectedCharacterId
            );


        body.innerHTML = `

            <h2>Characters</h2>

            <div
                class="gameui-character-gallery"
            >

                <!-- MAIN CHARACTER -->

                <div
                    class="gameui-main-character"
                >

                    ${
                        selected.img

                        ?

                        `
                        <img
                            src="${selected.img}"
                            alt="${selected.name}"
                        >
                        `

                        :

                        ""
                    }


                    <div
                        class="gameui-card-name"
                    >
                        ${selected.name}
                    </div>


                    ${
                        selected.isVictim

                        ?

                        `
                        <div
                            class="gameui-character-status"
                        >
                            VICTIM
                        </div>
                        `

                        :

                        `
                        <div
                            class="gameui-character-status"
                        >
                            ${
                                state.suspects.includes(
                                    selected.id
                                )
                                ?
                                "CURRENTLY MARKED AS SUSPECT"
                                :
                                "PERSON OF INTEREST"
                            }
                        </div>
                        `
                    }


                    ${
                        selected.isVictim

                        ?

                        ""

                        :

                        `
                        <button
                            class="gameui-small-btn"
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
                    }

                </div>


                <!-- SMALL CHARACTER BOXES -->

                <div
                    class="gameui-character-strip"
                >

                    ${
                        characters
                            .map(
                                character => `

                                <div
                                    class="
                                        gameui-character-small
                                        ${
                                            character.id ===
                                            selected.id
                                            ?
                                            "selected"
                                            :
                                            ""
                                        }
                                    "
                                    data-character-id="
                                        ${character.id}
                                    "
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
                                        class="
                                            gameui-character-small-name
                                        "
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
           SMALL CHARACTER CLICK
        ======================================================== */

        body
            .querySelectorAll(
                "[data-character-id]"
            )
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        selectedCharacterId =
                            card.dataset.characterId;


                        renderCharacters(
                            body
                        );

                    }
                );

            });


        /* ========================================================
           SUSPECT BUTTON
        ======================================================== */

        const suspectButton =
            document.getElementById(
                "mainSuspectButton"
            );


        if (suspectButton) {

            suspectButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


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


                    renderCharacters(
                        body
                    );

                }
            );

        }

    }


    /* ============================================================
       SUSPECTS
    ============================================================ */

    function renderSuspects(body) {

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

                `
                <div
                    class="gameui-suspect-grid"
                >

                    ${
                        suspects
                            .map(
                                character => `

                                <div
                                    class="
                                        gameui-suspect-card
                                    "
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
                                        class="
                                            gameui-card-name
                                        "
                                    >
                                        ${character.name}
                                    </div>


                                    <button
                                        class="gameui-small-btn"
                                        data-remove-suspect="
                                            ${character.id}
                                        "
                                    >
                                        REMOVE FROM SUSPECTS
                                    </button>

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

                    No suspects have been added yet.

                </div>
                `
            }

        `;


        body
            .querySelectorAll(
                "[data-remove-suspect]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        GameUI.removeSuspect(
                            button.dataset.removeSuspect
                        );


                        renderSuspects(
                            body
                        );

                    }
                );

            });

    }


    /* ============================================================
       VICTIM SUMMARY
    ============================================================ */

    function renderVictim(body) {

        const victim =
            state.victim;


        if (!victim) {

            body.innerHTML = `

                <h2>Victim</h2>

                <div class="gameui-empty">

                    Victim information has not
                    been revealed yet.

                </div>

            `;

            return;

        }


        body.innerHTML = `

            <h2>Victim</h2>


            <div
                class="gameui-victim-summary"
            >

                <div
                    class="gameui-victim-photo"
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

                        `
                        <div
                            class="gameui-empty"
                        >
                            No photograph available.
                        </div>
                        `
                    }

                </div>


                <div
                    class="gameui-victim-details"
                >

                    <div
                        class="gameui-victim-label"
                    >
                        VICTIM
                    </div>


                    <div
                        class="gameui-victim-name"
                    >
                        ${victim.name}
                    </div>


                    <div
                        class="gameui-detail-row"
                    >

                        <div
                            class="gameui-detail-label"
                        >
                            DATE OF BIRTH
                        </div>

                        <div
                            class="gameui-detail-value"
                        >
                            ${victim.birthday || "UNKNOWN"}
                        </div>

                    </div>


                    <div
                        class="gameui-detail-row"
                    >

                        <div
                            class="gameui-detail-label"
                        >
                            CAUSE OF DEATH
                        </div>

                        <div
                            class="gameui-detail-value"
                        >
                            ${victim.cause || "UNKNOWN"}
                        </div>

                    </div>


                    <div
                        class="gameui-detail-row"
                    >

                        <div
                            class="gameui-detail-label"
                        >
                            STATUS
                        </div>

                        <div
                            class="gameui-detail-value"
                        >
                            DECEASED — ACTIVE INVESTIGATION
                        </div>

                    </div>


                    ${
                        victim.location

                        ?

                        `
                        <div
                            class="gameui-detail-row"
                        >

                            <div
                                class="gameui-detail-label"
                            >
                                RECOVERY LOCATION
                            </div>

                            <div
                                class="gameui-detail-value"
                            >
                                ${victim.location}
                            </div>

                        </div>
                        `

                        :

                        ""
                    }


                    <button
                        class="
                            gameui-victim-file-btn
                        "
                        id="showVictimFile"
                    >
                        SHOW VICTIM FILE
                    </button>

                </div>

            </div>

        `;


        document
            .getElementById(
                "showVictimFile"
            )
            .addEventListener(
                "click",
                () => {

                    renderVictimFile(
                        body
                    );

                }
            );

    }


    /* ============================================================
       FULL VICTIM FILE
    ============================================================ */

    function renderVictimFile(body) {

        const victim =
            state.victim;


        if (!victim) {

            body.innerHTML = `

                <h2>Victim File</h2>

                <div class="gameui-empty">

                    Victim information is unavailable.

                </div>

            `;

            return;

        }


        body.innerHTML = `

            <div
                class="gameui-file"
            >

                <!-- FILE HEADER -->

                <div
                    class="gameui-file-header"
                >

                    <div>

                        <div
                            class="gameui-file-department"
                        >
                            POLICE DEPARTMENT
                        </div>


                        <div
                            class="gameui-file-title"
                        >
                            VICTIM INFORMATION
                        </div>

                    </div>


                    <div
                        class="gameui-file-case"
                    >
                        ACTIVE INVESTIGATION
                    </div>

                </div>


                <!-- FILE CONTENT -->

                <div
                    class="gameui-file-content"
                >

                    <!-- PHOTO -->

                    <div
                        class="gameui-file-photo"
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

                            `
                            <div
                                class="gameui-empty"
                            >
                                NO PHOTOGRAPH
                            </div>
                            `
                        }

                    </div>


                    <!-- DATA -->

                    <div
                        class="gameui-file-data"
                    >

                        <div
                            class="gameui-file-section-title"
                        >
                            VICTIM
                        </div>


                        <div
                            class="gameui-file-name"
                        >
                            ${victim.name}
                        </div>


                        <div
                            class="gameui-file-row"
                        >

                            <div
                                class="gameui-file-row-label"
                            >
                                FULL NAME
                            </div>

                            <div
                                class="gameui-file-row-value"
                            >
                                ${victim.name}
                            </div>

                        </div>


                        <div
                            class="gameui-file-row"
                        >

                            <div
                                class="gameui-file-row-label"
                            >
                                DATE OF BIRTH
                            </div>

                            <div
                                class="gameui-file-row-value"
                            >
                                ${victim.birthday || "UNKNOWN"}
                            </div>

                        </div>


                        <div
                            class="gameui-file-row"
                        >

                            <div
                                class="gameui-file-row-label"
                            >
                                CAUSE OF DEATH
                            </div>

                            <div
                                class="gameui-file-row-value"
                            >
                                ${victim.cause || "UNKNOWN"}
                            </div>

                        </div>


                        <div
                            class="gameui-file-row"
                        >

                            <div
                                class="gameui-file-row-label"
                            >
                                RECOVERY LOCATION
                            </div>

                            <div
                                class="gameui-file-row-value"
                            >
                                ${
                                    victim.location ||
                                    "UNKNOWN"
                                }
                            </div>

                        </div>


                        <div
                            class="gameui-file-row"
                        >

                            <div
                                class="gameui-file-row-label"
                            >
                                CASE STATUS
                            </div>

                            <div
                                class="gameui-file-row-value"
                            >
                                ACTIVE INVESTIGATION
                            </div>

                        </div>


                        <div
                            class="gameui-file-note"
                        >
                            This file contains the currently
                            available official information
                            regarding the victim. Additional
                            information may become available
                            as the investigation progresses.
                        </div>

                    </div>

                </div>

            </div>

        `;

    }


    /* ============================================================
       PHONE
    ============================================================ */

    function renderPhone(body) {

        const repair =
            state.phone.repairPercent;


        if (
            state.phone.unlocked
        ) {

            body.innerHTML = `

                <h2>Phone</h2>

                <div
                    class="gameui-phone-panel"
                >

                    <h2>
                        PHONE AVAILABLE
                    </h2>

                    <div
                        class="gameui-phone-status"
                    >
                        The phone has been repaired
                        and is now available as an
                        investigation tool.
                    </div>


                    <a
                        class="gameui-small-btn"
                        href="phone.html"
                    >
                        OPEN PHONE
                    </a>

                </div>

            `;

            return;

        }


        if (
            repair >= 100
        ) {

            body.innerHTML = `

                <h2>Phone</h2>

                <div
                    class="gameui-phone-panel"
                >

                    <h2>
                        REPAIR COMPLETE
                    </h2>

                    <div
                        class="gameui-phone-status"
                    >
                        The phone is ready to be
                        unlocked and used.
                    </div>


                    <a
                        class="gameui-small-btn"
                        href="repair.html"
                    >
                        CONTINUE
                    </a>

                </div>

            `;

            return;

        }


        body.innerHTML = `

            <h2>Phone</h2>

            <div
                class="gameui-phone-panel"
            >

                <h2>
                    DAMAGED PHONE
                </h2>

                <div
                    class="gameui-phone-status"
                >
                    Repair progress:
                    ${repair}%
                </div>


                <a
                    class="gameui-small-btn"
                    href="repair.html"
                >
                    CONTINUE REPAIR
                </a>

            </div>

        `;

    }


    /* ============================================================
       RENDER BAR COUNTS
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
                `CLUES ${state.clues.length}/${state.totalCluesPossible}`;

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
