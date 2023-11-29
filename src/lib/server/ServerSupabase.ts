import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://cyfidttsivfscpxtgisk.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5ZmlkdHRzaXZmc2NweHRnaXNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTA0Njg3NCwiZXhwIjoyMDE2NjIyODc0fQ.69IwTYZTmKJCxEp664TkS7fQNFaM6nE7RKPYhhgLI3I'
);
