"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, LogOut, LogIn, Loader2 } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
          <User className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold text-zinc-300">{user.email?.split('@')[0]}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-zinc-500 hover:text-white transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const btnClass = "flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-black text-xs font-black uppercase tracking-widest rounded-lg transition-all";

  return (
    <button onClick={handleLogin} disabled={signingIn} className={btnClass}>
      {signingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      {signingIn ? 'Sending...' : 'Sign In'}
    </button>
  );
}
