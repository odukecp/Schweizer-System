/*  ____           _                         _   _                           ____                  _                       */
/* / ___|    ___  | |__   __      __   ___  (_) | |_   ____   ___   _ __    / ___|   _   _   ___  | |_    ___   _ __ ___   */
/* \___ \   / __| | '_ \  \ \ /\ / /  / _ \ | | | __| |_  /  / _ \ | '__|   \___ \  | | | | / __| | __|  / _ \ | '_ ` _ \  */
/*  ___) | | (__  | | | |  \ V  V /  |  __/ | | | |_   / /  |  __/ | |       ___) | | |_| | \__ \ | |_  |  __/ | | | | | | */
/* |____/   \___| |_| |_|   \_/\_/    \___| |_|  \__| /___|  \___| |_|      |____/   \__, | |___/  \__|  \___| |_| |_| |_| */
/*                                                                                   |___/                                 */

API = "http://localhost:3000/api/";



// ------------------------------------------------
// ---------- html element-generation -------------
// ------------------------------------------------


async function htmlSetup() {
    const contentDiv = document.getElementById("content");
    contentDiv.className = "content";

    // header
    const headerWrap = document.createElement("div");
    headerWrap.className = "wrap header"
    const header = document.createElement("h1");
    header.innerHTML = "Schweizer System Turnier-Managment";
    headerWrap.appendChild(header);


    // setup

    const setupWrap = document.createElement("div");
    setupWrap.className = "setup";

    //setup.addPlayer
    const addPlayerWrap = document.createElement("div");
    addPlayerWrap.className = "wrap";
    
    const addPlayerAccordion = document.createElement("div");
    addPlayerAccordion.className = "accordion";

    const addPlayerTitle = document.createElement("h2");
    addPlayerTitle.innerHTML = "Spieler hinzufügen"
    addPlayerAccordion.appendChild(addPlayerTitle);
    addPlayerWrap.appendChild(addPlayerAccordion);


    const addPlayerPanel = document.createElement("div");
    addPlayerPanel.className = "panel";

    const playerInput = document.createElement("form");
    playerInput.addEventListener("submit", async (e) => {
        try {
        await addPlayer();
        log("Player added successfully");
        } catch (err) {
        log("Error: " + err.message);
        }
    });

    inputFields = [
        ["firstName", "Vorname"],
        ["lastName", "Nachname"],
        ["rating", "DWZ"], 
        ["club", "Verein"]
    ]

    const playerInputWrapper = document.createElement("div");
    playerInputWrapper.className = "row";

    inputFields.forEach(inputField => {
        const playerInputColoumn = document.createElement("div");
        playerInputColoumn.className = "coloumn";
        const playerInputFieldLabel = document.createElement("label");
        playerInputFieldLabel.htmlFor = `input_${inputField[0]}`;
        playerInputFieldLabel.innerHTML = `${inputField[1]}:`
        playerInputColoumn.appendChild(playerInputFieldLabel);

        playerInputColoumn.appendChild(document.createElement("br"));

        const playerInputField = document.createElement("input");
        playerInputField.id = `input_${inputField[0]}`;
        playerInputField.placeholder = inputField[1];
        playerInputField.type = "text";
        if (inputField[0] == "rating") {playerInputField.value = "800"};
        playerInputColoumn.appendChild(playerInputField);
        playerInputWrapper.appendChild(playerInputColoumn);
    });

    playerInput.appendChild(playerInputWrapper);
    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Hinzufügen";
    playerInput.appendChild(submitButton);
    addPlayerPanel.appendChild(playerInput);
    addPlayerWrap.appendChild(addPlayerPanel);
    setupWrap.appendChild(addPlayerWrap);


    // setup.playerTable
    const playerTableAccordion = document.createElement("div");
    playerTableAccordion.className = "accordion"; 

    const playerTableWrap = document.createElement("div");
    playerTableWrap.className = "wrap";

    const playerTableTitle = document.createElement("h2");
    playerTableTitle.innerHTML = "Spieler-Liste";
    playerTableAccordion.appendChild(playerTableTitle);



    const playerTablePanel = document.createElement("div");
    playerTablePanel.className = "panel";
    const playerTable = document.createElement("table");
    const tableHead = document.createElement("thead");

    inputFields.forEach(inputField => {
        const tableColoumnHead = document.createElement("td");
        tableColoumnHead.innerHTML = inputField[1];
        tableHead.appendChild(tableColoumnHead);
    })
    const emptyCell = document.createElement("td");
    tableHead.appendChild(emptyCell);
    playerTable.appendChild(tableHead);


    const players = await loadPlayers();
    const playerTableBody = document.createElement("tbody");

    players.forEach(player => {
        const tableRow = document.createElement("tr");
        const playerFirstName = document.createElement("td");
        const playerLastName = document.createElement("td");
        const playerRating = document.createElement("td");
        const playerClub = document.createElement("td");

        const playerDeleteButtonCell = document.createElement("td");
        const playerDeleteButton = document.createElement("button");
        playerDeleteButton.dataset.id = player.id;
        playerDeleteButton.className = "delete-btn";
        playerDeleteButton.innerHTML = "🗑";
        playerDeleteButtonCell.appendChild(playerDeleteButton);

        playerFirstName.innerHTML = player.firstName;
        playerLastName.innerHTML = player.lastName;
        playerRating.innerHTML = player.rating;
        playerClub.innerHTML = player.club;

        tableRow.appendChild(playerFirstName);
        tableRow.appendChild(playerLastName);
        tableRow.appendChild(playerRating);
        tableRow.appendChild(playerClub);
        tableRow.appendChild(playerDeleteButtonCell);

        playerTableBody.appendChild(tableRow);
    })
    playerTable.appendChild(playerTableBody);

    playerTable.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-btn")) return;
        const idToDelete = e.target.dataset.id;

        createPopup (
            "Spieler/in Löschen",
            "Möchten Sie diese/n Spieler/in wirklich löschen, diese Aktion kann nicht rückgängig gemacht werden.",
            () => {
                deletePlayer(idToDelete);
                
            }
        );
    })

    playerTablePanel.appendChild(playerTable);
    
    playerTableWrap.appendChild(playerTableAccordion);
    playerTableWrap.appendChild(playerTablePanel);
    setupWrap.appendChild(playerTableWrap);



    contentDiv.appendChild(document.createComment("header-div"));
    contentDiv.appendChild(headerWrap);

    contentDiv.appendChild(document.createComment("setup-div"));
    contentDiv.appendChild(setupWrap);

    setupAccordions();
}

