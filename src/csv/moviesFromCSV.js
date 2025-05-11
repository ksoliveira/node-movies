import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import db from '../database/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'data', 'movielist.csv');


export async function insertMoviesFromCSV() {
  return new Promise((resolve, reject) => {

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
      try {
        if (!row.year || !row.title || !row.studios || !row.producers) {
          console.warn(`Ignored invalid row: ${JSON.stringify(row)}`);
          return;
        }

        insertMovie.run(
          parseInt(row.year),
          row.title,
          row.studios,
          row.producers,
          row.winner || 'no'
        );
      } catch (err) {
        console.error(`Eror row: ${JSON.stringify(row)} - ${err.message}`);
      }})
      .on('end', () => {
        resolve();
      })
      .on('error', (e) => {
        reject(e);
      });
  });
}