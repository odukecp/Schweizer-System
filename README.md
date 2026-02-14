# Schweizer System Turnier-Management

## 1. Überblick

Das Schweizer System Turnier-Management ist ein Programm, das es einem ermöglcht bequem Turniere nach dem Schweizer System zu organisieren. 

Aktuell beinhaltet das Programm nur eine funktionierende Spielerdatenbank.

## 2. Installation

Um das Programm zu verwenden sind einige Schritte notwendig:

1. Das Repository klonen
```bash
git clone https://github.com/odukecp/Schweizer-System
```

2. Zum Projekt navigieren
```bash
cd Schweizer-System/backend
````

3. Notwendige Module installieren (Das kann beim ersten Mal etwas dauern)
```bash
if [ ! -d "node_modules"]; then
npm install
fi
```

4. Den backend-Server starten
```bash
npm start
````

5. Das User-Interface im Browser öffnen (neues Terminal)
```bash
open Schweizer-System/frontend/index.html
```

Der backend-Server kann im ersten Terminal mit Ctrl + C beendet werden.

## 3. Good-To-Know
1. Ein direkter Zugriff auf die Datenbank ist wie folgt möglich
```bash
cd Schweizer-System/backend
sqlite3 database.db
```