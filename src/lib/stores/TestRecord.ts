import { get, writable } from 'svelte/store';
import type { Tables } from '$lib/types/database.types';
import { supabaseStore } from './ClientSupabase';
import { page } from '$app/stores';
import type { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@zerodevx/svelte-toast';
import type { TestRecord } from '$lib/types/testrecord';

export function useTestRecords() {
	const { subscribe, set, update } = writable<Tables<'test_record'>[] | undefined>();
	getTestRecords();
	async function getTestRecords() {
		const { data, error } = await get(supabaseStore)!
			.from('test_record')
			.select('*,Test(*)')
			.eq('student_id', get(page)!.params.studentId);
		if (error) {
			console.error(error);
			toast.push('%%%%Error occured while fetching test records');
			return;
		}

		set(data as Tables<'test_record'>[]);
	}
	return {
		subscribe,
		set,
		update,
		getTestRecords
	};
}

export function useTestRecord() {
	const { subscribe, set, update } = writable<TestRecord | undefined>();
	getTestRecords();
	async function getTestRecords() {
		const { data, error } = await get(supabaseStore)!
			.from('test_record')
			.select(
				'*,Test(*,Question(created_at,id,Choice(choice_num,is_correct))),student_answer(*,Choice(choice_num,is_correct))'
			)
			.order('created_at', { foreignTable: 'Test(Question)', ascending: true })
			.eq('id', get(page)!.params.testRecordId)
			.single();
		if (error) {
			console.error(error);
			toast.push('%%%%Error occured while fetching test records');
			return;
		}
		data.Test.Question.sort(function (a, b) {
			return new Date(a.created_at) - new Date(b.created_at);
		});
		console.log('data', data);
		set(data as TestRecord);
	}
	return {
		subscribe,
		set,
		update,
		getTestRecords
	};
}
