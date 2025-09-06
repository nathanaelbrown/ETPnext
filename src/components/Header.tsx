'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Phone, Mail, User, Menu, X } from "lucide-react"; // Add Menu and X icons
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { APP_URLS } from '@/config/urls';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Add mobile menu state
  const pathname = usePathname();
  const isResourcesPage = pathname === '/resources';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGoToPortal = async () => {
    if (user) {
     const { data: profile } = await supabase
        .from('profiles')
        .select('permissions')
        .eq('user_id', user.id)
        .single();
        
      if (profile?.permissions === 'admin' || profile?.permissions === 'administrator') {
        window.location.href = APP_URLS.ADMIN_APP;
      } else {
        window.location.href = APP_URLS.CUSTOMER_APP;
      }
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/fe72b475-c203-4999-8384-be417f456711.png" 
                alt="EasyTaxProtest.com" 
                className="h-12"
              />
            </Link>
            {isResourcesPage && (
              <span className="text-sm text-muted-foreground ml-4">/ Resources</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {pathname === '/' ? (
              <a href="#services" className="text-foreground hover:text-primary transition-colors">
                Services
              </a>
            ) : (
              <Link href="/#services" className="text-foreground hover:text-primary transition-colors">
                Services
              </Link>
            )}
            {pathname === '/' ? (
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                How It Works
              </a>
            ) : (
              <Link href="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
                How It Works
              </Link>
            )}
            <Link href="/resources" className="text-foreground hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            {pathname === '/' ? (
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            ) : (
              <Link href="/#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:555-0123" className="hidden sm:flex items-center text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              (555) 012-3456
            </a>
            
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleGoToPortal}>
                    Go to Portal
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4 px-4 py-6">
              {pathname === '/' ? (
                <a 
                  href="#services" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Services
                </a>
              ) : (
                <Link 
                  href="/#services" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Services
                </Link>
              )}
              
              {pathname === '/' ? (
                <a 
                  href="#how-it-works" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  How It Works
                </a>
              ) : (
                <Link 
                  href="/#how-it-works" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  How It Works
                </Link>
              )}
              
              <Link 
                href="/resources" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                Resources
              </Link>
              
              <Link 
                href="/about" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              
              {pathname === '/' ? (
                <a 
                  href="#contact" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </a>
              ) : (
                <Link 
                  href="/#contact" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              )}

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-border space-y-4">
                <a href="tel:555-0123" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 012-3456
                </a>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                
                {user ? (
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleGoToPortal}>
                      Go to Portal
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Button variant="default" size="sm" className="w-full" asChild>
                    <Link href="/auth" onClick={closeMobileMenu}>Sign In</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};