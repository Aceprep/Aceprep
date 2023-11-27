import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export interface FilterOption {
	name: string;
	options: string[];
	queryParamName: string;
}

function createSupabaseStore() {
	const { subscribe, set, update } = writable<SupabaseClient | null>(null);

	return {
		set,
		update,
		subscribe
	};
}

export const supabaseStore = createSupabaseStore();
