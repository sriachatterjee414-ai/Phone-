/* =========================================
   VICTIM INFORMATION SYSTEM
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const CASE_STAGE_KEY =
    "brokenPhoneCaseStage";


const PHONE_RETURN_KEY =
    "victimInfoReturnPage";



/* =========================================
   CASE STAGES
========================================= */

/*
    0 = Unknown

    1 = Person of Interest

    2 = Primary Suspect

    3 = Killer

    We can change this later from
    investigation.html or another
    part of the game.
*/

const CASE_STAGES = {

    0: {

        status:
            "UNKNOWN",

        name:
            "Unknown",

        age:
            "Unknown",

        connection:
            "Unknown",

        description:
            "No identified suspect",

        caseStatus:
            "ACTIVE INVESTIGATION"

    },


    1: {

        status:
            "PERSON OF INTEREST",

        name:
            "Unknown",

        age:
            "Unknown",

        connection:
            "Connected to victim",

        description:
            "Person of interest identified",

        caseStatus:
            "ACTIVE INVESTIGATION"

    },


    2: {

        status:
            "PRIMARY SUSPECT",

        name:
            "Unknown",

        age:
            "Unknown",

        connection:
            "Direct connection to victim",

        description:
            "Primary suspect identified",

        caseStatus:
            "SUSPECT IDENTIFIED"

    },


    3: {

        status:
            "KILLER",

        name:
            "Unknown",

        age:
            "Unknown",

        connection:
            "Responsible for victim's death",

        description:
            "Killer identified",

        caseStatus:
            "CASE SOLVED"

    }

};



/* =========================================
   ELEMENTS
========================================= */

const caseStatus =
    document.getElementById(
        "caseStatus"
    );


const caseTypeStatus =
    document.getElementById(
        "caseTypeStatus"
    );


const suspectStatus =
    document.getElementById(
        "suspectStatus"
    );


const suspectName =
    document.getElementById(
        "suspectName"
    );


const suspectAge =
    document.getElementById(
        "suspectAge"
    );


const suspectConnection =
    document.getElementById(
        "suspectConnection"
    );


const suspectCard =
    document.getElementById(
        "suspectCard"
    );


const showBirthdayButton =
    document.getElementById(
        "showBirthdayButton"
    );


const birthdayFile =
    document.getElementById(
        "birthdayFile"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const caseTab =
    document.getElementById(
        "caseTab"
    );



/* =========================================
   BIRTHDAY FILE
========================================= */

let birthdayFileShown = false;



showBirthdayButton.addEventListener(
    "click",
    function(){

        birthdayFileShown = true;


        birthdayFile.classList.remove(
            "hidden"
        );


        showBirthdayButton.textContent =
            "BIRTHDAY FILE OPEN";


        showBirthdayButton.disabled =
            true;

    }
);



/* =========================================
   GET CASE STAGE
========================================= */

function getCaseStage(){

    const saved =
        parseInt(
            localStorage.getItem(
                CASE_STAGE_KEY
            ),
            10
        );


    if(
        Number.isNaN(saved)
    ){

        return 0;

    }


    if(
        saved < 0 ||
        saved > 3
    ){

        return 0;

    }


    return saved;

}



/* =========================================
   UPDATE SUSPECT
========================================= */

function updateSuspectInformation(){

    const stage =
        getCaseStage();


    const data =
        CASE_STAGES[stage];



    caseStatus.textContent =
        data.caseStatus;


    caseTypeStatus.textContent =
        stage === 3
            ? "SOLVED"
            : "ACTIVE";



    suspectStatus.textContent =
        data.status;


    suspectName.textContent =
        data.name;


    suspectAge.textContent =
        data.age;


    suspectConnection.textContent =
        data.connection;


    suspectStatus.title =
        data.description;



    if(stage === 0){

        suspectCard.classList.remove(
            "identified"
        );

    }

    else{

        suspectCard.classList.add(
            "identified"
        );

    }

}



/* =========================================
   CHANGE CASE STAGE
========================================= */

/*
    Other files can call:

    setCaseStage(1)

    or

    setCaseStage(2)

    or

    setCaseStage(3)

    when the investigation progresses.
*/

function setCaseStage(stage){

    if(
        stage < 0 ||
        stage > 3
    ){

        return;

    }


    localStorage.setItem(
        CASE_STAGE_KEY,
        String(stage)
    );


    updateSuspectInformation();

}



/* =========================================
   BACK BUTTON
========================================= */

function returnToPreviousPage(){

    const returnPage =
        localStorage.getItem(
            PHONE_RETURN_KEY
        );


    if(returnPage){

        localStorage.removeItem(
            PHONE_RETURN_KEY
        );


        window.location.href =
            returnPage;

        return;

    }


    /*
       Fallback if victim information
       was opened directly.
    */

    window.location.href =
        "phone.html";

}



backButton.addEventListener(
    "click",
    returnToPreviousPage
);



/* =========================================
   PERMANENT CASE TAB
========================================= */

caseTab.addEventListener(
    "click",
    function(){

        /*
           Already on Victim Info,
           so simply scroll to top.
        */

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }
);



/* =========================================
   INITIALIZE
========================================= */

updateSuspectInformation();
