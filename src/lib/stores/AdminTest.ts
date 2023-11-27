import { get, writable } from 'svelte/store';
import { supabaseStore } from './ClientSupabase';
import { queryClientStore } from './QueryClient';
import type { Tables } from '$lib/types/database.types';

function useTest() {
	const { set, subscribe, update } = writable<
		Tables<'Test'> & { Question: Tables<'Question'> & { Choice: Tables<'Choice'>[] }[] }
	>();
	const questionNumber = writable(0);
	function createQuestion(test_id: string) {
		console.log('createQuestion');

		get(supabaseStore)!
			.from('Question')
			.insert({
				test_id,
				choice_intro: 'Choose the answer that best completes the sentence or answers the question.'
			})
			.select('*')
			.single()
			.then(async (res) => {
				console.log(res);
				await get(supabaseStore)!
					.from('Choice')
					.insert([
						{ question_id: res.data.id, choice_num: 0 },
						{ question_id: res.data.id, choice_num: 1 },
						{ question_id: res.data.id, choice_num: 2 },
						{ question_id: res.data.id, choice_num: 3 }
					]);
				get(queryClientStore)!.invalidateQueries(['test', test_id]);
			});
	}

	function initTest() {
		console.log('initTest');
		questionNumber.set(0);
	}

	return {
		subscribe,
		createQuestion,
		initTest,
		set,
		questionNumber
	};
}

export const test = useTest();
