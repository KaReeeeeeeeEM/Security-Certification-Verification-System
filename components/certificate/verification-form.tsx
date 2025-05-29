"use client"

import type React from "react"

import { useState } from "react"
import { Search, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VerificationFormProps {
  onVerify: (certificateId: string) => Promise<void>
  loading: boolean
}

export function VerificationForm({ onVerify, loading }: VerificationFormProps) {
  const [certificateId, setCertificateId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onVerify(certificateId)
  }

  return (
    <Card className="bg-gradient-card border-border shadow-glow-primary animate-fade-in-up">
      <CardHeader className="bg-gradient-to-r from-primary-900/20 to-primary-800/20 rounded-t-lg border-b border-border">
        <CardTitle className="flex items-center text-primary-400">
          <Search className="h-5 w-5 mr-2" />
          Verify Certificate
        </CardTitle>
        <CardDescription className="text-text-secondary">
          Enter a certificate ID to verify its authenticity and view details
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-id" className="text-text-primary font-medium">
              Certificate ID
            </Label>
            <Input
              id="verification-id"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
              placeholder="UDSM-2024-123456"
              className="font-mono text-lg input-dark focus-ring"
              required
            />
            <p className="text-sm text-text-muted flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Format: INSTITUTION-YEAR-NUMBER (e.g., UDSM-2024-123456)
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !certificateId}
            className="w-full btn-primary font-semibold py-3 rounded-xl"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="spinner"></div>
                Verifying...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verify Certificate
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
