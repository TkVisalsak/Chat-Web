"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { signup } from "@/lib/auth-api"

interface SignupFormProps {
  onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const passwordRequirements = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password])

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { username?: string; email?: string; password?: string; form?: string } = {}

    if (!username) {
      newErrors.username = "Username is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (!allRequirementsMet) {
      newErrors.password = "Password does not meet all requirements"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setSubmitting(true)
      await signup(username, email, password)
      router.push("/chat")
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, form: err.message || "Signup failed" }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign up for your Chat Web account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-username" className="flex items-center gap-1.5 text-sm font-semibold">
          Username
          <span className="w-1 h-1 rounded-full bg-primary opacity-70" />
        </Label>
        <Input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.username && (
          <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <span>⚠️</span> {errors.username}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="flex items-center gap-1.5 text-sm font-semibold">
          Email or Phone number
          <span className="w-1 h-1 rounded-full bg-primary opacity-70" />
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <span>⚠️</span> {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="flex items-center gap-1.5 text-sm font-semibold">
          Password
          <span className="w-1 h-1 rounded-full bg-primary opacity-70" />
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="mt-2 p-3 bg-muted/50 border border-border rounded-lg text-sm">
          <p className="font-semibold text-foreground mb-2">Password must:</p>
          <ul className="space-y-1">
            <PasswordRequirement met={passwordRequirements.length}>
              Be at least 8 characters long
            </PasswordRequirement>
            <PasswordRequirement met={passwordRequirements.uppercase}>
              Contain at least 1 uppercase letter
            </PasswordRequirement>
            <PasswordRequirement met={passwordRequirements.number}>
              Contain at least 1 number
            </PasswordRequirement>
            <PasswordRequirement met={passwordRequirements.special}>
              Contain at least 1 special character
            </PasswordRequirement>
          </ul>
        </div>

        {errors.password && (
          <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <span>⚠️</span> {errors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        {submitting ? "Signing up..." : "Sign Up"}
      </Button>

      {errors.form && (
        <p className="text-xs text-destructive text-center mt-2">
          {errors.form}
        </p>
      )}
    </form>
  )
}

function PasswordRequirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs transition-colors ${
        met ? "text-success" : "text-muted-foreground"
      }`}
    >
      {met ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
      {children}
    </li>
  )
}
