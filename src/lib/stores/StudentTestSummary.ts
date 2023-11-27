import { derived, get, writable } from 'svelte/store';
import type { QuestionWithIsCorrect, StudentTest, TestType } from '$lib/types/test';
import { supabaseStore } from './ClientSupabase';
import type { Tables } from '$lib/types/database.types';
import { page } from '$app/stores';
import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { userStore } from './User';
import { goto } from '$app/navigation';
import { toast } from '@zerodevx/svelte-toast';
export function useStudentTestSummary() {
	const test = writable<StudentTest>();
	const error = writable<PostgrestError | null>(null);
	const student_answer_list = writable<Tables<'student_answer'>[]>();
	let testId: string;
	let questionNum: string;
	let testRecordId: string;
	student_answer_list.subscribe((val) => {
		console.log('answer_list', val);
	});
	const unsubscribePage = page.subscribe((page) => {
		testId = page.params.testId;
		testRecordId = page.params.testRecordId;
		get(supabaseStore)!
			.from('Test')
			.select('*,Question(*,Choice(question_id, id, choice))', {
				count: 'exact'
			})
			.eq('id', testId)
			.order('created_at', { foreignTable: 'Question', ascending: true })
			.single()
			.then((res) => {
				test.set(res.data as StudentTest);
				error.set(res.error);
			});
		get(supabaseStore)!
			.from('student_answer')
			.select('*')
			.eq('test_record_id', testRecordId)
			.eq('student_id', get(userStore)!.id)
			.then((res) => {
				student_answer_list.set(res.data as Tables<'student_answer'>[]);
			});
	});

	function back() {
		goto(`/student/test/${testId}/${testRecordId}/${get(test).Question.length - 1}`);
	}

	async function next() {
		get(test).Question.forEach((question) => {
			if (
				get(student_answer_list).find((answer) => answer.question_id === question.id) === undefined
			) {
				student_answer_list.set([
					...get(student_answer_list),
					{
						question_id: question.id,
						is_bookmarked: false,
						test_record_id: testRecordId,
						choice_id: null
					}
				]);
			}
		});
		//* 채점로직-> 테스트기록 데이터베이스에 저장
		const { data, error }: PostgrestSingleResponse<QuestionWithIsCorrect[]> = await get(
			supabaseStore
		)!
			.from('Question')
			.select('*,Choice(*)')
			.eq('test_id', testId);
		console.log('정답지', data, error);
		if (!data || error) {
			toast.push('Failed to get the answer sheet.');
			return;
		}
		const correctCount = get(student_answer_list).filter((answer) => {
			const correct_choice = data
				.find((question) => question.id === answer.question_id)!
				.Choice.find((choice) => choice.is_correct);

			console.log('choice', correct_choice);
			console.log('정답비교', answer.choice_id, correct_choice?.id);
			return answer.choice_id === correct_choice?.id;
		});
		console.log('정답개수', `${correctCount.length}/${get(student_answer_list).length}`);
		const { data: testRecordData, error: testError } = await get(supabaseStore)!
			.from('test_record')
			.upsert({
				id: testRecordId,
				test_id: testId,
				correct_count: correctCount.length,
				total_count: get(student_answer_list).length
			});
		console.log('테스트기록 생성 결과', testRecordData, testError);
		if (testError) {
			toast.push('Failed to get the answer sheet.');
			return;
		}
		//* 테스트 리뷰 페이지로 이동
		unsubscribePage();
		goto(`/testrecord/${get(userStore)!.id}`);
	}

	return {
		test,
		error,
		student_answer_list,
		next,
		back
	};
}
