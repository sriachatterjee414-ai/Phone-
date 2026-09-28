(function () {
    const SAVE_KEY = "brokenPhoneSaveSlot";
    const SETTINGS_KEYS = new Set([
        "brokenPhoneVolume",
        "brokenPhoneSound"
    ]);
    const SNAPSHOT_EXCLUDED_KEYS = new Set([
        ...SETTINGS_KEYS,
        "brokenPhonePlayerPassword",
        "brokenPhoneResumePage",
        "brokenPhoneResumeDialogueIndex",
        SAVE_KEY
    ]);
    const RESTORE_PRESERVED_KEYS = new Set([
        ...SETTINGS_KEYS,
        "brokenPhonePlayerPassword",
        SAVE_KEY
    ]);
    const audioBaseVolumes = new WeakMap();
    const audioAppliedVolumes = new WeakMap();
    const GAME_PAGES = new Set([
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
    const PAGE_LABELS = {
        "story.html": "Ryan's briefing",
        "investigation.html": "Investigation",
        "desk.html": "Desk search",
        "cabinet.html": "Cabinet search",
        "table.html": "Table search",
        "repair.html": "Phone repair",
        "phone.html": "Repaired phone",
        "story2.html": "Story 2 briefing",
        "messages.html": "Phone messages",
        "calls.html": "Phone calls",
        "contacts.html": "Phone contacts",
        "gallery.html": "Phone gallery",
        "notes.html": "Phone notes",
        "browser.html": "Phone browser",
        "camera.html": "Phone camera",
        "bank.html": "Phone bank app",
        "music.html": "Phone music",
        "clock.html": "Phone clock",
        "settings.html": "Phone settings",
        "victim-info.html": "Victim file"
    };

    function currentPage() {
        const page = window.location.pathname.split("/").pop() || "index.html";
        return GAME_PAGES.has(page) ? page : "investigation.html";
    }

    function parseJson(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    }

    function collectGameData() {
        const data = {};

        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (!key || !key.startsWith("brokenPhone") || SNAPSHOT_EXCLUDED_KEYS.has(key)) continue;
            data[key] = localStorage.getItem(key);
        }

        return data;
    }

    function makeSnapshot() {
        const data = collectGameData();
        let page = currentPage();

        if (page === "story.html" && data.brokenPhoneStory1Complete === "true") {
            page = "investigation.html";
        }

        if (page === "story2.html" && data.brokenPhoneStory2Complete === "true") {
            page = "phone.html";
        }
        const inventory = parseJson(data.brokenPhoneInventory, []);
        const gameState = parseJson(data.brokenPhoneGameState, {});
        const dialogueIndex = Number(window.brokenPhoneDialogueIndex);

        return {
            version: 1,
            savedAt: new Date().toISOString(),
            page,
            section: PAGE_LABELS[page] || "Game",
            playerName: data.brokenPhonePlayerName || "Player",
            inventoryCount: Array.isArray(inventory) ? inventory.length : 0,
            clueCount: Array.isArray(gameState.clues) ? gameState.clues.length : 0,
            dialogueIndex: Number.isInteger(dialogueIndex) && dialogueIndex >= 0
                ? dialogueIndex
                : null,
            repairPercent: Number(parseJson(data.brokenPhoneRepairSession, {}).condition) || 0,
            data
        };
    }

    function getSave() {
        return parseJson(localStorage.getItem(SAVE_KEY), null);
    }

    function save() {
        try {
            const snapshot = makeSnapshot();
            localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
            window.dispatchEvent(new CustomEvent("brokenPhoneSaved", { detail: snapshot }));
            return snapshot;
        } catch (error) {
            console.error("Could not save the game:", error);
            return null;
        }
    }

    function restore() {
        const snapshot = getSave();
        if (!snapshot || !snapshot.data || !GAME_PAGES.has(snapshot.page)) return null;

        for (let index = localStorage.length - 1; index >= 0; index -= 1) {
            const key = localStorage.key(index);
            if (key && key.startsWith("brokenPhone") && !RESTORE_PRESERVED_KEYS.has(key)) {
                localStorage.removeItem(key);
            }
        }

        Object.entries(snapshot.data).forEach(([key, value]) => {
            if (key.startsWith("brokenPhone") && !SETTINGS_KEYS.has(key)) {
                localStorage.setItem(key, value);
            }
        });

        localStorage.setItem("brokenPhoneResumePage", snapshot.page);
        if (
            snapshot.dialogueIndex !== null &&
            (snapshot.page === "story.html" || snapshot.page === "story2.html")
        ) {
            localStorage.setItem("brokenPhoneResumeDialogueIndex", String(snapshot.dialogueIndex));
        } else {
            localStorage.removeItem("brokenPhoneResumeDialogueIndex");
        }

        return snapshot;
    }

    function reset() {
        for (let index = localStorage.length - 1; index >= 0; index -= 1) {
            const key = localStorage.key(index);
            if (key && key.startsWith("brokenPhone") && !SETTINGS_KEYS.has(key)) {
                localStorage.removeItem(key);
            }
        }

        localStorage.removeItem(SAVE_KEY);
    }

    function hasSave() {
        return Boolean(getSave());
    }

    function setDialogueIndex(index) {
        const value = Number(index);
        if (Number.isInteger(value) && value >= 0) {
            window.brokenPhoneDialogueIndex = value;
        }
    }

    function currentSoundEnabled() {
        return localStorage.getItem("brokenPhoneSound") !== "off";
    }

    function currentMasterVolume() {
        const stored = Number(localStorage.getItem("brokenPhoneVolume"));
        return Number.isFinite(stored) ? Math.max(0, Math.min(100, stored)) : 70;
    }

    function applyAudioSettings() {
        const soundEnabled = currentSoundEnabled();
        const masterVolume = currentMasterVolume() / 100;

        document.querySelectorAll("audio, video").forEach(media => {
            const previousApplied = audioAppliedVolumes.get(media);
            if (
                previousApplied === undefined ||
                Math.abs(media.volume - previousApplied) > 0.001
            ) {
                audioBaseVolumes.set(media, media.volume || 0.7);
            }

            media.muted = !soundEnabled;
            media.volume = audioBaseVolumes.get(media) * masterVolume;
            audioAppliedVolumes.set(media, media.volume);
        });
    }

    function applyBrightness(value) {
        const brightness = Math.max(60, Math.min(120, Number(value) || 100));
        document.documentElement.style.setProperty("--game-brightness", `${brightness}%`);
        localStorage.setItem("brokenPhoneBrightness", String(brightness));
    }

    function updateMenuPreview() {
        const summary = document.getElementById("gameSaveSummary");
        if (!summary) return;

        const snapshot = getSave();
        if (!snapshot) {
            summary.textContent = "No save yet. Save to create a checkpoint.";
            return;
        }

        const timestamp = new Date(snapshot.savedAt);
        const savedAt = Number.isNaN(timestamp.getTime()) ? "Unknown time" : timestamp.toLocaleString();
        summary.textContent = `${snapshot.section} · ${snapshot.inventoryCount} items · ${snapshot.clueCount} clues · ${savedAt}`;
    }

    function createGameMenu() {
        if (document.getElementById("gameMenuToggle")) return;

        const page = window.location.pathname.split("/").pop();
        if (!GAME_PAGES.has(page)) return;

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.id = "gameMenuToggle";
        toggle.className = "game-menu-toggle";
        toggle.textContent = "☰";
        toggle.setAttribute("aria-label", "Open game menu");
        toggle.setAttribute("aria-expanded", "false");

        const panel = document.createElement("section");
        panel.id = "gameMenuPanel";
        panel.className = "game-menu-panel";
        panel.setAttribute("aria-hidden", "true");
        panel.innerHTML = `
            <button class="game-menu-backdrop" id="gameMenuBackdrop" type="button" aria-label="Close game menu"></button>
            <div class="game-menu-sheet" role="dialog" aria-modal="true" aria-labelledby="gameMenuTitle">
                <header class="game-menu-header">
                    <div>
                        <div class="game-menu-eyebrow">GAME MENU</div>
                        <h2 id="gameMenuTitle">PAUSED</h2>
                    </div>
                    <button id="closeGameMenu" class="game-menu-close" type="button" aria-label="Close">×</button>
                </header>
                <div class="game-menu-save-preview">
                    <div class="game-menu-eyebrow">SAVE PREVIEW</div>
                    <p id="gameSaveSummary"></p>
                </div>
                <div class="game-menu-actions">
                    <button id="saveGameAction" type="button">SAVE GAME</button>
                    <button id="exitGameAction" type="button">SAVE &amp; EXIT</button>
                </div>
                <div class="game-menu-settings">
                    <label class="game-menu-setting-row" for="gameSoundToggle">
                        <span>SOUND</span>
                        <input id="gameSoundToggle" type="checkbox">
                    </label>
                    <label class="game-menu-range" for="gameVolumeRange">
                        <span>MASTER VOLUME</span>
                        <input id="gameVolumeRange" type="range" min="0" max="100" step="1">
                    </label>
                    <label class="game-menu-range" for="gameBrightnessRange">
                        <span>BRIGHTNESS</span>
                        <input id="gameBrightnessRange" type="range" min="60" max="120" step="1">
                    </label>
                </div>
                <form id="gamePlayerNameForm" class="game-menu-name-form">
                    <label for="gamePlayerName">PLAYER NAME</label>
                    <div class="game-menu-name-controls">
                        <input id="gamePlayerName" type="text" maxlength="20" autocomplete="off">
                        <button type="submit">UPDATE</button>
                    </div>
                </form>
                <div class="game-menu-account">
                    <span>ACCOUNT</span>
                    <strong>LOCAL PROFILE · THIS DEVICE</strong>
                </div>
                <div class="game-menu-status" id="gameMenuStatus" role="status" aria-live="polite"></div>
            </div>
        `;

        document.body.append(toggle, panel);

        const close = () => {
            panel.classList.remove("open");
            panel.setAttribute("aria-hidden", "true");
            toggle.setAttribute("aria-expanded", "false");
        };

        const open = () => {
            updateMenuPreview();
            document.getElementById("gameSoundToggle").checked = currentSoundEnabled();
            document.getElementById("gameVolumeRange").value = String(currentMasterVolume());
            document.getElementById("gameBrightnessRange").value =
                localStorage.getItem("brokenPhoneBrightness") || "100";
            document.getElementById("gamePlayerName").value =
                localStorage.getItem("brokenPhonePlayerName") || "";
            panel.classList.add("open");
            panel.setAttribute("aria-hidden", "false");
            toggle.setAttribute("aria-expanded", "true");
        };

        toggle.addEventListener("click", () => {
            panel.classList.contains("open") ? close() : open();
        });
        document.getElementById("closeGameMenu").addEventListener("click", close);
        document.getElementById("gameMenuBackdrop").addEventListener("click", close);

        document.getElementById("saveGameAction").addEventListener("click", () => {
            const snapshot = save();
            document.getElementById("gameMenuStatus").textContent = snapshot
                ? `Saved at ${snapshot.section}.`
                : "Could not save. Check available browser storage.";
            updateMenuPreview();
        });

        document.getElementById("exitGameAction").addEventListener("click", () => {
            if (save()) window.location.href = "index.html";
        });

        document.getElementById("gameSoundToggle").addEventListener("change", event => {
            localStorage.setItem("brokenPhoneSound", event.target.checked ? "on" : "off");
            applyAudioSettings();
        });

        document.getElementById("gameVolumeRange").addEventListener("input", event => {
            localStorage.setItem("brokenPhoneVolume", event.target.value);
            applyAudioSettings();
        });

        document.getElementById("gameBrightnessRange").addEventListener("input", event => {
            applyBrightness(event.target.value);
        });

        document.getElementById("gamePlayerNameForm").addEventListener("submit", event => {
            event.preventDefault();
            const input = document.getElementById("gamePlayerName");
            const name = input.value.trim();
            if (!name) {
                input.focus();
                return;
            }
            localStorage.setItem("brokenPhonePlayerName", name);
            window.dispatchEvent(new CustomEvent("brokenPhonePlayerNameChanged", { detail: name }));
            document.getElementById("gameMenuStatus").textContent = "Player name updated.";
        });

        const observer = new MutationObserver(applyAudioSettings);
        observer.observe(document.body, { childList: true, subtree: true });
        document.addEventListener("play", event => {
            if (event.target instanceof HTMLMediaElement) applyAudioSettings();
        }, true);

        applyAudioSettings();
        const brightness = localStorage.getItem("brokenPhoneBrightness");
        if (brightness !== null) applyBrightness(brightness);
    }

    window.GameSave = {
        getSave,
        hasSave,
        makeSnapshot,
        restore,
        reset,
        save,
        setDialogueIndex
    };

    document.addEventListener("DOMContentLoaded", () => {
        window.setTimeout(createGameMenu, 0);
        const observer = new MutationObserver(() => {
            createGameMenu();
            if (document.getElementById("gameMenuToggle")) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true });
    });

    window.addEventListener("pagehide", () => {
        const page = window.location.pathname.split("/").pop();
        if (GAME_PAGES.has(page)) save();
    });
})();
