-- Migration: Add Full-Text Search Support
-- Description: Add search_vector columns and GIN indexes for global search functionality
-- Date: 2025-11-11

-- ============================================
-- 1. Add search_vector columns to tables
-- ============================================

-- Person (Players/Staff)
ALTER TABLE persons ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Note
ALTER TABLE notes ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Event
ALTER TABLE events ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Form
ALTER TABLE forms ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- FormTemplate
ALTER TABLE form_templates ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- File
ALTER TABLE files ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Spreadsheet
ALTER TABLE spreadsheets ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- SpreadsheetTemplate
ALTER TABLE spreadsheet_templates ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- EventTemplate
ALTER TABLE event_templates ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- CanvasBoard
ALTER TABLE canvas_boards ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Plan
ALTER TABLE plans ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- ============================================
-- 2. Create GIN indexes for fast search
-- ============================================

CREATE INDEX IF NOT EXISTS person_search_idx ON persons USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS note_search_idx ON notes USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS event_search_idx ON events USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS form_search_idx ON forms USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS form_template_search_idx ON form_templates USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS file_search_idx ON files USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS spreadsheet_search_idx ON spreadsheets USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS spreadsheet_template_search_idx ON spreadsheet_templates USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS event_template_search_idx ON event_templates USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS canvas_board_search_idx ON canvas_boards USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS plan_search_idx ON plans USING GIN(search_vector);

-- ============================================
-- 3. Functions to update search vectors
-- ============================================

-- Person search vector update function
CREATE OR REPLACE FUNCTION update_person_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW."firstName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."lastName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.email, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.phone, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.nationality, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note search vector update function
CREATE OR REPLACE FUNCTION update_note_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.content::text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Event search vector update function
CREATE OR REPLACE FUNCTION update_event_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.type, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Form search vector update function
CREATE OR REPLACE FUNCTION update_form_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- FormTemplate search vector update function
CREATE OR REPLACE FUNCTION update_form_template_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- File search vector update function
CREATE OR REPLACE FUNCTION update_file_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Spreadsheet search vector update function
CREATE OR REPLACE FUNCTION update_spreadsheet_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SpreadsheetTemplate search vector update function
CREATE OR REPLACE FUNCTION update_spreadsheet_template_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- EventTemplate search vector update function
CREATE OR REPLACE FUNCTION update_event_template_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.type, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CanvasBoard search vector update function
CREATE OR REPLACE FUNCTION update_canvas_board_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Plan search vector update function
CREATE OR REPLACE FUNCTION update_plan_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Create triggers to auto-update search vectors
-- ============================================

-- Person triggers
DROP TRIGGER IF EXISTS person_search_vector_update ON persons;
CREATE TRIGGER person_search_vector_update
  BEFORE INSERT OR UPDATE ON persons
  FOR EACH ROW
  EXECUTE FUNCTION update_person_search_vector();

-- Note triggers
DROP TRIGGER IF EXISTS note_search_vector_update ON notes;
CREATE TRIGGER note_search_vector_update
  BEFORE INSERT OR UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_note_search_vector();

-- Event triggers
DROP TRIGGER IF EXISTS event_search_vector_update ON events;
CREATE TRIGGER event_search_vector_update
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_event_search_vector();

-- Form triggers
DROP TRIGGER IF EXISTS form_search_vector_update ON forms;
CREATE TRIGGER form_search_vector_update
  BEFORE INSERT OR UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_form_search_vector();

-- FormTemplate triggers
DROP TRIGGER IF EXISTS form_template_search_vector_update ON form_templates;
CREATE TRIGGER form_template_search_vector_update
  BEFORE INSERT OR UPDATE ON form_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_form_template_search_vector();

-- File triggers
DROP TRIGGER IF EXISTS file_search_vector_update ON files;
CREATE TRIGGER file_search_vector_update
  BEFORE INSERT OR UPDATE ON files
  FOR EACH ROW
  EXECUTE FUNCTION update_file_search_vector();

-- Spreadsheet triggers
DROP TRIGGER IF EXISTS spreadsheet_search_vector_update ON spreadsheets;
CREATE TRIGGER spreadsheet_search_vector_update
  BEFORE INSERT OR UPDATE ON spreadsheets
  FOR EACH ROW
  EXECUTE FUNCTION update_spreadsheet_search_vector();

-- SpreadsheetTemplate triggers
DROP TRIGGER IF EXISTS spreadsheet_template_search_vector_update ON spreadsheet_templates;
CREATE TRIGGER spreadsheet_template_search_vector_update
  BEFORE INSERT OR UPDATE ON spreadsheet_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_spreadsheet_template_search_vector();

-- EventTemplate triggers
DROP TRIGGER IF EXISTS event_template_search_vector_update ON event_templates;
CREATE TRIGGER event_template_search_vector_update
  BEFORE INSERT OR UPDATE ON event_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_event_template_search_vector();

-- CanvasBoard triggers
DROP TRIGGER IF EXISTS canvas_board_search_vector_update ON canvas_boards;
CREATE TRIGGER canvas_board_search_vector_update
  BEFORE INSERT OR UPDATE ON canvas_boards
  FOR EACH ROW
  EXECUTE FUNCTION update_canvas_board_search_vector();

-- Plan triggers
DROP TRIGGER IF EXISTS plan_search_vector_update ON plans;
CREATE TRIGGER plan_search_vector_update
  BEFORE INSERT OR UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_search_vector();

-- ============================================
-- 5. Populate search vectors for existing data
-- ============================================

-- Update existing rows to populate search vectors
-- For tables with updatedAt, trigger the update via updatedAt
UPDATE persons SET "updatedAt" = "updatedAt";
UPDATE notes SET "updatedAt" = "updatedAt";
UPDATE events SET "updatedAt" = "updatedAt";
UPDATE forms SET "updatedAt" = "updatedAt";
UPDATE spreadsheets SET "updatedAt" = "updatedAt";
UPDATE spreadsheet_templates SET "updatedAt" = "updatedAt";
UPDATE event_templates SET "updatedAt" = "updatedAt";
UPDATE canvas_boards SET "updatedAt" = "updatedAt";
UPDATE plans SET "updatedAt" = "updatedAt";

-- For tables without updatedAt, directly set the search_vector
UPDATE form_templates SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(category, '')), 'C');

UPDATE files SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B');

-- ============================================
-- Migration Complete
-- ============================================
