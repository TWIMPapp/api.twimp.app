-- 005: Partners (externally sourced walks) — first slice of the partner pipeline.
-- Adds a partners table and a nullable game_config.partner_id so /list can show a
-- partner logo/credit on the home card and intro screen.
--
-- NOT YET APPLIED to the live project. Needs Ross's approval before running.
-- Additive and idempotent: safe to run twice; the running API ignores the new
-- column (GameConfigService selects '*') until the new code is deployed.
-- Run in the Supabase SQL Editor (or apply_migration) as one transaction.

BEGIN;

CREATE TABLE IF NOT EXISTS partners (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug       TEXT NOT NULL UNIQUE,      -- e.g. 'wimborne-civic-society', 'bcp-council'
    name       TEXT NOT NULL,             -- display name: "with <name>"
    logo_url   TEXT,                      -- public image URL (Supabase Storage partners/<slug>.png); NULL = text-only pill
    url        TEXT,                      -- partner website, linked from the intro screen
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT partners_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- Partner branding is public information; allow read-only access with the anon
-- key (the API reads with it). No insert/update/delete policies: edits go
-- through the dashboard / service role only.
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "partners are publicly readable" ON partners;
CREATE POLICY "partners are publicly readable" ON partners FOR SELECT USING (true);

ALTER TABLE game_config
    ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES partners(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS game_config_partner_id_idx ON game_config(partner_id);

-- Seed partners. logo_url stays NULL until each partner has given permission
-- and the logo is uploaded to Storage.
INSERT INTO partners (slug, name, logo_url, url) VALUES
    ('wimborne-civic-society', 'Wimborne Civic Society', NULL, 'https://www.wimbornecivicsoc.org.uk/'),
    ('bcp-council',            'BCP Council',            NULL, 'https://www.bcpcouncil.gov.uk/')
ON CONFLICT (slug) DO NOTHING;

-- Link games to partners. Only affects game_config rows that already exist:
-- wimborne-town-walk's row is created by its go-live script, and the two
-- Christchurch previews have no row yet — re-run this block after those exist.
UPDATE game_config SET partner_id = (SELECT id FROM partners WHERE slug = 'wimborne-civic-society')
    WHERE ref = 'wimborne-town-walk' AND partner_id IS NULL;
UPDATE game_config SET partner_id = (SELECT id FROM partners WHERE slug = 'bcp-council')
    WHERE ref IN ('christchurch-cultural-trail', 'christchurch-step-back-in-time') AND partner_id IS NULL;

COMMIT;

-- Rollback (if ever needed):
--   BEGIN;
--   ALTER TABLE game_config DROP COLUMN IF EXISTS partner_id;
--   DROP TABLE IF EXISTS partners;
--   COMMIT;
