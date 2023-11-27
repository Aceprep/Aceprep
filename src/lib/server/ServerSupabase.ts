import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://vsteffkdgjnrwljwudpw.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdGVmZmtkZ2pucndsand1ZHB3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NzA5OTgxMCwiZXhwIjoyMDEyNjc1ODEwfQ.OwkXzLpk73jeEPCp3pgOqK7SWp305WuCXYWr0eNuupc'
);
