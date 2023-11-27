import { get, writable } from 'svelte/store';
import { supabaseStore } from './ClientSupabase';
import { userStore } from './User';
import type { Tables } from '$lib/types/database.types';

export function useStudentAnswer(test_id: string, question_id: string) {
	const { set, subscribe, update } = writable<Tables<'student_answer'> | undefined>();
	getStudentAnswer();
	async function getStudentAnswer() {
		const res = await get(supabaseStore)!
			.from('student_answer')
			.select('*')
			.eq('question_id', question_id)
			.eq('test_id', test_id)
			.eq('student_id', get(userStore)!.id);
		console.log('res', res);
		if (res.data && res.data.length > 0) set(res.data[0]);
		else
			set({
				id: crypto.randomUUID(),
				student_id: get(userStore)!.id,
				question_id,
				test_id,
				choice_id: null,
				is_bookmarked: false
			});
	}
	return {
		getStudentAnswer,
		set,
		subscribe,
		update
	};
}
