-- Add additional weather fields and reference data to reports table

-- Add new columns for detailed weather data
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS uv_index INTEGER,
ADD COLUMN IF NOT EXISTS temperature DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS humidity INTEGER,
ADD COLUMN IF NOT EXISTS visibility INTEGER,
ADD COLUMN IF NOT EXISTS smell TEXT;

-- Add reference data columns for comparison
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS ref_condition TEXT,
ADD COLUMN IF NOT EXISTS ref_uv_index INTEGER,
ADD COLUMN IF NOT EXISTS ref_temperature DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS ref_humidity INTEGER,
ADD COLUMN IF NOT EXISTS ref_visibility INTEGER,
ADD COLUMN IF NOT EXISTS ref_smell TEXT;

-- Add accuracy tracking columns
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS correct_entries INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_entries INTEGER DEFAULT 6,
ADD COLUMN IF NOT EXISTS accuracy_percent DECIMAL(5,2) DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_accuracy ON reports(accuracy_percent DESC);
CREATE INDEX IF NOT EXISTS idx_reports_user_created ON reports(user_id, created_at DESC);

-- Update RLS policies to allow reading accuracy data
-- (existing policies should already cover this, but verifying)

COMMENT ON COLUMN reports.uv_index IS 'UV Index value (0-11+)';
COMMENT ON COLUMN reports.temperature IS 'Temperature in Celsius';
COMMENT ON COLUMN reports.humidity IS 'Humidity percentage (0-100)';
COMMENT ON COLUMN reports.visibility IS 'Visibility in kilometers';
COMMENT ON COLUMN reports.smell IS 'Air smell description';
COMMENT ON COLUMN reports.ref_condition IS 'Reference weather condition';
COMMENT ON COLUMN reports.ref_uv_index IS 'Reference UV Index';
COMMENT ON COLUMN reports.ref_temperature IS 'Reference temperature';
COMMENT ON COLUMN reports.ref_humidity IS 'Reference humidity';
COMMENT ON COLUMN reports.ref_visibility IS 'Reference visibility';
COMMENT ON COLUMN reports.ref_smell IS 'Reference smell';
COMMENT ON COLUMN reports.correct_entries IS 'Number of fields matching reference data';
COMMENT ON COLUMN reports.total_entries IS 'Total number of fields compared';
COMMENT ON COLUMN reports.accuracy_percent IS 'Accuracy percentage';
