/* =========================================
   BROKEN PHONE
   GALLERY SYSTEM
========================================= */


/* =========================================
   SETTINGS
========================================= */

const GALLERY_KEY =
    "brokenGalleryUnlockedV2";

const PASSWORD =
    "2142";


/*
    Your PNG files.

    Keep these in the same folder as
    gallery.html unless you change the path.
*/

const allPhotos =
    Array.from(
        { length: 18 },
        (_, i) => `photo${i + 1}.png`
    );


/*
    You can later change these arrays
    to whatever photos belong to each
    album.
*/

const cameraPhotos = [
    "photo1.png",
    "photo2.png",
    "photo3.png",
    "photo4.png",
    "photo5.png",
    "photo6.png"
];


const videoPhotos = [
    "photo7.png",
    "photo8.png",
    "photo9.png"
];


const screenshotPhotos = [
    "photo10.png",
    "photo11.png",
    "photo12.png",
    "photo13.png"
];


const restoredPhotos = [
    "photo14.png",
    "photo15.png",
    "photo16.png"
];


const creativityPhotos = [
    "photo17.png",
    "photo18.png"
];


/* =========================================
   ALBUM DATA
========================================= */

const albums = [

    {
        name: "All photos",
        count: allPhotos.length,
        photos: allPhotos
    },

    {
        name: "Camera",
        count: cameraPhotos.length,
        photos: cameraPhotos
    },

    {
        name: "Videos",
        count: 0,
        photos: videoPhotos
    },

    {
        name: "Screenshots and screen recordings",
        count: screenshotPhotos.length,
        photos: screenshotPhotos
    },

    {
        name: "Restored",
        count: restoredPhotos.length,
        photos: restoredPhotos
    },

    {
        name: "Creativity",
        count: creativityPhotos.length,
        photos: creativityPhotos
    }

];


/* =========================================
   ELEMENTS
========================================= */

const galleryContent =
    document.getElementById("galleryContent");

const galleryHome =
    document.getElementById("galleryHome");

const albumView =
    document.getElementById("albumView");

const albumGrid =
    document.getElementById("albumGrid");

const albumTitle =
    document.getElementById("albumTitle");

const photoViewer =
    document.getElementById("photoViewer");

const fullPhoto =
    document.getElementById("fullPhoto");

const photoCounter =
    document.getElementById("photoCounter");

const galleryLock =
    document.getElementById("galleryLock");

const pinDisplay =
    document.getElementById("pinDisplay");

const pinError =
    document.getElementById("pinError");


let currentAlbum = null;

let currentPhotoIndex = 0;

let pin = "";


/* =========================================
   SHOW ALBUM HOME
========================================= */

function showHome() {

    galleryHome.style.display = "block";

    albumView.classList.add("hidden");

    photoViewer.classList.add("hidden");

    galleryLock.classList.add("hidden");

    renderAlbums();

}


/* =========================================
   ALBUM HOME
========================================= */

function renderAlbums() {

    galleryContent.innerHTML = "";


    const standardAlbums = albums.slice(0, 4);

    const customAlbums = albums.slice(4);


    /* ==============================
       STANDARD ALBUMS
    ============================== */

    const standardTitle =
        document.createElement("div");

    standardTitle.className =
        "gallery-section-title";

    standardTitle.textContent =
        "Albums";

    galleryContent.appendChild(
        standardTitle
    );


    const standardGrid =
        document.createElement("div");

    standardGrid.className =
        "album-cards";


    standardAlbums.forEach(album => {

        standardGrid.appendChild(
            createAlbumCard(album)
        );

    });


    galleryContent.appendChild(
        standardGrid
    );


    /* ==============================
       CUSTOM ALBUMS
    ============================== */

    const customTitle =
        document.createElement("div");

    customTitle.className =
        "gallery-section-title";

    customTitle.textContent =
        "My albums";

    galleryContent.appendChild(
        customTitle
    );


    const customGrid =
        document.createElement("div");

    customGrid.className =
        "album-cards";


    customAlbums.forEach(album => {

        customGrid.appendChild(
            createAlbumCard(album)
        );

    });


    galleryContent.appendChild(
        customGrid
    );

}


