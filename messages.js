/* =========================================================
   BROKEN PHONE
   VICTIM'S PHONE — MESSAGES
   =========================================================

   IMPORTANT:

   This is the VICTIM'S phone.

   The player is the investigator repairing/examining
   the phone.

   The player can:
      • Read conversations
      • Open suspicious conversations
      • View archived conversations
      • Type messages
      • Send audio attachments
      • Send image attachments

   IMPORTANT:
   NPCs DO NOT REPLY to investigator messages.

   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const messageList =
    document.getElementById("messageList");

const backBtn =
    document.getElementById("backBtn");

const newBtn =
    document.getElementById("newBtn");


/* =========================================================
   VICTIM
   ========================================================= */

const victimName = "MAYA";


/* =========================================================
   STORAGE
   ========================================================= */

const sentMessagesKey =
    "brokenPhoneVictimSentMessages";

let sentMessages =
    JSON.parse(
        localStorage.getItem(sentMessagesKey) || "{}"
    );


/* =========================================================
   CONVERSATIONS
   =========================================================

   type:
      normal
      suspicious
      archived

   html:
      allows important clues such as
      RED HEELS to appear bold.

   ========================================================= */

const conversations = [

    /* =====================================================
       MOM
       ===================================================== */

    {
        id: "mom",

        name: "Mom",

        preview:
            "Don't forget to eat something today.",

        time: "9:18 AM",

        avatar: "M",

        type: "normal",

        messages: [

            {
                sender: "them",
                text:
                    "Good morning sweetheart. Did you sleep properly?"
            },

            {
                sender: "me",
                text:
                    "Kind of. I was up late."
            },

            {
                sender: "them",
                text:
                    "Again? You work too much."
            },

            {
                sender: "me",
                text:
                    "It's not that bad."
            },

            {
                sender: "them",
                text:
                    "You always say that."
            },

            {
                sender: "them",
                text:
                    "Are you coming home for dinner?"
            },

            {
                sender: "me",
                text:
                    "Probably late."
            },

            {
                sender: "them",
                text:
                    "Then I'll keep something for you."
            },

            {
                sender: "me",
                text:
                    "Thanks ❤️"
            },

            {
                sender: "them",
                text:
                    "And please call your father. He was asking about you."
            },

            {
                sender: "me",
                text:
                    "I'll call him tonight."
            },

            {
                sender: "them",
                text:
                    "You said that yesterday."
            },

            {
                sender: "me",
                text:
                    "I know 😭"
            },

            {
                sender: "them",
                text:
                    "Eat something."
            },

            {
                sender: "me",
                text:
                    "Yes, Mom."
            }

        ]
    },


    /* =====================================================
       DAD
       ===================================================== */

    {
        id: "dad",

        name: "Dad",

        preview:
            "Call me when you're free.",

        time: "8:42 AM",

        avatar: "D",

        type: "normal",

        messages: [

            {
                sender: "them",
                text:
                    "Morning."
            },

            {
                sender: "me",
                text:
                    "Morning Dad."
            },

            {
                sender: "them",
                text:
                    "Everything okay?"
            },

            {
                sender: "me",
                text:
                    "Yeah. Why?"
            },

            {
                sender: "them",
                text:
                    "You sounded tired yesterday."
            },

            {
                sender: "me",
                text:
                    "Just work."
            },

            {
                sender: "them",
                text:
                    "Don't let work become your whole life."
            },

            {
                sender: "me",
                text:
                    "I know."
            },

            {
                sender: "them",
                text:
                    "Call me when you're free."
            },

            {
                sender: "me",
                text:
                    "Tonight."
            },

            {
                sender: "them",
                text:
                    "Promise?"
            },

            {
                sender: "me",
                text:
                    "Promise."
            }

        ]
    },


    /* =====================================================
       SOPHIE — FRIEND
       ===================================================== */

    {
        id: "sophie",

        name: "Sophie",

        preview:
            "You cannot cancel on me again.",

        time: "Yesterday",

        avatar: "S",

        type: "normal",

        messages: [

            {
                sender: "them",
                text:
                    "Are we still going out Friday?"
            },

            {
                sender: "me",
                text:
                    "I think so."
            },

            {
                sender: "them",
                text:
                    "THINK?"
            },

            {
                sender: "me",
                text:
                    "Okay okay. Yes."
            },

            {
                sender: "them",
                text:
                    "Good."
            },

            {
                sender: "them",
                text:
                    "And don't wear that boring black jacket."
            },

            {
                sender: "me",
                text:
                    "Why?"
            },

            {
                sender: "them",
                text:
                    "Because I said so."
            },

            {
                sender: "me",
                text:
                    "Excellent argument."
            },

            {
                sender: "them",
                text:
                    "Also I found that little café you liked."
            },

            {
                sender: "me",
                text:
                    "The one near the bookstore?"
            },

            {
                sender: "them",
                text:
                    "YES."
            },

            {
                sender: "me",
                text:
                    "Okay I'm actually excited now."
            },

            {
                sender: "them",
                text:
                    "See? I plan everything."
            },

            {
                sender: "me",
                text:
                    "You really do."
            }

        ]
    },


    /* =====================================================
       LEO — FRIEND / COWORKER
       ===================================================== */

    {
        id: "leo",

        name: "Leo",

        preview:
            "Did you finish that report?",

        time: "Yesterday",

        avatar: "L",

        type: "normal",

        messages: [

            {
                sender: "them",
                text:
                    "Did you finish that report?"
            },

            {
                sender: "me",
                text:
                    "Almost."
            },

            {
                sender: "them",
                text:
                    "You've been saying almost for two days."
            },

            {
                sender: "me",
                text:
                    "Then technically I'm consistent."
            },

            {
                sender: "them",
                text:
                    "That's not how deadlines work."
            },

            {
                sender: "me",
                text:
                    "I'll finish it."
            },

            {
                sender: "them",
                text:
                    "Before tomorrow?"
            },

            {
                sender: "me",
                text:
                    "Yes."
            },

            {
                sender: "them",
                text:
                    "Good."
            },

            {
                sender: "me",
                text:
                    "Go bother someone else."
            },

            {
                sender: "them",
                text:
                    "Gladly."
            }

        ]
    },


    /* =====================================================
       JACOB — SUSPICIOUS
       ===================================================== */

    {
        id: "jacob",

        name: "Jacob",

        preview:
            "Did you get it?",

        time: "Yesterday",

        avatar: "J",

        type: "suspicious",

        messages: [

            {
                sender: "them",
                text:
                    "Did you get it?"
            },

            {
                sender: "me",
                text:
                    "Yes."
            },

            {
                sender: "them",
                text:
                    "You're sure?"
            },

            {
                sender: "me",
                text:
                    "Yes, Jacob."
            },

            {
                sender: "them",
                text:
                    "Good."
            },

            {
                sender: "them",
                text:
                    "Keep it somewhere safe."
            },

            {
                sender: "me",
                text:
                    "I know."
            },

            {
                sender: "them",
                text:
                    "Don't tell anyone about it."
            },

            {
                sender: "me",
                text:
                    "I wasn't planning to."
            },

            {
                sender: "them",
                text:
                    "Let's meet at my place."
            },

            {
                sender: "me",
                text:
                    "When?"
            },

            {
                sender: "them",
                text:
                    "Tonight."
            },

            {
                sender: "me",
                text:
                    "Okay."
            },

            {
                sender: "them",
                text:
                    "I'll give you the book."
            },

            {
                sender: "me",
                text:
                    "Coming."
            },

            {
                sender: "them",
                text:
                    "And don't bring anyone."
            },

            {
                sender: "me",
                text:
                    "I won't."
            },

            {
                sender: "them",
                text:
                    "One more thing."
            },

            {
                sender: "me",
                text:
                    "What?"
            },

            {
                sender: "them",
                text:
                    "Wear something that doesn't stand out."
            },

            {
                sender: "me",
                html:
                    "I am sure you will love my <strong>red heels</strong>."
            },

            {
                sender: "them",
                text:
                    "You really shouldn't joke about everything."
            },

            {
                sender: "me",
                text:
                    "Relax."
            },

            {
                sender: "them",
                text:
                    "Just be careful."
            },

            {
                sender: "me",
                text:
                    "I'll see you tonight."
            }

        ]
    },


    /* =====================================================
       K1 — VERY SUSPICIOUS
       ===================================================== */

    {
        id: "k1",

        name: "K1",

        preview:
            "Don't lie to me.",

        time: "Yesterday",

        avatar: "K1",

        type: "suspicious",

        messages: [

            {
                sender: "them",
                text:
                    "Did you find the diary?"
            },

            {
                sender: "me",
                text:
                    "No."
            },

            {
                sender: "them",
                text:
                    "Don't lie."
            },

            {
                sender: "me",
                text:
                    "I am not."
            },

            {
                sender: "them",
                text:
                    "Are you sure that it is here?"
            },

            {
                sender: "me",
                text:
                    "Q texted me and said it is there."
            },

            {
                sender: "them",
                text:
                    "Why do you believe her so much?"
            },

            {
                sender: "me",
                text:
                    "None of your business."
            },

            {
                sender: "them",
                text:
                    "You were supposed to have it already."
            },

            {
                sender: "me",
                text:
                    "I told you I couldn't find it."
            },

            {
                sender: "them",
                text:
                    "Then look again."
            },

            {
                sender: "me",
                text:
                    "Where?"
            },

            {
                sender: "them",
                text:
                    "You know where."
            },

            {
                sender: "me",
                text:
                    "I really don't."
            },

            {
                sender: "them",
                text:
                    "Stop wasting time."
            },

            {
                sender: "me",
                text:
                    "What happens if I don't find it?"
            },

            {
                sender: "them",
                text:
                    "You don't want to find out."
            },

            {
                sender: "me",
                text:
                    "Is that a threat?"
            },

            {
                sender: "them",
                text:
                    "Take it however you want."
            },

            {
                sender: "me",
                text:
                    "..."
            },

            {
                sender: "them",
                text:
                    "Now get it done within 20 minutes."
            },

            {
                sender: "them",
                text:
                    "Then reach my place."
            },

            {
                sender: "me",
                text:
                    "Okay."
            },

            {
                sender: "them",
                text:
                    "And delete this conversation."
            },

            {
                sender: "me",
                text:
                    "Why?"
            },

            {
                sender: "them",
                text:
                    "Just do it."
            }

        ]
    },


    /* =====================================================
       Q — UNKNOWN CONTACT
       ===================================================== */

    {
        id: "q",

        name: "Q",

        preview:
            "I told you not to ask questions.",

        time: "Yesterday",

        avatar: "Q",

        type: "suspicious",

        messages: [

            {
                sender: "them",
                text:
                    "You found it?"
            },

            {
                sender: "me",
                text:
                    "Found what?"
            },

            {
                sender: "them",
                text:
                    "Don't do that."
            },

            {
                sender: "me",
                text:
                    "Do what?"
            },

            {
                sender: "them",
                text:
                    "Pretend you don't know."
            },

            {
                sender: "me",
                text:
                    "I honestly don't."
            },

            {
                sender: "them",
                text:
                    "Ask K1."
            },

            {
                sender: "me",
                text:
                    "I already did."
            },

            {
                sender: "them",
                text:
                    "Then you already know enough."
            },

            {
                sender: "me",
                text:
                    "That doesn't make any sense."
            },

            {
                sender: "them",
                text:
                    "Good."
            },

            {
                sender: "them",
                text:
                    "Keep it that way."
            },

            {
                sender: "me",
                text:
                    "What is going on?"
            },

            {
                sender: "them",
                text:
                    "Don't ask questions over text."
            },

            {
                sender: "me",
                text:
                    "Then where?"
            },

            {
                sender: "them",
                text:
                    "You'll be told."
            }

        ]
    },


    /* =====================================================
       UNKNOWN NUMBER
       ===================================================== */

    {
        id: "unknown",

        name: "Unknown",

        preview:
            "You shouldn't have that.",

        time: "Yesterday",

        avatar: "?",

        type: "suspicious",

        messages: [

            {
                sender: "them",
                text:
                    "You shouldn't have that."
            },

            {
                sender: "me",
                text:
                    "Who is this?"
            },

            {
                sender: "them",
                text:
                    "You know who."
            },

            {
                sender: "me",
                text:
                    "No, I don't."
            },

            {
                sender: "them",
                text:
                    "Then forget this conversation."
            },

            {
                sender: "me",
                text:
                    "What are you talking about?"
            },

            {
                sender: "them",
                text:
                    "Don't contact this number again."
            },

            {
                sender: "me",
                text:
                    "Wait."
            },

            {
                sender: "them",
                text:
                    "Goodbye."
            }

        ]
    },


    /* =====================================================
       SARAH — FRIEND
       ===================================================== */

    {
        id: "sarah",

        name: "Sarah",

        preview:
            "Send me the picture 😂",

        time: "2 days ago",

        avatar: "S",

        type: "normal",

        messages: [

            {
                sender: "them",
                text:
                    "Did you take pictures yesterday?"
            },

            {
                sender: "me",
                text:
                    "Maybe."
            },

            {
                sender: "them",
                text:
                    "SEND."
            },

            {
                sender: "me",
                text:
                    "You're very demanding."
            },

            {
                sender: "them",
                text:
                    "Please."
            },

            {
                sender: "me",
                text:
                    "Better."
            },

            {
                sender: "them",
                text:
                    "😂"
            },

            {
                sender: "me",
                text:
                    "I'll send them later."
            },

            {
                sender: "them",
                text:
                    "You always say later."
            },

            {
                sender: "me",
                text:
                    "Because later is a very useful time."
            }

        ]
    }

];


