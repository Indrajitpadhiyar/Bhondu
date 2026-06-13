-- 1. AI-Generated Templates & Texture Shader Assets
CREATE TABLE IF NOT EXISTS ai_jersey_textures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(24) NOT NULL, -- References MongoDB Product ObjectId hex
    name VARCHAR(255) NOT NULL,
    base_image_url VARCHAR(512) NOT NULL,    -- SDXL Inpainted texture (Cloudinary)
    normal_map_url VARCHAR(512) NOT NULL,    -- Crease normal vector map
    occlusion_map_url VARCHAR(512) NOT NULL, -- Lighting ambient shadow map
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Define Enum types (checking if they exist first)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'view_side') THEN
        CREATE TYPE view_side AS ENUM ('front', 'back', 'left-sleeve', 'right-sleeve', 'collar');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zone_type') THEN
        CREATE TYPE zone_type AS ENUM ('chest', 'logo_left', 'logo_right', 'number_front', 'number_back', 'player_name', 'sponsor', 'sleeves', 'collar');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE job_status AS ENUM ('queued', 'processing', 'completed', 'failed');
    END IF;
END$$;

-- 3. Segmented Vector Print Zone Polygons
CREATE TABLE IF NOT EXISTS ai_print_masks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    texture_id UUID REFERENCES ai_jersey_textures(id) ON DELETE CASCADE,
    side view_side NOT NULL,
    zone zone_type NOT NULL,
    clipping_path JSONB NOT NULL,       -- SAM vector points representing the mask boundary
    bounding_box JSONB NOT NULL,        -- Grounding DINO detection boundary {x, y, w, h}
    confidence NUMERIC(4, 3) NOT NULL   -- DINO / SAM inference score
);

-- 4. AI Template Processing Pipeline Job Queue
CREATE TABLE IF NOT EXISTS ai_segmentation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(24) NOT NULL,
    status job_status DEFAULT 'queued',
    logs TEXT,
    error_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Row Level Security Policies (RLS) - disable for service_role keys, allow read-only anonymous access
ALTER TABLE ai_jersey_textures ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_print_masks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_segmentation_jobs ENABLE ROW LEVEL SECURITY;

-- Anonymous public read access
CREATE POLICY "Allow public read access on ai_jersey_textures" ON ai_jersey_textures FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on ai_print_masks" ON ai_print_masks FOR SELECT TO public USING (true);

-- Admin full access policies (for backend/service role)
CREATE POLICY "Allow service role full access on ai_jersey_textures" ON ai_jersey_textures FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on ai_print_masks" ON ai_print_masks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on ai_segmentation_jobs" ON ai_segmentation_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);
