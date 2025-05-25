import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Switch,
  Box,
  Paper,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [slackStatus, setSlackStatus] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState([]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/todos');
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);


  const addTodo = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post('http://localhost:5000/todos', { text: newTask });
      setNewTask('');
      fetchTodos();
      toast.success('Todo added successfully!');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      fetchTodos();
      toast.success('Todo deleted successfully!');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo.');
    }
  };

  const toggleComplete = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}/complete`, {
        completed: newStatus,
      });
      fetchTodos();
      toast.success(`Marked as ${newStatus ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating task completion:', error);
      toast.error('Failed to update task');
    }
  };

  const fetchStats = async () => {
  try {
    const res = await axios.get('http://localhost:5000/todos/stats');
    setStats(res.data);
  } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Could not load stats');
    }
  };


  const fetchSummary = async () => {
    setSummaryLoading(true);
    setSlackStatus(null);
    try {
      const res = await axios.get('http://localhost:5000/todos/summary');
      setSummary(res.data.summary);
      toast.success('Summary generated and sent to Slack!');
      setSlackStatus('✅ Summary posted to Slack successfully!');
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setSummary('❌ Failed to generate summary');
      setSlackStatus('❌ Failed to post to Slack');
      toast.error('Failed to generate summary.');
    }
    setSummaryLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">📝 My Todo List</Typography>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Box>

        <Box display="flex" gap={1} mb={2}>
          <TextField
            fullWidth
            label="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button variant="contained" onClick={addTodo}>
            Add
          </Button>
        </Box>

        <Box mb={2}>
          <Button
            variant="outlined"
            color={showDelete ? 'secondary' : 'warning'}
            startIcon={<EditIcon />}
            onClick={() => setShowDelete(!showDelete)}
          >
            {showDelete ? 'Done' : 'Edit'}
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading todos...</Typography>
        ) : (
          <Paper>
            <List>
              {todos.map((todo) => (
                <ListItem
                  key={todo.id}
                  secondaryAction={
                    showDelete && (
                      <IconButton edge="end" color="error" onClick={() => deleteTodo(todo.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, !todo.completed)}
                  />
                  <ListItemText
                    primary={todo.task}
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? 'gray' : 'inherit',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={fetchSummary}>
            Generate Summary
          </Button>
        </Box>

        {summaryLoading ? (
          <Typography>Generating summary...</Typography>
        ) : summary ? (
          <Typography sx={{ mt: 2 }}><strong>Summary:</strong> {summary}</Typography>
        ) : null}

        {slackStatus && <Typography sx={{ mt: 1 }}>{slackStatus}</Typography>}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>📈 Weekly Completion Stats</Typography>
          {stats.length === 0 ? (
            <Typography>No data to display.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
