import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/database/database.js';
import { jest } from '@jest/globals';

describe('GET /producers/intervals', () => {
  beforeEach(() => {
    db.exec('DELETE FROM movies');
  });

  it('deve retornar 200 e os intervalos de produtores', async () => {
    db.exec(`
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES
        (1980, 'Movie 1', 'Studio 1', 'Producer 1', 'yes'),
        (1981, 'Movie 2', 'Studio 2', 'Producer 1', 'yes'),
        (1980, 'Movie 3', 'Studio 3', 'Producer 2', 'yes'),
        (1920, 'Movie 4', 'Studio 4', 'Producer 2', 'yes');
    `);

    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
  });

  it('deve retornar 200 e ter dois produtores empatados no MIN e no MAX', async () => {
    db.exec(`
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES
        (1980, 'Movie 1', 'Studio 1', 'Producer 1', 'yes'),
        (1981, 'Movie 2', 'Studio 2', 'Producer 1', 'yes'),
        (1980, 'Movie 3', 'Studio 3', 'Producer 2', 'yes'),
        (1920, 'Movie 4', 'Studio 4', 'Producer 2', 'yes'),
        (1980, 'Movie 5', 'Studio 5', 'Producer 3', 'yes'),
        (1981, 'Movie 6', 'Studio 6', 'Producer 3', 'yes'),
        (1940, 'Movie 7', 'Studio 7', 'Producer 4', 'yes'),
        (2000, 'Movie 8', 'Studio 8', 'Producer 4', 'yes'),
        (2000, 'Movie 9', 'Studio 9', 'Producer 5', 'yes');
    `);

    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
    expect(response.body.min.length).toEqual(2);
    expect(response.body.max.length).toEqual(2);
  });

  it('deve retornar 204 se não houver intervalos', async () => {
    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(204);
  });

  it('deve retornar 404 para uma rota inexistente', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });

  it('deve retornar 405 para um método não permitido', async () => {
    const response = await request(app).post('/producers/intervals');
    expect(response.status).toBe(405);
    expect(response.body).toEqual({ error: 'Method Not Allowed' });
  });

  it('deve retornar 500 se ocorrer um erro interno', async () => {
    jest.spyOn(db, 'prepare').mockImplementation(() => {
      throw new Error('Error');
    });
  
    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error.' });
  
    db.prepare.mockRestore();
  });
});