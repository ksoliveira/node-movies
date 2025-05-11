import app from './src/app.js';
import { loadWinners } from './src/csv/parseWinnersAwards.js';

const PORT = process.env.PORT || 3000;

loadWinners()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Runing in http://localhost:${PORT}/producers/intervals`);
    });
  })
  .catch((err) => {
    // TODO:: Retornar erro tratado em json
    console.error('Error:', err);
  });
