import express from 'express';
import pool from '../db.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const cohereApiKey = process.env.COHERE_API_KEY;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

// Create a new todo
router.post('/todos', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text field is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('DB INSERT ERROR:', error);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Get all todos
router.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('DB FETCH ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Update a todo
router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text field is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE todos SET task = $1 WHERE id = $2 RETURNING *',
      [text, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('DB UPDATE ERROR:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('DB DELETE ERROR:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Toggle completion with proper completed_at update
router.put('/todos/:id/complete', async (req, res) => {
  const { id } = req.params;

  try {
    // Get current completed status
    const fetchResult = await pool.query(
      'SELECT completed FROM todos WHERE id = $1',
      [id]
    );

    if (fetchResult.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const currentCompleted = fetchResult.rows[0].completed;
    const newCompleted = !currentCompleted;

    // Update completed and completed_at accordingly
    const updateResult = await pool.query(
      'UPDATE todos SET completed = $1, completed_at = $2 WHERE id = $3 RETURNING *',
      [
        newCompleted,
        newCompleted ? new Date() : null,
        id,
      ]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('TOGGLE COMPLETE ERROR:', error);
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
});

// Summary route with Cohere AI and Slack webhook integration
router.get('/todos/summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT task FROM todos ORDER BY id');
    const todos = result.rows.map(row => row.task);

    if (todos.length === 0) {
      return res.json({ summary: 'No todos found' });
    }

    const prompt = `Summarize the following to-do tasks into a concise and meaningful summary:\n\n${todos.join('\n')}`;

    const cohereRes = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = cohereRes.data.generations[0].text.trim();

    if (slackWebhookUrl) {
      try {
        await axios.post(slackWebhookUrl, {
          text: `📝 *AI-Generated Todo Summary*:\n${summary}`,
        });
      } catch (slackError) {
        console.error('Slack POST ERROR:', slackError.response?.data || slackError.message);
      }
    }

    res.json({ summary });

  } catch (error) {
    console.error('SUMMARY ERROR:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate AI summary' });
  }
});

// Stats route
// Toggle completion with simple logic
router.put('/todos/:id/complete', async (req, res) => {
  const { id } = req.params;

  try {
    // First get the current completed value
    const result = await pool.query(
      'SELECT completed FROM todos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const currentCompleted = result.rows[0].completed;
    const newCompleted = !currentCompleted;

    // Update both fields
    const updateResult = await pool.query(
      'UPDATE todos SET completed = $1, completed_at = $2 WHERE id = $3 RETURNING *',
      [newCompleted, newCompleted ? new Date() : null, id]
    );

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
});


export default router;
