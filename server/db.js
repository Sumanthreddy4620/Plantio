import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

let client = null;
let database = null;

async function connectDb() {
  if (database) return database;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set. Please add it to your Render environment variables.');
  }

  client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  database = client.db('plantio');
  console.log('✅ Connected to MongoDB Atlas');

  // Create indexes for faster lookups
  await database.collection('users').createIndex({ email: 1 }, { unique: true });
  await database.collection('user_plants').createIndex({ userId: 1 });

  return database;
}

export const db = {
  // Find user by email
  async findUserByEmail(email) {
    const d = await connectDb();
    return d.collection('users').findOne({ email: email.toLowerCase() });
  },

  // Find user by id
  async findUserById(id) {
    const d = await connectDb();
    try {
      return d.collection('users').findOne({ _id: new ObjectId(String(id)) });
    } catch {
      return d.collection('users').findOne({ legacyId: Number(id) });
    }
  },

  // Create new user
  async createUser({ firstName, lastName, email, password }) {
    const d = await connectDb();
    const newUser = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };
    const result = await d.collection('users').insertOne(newUser);
    return { ...newUser, id: result.insertedId.toString() };
  },

  // Get user plants
  async getUserPlants(userId) {
    const d = await connectDb();
    const plants = await d.collection('user_plants').find({ userId: String(userId) }).toArray();
    return plants.map(p => ({ ...p, id: p._id.toString() }));
  },

  // Create plant
  async createPlant({ userId, title, text, imgUrl, wateringFrequency, lastWatered }) {
    const d = await connectDb();
    const newPlant = {
      userId: String(userId),
      title,
      text: text || '',
      imgUrl: imgUrl || '',
      wateringFrequency: String(wateringFrequency || 7),
      lastWatered: lastWatered || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    const result = await d.collection('user_plants').insertOne(newPlant);
    return { ...newPlant, id: result.insertedId.toString() };
  },

  // Delete plant
  async deletePlant(id, userId) {
    const d = await connectDb();
    try {
      const result = await d.collection('user_plants').deleteOne({
        _id: new ObjectId(String(id)),
        userId: String(userId)
      });
      return result.deletedCount > 0;
    } catch {
      return false;
    }
  },

  // Water plant
  async waterPlant(id, userId) {
    const d = await connectDb();
    const today = new Date().toISOString().split('T')[0];
    try {
      const result = await d.collection('user_plants').updateOne(
        { _id: new ObjectId(String(id)), userId: String(userId) },
        { $set: { lastWatered: today } }
      );
      return result.matchedCount > 0 ? today : null;
    } catch {
      return null;
    }
  },

  // Update plant / watering reminder
  async updatePlant(id, userId, { title, text, imgUrl, wateringFrequency, lastWatered }) {
    const d = await connectDb();
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (text !== undefined) updates.text = text;
    if (imgUrl !== undefined) updates.imgUrl = imgUrl;
    if (wateringFrequency !== undefined) updates.wateringFrequency = String(wateringFrequency);
    if (lastWatered !== undefined) updates.lastWatered = lastWatered;

    try {
      const result = await d.collection('user_plants').findOneAndUpdate(
        { _id: new ObjectId(String(id)), userId: String(userId) },
        { $set: updates },
        { returnDocument: 'after' }
      );
      if (!result) return null;
      return { ...result, id: result._id.toString() };
    } catch {
      return null;
    }
  }
};
