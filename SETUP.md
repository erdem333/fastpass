# FastPass - Ausführliches Setup Guide

## 📋 Voraussetzungen

- **Node.js** 16+ installiert
- **MongoDB** lokal laufend auf `mongodb://localhost:27017`
- **Discord Developer Application** für OAuth

## 🚀 Schnelstart

### 1. Backend Setup

```bash
cd backend
npm install
```

**Environment Setup:**
```bash
# Kopiere .env.example und rename zu .env
cp .env.example .env
```

**Wichtige Umgebungsvariablen (`backend/.env`):**
```
MONGO_URI=mongodb://localhost:27017/fastpass
DISCORD_CLIENT_ID=deine_discord_client_id
DISCORD_CLIENT_SECRET=dein_discord_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
JWT_SECRET=dein_geheimer_jwt_schluessel
PORT=3000
FRONTEND_URL=http://localhost:4200
```

**Backend starten:**
```bash
npm run dev
```

Backend läuft dann auf: `http://localhost:3000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Frontend starten:**
```bash
npm start
```

Frontend läuft dann auf: `http://localhost:4200`

---

## 📁 Projekt Struktur

```
FastPass/
├── backend/
│   ├── models/                 # MongoDB Mongoose Modelle
│   │   ├── User.js            # Benutzer-Modell (Discord)
│   │   ├── Platform.js        # Plattformen-Modell
│   │   └── UserPlatformConfig.js
│   ├── routes/                # Express Routes
│   │   ├── auth.js
│   │   ├── platforms.js
│   │   └── userConfig.js
│   ├── middleware/
│   │   └── auth.js            # JWT Authentifizierung
│   ├── config/
│   │   ├── database.js        # MongoDB Verbindung
│   │   └── platforms.js       # Plattform-Daten
│   ├── app.js                 # Express App (Hauptdatei)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Services, Interceptors
│   │   │   ├── modules/       # Feature Module
│   │   │   └── app.component.ts
│   │   ├── styles.scss        # Global Styles (Dark Theme)
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
│
└── README.md
```

---

## 🔐 Discord OAuth Setup

Um Discord Login zu verwenden:

