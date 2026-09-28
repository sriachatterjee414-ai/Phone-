const dialogueBox = document.getElementById("dialogueBox");
const speakerName = document.getElementById("speakerName");
const dialogueText = document.getElementById("dialogueText");
const nextDialogue = document.getElementById("nextDialogue");
const storyEnd = document.getElementById("storyEnd");
const returnToPhone = document.getElementById("returnToPhone");
const ryanImage = document.getElementById("ryanImage");
const lenaImage = document.getElementById("lenaImage");
const maxImage = document.getElementById("maxImage");
const storyPhoneOverlay = document.getElementById("storyPhoneOverlay");
const storyPhoneFrame = document.getElementById("storyPhoneFrame");
const story2Ambience = document.getElementById("story2Ambience");
const story2DialogueAdvance = document.getElementById("story2DialogueAdvance");
const story2CompleteSound = document.getElementById("story2CompleteSound");

const playerName =
    localStorage.getItem("brokenPhonePlayerName") || "Y/N";

const STORY2_COMPLETE_KEY =
    "brokenPhoneStory2Complete";

localStorage.setItem("brokenPhoneStory2Started", "true");

const officerArt = {
    lena: {
        name: "Lena Brooks",
        skin: "#bd8064",
        hair: "#201a1b",
        uniform: "#33473f",
        shirt: "#d8d3c3",
        badge: "#c8ab72",
        hairShape: "<path d='M112 206 Q98 120 158 92 Q229 73 267 132 Q284 174 260 216 L235 171 Q186 138 132 178 Z'/><circle cx='254' cy='133' r='34'/>"
    },
    max: {
        name: "Max Turner",
        skin: "#d49a74",
        hair: "#33251f",
        uniform: "#303d4c",
        shirt: "#d8d3c3",
        badge: "#c8ab72",
        hairShape: "<path d='M112 207 Q102 126 145 101 Q186 74 229 99 Q273 123 263 205 L239 170 Q185 141 131 177 Z'/>"
    }
};

const faceExpressions = {
    neutral: {
        browLeft: "M143 258 Q161 250 179 258",
        browRight: "M204 258 Q222 250 239 258",
        mouth: "M172 315 Q191 319 210 315"
    },
    concerned: {
        browLeft: "M143 257 Q161 269 179 261",
        browRight: "M204 261 Q222 269 239 257",
        mouth: "M172 321 Q191 310 210 321"
    },
    serious: {
        browLeft: "M143 257 L179 263",
        browRight: "M204 263 L239 257",
        mouth: "M172 318 L210 318"
    },
    surprised: {
        browLeft: "M143 249 Q161 239 179 249",
        browRight: "M204 249 Q222 239 239 249",
        mouth: "M180 311 Q191 301 202 311 Q204 330 191 330 Q178 330 180 311 Z"
    },
    annoyed: {
        browLeft: "M143 263 L179 252",
        browRight: "M204 252 L239 263",
        mouth: "M172 321 Q191 312 210 321"
    },
    amused: {
        browLeft: "M143 258 Q161 251 179 258",
        browRight: "M204 258 Q222 251 239 258",
        mouth: "M170 311 Q191 337 212 311"
    },
    sarcastic: {
        browLeft: "M143 258 Q161 252 179 258",
        browRight: "M204 252 Q222 246 239 252",
        mouth: "M172 317 Q194 322 212 307"
    }
};