/* =========================================================
   ARCHIVED CONVERSATIONS
   ========================================================= */

const archivedConversations = [

    {
        id: "archived_old_number",

        name: "Old Number",

        preview:
            "You promised.",

        time: "Last week",

        avatar: "?",

        type: "archived",

        messages: [

            {
                sender: "them",
                text:
                    "You promised."
            },

            {
                sender: "me",
                text:
                    "I know."
            },

            {
                sender: "them",
                text:
                    "Then don't change your mind."
            },

            {
                sender: "me",
                text:
                    "I'm not changing anything."
            },

            {
                sender: "them",
                text:
                    "Good."
            },

            {
                sender: "them",
                text:
                    "Forget we talked."
            }

        ]
    },


    {
        id: "archived_k",

        name: "K",

        preview:
            "Delete this after reading.",

        time: "Last week",

        avatar: "K",

        type: "archived",

        messages: [

            {
                sender: "them",
                text:
                    "Are you alone?"
            },

            {
                sender: "me",
                text:
                    "Yes."
            },

            {
                sender: "them",
                text:
                    "Good."
            },

            {
                sender: "them",
                text:
                    "I heard you were asking questions."
            },

            {
                sender: "me",
                text:
                    "Who told you?"
            },

            {
                sender: "them",
                text:
                    "It doesn't matter."
            },

            {
                sender: "them",
                text:
                    "Delete this after reading."
            },

            {
                sender: "me",
                text:
                    "Okay."
            }

        ]
    }

];


