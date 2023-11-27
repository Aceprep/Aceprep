import { writable } from 'svelte/store';

export function createStoreLab() {
	const count = writable(0);
	return {
		count
	};
}
