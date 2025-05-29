"use client"

import { Shield, CheckCircle, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SecurityFeatures() {
  return (
    <Card className="mt-8 bg-gradient-card border-border shadow-glow-primary animate-fade-in-up">
      <CardHeader className="bg-gradient-to-r from-primary-900/20 to-primary-800/20 rounded-t-lg border-b border-border">
        <CardTitle className="flex items-center text-primary-400">
          <Shield className="h-5 w-5 mr-2" />
          Security Features
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center glass-dark rounded-xl p-6 border border-primary-500/20">
            <div className="bg-gradient-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse-glow">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-primary-400 mb-2">AES-256 Encryption</h3>
            <p className="text-sm text-text-muted">
              Certificate data is encrypted using military-grade AES-256 encryption
            </p>
          </div>
          <div className="text-center glass-dark rounded-xl p-6 border border-success/20">
            <div className="bg-gradient-to-br from-success to-success/80 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-success mb-2">SHA-256 Integrity</h3>
            <p className="text-sm text-text-muted">Data integrity verified using SHA-256 cryptographic hashing</p>
          </div>
          <div className="text-center glass-dark rounded-xl p-6 border border-warning/20">
            <div className="bg-gradient-to-br from-warning to-warning/80 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-warning mb-2">JWT Authentication</h3>
            <p className="text-sm text-text-muted">Secure session management with JSON Web Tokens</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
