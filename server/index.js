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
    // ── 0a. iNaturalist PLANT CATALOG PROXY (list + search) ──
    // No API key required. Rate limit: 100 req/min (not per day).
    if (pathname === '/api/external-plants' && req.method === 'GET') {
      const page = Number(url.searchParams.get('page') || '1');
      const search = url.searchParams.get('search') || '';
      const perPage = 30;

      // iNaturalist taxa endpoint — filter to Plantae kingdom (id 47126)
      const inatUrl = `https://api.inaturalist.org/v1/taxa?` + new URLSearchParams({
        q: search || 'plant',
        rank: 'species',
        iconic_taxa: 'Plantae',
        per_page: perPage,
        page: page,
        locale: 'en',
        preferred_place_id: 1 // worldwide
      });

      try {
        const inatRes = await fetch(inatUrl, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' }
        });
        const inatData = await inatRes.json();

        if (inatData && Array.isArray(inatData.results)) {
          const mappedPlants = inatData.results
            .filter(item => item.preferred_common_name) // only include plants with common names
            .map(item => ({
              id: `inat_${item.id}`,
              title: item.preferred_common_name
                ? item.preferred_common_name.charAt(0).toUpperCase() + item.preferred_common_name.slice(1)
                : item.name,
              text: item.name || '',
              category: item.iconic_taxon_name || 'Plant',
              img: {
                src: item.default_photo?.medium_url || null,
                alt: item.preferred_common_name || item.name || 'Plant'
              },
              watering: 'Regular',
              light: 'Varies by species',
              difficulty: 'Moderate',
              toxicity: 'Check plant label',
              description: item.wikipedia_summary || null,
              wikipediaUrl: item.wikipedia_url || null
            }));

          const totalResults = inatData.total_results || 0;
          const lastPage = Math.ceil(totalResults / perPage);

          return sendJson(200, {
            total: totalResults,
            lastPage,
            page,
            plants: mappedPlants
          });
        }

        return sendJson(500, { error: 'Unexpected iNaturalist API response.' });
      } catch (err) {
        return sendJson(500, { error: `iNaturalist API error: ${err.message}` });
      }
    }

    // ── 0b. iNaturalist SINGLE PLANT DETAIL ──
    if (pathname.startsWith('/api/external-plants/') && req.method === 'GET') {
      const rawId = pathname.split('/')[3]; // e.g. "inat_12345"
      const numericId = rawId.startsWith('inat_') ? rawId.replace('inat_', '') : rawId;

      try {
        const detailRes = await fetch(
          `https://api.inaturalist.org/v1/taxa/${numericId}`,
          { headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' } }
        );
        const detailData = await detailRes.json();
        const detail = detailData.results?.[0];

        if (!detail) {
          return sendJson(404, { error: 'Plant not found in iNaturalist.' });
        }

        const plant = {
          id: `inat_${detail.id}`,
          title: detail.preferred_common_name
            ? detail.preferred_common_name.charAt(0).toUpperCase() + detail.preferred_common_name.slice(1)
            : detail.name,
          text: detail.name || '',
          category: detail.iconic_taxon_name || 'Plant',
          img: {
            src: detail.default_photo?.medium_url || null,
            alt: detail.preferred_common_name || detail.name || 'Plant'
          },
          description: detail.wikipedia_summary || null,
          watering: 'Regular',
          light: 'Varies by species',
          soil: 'Well-draining',
          difficulty: 'Moderate',
          toxicity: 'Check plant label',
          height: null,
          wikipediaUrl: detail.wikipedia_url || null,
        };

        return sendJson(200, { plant });
      } catch (err) {
        return sendJson(500, { error: `iNaturalist detail API error: ${err.message}` });
      }
    }

    // ── 0c. iNaturalist PLANT DISEASES & PESTS PROXY ──
    if (pathname === '/api/external-diseases' && req.method === 'GET') {
      const page = Number(url.searchParams.get('page') || '1');
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || 'All';
      const perPage = 24;

      // Determine query search term
      let queryTerm = search.trim();
      if (!queryTerm) {
        if (category === 'Pest') queryTerm = 'aphid';
        else if (category === 'Disease') queryTerm = 'mildew';
        else queryTerm = 'pest';
      }

      const inatUrl = `https://api.inaturalist.org/v1/taxa?` + new URLSearchParams({
        q: queryTerm,
        per_page: perPage,
        page: page,
        locale: 'en',
        preferred_place_id: 1
      });

      try {
        const inatRes = await fetch(inatUrl, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' }
        });
        const inatData = await inatRes.json();

        if (inatData && Array.isArray(inatData.results)) {
          const mappedDiseases = inatData.results
            .filter(item => item.preferred_common_name || item.name)
            .map(item => {
              const commonName = item.preferred_common_name
                ? item.preferred_common_name.charAt(0).toUpperCase() + item.preferred_common_name.slice(1)
                : item.name;
              const isPest = (item.iconic_taxon_name === 'Insecta' || item.iconic_taxon_name === 'Arachnida' || commonName.toLowerCase().includes('bug') || commonName.toLowerCase().includes('aphid') || commonName.toLowerCase().includes('mite') || commonName.toLowerCase().includes('beetle'));
              const catLabel = isPest ? 'Pest' : 'Disease';

              return {
                id: `dis_inat_${item.id}`,
                title: commonName,
                text: item.name ? `Scientific name: ${item.name}` : 'Common plant issue',
                category: catLabel,
                severity: isPest ? 'Medium' : 'High',
                img: {
                  src: item.default_photo?.medium_url || null,
                  alt: commonName
                },
                symptoms: item.wikipedia_summary || `Noticeable discoloration, spots, or damage associated with ${commonName}. Inspect affected leaves and stems closely.`,
                treatment: isPest
                  ? `Spray affected foliage with neem oil or insecticidal soap. Isolate plant and manually remove visible pests.`
                  : `Prune severely infected leaves. Apply copper-based fungicide or neem oil solution. Improve airflow around the plant.`,
                prevention: `Inspect plants weekly, avoid overhead watering, ensure proper spacing, and maintain clean potting soil.`,
                wikipediaUrl: item.wikipedia_url || null
              };
            });

          const totalResults = inatData.total_results || 0;
          const lastPage = Math.ceil(totalResults / perPage);

          return sendJson(200, {
            total: totalResults,
            lastPage,
            page,
            diseases: mappedDiseases
          });
        }

        return sendJson(500, { error: 'Unexpected iNaturalist disease API response.' });
      } catch (err) {
        return sendJson(500, { error: `Disease API error: ${err.message}` });
      }
    }

    // ── 0d. SINGLE PLANT DISEASE/PEST DETAIL PROXY ──
    if (pathname.startsWith('/api/external-diseases/') && req.method === 'GET') {
      const rawId = pathname.split('/')[3];
      const numericId = rawId.startsWith('dis_inat_') ? rawId.replace('dis_inat_', '') : rawId;

      try {
        const detailRes = await fetch(
          `https://api.inaturalist.org/v1/taxa/${numericId}`,
          { headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' } }
        );
        const detailData = await detailRes.json();
        const detail = detailData.results?.[0];

        if (!detail) {
          return sendJson(404, { error: 'Problem not found in API.' });
        }

        const commonName = detail.preferred_common_name
          ? detail.preferred_common_name.charAt(0).toUpperCase() + detail.preferred_common_name.slice(1)
          : detail.name;
        const isPest = (detail.iconic_taxon_name === 'Insecta' || detail.iconic_taxon_name === 'Arachnida' || commonName.toLowerCase().includes('bug') || commonName.toLowerCase().includes('aphid') || commonName.toLowerCase().includes('mite') || commonName.toLowerCase().includes('beetle'));

        const disease = {
          id: `dis_inat_${detail.id}`,
          title: commonName,
          text: detail.name ? `Scientific classification: ${detail.name}` : 'Plant problem details',
          category: isPest ? 'Pest' : 'Disease',
          severity: isPest ? 'Medium' : 'High',
          img: {
            src: detail.default_photo?.medium_url || null,
            alt: commonName
          },
          symptoms: detail.wikipedia_summary || `Symptoms include visible structural damage, spots, or abnormal growth patterns caused by ${commonName}.`,
          treatment: isPest
            ? `Apply organic insecticidal soap or neem oil spray. Quarantine affected plant and gently wipe leaves with a moist cloth.`
            : `Remove heavily infected foliage immediately. Spray with copper-based or sulfur-based fungicide. Ensure foliage dries quickly after watering.`,
          prevention: `Maintain good airflow, avoid water pooling on leaves, use clean pots, and isolate new plants before introducing them to your garden.`,
          wikipediaUrl: detail.wikipedia_url || null
        };

        return sendJson(200, { disease });
      } catch (err) {
        return sendJson(500, { error: `Disease detail API error: ${err.message}` });
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
