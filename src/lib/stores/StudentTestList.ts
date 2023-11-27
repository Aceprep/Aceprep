import { get, writable } from 'svelte/store';
import type { MainTestRecord, TestType } from '$lib/types/test';
import { supabaseStore } from './ClientSupabase';
import { userStore } from './User';
import type { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@zerodevx/svelte-toast';

export function useStudentTestList() {
	const activeTest = writable<TestType[]>([]);
	const testRecord = writable<MainTestRecord[]>([]);
	const activePractice = writable<TestType[]>([]);
	const practiceRecord = writable<MainTestRecord[]>([]);
	const questionNumber = writable(0);
	activeTest.subscribe((val) => {
		console.log(val);
	});
	initTests();

	function initTests() {
		console.log('initTest');
		get(supabaseStore)!
			.from('Test')
			.select('*,test_record(*)')
			.eq('test_record.student_id', get(userStore)!.id)
			.eq('is_published', true)
			.then(({ data, error }: { data: TestType[]; error: PostgrestError }) => {
				console.log(data, error);
				if (error) toast.push(error.message);
				activeTest.set(data.filter((test) => test.is_practice === false));
				activePractice.set(data.filter((test) => test.is_practice === true));
			});
		get(supabaseStore)!
			.from('test_record')
			.select('*, Test(*)')
			.eq('student_id', get(userStore)!.id)
			.order('created_at', { ascending: false })
			.then(({ data, error }) => {
				console.log(data, error);
				if (error) toast.push(error.message);
				testRecord.set(data!.filter((testRecord) => testRecord.Test.is_practice === false));
				practiceRecord.set(data!.filter((testRecord) => testRecord.Test.is_practice === true));
			});
	}

	async function createTestRecord(test_id: string) {
		console.log('createTestRecord');
		const testRecordId = crypto.randomUUID();
		const res = await get(supabaseStore)!.from('test_record').upsert({ id: testRecordId, test_id });
		res.error && console.error(res.error);
		return testRecordId;
	}

	return {
		activeTest,
		testRecord,
		practiceRecord,
		activePractice,
		initTests,
		createTestRecord,
		questionNumber
	};
}
