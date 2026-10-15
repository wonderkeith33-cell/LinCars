import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import supertest from 'supertest';
import app from '../server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'cars.json');

describe('LinCars Auto API Integration Tests', () => {
  let backupData;

  beforeEach(() => {
    backupData = fs.readFileSync(DATA_FILE, 'utf8');
  });

  afterEach(() => {
    fs.writeFileSync(DATA_FILE, backupData, 'utf8');
  });

  it('GET /api/cars - should return initial list of cars', async () => {
    const response = await supertest(app).get('/api/cars');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/cars?make=BMW - should filter cars by make', async () => {
    const response = await supertest(app).get('/api/cars?make=BMW');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.every(c => c.make.toLowerCase() === 'bmw')).toBe(true);
  });

  it('GET /api/cars?maxPrice=80000 - should filter cars by max price', async () => {
    const response = await supertest(app).get('/api/cars?maxPrice=80000');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.every(c => c.price <= 80000)).toBe(true);
  });

  it('GET /api/cars/:id - should return single car details', async () => {
    const response = await supertest(app).get('/api/cars/car-1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('car-1');
    expect(response.body.data.make).toBe('BMW');
  });

  it('POST /api/cars - should create a new car listing', async () => {
    const newVehicle = {
      make: 'Ferrari',
      model: '296 GTB',
      year: 2024,
      price: 320000,
      condition: 'New',
      bodyType: 'Coupe',
      fuelType: 'Hybrid',
      horsepower: 819
    };

    const response = await supertest(app)
      .post('/api/cars')
      .send(newVehicle);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.make).toBe('Ferrari');
    expect(response.body.data.price).toBe(320000);
    expect(response.body.data.id).toBeDefined();
  });

  it('POST /api/cars/compare - should calculate comparison matrix for given IDs', async () => {
    const response = await supertest(app)
      .post('/api/cars/compare')
      .send({ ids: ['car-1', 'car-2'] });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
    expect(response.body.comparisonSummary).toBeDefined();
    expect(response.body.comparisonSummary.priceDifference).toBeGreaterThan(0);
  });

  it('PUT /api/cars/:id - should update vehicle details', async () => {
    const response = await supertest(app)
      .put('/api/cars/car-1')
      .send({ price: 75000 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.price).toBe(75000);
  });

  it('DELETE /api/cars/:id - should remove vehicle listing', async () => {
    const response = await supertest(app).delete('/api/cars/car-1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const checkRes = await supertest(app).get('/api/cars/car-1');
    expect(checkRes.status).toBe(404);
  });
});
