# 🏏 Gems Cricket Game – Backend API

A production-ready Node.js REST API for the Gems Cricket game. Features OTP-based registration, JWT authentication, score management, score card image generation, and weekly leaderboard data.

---

## 📋 Assignment Summary

| Feature | Endpoint | Auth |
|---|---|---|
| Send OTP | `POST /api/auth/send-otp` | ❌ Public |
| Register | `POST /api/auth/register` | ❌ Public |
| Save Score | `POST /api/score/save` | ✅ JWT |
| Get Score Card | `GET /api/score/card` | ✅ JWT |
| Weekly Dashboard | `GET /api/score/weekly` | ✅ JWT |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (JavaScript) |
| Framework | Express.js |
| Database | MySQL 8 (mysql2/promise) |
| Auth | JWT (jsonwebtoken) |
| Image Generation | node-canvas |
| Validation | express-validator |
| Dev server | nodemon |

---

## 📁 Project Structure

```
gems-cricket-backend/
├── database/
│   └── schema.sql                  ← DB table creation script
├── postman/
│   └── Gems_Cricket_API.postman_collection.json
├── src/
│   ├── app.js                      ← Entry point
│   ├── config/
│   │   └── db.js                   ← MySQL connection pool
│   ├── controllers/
│   │   ├── auth.controller.js      ← OTP & Register logic
│   │   └── score.controller.js     ← Save, Card, Weekly logic
│   ├── middleware/
│   │   ├── auth.middleware.js      ← JWT verification
│   │   └── validate.middleware.js  ← express-validator errors
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── score.routes.js
│   ├── utils/
│   │   ├── jwt.util.js             ← Token signing helper
│   │   ├── scoreCard.util.js       ← JPEG image generator
│   │   └── week.util.js            ← Friday-Thursday week calc
│   └── validators/
│       ├── auth.validator.js
│       └── score.validator.js
├── uploads/
│   └── score_cards/                ← Auto-created, stores card JPEGs
├── .env                            ← Your env variables (not in git)
├── .env.example                    ← Template
├── .gitignore
└── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- MySQL 8 running locally (or remote)

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

Open MySQL client and run:

```bash
mysql -u root -p < database/schema.sql
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password   # ← Change this
DB_NAME=gems_cricket
JWT_SECRET=your_super_secret_key  # ← Change this
```

### 5. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000`.

---

## 🔌 API Reference

### Health Check

```
GET /health
```

---

### 1 – Send OTP

```
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Rules:**
- Phone must be exactly 10 digits
- OTP is hardcoded as **1234** (no real SMS gateway)
- OTP expires in **1 minute**
- OTP is **not** returned in the response

**Response:**
```json
{ "success": true, "message": "OTP sent successfully. It is valid for 1 minute." }
```

---

### 2 – Register

```
POST /api/auth/register
Content-Type: application/json

{
  "phone": "9876543210",
  "name": "Test User Name",
  "dob": "2000-05-15",
  "email": "testuser@example.com",
  "otp": "1234"
}
```

**Rules:**
- All fields are mandatory
- Phone must be unique in DB
- OTP must be valid and not expired; if expired, call send-otp again
- Returns JWT token on success

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "token": "eyJhbGci..."
}
```

---

### 3 – Save Score  *(JWT required)*

```
POST /api/score/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 350
}
```

**Rules:**
- Score must be an integer between **50 and 500**
- Maximum **3 submissions per day** (UTC) per user

**Response (201):**
```json
{ "success": true, "message": "Score saved successfully." }
```

---

### 4 – Get Score Card  *(JWT required)*

```
GET /api/score/card
Authorization: Bearer <token>
```

**Returns:** URL of a generated **1280×720 JPEG** image containing:
- User rank (left panel, black background)
- "Score Card" heading, user name (purple), total score, current date (right panel)

**Response (200):**
```json
{
  "success": true,
  "imageUrl": "http://localhost:3000/uploads/score_cards/scorecard_1_1714636800000.jpg"
}
```

---

### 5 – Weekly Dashboard  *(JWT required)*

```
GET /api/score/weekly
Authorization: Bearer <token>
```

**Rules:**
- Weeks run **Friday → Thursday**
- Week 1 started **6 February 2025**

**Response (200):**
```json
{
  "success": true,
  "weeks": [
    { "weekNo": 1, "rank": 1, "totalScore": 1500 },
    { "weekNo": 2, "rank": 3, "totalScore": 120 }
  ]
}
```

---

## 📬 Postman Collection

Import `postman/Gems_Cricket_API.postman_collection.json` into Postman.

The **Register** request automatically saves the returned `token` to the `{{token}}` collection variable so all subsequent authenticated requests work out of the box.

---

## 🗃 Database Script

Run `database/schema.sql` to create:

| Table | Purpose |
|---|---|
| `users` | Registered users (phone, name, dob, email) |
| `otps` | OTP records with expiry |
| `scores` | Individual game scores per user |

---

## 🔐 Security Notes

- Change `JWT_SECRET` and `DB_PASSWORD` in `.env` before deployment
- `.env` is in `.gitignore` – never commit secrets
- OTP is hardcoded (1234) as per assignment; replace with SMS gateway for production
