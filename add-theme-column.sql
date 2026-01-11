-- Add theme column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT;

-- Optional: Add index for theme column
CREATE INDEX IF NOT EXISTS users_theme_idx ON users(theme);

-- Optional: Add comment to document the column
COMMENT ON COLUMN users.theme IS 'User theme preference: "light", "dark", or "system"';

-- Show that the column was added
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'theme';