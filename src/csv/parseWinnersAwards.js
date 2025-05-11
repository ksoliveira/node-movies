import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import db from '../database/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'data', 'movielist.csv');

function splitProducers(producersCellString) {
  return producersCellString
    .split(/,| and /)
    .map(producer => producer.trim())
    .filter(producer => producer.length);
}

export async function loadWinners() {
  return new Promise((resolve, reject) => {
    const winnersByProducer = {};

    if (!fs.existsSync(csvPath)) {
      return reject({ message: 'CSV file not found' });
    }

    const insertMovie = db.prepare(`
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES (?, ?, ?, ?, ?)
    `);

    fs.createReadStream(csvPath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {

        insertMovie.run(
          parseInt(row.year),
          row.title,
          row.studios,
          row.producers,
          row.winner || 'no'
        );

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
      })
      .on('end', () => {
        resolve(winnersByProducer);
      })
      .on('error', (e) => {
        reject(e);
      });
  });
}