

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import AuthCard from "./auth-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function GoogleIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
        <path fill="#4285F4" d="M21.35 11.1h-9.2v2.7h5.2c-.2 1.7-1.4 2.9-3.1 2.9-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1c1.1 0 2.1.4 2.8 1.1l2.1-2.1c-1.3-1.2-3-2-5-2-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5c4.4 0 7.2-3.1 7.2-7.3 0-.5-.1-.9-.2-1.3z"/>
      </svg>
    )
}

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});


interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isLogin = mode === "login";

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          if (session?.user) {
            window.location.replace('/leads');
          }
        }
      } catch (error) {
        // Ignore error, user not logged in
      }
    };
    checkSession();
  }, []);

  const formSchema = isLogin ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isLogin 
      ? { email: "", password: "" } 
      : { username: "", email: "", password: "" },
  });

  const handleManualAuth = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });
        toast({
          title: "Authentication Successful",
          description: "Welcome to your dashboard!",
        });
        // Force redirect with page reload
        setTimeout(() => {
          window.location.replace('/leads');
        }, 500);
      } else {
        await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: (values as any).username,
        });
        toast({
          title: "Account Created",
          description: "Welcome to DataFlow Pro!",
        });
        // Force redirect with page reload
        setTimeout(() => {
          window.location.replace('/leads');
        }, 500);
      }
    } catch (error: any) {
      let errorMessage = "Failed to authenticate";
      if (error.message?.includes('existing email') || error.status === 422) {
        errorMessage = isLogin ? "Invalid email or password" : "Email already exists. Please sign in instead.";
      } else if (error.message?.includes('User not found') || error.status === 401) {
        errorMessage = isLogin ? "Account not found. Please sign up first (memory adapter clears data on refresh)." : "Failed to create account";
      }
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/leads",
      });
      // Redirect will be handled by callbackURL
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title={isLogin ? "Welcome Back" : "Create an Account"}
      subtitle={isLogin ? "Sign in to continue to DataFlow Pro" : "Get started with your business intelligence dashboard"}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleManualAuth)} className="space-y-6" suppressHydrationWarning>
          {!isLogin && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex Starr" {...field} suppressHydrationWarning />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="alex.starr@example.com" {...field} suppressHydrationWarning />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} suppressHydrationWarning />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow-lg shadow-indigo-500/30" disabled={isLoading} suppressHydrationWarning>
              {isLoading ? "Loading..." : (isLogin ? "Log In" : "Create Account")}
            </Button>
          </motion.div>
        </form>
      </FormProvider>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full" 
              disabled={isLoading}
              suppressHydrationWarning
          >
              {isLoading ? "Redirecting..." : (
                  <>
                      <GoogleIcon />
                      Sign in with Google
                  </>
              )}
          </Button>
      </motion.div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <Link href={isLogin ? "/signup" : "/login"} className="text-primary hover:underline font-semibold">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </div>
    </AuthCard>
  );
}
