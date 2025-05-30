"use client"

import { Shield, LogOut, User, Building, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  user: {
    email: string
    role: string
    institution?: string
  }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 animate-slide-in-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="bg-gradient-primary rounded-lg p-2 mr-3 animate-pulse-glow">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-text-primary">Certificate Verification</h1>
              <p className="text-xs sm:text-sm text-text-secondary">Protecting Academic Integrity</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-text-primary">CertVerify</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className={`${
                user.role === "admin"
                  ? "bg-gradient-primary text-white border-primary-500"
                  : "bg-surface-elevated text-text-secondary border-border"
              } px-3 py-1 font-medium`}
            >
              {user.role === "admin" ? (
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Administrator
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  User
                </div>
              )}
            </Badge>

            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{user.email}</p>
              {user.institution && <p className="text-xs text-text-muted">{user.institution}</p>}
            </div>

            <Button
              variant="outline"
              onClick={onLogout}
              className="border-border hover:bg-surface-hover text-text-primary hover:text-text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-border hover:bg-surface-hover text-text-primary"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-sm animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-3">
              {/* User Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">{user.email}</p>
                  {user.institution && <p className="text-xs text-text-muted">{user.institution}</p>}
                </div>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={`${
                    user.role === "admin"
                      ? "bg-gradient-primary text-white border-primary-500"
                      : "bg-surface-elevated text-text-secondary border-border"
                  } px-2 py-1 text-xs font-medium`}
                >
                  {user.role === "admin" ? (
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Admin
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      User
                    </div>
                  )}
                </Badge>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                onClick={() => {
                  onLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full border-border hover:bg-surface-hover text-text-primary hover:text-text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