/* =========================================================
   STATE
   ========================================================= */

let currentConversation = null;


/* =========================================================
   SAVE PLAYER MESSAGE
   ========================================================= */

function saveSentMessages() {

    localStorage.setItem(
        sentMessagesKey,
        JSON.stringify(sentMessages)
    );

}


/* =========================================================
   GET ALL CONVERSATIONS
   ========================================================= */

function getAllConversations() {

    return [
        ...conversations,
        ...archivedConversations
    ];

}


/* =========================================================
   RENDER MESSAGE LIST
   ========================================================= */

function renderMessageList() {

    currentConversation = null;

    messageList.innerHTML = "";


    /* -----------------------------------------
       NORMAL / ACTIVE CONVERSATIONS
    ----------------------------------------- */

    conversations.forEach(
        conversation => {

            const item =
                createConversationItem(
                    conversation
                );

            messageList.appendChild(item);

        }
    );


    /* -----------------------------------------
       ARCHIVED SECTION
    ----------------------------------------- */

    const archiveTitle =
        document.createElement("div");

    archiveTitle.className =
        "archive-title";

    archiveTitle.textContent =
        "ARCHIVED";

    messageList.appendChild(
        archiveTitle
    );


    archivedConversations.forEach(
        conversation => {

            const item =
                createConversationItem(
                    conversation
                );

            item.classList.add(
                "archived-conversation"
            );

            messageList.appendChild(item);

        }
    );

}


