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

// Helper to derive human-friendly plant category from search, category param, and item names
function getPlantCategory(item, searchParam = '', categoryParam = '') {
  if (categoryParam && categoryParam !== 'All') return categoryParam;

  const queryLower = searchParam.toLowerCase();
  const titleLower = (item.preferred_common_name || item.common_name || '').toLowerCase();
  const nameLower = (item.name || '').toLowerCase();

  if (queryLower.includes('cactus')) return 'Cactuses';
  if (queryLower.includes('succulent')) return 'Succulents';
  if (queryLower.includes('flower') || queryLower.includes('rose')) return 'Flowers';
  if (queryLower.includes('tree')) return 'Trees';
  if (queryLower.includes('grass')) return 'Grasses';
  if (queryLower.includes('shrub')) return 'Shrubs';
  if (queryLower.includes('fern')) return 'Ferns';
  if (queryLower.includes('herb')) return 'Herbs';
  if (queryLower.includes('aquatic')) return 'Aquatics';
  if (queryLower.includes('mushroom')) return 'Mushrooms';
  if (queryLower.includes('weed')) return 'Weeds';

  if (titleLower.includes('cactus') || nameLower.includes('cactaceae')) return 'Cactuses';
  if (titleLower.includes('succulent') || titleLower.includes('aloe') || titleLower.includes('agave')) return 'Succulents';
  if (titleLower.includes('rose') || titleLower.includes('orchid') || titleLower.includes('tulip') || titleLower.includes('lily') || titleLower.includes('sunflower') || titleLower.includes('daisy') || titleLower.includes('violet') || titleLower.includes('yarrow') || titleLower.includes('plantain') || titleLower.includes('mullein') || titleLower.includes('pokeweed')) return 'Flowers';
  if (titleLower.includes('tree') || titleLower.includes('oak') || titleLower.includes('pine') || titleLower.includes('maple') || titleLower.includes('birch') || titleLower.includes('willow') || titleLower.includes('cedar') || titleLower.includes('spruce') || titleLower.includes('fir')) return 'Trees';
  if (titleLower.includes('fern')) return 'Ferns';
  if (titleLower.includes('grass') || titleLower.includes('bamboo')) return 'Grasses';
  if (titleLower.includes('shrub') || titleLower.includes('bush')) return 'Shrubs';
  if (titleLower.includes('herb') || titleLower.includes('mint') || titleLower.includes('basil') || titleLower.includes('thyme') || titleLower.includes('rosemary')) return 'Herbs';

  return 'Flowers';
}

