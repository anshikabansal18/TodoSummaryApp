# ✅ Todo Summary Assistant

A fullstack web app to manage daily todos and generate AI-powered summaries using Cohere LLM. It also posts daily summaries to a Slack channel via webhook and shows daily completion stats.

---

## 🚀 Features

- Add, edit, delete todos
- Mark tasks as completed/incomplete
- Auto-summarize tasks using Cohere's LLM
- Post AI-generated summaries to Slack
- Visualize completion stats (e.g. number of completed tasks per weekday)

---

## 📦 Tech Stack

- **Frontend**: React (with hooks and Axios)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **LLM Integration**: [Cohere Generate API](https://docs.cohere.com/docs/generate)
- **Notifications**: Slack Incoming Webhook

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/todo-summary-assistant.git
cd todo-summary-assistant
## 2. 🛠️ Backend Setup

### a. Install dependencies

```bash
cd server
npm install
### b. Create .env file in server/:
env
Copy
Edit
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
COHERE_API_KEY=your_cohere_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
### c. Initialize PostgreSQL database
sql
Copy
Edit
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP
);
### d. Start backend server
bash
Copy
Edit
npm run dev
### 3. Frontend Setup
### a. Install dependencies
bash
Copy
Edit
cd ../client
npm install
### b. Start the frontend
bash
Copy
Edit
npm start
App will run on http://localhost:3000.

## 🤖 LLM (Cohere) Setup
Sign up at Cohere

Generate an API Key

Add it to your .env as COHERE_API_KEY=your_key_here

The summary route sends a prompt to Cohere to summarize all todos and returns the result. This is used in the UI and posted to Slack.

## 📣 Slack Webhook Setup
Go to your Slack workspace

Search for “Incoming Webhooks” in Slack Apps

Configure it and select the channel to post in

Copy the webhook URL and add it to your .env file under SLACK_WEBHOOK_URL

Example message sent:

## 📝 AI-Generated Todo Summary

Finish coding assignment

Submit project to GitHub

Attend AI webinar

## 🧠 Design Decisions & Architecture
Modular Structure: Backend logic is modularized in separate routes/todos.js and uses a shared DB pool.

LLM Integration: AI summarization is offloaded to Cohere for simplicity and fast prototyping.

Slack Notifications: One-way push to Slack via Incoming Webhooks – no OAuth needed.

PostgreSQL: Chosen for SQL-based analytics (e.g., weekday completion stats).

Frontend Separation: Kept React frontend and Node backend decoupled for flexibility in deployment.
