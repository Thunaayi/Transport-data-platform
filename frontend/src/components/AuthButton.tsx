"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as UserIcon, LogOut, LogIn, Loader2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const email = window.prompt("Enter your email for magic link login:");
    if (!email) return;
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setSigningIn(false);
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Skeleton: matches button size, no rounded-full
  if (loading) return <div className="w-20 h-8 rounded-lg bg-zinc-800 animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-cream border-2 border-brand-dark">
          <UserIcon className="w-4 h-4 text-brand-dark" />
          <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">{user.email?.split('@')[0]}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-brand-dark hover:text-brand-green transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const btnClass = "flex items-center justify-center gap-2 px-4 py-2 bg-brand-green hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark border-2 border-brand-dark text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 shadow-[2px_2px_0px_0px_rgba(24,60,40,1)]";

  return (
    <button onClick={handleLogin} disabled={signingIn} className={btnClass}>
      {signingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      {signingIn ? 'Sending...' : 'Sign In'}
    </button>
  );
}
