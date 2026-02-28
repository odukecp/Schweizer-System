/*  _____            _              _____   _                         */
/* |  __ \          | |            / ____| | |                        */
/* | |  | |  _   _  | | __   ___  | |      | |__     ___   ___   ___  */
/* | |  | | | | | | | |/ /  / _ \ | |      | '_ \   / _ \ / __| / __| */
/* | |__| | | |_| | |   <  |  __/ | |____  | | | | |  __/ \__ \ \__ \ */
/* |_____/   \__,_| |_|\_\  \___|  \_____| |_| |_|  \___| |___/ |___/ */

API = 'http://localhost:3000/api/';

// ------------------------------------------------
// ---------- html element-generation -------------
// ------------------------------------------------

function htmlSetupHeader() {
    const headerWrap = document.createElement('div');
    headerWrap.className = 'wrap header';

    const header = document.createElement('h1');
    header.innerHTML = 'Duke-Chess Turnier-Managment';
    headerWrap.appendChild(header);

    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';

    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = 'assets/DukeChessLogo_v2_tsp.png';
    logo.alt = 'Duke-Chess Logo';

    logoContainer.appendChild(logo);
    headerWrap.appendChild(logoContainer);
    return headerWrap;
}

async function htmlSetupSetup() {
    const setupWrap = document.createElement('div');
    setupWrap.className = 'setup';
    if (
        localStorage.getItem('websiteState') === 'setup' ||
        localStorage.getItem('websiteState') === ''
    ) {
        setupWrap.style.display = 'block';
    } else {
        setupWrap.style.display = 'none';
    }

    //setup.addPlayer.Input
    const addPlayerWrap = document.createElement('div');
    addPlayerWrap.className = 'wrap';

    const addPlayerAccordion = document.createElement('div');
    addPlayerAccordion.className = 'accordion';

    const addPlayerTitle = document.createElement('h2');
    addPlayerTitle.innerHTML = 'Spieler hinzufügen';
    addPlayerAccordion.appendChild(addPlayerTitle);
    addPlayerWrap.appendChild(addPlayerAccordion);

    const addPlayerPanel = document.createElement('div');
    addPlayerPanel.className = 'panel';

    const playerInput = document.createElement('form');
    playerInput.addEventListener('submit', async (e) => {
        try {
            await addPlayerFromInput();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });

    inputFields = [
        ['firstName', 'Vorname'],
        ['lastName', 'Nachname'],
        ['rating', 'DWZ'],
        ['club', 'Verein'],
    ];

    const playerInputWrapper = document.createElement('div');
    playerInputWrapper.className = 'row';

    inputFields.forEach((inputField) => {
        const playerInputColoumn = document.createElement('div');
        playerInputColoumn.className = 'coloumn';
        const playerInputFieldLabel = document.createElement('label');
        playerInputFieldLabel.htmlFor = `input_${inputField[0]}`;
        playerInputFieldLabel.innerHTML = `${inputField[1]}:`;
        playerInputColoumn.appendChild(playerInputFieldLabel);

        playerInputColoumn.appendChild(document.createElement('br'));

        const playerInputField = document.createElement('input');
        playerInputField.id = `input_${inputField[0]}`;
        playerInputField.placeholder = inputField[1];
        playerInputField.type = 'text';
        playerInputColoumn.appendChild(playerInputField);
        playerInputWrapper.appendChild(playerInputColoumn);
    });

    playerInput.appendChild(playerInputWrapper);
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Hinzufügen';
    playerInput.appendChild(submitButton);
    addPlayerPanel.appendChild(playerInput);

    //setup.addPlayer.File

    const addPlayersViaFile = document.createElement('div');

    const addPlayersViaFileAccordion = document.createElement('div');
    addPlayersViaFileAccordion.className = 'accordion small';

    const addPlayersViaFileHeader = document.createElement('h4');
    addPlayersViaFileHeader.innerHTML = 'Spieler importieren';

    addPlayersViaFileAccordion.appendChild(addPlayersViaFileHeader);
    addPlayersViaFile.appendChild(addPlayersViaFileAccordion);

    const addPlayersViaFilePanel = document.createElement('div');
    addPlayersViaFilePanel.className = 'panel';

    const addPlayersViaFileForm = document.createElement('form');
    const addPlayersViaFileInput = document.createElement('input');
    addPlayersViaFileInput.type = 'file';
    addPlayersViaFileInput.accept = '.csv';
    addPlayersViaFileInput.enctype = 'multipart/form-data';
    addPlayersViaFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const players = results.data;
                console.log('Parsed players:', players);
                addPlayersFromFile(players);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV. Please check your file format.');
            },
        });
    });
    addPlayersViaFileForm.appendChild(addPlayersViaFileInput);
    addPlayersViaFilePanel.appendChild(addPlayersViaFileForm);

    addPlayersViaFile.appendChild(addPlayersViaFilePanel);

    addPlayerPanel.appendChild(addPlayersViaFile);

    addPlayerWrap.appendChild(addPlayerPanel);
    setupWrap.appendChild(addPlayerWrap);

    // setup.playerTable
    const playerTableAccordion = document.createElement('div');
    playerTableAccordion.className = 'accordion';

    const playerTableWrap = document.createElement('div');
    playerTableWrap.className = 'wrap';

    const playerTableTitle = document.createElement('h2');
    playerTableTitle.innerHTML = 'Spieler-Liste';
    playerTableAccordion.appendChild(playerTableTitle);

    const playerTablePanel = document.createElement('div');
    playerTablePanel.className = 'panel';
    const playerTable = document.createElement('table');
    const tableHead = document.createElement('thead');

    inputFields.forEach((inputField) => {
        const tableColoumnHead = document.createElement('td');
        tableColoumnHead.innerHTML = inputField[1];
        tableHead.appendChild(tableColoumnHead);
    });
    const emptyCell = document.createElement('td');
    tableHead.appendChild(emptyCell);
    playerTable.appendChild(tableHead);

    const players = await loadPlayers();
    const playerTableBody = document.createElement('tbody');

    players.forEach((player) => {
        const tableRow = document.createElement('tr');
        const playerFirstName = document.createElement('td');
        const playerLastName = document.createElement('td');
        const playerRating = document.createElement('td');
        const playerClub = document.createElement('td');

        const playerDeleteButtonCell = document.createElement('td');
        const playerDeleteButton = document.createElement('button');
        playerDeleteButton.dataset.id = player.id;
        playerDeleteButton.className = 'delete-btn';
        playerDeleteButton.innerHTML = '🗑';
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
    });
    playerTable.appendChild(playerTableBody);

    playerTable.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn')) return;
        const idToDelete = e.target.dataset.id;

        createPopup(
            'Spieler/in Löschen',
            'Möchten Sie diese/n Spieler/in wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
            () => {
                deletePlayer(idToDelete);
            },
        );
    });

    playerTablePanel.appendChild(playerTable);

    const deleteAllPlayersButton = document.createElement('button');
    deleteAllPlayersButton.innerHTML = 'Alle Spieler löschen';
    deleteAllPlayersButton.addEventListener('click', () => {
        createPopup(
            'Alle Spieler Löschen',
            'Möchten Sie wirkliche alle Spieler/innen löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
            () => {
                deleteAllPlayers();
            },
        );
    });

    playerTablePanel.appendChild(deleteAllPlayersButton);

    playerTableWrap.appendChild(playerTableAccordion);
    playerTableWrap.appendChild(playerTablePanel);
    setupWrap.appendChild(playerTableWrap);

    const startTournamentWrap = document.createElement('div');
    startTournamentWrap.className = 'wrap center';
    const startTournamentButton = document.createElement('button');
    startTournamentButton.innerHTML = 'Turnier starten';
    startTournamentButton.addEventListener('click', () => {
        createPopup(
            'Turnier starten',
            'Möchten Sie wirklich das Turnier starten? In der aktuellen Version können nach dem Start keine Änderungen mehr an den Teilnehmern getätigt werden.',
            () => {
                startTournament();
            },
        );
    });
    startTournamentWrap.appendChild(startTournamentButton);

    setupWrap.appendChild(startTournamentWrap);

    return setupWrap;
}

