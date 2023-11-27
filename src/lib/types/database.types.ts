import type { PostgrestError } from '@supabase/supabase-js';

export type Tables<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			Choice: {
				Row: {
					choice: string;
					choice_num: number;
					id: string;
					is_correct: boolean;
					question_id: string;
				};
				Insert: {
					choice?: string;
					choice_num?: number;
					id?: string;
					is_correct?: boolean;
					question_id: string;
				};
				Update: {
					choice?: string;
					choice_num?: number;
					id?: string;
					is_correct?: boolean;
					question_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Choice_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'Question';
						referencedColumns: ['id'];
					}
				];
			};
			notice: {
				Row: {
					content: string;
					id: string;
				};
				Insert: {
					content: string;
					id: string;
				};
				Update: {
					content?: string;
					id?: string;
				};
				Relationships: [];
			};
			Question: {
				Row: {
					choice_intro: string;
					created_at: string;
					id: string;
					paragraph: string;
					test_id: string;
					updated_at: string;
				};
				Insert: {
					choice_intro?: string;
					created_at?: string;
					id?: string;
					paragraph?: string;
					test_id: string;
					updated_at?: string;
				};
				Update: {
					choice_intro?: string;
					created_at?: string;
					id?: string;
					paragraph?: string;
					test_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Question_test_id_fkey';
						columns: ['test_id'];
						isOneToOne: false;
						referencedRelation: 'Test';
						referencedColumns: ['id'];
					}
				];
			};
			student_answer: {
				Row: {
					choice_id: string | null;
					created_at: string;
					id: string;
					is_bookmarked: boolean;
					question_id: string | null;
					student_id: string;
					test_record_id: string;
				};
				Insert: {
					choice_id?: string | null;
					created_at?: string;
					id?: string;
					is_bookmarked?: boolean;
					question_id?: string | null;
					student_id: string;
					test_record_id: string;
				};
				Update: {
					choice_id?: string | null;
					created_at?: string;
					id?: string;
					is_bookmarked?: boolean;
					question_id?: string | null;
					student_id?: string;
					test_record_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'student_answer_choice_id_fkey';
						columns: ['choice_id'];
						isOneToOne: false;
						referencedRelation: 'Choice';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'student_answer_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'Question';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'student_answer_student_id_fkey';
						columns: ['student_id'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'student_answer_test_record_id_fkey';
						columns: ['test_record_id'];
						isOneToOne: false;
						referencedRelation: 'test_record';
						referencedColumns: ['id'];
					}
				];
			};
			Test: {
				Row: {
					author_id: string | null;
					created_at: string;
					id: string;
					is_published: boolean;
					test_time: number;
					title: string;
					updated_at: string;
				};
				Insert: {
					author_id?: string | null;
					created_at?: string;
					id?: string;
					is_published?: boolean;
					test_time?: number;
					title?: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string | null;
					created_at?: string;
					id?: string;
					is_published?: boolean;
					test_time?: number;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Test_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			test_record: {
				Row: {
					correct_count: number | null;
					created_at: string;
					id: string;
					student_id: string;
					test_id: string;
					total_count: number | null;
				};
				Insert: {
					correct_count?: number | null;
					created_at?: string;
					id?: string;
					student_id?: string;
					test_id: string;
					total_count?: number | null;
				};
				Update: {
					correct_count?: number | null;
					created_at?: string;
					id?: string;
					student_id?: string;
					test_id?: string;
					total_count?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'test_record_student_id_fkey';
						columns: ['student_id'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'test_record_test_id_fkey';
						columns: ['test_id'];
						isOneToOne: false;
						referencedRelation: 'Test';
						referencedColumns: ['id'];
					}
				];
			};
			test_time_record: {
				Row: {
					created_at: string;
					ended_at: string | null;
					id: number;
					spent_time: number | null;
					student_id: string;
					test_record_id: string;
				};
				Insert: {
					created_at?: string;
					ended_at?: string | null;
					id?: number;
					spent_time?: number | null;
					student_id: string;
					test_record_id: string;
				};
				Update: {
					created_at?: string;
					ended_at?: string | null;
					id?: number;
					spent_time?: number | null;
					student_id?: string;
					test_record_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'test_time_record_student_id_fkey';
						columns: ['student_id'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'test_time_record_test_record_id_fkey';
						columns: ['test_record_id'];
						isOneToOne: false;
						referencedRelation: 'test_record';
						referencedColumns: ['id'];
					}
				];
			};
			User: {
				Row: {
					created_at: string;
					email: string;
					id: string;
					is_admin: boolean;
					is_confirmed: boolean;
					is_teacher: boolean;
					name: string;
					phone: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					id: string;
					is_admin?: boolean;
					is_confirmed?: boolean;
					is_teacher?: boolean;
					name: string;
					phone: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					id?: string;
					is_admin?: boolean;
					is_confirmed?: boolean;
					is_teacher?: boolean;
					name?: string;
					phone?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'User_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
