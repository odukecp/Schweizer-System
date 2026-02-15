# Schweizer System Turnier-Management

## 1. Überblick

Das Schweizer System Turnier-Management ist ein Programm, das es einem ermöglcht bequem Turniere nach dem Schweizer System zu organisieren. 

Aktuell beinhaltet das Programm nur eine funktionierende Spielerdatenbank.

## 2. Installation

Um das Programm zu verwenden sind folgende Schritte notwendig:

1. Das Repository klonen
```bash
git clone https://github.com/odukecp/Schweizer-System
```

2. In den Projektordner navigieren (oder im Terminal)
```bash
cd Schweizer-System
```

3. Im Projektordner das Programm durch doppelklicken von `start.command` starten (oder im Terminal)
```bash
./start.command
```
Der backend-Server kann durch doppelklicken von `stop.command` beendet werden (oder im Terminal)
```bash
./stop.command
```

## 3. Good-To-Know
1. Ein direkter Zugriff auf die Datenbank ist wie folgt möglich
```bash
sqlite3 Schweizer-System/backend/database.db
```