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

// Helper to authenticate request (async for Supabase)
async function authenticate(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', 'plantio_secret_key_2025').update(payload).digest('hex');
    if (signature !== expectedSig) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    const user = await db.findUserById(decoded.id);
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

// Fetch a remote image and convert it to a base64 data payload for vision analysis.
// Guards against oversized downloads and non-image responses.
async function fetchImageAsBase64(imageUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Plantio/1.0 (plant identification)' }
    });
    if (!res.ok) throw new Error(`Image fetch failed with status ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    if (contentType && !contentType.startsWith('image/')) {
      throw new Error('The provided URL does not point to a direct image file.');
    }

    const contentLength = Number(res.headers.get('content-length') || '0');
    if (contentLength && contentLength > 8 * 1024 * 1024) {
      throw new Error('Image exceeds 8MB size limit.');
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > 8 * 1024 * 1024) {
      throw new Error('Image exceeds 8MB size limit.');
    }

    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = contentType.startsWith('image/') ? contentType : 'image/jpeg';
    return { base64Data, mimeType };
  } finally {
    clearTimeout(timeout);
  }
}

// Extract clean JSON from a Gemini text response, tolerating markdown code fences.
function parseGeminiJson(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to salvage the first {...} block if the model added stray text around it
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

// Call Gemini's vision model with strict structured JSON output for plant/disease identification.
async function identifyWithGemini({ apiKey, prompt, base64Data, mimeType, geminiModel }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;

  const instruction = `You are a rigorous plant identification and plant pathology expert powering Plantio's AI Doctor.
Look carefully at the provided image and respond with ONLY a single JSON object (no markdown, no commentary) matching this exact schema:
{
  "isPlantImage": boolean,            // true if the image shows a plant, leaf, flower, or plant pest/disease
  "commonName": string,               // best-guess common name, or "" if unidentifiable
  "scientificName": string,           // Latin binomial genus/species, or "" if unsure
  "category": "Plant" | "Disease" | "Pest",
  "healthStatus": "Healthy" | "Diseased" | "Pest Damage" | "Unclear",
  "confidencePercent": number,        // your honest confidence 0-100, be conservative — do not inflate
  "symptoms": string,                 // observed visual symptoms if diseased/pest-damaged, else ""
  "treatment": string,                // concrete treatment steps if diseased/pest-damaged, else ""
  "prevention": string,               // prevention tips
  "careSummary": string,              // 1-2 sentence general care summary for this species
  "message": string,                  // a friendly 2-4 sentence explanation for the user, written naturally
  "notes": string                     // caveats, e.g. "image blurry, low confidence" — "" if none
}
Be honest about uncertainty: if the image is blurry, ambiguous, not a plant, or you cannot narrow it down, set isPlantImage/confidencePercent accordingly and explain in "notes" rather than guessing a random species. Never fabricate a scientific name you are not reasonably confident about — use your best partial guess (e.g. genus only) and lower confidencePercent instead.`;

  const parts = [
    { text: instruction },
    { inline_data: { mime_type: mimeType, data: base64Data } },
    { text: prompt ? `User's message/context: ${prompt}` : 'User did not add extra text — analyze the image alone.' }
  ];

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini vision request failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = parseGeminiJson(rawText);
  if (!parsed) throw new Error('Gemini returned a response that could not be parsed as JSON.');
  return parsed;
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
    // ── 0a. iNaturalist PLANT CATALOG PROXY (list + search) ──
    // No API key required. Rate limit: 100 req/min (not per day).
    if (pathname === '/api/external-plants' && req.method === 'GET') {
      const page = Number(url.searchParams.get('page') || '1');
      const search = url.searchParams.get('search') || '';
      const categoryParam = url.searchParams.get('category') || 'All';
      const perPage = 30;

      const categorySearchMap = {
        'Cactuses': 'cactus',
        'Succulents': 'succulent',
        'Flowers': 'flower',
        'Trees': 'tree',
        'Grasses': 'grass',
        'Shrubs': 'shrub',
        'Ferns': 'fern',
        'Herbs': 'herb',
        'Aquatics': 'aquatic plant',
        'Mushrooms': 'mushroom',
        'Weeds': 'weed'
      };

      let queryTerm = search.trim();
      if (!queryTerm && categoryParam && categoryParam !== 'All') {
        queryTerm = categorySearchMap[categoryParam] || 'plant';
      }
      if (!queryTerm) queryTerm = 'plant';

      // iNaturalist taxa endpoint — filter strictly to Plantae kingdom (or Fungi for mushrooms)
      const inatParams = {
        q: queryTerm,
        rank: 'species',
        iconic_taxa: categoryParam === 'Mushrooms' ? 'Fungi' : 'Plantae',
        per_page: perPage,
        page: page,
        locale: 'en',
        preferred_place_id: 1 // worldwide
      };

      const inatUrl = `https://api.inaturalist.org/v1/taxa?` + new URLSearchParams(inatParams);

      try {
        const inatRes = await fetch(inatUrl, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' }
        });
        const inatData = await inatRes.json();

        if (inatData && Array.isArray(inatData.results)) {
          const mappedPlants = inatData.results
            .filter(item => {
              if (!item.preferred_common_name) return false;
              // Strictly exclude birds (Aves), insects (Insecta), mammals (Mammalia), and non-plant species
              const taxonName = item.iconic_taxon_name;
              if (categoryParam === 'Mushrooms') {
                return taxonName === 'Fungi' || taxonName === 'Plantae';
              }
              return taxonName === 'Plantae';
            })
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
        if (category === 'Pest') queryTerm = 'pest insect aphid';
        else if (category === 'Disease') queryTerm = 'plant disease fungus mildew';
        else queryTerm = 'plant disease pest aphid';
      }

      // Restrict iconic taxa to Insects, Arachnids, Fungi, Chromista, and Mollusks
      let iconicTaxa = 'Insecta,Arachnida,Fungi,Chromista,Mollusca';
      if (category === 'Pest') iconicTaxa = 'Insecta,Arachnida,Mollusca';
      if (category === 'Disease') iconicTaxa = 'Fungi,Chromista,Plantae';

      const inatUrl = `https://api.inaturalist.org/v1/taxa?` + new URLSearchParams({
        q: queryTerm,
        iconic_taxa: iconicTaxa,
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
            .filter(item => {
              if (!item.preferred_common_name && !item.name) return false;
              // Strictly exclude birds (Aves), mammals (Mammalia), reptiles, amphibians, and fish
              const taxon = item.iconic_taxon_name;
              if (taxon === 'Aves' || taxon === 'Mammalia' || taxon === 'Reptilia' || taxon === 'Amphibia' || taxon === 'Actinopterygii') {
                return false;
              }
              return true;
            })
            .map(item => {
              const commonName = item.preferred_common_name
                ? item.preferred_common_name.charAt(0).toUpperCase() + item.preferred_common_name.slice(1)
                : item.name;
              const isPest = (item.iconic_taxon_name === 'Insecta' || item.iconic_taxon_name === 'Arachnida' || item.iconic_taxon_name === 'Mollusca' || commonName.toLowerCase().includes('bug') || commonName.toLowerCase().includes('aphid') || commonName.toLowerCase().includes('mite') || commonName.toLowerCase().includes('beetle') || commonName.toLowerCase().includes('fly'));
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

    // ── 0g. AI PLANT & DISEASE DOCTOR CHAT API ──
    if (pathname === '/api/ai-chat' && req.method === 'POST') {
      const body = await getJsonBody(req);
      const { prompt = '', imageUrl = '', imageBase64 = '', conversationHistory = [] } = body;

      if (!prompt.trim() && !imageUrl && !imageBase64) {
        return sendJson(400, { error: 'Please provide a message, an image URL, or a photo to analyze.' });
      }

      try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        let aiMessage = '';
        let matchedTaxa = null;

        const cleanPrompt = prompt.toLowerCase().trim();

        // 1. Detect simple conversational greetings
        const conversationalWords = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'good afternoon', 'who are you', 'what can you do', 'help', 'thanks', 'thank you', 'bye', 'goodbye', 'cool', 'ok', 'okay', 'nice', 'awesome'];
        const isGreeting = !imageUrl && !imageBase64 && (
          conversationalWords.includes(cleanPrompt) ||
          cleanPrompt === 'hello' ||
          cleanPrompt === 'hi' ||
          cleanPrompt === 'hey' ||
          cleanPrompt.startsWith('hello ') ||
          cleanPrompt.startsWith('hi ') ||
          cleanPrompt.startsWith('hey ')
        ) && !cleanPrompt.includes('plant') && !cleanPrompt.includes('disease') && !cleanPrompt.includes('leaf') && !cleanPrompt.includes('spot') && !cleanPrompt.includes('water');

        if (isGreeting) {
          return sendJson(200, {
            message: `Hello! 👋 I am your **Plantio AI Doctor & Botanical Assistant**.\n\nHow can I assist your garden today?\n- 🌿 Ask me to identify any plant (e.g. *"Tell me about Monstera"* or *"Snake Plant care"*)\n- 📸 Upload a photo of a plant leaf to diagnose diseases & pests\n- 💧 Ask for watering, sunlight, or soil recommendations!`,
            diagnosis: null,
            timestamp: new Date().toISOString()
          });
        }

        const GEMINI_MODEL = 'gemini-3.6-flash';
        const hasImage = Boolean(imageBase64 || imageUrl);

        // ═══ PATH A: An image was provided — run real multimodal identification ═══
        if (hasImage) {
          let base64Data = null;
          let mimeType = 'image/jpeg';
          let imageFetchError = null;

          if (imageBase64) {
            base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
            mimeType = imageBase64.includes('data:') ? imageBase64.split(';')[0].replace('data:', '') : 'image/jpeg';
          } else if (imageUrl) {
            try {
              const fetched = await fetchImageAsBase64(imageUrl);
              base64Data = fetched.base64Data;
              mimeType = fetched.mimeType;
            } catch (fetchErr) {
              imageFetchError = fetchErr.message;
            }
          }

          if (!base64Data) {
            return sendJson(200, {
              message: `⚠️ I couldn't load that image (${imageFetchError || 'unknown error'}). Please make sure the URL points directly to an image file (ending in .jpg, .png, etc.), or try uploading the photo instead.`,
              diagnosis: null,
              timestamp: new Date().toISOString()
            });
          }

          if (!apiKey) {
            return sendJson(200, {
              message: `📸 I received your photo, but visual plant identification requires the AI vision service to be configured on the server (missing GEMINI_API_KEY). In the meantime, try describing what you see — leaf shape, color, or symptoms — and I can help from our botanical database.`,
              diagnosis: null,
              timestamp: new Date().toISOString()
            });
          }

          let geminiResult = null;
          try {
            geminiResult = await identifyWithGemini({ apiKey, prompt, base64Data, mimeType, geminiModel: GEMINI_MODEL });
          } catch (visionErr) {
            console.error('Gemini vision identification error:', visionErr.message);
            return sendJson(200, {
              message: `⚠️ Sorry, I had trouble analyzing that image just now (${visionErr.message}). Could you try again, or upload a clearer, well-lit photo of the leaf/plant?`,
              diagnosis: null,
              timestamp: new Date().toISOString()
            });
          }

          if (!geminiResult.isPlantImage || !geminiResult.commonName) {
            return sendJson(200, {
              message: geminiResult.message || `🤔 I looked closely, but I'm not confident this image shows a clearly identifiable plant, leaf, or plant issue.${geminiResult.notes ? ` (${geminiResult.notes})` : ''} Could you try a closer, well-lit photo of the leaves or affected area?`,
              diagnosis: null,
              timestamp: new Date().toISOString()
            });
          }

          // Cross-reference Gemini's identification with the live iNaturalist database
          // for an authoritative photo, taxonomy, and Wikipedia link.
          let inatTaxon = null;
          const lookupName = geminiResult.scientificName || geminiResult.commonName;
          try {
            const inatRes = await fetch(
              `https://api.inaturalist.org/v1/taxa?` + new URLSearchParams({ q: lookupName, per_page: 3, locale: 'en' }),
              { headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' } }
            );
            if (inatRes.ok) {
              const inatData = await inatRes.json();
              inatTaxon = (inatData.results || [])[0] || null;
            }
          } catch (e) {
            console.error('iNaturalist cross-reference error:', e.message);
          }

          const care = inatTaxon ? getPlantCareDetails(inatTaxon) : getPlantCareDetails({
            preferred_common_name: geminiResult.commonName,
            name: geminiResult.scientificName,
            wikipedia_summary: geminiResult.careSummary
          });

          const confidencePercent = Math.max(0, Math.min(100, Math.round(Number(geminiResult.confidencePercent) || 0)));
          const isDiseaseOrPest = geminiResult.category === 'Disease' || geminiResult.category === 'Pest' || geminiResult.healthStatus === 'Diseased' || geminiResult.healthStatus === 'Pest Damage';

          matchedTaxa = {
            id: inatTaxon ? `inat_${inatTaxon.id}` : `gemini_${Date.now()}`,
            title: geminiResult.commonName,
            scientificName: geminiResult.scientificName || (inatTaxon ? inatTaxon.name : ''),
            category: geminiResult.category || (inatTaxon ? getPlantCategory(inatTaxon) : 'Plant'),
            confidence: `${confidencePercent}% Match`,
            img: {
              src: imageUrl || imageBase64 || inatTaxon?.default_photo?.medium_url || null,
              alt: geminiResult.commonName
            },
            care,
            description: geminiResult.careSummary || (inatTaxon?.wikipedia_summary ? inatTaxon.wikipedia_summary.replace(/<[^>]*>/g, '') : null),
            symptoms: geminiResult.symptoms || '',
            treatment: geminiResult.treatment || '',
            prevention: geminiResult.prevention || '',
            wikipediaUrl: inatTaxon?.wikipedia_url || null,
            healthStatus: geminiResult.healthStatus || 'Unclear'
          };

          let aiMessage = geminiResult.message || '';
          if (isDiseaseOrPest && (geminiResult.symptoms || geminiResult.treatment)) {
            aiMessage += `\n\n**Symptoms observed:** ${geminiResult.symptoms || 'N/A'}\n\n**Treatment:** ${geminiResult.treatment || 'N/A'}\n\n**Prevention:** ${geminiResult.prevention || 'N/A'}`;
          }
          if (confidencePercent < 50) {
            aiMessage += `\n\n_Note: My confidence on this one is moderate (${confidencePercent}%) — a clearer or closer photo would help me be more precise._`;
          }

          return sendJson(200, {
            message: aiMessage.trim(),
            diagnosis: matchedTaxa,
            timestamp: new Date().toISOString()
          });
        }

        // ═══ PATH B: Text-only query — search the live botanical database by keyword ═══

        // Extract target plant noun from user prompt
        let searchKeywords = prompt.replace(/[^\w\s]/gi, ' ').trim();

        const promptFillers = [
          'what', 'is', 'this', 'plant', 'disease', 'how', 'to', 'treat', 'can', 'you',
          'identify', 'name', 'of', 'my', 'the', 'leaves', 'with', 'spots', 'yellow',
          'brown', 'on', 'please', 'tell', 'me', 'hello', 'hi', 'hey', 'why', 'are',
          'should', 'about', 'some', 'give', 'information', 'for', 'schedule', 'routine',
          'water', 'watering', 'sunlight', 'light', 'soil', 'fertilizer', 'care'
        ];

        let extractedTokens = searchKeywords.split(/\s+/).filter(w => w.length > 2 && !promptFillers.includes(w.toLowerCase()));
        let rawQuery = extractedTokens.join(' ');
        if (rawQuery.toLowerCase() === 'catcus') rawQuery = 'cactus';

        const isInsectOrPestQuery = cleanPrompt.includes('pest') || cleanPrompt.includes('bug') || cleanPrompt.includes('aphid') || cleanPrompt.includes('mite') || cleanPrompt.includes('beetle');

        // If we truly have no usable keyword, don't guess a random species — ask for clarification.
        if (!rawQuery || rawQuery.length < 3) {
          return sendJson(200, {
            message: `I'd love to help! Could you share a plant name (e.g. *"Monstera care"*), describe what you're seeing (e.g. *"yellow spots on tomato leaves"*), or upload/paste a photo so I can identify it accurately?`,
            diagnosis: null,
            timestamp: new Date().toISOString()
          });
        }

        let inatTaxa = [];
        try {
          const searchParams = { q: rawQuery, per_page: 5, locale: 'en' };
          if (!isInsectOrPestQuery) searchParams.iconic_taxa = 'Plantae';

          const inatRes = await fetch(
            `https://api.inaturalist.org/v1/taxa?` + new URLSearchParams(searchParams),
            { headers: { 'Accept': 'application/json', 'User-Agent': 'Plantio/1.0' } }
          );
          if (inatRes.ok) {
            const inatData = await inatRes.json();
            inatTaxa = inatData.results || [];
          }
        } catch (e) {
          console.error('iNaturalist API search error in AI Chat:', e.message);
        }

        const topTaxon = inatTaxa[0];

        if (topTaxon) {
          const care = getPlantCareDetails(topTaxon);
          const commonName = topTaxon.preferred_common_name
            ? topTaxon.preferred_common_name.charAt(0).toUpperCase() + topTaxon.preferred_common_name.slice(1)
            : topTaxon.name;
          const isInsectOrPest = (topTaxon.iconic_taxon_name === 'Insecta' || topTaxon.iconic_taxon_name === 'Arachnida' || cleanPrompt.includes('pest') || cleanPrompt.includes('bug') || cleanPrompt.includes('disease') || cleanPrompt.includes('spot') || cleanPrompt.includes('rot') || cleanPrompt.includes('blight') || cleanPrompt.includes('mildew'));

          matchedTaxa = {
            id: `inat_${topTaxon.id}`,
            title: commonName,
            scientificName: topTaxon.name,
            category: isInsectOrPest ? (topTaxon.iconic_taxon_name === 'Insecta' ? 'Pest' : 'Disease') : getPlantCategory(topTaxon),
            confidence: 'Database Match',
            img: { src: topTaxon.default_photo?.medium_url || null, alt: commonName },
            care,
            description: topTaxon.wikipedia_summary ? topTaxon.wikipedia_summary.replace(/<[^>]*>/g, '') : null,
            symptoms: isInsectOrPest
              ? (topTaxon.wikipedia_summary ? topTaxon.wikipedia_summary.replace(/<[^>]*>/g, '').slice(0, 220) + '...' : `Discoloration, lesions, leaf spots, or stunting associated with ${commonName}.`)
              : `Signs of stress may include leaf yellowing, wilting, or slowed leaf output.`,
            treatment: isInsectOrPest
              ? `Apply neem oil spray or insecticidal soap. Prune infected leaves and increase airflow.`
              : `Provide adequate indirect sunlight, allow topsoil to dry before watering, and maintain appropriate humidity.`,
            prevention: `Inspect leaf undersides weekly, use clean well-draining soil, and avoid overwatering.`,
            wikipediaUrl: topTaxon.wikipedia_url || null
          };
        }

        aiMessage = '';

        // Optionally ask Gemini (text-only) to compose a friendlier grounded reply
        if (apiKey) {
          try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
            let sysPrompt = "You are Plantio's AI Plant Doctor and Botanical Expert. Answer clearly and concisely with structured, friendly care/treatment advice.";
            if (matchedTaxa) {
              sysPrompt += `\n\nReference Species Database Context:\n- Title: ${matchedTaxa.title}\n- Scientific Name: ${matchedTaxa.scientificName}\n- Category: ${matchedTaxa.category}\n- Care Specs: Watering=${matchedTaxa.care.watering}, Light=${matchedTaxa.care.light}, Soil=${matchedTaxa.care.soil}, Difficulty=${matchedTaxa.care.difficulty}\n- Details: ${matchedTaxa.description || matchedTaxa.symptoms}\nGround your response in this live database information — do not contradict it.`;
            }
            const geminiRes = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: sysPrompt }, { text: prompt }] }],
                generationConfig: { temperature: 0.4 }
              })
            });
            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              aiMessage = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }
          } catch (gErr) {
            console.error('Gemini text chat error:', gErr.message);
          }
        }

        if (!aiMessage) {
          if (matchedTaxa) {
            if (cleanPrompt.includes('disease') || cleanPrompt.includes('rot') || cleanPrompt.includes('spot') || cleanPrompt.includes('blight') || cleanPrompt.includes('mildew') || cleanPrompt.includes('pest') || cleanPrompt.includes('yellow') || cleanPrompt.includes('bug')) {
              aiMessage = `Based on our live plant database search, here's what I found for **${matchedTaxa.title}** (*${matchedTaxa.scientificName}*).\n\n` +
                `**Symptoms:** ${matchedTaxa.symptoms}\n\n` +
                `**Treatment Recommendation:** ${matchedTaxa.treatment}\n\n` +
                `**Prevention:** ${matchedTaxa.prevention}`;
            } else {
              aiMessage = `Here is the botanical identification from our live plants database for **${matchedTaxa.title}** (*${matchedTaxa.scientificName}*):\n\n` +
                `${matchedTaxa.description ? matchedTaxa.description.slice(0, 250) + '...' : ''}\n\n` +
                `**Care Quick Guide:**\n` +
                `- 💧 **Watering:** ${matchedTaxa.care.watering}\n` +
                `- ☀️ **Light:** ${matchedTaxa.care.light}\n` +
                `- 🪴 **Soil:** ${matchedTaxa.care.soil}\n` +
                `- ⚡ **Difficulty:** ${matchedTaxa.care.difficulty}\n` +
                `- ⚠️ **Toxicity:** ${matchedTaxa.care.toxicity}`;
            }
          } else {
            aiMessage = `I searched our live botanical database for "${rawQuery}" but couldn't find a confident match. Could you double check the spelling, or upload a photo instead so I can identify it visually?`;
          }
        }

        return sendJson(200, {
          message: aiMessage,
          diagnosis: matchedTaxa,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        return sendJson(500, { error: `AI Chat error: ${err.message}` });
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
      const existingUser = await db.findUserByEmail(cleanEmail);
      if (existingUser) {
        return sendJson(400, { error: 'An account with this email already exists.' });
      }

      const hashedPassword = hashPassword(password);
      const newUser = await db.createUser({
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
      const user = await db.findUserByEmail(cleanEmail);

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
      const user = await authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });
      return sendJson(200, { user });
    }

    // ── 4. GET USER PLANTS ──
    if (pathname === '/api/user-plants' && req.method === 'GET') {
      const user = await authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });
      const plants = await db.getUserPlants(user.id);
      return sendJson(200, { plants });
    }

    // ── 5. ADD USER PLANT ──
    if (pathname === '/api/user-plants' && req.method === 'POST') {
      const user = await authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const body = await getJsonBody(req);
      const { title, text, imgUrl, wateringFrequency, lastWatered } = body;

      if (!title || !title.trim()) {
        return sendJson(400, { error: 'Plant title is required.' });
      }

      const newPlant = await db.createPlant({
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
      const user = await authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const plantId = pathname.split('/')[3];
      const success = await db.deletePlant(plantId, user.id);

      if (success) {
        return sendJson(200, { message: 'Plant deleted successfully.' });
      } else {
        return sendJson(404, { error: 'Plant not found.' });
      }
    }

    // ── 7. MARK WATERED ──
    if (pathname.startsWith('/api/user-plants/') && pathname.endsWith('/water') && req.method === 'PATCH') {
      const user = await authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const plantId = pathname.split('/')[3];
      const lastWatered = await db.waterPlant(plantId, user.id);

      if (lastWatered) {
        return sendJson(200, { message: 'Plant marked as watered!', lastWatered });
      } else {
        return sendJson(404, { error: 'Plant not found.' });
      }
    }

    // ── 8. UPDATE PLANT / WATERING REMINDER ──
    if (pathname.startsWith('/api/user-plants/') && req.method === 'PUT') {
      const user = await authenticate(req);
      if (!user) return sendJson(401, { error: 'Unauthorized. Please log in.' });

      const plantId = pathname.split('/')[3];
      const body = await getJsonBody(req);
      const updatedPlant = await db.updatePlant(plantId, user.id, body);

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
