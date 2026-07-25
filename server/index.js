import http from 'http';
import crypto from 'crypto';
import { db } from './db.js';

const PORT = process.env.PORT || 5000;

// Active session token store: token -> userObj
const activeTokens = new Map();

// Helper to set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Hash password with pbkdf2
function hashPassword(password) {
  const salt = 'plantio_salt_2025';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Generate Auth Token (stateless HMAC token)
function generateToken(userObj) {
  const payload = Buffer.from(JSON.stringify({ id: userObj.id, email: userObj.email })).toString('base64');
  const signature = crypto.createHmac('sha256', 'plantio_secret_key_2025').update(payload).digest('hex');
  return `${payload}.${signature}`;
}

// Parse request JSON body
function getJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Helper to authenticate request
function authenticate(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', 'plantio_secret_key_2025').update(payload).digest('hex');
    if (signature !== expectedSig) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    const user = db.findUserById(decoded.id);
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // JSON helper
  const sendJson = (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  try {
    // ── 0. EXTERNAL PERENUAL API PROXY ──
    if (pathname === '/api/external-plants' && req.method === 'GET') {
      const apiKey = process.env.PERENUAL_API_KEY || url.searchParams.get('key');
      if (!apiKey) {
        return sendJson(400, {
          error: 'Perenual API key missing. Pass ?key=YOUR_KEY or set PERENUAL_API_KEY environment variable.'
        });
      }

      const page = url.searchParams.get('page') || '1';
      const perenualUrl = `https://perenual.com/api/species-list?key=${apiKey}&page=${page}`;

      try {
        const perenualRes = await fetch(perenualUrl);
        const perenualData = await perenualRes.json();

        if (perenualData && Array.isArray(perenualData.data)) {
          const mappedPlants = perenualData.data.map((item) => ({
            id: `perenual_${item.id}`,
            title: item.common_name ? item.common_name.charAt(0).toUpperCase() + item.common_name.slice(1) : (item.scientific_name?.[0] || 'Unknown Plant'),
            text: Array.isArray(item.scientific_name) ? item.scientific_name.join(', ') : item.scientific_name || '',
            category: item.cycle || 'Houseplants',
            img: {
              src: item.default_image?.medium_url || item.default_image?.regular_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
              alt: item.common_name || 'Plant'
            },
            watering: item.watering ? `Watering: ${item.watering}` : 'Regular watering',
            light: Array.isArray(item.sunlight) ? item.sunlight.join(', ') : item.sunlight || 'Indirect light',
            difficulty: 'Moderate',
            toxicity: 'Non-toxic'
          }));

          return sendJson(200, {
            total: perenualData.total,
            page: perenualData.current_page,
            plants: mappedPlants
          });
        }

        return sendJson(500, { error: 'Failed to format Perenual API response.' });
      } catch (err) {
        return sendJson(500, { error: `Perenual API Fetch error: ${err.message}` });
      }
    }
    // ── 1. SIGNUP ──
    if (pathname === '/api/signup' && req.method === 'POST') {
      const body = await getJsonBody(req);
      const { firstName, lastName, email, password } = body;

      if (!firstName || !lastName || !email || !password) {
        return sendJson(400, { error: 'All fields are required.' });
      }

      if (password.length < 8) {
        return sendJson(400, { error: 'Password must be at least 8 characters long.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existingUser = db.findUserByEmail(cleanEmail);
      if (existingUser) {
        return sendJson(400, { error: 'An account with this email already exists.' });
      }

      const hashedPassword = hashPassword(password);
      const newUser = db.createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        password: hashedPassword
      });

      const userObj = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      };
      const token = generateToken(userObj);

      return sendJson(201, {
        message: 'Account created successfully!',
        user: userObj,
        token
      });
    }

    // ── 2. LOGIN ──
    if (pathname === '/api/login' && req.method === 'POST') {
      const body = await getJsonBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJson(400, { error: 'Email and password are required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const user = db.findUserByEmail(cleanEmail);

      if (!user) {
        return sendJson(401, { error: 'Invalid email or password.' });
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return sendJson(401, { error: 'Invalid email or password.' });
      }

      const userObj = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
      const token = generateToken(userObj);

      return sendJson(200, {
        message: 'Login successful!',
        user: userObj,
        token
      });
    }

    // ── 3. GET USER PROFILE ──
    if (pathname === '/api/me' && req.method === 'GET') {
      const user = authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });
      return sendJson(200, { user });
    }

    // ── 4. GET USER PLANTS ──
    if (pathname === '/api/user-plants' && req.method === 'GET') {
      const user = authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });
      const plants = db.getUserPlants(user.id);
      return sendJson(200, { plants });
    }

    // ── 5. ADD USER PLANT ──
    if (pathname === '/api/user-plants' && req.method === 'POST') {
      const user = authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const body = await getJsonBody(req);
      const { title, text, imgUrl, wateringFrequency, lastWatered } = body;

      if (!title || !title.trim()) {
        return sendJson(400, { error: 'Plant title is required.' });
      }

      const newPlant = db.createPlant({
        userId: user.id,
        title: title.trim(),
        text: text || '',
        imgUrl: imgUrl || '',
        wateringFrequency: wateringFrequency || 7,
        lastWatered: lastWatered || new Date().toISOString().split('T')[0]
      });

      return sendJson(201, { message: 'Plant added successfully!', plant: newPlant });
    }

    // ── 6. DELETE USER PLANT ──
    if (pathname.startsWith('/api/user-plants/') && req.method === 'DELETE') {
      const user = authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const plantId = pathname.split('/')[3];
      const success = db.deletePlant(plantId, user.id);

      if (success) {
        return sendJson(200, { message: 'Plant deleted successfully.' });
      } else {
        return sendJson(404, { error: 'Plant not found.' });
      }
    }

    // ── 7. MARK WATERED ──
    if (pathname.startsWith('/api/user-plants/') && pathname.endsWith('/water') && req.method === 'PATCH') {
      const user = authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const plantId = pathname.split('/')[3];
      const lastWatered = db.waterPlant(plantId, user.id);

      if (lastWatered) {
        return sendJson(200, { message: 'Plant marked as watered!', lastWatered });
      } else {
        return sendJson(404, { error: 'Plant not found.' });
      }
    }

    // 404 Catch-all
    sendJson(404, { error: 'Endpoint not found.' });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(500, { error: 'Internal server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Plantio Database REST API Server running on http://localhost:${PORT}`);
});
