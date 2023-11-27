export interface TestRecord {
	created_at: string;
	test_id: string;
	student_id: string;
	correct_count: number;
	total_count: number;
	id: string;
	Test: Test;
	student_answer: StudentAnswer[];
}

export interface Test {
	id: string;
	created_at: string;
	updated_at: string;
	author_id: string;
	title: string;
	test_time: number;
	Question: Question[];
}

export interface Question {
	id: string;
	Choice: Choice[];
}

export interface Choice {
	choice_num: number;
	is_correct: boolean;
}

export interface StudentAnswer {
	created_at: string;
	student_id: string;
	question_id: string;
	is_bookmarked: boolean;
	id: string;
	test_record_id: string;
	choice_id: string;
	Choice: Choice2;
}

export interface Choice2 {
	choice_num: number;
	is_correct: boolean;
}
