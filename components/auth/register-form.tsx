"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, Sparkles, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegisterFormProps {
  onRegister: (data: {
    email: string
    password: string
    role: string
    institution?: string
  }) => Promise<void>
  loading: boolean
}

export function RegisterForm({ onRegister, loading }: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [institution, setInstitution] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onRegister({ email, password, role, institution })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-text-primary font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10 input-dark focus-ring"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-text-primary font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="pl-10 pr-10 input-dark focus-ring"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-role" className="text-text-primary font-medium">
          Account Type
        </Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="input-dark focus-ring">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface-elevated border-border">
            <SelectItem value="user" className="text-text-primary hover:bg-surface-hover">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                User (Verify Only)
              </div>
            </SelectItem>
            <SelectItem value="admin" className="text-text-primary hover:bg-surface-hover">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Admin (Issue & Verify)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === "admin" && (
        <div className="space-y-2 animate-fade-in-up">
          <Label htmlFor="register-institution" className="text-text-primary font-medium">
            Institution
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              id="register-institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="University of Dar es Salaam"
              className="pl-10 input-dark focus-ring"
              required
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !email || !password || (role === "admin" && !institution)}
        className="w-full btn-primary font-semibold py-3 rounded-xl transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="spinner"></div>
            Creating Account...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Account
          </div>
        )}
      </Button>
    </form>
  )
}
