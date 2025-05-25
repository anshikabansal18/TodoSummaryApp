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
```

## 2. 🛠️ Backend Setup

### a. Install dependencies

```bash
cd server  
npm install
```
### b. Create .env file in server/
```bash
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
COHERE_API_KEY=your_cohere_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
```
### c. Initialize PostgreSQL database
```bash
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP
);
```

### d. Start the backend server
```bash
npm run dev
```
## 3. 💻 Frontend Setup
### a. Install dependencies
```bash
Copy
Edit
cd ../client
npm install
```
## b. Start the frontend
```bash
Copy
Edit
npm start
```
Frontend will run on: http://localhost:3000

## 🤖 LLM (Cohere) Setup
Sign up at Cohere

Generate an API Key

Add the key to your .env file under COHERE_API_KEY

The /todos/summary route:

Sends a prompt to Cohere to summarize your current todos

Returns the result

Posts it to Slack if SLACK_WEBHOOK_URL is configured

## 📣 Slack Webhook Setup
Go to your Slack workspace

Search for "Incoming Webhooks" in Slack Apps and install it

Configure it and select the channel to post summaries in

Copy the webhook URL and paste it in your .env as SLACK_WEBHOOK_URL

✅ Example Slack message:
pgsql
Copy
Edit
📝 AI-Generated Todo Summary

• Finish coding assignment  
• Submit project to GitHub  
• Attend AI webinar

## 🧠 Design Decisions & Architecture
**Modular Structure:** Backend logic is organized in routes/todos.js with DB logic separated via a shared pool.

**LLM Integration:** Offloaded AI summarization to Cohere for low-latency responses without hosting models.

**Slack Notifications:** Simple one-way push using Slack Incoming Webhooks — no OAuth required.

**PostgreSQL:** Chosen for structured querying and easy aggregate operations (like daily stats).

**Frontend–Backend Separation:** Clean decoupling allows for independent deployment or containerization.
