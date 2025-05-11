import { loadWinners } from './src/csv/parseWinnersAwards.js';

const winnersByProducer = await loadWinners();

console.log(JSON.stringify(winnersByProducer, null, 2));
