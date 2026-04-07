-- Add per-API-key game limits to api_keys table.
-- These columns let partners (e.g. Go Bucks) own many games under a single key,
-- while keeping the existing 1/5 anti-spam defaults for normal Twimp creators.
-- ("Game" is the generic term: trails, random nearby games, events, world games.)
-- Run this in your Supabase SQL Editor.

ALTER TABLE api_keys
    ADD COLUMN IF NOT EXISTS max_active_games int NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS max_total_games  int NOT NULL DEFAULT 5;
