-- Upgrade hero site_settings payload to the full shape consumed by Hero.
-- Other keys can still be managed independently.
INSERT INTO site_settings (key, value) VALUES
  ('hero', jsonb_build_object(
    'first_name', 'Tornike',
    'last_name', 'Kalandadze',
    'greeting', 'Hello, I''m',
    'description', 'I craft beautiful, performant web experiences with modern technologies. Passionate about clean code, great UX, and pushing the boundaries of what''s possible on the web.',
    'roles', jsonb_build_array(
      'Full-Stack Developer',
      'React Enthusiast',
      'UI/UX Designer',
      'Problem Solver'
    ),
    'available_for_hire', true
  )),
  ('social_links', jsonb_build_array(
    jsonb_build_object('label', 'GitHub', 'href', 'https://github.com/stariik'),
    jsonb_build_object('label', 'LinkedIn', 'href', 'https://www.linkedin.com/in/tornike-kalandadze-997701365/'),
    jsonb_build_object('label', 'Twitter', 'href', 'https://twitter.com/tornikekalandadze')
  ))
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