async function htmlSetupTournament() {
    try {
        const tournamentWrap = document.createElement('div');
        tournamentWrap.className = 'tournament';
        if (localStorage.getItem('websiteState') === 'tournament') {
            tournamentWrap.style.display = 'block';
        } else {
            tournamentWrap.style.display = 'none';
            return tournamentWrap;
        }

        const players = await loadPlayers();
        if ((await players.length) === 0) return tournamentWrap;
        const pairings = await loadPairings();
        if ((await pairings.length) === 0) return tournamentWrap;
        const roundsRaw = await countRounds();
        const rounds = roundsRaw[0]['COUNT(DISTINCT round)'];

        const ids = [];
        players.forEach((player) => {
            ids.push(player.id);
        });

        const pairingTableColoumns = ['Brett Nr.', 'Weiß', '', 'Ergebnis', 'Schwarz', ''];

        for (let i = 1; i <= rounds; i++) {
            const pairingTableWrap = document.createElement('div');
            pairingTableWrap.className = 'wrap';

            const pairingTableAccordion = document.createElement('div');
            pairingTableAccordion.className = 'accordion';

            const pairingTableHeader = document.createElement('h2');
            pairingTableHeader.innerHTML = `Runde ${i}`;
            pairingTableAccordion.appendChild(pairingTableHeader);
            pairingTableWrap.appendChild(pairingTableAccordion);

            const pairingTablePanel = document.createElement('div');
            pairingTablePanel.className = 'panel';

            const pairingTable = document.createElement('table');
            // Table-Head
            const pairingTableHead = document.createElement('thead');
            pairingTableColoumns.forEach((coloumn) => {
                const pairingTableColoumnHead = document.createElement('th');
                pairingTableColoumnHead.innerHTML = coloumn;
                pairingTableHead.appendChild(pairingTableColoumnHead);
            });
            pairingTable.appendChild(pairingTableHead);

            // Table-Body
            const pairingTableBody = document.createElement('tbody');
            for (let j = 0; j < pairings.length; j++) {
                let pairing = pairings[j];
                if (pairing.round != i) {
                    continue;
                }
                const pairingTableRow = document.createElement('tr');

                let pairingTableData = document.createElement('td');
                pairingTableData.innerHTML = pairing.board;
                pairingTableRow.appendChild(pairingTableData);

                pairingTableData = document.createElement('td');
                pairingTableData.innerHTML = players[ids.indexOf(pairing.id1)].firstName;
                pairingTableRow.appendChild(pairingTableData);

                pairingTableData = document.createElement('td');
                pairingTableData.innerHTML = players[ids.indexOf(pairing.id1)].lastName;
                pairingTableRow.appendChild(pairingTableData);

                pairingTableData = document.createElement('td');
                const matchResultSelectorForm = document.createElement('form');
                const matchResultSelector = document.createElement('select');
                matchResultSelector.id = `match_result_${i}.${j}`;

                let matchResultOption = document.createElement('option');
                matchResultOption.value = 'null';
                matchResultOption.innerHTML = 'Erg.';
                matchResultSelector.appendChild(matchResultOption);

                matchResultOption = document.createElement('option');
                matchResultOption.value = '0';
                matchResultOption.innerHTML = '0 - 1';
                matchResultSelector.appendChild(matchResultOption);

                matchResultOption = document.createElement('option');
                matchResultOption.value = '0.5';
                matchResultOption.innerHTML = '½ - ½';
                matchResultSelector.appendChild(matchResultOption);

                matchResultOption = document.createElement('option');
                matchResultOption.value = '1';
                matchResultOption.innerHTML = '1 - 0';
                matchResultSelector.appendChild(matchResultOption);

                matchResultSelectorForm.appendChild(matchResultSelector);
                pairingTableData.appendChild(matchResultSelectorForm);
                pairingTableRow.appendChild(pairingTableData);

                pairingTableData = document.createElement('td');
                pairingTableData.innerHTML = players[ids.indexOf(pairing.id2)].firstName;
                pairingTableRow.appendChild(pairingTableData);

                pairingTableData = document.createElement('td');
                pairingTableData.innerHTML = players[ids.indexOf(pairing.id2)].lastName;
                pairingTableRow.appendChild(pairingTableData);

                pairingTableBody.appendChild(pairingTableRow);
            }
            pairingTable.appendChild(pairingTableBody);
            pairingTablePanel.appendChild(pairingTable);
            pairingTableWrap.appendChild(pairingTablePanel);

            tournamentWrap.appendChild(pairingTableWrap);
        }

        return tournamentWrap;
    } catch (err) {
        console.error('htmlSetupTournament() failed:', err);
    }
}

