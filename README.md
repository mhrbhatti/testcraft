# TestCraft — Personal Test Paper Generator

Generate Class Tests, Revision Tests, and FLPs from your question bank. Export to PDF and Word.

---

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)
- (Optional) MongoDB Compass to browse data

---

## Setup — First Time

### 1. Install server dependencies
```bash
cd server
npm install
```

### 2. Install client dependencies
```bash
cd ../client
npm install
```

### 3. Seed the question bank
```bash
cd ../server
node scripts/seed.js
```
This adds ~50 sample Computer Science questions across Python Basics, SDLC, and Databases.

---

## Run the App

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## Usage

### Adding Your Own Questions
- Go to **Add Question** in the sidebar
- Fill in: type (MCQ/Short/Long), chapter, difficulty, marks, question text
- For MCQs: enter all 4 options and select the correct answer

### Bulk Import (Excel/JSON)
You can POST to `/api/questions/bulk` with an array of question objects.
Use tools like Postman or write a quick script to import from Excel via `xlsx` npm package.

### Generating a Test
1. Go to **Generate Test**
2. Select test type (Class Test / Revision Test / FLP)
3. Choose subject, difficulty, chapters
4. Click **Generate Paper**
5. Preview the paper on screen
6. Download as **PDF** or **Word**

### Saved Papers
All generated papers are saved automatically. Go to **Saved Papers** to download them again anytime.

---

## Test Schemas

| Type          | Total Marks | MCQs | Shorts     | Longs   |
|---------------|-------------|------|------------|---------|
| Class Test    | 25          | 5×1  | 5×2        | 1×8     |
| Revision Test | 30          | 8×1  | 7×2        | 1×8     |
| FLP           | 50          | 10×1 | 3 groups×6 | 3 (att.2)|

---

## Project Structure

```
testcraft/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── engine/          # Generator logic + schemas
│   ├── templates/       # HTML template for PDF
│   └── scripts/seed.js  # Sample data
├── client/
│   └── src/
│       ├── pages/       # React pages
│       └── App.jsx      # Router + sidebar
└── README.md
```

---

## API Reference

| Method | Endpoint                     | Description                |
|--------|------------------------------|----------------------------|
| GET    | /api/questions               | List questions (filterable) |
| POST   | /api/questions               | Add one question           |
| POST   | /api/questions/bulk          | Bulk insert                |
| PUT    | /api/questions/:id           | Update question            |
| DELETE | /api/questions/:id           | Delete question            |
| GET    | /api/questions/subjects      | All subjects               |
| GET    | /api/questions/chapters      | All chapters               |
| GET    | /api/questions/stats/overview| Dashboard stats            |
| POST   | /api/generate                | Generate + save paper      |
| GET    | /api/generate/papers         | List saved papers          |
| GET    | /api/generate/papers/:id     | Get paper with snapshot    |
| DELETE | /api/generate/papers/:id     | Delete paper               |
| GET    | /api/export/pdf/:paperId     | Download PDF               |
| GET    | /api/export/word/:paperId    | Download Word (.docx)      |
