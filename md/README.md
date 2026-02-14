# Meeting Action Items Tracker

## Project Structure

Root Folder: `meet-task-tracker`

The project is divided into three main directories:

```
meet-task-tracker/
│
├── client/     → Frontend (React + Vite)
├── server/     → Backend (Node.js + Express, MVC structure)
├── md/         → Documentation files
```

---

## Tech Stack

### Frontend (client)

* React (Vite)
* TailwindCSS
* React Router DOM
* Framer Motion
* Hosted on Vercel

### Backend (server)

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* OpenAI (gpt-4o-mini)
* Resend (email service)
* Regex-based validation
* Hosted on Vercel

Architecture follows a simple MVC pattern:

* Routes
* Controllers
* Services
* Models

---

## Features Implemented

* Paste meeting transcript
* Extract action items (task + owner + due date if found)
* Edit action items
* Add new action items manually
* Delete action items
* Mark items as done / undone
* Filter by Open / Done
* View last 5 processed transcripts
* Backend `/status` health endpoint
* Basic empty/wrong input validation
* Secure environment variable handling

---

## What Is Done

* Full transcript → LLM → structured JSON flow
* Transcript + action items stored in MongoDB
* Complete CRUD for action items
* Health check endpoint for backend, database, and LLM
* Frontend fully connected to backend APIs
* Deployed and working

---

## What Is Not Done (Intentional Scope Limitations)
```
All the required steps from the assignment are fully completed. On top of that, I’ve also added a few extra features from my side to improve the overall experience and functionality.
```

---

## How To Run Locally

### 1. Clone Repository

```
git clone <your-repo-link>
cd meet-task-tracker
```

---

### 2. Setup Backend

```
cd server
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 3. Setup Frontend

Open a new terminal:

```
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside both `server/` and `client/` as needed.

Refer to `.env.example` for required variables.

Important:

* No API keys are committed to the repository.
* All secrets are managed via environment variables.

---

## Deployment

* Frontend: Vercel
* Backend: Vercel (serverless functions)
* MongoDB: MongoDB Atlas

The live application remains hosted for review.

---

## Summary

This project demonstrates:

* Clean separation of frontend and backend
* Structured LLM usage (JSON-only extraction)
* Practical CRUD implementation
* Basic system health monitoring
* Secure environment handling
* Deployment readiness
