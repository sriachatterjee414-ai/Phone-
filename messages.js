/* =====================================================
   MESSAGES
===================================================== */


const conversations = {

    unknown: {

        name: "Unknown Number",

        messages: [

            {
                type: "them",
                text:
                    "Are you still coming tonight?",
                time: "2:31 PM"
            },

            {
                type: "me",
                text:
                    "I don't know yet.",
                time: "2:34 PM"
            },

            {
                type: "them",
                text:
                    "You need to decide.",
                time: "2:35 PM"
            },

            {
                type: "them",
                text:
                    "And don't tell anyone about this.",
                time: "2:36 PM"
            }

        ]

    },


    emma: {

        name: "Emma",

        messages: [

            {
                type: "them",
                text: "Hehe",
                time: "9:54 AM"
            },

            {
                type: "me",
                text: "What?",
                time: "9:55 AM"
            },

            {
                type: "them",
                text:
                    "Nothing 😂",
                time: "9:55 AM"
            },

            {
                type: "them",
                text:
                    "You seemed really nervous yesterday.",
                time: "9:56 AM"
            }

        ]

    },


    code: {

        name: "52927",

        messages: [

            {
                type: "them",
                text:
                    "Don't forget what we discussed.",
                time: "9:47 AM"
            },

            {
                type: "me",
                text:
                    "I haven't forgotten.",
                time: "9:48 AM"
            },

            {
                type: "them",
                text:
                    "Good.",
                time: "9:48 AM"
            }

        ]

    },


    /*
        IMPORTANT STORY CLUE:

        Evelyn reveals the gallery password here.

        Password = bluebird
    */

    evelyn: {

        name: "Evelyn",

        messages: [

            {
                type: "them",
                text:
                    "Aaa, I think someone was following me.",
                time: "Yesterday"
            },

            {
                type: "me",
                text:
                    "What happened?",
                time: "Yesterday"
            },

            {
                type: "them",
                text:
                    "Can we talk somewhere private?",
                time: "Yesterday"
            },

            {
                type: "me",
                text:
                    "Of course.",
                time: "Yesterday"
            },

            {
                type: "them",
                text:
                    "And if you ever look through my gallery, don't forget the word I use for that thing.",
                time: "Yesterday"
            },

            {
                type: "me",
                text:
                    "What word?",
                time: "Yesterday"
            },

            {
                type: "them",
                text:
                    "Bluebird. You know exactly what I mean.",
                time: "Yesterday"
            }

        ]

    },


    jenzia: {

        name: "Jenzia",

        messages: [

            {
                type: "them",
                text:
                    "We need to talk.",
                time: "Yesterday"
            },

            {
                type: "me",
                text:
                    "About what?",
                time: "Yesterday"
            },

            {
                type: "them",
                text:
                    "About what you saw.",
                time: "Yesterday"
            }

        ]

    },


    mom: {

        name: "Mom",

        messages: [

            {
                type: "them",
                text:
                    "Call me when you get home.",
                time: "Tuesday"
            },

            {
                type: "me",
                text:
                    "I will.",
                time: "Tuesday"
            }

        ]

    }

};


/* =====================================================
   OPEN CHAT
===================================================== */

function openChat(id) {

    window.location.href =
        "chat.html?chat=" +
        encodeURIComponent(id);

}


/* =====================================================
   BACK
===================================================== */

function goBack() {

    window.location.href =
        "../phone.html";

}
