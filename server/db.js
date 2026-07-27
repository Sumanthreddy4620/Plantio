import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
  global: {
    headers: {
      'Accept-Profile': 'public',
      'Content-Profile': 'public'
    }
  }
});

console.log('✅ Supabase client ready');

function extractPlantData(row) {
  if (!row) return null;
  let journal = [];
  let cleanText = row.text || '';

  if (row.growth_journal) {
    try {
      journal = typeof row.growth_journal === 'string' ? JSON.parse(row.growth_journal) : row.growth_journal;
    } catch (e) {}
  }

  if ((!journal || journal.length === 0) && cleanText.includes('__GJ__:')) {
    try {
      const parts = cleanText.split('__GJ__:');
      cleanText = parts[0];
      const jsonStr = parts[1];
      if (jsonStr) journal = JSON.parse(jsonStr);
    } catch (e) {}
  }

  return {
    id: String(row.id),
    userId: row.user_id,
    title: row.title,
    text: cleanText,
    imgUrl: row.img_url || '',
    wateringFrequency: row.watering_frequency || '7',
    lastWatered: row.last_watered,
    createdAt: row.created_at,
    growthJournal: Array.isArray(journal) ? journal : []
  };
}

function packPlantText(text, growthJournal) {
  let cleanText = text || '';
  if (cleanText.includes('__GJ__:')) {
    cleanText = cleanText.split('__GJ__:')[0];
  }
  if (Array.isArray(growthJournal) && growthJournal.length > 0) {
    return `${cleanText}__GJ__:${JSON.stringify(growthJournal)}`;
  }
  return cleanText;
}

export const db = {

  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, password')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    if (error) { console.error('findUserByEmail error:', error.message); return null; }
    if (!data) return null;
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      password: data.password
    };
  },

  async findUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('id', id)
      .maybeSingle();
    if (error) { console.error('findUserById error:', error.message); return null; }
    if (!data) return null;
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email
    };
  },

  async createUser({ firstName, lastName, email, password }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase().trim(),
        password
      })
      .select('id, first_name, last_name, email')
      .single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email
    };
  },

  async getUserPlants(userId) {
    const { data, error } = await supabase
      .from('user_plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(extractPlantData);
  },

  async createPlant({ userId, title, text, imgUrl, wateringFrequency, lastWatered, growthJournal }) {
    const packedText = packPlantText(text, growthJournal);
    const journalData = Array.isArray(growthJournal) ? JSON.stringify(growthJournal) : (growthJournal || '[]');
    
    let insertObj = {
      user_id: userId,
      title,
      text: packedText,
      img_url: imgUrl || '',
      watering_frequency: String(wateringFrequency || 7),
      last_watered: lastWatered || new Date().toISOString().split('T')[0],
      growth_journal: journalData
    };

    let { data, error } = await supabase
      .from('user_plants')
      .insert(insertObj)
      .select('*')
      .single();

    if (error && error.message && error.message.includes('growth_journal')) {
      delete insertObj.growth_journal;
      const retry = await supabase
        .from('user_plants')
        .insert(insertObj)
        .select('*')
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) throw new Error(error.message);
    return extractPlantData(data);
  },

  async deletePlant(id, userId) {
    const { error, count } = await supabase
      .from('user_plants')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('deletePlant error:', error.message); return false; }
    return count > 0;
  },

  async waterPlant(id, userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('user_plants')
      .update({ last_watered: today })
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();
    if (error) { console.error('waterPlant error:', error.message); return null; }
    return data ? today : null;
  },

  async updatePlant(id, userId, { title, text, imgUrl, wateringFrequency, lastWatered, growthJournal }) {
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (imgUrl !== undefined) updates.img_url = imgUrl;
    if (wateringFrequency !== undefined) updates.watering_frequency = String(wateringFrequency);
    if (lastWatered !== undefined) updates.last_watered = lastWatered;

    let packedText = text;
    if (growthJournal !== undefined) {
      packedText = packPlantText(text !== undefined ? text : '', growthJournal);
      updates.growth_journal = Array.isArray(growthJournal) ? JSON.stringify(growthJournal) : growthJournal;
    }
    if (packedText !== undefined) {
      updates.text = packedText;
    }

    let { data, error } = await supabase
      .from('user_plants')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error && error.message && (error.message.includes('growth_journal') || error.message.includes('column'))) {
      delete updates.growth_journal;
      const retry = await supabase
        .from('user_plants')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();
      data = retry.data;
      error = retry.error;
    }

    if (error) { console.error('updatePlant error:', error.message); return null; }
    if (!data) return null;
    return extractPlantData(data);
  }
};