async function htmlSetup() {
    try {
        const contentDiv = document.getElementById('content');
        contentDiv.className = 'content';

        // header
        const headerWrap = htmlSetupHeader();
        contentDiv.appendChild(comment('header-div'));
        contentDiv.appendChild(headerWrap);

        // setup
        const setupWrap = await htmlSetupSetup();
        contentDiv.appendChild(comment('setup-div'));
        contentDiv.appendChild(setupWrap);

        //tournament
        const tournamentWrap = await htmlSetupTournament();
        contentDiv.appendChild(comment('tournament-div'));
        contentDiv.appendChild(tournamentWrap);

        setupAccordions();
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('scrollPosition', window.scrollY);
        });
        restoreScrollPosition();
    } catch (err) {
        console.error('htmlSetup() failed:', err);
    }
}

htmlSetup();

// ------------------------------------------------
// ----------------- functions --------------------
// ------------------------------------------------

function comment(comment) {
    return document.createComment(comment);
}

function backToSetup() {
    localStorage.setItem('websiteState', 'setup');
    location.reload();
}

function createPopup(title, message, onConfirm) {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup';

    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    const popupTitle = document.createElement('h2');
    popupTitle.innerHTML = title;
    popupContent.appendChild(popupTitle);

    const popupMessage = document.createElement('p');
    popupMessage.innerHTML = message;
    popupContent.appendChild(popupMessage);

    const popupButtons = document.createElement('div');

    const popupCancel = document.createElement('button');
    popupCancel.innerHTML = 'Abbruch';
    popupCancel.className = 'cancel';
    popupCancel.addEventListener('click', () => {
        document.body.removeChild(popupDiv);
    });
    popupButtons.appendChild(popupCancel);

    const popupConfirm = document.createElement('button');
    popupConfirm.innerHTML = 'Bestätigen';
    popupConfirm.className = 'confirm';
    popupConfirm.addEventListener('click', () => {
        document.body.removeChild(popupDiv);
        onConfirm();
    });
    popupButtons.appendChild(popupConfirm);

    popupContent.appendChild(popupButtons);
    popupDiv.appendChild(popupContent);
    document.body.appendChild(popupDiv);
}

