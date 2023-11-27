import { derived, get, writable } from 'svelte/store';
import { supabaseStore } from './ClientSupabase';
import type { Tables } from '$lib/types/database.types';
import { page } from '$app/stores';
import type { PostgrestError } from '@supabase/supabase-js';
import { goto } from '$app/navigation';
import { queryClientStore } from './QueryClient';

export function useTestEdit(testId: string) {
	const test = writable<
		Tables<'Test'> & { Question: Tables<'Question'> & { Choice: Tables<'Choice'>[] }[] }
	>();
	const question = writable<Tables<'Question'> & { Choice: Tables<'Choice'>[] }>();
	const error = writable<PostgrestError | null>(null);
	let questionNum: string;
	page.subscribe((page) => {
		questionNum = page.params.questionNum;
		console.log('questionNum changed', questionNum);
		fetchTest();
	});

	async function fetchTest() {
		console.log('fetchTest');
		get(supabaseStore)!
			.from('Test')
			.select('*,Question(*,Choice(*))', {
				count: 'exact'
			})
			.eq('id', testId)
			.order('created_at', { foreignTable: 'Question', ascending: true })
			.single()
			.then((res) => {
				console.log('fetchTest', res.data.Question);
				test.set(res.data);
				if (res.error) error.set(res.error);
				if (res.data.Question.length === 0) createQuestion(testId);
				else question.set(res.data.Question[Number(questionNum)]);
			});
	}

	async function save() {
		const { Choice, ...newQuestion } = get(question);

		if (Choice.find((choice) => choice.is_correct) === undefined) {
			alert('There must be one correct answer');
			throw new Error('There must be one correct answer');
		}
		const { Question, ...newTest } = get(test);
		const [testRes, questionRes] = await Promise.all([
			get(supabaseStore)!
				.from('Test')
				.upsert({
					...newTest
				}),
			get(supabaseStore)!
				.from('Question')
				.upsert({
					...newQuestion
				})
				.then((res) => {
					if (res.error) console.log(res.error);
					get(supabaseStore)!
						.from('Choice')
						.upsert(Choice)
						.then((res) => {
							if (res.error) console.log(res.error);
						});
				})
		]);
	}

	function back() {
		save().then(() => {
			goto(`/admin/test/${testId}/${Number(questionNum) - 1}`);
		});
	}

	async function deleteQuestion() {
		get(supabaseStore)!
			.from('Question')
			.delete()
			.eq('id', get(question).id)
			.then(() => {
				goto(`/admin/test/${testId}/${Number(questionNum) - 1}`);
			});
	}

	async function next() {
		await save().then(async () => {
			if (Number(questionNum) === get(test).Question.length - 1) await createQuestion(testId);
			goto(`/admin/test/${testId}/${Number(questionNum) + 1}`);
		});
	}

	async function done() {
		await save().then(async () => {
			goto(`/admin/test`);
		});
	}

	async function createQuestion(test_id: string) {
		console.log('createQuestion');

		await get(supabaseStore)!
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
				fetchTest();
			});
	}

	return {
		test,
		error,
		question,
		next,
		done,
		deleteQuestion,
		back
	};
}
