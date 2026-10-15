import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'cars.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper function to read cars
function readCarsData() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading cars file:', err);
    return [];
  }
}

// Helper function to write cars
function writeCarsData(cars) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cars, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing cars file:', err);
    return false;
  }
}

// GET /api/cars - List vehicles with optional search/filter params
app.get('/api/cars', (req, res) => {
  let cars = readCarsData();
  const { make, model, minPrice, maxPrice, year, minYear, maxYear, condition, bodyType, fuelType, query } = req.query;

  if (make) {
    cars = cars.filter(c => c.make.toLowerCase() === make.toString().toLowerCase());
  }

  if (model) {
    cars = cars.filter(c => c.model.toLowerCase().includes(model.toString().toLowerCase()));
  }

  if (minPrice) {
    cars = cars.filter(c => c.price >= Number(minPrice));
  }

  if (maxPrice) {
    cars = cars.filter(c => c.price <= Number(maxPrice));
  }

  if (year) {
    cars = cars.filter(c => c.year === Number(year));
  }

  if (minYear) {
    cars = cars.filter(c => c.year >= Number(minYear));
  }

  if (maxYear) {
    cars = cars.filter(c => c.year <= Number(maxYear));
  }

  if (condition && condition !== 'All') {
    cars = cars.filter(c => c.condition.toLowerCase() === condition.toString().toLowerCase());
  }

  if (bodyType && bodyType !== 'All') {
    cars = cars.filter(c => c.bodyType.toLowerCase() === bodyType.toString().toLowerCase());
  }

  if (fuelType && fuelType !== 'All') {
    cars = cars.filter(c => c.fuelType.toLowerCase() === fuelType.toString().toLowerCase());
  }

  if (query) {
    const q = query.toString().toLowerCase();
    cars = cars.filter(c =>
      c.make.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.exteriorColor?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: cars.length,
    data: cars
  });
});

// GET /api/cars/:id - Get detailed vehicle specs by ID
app.get('/api/cars/:id', (req, res) => {
  const cars = readCarsData();
  const car = cars.find(c => c.id === req.params.id);

  if (!car) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  res.json({ success: true, data: car });
});

// POST /api/cars - Add new vehicle listing
app.post('/api/cars', (req, res) => {
  const cars = readCarsData();
  const newCar = req.body;

  if (!newCar.make || !newCar.model || !newCar.price || !newCar.year) {
    return res.status(400).json({ success: false, message: 'Make, model, year, and price are required.' });
  }

  newCar.id = `car-${Date.now()}`;
  newCar.price = Number(newCar.price);
  newCar.year = Number(newCar.year);
  newCar.mileage = Number(newCar.mileage || 0);
  newCar.horsepower = Number(newCar.horsepower || 0);
  newCar.images = Array.isArray(newCar.images) && newCar.images.length > 0
    ? newCar.images
    : ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'];
  newCar.features = Array.isArray(newCar.features) ? newCar.features : [];
  newCar.seller = newCar.seller || { name: 'Verified Seller', type: 'Private', phone: '+1 (555) 000-0000', rating: 5.0 };

  cars.unshift(newCar);
  writeCarsData(cars);

  res.status(201).json({ success: true, data: newCar });
});

// PUT /api/cars/:id - Update existing vehicle listing
app.put('/api/cars/:id', (req, res) => {
  const cars = readCarsData();
  const index = cars.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  const updatedCar = {
    ...cars[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : cars[index].price,
    year: req.body.year !== undefined ? Number(req.body.year) : cars[index].year,
    mileage: req.body.mileage !== undefined ? Number(req.body.mileage) : cars[index].mileage,
    horsepower: req.body.horsepower !== undefined ? Number(req.body.horsepower) : cars[index].horsepower
  };

  cars[index] = updatedCar;
  writeCarsData(cars);

  res.json({ success: true, data: updatedCar });
});

// DELETE /api/cars/:id - Delete vehicle listing
app.delete('/api/cars/:id', (req, res) => {
  let cars = readCarsData();
  const initialLength = cars.length;
  cars = cars.filter(c => c.id !== req.params.id);

  if (cars.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  writeCarsData(cars);
  res.json({ success: true, message: 'Vehicle removed successfully' });
});

// POST /api/cars/compare - Price comparison and spec delta calculator
app.post('/api/cars/compare', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({ success: false, message: 'Specify at least two vehicle IDs to compare' });
  }

  const cars = readCarsData();
  const comparedCars = cars.filter(c => ids.includes(c.id));

  if (comparedCars.length < 2) {
    return res.status(404).json({ success: false, message: 'Selected vehicles for comparison could not be found' });
  }

  // Calculate comparison highlights
  const minPrice = Math.min(...comparedCars.map(c => c.price));
  const maxPrice = Math.max(...comparedCars.map(c => c.price));
  const maxHorsepower = Math.max(...comparedCars.map(c => c.horsepower || 0));

  res.json({
    success: true,
    data: comparedCars,
    comparisonSummary: {
      lowestPriceId: comparedCars.find(c => c.price === minPrice)?.id,
      highestPriceId: comparedCars.find(c => c.price === maxPrice)?.id,
      priceDifference: maxPrice - minPrice,
      highestHorsepowerId: comparedCars.find(c => c.horsepower === maxHorsepower)?.id
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`LinCars Auto API running on http://localhost:${PORT}`);
  });
}

export default app;
