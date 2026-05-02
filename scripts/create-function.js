const fetch = require('node-fetch');

const SUPABASE_URL = 'https://kowwqfadifawowfrdiyz.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd3dxZmFkaWZhd293ZnJkaXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxODI3NywiZXhwIjoyMDkyNzk0Mjc3fQ.8jzQOAWA6uMGWzHc7qnd4OPkGpp6euidLsIc5pkxziY';

async function createFunction() {
  // First, try to create an exec_sql function via REST by using a workaround
  // We'll use the auth schema which might have less restrictions
  
  const sql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;
  
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'tx=commit'
      },
      body: JSON.stringify({ sql })
    });
    
    const data = await res.json();
    console.log('Function creation response:', data);
  } catch (err) {
    console.error('Failed to create function:', err.message);
  }
}

createFunction();
