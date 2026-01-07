-- Ben's Quotes feature
CREATE TABLE IF NOT EXISTS ben_quotes (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  added_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial Monty Python quote
INSERT INTO ben_quotes (quote, added_by) VALUES
  ('It''s just a flesh wound!', 'Dad'),
  ('We are the knights who say... NI!', 'Dad'),
  ('I fart in your general direction!', 'Dad'),
  ('Strange women lying in ponds distributing swords is no basis for a system of government.', 'Dad');