function setupAccordions() {
    const accordions = document.getElementsByClassName('accordion');

    const savedState = JSON.parse(localStorage.getItem('accordionState')) || {};

    for (let i = 0; i < accordions.length; i++) {
        const panel = accordions[i].nextElementSibling;

        if (savedState[i] === 'open') {
            accordions[i].classList.add('active');
            panel.style.display = 'block';
        } else {
            accordions[i].classList.remove('active');
            panel.style.display = 'none';
        }
        accordions[i].addEventListener('click', () => {
            const isActive = accordions[i].classList.toggle('active');
            panel.style.display = isActive ? 'block' : 'none';

            savedState[i] = isActive ? 'open' : 'closed';
            localStorage.setItem('accordionState', JSON.stringify(savedState));
        });
    }
}

function restoreScrollPosition() {
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) window.scrollTo(0, parseInt(savedScrollPosition));
}

function extractErrorFromHTML(html) {
    const match = html.match(/<pre>(.*?)<\/pre>/);
    if (match && match[1]) {
        return match[1].trim();
    }
    return html;
}

async function addPlayerFromInput() {
    try {
        const input_firstName = document.getElementById('input_firstName').value;
        const input_lastName = document.getElementById('input_lastName').value;
        let input_rating = parseFloat(document.getElementById('input_rating').value);
        const input_club = document.getElementById('input_club').value;

        if (!input_rating) input_rating = 800;

        sendPlayerToBackend(input_firstName, input_lastName, input_rating, input_club);
    } catch (err) {
        console.error('addPlayerFromInput() failed:', err);
    }
}

async function addPlayersFromFile(players) {
    try {
        invalidPlayerCounter = 0;
        players.forEach((player) => {
            const firstName = player.firstName;
            const lastName = player.lastName;
            let rating = player.rating;
            if (!rating) {
                rating = 800;
            } else {
                rating = parseInt(rating);
            }
            const club = player.club;

            if (!firstName || !lastName) {
                console.log(
                    `CSV-File contains invalid data, cannot add player "${firstName}" "${lastName}" with "${rating}" DWZ from "${club}"`,
                );
                invalidPlayerCounter++;
            } else {
                sendPlayerToBackend(firstName, lastName, rating, club);
            }
        });
        console.log('Adding players to the database');
        if (invalidPlayerCounter > 0) {
            if (invalidPlayerCounter === 1) {
                alert(
                    `${invalidPlayerCounter} Spieler/in konnte nicht hinzugefügt werden, da Vor- und/oder Nachname gefehlt haben`,
                );
            } else {
                alert(
                    `${invalidPlayerCounter} Spieler/innen konnten nicht hinzugefügt werden, da Vor- und/oder Nachname gefehlt haben`,
                );
            }
        }
    } catch (err) {
        console.error('addPlayersFromFile() failed:', err);
    }
}

