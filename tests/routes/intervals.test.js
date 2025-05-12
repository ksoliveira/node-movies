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

  it('deve retornar 200 eencontrar min e max mesmo com separação de nomes por vírgula ou and', async () => {
    db.exec(`
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES
        (1980, 'Movie 1', 'Studio 1', 'John, Producer 1', 'yes'),
        (1981, 'Movie 2', 'Studio 2', 'Mike and Producer 1', 'yes'),
        (1980, 'Movie 3', 'Studio 3', 'Evander Mint, Lincoln, Malcon and Producer 2', 'yes'),
        (1920, 'Movie 4', 'Studio 4', 'Producer 2', 'yes');
    `);

    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body.min.length).toEqual(1);
    expect(response.body.min[0].previousWin).toEqual(1980);
    expect(response.body.min[0].followingWin).toEqual(1981);
    expect(response.body.min[0].interval).toEqual(1);
    expect(response.body.min[0].producer).toEqual('Producer 1');
    
    expect(response.body).toHaveProperty('max');
    expect(response.body.max.length).toEqual(1);
    expect(response.body.max[0].previousWin).toEqual(1920);
    expect(response.body.max[0].followingWin).toEqual(1980);
    expect(response.body.max[0].interval).toEqual(60);
    expect(response.body.max[0].producer).toEqual('Producer 2');
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

  it('deve retornar 200 e mostrar "Producer 1" como min e max 2 vezes', async () => {
    // São dois intervalos de 10 anos.
    // Como são intervalos iguais, entendo que ele é o mínimo e o máximo
    // Também entendo que deva aparecer duas vezes nos arrays "min" e "max" porque apesar do interval ser igual, muda o previousWin e o followingWin. 
        // Portanto, pode ser um dado importante a ser consultado pelos usuários da API
    db.exec(`
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES
        (1980, 'Movie 1', 'Studio 1', 'Producer 1', 'yes'),
        (1990, 'Movie 2', 'Studio 2', 'Producer 1', 'yes'),
        (2000, 'Movie 3', 'Studio 3', 'Producer 1', 'yes');
    `);
  
    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(200);
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

  it('deve retornar 405 para o método POST', async () => {
    const response = await request(app).post('/producers/intervals');
    expect(response.status).toBe(405);
    expect(response.body).toEqual({ error: 'Method Not Allowed' });
  });

  it('deve retornar 405 para o método DELETE', async () => {
    const response = await request(app).delete('/producers/intervals');
    expect(response.status).toBe(405);
    expect(response.body).toEqual({ error: 'Method Not Allowed' });
  });

  it('deve retornar 405 para o método PUT', async () => {
    const response = await request(app).put('/producers/intervals');
    expect(response.status).toBe(405);
    expect(response.body).toEqual({ error: 'Method Not Allowed' });
  });

  it('deve retornar 405 para o método PATCH', async () => {
    const response = await request(app).patch('/producers/intervals');
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

  it('deve retornar 500 se a tabela não existir', async () => {
    db.exec('DROP TABLE IF EXISTS movies');
  
    const response = await request(app).get('/producers/intervals');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error.' });
  });
});