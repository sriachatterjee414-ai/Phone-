/* =========================================================
   BROKEN PHONE
   VICTIM'S PHONE — MESSAGES UI
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

const contactStrip =
    document.getElementById("contactStrip");

const searchInput =
    document.getElementById("messageSearch");

const clearSearch =
    document.getElementById("clearSearch");

const filterButtons =
    document.querySelectorAll(".filter-btn");


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
   STATE
========================================================= */

let currentConversation = null;

let currentFilter = "all";

let searchTerm = "";


/* =========================================================
   ALL CONVERSATIONS
========================================================= */

function getAllConversations() {

    return [
        ...conversations,
        ...archivedConversations
    ];

}


/* =========================================================
   SAVE
========================================================= */

function saveSentMessages() {

    localStorage.setItem(
        sentMessagesKey,
        JSON.stringify(sentMessages)
    );

}


/* =========================================================
   SVG ICONS
========================================================= */

const icons = {

    phone: `
        <svg viewBox="0 0 24 24">
            <path d="M6.6 3.5l3.1 3.1-2 2.4a15.5 15.5 0 0 0 7.3 7.3l2.4-2 3.1 3.1-1.8 2.2c-.6.8-1.7 1.1-2.6.7C9.8 17.9 6.1 14.2 3.7 7.9c-.4-.9-.1-2 .7-2.6z"/>
        </svg>
    `,

    video: `
        <svg viewBox="0 0 24 24">
            <rect x="3" y="6" width="13" height="12" rx="2"/>
            <path d="M16 10l5-3v10l-5-3z"/>
        </svg>
    `,

    plus: `
        <svg viewBox="0 0 24 24">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
        </svg>
    `,

    microphone: `
        <svg viewBox="0 0 24 24">
            <rect x="9" y="3" width="6" height="11" rx="3"/>
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0"/>
            <path d="M12 17.5V21"/>
            <path d="M8.5 21h7"/>
        </svg>
    `,

    send: `
        <svg viewBox="0 0 24 24">
            <path d="M4 4l16 8-16 8 3-8z"/>
            <path d="M7 12h13"/>
        </svg>
    `

};


/* =========================================================
   AVATAR
========================================================= */

function avatarHTML(conversation, mini = false) {

    /*
       Later you can give a conversation an image:

       avatarImage: "images/jacob.png"

       If there is no image, the initial remains.
    */

    if (conversation.avatarImage) {

        return `
            <img
                src="${conversation.avatarImage}"
                alt=""
            >
        `;

    }

    return `
        <span>
            ${conversation.avatar || "?"}
        </span>
    `;

}


/* =========================================================
   AVATAR CLASS
========================================================= */

function avatarClass(conversation) {

    if (
        conversation.id === "mom"
    ) {

        return "mom";

    }

    if (
        conversation.id === "dad"
    ) {

        return "dad";

    }

    if (
        conversation.type === "suspicious"
    ) {

        return "suspicious";

    }

    if (
        conversation.id === "unknown" ||
        conversation.avatar === "?"
    ) {

        return "unknown";

    }

    return "friend";

}


/* =========================================================
   UNREAD
=========================================================

   IMPORTANT:

   Nothing is shown unless unread > 0.

   Your existing conversations currently
   have no unread value, therefore they
   will NOT randomly display notification
   numbers.

   Example if you WANT one:

       unread: 2

   ========================================================= */

function getUnreadCount(conversation) {

    return Number(
        conversation.unread || 0
    );

}


/* =========================================================
   CONTACT STRIP
========================================================= */

