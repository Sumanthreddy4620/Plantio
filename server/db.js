import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'plantio_db.json');

// Initialize DB file if it doesn't exist
function initDb() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      users: [],
      user_plants: [],
      nextUserId: 1,
      nextPlantId: 1
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('✅ Created database file at:', dbPath);
  }
}

initDb();

function readDb() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return { users: [], user_plants: [], nextUserId: 1, nextPlantId: 1 };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

export const db = {
  // Find user by email
  findUserByEmail(email) {
    const data = readDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Create new user
  createUser({ firstName, lastName, email, password }) {
    const data = readDb();
    const newUser = {
      id: data.nextUserId++,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },

  // Get user plants
  getUserPlants(userId) {
    const data = readDb();
    return data.user_plants.filter(p => p.userId === userId);
  },

  // Create plant
  createPlant({ userId, title, text, imgUrl, wateringFrequency, lastWatered }) {
    const data = readDb();
    const newPlant = {
      id: data.nextPlantId++,
      userId,
      title,
      text: text || '',
      imgUrl: imgUrl || '',
      wateringFrequency: String(wateringFrequency || 7),
      lastWatered: lastWatered || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    data.user_plants.push(newPlant);
    writeDb(data);
    return newPlant;
  },

  // Delete plant
  deletePlant(id, userId) {
    const data = readDb();
    const index = data.user_plants.findIndex(p => p.id === Number(id) && p.userId === userId);
    if (index !== -1) {
      data.user_plants.splice(index, 1);
      writeDb(data);
      return true;
    }
    return false;
  },

  // Water plant
  waterPlant(id, userId) {
    const data = readDb();
    const plant = data.user_plants.find(p => p.id === Number(id) && p.userId === userId);
    if (plant) {
      const today = new Date().toISOString().split('T')[0];
      plant.lastWatered = today;
      writeDb(data);
      return today;
    }
    return null;
  }
};
