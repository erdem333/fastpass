# 🚀 Railway Deployment Guide - Discord OAuth Fix

## Problem Beschreibung

Fehler beim Discord Login: **"Failed to initiate Discord login: Unknown Error"**

**Ursache:** Das Frontend kommuniziert nicht korrekt mit dem Backend, weil:
1. Frontend hatte hardcoded `http://localhost:3000` - funktioniert nicht auf Railway
2. `DISCORD_REDIRECT_URI` war `http://localhost:3000` - Discord kennt diese URI nicht
3. Kein CORS konfiguriert für Production

## Schritt-für-Schritt Anleitung

### ✅ Was wurde bereits für dich behoben:

1. **AuthService** ist jetzt dynamisch - erkennt localhost vs Production
2. **ConfigService** ist erweitert - kann Backend URL konfigurieren
3. **Backend CORS** ist verbessert - akzeptiert Frontend URL
4. **AppComponent** initialisiert Config beim Start

---

## 📋 Deine To-Do Liste für Railway

### **Schritt 1: Backend Domain generieren**

1. Öffne Railway Dashboard
2. Gehe zu deinem **Backend Service**
3. Klicke auf **Settings** Tab
4. Unter **Networking** → **Public Networking**
5. Klicke **"Generate Domain"**
6. Du bekommst etwas wie: `https://backend-prod-xxxxx.up.railway.app`
7. **Merke dir diese Domain!** 📝

### **Schritt 2: Frontend Domain generieren**

1. Gehe zu deinem **Frontend Service** in Railway
2. **Settings** Tab
3. **Public Networking** → **"Generate Domain"**
4. Du bekommst etwas wie: `https://frontend-prod-xxxxx.up.railway.app`
5. **Merke dir auch diese Domain!** 📝

### **Schritt 3: Discord OAuth anpassen** 🎮

Im Discord Developer Portal:
1. Gehe zu deiner Application
2. **OAuth2** → **Redirects**
3. **Füge NEUE URL hinzu:**
   ```
   https://backend-prod-xxxxx.up.railway.app/api/auth/discord/callback
   ```
4. **Behalt deine lokale URL auch!** (für lokales Testing)
   ```
   http://localhost:3000/api/auth/discord/callback
   ```
5. **Speichern!** ✅

### **Schritt 4: Backend Environment Variables setzen** ⚙️

Gehe zu Railway Dashboard → **Backend Service** → **Variables**

Stelle diese Variablen ein:

| Variable | Wert | Beispiel |
|----------|------|----------|
| `MONGO_URI` | Deine MongoDB Verbindung | `mongodb+srv://...` |
| `JWT_SECRET` | Ein starkes Secret (optional neu generieren) | `your_jwt_secret_here` |
| `DISCORD_CLIENT_ID` | Deine Discord Client ID | `123456789...` |
| `DISCORD_CLIENT_SECRET` | Dein Discord Client Secret | `abcdef123456...` |
| **`DISCORD_REDIRECT_URI`** | **CRITICAL - Neue Backend URL** | `https://backend-prod-xxxxx.up.railway.app/api/auth/discord/callback` |
| **`FRONTEND_URL`** | **CRITICAL - Deine Frontend URL** | `https://frontend-prod-xxxxx.up.railway.app` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | `3000` | `3000` |

**WICHTIG:** Die zwei mit **CRITICAL** markierten sind entscheidend! Ohne diese funktioniert Discord OAuth nicht.

### **Schritt 5: Frontend (Optional) 📱**

Im Railway Dashboard → **Frontend Service** → **Variables**:

Optionale Variablen (Frontend erkennt Backend auch automatisch):

| Variable | Wert |
|----------|------|
| `BACKEND_URL` | `https://backend-prod-xxxxx.up.railway.app` |
| `ENVIRONMENT` | `production` |

> **Note:** Wenn du diese nicht setzt, versucht das Frontend automatisch `/api` zu verwenden (relative Path), was auf Railway funktioniert, wenn beide Services auf der gleichen Umgebung sind.

---

## 🧪 Testen nach dem Deployment

### 1. Backend Health Check
```
https://backend-prod-xxxxx.up.railway.app/api/health
```
Sollte zurückgeben:
```json
{
  "status": "Server is running"
}
```

