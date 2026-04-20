import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type View = "login" | "forgot" | "reset";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<View>("login");
  const { signIn, isAdmin, user, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  usePageTitle("Admin Login");

  // Detect password recovery event from email link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("reset");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (user && isAdmin && view !== "reset") {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Signed in successfully");
      navigate("/admin");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setSubmitting(true);
    const { error } = await resetPassword(email);
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Password reset link sent! Check your email.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await updatePassword(newPassword);
    setSubmitting(false);
    if (error) {
      toast.error("Failed to update password. Please try again.");
    } else {
      toast.success("Password updated successfully!");
      setView("login");
      navigate("/admin");
    }
  };

  return (
    <>
      <section className="py-16 sm:py-24 md:py-32">
        <div className="px-4 sm:container">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-bg mb-4">
                {view === "forgot" ? (
                  <Mail className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <Lock className="h-6 w-6 text-primary-foreground" />
                )}
              </div>
              <h1 className="font-display text-2xl font-bold">
                {view === "login" && "Admin Login"}
                {view === "forgot" && "Reset Password"}
                {view === "reset" && "Set New Password"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {view === "login" && "Sign in to manage content"}
                {view === "forgot" && "Enter your email to receive a reset link"}
                {view === "reset" && "Choose a new password for your account"}
              </p>
            </div>

            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full gradient-bg border-0 text-primary-foreground hover:opacity-90">
                  {submitting ? "Signing in..." : "Sign In"}
                </Button>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </form>
            )}

            {view === "forgot" && (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="your@email.com" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full gradient-bg border-0 text-primary-foreground hover:opacity-90">
                  {submitting ? "Sending..." : "Send Reset Link"}
                </Button>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </button>
              </form>
            )}

            {view === "reset" && (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" autoComplete="new-password" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full gradient-bg border-0 text-primary-foreground hover:opacity-90">
                  {submitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