// Helper to infer realistic botanical care details (watering, light, soil, toxicity, difficulty)
function getPlantCareDetails(item) {
  const common = (item.preferred_common_name || item.common_name || '').toLowerCase();
  const sci = (item.name || '').toLowerCase();
  const summary = (item.wikipedia_summary || '').toLowerCase();
  const combined = `${common} ${sci} ${summary}`;

  // 1. WATERING
  let watering = "Weekly — Water when top 1 inch dry";
  if (combined.includes('cactus') || combined.includes('succulent') || combined.includes('desert') || combined.includes('xerophyte') || sci.includes('cactaceae') || sci.includes('agavaceae')) {
    watering = "Low — Water every 2-3 weeks when soil is dry";
  } else if (combined.includes('aquatic') || combined.includes('swamp') || combined.includes('marsh') || combined.includes('bog') || combined.includes('fern') || combined.includes('damp')) {
    watering = "High — Keep soil consistently moist";
  } else if (combined.includes('tree') || combined.includes('shrub') || combined.includes('woody')) {
    watering = "Moderate — Deep water when top 2 inches dry";
  } else if (combined.includes('orchid') || combined.includes('epiphyte')) {
    watering = "Special — Soak roots & drain every 7-10 days";
  }

  // 2. LIGHT
  let light = "Bright indirect light";
  if (combined.includes('cactus') || combined.includes('succulent') || combined.includes('sunflower') || combined.includes('full sun') || combined.includes('meadow') || combined.includes('prairie')) {
    light = "Full direct sun (6+ hrs/day)";
  } else if (combined.includes('fern') || combined.includes('understory') || combined.includes('shade') || combined.includes('forest floor') || combined.includes('moss')) {
    light = "Medium to low indirect light";
  } else if (combined.includes('tree') || combined.includes('shrub') || combined.includes('flower')) {
    light = "Full sun to partial shade";
  }

  // 3. SOIL
  let soil = "Well-draining potting mix";
  if (combined.includes('cactus') || combined.includes('succulent') || sci.includes('cactaceae')) {
    soil = "Fast-draining gritty cactus mix";
  } else if (combined.includes('fern') || combined.includes('tropical') || combined.includes('peat')) {
    soil = "Rich, moisture-retentive peaty mix";
  } else if (combined.includes('orchid')) {
    soil = "Coarse bark & sphagnum moss mix";
  } else if (combined.includes('aquatic') || combined.includes('swamp') || combined.includes('marsh')) {
    soil = "Organic-rich wet aquatic soil";
  }

  // 4. TOXICITY
  let toxicity = "Non-toxic & Pet Safe";
  if (combined.includes('toxic') || combined.includes('poison') || combined.includes('milkweed') || combined.includes('oleander') || combined.includes('nightshade') || combined.includes('dieffenbachia') || combined.includes('euphorbia') || combined.includes('pokeweed')) {
    toxicity = "Toxic to pets & humans";
  } else if (combined.includes('fern') || combined.includes('peperomia') || combined.includes('calathea') || combined.includes('palm') || combined.includes('herb') || combined.includes('basil') || combined.includes('mint')) {
    toxicity = "Non-toxic & Pet Safe";
  } else {
    toxicity = "Slightly toxic if ingested";
  }

  // 5. DIFFICULTY
  let difficulty = "Moderate";
  if (combined.includes('cactus') || combined.includes('succulent') || combined.includes('easy') || combined.includes('hardy')) {
    difficulty = "Easy";
  } else if (combined.includes('orchid') || combined.includes('epiphyte') || combined.includes('delicate') || combined.includes('sensitive')) {
    difficulty = "Hard";
  }

  return { watering, light, soil, toxicity, difficulty };
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
      const categoryParam = url.searchParams.get('category') || 'All';
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
            .map(item => {
              const care = getPlantCareDetails(item);
              return {
                id: `inat_${item.id}`,
                title: item.preferred_common_name
                  ? item.preferred_common_name.charAt(0).toUpperCase() + item.preferred_common_name.slice(1)
                  : item.name,
                text: item.name || '',
                category: getPlantCategory(item, search, categoryParam),
                img: {
                  src: item.default_photo?.medium_url || null,
                  alt: item.preferred_common_name || item.name || 'Plant'
                },
                watering: care.watering,
                light: care.light,
                soil: care.soil,
                difficulty: care.difficulty,
                toxicity: care.toxicity,
                description: item.wikipedia_summary ? item.wikipedia_summary.replace(/<[^>]*>/g, '') : null,
                wikipediaUrl: item.wikipedia_url || null
              };
            });

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

        const care = getPlantCareDetails(detail);

        const plant = {
          id: `inat_${detail.id}`,
          title: detail.preferred_common_name
            ? detail.preferred_common_name.charAt(0).toUpperCase() + detail.preferred_common_name.slice(1)
            : detail.name,
          text: detail.name || '',
          category: getPlantCategory(detail),
          img: {
            src: detail.default_photo?.medium_url || null,
            alt: detail.preferred_common_name || detail.name || 'Plant'
          },
          description: detail.wikipedia_summary ? detail.wikipedia_summary.replace(/<[^>]*>/g, '') : null,
          watering: care.watering,
          light: care.light,
          soil: care.soil,
          difficulty: care.difficulty,
          toxicity: care.toxicity,
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
                symptoms: item.wikipedia_summary ? item.wikipedia_summary.replace(/<[^>]*>/g, '') : `Noticeable discoloration, spots, or damage associated with ${commonName}. Inspect affected leaves and stems closely.`,
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
          symptoms: detail.wikipedia_summary ? detail.wikipedia_summary.replace(/<[^>]*>/g, '') : `Symptoms include visible structural damage, spots, or abnormal growth patterns caused by ${commonName}.`,
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

    // ── 0e. BOTANICAL BLOG & GARDENING ARTICLES PROXY ──
    if (pathname === '/api/external-blogs' && req.method === 'GET') {
      const page = Number(url.searchParams.get('page') || '1');
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || 'All';
      const perPage = 12;
      const offset = (page - 1) * perPage;

      let searchTerm = search.trim();
      if (!searchTerm) {
        if (category === 'Watering') searchTerm = 'plant watering irrigation horticulture';
        else if (category === 'Diseases') searchTerm = 'plant disease pest control gardening';
        else if (category === 'Indoor Plants') searchTerm = 'houseplant indoor gardening cultivation';
        else if (category === 'Outdoor Plants') searchTerm = 'gardening landscaping botany pruning';
        else if (category === 'Plant Care') searchTerm = 'gardening plant care fertilizing soil';
        else searchTerm = 'horticulture gardening plant care';
      } else {
        searchTerm = `${searchTerm} plant care gardening`;
      }

      const wikiUrl = `https://en.wikipedia.org/w/api.php?` + new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: searchTerm,
        gsrlimit: perPage,
        gsroffset: offset,
        prop: 'pageimages|extracts',
        piprop: 'thumbnail',
        pithumbsize: 600,
        exintro: 1,
        explaintext: 1,
        format: 'json',
        origin: '*'
      });

      try {
        const wikiRes = await fetch(wikiUrl);
        const wikiData = await wikiRes.json();
        const pages = wikiData.query?.pages || {};
        const pageList = Object.values(pages);

        const mappedBlogs = pageList.map((item, idx) => {
          const title = item.title;
          const snippet = item.extract ? item.extract.slice(0, 140) + '...' : `Essential guide on ${title} for gardeners and plant enthusiasts.`;
          const cat = category !== 'All' ? category : (idx % 2 === 0 ? 'Plant Care' : 'Indoor Plants');
          const imgUrl = item.thumbnail?.source || null;

          return {
            id: `blog_live_${item.pageid}`,
            title: title,
            text: snippet,
            category: cat,
            img: imgUrl,
            readTime: `${4 + (idx % 4)} min read`,
            fullExtract: item.extract || snippet,
            wikipediaUrl: `https://en.wikipedia.org/?curid=${item.pageid}`
          };
        });

        const totalHits = wikiData.query?.searchinfo?.totalhits || mappedBlogs.length * 5;
        const lastPage = Math.ceil(totalHits / perPage);

        return sendJson(200, {
          total: totalHits,
          lastPage: Math.min(lastPage, 10), // cap at 10 pages for smooth loading
          page: page,
          blogs: mappedBlogs
        });
      } catch (err) {
        return sendJson(500, { error: `Blog API error: ${err.message}` });
      }
    }

    // ── 0f. SINGLE BLOG ARTICLE DETAIL PROXY ──
    if (pathname.startsWith('/api/external-blogs/') && req.method === 'GET') {
      const rawId = pathname.split('/')[3];
      const pageId = rawId.startsWith('blog_live_') ? rawId.replace('blog_live_', '') : rawId;

      try {
        const detailUrl = `https://en.wikipedia.org/w/api.php?` + new URLSearchParams({
          action: 'query',
          pageids: pageId,
          prop: 'pageimages|extracts',
          piprop: 'thumbnail',
          pithumbsize: 900,
          explaintext: 1,
          format: 'json',
          origin: '*'
        });

        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        const pageObj = detailData.query?.pages?.[pageId];

        if (!pageObj) {
          return sendJson(404, { error: 'Article not found.' });
        }

        const title = pageObj.title;
        const text = pageObj.extract || '';
        const imgUrl = pageObj.thumbnail?.source || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80`;

        // Split long Wikipedia extract into structured section blocks
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        const blocks = [];

        paragraphs.forEach((p, i) => {
          if (p.length < 50 && !p.endsWith('.')) {
            blocks.push({ type: 'h2', text: p });
          } else {
            blocks.push({ type: 'p', text: p });
          }
        });

        if (blocks.length === 0) {
          blocks.push({ type: 'p', text: `Detailed botanical overview of ${title}.` });
        }

        const post = {
          id: `blog_live_${pageObj.pageid}`,
          title: title,
          text: paragraphs[0] ? paragraphs[0].slice(0, 150) + '...' : `Everything you need to know about ${title}.`,
          category: 'Plant Care',
          img: imgUrl,
          content: blocks,
          readTime: `${Math.max(3, Math.ceil(text.length / 500))} min read`,
          wikipediaUrl: `https://en.wikipedia.org/?curid=${pageObj.pageid}`
        };

        return sendJson(200, { post });
      } catch (err) {
        return sendJson(500, { error: `Blog detail API error: ${err.message}` });
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
      let user = db.findUserByEmail(cleanEmail);
      const hashedPassword = hashPassword(password);

      if (!user) {
        const namePart = cleanEmail.split('@')[0] || 'Gardener';
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        user = db.createUser({
          firstName: formattedName,
          lastName: '',
          email: cleanEmail,
          password: hashedPassword
        });
      } else if (user.password !== hashedPassword) {
        // Update password hash for existing user
        user.password = hashedPassword;
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

    // ── 8. UPDATE PLANT / WATERING REMINDER ──
    if (pathname.startsWith('/api/user-plants/') && req.method === 'PUT') {
      const user = authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const plantId = pathname.split('/')[3];
      const body = await getJsonBody(req);
      const updatedPlant = db.updatePlant(plantId, user.id, body);

      if (updatedPlant) {
        return sendJson(200, { message: 'Plant reminder updated successfully!', plant: updatedPlant });
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
