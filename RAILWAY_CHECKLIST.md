# ✅ Railway Deployment Checklist

## Code-Änderungen ✨ (Bereits erledigt!)

- [x] AuthService - Dynamische Backend URL
- [x] ConfigService - Erweiterter für verschiedene Umgebungen
- [x] Backend CORS - Verbesserte Konfiguration
- [x] AppComponent - Config Initialisierung
- [x] assets/config.json - Erstellt

**Alle Code-Änderungen sind abgeschlossen!** 🎉

---

## Railway Configuration Checklist 🚀

### Phase 1: Domains generieren

- [ ] **Backend Domain generieren**
  - Railway Dashboard → Backend Service → Settings → Public Networking → Generate Domain
  - Domain speichern: `https://backend-prod-xxxxx.up.railway.app`

- [ ] **Frontend Domain generieren**
  - Railway Dashboard → Frontend Service → Settings → Public Networking → Generate Domain
  - Domain speichern: `https://frontend-prod-xxxxx.up.railway.app`

### Phase 2: Discord Settings anpassen

- [ ] **Discord OAuth Redirect URI aktualisieren**
  - Discord Developer Portal → Application → OAuth2 → Redirects
  - Neue URL hinzufügen: `https://backend-prod-xxxxx.up.railway.app/api/auth/discord/callback`
  - Lokale URL behalten: `http://localhost:3000/api/auth/discord/callback`
  - **Speichern!**

### Phase 3: Railway Backend Variables

Gehe zu: Railway Dashboard → Backend Service → Variables

**Kritische Variablen (MUSS gesetzt sein):**

- [ ] `DISCORD_REDIRECT_URI` = `https://backend-prod-xxxxx.up.railway.app/api/auth/discord/callback`
- [ ] `FRONTEND_URL` = `https://frontend-prod-xxxxx.up.railway.app`
- [ ] `DISCORD_CLIENT_ID` = Deine Discord Client ID
- [ ] `DISCORD_CLIENT_SECRET` = Dein Discord Client Secret

**Optionale Variablen (sollten bereits gesetzt sein):**

- [ ] `MONGO_URI` = Deine MongoDB Connection
- [ ] `JWT_SECRET` = Dein JWT Secret
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`

### Phase 4: Testen

- [ ] Backend Health Check
  ```
  https://backend-prod-xxxxx.up.railway.app/api/health
  ```
  → Sollte `{ "status": "Server is running" }` zurückgeben

- [ ] Frontend öffnen
  ```
  https://frontend-prod-xxxxx.up.railway.app
  ```
  → Sollte die Login-Seite zeigen

- [ ] Discord Login testen
  - Klicke auf "Login with Discord"
  - Du solltest zu Discord weitergeleitet werden
  - Nach Login sollte der Dashboard geladen werden

### Phase 5: Fehlersuche (falls nötig)

- [ ] Browser Console öffnen (F12 → Console)
  - Suche nach Fehlern
  - Prüfe welche API URLs aufgerufen werden

- [ ] Railway Backend Logs prüfen
  - Railway Dashboard → Backend Service → Logs
  - Suche nach `CORS blocked` oder anderen Errors

- [ ] Railway Frontend Logs prüfen
  - Railway Dashboard → Frontend Service → Deployments → Logs

---

## Quick Reference 📌

| Was | Wo |
|-----|-----|
| Backend Domain | Railway → Backend → Settings → Public Networking |
| Frontend Domain | Railway → Frontend → Settings → Public Networking |
| Backend Variables | Railway → Backend → Variables |
| Discord Settings | Discord Developer Portal → OAuth2 → Redirects |
| Backend Logs | Railway → Backend → Logs |
| Frontend Logs | Railway → Frontend → Deployments → Logs |

---

## Häufige Fehler & Lösungen 🆘

### ❌ "Failed to initiate Discord login: Unknown Error"
**Ursache:** Backend URL nicht erreichbar oder CORS blockiert
**Lösung:** 
- Prüfe Backend ist online (Health Check)
- Prüfe `FRONTEND_URL` Variable ist gesetzt
- Prüfe Backend Logs

### ❌ "Discord redirect_uri_mismatch"
**Ursache:** Discord Redirect URL stimmt nicht
**Lösung:**
- Gehe zu Discord Developer Portal
- Prüfe dass die neue URL genau eingetragen ist
- Unterschied zwischen http/https, www, etc. macht es kaputt!

### ❌ "CORS error" in Browser Console
**Ursache:** Frontend darf nicht mit Backend kommunizieren
**Lösung:**
- Prüfe `FRONTEND_URL` in Railway Backend Variables
- Muss exakt deine Frontend Domain sein

### ❌ Backend startet nicht
**Ursache:** Environment Variable fehlt
**Lösung:**
- Prüfe alle CRITICAL Variables sind gesetzt
- Prüfe MongoDB Connection ist aktiv
- Prüfe Logs

---

## Hilfreiche Links 🔗

- 📖 [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) - Ausführliche Anleitung
- 🆘 [SETUP.md](SETUP.md) - General Setup Guide
- 🚀 [Railway Docs](https://docs.railway.app)
- 🎮 [Discord OAuth Docs](https://discord.com/developers/docs/topics/oauth2)

---

## Nach erfolgreichem Deployment 🎉

- [ ] Committe deine Änderungen zu Git
- [ ] Teile die Frontend URL mit anderen Users
- [ ] Überwache die Logs für erste Tage
- [ ] Feiere deinen Success! 🎊
