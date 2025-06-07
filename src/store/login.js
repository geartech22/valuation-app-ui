export const loginAsync = async (supabase) => {
    // Attempt to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
        email: '