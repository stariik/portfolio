-- Create enum for project status
CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  thumbnail_url TEXT,
  images TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  category TEXT DEFAULT 'web',
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  status project_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon_name TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table (for dynamic configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_display_order ON skills(display_order);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Projects: Public can read published, authenticated can do everything
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Skills: Public can read, authenticated can manage
CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact messages: Public can insert, authenticated can manage
CREATE POLICY "Public can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site settings: Public can read, authenticated can manage
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero', '{"title": "Tornike Kalandadze", "subtitle": "Full-Stack Developer", "description": "Building beautiful, performant web experiences"}'),
  ('about', '{"bio": "I am a passionate full-stack developer with expertise in modern web technologies."}'),
  ('social', '{"github": "https://github.com/stariik", "linkedin": "https://www.linkedin.com/in/tornike-kalandadze-997701365/", "twitter": "https://twitter.com/tornikekalandadze"}')
ON CONFLICT (key) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, icon_name, color, display_order) VALUES
  ('React', 'Frontend', 95, 'react', '#61DAFB', 1),
  ('Next.js', 'Frontend', 90, 'nextjs', '#000000', 2),
  ('TypeScript', 'Languages', 90, 'typescript', '#3178C6', 3),
  ('Node.js', 'Backend', 85, 'nodejs', '#339933', 4),
  ('PostgreSQL', 'Database', 80, 'postgresql', '#4169E1', 5),
  ('MongoDB', 'Database', 75, 'mongodb', '#47A248', 6),
  ('Redis', 'Database', 70, 'redis', '#DC382D', 7),
  ('Docker', 'DevOps', 75, 'docker', '#2496ED', 8),
  ('AWS', 'DevOps', 70, 'aws', '#FF9900', 9),
  ('Tailwind CSS', 'Frontend', 95, 'tailwindcss', '#06B6D4', 10)
ON CONFLICT DO NOTHING;
