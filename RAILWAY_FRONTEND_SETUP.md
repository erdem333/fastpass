# 🚀 Railway Frontend Setup - Express Server Guide

## Problem gelöst ✅

Das Frontend läuft jetzt mit **Express Server** statt `ng serve`!

### Was änderte sich?
- ❌ **Vorher:** `ng serve` (Dev Server mit Port 8080)
- ✅ **Nachher:** Express Server mit Production Build (Port 3000/80)
- ✅ **Automatisches Proxying:** `/api` Calls werden zum Backend weitergeleitet

---

## 📋 Was wurde hinzugefügt?

### 1. **`server.js`** - Express Production Server
```javascript
// Served die Angular Build statisch
// Proxied alle /api Requests zum Backend
// Setzt alle Routes auf index.html (Angular Routing)
```

### 2. **`Procfile`** - Railway Start Befehl
```
web: npm run prod
```

### 3. **`package.json`** Updates
```json
{
  "scripts": {
    "build": "ng build",         // Build Angular
    "server": "node server.js",  // Run Express Server
    "prod": "npm run build && npm run server"  // Railway uses this
  },
  "dependencies": {
    "express": "^4.18.2"  // Neu hinzugefügt
  }
}
```

---

## 🔧 Railway Konfiguration

### **Frontend Service - Environment Variables**

Gehe zu: Railway Dashboard → Frontend Service → Variables

**Setze diese Variable:**
```
PORT=3000
BACKEND_URL=https://backend-production-97be.up.railway.app
```

| Variable | Wert | Erklärung |
|----------|------|-----------|
| `PORT` | `3000` | Port auf dem Express läuft (Standard für Railway) |
| `BACKEND_URL` | `https://backend-production-97be.up.railway.app` | Backend Domain (ersetze mit deiner!) |

### **Frontend Service - Start Befehl**

Railway sollte den Start-Befehl automatisch erkennen aus `Procfile`. 

**Falls nicht manuell gesetzt:**
- Gehe zu: Settings → Build Command
- Setze: `npm ci && npm run build`
- Setze: Start Command
- Setze: `npm run server` oder `node server.js`

---

## 🛠️ Wie es funktioniert

### Lokal (Dev)
```
Frontend: http://localhost:4200
          ↓ ng serve
          
/api/auth/discord/login → http://localhost:3000/api/auth/discord/login
(proxy.conf.json leitet weiter)
```

### Railway (Production)
```
Frontend: https://frontend-production-75cc.up.railway.app
          ↓ Express Server
          
/api/auth/discord/login → https://backend-production-97be.up.railway.app/api/auth/discord/login
(server.js proxied alle /api Calls)
```

---

## 🧪 Testen nach Deployment

### 1. **Frontend lädt?**
```
https://frontend-production-75cc.up.railway.app/
```
Sollte die Login-Seite zeigen ✅

### 2. **API Proxying funktioniert?**
```
https://frontend-production-75cc.up.railway.app/api/health
```
Sollte zurückgeben:
```json
{ "status": "Server is running" }
```

### 3. **Discord Login funktioniert?**
```
1. Klicke auf "Login with Discord"
2. Sollte zu Discord redirected
3. Nach Login → Dashboard
```

---

## 🔍 Debugging

### Backend URL falsch?
**Fehler:** `SyntaxError: Unexpected token '<'` (HTML statt JSON)

**Lösung:**
1. Check: `BACKEND_URL` Variable in Railway
2. Muss die **vollständige Backend URL** sein!
3. Nicht nur `localhost` oder `/api`

### Frontend lädt nicht?
**Fehler:** 404 oder leere Seite

**Lösung:**
1. Check: Railway Frontend Logs
2. Check: `npm run prod` läuft erfolgreich
3. Check: `dist/fastpass-frontend` Ordner existiert

### Express Server startet nicht?
**Fehler:** Server crashed sofort

**Lösung:**
1. Check: `express` installiert (`npm install`)
2. Check: `server.js` Syntax ist korrekt
3. Check: Port 3000 ist nicht blockiert

---

## 📦 Installation lokal testen

Falls du lokal testen möchtest:

```bash
cd frontend

# Install dependencies
npm install

# Build Angular
npm run build

# Run Express Server
npm run server

# Öffne im Browser
http://localhost:3000
```

---

## 🚀 Deployment Steps

1. **Committe deine Änderungen**
   ```bash
   git add .
   git commit -m "Add Express server for Railway production deployment"
   git push
   ```

2. **Railway sollte automatisch neu deployen**
   - Schau auf Railway Dashboard
   - Frontend Service sollte neu builden & starten

3. **Test!**
   - https://frontend-production-75cc.up.railway.app
   - Klicke Discord Login
   - Sollte funktionieren! ✅

---

## 📝 Änderungen Summary

| Datei | Status | Änderung |
|-------|--------|----------|
| `server.js` | ✨ Neu | Express Production Server |
| `Procfile` | ✨ Neu | Railway Start Konfiguration |
| `package.json` | ✏️ Modified | Express dependency + Scripts |
| `auth.service.ts` | ✏️ Modified | Besserer Backend URL Handling |

---

## ⚡ TL;DR

**Das Problem war:**
- Angular `ng serve` läuft nur auf Dev Umgebung
- Railway braucht Production Server

**Die Lösung:**
- Express Server served die Angular Build
- Proxied alle `/api` Calls zum Backend
- Alles automatisch gesteuert via `BACKEND_URL` Variable

**Auf Railway:**
- Frontend kennt Backend URL via Environment Variable
- Frontend proxied alle API Calls
- Discord OAuth funktioniert jetzt! ✅

---

## 🆘 Probleme?

1. **Express Module nicht gefunden?**
   ```bash
   npm install express
   git push
   # Railway redeploy
   ```

2. **Backend URL falsch?**
   Check Railway Frontend → Variables → `BACKEND_URL`

3. **Server crasht?**
   Check Railway Frontend → Logs (Deployment Logs)

---

Mehr Hilfe? Siehe: `RAILWAY_DEPLOYMENT.md`
