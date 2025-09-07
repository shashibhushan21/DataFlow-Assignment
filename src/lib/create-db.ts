import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydatabase',
  user: 'postgres',
  password: 'Shashi@123',
  ssl: false
});

async function createTables() {
  try {
    // Create campaigns table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        total_leads INTEGER DEFAULT 0,
        successful_leads INTEGER DEFAULT 0,
        response_rate DECIMAL(5,2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create leads table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        campaign_id INTEGER REFERENCES campaigns(id),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        source VARCHAR(255),
        last_contacted TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
      CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
    `);

    // Insert sample data
    await pool.query(`
      INSERT INTO campaigns (name, status, total_leads, successful_leads, response_rate) VALUES
      ('Summer Sale 2024', 'active', 120, 78, 65.00),
      ('Q3 Webinar Series', 'active', 85, 38, 45.00),
      ('New Feature Launch', 'completed', 250, 200, 80.00),
      ('Holiday Promotion', 'paused', 50, 10, 20.00),
      ('Q4 Product Showcase', 'draft', 0, 0, 0.00)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO leads (name, email, company, campaign_id, status, source, last_contacted) VALUES
      ('Alice Johnson', 'alice.j@example.com', 'Tech Corp', 1, 'contacted', 'Website Form', NOW() - INTERVAL '1 day'),
      ('Bob Williams', 'bob.w@example.com', 'StartupXYZ', 2, 'converted', 'LinkedIn', NOW() - INTERVAL '2 days'),
      ('Charlie Brown', 'charlie.b@example.com', 'Enterprise Ltd', 1, 'pending', 'Organic Search', NOW() - INTERVAL '1 hour'),
      ('Diana Miller', 'diana.m@example.com', 'Growth Co', 1, 'responded', 'Facebook Ads', NOW() - INTERVAL '1 hour'),
      ('Ethan Davis', 'ethan.d@example.com', 'Scale Inc', 2, 'pending', 'Referral', NOW() - INTERVAL '30 minutes'),
      ('Fiona Garcia', 'fiona.g@example.com', 'Innovation Hub', 1, 'contacted', 'Website Form', NOW() - INTERVAL '30 minutes')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Tables created and sample data inserted successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createTables();