/* =========================================================
   CREATE CONVERSATION ITEM
   ========================================================= */

function createConversationItem(
    conversation
) {

    const item =
        document.createElement("button");

    item.className =
        "message-list-item";


    if (
        conversation.type ===
        "suspicious"
    ) {

        item.classList.add(
            "suspicious-conversation"
        );

    }


    if (
        conversation.type ===
        "archived"
    ) {

        item.classList.add(
            "archived-conversation"
        );

    }


    item.innerHTML = `

        <div class="avatar">
            ${conversation.avatar}
        </div>

        <div class="message-preview">

            <strong>
                ${conversation.name}
            </strong>

            <span>
                ${conversation.preview}
            </span>

        </div>

        <time>
            ${conversation.time}
        </time>

    `;


    item.addEventListener(
        "click",
        () => {

            openConversation(
                conversation.id
            );

        }
    );


    return item;

}


/* =========================================================
   OPEN CONVERSATION
   ========================================================= */

function openConversation(
    conversationId
) {

    const conversation =
        getAllConversations()
            .find(
                item =>
                    item.id ===
                    conversationId
            );


    if (!conversation) return;


    currentConversation =
        conversation;


    renderConversation();

}


/* =========================================================
   RENDER CONVERSATION
   ========================================================= */

function renderConversation() {

    messageList.innerHTML = "";


    const header =
        document.createElement("div");

    header.className =
        "conversation-header";


    header.innerHTML = `

        <button
            class="back"
            id="conversationBack"
        >
            ‹
        </button>

        <div class="person-head">

            <div class="mini-avatar">
                ${currentConversation.avatar}
            </div>

            <div>

                <strong>
                    ${currentConversation.name}
                </strong>

                <small>
                    ${getConversationStatus()}
                </small>

            </div>

        </div>

    `;


    messageList.appendChild(
        header
    );


    const scroll =
        document.createElement("div");

    scroll.className =
        "chat-scroll";


    /* -----------------------------------------
       DATE
    ----------------------------------------- */

    const divider =
        document.createElement("div");

    divider.className =
        "day-divider";

    divider.textContent =
        "Recent";

    scroll.appendChild(
        divider
    );


    /* -----------------------------------------
       ORIGINAL MESSAGES
    ----------------------------------------- */

    currentConversation.messages
        .forEach(
            message => {

                scroll.appendChild(
                    createMessageBubble(
                        message
                    )
                );

            }
        );


    /* -----------------------------------------
       INVESTIGATOR SENT MESSAGES
    ----------------------------------------- */

    const customMessages =
        sentMessages[
            currentConversation.id
        ] || [];


    customMessages.forEach(
        message => {

            scroll.appendChild(
                createMessageBubble(
                    message
                )
            );

        }
    );


    messageList.appendChild(
        scroll
    );


    /* -----------------------------------------
       COMPOSER
    ----------------------------------------- */

    const composer =
        createComposer();


    messageList.appendChild(
        composer
    );


    document
        .getElementById(
            "conversationBack"
        )
        .addEventListener(
            "click",
            renderMessageList
        );


    scroll.scrollTop =
        scroll.scrollHeight;

}


