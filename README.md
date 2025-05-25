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

