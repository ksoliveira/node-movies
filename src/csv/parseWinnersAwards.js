import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import db from '../database/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'data', 'movielist.csv');

function listMovies() {
  return new Promise((resolve, reject) => {
    try {
      const rows = db.prepare('SELECT * FROM movies').all();
      resolve(rows);
    } catch (err) {
      reject(err);
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
            console.error(`Eror row: ${JSON.stringify(row)} - ${err.message}`);
          }})
        });
        resolve(winnersByProducer);
      })
      .catch((err) => {
        reject(err);
      });
}