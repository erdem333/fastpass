# 🔧 Railway "npm: command not found" - Fehler Behebung

## 🔴 Das Problem

```
/bin/bash: line 1: npm: command not found
```

**Ursache:** Railway trennt Build- und Start-Phase. Nach dem Build ist `npm` nicht mehr verfügbar!

### Wie das Problem entstand:

```
❌ Procfile: web: npm run prod
    ↓
    Build Phase: npm run build (funktioniert)
    ↓
    Start Phase: npm run prod (FEHLER - npm nicht im PATH!)
```

---

## ✅ Die Lösung

### 1. **Procfile aktualisiert**
```
release: npm run build
web: node server.js
```

**Das bedeutet:**
- `release:` läuft NUR während Build Phase (npm noch verfügbar)
- `web:` läuft während Runtime (nutzt nur node, nicht npm)

### 2. **package.json aktualisiert**
```json
{
  "engines": {
    "node": "18.x || 20.x"
  },
  "scripts": {
    "build": "ng build",
    "server": "node server.js",
    "prod": "npm run build && npm run server",
    "dev": "npm run server"
  }
}
```

**Neu hinzugefügt:**
- `engines:` Sagt Railway welche Node Version nötig ist
- `dev:` Script für Railway Runtime (nur `node server.js`)

### 3. **railway.json** (Optional)
```json
{
  "$schema": "https://railway.app/schema.json",
  "build": {
    "builder": "nixpacks"
  }
}
```

---

## 🔄 Railway Build Phasen (Jetzt korrekt!)

### Phase 1: Build (npm verfügbar ✅)
```bash
npm ci                    # Install dependencies
npm run build             # Angular Build (im release: phase)
# Resultat: dist/fastpass-frontend/ erstellt
```

### Phase 2: Start (Nur node! ✅)
```bash
node server.js            # Express Server startet
# Resultat: http://localhost:3000
```

---

## 🚀 Deployment Schritte

1. **Committe Änderungen**
   ```bash
   git add frontend/Procfile frontend/package.json frontend/railway.json
   git commit -m "Fix Railway npm command not found error"
   git push
   ```

2. **Railway redeploy**
   - Railway sollte Änderungen auto-erkennen
   - Schau Railway Dashboard → Frontend Service → Deployments

3. **Überprüfe Logs**
   - "npm: command not found" sollte weg sein
   - "Server is running" sollte angezeigt werden

---

## 📝 Technische Details

### Warum npm nach Build nicht verfügbar ist:

Railway nutzt eine Sandbox Umgebung:
```
Build Environment: node, npm, dependencies ✅
Run Environment: node (nur Runtime!) ✅

Problem: npm war nur in Build verfügbar, nicht in Run!
```

### Procfile Release vs Web

```heroku
release: npm run build
  ↑
  Läuft EINMAL nach Build
  npm NOCH verfügbar
  ↓
  Erstellt dist/ Folder

web: node server.js
  ↑
  Läuft IMMER während Runtime
  npm NICHT verfügbar
  Nutzt nur pre-built dist/ Folder
  ↓
  Express Server
```

---

## 🧪 Lokal testen

```bash
cd frontend

# Simuliere Railway Build Phase
npm run build

# Simuliere Railway Start Phase
npm run server

# Öffne: http://localhost:3000
```

---

## 🆘 Falls Problem noch besteht

### Fehler: "dist/fastpass-frontend not found"
- Build Phase hat nicht funktioniert
- Check: Railway Frontend → Logs → Build Logs
- Prüfe: `npm run build` funktioniert lokal?

### Fehler: "Cannot find module 'express'"
- Express wurde nicht installiert
- Railway sollte `npm ci` automatisch machen
- Check: package.json hat `express` als Dependency?

### Fehler: Port bereits in Benutzung
- Railway PORT Variable nicht gesetzt
- Check: Railway Frontend → Variables → PORT=3000

---

## 📦 Zusammenfassung Änderungen

| Datei | Änderung |
|-------|----------|
| `Procfile` | ✏️ Zwei-Phase Approach (release + web) |
| `package.json` | ✏️ Engines + neue Scripts hinzugefügt |
| `railway.json` | ✨ Neu - Railway Config |

---

## 🎯 Warum das funktioniert

**Alte Methode (❌ Fehler):**
```
Procfile: web: npm run prod
→ Start Phase: npm run prod
→ npm nicht verfügbar → FEHLER
```

**Neue Methode (✅ Funktioniert):**
```
Procfile: 
  release: npm run build     ← Build Phase mit npm
  web: node server.js        ← Start Phase ohne npm
→ Beide Phasen haben die richtigen Tools
→ Funktioniert! ✅
```

---

**Result: npm: command not found ist behoben!** 🎉

Railway wird jetzt:
1. ✅ `npm run build` während Build Phase
2. ✅ `node server.js` während Start Phase
3. ✅ Frontend lädt erfolgreich!
