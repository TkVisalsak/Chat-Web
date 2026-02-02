"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { SocialButtons } from "@/components/auth/social-buttons"

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-4xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          {/* Form Content */}
          <div className="flex-1 p-6 md:p-8">
            {activeForm === "login" ? (
              <LoginForm onSwitchToSignup={() => setActiveForm("signup")} />
            ) : (
              <SignupForm onSwitchToLogin={() => setActiveForm("login")} />
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-card text-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialButtons />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {activeForm === "login" ? (
                <>
                  {"Don't have an account? "}
                  <button
                    onClick={() => setActiveForm("signup")}
                    className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveForm("login")}
                    className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Decorative Image Side */}
          <div className="hidden md:block flex-1 relative bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=400')] bg-cover bg-center opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to Chat Web</h2>
              <p className="text-sm opacity-90">
                Connect with friends and family instantly with our secure messaging platform.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-muted-foreground max-w-lg mx-auto p-4 bg-muted/30 rounded-lg backdrop-blur-sm">
          By clicking continue, you agree to our{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  )
}
