/* =========================================
   PHONE — CALLS
========================================= */

const people = [
    {
        name: "John Doe",
        number: "+1 (334) 555-0193",
        initials: "JD",
        type: "Mobile",
        history: [
            "Sep 26 · 10:22 PM",
            "Sep 25 · 6:41 PM",
            "Sep 24 · 9:15 AM"
        ]
    },
       {
        name: "R",
        number: "+1 (212) 355-2174",
        initials: "SM",
        type: "Mobile",
        history: [
            "Sep 26 · 8:44 PM",
            "Sep 26 · 8:41 PM",
            "Sep 26 · 8:30 PM",
            "Sep 26 · 8:25 PM",
            "Sep 26 · 8:20 PM",
            "Sep 26 · 8:16 PM"
        ]
    },
    name: "unknown",
        number: "+1 (212) 665-2174",
        initials: "SM",
        type: "Mobile",
        history: [
            "Sep 26 · 7:44 PM",
            "Sep 26 · 7:41 PM",
            "Sep 26 · 7:30 PM",
            "Sep 26 · 7:25 PM",
            "Sep 26 · 7:20 PM",
            "Sep 26 · 7:16 PM"
        ]
    },


    {
        name: "Sarah Miller",
        number: "+1 (212) 555-0174",
        initials: "SM",
        type: "Mobile",
        history: [
            "Sep 25 · 8:44 PM",
            "Sep 23 · 2:15 PM"
        ]
    },

    {
        name: "Michael Reed",
        number: "+1 (917) 555-0131",
        initials: "MR",
        type: "Work",
        history: [
            "Sep 24 · 4:09 PM"
        ]
    },

    {
        name: "Natasha",
        number: "+1 (646) 555-0118",
        initials: "N",
        type: "Mobile",
        history: [
            "Sep 22 · 10:48 PM",
            "Sep 20 · 7:30 PM"
        ]
    },

    {
        name: "Daniel Carter",
        number: "+1 (202) 555-0182",
        initials: "DC",
        type: "Mobile",
        history: [
            "Sep 21 · 1:42 PM"
        ]
    }
];


const content = document.getElementById("callsContent");

const callsTab = document.getElementById("callsTab");
const contactsTab = document.getElementById("contactsTab");

const search = document.getElementById("callSearch");

const callScreen = document.getElementById("callScreen");

const callingAvatar = document.getElementById("callingAvatar");
const callingName = document.getElementById("callingName");
const callingNumber = document.getElementById("callingNumber");
const callingStatus = document.getElementById("callingStatus");


/* =========================================
   PARENT NAVIGATION
========================================= */

function goBack() {
    parent.postMessage(
        {
            type: "PHONE_BACK"
        },
        "*"
    );
}

window.addEventListener("message", event => {

    if (event.data?.type === "PHONE_SHOW_CALLS") {
        showCalls();
    }

});


/* =========================================
   CALL LIST
========================================= */

function showCalls() {

    callsTab.classList.add("active");
    contactsTab.classList.remove("active");

    search.style.display = "flex";
    search.placeholder = "Search contacts";

    content.innerHTML = `

        <div class="section-header">
            All calls
            <span class="section-arrow">⌃</span>
        </div>

        <div class="call-list">

            ${people.map((person, index) => {

                const missed = index % 3 === 1;

                return `

                    <div
                        class="call-row"
                        data-index="${index}"
                    >

                        <div class="avatar">
                            ${person.initials}
                        </div>

                        <div class="call-info">

                            <div class="call-name">
                                ${person.name}
                            </div>

                            <div class="call-number">
                                ${person.number}
                            </div>

                            <div class="call-type">
                                ${missed ? "Missed call" : "Outgoing call"}
                                &nbsp; · &nbsp;
                                ${person.history[0]}
                            </div>

                        </div>

                        <div class="call-right">

                            <div class="call-arrow">
                                ›
                            </div>

                        </div>

                    </div>

                `;

            }).join("")}

        </div>

    `;


    content.querySelectorAll(".call-row").forEach(row => {

        row.onclick = () => {

            const index = Number(row.dataset.index);

            showPerson(index);

        };

    });

}


