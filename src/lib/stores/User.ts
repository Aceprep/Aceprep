import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

function createUser() {
	const { subscribe, set, update } = writable<User | undefined>();
	return {
		subscribe,
		set,
		update
	};
}

export const userStore = createUser();
