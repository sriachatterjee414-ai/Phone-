/* =========================================================
   BROKEN PHONE
   VICTIM PHONE — MESSAGES
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const messageScreen =
    document.getElementById("messageScreen");

const chatScreen =
    document.getElementById("chatScreen");

const messageList =
    document.getElementById("messageList");

const contactStrip =
    document.getElementById("contactStrip");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const backBtn =
    document.getElementById("backBtn");

const chatBack =
    document.getElementById("chatBack");

const newBtn =
    document.getElementById("newBtn");

const chatMessages =
    document.getElementById("chatMessages");

const chatAvatar =
    document.getElementById("chatAvatar");

const chatName =
    document.getElementById("chatName");

const chatStatus =
    document.getElementById("chatStatus");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");


/* =========================================================
   PHONE HOME
   =========================================================

   IMPORTANT:
   Change ONLY this filename if your actual phone
   home-screen file has another name.

   It must NOT be investigation.html.
   ========================================================= */

const PHONE_HOME_FILE = "phone.html";


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
        localStorage.getItem(
            sentMessagesKey
        ) || "{}"
    );


/* =========================================================
   CONVERSATIONS
   ========================================================= */

const conversations = [

    {
        id: "mom",

        name: "Mom",

        preview:
            "Don't forget to eat something today.",

        time: "9:18 AM",

        avatar: "M",

        avatarClass: "avatar-mom",

        type: "normal",

        unread: false,

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


    {
        id: "dad",

        name: "Dad",

        preview:
            "Call me when you're free.",

        time: "8:42 AM",

        avatar: "D",

        avatarClass: "avatar-dad",

        type: "normal",

        unread: false,

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


    {
        id: "sophie",

        name: "Sophie",

        preview:
            "You cannot cancel on me again.",

        time: "Yesterday",

        avatar: "S",

        avatarClass: "avatar-sophie",

        type: "normal",

        unread: false,

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


    {
        id: "leo",

        name: "Leo",

        preview:
            "Did you finish that report?",

        time: "Yesterday",

        avatar: "L",

        avatarClass: "avatar-leo",

        type: "normal",

        unread: false,

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
       JACOB
    ===================================================== */

    {
        id: "jacob",

        name: "Jacob",

        preview:
            "Did you get it?",

        time: "Yesterday",

        avatar: "J",

        avatarClass: "avatar-jacob",

        type: "suspicious",

        unread: true,

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
       K1
    ===================================================== */

    {
        id: "k1",

        name: "K1",

        preview:
            "Don't lie to me.",

        time: "Yesterday",

        avatar: "K1",

        avatarClass: "avatar-k1",

        type: "suspicious",

        unread: true,

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
       Q
    ===================================================== */

    {
        id: "q",

        name: "Q",

        preview:
            "I told you not to ask questions.",

        time: "Yesterday",

        avatar: "Q",

        avatarClass: "avatar-q",

        type: "suspicious",

        unread: false,

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
       UNKNOWN
    ===================================================== */

    {
        id: "unknown",

        name: "Unknown",

        preview:
            "You shouldn't have that.",

        time: "Yesterday",

        avatar: "?",

        avatarClass: "avatar-unknown",

        type: "suspicious",

        unread: false,

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
       SARAH
    ===================================================== */

    {
        id: "sarah",

        name: "Sarah",

        preview:
            "Send me the picture 😂",

        time: "2 days ago",

        avatar: "S",

        avatarClass: "avatar-sarah",

        type: "normal",

        unread: false,

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
   ARCHIVED
   ========================================================= */

const archivedConversations = [

    {
        id: "archived_old_number",

        name: "Old Number",

        preview:
            "You promised.",

        time: "Last week",

        avatar: "?",

        avatarClass: "avatar-unknown",

        type: "archived",

        unread: false,

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

        avatarClass: "avatar-k1",

        type: "archived",

        unread: false,

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

let currentFilter = "all";


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
   AVATAR
   ========================================================= */

function createAvatar(
    conversation,
    small = false
) {

    const avatar =
        document.createElement("div");

    avatar.className =
        small
            ? "contact-avatar"
            : "list-avatar";

    avatar.classList.add(
        conversation.avatarClass
    );

    avatar.textContent =
        conversation.avatar;

    return avatar;

}


/* =========================================================
   CONTACT STRIP
   ========================================================= */

function renderContactStrip() {

    contactStrip.innerHTML = "";

    conversations
        .slice(0, 5)
        .forEach(conversation => {

            const person =
                document.createElement("div");

            person.className =
                "contact-person";


            const avatar =
                createAvatar(
                    conversation,
                    true
                );


            const name =
                document.createElement("span");

            name.textContent =
                conversation.name;


            person.appendChild(avatar);

            person.appendChild(name);


            person.addEventListener(
                "click",
                () => {

                    openConversation(
                        conversation.id
                    );

                }
            );


            contactStrip.appendChild(
                person
            );

        });

}


/* =========================================================
   MESSAGE LIST
   ========================================================= */

function renderMessageList() {

    messageList.innerHTML = "";


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    let active =
        conversations.filter(
            conversation => {

                const matchesSearch =
                    !search ||
                    conversation.name
                        .toLowerCase()
                        .includes(search) ||
                    conversation.preview
                        .toLowerCase()
                        .includes(search);


                const matchesFilter =
                    currentFilter === "all" ||
                    (
                        currentFilter === "unread" &&
                        conversation.unread
                    );


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    active.forEach(
        conversation => {

            messageList.appendChild(
                createConversationItem(
                    conversation
                )
            );

        }
    );


    if (
        search === "" &&
        currentFilter === "all"
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


        archivedConversations.forEach(
            conversation => {

                messageList.appendChild(
                    createConversationItem(
                        conversation
                    )
                );

            }
        );

    }


    if (
        messageList.children.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.style.padding =
            "40px 20px";

        empty.style.textAlign =
            "center";

        empty.style.color =
            "#999";

        empty.textContent =
            "No conversations found.";

        messageList.appendChild(
            empty
        );

    }

}


/* =========================================================
   CREATE LIST ITEM
   ========================================================= */

function createConversationItem(
    conversation
) {

    const item =
        document.createElement("button");

    item.className =
        "message-list-item";


    if (conversation.unread) {

        item.classList.add(
            "unread"
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


    item.appendChild(
        createAvatar(
            conversation
        )
    );


    const preview =
        document.createElement("div");

    preview.className =
        "message-preview";


    const name =
        document.createElement("span");

    name.className =
        "message-name";

    name.textContent =
        conversation.name;


    const text =
        document.createElement("span");

    text.className =
        "message-text";

    text.textContent =
        conversation.preview;


    preview.appendChild(name);

    preview.appendChild(text);


    item.appendChild(
        preview
    );


    const time =
        document.createElement("time");

    time.className =
        "list-time";

    time.textContent =
        conversation.time;


    item.appendChild(time);


    if (conversation.unread) {

        const dot =
            document.createElement("span");

        dot.className =
            "unread-dot";

        item.appendChild(dot);

    }


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
   OPEN CHAT
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


    conversation.unread =
        false;


    messageScreen.classList.add(
        "hidden"
    );

    chatScreen.classList.remove(
        "hidden"
    );


    renderConversation();

}


/* =========================================================
   RENDER CHAT
   ========================================================= */

function renderConversation() {

    if (!currentConversation) {

        return;

    }


    chatName.textContent =
        currentConversation.name;


    chatStatus.textContent =
        currentConversation.type ===
        "archived"
            ? "Archived"
            : "No response";


    chatAvatar.className =
        "chat-avatar " +
        currentConversation.avatarClass;


    chatAvatar.textContent =
        currentConversation.avatar;


    chatMessages.innerHTML = "";


    const divider =
        document.createElement("div");

    divider.className =
        "day-divider";

    divider.textContent =
        "Recent";

    chatMessages.appendChild(
        divider
    );


    currentConversation.messages
        .forEach(message => {

            chatMessages.appendChild(
                createMessageBubble(
                    message,
                    currentConversation
                )
            );

        });


    const customMessages =
        sentMessages[
            currentConversation.id
        ] || [];


    customMessages.forEach(message => {

        chatMessages.appendChild(
            createMessageBubble(
                message,
                currentConversation
            )
        );

    });


    requestAnimationFrame(
        () => {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }
    );

}


/* =========================================================
   MESSAGE BUBBLE
   ========================================================= */

function createMessageBubble(
    message,
    conversation
) {

    const row =
        document.createElement("div");

    row.className =
        "message-row";


    row.classList.add(
        message.sender === "me"
            ? "sent"
            : "received"
    );


    if (
        conversation.type ===
        "suspicious"
    ) {

        row.classList.add(
            "suspicious"
        );

    }


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


    row.appendChild(
        bubble
    );


    return row;

}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

function sendMessage() {

    if (!currentConversation) {

        return;

    }


    const text =
        messageInput.value.trim();


    if (!text) {

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
    ].push({

        sender: "me",

        text: text

    });


    localStorage.setItem(
        sentMessagesKey,
        JSON.stringify(
            sentMessages
        )
    );


    messageInput.value = "";


    renderConversation();

}


/* =========================================================
   SEND
   ========================================================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================================
   CHAT BACK
   =========================================================

   IMPORTANT:

   This ONLY closes the conversation.

   It does NOT leave the Messages app.
   ========================================================= */

chatBack.addEventListener(
    "click",
    () => {

        currentConversation =
            null;

        chatScreen.classList.add(
            "hidden"
        );

        messageScreen.classList.remove(
            "hidden"
        );

        renderMessageList();

    }
);


/* =========================================================
   PHONE HOME BACK
   =========================================================

   THIS is the only button that leaves Messages.

   It goes to the phone home.

   It does NOT go to investigation.html.
   ========================================================= */

backBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            PHONE_HOME_FILE;

    }
);


/* =========================================================
   NEW MESSAGE
   ========================================================= */

newBtn.addEventListener(
    "click",
    () => {

        /*
         * Victim phone is being examined
         * by the investigator.
         *
         * There is no reason to create
         * a new conversation.
         */

        newBtn.style.transform =
            "scale(0.9)";


        setTimeout(
            () => {

                newBtn.style.transform =
                    "";

            },
            120
        );

    }
);


/* =========================================================
   SEARCH
   ========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        clearSearch.style.display =
            searchInput.value
                ? "block"
                : "none";

        renderMessageList();

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        clearSearch.style.display =
            "none";

        renderMessageList();

        searchInput.focus();

    }
);


/* =========================================================
   FILTERS
   ========================================================= */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter"
                    )
                    .forEach(
                        other =>
                            other.classList
                                .remove(
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

    });


/* =========================================================
   INITIALIZE
   ========================================================= */

renderContactStrip();

renderMessageList();
