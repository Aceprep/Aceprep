// See https://kit.svelte.dev/docs/types#app

import { Database } from '$lib/Database.types';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import type { User } from '$lib/types/user';
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			user: User;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
