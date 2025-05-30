"use client"
import { Shield, Lock, Globe, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (data: {
    email: string
    password: string
    role: string
    institution?: string
  }) => Promise<void>
  loading: boolean
}

export function AuthScreen({ onLogin, onRegister, loading }: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23a855f7&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse-glow"></div>
                <div className="relative glass-dark rounded-full p-3 sm:p-4 border border-primary-500/30">
                  <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary-400" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-2 sm:mb-3 leading-tight">
              Secure Certificate
              <br />
              <span className="text-primary-400 animate-gradient bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Verification
              </span>
            </h1>
            <p className="text-text-secondary text-base sm:text-lg mb-3 sm:mb-4 px-2">
              Combating certificate fraud in Tanzanian universities
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-text-muted text-sm">
              <div className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                <span>AES-256 Encrypted</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Blockchain Alternative</span>
              </div>
            </div>
          </div>

          {/* Authentication Card */}
          <div className="glass-dark rounded-2xl p-4 sm:p-6 border border-primary-500/20 shadow-glow-primary animate-slide-in-top">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-surface-elevated/50 border border-border h-10 sm:h-11">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-text-secondary text-sm sm:text-base"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-text-secondary text-sm sm:text-base"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4 sm:mt-6">
                <LoginForm onLogin={onLogin} loading={loading} />
              </TabsContent>

              <TabsContent value="register" className="mt-4 sm:mt-6">
                <RegisterForm onRegister={onRegister} loading={loading} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Features Preview */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up">
            <div className="text-center">
              <div className="glass-dark rounded-xl p-2 sm:p-3 mb-2 border border-primary-500/20">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400 mx-auto" />
              </div>
              <p className="text-text-secondary text-xs font-medium">AES-256</p>
            </div>
            <div className="text-center">
              <div className="glass-dark rounded-xl p-2 sm:p-3 mb-2 border border-primary-500/20">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400 mx-auto" />
              </div>
              <p className="text-text-secondary text-xs font-medium">SHA-256</p>
            </div>
            <div className="text-center">
              <div className="glass-dark rounded-xl p-2 sm:p-3 mb-2 border border-primary-500/20">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400 mx-auto" />
              </div>
              <p className="text-text-secondary text-xs font-medium">JWT Auth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
