import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured, UserProfile, UserRole } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isSupabaseConfigured: boolean;
}

interface SignInResult {
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | { message: string } | null;
}

interface SignUpResult {
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | { message: string } | null;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Refs to prevent duplicate fetches
    const profileFetchedRef = useRef<string | null>(null);
    const initializingRef = useRef(false);

    // Fetch user profile from database - with caching
    const fetchProfile = useCallback(async (userId: string, forceRefresh = false): Promise<UserProfile | null> => {
        if (!isSupabaseConfigured) {
            return null;
        }

        // Skip if already fetched for this user (unless forced)
        if (!forceRefresh && profileFetchedRef.current === userId && profile) {
            console.log('📋 Using cached profile for user:', userId);
            return profile;
        }

        try {
            console.log('📋 Fetching profile for user:', userId);
            
            const { data, error: fetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    console.warn('⚠️ Profile not found for user:', userId);
                    profileFetchedRef.current = userId;
                    return null;
                }
                console.error('❌ Error fetching profile:', fetchError);
                return null;
            }

            console.log('✅ Profile loaded:', data?.role);
            profileFetchedRef.current = userId;
            return data;
        } catch (err: any) {
            console.error('❌ Error in fetchProfile:', err);
            return null;
        }
    }, [profile]);

    // Initialize auth state - ONLY ONCE
    useEffect(() => {
        if (!isSupabaseConfigured) {
            console.warn('⚠️ Supabase not configured - authentication disabled');
            setLoading(false);
            setError('Supabase is not configured. Please check .env.local file.');
            return;
        }

        // Prevent double initialization
        if (initializingRef.current) {
            return;
        }
        initializingRef.current = true;

        let isMounted = true;

        // Get initial session - FAST
        const initializeAuth = async () => {
            try {
                console.log('🔐 Initializing authentication...');
                
                // Set a timeout for slow connections
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Auth timeout')), 3000)
                );
                
                const sessionPromise = supabase.auth.getSession();
                
                let result;
                try {
                    result = await Promise.race([sessionPromise, timeoutPromise]) as any;
                } catch (timeoutErr) {
                    console.warn('⚠️ Auth initialization timed out, continuing without session');
                    if (isMounted) {
                        setLoading(false);
                    }
                    return;
                }
                
                const { data: { session: currentSession }, error: sessionError } = result;
                
                if (sessionError) {
                    console.error('❌ Error getting session:', sessionError);
                    if (isMounted) {
                        setError(sessionError.message);
                        setLoading(false);
                    }
                    return;
                }

                if (isMounted) {
                    setSession(currentSession);
                    setUser(currentSession?.user ?? null);

                    if (currentSession?.user) {
                        console.log('👤 User found, fetching profile...');
                        const userProfile = await fetchProfile(currentSession.user.id);
                        if (isMounted) {
                            setProfile(userProfile);
                        }
                    }
                    
                    // ALWAYS set loading to false here
                    setLoading(false);
                }
            } catch (err: any) {
                console.error('❌ Error initializing auth:', err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        // Listen for auth changes - but DON'T set loading
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                console.log('🔄 Auth state changed:', event);
                
                // Skip initial events to avoid duplicate work
                if (event === 'INITIAL_SESSION') {
                    return;
                }
                
                if (isMounted) {
                    setSession(newSession);
                    setUser(newSession?.user ?? null);

                    if (newSession?.user) {
                        // Only fetch profile if user changed
                        if (profileFetchedRef.current !== newSession.user.id) {
                            const userProfile = await fetchProfile(newSession.user.id);
                            if (isMounted) {
                                setProfile(userProfile);
                            }
                        }
                    } else {
                        setProfile(null);
                        profileFetchedRef.current = null;
                    }
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    // Sign in with email and password
    const signIn = async (email: string, password: string): Promise<SignInResult> => {
        if (!isSupabaseConfigured) {
            return { 
                data: null, 
                error: { message: 'Supabase is not configured. Please check .env.local file.' } 
            };
        }

        try {
            console.log('🔐 Signing in:', email);
            setError(null);
            
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error('❌ Sign in error:', signInError);
                return { data: null, error: signInError };
            }

            // Immediately fetch profile after sign in
            if (data.user) {
                profileFetchedRef.current = null; // Force refresh
                const userProfile = await fetchProfile(data.user.id, true);
                setProfile(userProfile);
                setUser(data.user);
                setSession(data.session);
            }

            console.log('✅ Sign in successful');
            return { data, error: null };
        } catch (err: any) {
            console.error('❌ Sign in exception:', err);
            return { data: null, error: { message: err.message } };
        }
    };

    // Sign up with email and password
    const signUp = async (email: string, password: string, fullName?: string): Promise<SignUpResult> => {
        if (!isSupabaseConfigured) {
            return { 
                data: null, 
                error: { message: 'Supabase is not configured. Please check .env.local file.' } 
            };
        }

        try {
            console.log('📝 Signing up:', email);
            setError(null);
            
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || '',
                    },
                },
            });

            if (signUpError) {
                console.error('❌ Sign up error:', signUpError);
                return { data: null, error: signUpError };
            }

            console.log('✅ Sign up successful');
            return { data, error: null };
        } catch (err: any) {
            console.error('❌ Sign up exception:', err);
            return { data: null, error: { message: err.message } };
        }
    };

    // Sign out
    const signOut = async () => {
        if (!isSupabaseConfigured) {
            setUser(null);
            setProfile(null);
            setSession(null);
            profileFetchedRef.current = null;
            return { error: null };
        }

        try {
            console.log('🚪 Signing out...');
            const { error: signOutError } = await supabase.auth.signOut();
            
            if (signOutError) {
                console.error('❌ Sign out error:', signOutError);
                return { error: signOutError };
            }

            setUser(null);
            setProfile(null);
            setSession(null);
            profileFetchedRef.current = null;
            console.log('✅ Signed out');
            return { error: null };
        } catch (err: any) {
            console.error('❌ Sign out exception:', err);
            return { error: { message: err.message } };
        }
    };

    // Refresh profile
    const refreshProfile = async () => {
        if (user) {
            profileFetchedRef.current = null; // Force refresh
            const userProfile = await fetchProfile(user.id, true);
            setProfile(userProfile);
        }
    };

    // Update profile
    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!isSupabaseConfigured || !user) {
            return { error: { message: 'Not authenticated' } };
        }

        try {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', user.id);

            if (updateError) {
                return { error: updateError };
            }

            await refreshProfile();
            return { error: null };
        } catch (err: any) {
            return { error: { message: err.message } };
        }
    };

    // Computed properties
    const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';
    const isSuperAdmin = profile?.role === 'superadmin';

    return {
        // State
        user,
        profile,
        session,
        loading,
        error,
        
        // Computed
        isAdmin,
        isSuperAdmin,
        isSupabaseConfigured,
        isAuthenticated: !!user,
        
        // Actions
        signIn,
        signUp,
        signOut,
        refreshProfile,
        updateProfile,
    };
}