/* =========================================================
   STATUS
   ========================================================= */

function getConversationStatus() {

    if (
        currentConversation.type ===
        "suspicious"
    ) {

        return "No response";

    }


    if (
        currentConversation.type ===
        "archived"
    ) {

        return "Archived";

    }


    return "No response";

}


/* =========================================================
   MESSAGE BUBBLE
   ========================================================= */

function createMessageBubble(
    message
) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message-wrapper";


    wrapper.classList.add(
        message.sender === "me"
            ? "sent"
            : "received"
    );


    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";


    if (message.html) {

        bubble.innerHTML =
            message.html;

    } else {

        bubble.textContent =
            message.text || "";

    }


    /* -----------------------------------------
       AUDIO ATTACHMENT
    ----------------------------------------- */

    if (
        message.attachmentType ===
        "audio"
    ) {

        bubble.innerHTML = `

            <div class="attachment-bubble">

                🎵

                <span>
                    ${message.name || "Audio"}
                </span>

            </div>

        `;

    }


    /* -----------------------------------------
       IMAGE ATTACHMENT
    ----------------------------------------- */

    if (
        message.attachmentType ===
        "image"
    ) {

        bubble.innerHTML = `

            <div class="attachment-bubble">

                🖼️

                <span>
                    ${message.name || "Image"}
                </span>

            </div>

        `;

    }


    wrapper.appendChild(
        bubble
    );


    return wrapper;

}


