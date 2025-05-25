import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Summarize route not implemented yet' });
});

export default router;
