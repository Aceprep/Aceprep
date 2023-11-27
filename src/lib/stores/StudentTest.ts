import { derived, get, writable } from 'svelte/store';
import type { StudentTest, TestType } from '$lib/types/test';
import { supabaseStore } from './ClientSupabase';
import type { Tables } from '$lib/types/database.types';
import { page } from '$app/stores';
import type { PostgrestError } from '@supabase/supabase-js';
import { userStore } from './User';
import { goto } from '$app/navigation';
import { toast } from '@zerodevx/svelte-toast';
export function useStudentTest(testId: string, testRecordId: string, questionNum: string) {
	const test = writable<StudentTest>();
	const error = writable<PostgrestError | null>(null);
	const student_answer = writable<Tables<'student_answer'>>();
	const student_answer_list = writable<Tables<'student_answer'>[]>();
	const testTimeRecord = writable<Tables<'test_time_record'>[]>();

	student_answer_list.subscribe((val) => {
		console.log('answer_list', val);
	});
	let remainingTime = derived([testTimeRecord, test], ([$testTimeRecord, $test]) => {
		if (!$test || !$testTimeRecord || !$testTimeRecord.find((record) => record.ended_at === null))
			return 0;
		let totalSpentTime = 0;
		$testTimeRecord.forEach((record) => (totalSpentTime += record.spent_time ?? 0));
		let thisTestStartTime = new Date(
			$testTimeRecord.find((record) => record.ended_at === null)!.created_at
		);
		let now = new Date();
		let thisTestTimeSpent = Math.floor((now - thisTestStartTime) / 1000);
		console.log('thisTestTimeSpent', thisTestTimeSpent);
		return $test.test_time - totalSpentTime;
	});
	remainingTime.subscribe(console.log);
	page.subscribe((page) => {
		get(supabaseStore)!
			.from('Test')
			.select('*,Question(*,Choice(question_id, id, choice))', {
				count: 'exact'
			})
			.eq('id', testId)
			.single()
			.then((res) => {
				test.set(res.data as StudentTest);
				error.set(res.error);
				if (res.error) console.log(res.error);
			});
		get(supabaseStore)!
			.from('student_answer')
			.select('*')
			.eq('test_record_id', testRecordId)
			.eq('student_id', get(userStore)!.id)
			.then((res) => {
				student_answer_list.set(res.data as Tables<'student_answer'>[]);
				if (res.error) console.log(res.error);
			});
		get(supabaseStore)!
			?.from('test_time_record')
			.select('*')
			.eq('test_record_id', testRecordId)
			.eq('student_id', get(userStore)!.id)
			.then(async ({ data: testTimeData, error }) => {
				if (error) throw error;
				if (testTimeData.length === 0 || !testTimeData.find((record) => record.ended_at === null)) {
					console.log('새로운 테스트 시간 레코드 생성');
					await get(supabaseStore)
						?.from('test_time_record')
						.insert([{ test_record_id: testRecordId, student_id: get(userStore)!.id }])
						.select('*')
						.then(({ data: testTimeData, error }) => {
							if (error) throw error;
							console.log('새로운 테스트 시간 사용 로그', testTimeData);
						});
					const { data, error } = await get(supabaseStore)!
						?.from('test_time_record')
						.select('*')
						.eq('test_record_id', testRecordId)
						.eq('student_id', get(userStore)!.id);
					if (error) throw error;
					testTimeRecord.set(data);
					return;
				}
				console.log('기존 테스트 시간 사용 로그', testTimeData);
				testTimeRecord.set(testTimeData);
			});
	});

	const question = derived(test, ($test) => $test?.Question.at(Number(questionNum)));
	question.subscribe((question) => {
		if (question) getStudentAnswer();
	});
	async function saveAndExit() {
		await saveAnswer();
		// 여기에 테스트 시간 저장 코드 추가
		let thisTestTimeRecord = get(testTimeRecord)!.find((record) => record.ended_at === null)!;
		let spent_time = Math.floor((new Date() - new Date(thisTestTimeRecord.created_at)) / 1000);
		console.log('spent_time', spent_time);

		await get(supabaseStore)!
			?.from('test_time_record')
			.update({ ended_at: new Date(), spent_time: spent_time })
			.eq('id', thisTestTimeRecord.id);
		goto(`/`);
	}

	async function getStudentAnswer() {
		const res = await get(supabaseStore)!
			.from('student_answer')
			.select('*')
			.eq('question_id', get(question)!.id)
			.eq('test_record_id', testRecordId)
			.eq('student_id', get(userStore)!.id);
		if (res.data && res.data.length > 0) student_answer.set(res.data[0]);
		else
			student_answer.set({
				id: crypto.randomUUID(),
				student_id: get(userStore)!.id,
				test_record_id: testRecordId,
				question_id: get(question)!.id,
				choice_id: null,
				is_bookmarked: false
			});
	}

	async function saveAnswer() {
		await get(supabaseStore)!
			.from('student_answer')
			.upsert(get(student_answer)!)
			.then((res) => {
				if (res.error) alert(res.error.message);
				else toast.push('Answer saved');
			});
	}

	function back() {
		saveAnswer().then(() => {
			goto(`/student/test/${testId}/${testRecordId}/${Number(questionNum) - 1}`);
		});
	}

	function next() {
		saveAnswer().then(() => {
			if (Number(questionNum) + 1 == get(test).Question.length)
				goto(`/student/test/${testId}/${testRecordId}/summary`);
			else goto(`/student/test/${testId}/${testRecordId}/${Number(questionNum) + 1}`);
		});
	}

	return {
		test,
		error,
		question,
		student_answer,
		student_answer_list,
		saveAndExit,
		next,
		back
	};
}
