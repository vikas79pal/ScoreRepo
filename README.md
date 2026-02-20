#  Gems Cricket Game – Backend API

A production-ready Node.js REST API for the Gems Cricket game. Features OTP-based registration, JWT authentication, score management, score card image generation, and weekly leaderboard data.

---

## Assignment Summary

Endpoints
| Send OTP | `POST /api/auth/send-otp`
| Register | `POST /api/auth/register` 
| Save Score | `POST /api/score/save`
| Get Score Card | `GET /api/score/card` 
| Weekly Dashboard | `GET /api/score/weekly` 

---

## Tech Stack
 Node.js (JavaScript) |
 Express.js |
 MySQL 8 (mysql2/promise) |
 JWT (jsonwebtoken) |
 node-canvas |
 Joi |
 nodemon |
 
---

##  Quick Start

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

Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password   
DB_NAME=gems_cricket
JWT_SECRET=your_super_secret_key  
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
- Weeks run **Friday to Thursday**
- Week 1 started ** As per the COde**

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