async function sendPlayerToBackend(firstName, lastName, rating, club) {
    try {
        const res = await fetch(`${API}add-player`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ firstName, lastName, rating, club }),
            credentials: 'include',
        });
        // console.log(`fetched ${API}add-player?firstName=${firstName}&lastName=${lastName}&rating=${rating}&club=${club}`);

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }

        const data = await res.json();
        console.log(data.message);
    } catch (err) {
        console.error('sendPlayerToBackend() failed:', err);
    }
}

async function loadPlayers() {
    try {
        const res = await fetch(`${API}players`);

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }
        return res.json();
    } catch (err) {
        console.error('loadPlayers() failed:', err);
    }
}

async function loadRanking() {
    try {
        const res = await fetch(`${API}ranking`);

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (err) {
        console.error('loadRanking() failed:', err);
    }
}

async function loadPairings() {
    try {
        const res = await fetch(`${API}pairings`);

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (err) {
        console.error('loadPairings() failed:', err);
    }
}

async function countRounds() {
    try {
        const res = await fetch(`${API}count-rounds`);

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (err) {
        console.error('countRounds() failed:', err);
    }
}

async function getTables() {
    try {
        const res = await fetch(`${API}tables`);

        if (!res.ok) {
            const text = await res.text();
            console.error(text);
            throw new Error(text);
        }

        return res.json();
    } catch (err) {
        console.error('getTables() failed:', err);
    }
}

async function deletePlayer(idToDelete) {
    try {
        const res = await fetch(`${API}delete-player?id=${idToDelete}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(`API Error (${res.status}): ${errorMessage}`);
        } else {
            console.log(JSON.parse(await res.text()).message, `(Status: ${res.status})`);
        }
    } catch (err) {
        console.error('deletePlayer() failed:', err);
    }
}

async function deleteAllPlayers() {
    try {
        const res = await fetch(`${API}delete-all-players`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(`API Error (${res.status}): ${errorMessage}`);
        } else {
            console.log(JSON.parse(await res.text()).message, `(Status: ${res.status})`);
        }
    } catch (err) {
        console.error('deleteAllPlayers() failed:', err);
    }
}

async function addPairing(round, board, id1, id2) {
    try {
        const res = await fetch(
            `${API}add-pairing?round=${round}&board=${board}&id1=${id1}&id2=${id2}`,
            {
                method: 'POST',
            },
        );

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(`API Error (${res.status}): ${errorMessage}`);
        }
    } catch (err) {
        console.error('addPairing() failed:', err);
    }
}

async function createPairingTable() {
    try {
        const res = await fetch(`${API}create-pairing-table`, {
            method: 'POST',
        });

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }
    } catch (err) {
        console.error('createPairingTable() failed:', err);
    }
}

async function deleteAllPairings() {
    try {
        const res = await fetch(`${API}delete-all-pairings`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(`API Error (${res.status}): ${errorMessage}`);
        } else {
            console.log(JSON.parse(await res.text()).message, `(Status: ${res.status})`);
        }
    } catch (err) {
        console.error('deleteAllPairings() failed:', err);
    }
}

async function createRanking() {
    try {
        const res = await fetch(`${API}create-ranking`, {
            method: 'POST',
        });

        if (!res.ok) {
            const text = await res.text();
            const errorMessage = extractErrorFromHTML(text);
            throw new Error(errorMessage);
        }
    } catch (err) {
        console.error('createRanking() failed:', err);
    }
}

async function createFirstRound() {
    try {
        await createRanking();
        await createPairingTable();
        await deleteAllPairings();
        ranking = await loadRanking();

        if (ranking.length % 2 === 1) {
            await sendPlayerToBackend('Spielfrei', 'Spielfrei', 0, '');
            await createRanking();
            await createPairingTable();
            ranking = await loadRanking();
        }

        half = parseInt(ranking.length / 2);
        for (let i = 1; i < half + 1; i++) {
            // console.log(1, i, ranking[i - 1].id, ranking[i + half - 1].id);
            await addPairing(1, i, ranking[i - 1].id, ranking[i + half - 1].id);
        }
    } catch (err) {
        console.error(err);
    }
}

async function startTournament() {
    await deleteAllPairings();
    localStorage.setItem('websiteState', 'tournament');
    const setupDiv = document.getElementsByClassName('setup');
    setupDiv.style.display = 'none';
}

async function dev() {
    const uniqueRoundsRaw = await countRounds();
    const uniqueRounds = uniqueRoundsRaw[0]['COUNT(DISTINCT round)'];
    console.log(uniqueRounds);
}
