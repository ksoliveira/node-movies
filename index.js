import app from './src/app.js';
import { loadWinners } from './src/csv/parseWinnersAwards.js';

const PORT = process.env.PORT || 3000;

loadWinners()
  .catch((err) => {
    console.error('Error:', err);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Runing in http://localhost:${PORT}/producers/intervals`);
    });
  });