### 2. Frontend öffnen
```
https://frontend-prod-xxxxx.up.railway.app
```

### 3. Discord Login testen
1. Klicke auf "Login with Discord" Button
2. Du solltest zu Discord weitergeleitet werden
3. Gib deine Discord Credentials ein
4. Danach solltest du zurück zum Dashboard redirected werden

### 4. Fehlersuche (F12 Browser Console)

**Wenn du Error `"Failed to initiate Discord login: Unknown Error"` bekommst:**

- Öffne **F12** → **Console**
- Schau welche API URLs called werden
- Sollte sein: `https://backend-prod-xxxxx.up.railway.app/api/auth/discord/login`

**Häufige Fehler:**

| Fehler | Ursache | Lösung |
|--------|--------|--------|
| `CORS error` | Backend CORS falsch | Stelle sicher `FRONTEND_URL` in Backend Variables gesetzt ist |
| `redirect_uri_mismatch` | Discord Redirect URL falsch | Prüfe Discord Settings - URL muss exakt passen |
| `DISCORD_CLIENT_ID not set` | Environment Variable fehlt | Setze Variable im Railway Dashboard |
| `Connection refused` | Backend läuft nicht | Prüfe Backend Logs in Railway |

---

## 🔧 Wie es jetzt funktioniert

### Lokale Entwicklung 💻
```
Frontend: http://localhost:4200
Backend: http://localhost:3000/api
→ Alles funktioniert wie vorher!
```

### Railway Production 🚀
```
Frontend: https://frontend-prod-xxxxx.up.railway.app
Backend: https://backend-prod-xxxxx.up.railway.app/api
→ AuthService erkennt Production und verwendet richtige URLs
→ CORS erlaubt Frontend URL
→ Discord Redirect funktioniert
```

---

## 📝 Code-Änderungen (Was wurde gemacht)

### 1. AuthService
- **Vorher:** Hardcoded `http://localhost:3000/api`
- **Nachher:** Dynamische URL basierend auf `window.location.origin`
  - localhost → `http://localhost:3000/api`
  - Production → `/api` (relative Path)

### 2. ConfigService
- Neue `initializeConfig()` Methode
- Lädt optional `assets/config.json`
- Setzt Backend URL in AuthService

### 3. Backend CORS
- Verbesserte Konfiguration
- Erlaubt `FRONTEND_URL` Environment Variable
- Erlaubt auch localhost für Testing
- Erlaubt Requests ohne Origin (Server-to-Server)

### 4. AppComponent
- Initialisiert ConfigService beim Start
- Lädt Config vor Auth-Check

---

## ⚡ Schnellstart (TL;DR)

1. Railway Backend Domain: `backend-prod-xxxxx.up.railway.app`
2. Railway Frontend Domain: `frontend-prod-xxxxx.up.railway.app`
3. Discord: Neue Redirect URI hinzufügen
   ```
   https://backend-prod-xxxxx.up.railway.app/api/auth/discord/callback
   ```
4. Railway Backend Variables:
   - `DISCORD_REDIRECT_URI`: `https://backend-prod-xxxxx.up.railway.app/api/auth/discord/callback`
   - `FRONTEND_URL`: `https://frontend-prod-xxxxx.up.railway.app`
5. Test! ✅

---

## 🆘 Ich habe noch Probleme!

### Debuggen in Railway

1. **Backend Logs anschauen:**
   - Railway Dashboard → Backend Service → **Logs**
   - Suche nach `CORS blocked` oder `Discord Auth URL`

2. **Frontend Logs anschauen:**
   - Railway Dashboard → Frontend Service → **Deployments** → **Logs**

3. **Lokale Probleme beheben:**
   ```bash
   # Backend testen lokal
   cd backend
   npm start
   # Test: curl http://localhost:3000/api/health
   
   # Frontend testen lokal
   cd frontend
   ng serve
   # Test: http://localhost:4200
   ```

---

## 📞 Zusätzliche Ressourcen

- [Railway Docs](https://docs.railway.app)
- [Discord OAuth Docs](https://discord.com/developers/docs/topics/oauth2)
- [Angular Environment Setup](https://angular.io/guide/build)
