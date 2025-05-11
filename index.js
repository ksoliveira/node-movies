import app from './src/app.js';
import { insertMoviesFromCSV } from './src/csv/moviesFromCSV.js';

const PORT = process.env.PORT || 3000;

insertMoviesFromCSV()
  .catch((err) => {
    console.error('Error:', err);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Runing in http://localhost:${PORT}/producers/intervals`);
    });
  });
