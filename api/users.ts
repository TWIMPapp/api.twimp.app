import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { email, name, avatar_url, provider, provider_id, twimp_user_id } = req.body;

      if (!email || !provider) {
        return res.status(400).json({ error: 'Email and provider are required' });
      }

      if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Update twimp_user_id if provided (links localStorage ID to this user)
        if (twimp_user_id) {
          await supabase
            .from('users')
            .update({ twimp_user_id })
            .eq('email', email);
        }
        return res.status(200).json(existingUser);
      }

      // Create new user
      const userData: any = {
        email,
        name: name || email.split('@')[0], // Default to email prefix if no name
        avatar_url: avatar_url || null,
        provider, // Explicitly set the provider field
        ...(twimp_user_id && { twimp_user_id }),
      };

      // Set the appropriate OAuth ID column
      if (provider === 'google') {
        userData.google_id = provider_id;
      } else if (provider === 'facebook') {
        userData.facebook_id = provider_id;
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      return res.status(201).json(newUser);
    } catch (error) {
      console.error('User creation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle GET - fetch current user
  if (req.method === 'GET') {
    try {
      const email = req.query.email as string;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Fetch user error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle PUT - update user profile
  if (req.method === 'PUT') {
    try {
      const { email, name } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ name })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: 'Failed to update user' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
