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

export const db = {

  // ── Find user by email ────────────────────────────────────────────────────
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

  // ── Find user by id ───────────────────────────────────────────────────────
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

  // ── Create new user ───────────────────────────────────────────────────────
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

  // ── Get all plants for user ───────────────────────────────────────────────
  async getUserPlants(userId) {
    const { data, error } = await supabase
      .from('user_plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(extractPlantData);
  },

  // ── Create plant ──────────────────────────────────────────────────────────
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

  // ── Delete plant ──────────────────────────────────────────────────────────
  async deletePlant(id, userId) {
    const { error, count } = await supabase
      .from('user_plants')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('deletePlant error:', error.message); return false; }
    return count > 0;
  },

  // ── Mark plant as watered today ───────────────────────────────────────────
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

  // ── Update plant details ──────────────────────────────────────────────────
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
    if (error) { console.error('updatePlant error:', error.message); return null; }
    if (!data) return null;
    return {
      id: String(data.id),
      userId: data.user_id,
      title: data.title,
      text: data.text || '',
      imgUrl: data.img_url || '',
      wateringFrequency: data.watering_frequency || '7',
      lastWatered: data.last_watered,
      createdAt: data.created_at
    };
  }
};