htmlSetup();






// ------------------------------------------------
// ----------------- functions --------------------
// ------------------------------------------------



function createPopup (title, message, onConfirm) {
    const popupDiv = document.createElement("div");
    popupDiv.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";

    const popupTitle = document.createElement("h2");
    popupTitle.innerHTML = title;
    popupContent.appendChild(popupTitle);

    const popupMessage = document.createElement("p");
    popupMessage.innerHTML = message;
    popupContent.appendChild(popupMessage);

    const popupButtons = document.createElement("div");

    const popupCancel = document.createElement("button");
    popupCancel.innerHTML = "Abbruch";
    popupCancel.className = "cancel";
    popupCancel.addEventListener("click", () => {
        document.body.removeChild(popupDiv);
    });
    popupButtons.appendChild(popupCancel);

    const popupConfirm = document. createElement("button");
    popupConfirm.innerHTML = "Bestätigen";
    popupConfirm.className = "confirm";
    popupConfirm.addEventListener("click", () => {
        document.body.removeChild(popupDiv);
        onConfirm();
    });
    popupButtons.appendChild(popupConfirm);

    popupContent.appendChild(popupButtons);
    popupDiv.appendChild(popupContent);
    document.body.appendChild(popupDiv);
}

function setupAccordions () {
    const accordions = document.getElementsByClassName("accordion");
    // console.log(accordions);
    
    for (let i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", () => {
            // console.log(accordions[i]);
            accordions[i].classList.toggle("active");
            const panel = accordions[i].nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}

async function addPlayer() {
    const input_firstName = document.getElementById("input_firstName").value;
    const input_lastName = document.getElementById("input_lastName").value;
    const input_rating = parseFloat(document.getElementById("input_rating").value);
    const input_club = document.getElementById("input_club").value;

    const res = await fetch(`${API}add-player?firstName=${input_firstName}&lastName=${input_lastName}&rating=${input_rating}&club=${input_club}`, {
        method: "POST",
    });
    console.log(`fetched ${API}add-player?firstName=${input_firstName}&lastName=${input_lastName}&rating=${input_rating}&club=${input_club}`)

    if (!res.ok) {
        const error = await res.json();
        alert(error.error);
        return;
    }

    const data = await res.json();
    console.log(data.message);
    loadPlayers();
}

async function addRound(roundIndex) {
    const res = await fetch(`${API}create-round?index=${roundIndex}`, {
        method: "POST",
    });

    const data = await res.json();
    console.log(data);
}

async function loadPlayers() {
    const res = await fetch(`${API}players`);

    if (!res.ok) {
        const text = await res.text();
        alert(text);
        throw new Error(text);
    }

    return res.json();
}

async function deletePlayer(idToDelete) {
    const res = await fetch(`${API}delete-player?id=${idToDelete}`, {
            method: "DELETE"
        });

    if (!res.ok) {
        const text = await res.text();
        alert(text);
        throw new Error(text);
    }
}