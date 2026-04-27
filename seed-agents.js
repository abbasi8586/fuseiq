const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kowwqfadifawowfrdiyz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd3dxZmFkaWZhd293ZnJkaXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxODI3NywiZXhwIjoyMDkyNzk0Mjc3fQ.8jzQOAWA6uMGWzHc7qnd4OPkGpp6euidLsIc5pkxziY',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const USER_ID = '7390e5d3-25d4-471e-8152-ca0a753304db';

const agents = [
  { name: 'Aurora', framework: 'Kimi', status: 'online', user_id: USER_ID },
  { name: 'Kai', framework: 'CrewAI', status: 'online', user_id: USER_ID },
  { name: 'Nova', framework: 'LangGraph', status: 'busy', user_id: USER_ID },
  { name: 'Zara', framework: 'AutoGen', status: 'online', user_id: USER_ID },
  { name: 'Echo', framework: 'OpenAI', status: 'online', user_id: USER_ID },
  { name: 'Pulse', framework: 'Kimi', status: 'busy', user_id: USER_ID },
  { name: 'Spark', framework: 'Custom', status: 'online', user_id: USER_ID },
  { name: 'Vox', framework: 'CrewAI', status: 'online', user_id: USER_ID }
];

async function seedAgents() {
  console.log('Seeding agents...');
  
  const { data, error } = await supabase
    .from('agents')
    .insert(agents)
    .select();
  
  if (error) {
    console.error('Error seeding agents:', error);
  } else {
    console.log('Successfully seeded', data.length, 'agents');
    console.log('IDs:', data.map(a => a.id));
  }
}

seedAgents();
