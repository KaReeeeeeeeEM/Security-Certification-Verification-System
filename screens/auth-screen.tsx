// client/src/components/AuthScreen.js - Improved Styling and Reduced Content

"use client"
import { Shield, Lock, Globe } from "lucide-react" // Removed CheckCircle as it's not used in the simplified version
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
    // Main container with a subtle gradient background and overflow hidden for decorative elements
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Background decorative elements - subtle dots for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23a855f7&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>

      {/* Content wrapper to center and apply padding */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Hero Section - Simplified and more concise */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* Glowing effect for the icon */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse-glow"></div>
                {/* Glassmorphism effect for the icon container */}
                <div className="relative bg-white/10 backdrop-filter backdrop-blur-lg rounded-full p-3 border border-purple-500/30 shadow-lg">
                  <Shield className="h-10 w-10 text-purple-400" /> {/* Slightly smaller icon */}
                </div>
              </div>
            </div>
            {/* Main title with gradient text */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              Secure Certificate
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 animate-gradient">
                Verification
              </span>
            </h1>
            {/* Subtitle - more direct */}
            <p className="text-gray-300 text-base mb-4">Combatting certificate fraud in Tanzania.</p>
            {/* Key features - simplified to just two prominent ones */}
            <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                <span>AES-256 Encrypted</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Digital Integrity</span> {/* Changed from 'Blockchain Alternative' for broader appeal */}
              </div>
            </div>
          </div>

          {/* Authentication Card - Enhanced glassmorphism and shadow */}
          <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-xl animate-slide-in-top">
            <Tabs defaultValue="login" className="w-full">
              {/* Tabs List - improved styling for active/inactive states */}
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/20 rounded-lg overflow-hidden">
                <TabsTrigger
                  value="login"
                  className="py-2 px-4 text-white font-semibold transition-all duration-300
                             data-[state=active]:bg-purple-600 data-[state=active]:text-white
                             data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-300
                             hover:bg-purple-700/20 rounded-md"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="py-2 px-4 text-white font-semibold transition-all duration-300
                             data-[state=active]:bg-purple-600 data-[state=active]:text-white
                             data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-300
                             hover:bg-purple-700/20 rounded-md"
                >
                  Register
                </TabsTrigger>Ï
              </TabsList>

              {/* Login Form Tab Content */}
              <TabsContent value="login" className="mt-6">
                <LoginForm onLogin={onLogin} loading={loading} />
              </TabsContent>

              {/* Register Form Tab Content */}
              <TabsContent value="register" className="mt-6">
                <RegisterForm onRegister={onRegister} loading={loading} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
