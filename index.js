import { loadWinners } from './src/csv/parseWinnersAwards.js';
import { calculateIntervals } from './src/services/calculateIntervals.js';

const winnersByProducer = await loadWinners();

const intervals = calculateIntervals(winnersByProducer);

console.log(JSON.stringify(intervals, null, 2));