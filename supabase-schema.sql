-- Supabase Schema for Twimp Sessions
-- Run this in your Supabase SQL Editor to create the required tables

-- Game Sessions table (for trail-based games)
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    trail_ref TEXT NOT NULL,
    task INTEGER DEFAULT -1,
    path TEXT DEFAULT '',
    state TEXT DEFAULT '',
    items JSONB DEFAULT '[]'::jsonb,
    input JSONB DEFAULT '{}'::jsonb,
    play_start BIGINT DEFAULT 0,
    play_end TEXT,
    last_awty BIGINT,
    retries INTEGER DEFAULT 0,
    score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, trail_ref)
);

-- Universal Sessions table (for Easter Event and other game modes)
CREATE TABLE IF NOT EXISTS universal_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    game_type TEXT NOT NULL,
    start_time BIGINT NOT NULL,
    last_position JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    start_position JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    current_level INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    history JSONB DEFAULT '[]'::jsonb,

    -- Easter Event specific fields (stored as JSONB for flexibility)
    session_data JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, game_type)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_universal_sessions_user_id ON universal_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_universal_sessions_game_type ON universal_sessions(game_type);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_universal_sessions_updated_at ON universal_sessions;
CREATE TRIGGER update_universal_sessions_updated_at
    BEFORE UPDATE ON universal_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Game Config table (controls visibility/featuring of games)
CREATE TABLE IF NOT EXISTS game_config (
    ref TEXT PRIMARY KEY,              -- e.g. 'bryngarw-meadow-spring' or 'egg-hunt'
    game_type TEXT NOT NULL DEFAULT 'trail',  -- 'trail' or 'universal'
    active BOOLEAN DEFAULT true,       -- Show in game list
    featured BOOLEAN DEFAULT false,    -- Show as featured card on home
    display_order INTEGER DEFAULT 0,   -- For sorting featured items
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for game_config updated_at
DROP TRIGGER IF EXISTS update_game_config_updated_at ON game_config;
CREATE TRIGGER update_game_config_updated_at
    BEFORE UPDATE ON game_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default universal games (you can edit these from the dashboard)
INSERT INTO game_config (ref, game_type, active, featured, display_order) VALUES
    ('egg-hunt', 'universal', true, true, 1),
    ('easter-event', 'universal', false, false, 2)
ON CONFLICT (ref) DO NOTHING;

-- Row Level Security (RLS) - Enable for production
-- ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE universal_sessions ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (uncomment and customize as needed):
-- CREATE POLICY "Users can read own sessions" ON game_sessions
--     FOR SELECT USING (true);  -- Adjust based on your auth strategy

-- CREATE POLICY "Users can insert own sessions" ON game_sessions
--     FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Users can update own sessions" ON game_sessions
--     FOR UPDATE USING (true);