/* =========================================
   CREATE ALBUM CARD
========================================= */

function createAlbumCard(album) {

    const card =
        document.createElement("div");

    card.className =
        "album-card";


    let cover = "";


    if (album.photos.length > 0) {

        cover = `

            <div class="album-cover">

                <img
                    src="${album.photos[0]}"
                    alt="${album.name}"
                    onerror="
                        this.style.display='none';
                    "
                >

            </div>

        `;

    } else {

        cover = `

            <div class="album-cover empty">
                ▶
            </div>

        `;

    }


    card.innerHTML = `

        ${cover}

        <div class="album-name">
            ${album.name}
        </div>

        <div class="album-count">
            ${album.count}
        </div>

    `;


    card.onclick = () => {

        /*
            Videos can eventually have
            their own video viewer.
        */

        openAlbum(album);

    };


    return card;

}


/* =========================================
   OPEN ALBUM
========================================= */

function openAlbum(album) {

    currentAlbum = album;

    galleryHome.style.display =
        "none";

    albumView.classList.remove(
        "hidden"
    );

    albumTitle.textContent =
        album.name;


    albumGrid.innerHTML = "";


    album.photos.forEach(
        (photo, index) => {

            const tile =
                document.createElement("div");

            tile.className =
                "album-photo";


            tile.innerHTML = `

                <img
                    src="${photo}"
                    alt=""
                    draggable="false"
                    onerror="
                        this.style.opacity='0';
                    "
                >

            `;


            tile.onclick = () => {

                openPhoto(index);

            };


            albumGrid.appendChild(tile);

        }
    );

}


/* =========================================
   OPEN PHOTO
========================================= */

function openPhoto(index) {

    if (
        !currentAlbum ||
        !currentAlbum.photos.length
    ) {
        return;
    }


    currentPhotoIndex = index;


    albumView.classList.add(
        "hidden"
    );

    photoViewer.classList.remove(
        "hidden"
    );


    updatePhoto();

}


/* =========================================
   UPDATE PHOTO
========================================= */

function updatePhoto() {

    const photo =
        currentAlbum
            .photos[currentPhotoIndex];


    fullPhoto.style.opacity = "0";


    setTimeout(() => {

        fullPhoto.src = photo;

        fullPhoto.style.opacity = "1";

    }, 70);


    photoCounter.textContent =
        `${currentPhotoIndex + 1} / ${currentAlbum.photos.length}`;

}


/* =========================================
   NEXT PHOTO
========================================= */

function nextPhoto() {

    if (!currentAlbum) {
        return;
    }


    if (
        currentPhotoIndex <
        currentAlbum.photos.length - 1
    ) {

        currentPhotoIndex++;

        updatePhoto();

    }

}


/* =========================================
   PREVIOUS PHOTO
========================================= */

function previousPhoto() {

    if (!currentAlbum) {
        return;
    }


    if (currentPhotoIndex > 0) {

        currentPhotoIndex--;

        updatePhoto();

    }

}


/* =========================================
   SWIPE
========================================= */

let touchStartX = 0;

let touchStartY = 0;


const photoStage =
    document.getElementById("photoStage");


photoStage.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.screenX;

        touchStartY =
            touch.screenY;

    },
    {
        passive: true
    }
);


photoStage.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];

        const endX =
            touch.screenX;

        const endY =
            touch.screenY;


        const differenceX =
            endX - touchStartX;

        const differenceY =
            endY - touchStartY;


        /*
            Ignore mostly vertical
            movements.
        */

        if (
            Math.abs(differenceX) < 50 ||
            Math.abs(differenceX) <
            Math.abs(differenceY)
        ) {
            return;
        }


        if (differenceX < 0) {

            nextPhoto();

        } else {

            previousPhoto();

        }

    },
    {
        passive: true
    }
);