/* =========================================
   PERSON DETAIL
========================================= */

function showPerson(index) {

    const person = people[index];

    search.style.display = "none";

    content.innerHTML = `

        <div class="contact-detail">

            <button
                class="detail-back"
                id="detailBack"
            >
                ‹
            </button>


            <div class="detail-avatar">
                ${person.initials}
            </div>


            <h1 class="detail-name">
                ${person.name}
            </h1>


            <div class="detail-number">
                ${person.number}
            </div>

            <div class="detail-type">
                ${person.type} · India
            </div>


            <div class="detail-actions">

                <button
                    class="detail-action"
                    id="detailCall"
                >

                    <span class="detail-action-icon detail-call">
                        ☎
                    </span>

                    <span>
                        Call
                    </span>

                </button>


                <button
                    class="detail-action"
                    id="detailMessage"
                >

                    <span class="detail-action-icon detail-message">
                        ▤
                    </span>

                    <span>
                        Message
                    </span>

                </button>

            </div>


            <div class="history-title">
                Call history
            </div>


            ${person.history.map((date, i) => `

                <div class="history-row">

                    <div class="history-main">

                        <div class="history-kind">
                            ${i === 1 ? "Missed call" : "Outgoing call"}
                        </div>

                        <div class="history-date">
                            ${date}
                        </div>

                    </div>

                    <div class="history-icon">
                        ${i === 1 ? "↙" : "↗"}
                    </div>

                </div>

            `).join("")}

        </div>

    `;


    document.getElementById("detailBack").onclick = showCalls;


    document.getElementById("detailCall").onclick = () => {

        startCall(person);

    };


    document.getElementById("detailMessage").onclick = () => {

        openMessages(person);

    };

}


/* =========================================
   CALL PERSON
========================================= */

function startCall(person) {

    callScreen.classList.remove("hidden");

    callingAvatar.textContent = person.initials;
    callingName.textContent = person.name;
    callingNumber.textContent = person.number;

    callingStatus.textContent = "DIALLING";


    /* Small delay to make it feel like a real phone */

    setTimeout(() => {

        if (!callScreen.classList.contains("hidden")) {

            callingStatus.textContent = "CALLING";

        }

    }, 1500);

}


/* =========================================
   END CALL
========================================= */

document.getElementById("endCall").onclick = () => {

    callScreen.classList.add("hidden");

    callingStatus.textContent = "DIALLING";

};


/* =========================================
   BACK FROM CALL SCREEN
========================================= */

document.getElementById("callBack").onclick = () => {

    callScreen.classList.add("hidden");

};


/* =========================================
   MESSAGE
========================================= */

function openMessages(person) {

    parent.postMessage(
        {
            type: "PHONE_OPEN_APP",
            app: "messages",

            contact: {
                name: person.name,
                number: person.number,
                initials: person.initials
            }
        },
        "*"
    );

}


/* =========================================
   SEARCH
========================================= */

search.addEventListener("input", () => {

    const query =
        search.value
            .trim()
            .toLowerCase();

    document
        .querySelectorAll(".call-row")
        .forEach(row => {

            const index =
                Number(row.dataset.index);

            const person =
                people[index];

            const matches =
                person.name
                    .toLowerCase()
                    .includes(query)

                ||

                person.number
                    .toLowerCase()
                    .includes(query);

            row.style.display =
                matches ? "flex" : "none";

        });

});


/* =========================================
   TOP BUTTONS
========================================= */

callsTab.onclick = showCalls;


/*
   Contacts is opened through the parent
   phone system so contacts.html remains
   its own page.
*/

contactsTab.onclick = () => {

    parent.postMessage(
        {
            type: "PHONE_OPEN_APP",
            app: "contacts"
        },
        "*"
    );

};


/* =========================================
   INITIAL
========================================= */

showCalls();
