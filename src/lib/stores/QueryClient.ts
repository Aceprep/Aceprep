import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryClient } from '@tanstack/svelte-query';
import { writable } from 'svelte/store';

function createQueryClientStore() {
	const { subscribe, set, update } = writable<QueryClient | null>(null);

	return {
		set,
		update,
		subscribe
	};
}

export const queryClientStore = createQueryClientStore();
