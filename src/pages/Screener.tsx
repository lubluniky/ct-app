import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Lock, LogIn, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ============================================
// COMPONENT
// ============================================

const Screener = () => {
  const { user, profile, loading: authLoading, signInWithGoogle } = useAuth();
  
  // Access Control Check
  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !profile || (profile.tier !== 'pro' && profile.tier !== 'ultra')) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Access Restricted</h2>
          <p className="text-muted-foreground">
            The Screener is available exclusively for <span className="font-bold text-foreground">PRO</span> and <span className="font-bold text-foreground">ULTRA</span> members. 
            Please log in to access real-time market screening.
          </p>
        </div>
        {!user && (
          <Button onClick={() => signInWithGoogle()} size="lg" className="gap-2">
            <LogIn className="w-4 h-4" />
            Login with Google
          </Button>
        )}
      </div>
    );
  }

  // Redirect for authorized users
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
        <ExternalLink className="w-10 h-10 text-emerald-500" />
      </div>
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Launching Beta Screener</h2>
        <p className="text-muted-foreground">
          We have moved our advanced screener to a dedicated high-performance platform.
        </p>
        <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm text-muted-foreground">
          Redirecting you to <span className="font-mono text-foreground">beta-screener.vercel.app</span>...
        </div>
        <Button 
          onClick={() => window.location.href = 'https://beta-screener.vercel.app'} 
          size="lg" 
          className="gap-2 w-full"
        >
          Open Screener Now
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Auto-redirect effect */}
      <RedirectEffect />
    </div>
  );
};

const RedirectEffect = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://beta-screener.vercel.app';
    }, 2000); // 2 second delay for user to see the message
    return () => clearTimeout(timer);
  }, []);
  return null;
};

export default Screener;
