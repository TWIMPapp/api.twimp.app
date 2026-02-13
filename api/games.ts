import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/config/supabase';

interface GameCreationRequest {
  name: string;
  description: string;
  creator_email: string;
  creator_id?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      return res
        .status(500)
        .json({ error: 'Database not configured' });
    }

    const { name, description, creator_email, creator_id } =
      req.body as GameCreationRequest;

    // Validate required fields
    if (!name || !creator_email) {
      return res
        .status(400)
        .json({ error: 'Name and creator email are required' });
    }

    // First, get or create the user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', creator_email)
      .single();

    let userId: string;

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create one
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: creator_email,
          name: creator_email.split('@')[0],
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user record' });
      }

      userId = newUser?.id;
    } else if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(500).json({ error: 'Failed to fetch user' });
    } else {
      userId = userData?.id;
    }

    if (!userId) {
      return res.status(500).json({ error: 'Failed to identify user' });
    }

    // Create the game
    const { data: gameData, error: gameError } = await supabase
      .from('user_games')
      .insert({
        creator_id: userId,
        name: name.trim(),
        description: description?.trim() || '',
        ref: `draft-${Date.now()}`, // Temporary ref for draft
        config: {
          pins: [],
          theme: 'default',
          difficulty: 'medium',
        },
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (gameError) {
      console.error('Error creating game:', gameError);
      return res.status(500).json({ error: 'Failed to create game' });
    }

    return res.status(201).json(gameData);
  } catch (error) {
    console.error('Unexpected error in games endpoint:', error);
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Internal server error',
    });
  }
}