/* =========================================================
   COMPOSER
   ========================================================= */

function createComposer() {

    const composer =
        document.createElement("div");

    composer.className =
        "composer";


    composer.innerHTML = `

        <button
            class="tool-btn"
            id="audioBtn"
            title="Send audio"
        >
            🎤
        </button>

        <button
            class="tool-btn"
            id="imageBtn"
            title="Send image"
        >
            ＋
        </button>

        <input
            type="text"
            class="message-input"
            id="messageInput"
            placeholder="Type a message..."
            autocomplete="off"
        >

        <button
            class="send-btn"
            id="sendBtn"
        >
            ↑
        </button>

        <input
            type="file"
            id="imageInput"
            accept="image/*"
            hidden
        >

        <input
            type="file"
            id="audioInput"
            accept="audio/*"
            hidden
        >

    `;


    /* -----------------------------------------
       TEXT
    ----------------------------------------- */

    const input =
        composer.querySelector(
            "#messageInput"
        );


    const sendBtn =
        composer.querySelector(
            "#sendBtn"
        );


    function sendText() {

        const text =
            input.value.trim();


        if (text === "") return;


        addPlayerMessage({

            sender: "me",

            text: text

        });


        input.value = "";

    }


    sendBtn.addEventListener(
        "click",
        sendText
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                sendText();

            }

        }
    );


    /* -----------------------------------------
       IMAGE
    ----------------------------------------- */

    const imageBtn =
        composer.querySelector(
            "#imageBtn"
        );

    const imageInput =
        composer.querySelector(
            "#imageInput"
        );


    imageBtn.addEventListener(
        "click",
        () => {

            imageInput.click();

        }
    );


    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];


            if (!file) return;


            addPlayerMessage({

                sender: "me",

                attachmentType:
                    "image",

                name:
                    file.name

            });


            imageInput.value = "";

        }
    );


    /* -----------------------------------------
       AUDIO
    ----------------------------------------- */

    const audioBtn =
        composer.querySelector(
            "#audioBtn"
        );

    const audioInput =
        composer.querySelector(
            "#audioInput"
        );


    audioBtn.addEventListener(
        "click",
        () => {

            audioInput.click();

        }
    );


    audioInput.addEventListener(
        "change",
        () => {

            const file =
                audioInput.files[0];


            if (!file) return;


            addPlayerMessage({

                sender: "me",

                attachmentType:
                    "audio",

                name:
                    file.name

            });


            audioInput.value = "";

        }
    );


    return composer;

}


/* =========================================================
   ADD INVESTIGATOR MESSAGE
   =========================================================

   IMPORTANT:

   There is deliberately NO NPC RESPONSE.

   The player is investigating an already
   recovered phone.

   ========================================================= */

function addPlayerMessage(
    message
) {

    if (
        !currentConversation
    ) return;


    if (
        !sentMessages[
            currentConversation.id
        ]
    ) {

        sentMessages[
            currentConversation.id
        ] = [];

    }


    sentMessages[
        currentConversation.id
    ].push(message);


    saveSentMessages();


    renderConversation();

}


/* =========================================================
   BACK BUTTON
   ========================================================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            /*
               Change this later to the
               investigation page.
            */

            window.location.href =
                "investigation.html";

        }
    );

}


/* =========================================================
   NEW MESSAGE BUTTON
   =========================================================

   The investigator is NOT supposed
   to start a completely new contact.

   So for now it does nothing except
   show a small investigation notice.

   ========================================================= */

if (newBtn) {

    newBtn.addEventListener(
        "click",
        () => {

            alert(
                "The investigator can only examine existing contacts on this device."
            );

        }
    );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

renderMessageList();
