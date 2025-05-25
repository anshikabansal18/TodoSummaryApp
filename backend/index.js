import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import todosRouter from './routes/todos.js';

dotenv.config();

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

const app = express();
app.use(cors());
app.use(express.json());

// Mount the router
app.use('/', todosRouter); // ✅ This is required!

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
