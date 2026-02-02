"use client"

import React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth-api"

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string; form?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setSubmitting(true)
      await login(email, password)
      router.push("/chat")
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, form: err.message || "Login failed" }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Login to your Chat Web account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-email" className="flex items-center gap-1.5 text-sm font-semibold">
          Email
          <span className="w-1 h-1 rounded-full bg-primary opacity-70" />
        </Label>
        <Input
          id="login-email"
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
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="flex items-center gap-1.5 text-sm font-semibold">
            Password
            <span className="w-1 h-1 rounded-full bg-primary opacity-70" />
          </Label>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
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
        {submitting ? "Logging in..." : "Login"}
      </Button>

      {errors.form && (
        <p className="text-xs text-destructive text-center mt-2">
          {errors.form}
        </p>
      )}
    </form>
  )
}
