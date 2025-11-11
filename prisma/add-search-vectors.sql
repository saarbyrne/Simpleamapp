-- Migration: Add Full-Text Search Support
-- Description: Add search_vector columns and GIN indexes for global search functionality
-- Date: 2025-11-11

-- ============================================
-- 1. Add search_vector columns to tables
-- ============================================

-- Person (Players/Staff)
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Note
ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Event
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Form
ALTER TABLE "Form" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- FormTemplate
ALTER TABLE "FormTemplate" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- File
ALTER TABLE "File" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Spreadsheet
ALTER TABLE "Spreadsheet" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- SpreadsheetTemplate
ALTER TABLE "SpreadsheetTemplate" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- EventTemplate
ALTER TABLE "EventTemplate" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- CanvasBoard
ALTER TABLE "CanvasBoard" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Plan
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- ============================================
-- 2. Create GIN indexes for fast search
-- ============================================

CREATE INDEX IF NOT EXISTS person_search_idx ON "Person" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS note_search_idx ON "Note" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS event_search_idx ON "Event" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS form_search_idx ON "Form" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS form_template_search_idx ON "FormTemplate" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS file_search_idx ON "File" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS spreadsheet_search_idx ON "Spreadsheet" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS spreadsheet_template_search_idx ON "SpreadsheetTemplate" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS event_template_search_idx ON "EventTemplate" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS canvas_board_search_idx ON "CanvasBoard" USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS plan_search_idx ON "Plan" USING GIN(search_vector);

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
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C');
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
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C');
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
DROP TRIGGER IF EXISTS person_search_vector_update ON "Person";
CREATE TRIGGER person_search_vector_update
  BEFORE INSERT OR UPDATE ON "Person"
  FOR EACH ROW
  EXECUTE FUNCTION update_person_search_vector();

-- Note triggers
DROP TRIGGER IF EXISTS note_search_vector_update ON "Note";
CREATE TRIGGER note_search_vector_update
  BEFORE INSERT OR UPDATE ON "Note"
  FOR EACH ROW
  EXECUTE FUNCTION update_note_search_vector();

-- Event triggers
DROP TRIGGER IF EXISTS event_search_vector_update ON "Event";
CREATE TRIGGER event_search_vector_update
  BEFORE INSERT OR UPDATE ON "Event"
  FOR EACH ROW
  EXECUTE FUNCTION update_event_search_vector();

-- Form triggers
DROP TRIGGER IF EXISTS form_search_vector_update ON "Form";
CREATE TRIGGER form_search_vector_update
  BEFORE INSERT OR UPDATE ON "Form"
  FOR EACH ROW
  EXECUTE FUNCTION update_form_search_vector();

-- FormTemplate triggers
DROP TRIGGER IF EXISTS form_template_search_vector_update ON "FormTemplate";
CREATE TRIGGER form_template_search_vector_update
  BEFORE INSERT OR UPDATE ON "FormTemplate"
  FOR EACH ROW
  EXECUTE FUNCTION update_form_template_search_vector();

-- File triggers
DROP TRIGGER IF EXISTS file_search_vector_update ON "File";
CREATE TRIGGER file_search_vector_update
  BEFORE INSERT OR UPDATE ON "File"
  FOR EACH ROW
  EXECUTE FUNCTION update_file_search_vector();

-- Spreadsheet triggers
DROP TRIGGER IF EXISTS spreadsheet_search_vector_update ON "Spreadsheet";
CREATE TRIGGER spreadsheet_search_vector_update
  BEFORE INSERT OR UPDATE ON "Spreadsheet"
  FOR EACH ROW
  EXECUTE FUNCTION update_spreadsheet_search_vector();

-- SpreadsheetTemplate triggers
DROP TRIGGER IF EXISTS spreadsheet_template_search_vector_update ON "SpreadsheetTemplate";
CREATE TRIGGER spreadsheet_template_search_vector_update
  BEFORE INSERT OR UPDATE ON "SpreadsheetTemplate"
  FOR EACH ROW
  EXECUTE FUNCTION update_spreadsheet_template_search_vector();

-- EventTemplate triggers
DROP TRIGGER IF EXISTS event_template_search_vector_update ON "EventTemplate";
CREATE TRIGGER event_template_search_vector_update
  BEFORE INSERT OR UPDATE ON "EventTemplate"
  FOR EACH ROW
  EXECUTE FUNCTION update_event_template_search_vector();

-- CanvasBoard triggers
DROP TRIGGER IF EXISTS canvas_board_search_vector_update ON "CanvasBoard";
CREATE TRIGGER canvas_board_search_vector_update
  BEFORE INSERT OR UPDATE ON "CanvasBoard"
  FOR EACH ROW
  EXECUTE FUNCTION update_canvas_board_search_vector();

-- Plan triggers
DROP TRIGGER IF EXISTS plan_search_vector_update ON "Plan";
CREATE TRIGGER plan_search_vector_update
  BEFORE INSERT OR UPDATE ON "Plan"
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_search_vector();

-- ============================================
-- 5. Populate search vectors for existing data
-- ============================================

-- Update existing rows to populate search vectors
UPDATE "Person" SET "updatedAt" = "updatedAt";
UPDATE "Note" SET "updatedAt" = "updatedAt";
UPDATE "Event" SET "updatedAt" = "updatedAt";
UPDATE "Form" SET "updatedAt" = "updatedAt";
UPDATE "FormTemplate" SET "updatedAt" = "updatedAt";
UPDATE "File" SET "updatedAt" = "updatedAt";
UPDATE "Spreadsheet" SET "updatedAt" = "updatedAt";
UPDATE "SpreadsheetTemplate" SET "updatedAt" = "updatedAt";
UPDATE "EventTemplate" SET "updatedAt" = "updatedAt";
UPDATE "CanvasBoard" SET "updatedAt" = "updatedAt";
UPDATE "Plan" SET "updatedAt" = "updatedAt";

-- ============================================
-- Migration Complete
-- ============================================
