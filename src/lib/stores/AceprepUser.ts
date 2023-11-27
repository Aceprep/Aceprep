import type { Tables } from '$lib/types/database.types';
import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

function createAcePrepUser() {
	const { subscribe, set, update } = writable<Tables<'User'> | undefined>();
	return {
		subscribe,
		set,
		update
	};
}

export const acePrepUserStore = createAcePrepUser();