/* =========================================
   BACK FROM PHOTO
========================================= */

document
    .getElementById("viewerBack")
    .onclick = () => {

        photoViewer.classList.add(
            "hidden"
        );

        albumView.classList.remove(
            "hidden"
        );

    };


/* =========================================
   BACK FROM ALBUM
========================================= */

document
    .getElementById("albumBack")
    .onclick = () => {

        albumView.classList.add(
            "hidden"
        );

        galleryHome.style.display =
            "block";

    };


/* =========================================
   PHOTOS TAB
========================================= */

document
    .getElementById("photosTab")
    .onclick = () => {

        /*
            Photos = All Photos
        */

        const all =
            albums[0];

        openAlbum(all);

    };


/* =========================================
   ALBUMS TAB
========================================= */

document
    .getElementById("albumsTab")
    .onclick = () => {

        showHome();

    };


/* =========================================
   SEARCH BUTTON
========================================= */

document
    .getElementById("searchButton")
    .onclick = () => {

        /*
            Simple search can be added
            later without changing the
            album system.
        */

        alert(
            "Gallery search"
        );

    };


/* =========================================
   LOCK SCREEN
========================================= */

function openLock() {

    galleryHome.style.display =
        "none";

    albumView.classList.add(
        "hidden"
    );

    photoViewer.classList.add(
        "hidden"
    );

    galleryLock.classList.remove(
        "hidden"
    );

    pin = "";

    updatePinDisplay();

}


/* =========================================
   PIN DISPLAY
========================================= */

function updatePinDisplay() {

    const dots =
        pinDisplay.querySelectorAll(
            "span"
        );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "filled",
                index < pin.length
            );

        }
    );

}


/* =========================================
   PIN BUTTONS
========================================= */

document
    .querySelectorAll(
        ".pin-pad button[data-pin]"
    )
    .forEach(button => {

        button.onclick = () => {

            if (pin.length >= 4) {
                return;
            }


            pin +=
                button.dataset.pin;


            updatePinDisplay();


            if (pin.length === 4) {

                setTimeout(
                    checkPin,
                    150
                );

            }

        };

    });


/* =========================================
   DELETE PIN
========================================= */

document
    .getElementById("pinDelete")
    .onclick = () => {

        pin =
            pin.slice(
                0,
                -1
            );

        updatePinDisplay();

    };


/* =========================================
   CHECK PIN
========================================= */

function checkPin() {

    if (pin === PASSWORD) {

        localStorage.setItem(
            GALLERY_KEY,
            "true"
        );


        galleryLock.classList.add(
            "hidden"
        );


        showHome();

    } else {

        pinError.textContent =
            "Incorrect PIN";


        pin = "";


        updatePinDisplay();


        setTimeout(() => {

            pinError.textContent = "";

        }, 1200);

    }

}


/* =========================================
   LOCK BACK
========================================= */

document
    .getElementById("lockBack")
    .onclick = () => {

        galleryLock.classList.add(
            "hidden"
        );

        showHome();

    };


/* =========================================
   PHONE BACK
========================================= */

document
    .getElementById("searchButton");


/*
    IMPORTANT:

    This is the only place Gallery
    talks to the parent phone.

    It prevents Gallery from changing
    window.location and accidentally
    restarting your game.
*/

window.addEventListener(
    "message",
    event => {

        if (
            event.data?.type ===
            "GALLERY_OPEN"
        ) {

            initialiseGallery();

        }

    }
);


/* =========================================
   INITIALISE
========================================= */

function initialiseGallery() {

    /*
        Gallery remains inside the
        phone application.

        It does NOT use window.location.
    */

    if (
        localStorage.getItem(
            GALLERY_KEY
        ) === "true"
    ) {

        showHome();

    } else {

        openLock();

    }

}


/* =========================================
   START
========================================= */

initialiseGallery();
