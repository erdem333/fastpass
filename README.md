# FastPass - Monitor Konfiguration Platform

Eine Webapplikation zum Konfigurieren und Verwalten von Event-Monitoren über verschiedene Ticketing-Plattformen.

## Features

- Discord Login für Benutzer
- Plattformauswahl (Ticketmaster, Eventim, Fansale, Twickets, Sports)
- Event ID Konfiguration pro Plattform
- Webhook-Konfiguration mit Custom Presets
- Admin Dashboard zur Benutzerverwaltung
- MongoDB für Datenpersistierung

## Tech Stack

- **Backend**: Node.js + Express (JavaScript)
- **Frontend**: Angular
- **Database**: MongoDB (lokal)
- **Authentication**: Discord OAuth + JWT

## Voraussetzungen

- Node.js 16+ installiert
- MongoDB lokal laufend auf `mongodb://localhost:27017`
- Discord Developer Application (für OAuth)

## Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Environment Variablen

Siehe `.env.example` Datei in den jeweiligen Verzeichnissen.
