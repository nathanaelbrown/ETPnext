'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toAdmin, toCustomer } from '@/config/urls';

function parseHashParams(hash: string) {
  const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(cleaned);
}

function cleanUrlHash() {
  console.log('🔍 cleanUrlHash called');
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

export default function AuthCallback() {
  const router = useRouter();
  const [showFallback, setShowFallback] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    // Check if this is a password recovery link
    const hashParams = parseHashParams(window.location.hash);
    const urlParams = new URLSearchParams(window.location.search);
    const authType = hashParams.get('type') || urlParams.get('type');
    
    console.log('🔍 Initial URL check:');
    console.log('🔍 Hash params:', hashParams.toString());
    console.log('🔍 URL params:', urlParams.toString());
    console.log('🔍 authType:', authType);
    
    if (authType === 'recovery') {
      console.log('🔍 Setting isPasswordRecovery to true');
      setIsPasswordRecovery(true);
    }

    // 1) Listen for auth events first to avoid missing session init
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔍 Auth event:', event, 'isPasswordRecovery:', isPasswordRecovery);
      
      // Route password recovery to set-password
      if (event === 'PASSWORD_RECOVERY') {
        console.log('🔍 PASSWORD_RECOVERY event detected');
        setIsPasswordRecovery(true);
        // Clean hash and navigate
        setTimeout(() => {
          cleanUrlHash();
          router.replace('/set-password');
        }, 0);
        return;
      }

      // After magic link / email confirmation
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔍 SIGNED_IN event detected for user:', session.user.email);
        
        // Check if this is password recovery first
        const hashParams = parseHashParams(window.location.hash);
        const urlParams = new URLSearchParams(window.location.search);
        const authType = hashParams.get('type') || urlParams.get('type');
        
        if (authType === 'recovery' || isPasswordRecovery) {
          console.log('🔍 Password recovery sign-in detected, going to set-password');
          console.log('🔍 authType:', authType);
          console.log('🔍 isPasswordRecovery:', isPasswordRecovery);
          console.log('🔍 Current URL before redirect:', window.location.href);
          
          setTimeout(() => {
            cleanUrlHash();
            console.log('🔍 URL after cleanUrlHash:', window.location.href);
            console.log('🔍 About to call router.replace("/set-password")');
            router.replace('/set-password');
          }, 0);
          return;
        }
        
        // Normal sign-in - check admin permissions
        console.log('🔍 Normal sign-in detected, checking permissions...');
        setTimeout(async () => {
         try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('permissions')
              .eq('user_id', session.user!.id)
              .single();

            console.log('🔍 User profile:', profile);
            const isAdmin = profile?.permissions === 'administrator' || profile?.permissions === 'admin';
            console.log('🔍 Is admin:', isAdmin);

            // Build destination on the correct app
            const dest = isAdmin ? toAdmin() : toCustomer();
            console.log('🔍 Redirecting to:', dest);

            // Get session tokens for cross-domain auth
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;
            const refreshToken = sessionData.session?.refresh_token;
            
            if (accessToken && refreshToken) {
              window.location.replace(`${dest}/?access_token=${accessToken}&refresh_token=${refreshToken}`);
            } else {
              window.location.replace(dest);
            }
          } catch (error) {
            console.error('🔍 Error checking permissions:', error);
            // If role fetch fails, just send to the customer app
            const dest = toCustomer();
            window.location.replace(dest);
          }
        }, 0);
      }
    });

    // 2) Check for existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !isPasswordRecovery) {
        console.log('🔍 Existing session found for:', session.user.email);
        
        // Check if this is actually a recovery session by looking at URL
        const hashParams = parseHashParams(window.location.hash);
        const urlParams = new URLSearchParams(window.location.search);
        const authType = hashParams.get('type') || urlParams.get('type');
        
        if (authType === 'recovery') {
          console.log('🔍 getSession detected recovery, skipping redirect');
          return; // Don't redirect if this is password recovery
        }
        
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('permissions')
              .eq('user_id', session.user!.id)
              .single();

            const isAdmin = profile?.permissions === 'administrator' || profile?.permissions === 'admin';
            const dest = isAdmin ? toAdmin() : toCustomer();

            // forward Supabase magic-link hash to the portal's domain
            const hash = window.location.hash; // e.g. "#access_token=...&refresh_token=..."
            if (hash && hash.length > 1) {
              window.location.replace(`${dest}${hash}`);
            } else {
              window.location.replace(dest);
            }
          } catch {
            const dest = toCustomer();
            const hash = window.location.hash;
            window.location.replace(hash && hash.length > 1 ? `${dest}${hash}` : dest);
          }
        }, 0);
      }
    });

    // 3) Inspect URL hash for explicit recovery type (fallback)
    const hashParams2 = parseHashParams(window.location.hash);
    const urlParams2 = new URLSearchParams(window.location.search);
    const type = hashParams2.get('type') || urlParams2.get('type');

    console.log('🔍 Immediate recovery check - type:', type);
    console.log('🔍 Hash params:', hashParams2.toString());
    console.log('🔍 URL params:', urlParams2.toString());

    if (type === 'recovery' || type === 'invite' || type === 'signup') {
      console.log('🔍 IMMEDIATE recovery detected, going to set-password');
      // Let Supabase process tokens, then go to set-password
      setTimeout(() => {
        cleanUrlHash();
        console.log('🔍 About to navigate via immediate handler');
        router.replace('/set-password');
      }, 0);
    }

    // 4) Set timeout fallback
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [router, isPasswordRecovery]);

  const handleManualNavigation = () => {
    const params = parseHashParams(window.location.hash);
    const type = params.get('type');
    
    if (type === 'recovery' || type === 'invite' || type === 'signup') {
      router.replace('/set-password');
    } else {
      router.replace('/auth');
    }
  };

  useEffect(() => {
    document.title = 'Authenticate | Protest Property Pro';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Signing you in…</CardTitle>
          <CardDescription>
            {showFallback 
              ? "Taking longer than expected. You can try manual navigation." 
              : "Processing your secure link."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          {!showFallback ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <div className="space-y-3 w-full">
              <Button 
                onClick={handleManualNavigation}
                className="w-full"
                variant="default"
              >
                Continue Authentication
              </Button>
              <Button 
                onClick={() => router.replace('/auth')}
                className="w-full"
                variant="outline"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}