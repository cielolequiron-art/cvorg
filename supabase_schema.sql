-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    completion_status TEXT DEFAULT 'incomplete' CHECK (completion_status IN ('complete', 'incomplete')),
    last_step_reached INTEGER DEFAULT 1,
    form_data JSONB NOT NULL,
    user_email TEXT,
    user_phone TEXT
);

-- Form Schemas Table
CREATE TABLE IF NOT EXISTS forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    schema JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    target_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    channel TEXT CHECK (channel IN ('sms', 'email')),
    template TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Encrypted Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL, -- In a real app, this would be encrypted
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Simple policies for now (Admin access)
CREATE POLICY "Admin full access submissions" ON submissions FOR ALL USING (true);
CREATE POLICY "Admin full access forms" ON forms FOR ALL USING (true);
CREATE POLICY "Admin full access campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (true);
