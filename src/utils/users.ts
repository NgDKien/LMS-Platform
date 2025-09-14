import { createClient } from './supabase/client';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

export interface IUserLink {
    id: string;
    label: string;
    url: string;
}

export interface IUser {
    clerk_id: string; // dùng clerk_id thay cho id
    email: string | null;
    name: string | null;
    description: string | null;
    avatar: string | null;
    created_at: Date;
    updated_at: Date | null;
    links: IUserLink[]; // jsonb[] trả về mảng, bạn có thể định nghĩa type chi tiết hơn
    provider: 'clerk' | 'google' | 'github' | 'email';
}

export const users = {
    async getUser(clerk_id: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', clerk_id) // đổi id -> clerk_id
            .single();

        if (error) throw error;
        return data as IUser | null;
    },

    async createUser(user: Partial<IUser>) {
        const { data, error } = await supabase
            .from('users')
            .insert([user])
            .select()
            .single();

        if (error) throw error;
        return data as IUser;
    },
};
