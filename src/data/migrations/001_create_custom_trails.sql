-- Custom Trails table for user-created shareable treasure hunts
-- Run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS custom_trails (
    id TEXT PRIMARY KEY,                        -- short alphanumeric (4-6 chars)
    creator_id TEXT NOT NULL,                   -- user_id or anonymous ID
    theme TEXT NOT NULL DEFAULT 'general',      -- 'easter', 'valentine', 'general'
    name TEXT,                                  -- optional trail name (max 200 chars)
    start_location JSONB NOT NULL,              -- {lat, lng}
    pins JSONB NOT NULL,                        -- array of CustomPin objects
    mode TEXT NOT NULL DEFAULT 'custom',        -- 'random' or 'custom'
    competitive BOOLEAN NOT NULL DEFAULT false, -- true = shared pins, first-come-first-served
    global_collected_pins JSONB NOT NULL DEFAULT '[]'::jsonb,  -- pin indices claimed (competitive)
    global_collected_by JSONB NOT NULL DEFAULT '{}'::jsonb,    -- pinIndex -> userId (competitive)
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,                 -- created_at + 90 days
    play_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Index for looking up active trails by creator (enforce 1 active limit)
CREATE INDEX idx_custom_trails_creator ON custom_trails (creator_id, is_active);

-- Index for expiry cleanup
CREATE INDEX idx_custom_trails_expires ON custom_trails (expires_at) WHERE is_active = true;