function makePortrait(art, expression = "neutral") {
    const face = faceExpressions[expression] || faceExpressions.neutral;
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 760">
            <defs>
                <linearGradient id="jacket" x2="0" y2="1">
                    <stop stop-color="${art.uniform}"/>
                    <stop offset="1" stop-color="#151c20"/>
                </linearGradient>
                <linearGradient id="skin" x2="0" y2="1">
                    <stop stop-color="${art.skin}"/>
                    <stop offset="1" stop-color="#9d6252"/>
                </linearGradient>
            </defs>
            <path fill="url(#jacket)" d="M34 760 Q39 594 94 518 Q127 474 163 462 L217 462 Q259 474 290 518 Q343 594 348 760Z"/>
            <path fill="${art.shirt}" d="M151 457 L190 501 L230 457 L219 559 L161 559Z"/>
            <path fill="${art.uniform}" d="M151 457 L190 501 L164 533 L143 489Z M230 457 L190 501 L218 533 L240 489Z"/>
            <path fill="#26352f" stroke="#c7b17d" stroke-width="5" d="M254 528 L286 528 L286 574 L254 574Z"/>
            <path fill="#c7b17d" d="M270 536 L279 548 L270 566 L261 548Z"/>
            <path fill="url(#skin)" d="M165 406 L215 406 L221 474 Q190 502 159 474Z"/>
            <path fill="url(#skin)" d="M126 253 Q126 170 190 167 Q254 170 254 253 L243 330 Q233 392 190 405 Q147 392 137 330Z"/>
            <g fill="${art.hair}">${art.hairShape}</g>
            <path d="${face.browLeft}" fill="none" stroke="#38251f" stroke-width="7" stroke-linecap="round"/>
            <path d="${face.browRight}" fill="none" stroke="#38251f" stroke-width="7" stroke-linecap="round"/>
            <path d="M151 277 Q161 271 171 277 M211 277 Q221 271 231 277" fill="none" stroke="#30221f" stroke-width="5" stroke-linecap="round"/>
            <circle cx="161" cy="278" r="4" fill="#211a18"/>
            <circle cx="221" cy="278" r="4" fill="#211a18"/>
            <path d="M190 279 L182 306 Q190 310 198 306" fill="none" stroke="#87594b" stroke-width="4" stroke-linecap="round"/>
            <path d="${face.mouth}" fill="none" stroke="#713f3b" stroke-width="5" stroke-linecap="round"/>
            <path d="M142 339 Q190 356 238 339" fill="none" stroke="#9b5e52" stroke-width="3" opacity=".55"/>
            <path d="M97 575 L151 554 L162 760 L75 760Z M283 575 L229 554 L218 760 L305 760Z" fill="#25313b" opacity=".55"/>
            <path d="M47 760 L58 647 L143 679 L151 760 M333 760 L322 647 L237 679 L229 760" fill="none" stroke="#64706b" stroke-width="5" opacity=".32"/>
        </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function registerOfficers() {
    if (typeof GameUI === "undefined" || !GameUI.addCharacter) return;

    if (GameUI.updateCharacter) {
        GameUI.updateCharacter("ryan_hale", "Ryan Hale", "ryan_neutral.png");
    } else {
        GameUI.addCharacter("ryan_hale", "Ryan Hale", "ryan_neutral.png");
    }

    const lenaPortrait = "lenaneutral.png";
    const maxPortrait = "maxneutral.png";

    if (GameUI.updateCharacter) {
        GameUI.updateCharacter("officer_maya_bennett", officerArt.lena.name, lenaPortrait);
        GameUI.updateCharacter("officer_nathan_cole", officerArt.max.name, maxPortrait);
        return;
    }

    GameUI.addCharacter("lena_brooks", officerArt.lena.name, lenaPortrait);
    GameUI.addCharacter("max_turner", officerArt.max.name, maxPortrait);
}

function registerVictimDetails() {
    if (typeof GameUI === "undefined" || !GameUI.setVictim) return;

    GameUI.setVictim(
        "evelyn_carter",
        "Evelyn Carter",
        "victim_portrait.png",
        "Stabbed after being found tied to a tree in a jungle.",
        "May 21, 2001",
        {
            age: "24",
            sex: "Female",
            occupation: "Unknown",
            address: "Unknown",
            emergencyContact: "Unknown",
            caseNumber: "1996-549764",
            caseType: "HOMICIDE",
            caseStatus: "ACTIVE INVESTIGATION",
            location: "East trail, Ashford",
            date: "October 17 (year unconfirmed)",
            dateDiscovered: "October 17 (year unconfirmed)",
            phoneStatus: "RECOVERED - DAMAGED",
            timeOfDeath: "Unknown",
            deathImage: "death.png",
            crimeSceneImage: "crime.png",
            notes: "Evelyn was found tied to a tree near the east trail. Cause and time of death remain under investigation."
        }
    );
}

function updateExpression(speaker, expression) {
    ryanImage.src = "ryan_neutral.png";
    lenaImage.src = "lenaneutral.png";
    maxImage.src = "maxneutral.png";

    if (speaker === "RYAN") {
        const ryanExpressions = {
            concerned: "ryan_concerned.png",
            serious: "ryan_serious.png",
            surprised: "ryan_surprised.png",
            sarcastic: "ryan_sarcastic.png",
            annoyed: "ryan_annoyed.png"
        };
        ryanImage.src = ryanExpressions[expression] || "ryan_neutral.png";
    }

    if (speaker === "LENA") {
        lenaImage.src = `lena${expression === "amused" ? "happy" : expression}.png`;
    }

    if (speaker === "MAX") {
        maxImage.src = `max${expression === "amused" ? "happy" : expression}.png`;
    }
}

const dialogue = [
    { speaker: "RYAN", expression: "neutral", text: "There you are. The phone's repaired?" },
    { speaker: "Y/N", expression: "serious", text: "It powers on. I haven't opened anything yet." },
    { speaker: "RYAN", expression: "concerned", text: "Good. Keep it that way until we know what we're dealing with." },
    { speaker: "MAX", expression: "neutral", text: "I'm Max Turner. Ryan said you were the one who could bring it back from the dead." },
    { speaker: "Y/N", expression: "sarcastic", text: "I usually charge extra for dramatic introductions." },
    { speaker: "LENA", expression: "amused", text: "Lena Brooks. I'll try to make sure he pays you." },
    { speaker: "RYAN", expression: "sarcastic", text: "That's not why we're here." },
    { speaker: "LENA", expression: "serious", text: "No phone findings yet, then. Let's stick to what we actually know." },
    { speaker: "RYAN", expression: "serious", text: "Evelyn Carter was last confirmed near the east trail before the storm." },
    { speaker: "MAX", expression: "concerned", text: "The rain washed out most of the tracks before the scene team arrived." },
    { speaker: "Y/N", expression: "concerned", text: "Anyone see her leave?" },
    { speaker: "LENA", expression: "serious", text: "A diner worker remembers an argument outside, but couldn't identify either person." },
    { speaker: "RYAN", expression: "neutral", text: "It's a lead to verify, not a suspect." },
    { speaker: "MAX", expression: "annoyed", text: "And the trail camera was offline. Maintenance says it lost power the night before." },
    { speaker: "Y/N", expression: "surprised", text: "Convenient timing." },
    { speaker: "LENA", expression: "concerned", text: "Maybe. We don't know that it was deliberate." },
    { speaker: "RYAN", expression: "serious", text: "Exactly. We separate what we know from what we suspect." },
    { speaker: "Y/N", expression: "neutral", text: "And the phone?" },
    { speaker: "RYAN", expression: "concerned", text: "It's evidence. We'll examine it carefully, but we don't have anything from it to report yet." },
    { speaker: "MAX", expression: "neutral", text: "I'll get the camera maintenance records and the original call log." },
    { speaker: "LENA", expression: "serious", text: "I'll go back to the diner and ask the worker to walk me through the timeline." },
    { speaker: "Y/N", expression: "sarcastic", text: "So I get the mysterious phone." },
    { speaker: "RYAN", expression: "sarcastic", text: "You say that like you weren't already holding it." },
    { speaker: "LENA", expression: "amused", text: "We'll compare notes when we have something solid." },
    { speaker: "MAX", expression: "serious", text: "No guesses in the case file. Not until we can back them up." },
    { speaker: "RYAN", expression: "neutral", text: "Take a look at the phone when you're ready. Call me if anything needs a second set of eyes." },
    { speaker: "Y/N", expression: "sarcastic", text: "I'll put it right under 'coffee.'" },
    { speaker: "RYAN", expression: "sarcastic", text: "I knew you'd say that." }
];

let dialogueIndex = 0;
let story2AmbienceRequested = false;

function playStory2Sound(audio, volume = 0.55) {
    if (!audio) return;

    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function startStory2Ambience() {
    if (!story2Ambience || story2AmbienceRequested) return;

    story2AmbienceRequested = true;
    story2Ambience.volume = 0.22;
    story2Ambience.play().catch(() => {
        story2AmbienceRequested = false;
    });
}

function roleForSpeaker(speaker) {
    if (speaker === "RYAN") return "ryan";
    if (speaker === "LENA") return "lena";
    if (speaker === "MAX") return "max";
    return null;
}

function updateCharacterStage(index) {
    const line = dialogue[index];
    const previousRole = roleForSpeaker(dialogue[index - 1]?.speaker);
    const nextRole = roleForSpeaker(dialogue[index + 1]?.speaker);
    const currentRole = roleForSpeaker(line?.speaker);
    let visibleRoles = [];

    if (currentRole) {
        visibleRoles = [currentRole, nextRole || (previousRole !== currentRole ? previousRole : null)];
    } else if (line?.speaker === "Y/N") {
        visibleRoles = [nextRole || previousRole];
    }

    visibleRoles = [...new Set(visibleRoles.filter(Boolean))].slice(0, 2);

    document.querySelector(".character-stage").classList.toggle(
        "pair-active",
        visibleRoles.length === 2
    );

    document.querySelectorAll(".character[data-character]").forEach(character => {
        const role = character.dataset.character;
        const roleIndex = visibleRoles.indexOf(role);

        character.classList.remove("is-visible", "is-center", "is-left", "is-right");
        character.setAttribute("aria-hidden", roleIndex === -1 ? "true" : "false");

        if (roleIndex === -1) return;

        character.classList.add("is-visible");
        character.classList.add(
            visibleRoles.length === 1
                ? "is-center"
                : roleIndex === 0
                    ? "is-left"
                    : "is-right"
        );
    });
}

function displayDialogue() {
    if (dialogueIndex >= dialogue.length) {
        finishDialogue();
        return;
    }

    const line = dialogue[dialogueIndex];
    const name = line.speaker === "Y/N" ? playerName : line.speaker;
    speakerName.textContent = name;
    dialogueText.textContent = line.text.replace(/Y\/N/g, playerName);
    updateExpression(line.speaker, line.expression);
    updateCharacterStage(dialogueIndex);
}

function advanceDialogue() {
    if (dialogueBox.classList.contains("hidden")) return;

    startStory2Ambience();

    if (dialogueIndex < dialogue.length - 1) {
        playStory2Sound(story2DialogueAdvance, 0.35);
    }

    dialogueIndex += 1;
    displayDialogue();
}

function finishDialogue() {
    dialogueBox.classList.add("hidden");
    storyEnd.classList.remove("hidden");
    localStorage.setItem(STORY2_COMPLETE_KEY, "true");
    playStory2Sound(story2CompleteSound, 0.5);
    updateExpression("RYAN", "neutral");
    updateCharacterStage(dialogue.length);
}

nextDialogue.addEventListener("click", advanceDialogue);

document.addEventListener("keydown", event => {
    if ((event.code === "Space" || event.code === "Enter") && !dialogueBox.classList.contains("hidden")) {
        event.preventDefault();
        advanceDialogue();
    }
});

returnToPhone.addEventListener("click", () => {
    localStorage.setItem(STORY2_COMPLETE_KEY, "true");
    storyEnd.classList.add("hidden");
});

function openStoryPhone() {
    storyPhoneOverlay.classList.add("open");
    storyPhoneOverlay.setAttribute("aria-hidden", "false");
    storyPhoneFrame.src = "phone.html?storyOverlay=1";
}

function closeStoryPhone() {
    storyPhoneOverlay.classList.remove("open");
    storyPhoneOverlay.setAttribute("aria-hidden", "true");
    storyPhoneFrame.src = "about:blank";
}

document.addEventListener("click", event => {
    const phoneButton = event.target.closest('#gameuiBar [data-panel="phone"]');
    if (!phoneButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openStoryPhone();
}, true);

window.addEventListener("message", event => {
    if (
        event.origin === window.location.origin &&
        event.source === storyPhoneFrame.contentWindow &&
        event.data?.type === "broken-phone-hidden"
    ) {
        closeStoryPhone();
    }
});

registerOfficers();
registerVictimDetails();
dialogueBox.classList.remove("hidden");
displayDialogue();