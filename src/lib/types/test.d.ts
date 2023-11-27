import { Tables } from './database.types';
export type Question = Tables<'Question'> & {
	Choice: Tables<'Choice'>[];
};

export type TestType = Tables<'Test'> & {
	test_record: Tables<'test_record'>[];
};

export type MainTestRecord = Tables<'test_record'> & {
	Test: Tables<'Test'>;
};

export type StudentTest = Tables<'Test'> & {
	Question: Question[];
	student_answer: Tables<'student_answer'>[];
};

export type QuestionWithIsCorrect = Tables<'Question'> & {
	Choice: Tables<'Choice'>[];
};
