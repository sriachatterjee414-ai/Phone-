/* =========================================
   CONTACTS
========================================= */

const people = [
    {
        name: "John Doe",
        phone: "+1 (334) 555-0193",
        email: "john.doe@unknown.test",
        initials: "JD"
    },

    {
        name: "Sarah Miller",
        phone: "+1 (212) 555-0174",
        email: "sarah.miller@unknown.test",
        initials: "SM"
    },

    {
        name: "Michael Reed",
        phone: "+1 (917) 555-0131",
        email: "michael.reed@unknown.test",
        initials: "MR"
    },

    {
        name: "Natasha",
        phone: "+1 (646) 555-0118",
        email: "natasha@unknown.test",
        initials: "N"
    },

    {
        name: "Daniel Carter",
        phone: "+1 (202) 555-0182",
        email: "daniel.carter@unknown.test",
        initials: "DC"
    }
];


const content =
    document.getElementById("contactsContent");

const search =
    document.getElementById("contactSearch");


/* =========================================
   ALPHABET
========================================= */

const letters =
    "♥ABCDEFGHIJKLMNOPQRSTUVWXYZ#";

const alphabet =
    document.getElementById("alphabet");

alphabet.innerHTML =
    letters
        .split("")
        .map(letter =>
            `<span data-letter="${letter}">
                ${letter}
            </span>`
        )
        .join("");


/* =========================================
   LIST
========================================= */

function showContacts(filter = "") {

    const query =
        filter
            .trim()
            .toLowerCase();


    const filtered =
        people.filter(person =>
            person.name
                .toLowerCase()
                .includes(query)
            ||
            person.phone
                .toLowerCase()
                .includes(query)
        );


    content.innerHTML = `

        <div class="contact-section">
            All contacts
            <span>⌃</span>
        </div>

        <div class="contacts-list">

            ${filtered.map((person, index) => `

                <div
                    class="contact-row"
                    data-index="${people.indexOf(person)}"
                >

                    <div class="contact-avatar">
                        ${person.initials}
                    </div>

                    <div class="contact-info">

                        <div class="contact-name">
                            ${person.name}
                        </div>

                        <div class="contact-number">
                            ${person.phone}
                        </div>

                    </div>

                </div>

            `).join("")}

        </div>

    `;


    content
        .querySelectorAll(".contact-row")
        .forEach(row => {

            row.onclick = () => {

                const index =
                    Number(row.dataset.index);

                showPerson(index);

            };

        });

}


/* =========================================
   PERSON DETAILS
========================================= */

function showPerson(index) {

    const person = people[index];


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
                ${person.phone}
            </div>


            <div class="detail-email">
                ${person.email}
            </div>


            <div class="contact-actions">

                <button
                    class="contact-action"
                    id="callButton"
                >

                    <span class="action-circle green">
                        ☎
                    </span>

                    <span>
                        Call
                    </span>

                </button>


                <button
                    class="contact-action"
                    id="messageButton"
                >

                    <span class="action-circle blue">
                        ▤
                    </span>

                    <span>
                        Message
                    </span>

                </button>

            </div>

        </div>

    `;


    document
        .getElementById("detailBack")
        .onclick = () => showContacts(search.value);


    /* PHONE */

    document
        .getElementById("callButton")
        .onclick = () => {

            parent.postMessage(
                {
                    type: "PHONE_START_CALL",

                    contact: {
                        name: person.name,
                        number: person.phone,
                        initials: person.initials
                    }
                },
                "*"
            );

        };


    /* MESSAGES */

    document
        .getElementById("messageButton")
        .onclick = () => {

            parent.postMessage(
                {
                    type: "PHONE_OPEN_APP",

                    app: "messages",

                    contact: {
                        name: person.name,
                        number: person.phone,
                        initials: person.initials
                    }
                },
                "*"
            );

        };

}


/* =========================================
   SEARCH
========================================= */

search.addEventListener(
    "input",
    () => {

        showContacts(search.value);

    }
);


/* =========================================
   CALLS BUTTON
========================================= */

document
    .getElementById("callsButton")
    .onclick = () => {

        parent.postMessage(
            {
                type: "PHONE_OPEN_APP",
                app: "calls"
            },
            "*"
        );

    };


/* =========================================
   IMPORT BAR
========================================= */

document
    .querySelector(".import-bar button")
    .onclick = function () {

        this.parentElement.style.display = "none";

    };


/* =========================================
   ALPHABET CLICK
========================================= */

alphabet
    .querySelectorAll("span")
    .forEach(letter => {

        letter.onclick = () => {

            const selected =
                letter.dataset.letter.toLowerCase();

            if (
                selected === "♥" ||
                selected === "#"
            ) {
                return;
            }


            const person =
                people.find(p =>
                    p.name
                        .toLowerCase()
                        .startsWith(selected)
                );


            if (person) {

                showPerson(
                    people.indexOf(person)
                );

            }

        };

    });


/* =========================================
   INITIAL
========================================= */

showContacts();