function renderContactStrip() {

    contactStrip.innerHTML = "";

    /*
       These are simply the most relevant
       contacts shown at the top.
    */

    const contacts =
        conversations.slice(0, 5);


    contacts.forEach(
        conversation => {

            const button =
                document.createElement("button");

            button.className =
                "contact-shortcut";


            button.innerHTML = `

                <div
                    class="
                        contact-avatar
                        ${avatarClass(conversation)}
                    "
                >

                    ${avatarHTML(conversation)}

                </div>

                <span class="contact-name">
                    ${conversation.name}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    openConversation(
                        conversation.id
                    );

                }
            );


            contactStrip.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   FILTER
========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderMessageList();

            }
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();


        if (searchTerm.length > 0) {

            clearSearch.classList.remove(
                "hidden"
            );

        } else {

            clearSearch.classList.add(
                "hidden"
            );

        }


        renderMessageList();

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        searchTerm = "";

        clearSearch.classList.add(
            "hidden"
        );

        renderMessageList();

        searchInput.focus();

    }
);


/* =========================================================
   SHOULD SHOW
========================================================= */

function shouldShowConversation(
    conversation
) {

    /* SEARCH */

    if (searchTerm) {

        const nameMatch =
            conversation.name
                .toLowerCase()
                .includes(searchTerm);


        const previewMatch =
            conversation.preview
                .toLowerCase()
                .includes(searchTerm);


        if (
            !nameMatch &&
            !previewMatch
        ) {

            return false;

        }

    }


    /* UNREAD */

    if (
        currentFilter === "unread"
    ) {

        return (
            getUnreadCount(
                conversation
            ) > 0
        );

    }


    return true;

}


/* =========================================================
   RENDER MESSAGE LIST
========================================================= */

function renderMessageList() {

    currentConversation = null;

    messageList.innerHTML = "";


    const active =
        conversations.filter(
            shouldShowConversation
        );


    const archived =
        archivedConversations.filter(
            shouldShowConversation
        );


    /* =========================================
       ACTIVE
    ========================================= */

    active.forEach(
        conversation => {

            messageList.appendChild(
                createConversationItem(
                    conversation
                )
            );

        }
    );


    /* =========================================
       ARCHIVED
    ========================================= */

    if (
        archived.length > 0 &&
        currentFilter === "all" &&
        !searchTerm
    ) {

        const archiveTitle =
            document.createElement("div");

        archiveTitle.className =
            "archive-title";

        archiveTitle.textContent =
            "ARCHIVED";

        messageList.appendChild(
            archiveTitle
        );


        archived.forEach(
            conversation => {

                const item =
                    createConversationItem(
                        conversation
                    );

                item.classList.add(
                    "archived-conversation"
                );

                messageList.appendChild(
                    item
                );

            }
        );

    }


    /* =========================================
       EMPTY
    ========================================= */

    if (
        messageList.children.length === 0
    ) {

        messageList.innerHTML = `

            <div class="empty-messages">

                No conversations found.

            </div>

        `;

    }

}


/* =========================================================
   CREATE MESSAGE LIST ITEM
========================================================= */

function createConversationItem(
    conversation
) {

    const item =
        document.createElement("button");


    item.className =
        "message-list-item";


    const unread =
        getUnreadCount(
            conversation
        );


    if (unread > 0) {

        item.classList.add(
            "unread"
        );

    }


    item.innerHTML = `

        <div
            class="
                message-avatar
                ${avatarClass(conversation)}
            "
        >

            ${avatarHTML(conversation)}

        </div>


        <div class="message-info">

            <div class="message-top-line">

                <strong class="message-name">
                    ${conversation.name}
                </strong>


                <time class="message-time">
                    ${conversation.time}
                </time>

            </div>


            <span class="message-preview">

                ${conversation.preview}

            </span>

        </div>


        ${
            unread > 0
                ? `
                    <span class="unread-badge">
                        ${
                            unread > 99
                                ? "99+"
                                : unread
                        }
                    </span>
                  `
                : ""
        }

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


    if (!conversation) {

        return;

    }


    currentConversation =
        conversation;


    /*
       Opening the conversation means
       its unread indicator has been read.
    */

    conversation.unread = 0;


    renderConversation();

}


/* =========================================================
   RENDER CONVERSATION
========================================================= */

function renderConversation() {

    messageList.innerHTML = "";


    /* =========================================
       CHAT HEADER
    ========================================= */

    const header =
        document.createElement("header");

    header.className =
        "conversation-header";


    header.innerHTML = `

        <button
            class="conversation-back"
            id="conversationBack"
            aria-label="Back to messages"
        >

            <svg viewBox="0 0 24 24">
                <path d="M15 5L8 12L15 19"/>
            </svg>

        </button>


        <div class="chat-person">

            <div
                class="
                    chat-avatar
                    ${avatarClass(currentConversation)}
                "
            >

                ${avatarHTML(currentConversation)}

            </div>


            <div class="chat-person-text">

                <strong>
                    ${currentConversation.name}
                </strong>

                <small>
                    ${getConversationStatus()}
                </small>

            </div>

        </div>


        <button
            class="chat-action"
            aria-label="Call"
        >

            ${icons.phone}

        </button>


        <button
            class="chat-action"
            aria-label="Video"
        >

            ${icons.video}

        </button>

    `;


    messageList.appendChild(
        header
    );


    /* =========================================
       CHAT SCROLL
    ========================================= */

    const scroll =
        document.createElement("div");

    scroll.className =
        "chat-scroll";


    const divider =
        document.createElement("div");

    divider.className =
        "day-divider";

    divider.textContent =
        "Recent";

    scroll.appendChild(
        divider
    );


    /* =========================================
       ORIGINAL VICTIM MESSAGES
    ========================================= */

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


    /* =========================================
       INVESTIGATOR MESSAGES
    ========================================= */

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


    /* =========================================
       COMPOSER
    ========================================= */

    const composer =
        createComposer();


    messageList.appendChild(
        composer
    );


    /* =========================================
       BACK TO MESSAGE LIST
    ========================================= */

    document
        .getElementById(
            "conversationBack"
        )
        .addEventListener(
            "click",
            () => {

                /*
                   THIS DOES NOT LOCK THE PHONE.

                   It only returns to Messages.
                */

                renderMessageList();

            }
        );


    requestAnimationFrame(
        () => {

            scroll.scrollTop =
                scroll.scrollHeight;

        }
    );

}


/* =========================================================
   STATUS
========================================================= */

function getConversationStatus() {

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


    if (message.suspicious) {

        bubble.classList.add(
            "suspicious"
        );

    }


    if (message.html) {

        bubble.innerHTML =
            message.html;

    } else {

        bubble.textContent =
            message.text || "";

    }


    /* =========================================
       IMAGE
    ========================================= */

    if (
        message.attachmentType ===
        "image"
    ) {

        bubble.innerHTML = `

            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                "
            >

                ${icons.plus}

                <span>
                    ${escapeHTML(
                        message.name ||
                        "Image"
                    )}
                </span>

            </div>

        `;

    }


    /* =========================================
       AUDIO
    ========================================= */

    if (
        message.attachmentType ===
        "audio"
    ) {

        bubble.innerHTML = `

            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                "
            >

                ${icons.microphone}

                <span>
                    ${escapeHTML(
                        message.name ||
                        "Audio"
                    )}
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
            id="imageBtn"
            title="Attach"
        >

            ${icons.plus}

        </button>


        <input
            type="text"
            class="message-input"
            id="messageInput"
            placeholder="Message..."
            autocomplete="off"
        >


        <button
            class="tool-btn"
            id="audioBtn"
            title="Audio"
        >

            ${icons.microphone}

        </button>


        <button
            class="send-btn"
            id="sendBtn"
            aria-label="Send"
        >

            ${icons.send}

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


    /* =========================================
       TEXT
    ========================================= */

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


        if (!text) {

            return;

        }


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


    /* =========================================
       IMAGE
    ========================================= */

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


            if (!file) {

                return;

            }


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


    /* =========================================
       AUDIO
    ========================================= */

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


            if (!file) {

                return;

            }


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
========================================================= */

function addPlayerMessage(
    message
) {

    if (
        !currentConversation
    ) {

        return;

    }


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
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   MAIN BACK BUTTON
========================================================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            /*
               IMPORTANT:

               This is NOT the phone lock action.

               It simply leaves Messages.

               Your repair.html / phone-closing
               code should be responsible for locking.
            */

            window.location.href =
                "investigation.html";

        }
    );

}


/* =========================================================
   NEW MESSAGE
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

renderContactStrip();

renderMessageList();
