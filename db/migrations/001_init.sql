-- TRMNL Chore Schedule Plugin Database Schema

-- Temporary table to track OAuth flow (maps access token to installation in progress)
CREATE TABLE IF NOT EXISTS install_sessions (
  access_token TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Main table for plugin instances (one row per TRMNL plugin installation)
CREATE TABLE IF NOT EXISTS plugin_instances (
  uuid UUID PRIMARY KEY,
  plugin_setting_id INT,
  access_token TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  time_zone_iana TEXT,
  schedule_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for looking up instances by access token
CREATE INDEX IF NOT EXISTS plugin_instances_access_token_idx
  ON plugin_instances(access_token);

-- Cleanup function for old install sessions (older than 1 hour)
-- Can be called periodically or via cron
CREATE OR REPLACE FUNCTION cleanup_old_install_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM install_sessions WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