1. Gehe zu [Discord Developer Portal](https://discord.com/developers/applications)
2. Erstelle eine neue Anwendung
3. Kopiere `Client ID` und `Client Secret`
4. Gehe zu OAuth2 → Redirect URLs und füge hinzu:
   - `http://localhost:3000/api/auth/discord/callback`
   - `http://localhost:3000/api/auth/discord/callback`

5. Trage die Werte in `backend/.env` ein

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/discord/callback` - Discord Login
- `GET /api/auth/profile` - Profil abrufen

### Platforms
- `GET /api/platforms` - Alle Plattformen
- `GET /api/platforms/:id` - Plattform Details
- `GET /api/platforms/category/:category` - Nach Kategorie filtern

### User Konfiguration
- `GET /api/config` - Alle Konfigurationen
- `GET /api/config/platform/:platformId` - Config einer Plattform
- `POST /api/config/platform/:platformId` - Config erstellen/updaten
- `POST /api/config/platform/:platformId/event` - Event ID hinzufügen
- `DELETE /api/config/platform/:platformId/event/:eventId` - Event ID löschen
- `POST /api/config/platform/:platformId/webhook` - Webhook konfigurieren

---

## 🎨 Design System

Das Frontend nutzt ein **modernes Dark Theme** mit folgenden Farben:

- **Primary Background**: `#0f1419`
- **Secondary Background**: `#1a1f26`
- **Accent Primary**: `#5b9cf5` (Blau)
- **Accent Secondary**: `#5fdd9d` (Grün)
- **Accent Danger**: `#f55857` (Rot)

Die Komponenten verwenden automatisch Grautöne für einen angenehmen Dark-Mode-Look.

---

## 📊 Datenbank Modelle

### User
```javascript
{
  discordId: String (unique),
  username: String,
  email: String,
  avatar: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Platform
```javascript
{
  name: String,
  slug: String (unique),
  category: 'ticketing' | 'sports',
  country: String,
  domain: String,
  icon: String,
  isActive: Boolean
}
```

### UserPlatformConfig
```javascript
{
  userId: ObjectId (ref: User),
  platformId: ObjectId (ref: Platform),
  eventIds: [String],
  webhookConfig: {
    presetName: String,
    webhookUrl: String,
    color: String (#XXXXXX),
    footerText: String,
    logoUrl: String
  },
  isEnabled: Boolean
}
```

---

## ✅ Nächste Schritte

Nach dem initialen Setup:

1. **Discord OAuth Integration** - Frontend-Komponente für Login
2. **Dashboard** - Plattform-Auswahl und Event-Management
3. **Admin Panel** - Benutzerverwaltung
4. **API Extension** - Weitere Funktionen hinzufügen

---

## 🆘 Troubleshooting

**MongoDB läuft nicht?**
```bash
# MongoDB lokal starten (Windows)
net start MongoDB

# oder via WSL
sudo service mongod start
```

**Port 3000 bereits in Benutzung?**
Ändere `PORT` in `backend/.env`

**Port 4200 bereits in Benutzung?**
```bash
ng serve --port 4300
```

---

Viel Erfolg bei der Entwicklung! 🚀

## Railway Deployment Guide

### 📋 Prerequisites
- Railway account with project set up
- Backend service connected to `/backend` directory
- Frontend service connected to `/frontend` directory
- Both services successfully building

### 🚀 Deployment Steps

#### Step 1: Generate Backend Domain
1. Go to Railway Dashboard
2. Click on your **Backend** service
3. Go to **Settings** tab
4. Under **Public Networking**, click **"Generate Domain"**
5. Note the generated domain: `https://backend-production-xxx.up.railway.app`

#### Step 2: Generate Frontend Domain
1. Go to your **Frontend** service in Railway
2. Go to **Settings** tab
3. Under **Public Networking**, click **"Generate Domain"**
4. Note the generated domain: `https://frontend-production-xxx.up.railway.app`

#### Step 3: Configure Discord OAuth Settings
**In your Discord Developer Portal:**
1. Go to your Application Settings
2. Under **OAuth2 → Redirects**, add:
   - `https://backend-production-xxx.up.railway.app/api/auth/discord/callback`
   - Keep your local dev one: `http://localhost:3000/api/auth/discord/callback`

#### Step 4: Set Backend Environment Variables
In Railway Dashboard, go to **Backend** service → **Variables** tab:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_or_generate_new>
DISCORD_CLIENT_ID=<your_discord_client_id>
DISCORD_CLIENT_SECRET=<your_discord_client_secret>
DISCORD_REDIRECT_URI=https://backend-production-xxx.up.railway.app/api/auth/discord/callback
FRONTEND_URL=https://frontend-production-xxx.up.railway.app
NODE_ENV=production
PORT=3000
```

#### Step 5: Set Frontend Environment Variables
In Railway Dashboard, go to **Frontend** service → **Variables** tab:

```
BACKEND_URL=https://backend-production-xxx.up.railway.app
ENVIRONMENT=production
```

*Alternative: If your services are on the same Railway network, you can use the internal URL:*
```
BACKEND_URL=http://backend.railway.internal/api
```

#### Step 6: Verify CORS Configuration
The backend automatically allows:
- Frontend URL from `FRONTEND_URL` env variable
- Local development URLs
- Requests without origin (for server-to-server)

### ✅ Testing Your Deployment

1. **Test Health Check:**
   ```
   https://backend-production-xxx.up.railway.app/api/health
   ```
   Should return: `{ "status": "Server is running" }`

2. **Test Frontend:** 
   Open `https://frontend-production-xxx.up.railway.app` in browser

3. **Test Discord Login:**
   - Click "Login with Discord" button
   - If redirected to Discord login, the connection works!
   - Check browser console for any errors

### 🔍 Troubleshooting

**Error: "Failed to initiate Discord login: Unknown Error"**
- Check backend is running: `https://backend-production-xxx.up.railway.app/api/health`
- Verify `DISCORD_REDIRECT_URI` is correct in Railway variables
- Check CORS settings in backend logs

**Error: "Discord redirect_uri_mismatch"**
- Your `DISCORD_REDIRECT_URI` doesn't match Discord OAuth settings
- Go to Discord Developer Portal and verify the redirect URL

**Frontend shows "Unknown Error"**
- Open browser console (F12)
- Check if API calls are going to correct backend URL
- Check backend service logs in Railway

### 📝 Local Development (still works!)

When running locally, the auth service automatically detects `localhost` and uses:
- Backend: `http://localhost:3000/api`
- No changes needed to run locally!