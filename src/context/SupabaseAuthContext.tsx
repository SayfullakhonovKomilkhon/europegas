import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured, UserProfile } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface SignInResult {
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | { message: string } | null;
}

interface SignUpResult {
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | { message: string } | null;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isSupabaseConfigured: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<SignInResult>;
    signUp: (email: string, password: string, fullName?: string) => Promise<SignUpResult>;
    signOut: () => Promise<{ error: any }>;
    refreshProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const profileCache = useRef<{ userId: string; profile: UserProfile | null } | null>(null);
    const initDone = useRef(false);

    // Fetch user profile from database - FAST with 1.5s timeout
    const fetchProfile = useCallback(async (userId: string, forceRefresh = false): Promise<UserProfile | null> => {
        if (!isSupabaseConfigured) return null;

        // Use cached profile
        if (!forceRefresh && profileCache.current?.userId === userId && profileCache.current.profile) {
            return profileCache.current.profile;
        }

        try {
            // Race between fetch and timeout
            const fetchPromise = supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) => {
                setTimeout(() => resolve({ data: null, error: { message: 'timeout' } }), 1500);
            });
            
            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (error || !data) {
                profileCache.current = { userId, profile: null };
                return null;
            }

            console.log('✅ Profile:', data.role);
            profileCache.current = { userId, profile: data as UserProfile };
            return data as UserProfile;
        } catch (err: any) {
            profileCache.current = { userId, profile: null };
            return null;
        }
    }, []);

    // Initialize auth state - FAST
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        let mounted = true;

        const initialize = async () => {
            if (initDone.current) return;
            initDone.current = true;
            
            try {
                // Quick session check
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                
                if (!mounted) return;
                
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                
                // Fetch profile in background, don't block
                if (currentSession?.user) {
                    fetchProfile(currentSession.user.id).then(profile => {
                        if (mounted) setProfile(profile);
                    });
                }
                
                // Set loading false immediately after session check
                setLoading(false);
            } catch (err: any) {
                if (mounted) setLoading(false);
            }
        };

        initialize();

        // Auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                if (!mounted) return;
                
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setLoading(false);

                if (newSession?.user) {
                    // Fetch profile without blocking
                    if (profileCache.current?.userId !== newSession.user.id) {
                        fetchProfile(newSession.user.id).then(profile => {
                            if (mounted) setProfile(profile);
                        });
                    } else {
                        setProfile(profileCache.current?.profile ?? null);
                    }
                } else {
                    setProfile(null);
                    profileCache.current = null;
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    // Sign in - FAST
    const signIn = async (email: string, password: string): Promise<SignInResult> => {
        if (!isSupabaseConfigured) {
            return { data: null, error: { message: 'Supabase is not configured' } };
        }

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                return { data: null, error: signInError };
            }

            if (data.user) {
                setUser(data.user);
                setSession(data.session);
                
                // Fetch profile in background
                fetchProfile(data.user.id, true).then(profile => {
                    setProfile(profile);
                });
            }

            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: { message: err.message } };
        }
    };

    // Sign up
    const signUp = async (email: string, password: string, fullName?: string): Promise<SignUpResult> => {
        if (!isSupabaseConfigured) {
            return { data: null, error: { message: 'Supabase is not configured' } };
        }

        try {
            console.log('📝 Signing up:', email);
            setError(null);
            
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName || '' } },
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
        try {
            console.log('🚪 Signing out...');
            
            profileCache.current = null;
            initDone.current = false;
            
            const { error: signOutError } = await supabase.auth.signOut();
            
            if (signOutError) {
                console.error('❌ Sign out error:', signOutError);
                return { error: signOutError };
            }

            setUser(null);
            setProfile(null);
            setSession(null);
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

            if (updateError) return { error: updateError };

            await refreshProfile();
            return { error: null };
        } catch (err: any) {
            return { error: { message: err.message } };
        }
    };

    // Computed
    const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';
    const isSuperAdmin = profile?.role === 'superadmin';

    const value: AuthContextType = {
        user,
        profile,
        session,
        loading,
        error,
        isAdmin,
        isSuperAdmin,
        isSupabaseConfigured,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useSupabaseAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
    }
    return context;
}

export const useAuth = useSupabaseAuth;
