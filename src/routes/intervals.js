import { Router } from 'express';
import { loadWinners } from '../services/parseWinnersAwards.js';
import { calculateIntervals } from '../services/calculateIntervals.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const winnersByProducer = await loadWinners();
    const intervals = calculateIntervals(winnersByProducer);

    if (intervals.min?.length === 0 && intervals.max?.length === 0) {
      return res.status(204).send();
    }

    res.json(intervals);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;