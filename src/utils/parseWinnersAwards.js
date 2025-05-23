import db from '../database/database.js';

function listMovies() {
  return new Promise((resolve, reject) => {
    try {
      const rows = db.prepare('SELECT * FROM movies').all();
      resolve(rows);
    } catch (err) {
      reject(new Error('Database error - ' + err.message));
    }
  });
}

function splitProducers(producersCellString) {
  return producersCellString
    .split(/,| and /)
    .map(producer => producer.trim())
    .filter(producer => producer.length);
}

export async function loadWinners() {
  return new Promise((resolve, reject) => {
    const winnersByProducer = {};

    listMovies()
      .then((rows) => {
        rows.forEach((row) => {
          try {
            if (!row.year || !row.title || !row.studios || !row.producers) {
              console.warn(`Ignored invalid row: ${JSON.stringify(row)}`);
              return;
            }

            if (row.winner && row.winner.toLowerCase() === 'yes') {
              const year = parseInt(row.year);
              const producers = splitProducers(row.producers || '');

              producers.forEach((producer) => {
                if (!winnersByProducer[producer]) {
                  winnersByProducer[producer] = [];
                }
                winnersByProducer[producer].push(year);
              });
            }
          } catch (err) {
            console.error(`Error row: ${JSON.stringify(row)} - ${err.message}`);
          }
        });
        resolve(winnersByProducer);
      })
      .catch((err) => {
        reject(new Error(err.message));
      });
  });
}