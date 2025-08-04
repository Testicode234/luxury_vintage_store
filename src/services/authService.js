import { supabase } from '../lib/supabase';

export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  },

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase?.auth?.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase?.auth?.getSession();
    return { data, error };
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

    return { data, error };
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

    return { data, error };
  }
};