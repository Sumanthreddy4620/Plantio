import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Render environment variables.'
  );
}

// Use the service role key on the server so RLS policies are bypassed safely
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

console.log('✅ Supabase client initialised');

export const db = {

  // ── Find user by email ─────────────────────────────────────────────────────
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },

  // ── Find user by id ────────────────────────────────────────────────────────
  async findUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },

  // ── Create new user ────────────────────────────────────────────────────────
  async createUser({ firstName, lastName, email, password }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name:  lastName,
        email:      email.toLowerCase(),
        password,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    // Return in the shape the rest of the server expects
    return {
      id:        data.id,
      firstName: data.first_name,
      lastName:  data.last_name,
      email:     data.email
    };
  },

  // ── Get plants for a user ──────────────────────────────────────────────────
  async getUserPlants(userId) {
    const { data, error } = await supabase
      .from('user_plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []).map(p => ({
      id:               p.id,
      userId:           p.user_id,
      title:            p.title,
      text:             p.text,
      imgUrl:           p.img_url,
      wateringFrequency: p.watering_frequency,
      lastWatered:      p.last_watered,
      createdAt:        p.created_at
    }));
  },

  // ── Create plant ───────────────────────────────────────────────────────────
  async createPlant({ userId, title, text, imgUrl, wateringFrequency, lastWatered }) {
    const { data, error } = await supabase
      .from('user_plants')
      .insert({
        user_id:           userId,
        title,
        text:              text || '',
        img_url:           imgUrl || '',
        watering_frequency: String(wateringFrequency || 7),
        last_watered:      lastWatered || new Date().toISOString().split('T')[0],
        created_at:        new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return {
      id:               data.id,
      userId:           data.user_id,
      title:            data.title,
      text:             data.text,
      imgUrl:           data.img_url,
      wateringFrequency: data.watering_frequency,
      lastWatered:      data.last_watered,
      createdAt:        data.created_at
    };
  },

  // ── Delete plant ───────────────────────────────────────────────────────────
  async deletePlant(id, userId) {
    const { error, count } = await supabase
      .from('user_plants')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return count > 0;
  },

  // ── Mark plant as watered today ────────────────────────────────────────────
  async waterPlant(id, userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('user_plants')
      .update({ last_watered: today })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? today : null;
  },

  // ── Update plant details / watering reminder ───────────────────────────────
  async updatePlant(id, userId, { title, text, imgUrl, wateringFrequency, lastWatered }) {
    const updates = {};
    if (title            !== undefined) updates.title             = title.trim();
    if (text             !== undefined) updates.text              = text;
    if (imgUrl           !== undefined) updates.img_url           = imgUrl;
    if (wateringFrequency !== undefined) updates.watering_frequency = String(wateringFrequency);
    if (lastWatered      !== undefined) updates.last_watered      = lastWatered;

    const { data, error } = await supabase
      .from('user_plants')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id:               data.id,
      userId:           data.user_id,
      title:            data.title,
      text:             data.text,
      imgUrl:           data.img_url,
      wateringFrequency: data.watering_frequency,
      lastWatered:      data.last_watered,
      createdAt:        data.created_at
    };
  }
};
