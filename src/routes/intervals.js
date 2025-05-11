import { Router } from 'express';
import { loadWinners } from '../csv/parseWinnersAwards.js';
import { calculateIntervals } from '../services/calculateIntervals.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const winnersByProducer = await loadWinners();
    const intervals = calculateIntervals(winnersByProducer);
    res.json(intervals);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;