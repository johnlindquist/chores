-- Simple current quote table (single row)
CREATE TABLE IF NOT EXISTS current_ben_quote (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  quote TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial quote
INSERT INTO current_ben_quote (quote) VALUES
  ('It''s just a flesh wound!')
ON CONFLICT (id) DO NOTHING;
