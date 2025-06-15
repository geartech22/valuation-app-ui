// loginStore.js
import { create } from 'zustand';
import { supabase } from './index';

export const useLoginStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    userDetails: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            set({ isLoading: false, user: null, error: error.message });
            return { status: 'error', message: error.message };
        }

        set({ user: data.user, isLoading: false, error: null });
        return { status: 'success', message: 'Login successful' };
    },

    logout: async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            set({ isLoading: false, user: null, error: error.message });
            return { status: 'error', message: error.message };
        }

        set({ user: null, isLoading: false, error: null });
        return { status: 'success', message: 'Logout successful' };
    },
    authSession: async () => {
        set({ isLoading: true, error: null });

        const { data, error } = await supabase.auth.getSession();

        if (error) {
            set({ isLoading: false, user: null, error: error.message });
            return { status: 'error', message: error.message, data: null };
        }

        set({ user: data.session?.user || null, isLoading: false, error: null });
        return { status: 'success', message: 'Session fetched successfully', data: data.session?.user || null };
    },
    fetchUserById: async (id) => {
        const { data, error } = await supabase
            .from('people')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            set({ isLoading: false, user: null, error: error.message });
            return { status: 'error', message: error.message, data: null };
        }

        set({ userDetails: data, isLoading: false, error: null });
        return { status: 'success', message: 'User fetched successfully', data };
    },
}));