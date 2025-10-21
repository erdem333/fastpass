# 🗄️ Railway MongoDB Setup Guide

## Problem

Du hast MongoDB auf Railway angelegt, aber weiß nicht wie man es verbindet.

Es gibt zwei Optionen:
1. **Public Networking** - Für Tests von außerhalb
2. **Private Networking** - Für Backend (sicherer, schneller) ✅

---

## ✅ Beste Option: Private Networking

Weil dein Backend auch auf Railway läuft, nutze **Private Networking**!

### MongoDB Connection String für Railway Backend:

```
mongodb://username:password@mongodb.railway.internal:27017/fastpass?authSource=admin
```

**Erklärung:**
- `mongodb://` - MongoDB Protocol
- `username:password` - Dein DB User & Password
- `mongodb.railway.internal` - Railway Private DNS (nur innerhalb Railway!)
- `:27017` - MongoDB Port
- `/fastpass` - Database Name
- `?authSource=admin` - Auth Database

---

## 🚂 Railway Backend Konfiguration

### Schritt 1: MongoDB Credentials finden

Im Railway Dashboard:
1. Gehe zu MongoDB Service
2. Klick auf den Service Name
3. Gehe zu **Connect** Tab
4. Du siehst dort:
   - Daten für Public/Private Connection
   - Username (z.B. `root`)
   - Password (z.B. `random_password`)

### Schritt 2: Backend Environment Variables setzen

Railway Dashboard → Backend Service → **Variables**

Setze diese Variablen:

```
MONGO_URI=mongodb://username:password@mongodb.railway.internal:27017/fastpass?authSource=admin
```

**Ersetze:**
- `username` = Dein MongoDB Username (normalerweise `root`)
- `password` = Dein MongoDB Password (aus Connect Tab)

### Beispiel:
```
MONGO_URI=mongodb://root:MySecurePassword123@mongodb.railway.internal:27017/fastpass?authSource=admin
```

---

## 🔍 Connection String Optionen

### Option 1: Private Networking (✅ EMPFOHLEN für Railway)
```
mongodb://username:password@mongodb.railway.internal:27017/fastpass?authSource=admin
```
- ✅ Nur innerhalb Railway
- ✅ Schneller
- ✅ Sicherer
- ✅ Keine Firewall Issues

### Option 2: Public Networking (für externe Tests)
```
mongodb://username:password@centerbeam.proxy.rlwy.net:55512/fastpass?authSource=admin
```
- ✅ Von überall erreichbar
- ❌ Langsamer
- ❌ Sicherheitsrisiko
- ❌ Braucht Netzwerk Konfiguration

---

## 📝 Lokale Entwicklung

### Wenn du lokal MongoDB laufen hast:

`backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/fastpass
```

### Wenn du Railway MongoDB lokal nutzen möchtest:

`backend/.env`:
```
MONGO_URI=mongodb://username:password@centerbeam.proxy.rlwy.net:55512/fastpass?authSource=admin
```

---

## 🧪 Connection Test

### MongoDB Connection testen

Lokal mit `mongosh`:
```bash
mongosh "mongodb+srv://username:password@centerbeam.proxy.rlwy.net:55512/fastpass"
```

### In Node.js Code:
```javascript
import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI;
console.log('Connecting to:', mongoUri);

await mongoose.connect(mongoUri);
console.log('✅ MongoDB connected!');
```

---

## 🆘 Häufige Probleme

### Problem: "connect ECONNREFUSED"
**Ursache:** MongoDB läuft nicht oder Connection String falsch
**Lösung:**
1. Überprüfe Railway MongoDB Service läuft
2. Überprüfe `MONGO_URI` Variable
3. Überprüfe Username/Password

### Problem: "authentication failed"
**Ursache:** Username oder Password falsch
**Lösung:**
1. Gehe zu Railway MongoDB → Connect
2. Kopiere genaue Credentials
3. Überprüfe `authSource=admin`

### Problem: "getaddrinfo ENOTFOUND mongodb.railway.internal"
**Ursache:** Backend läuft nicht auf Railway (nur lokal möglich)
**Lösung:**
1. Backend muss auf Railway deployed sein
2. Private Networking funktioniert nur zwischen Railway Services
3. Lokal nutze: `mongodb://localhost:27017`

---

## 📋 Railway MongoDB Service Setup Checkliste

- [ ] MongoDB Service erstellt in Railway
- [ ] Public/Private Networking angeschaut
- [ ] Credentials notiert (Username, Password)
- [ ] `MONGO_URI` in Backend Variables gesetzt
- [ ] Backend redeploy
- [ ] Teste: Dashboard → Add Button sollte funktionieren

---

## 🔐 Sicherheit

### Best Practices:
- ✅ Nutze Private Networking (nur Railway intern)
- ✅ Ändere MongoDB Default Password
- ✅ Nutze komplexes Password (>12 Zeichen)
- ❌ Keine Credentials in Git!
- ❌ Keine Public Networking wenn nicht nötig

### Backup:
- Railway managed das automatisch
- Keine zusätzliche Konfiguration nötig

---

## 📊 Wichtige URLs

| Was | URL/Host | Port | Netzwerk |
|-----|----------|------|----------|
| Private (Backend) | `mongodb.railway.internal` | 27017 | Private ✅ |
| Public (Tests) | `centerbeam.proxy.rlwy.net` | 55512 | Public |

---

## 🎯 TLDR - Schnelle Lösung

1. **Gehe zu Railway MongoDB Service → Connect**
2. **Kopiere Connection String mit Credentials**
3. **Setze `MONGO_URI` in Backend Variables**
   ```
   mongodb://username:password@mongodb.railway.internal:27017/fastpass?authSource=admin
   ```
4. **Backend redeploy**
5. **Fertig!** ✅

---

## 💡 Tipps

### Mehrere Datenbanken?
Ändere DB Name im Connection String:
```
mongodb://user:pass@host:27017/database_name
                               ^^^^^^^^^^^^^^
                              Ändere hier
```

### Connection Pool Größe?
```
mongodb://user:pass@host:27017/dbname?maxPoolSize=10&minPoolSize=5
```

### Timeout?
```
mongodb://user:pass@host:27017/dbname?serverSelectionTimeoutMS=5000
```

---

**Mehr Hilfe?** Siehe Discord OAuth & CORS Setup in anderen Docs!
