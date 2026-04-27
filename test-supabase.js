const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kowwqfadifawowfrdiyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd3dxZmFkaWZhd293ZnJkaXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTgyNzcsImV4cCI6MjA5Mjc5NDI3N30.edr19L0uOQMOMEwwXNHOPUxPN5NaeVQFzlvSrlL1Glg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Try to create a test table
    const { data, error } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Table does not exist - testing if we can create...');
      
      // Try creating a test table via RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_test_table');
      
      if (rpcError) {
        console.log('Cannot create table via anon key:', rpcError.message);
        console.log('Need service role key or SQL Editor access.');
      } else {
        console.log('Table created successfully!');
      }
    } else if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Connected! Data:', data);
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

testConnection();
