"use client"

import { CheckCircle, XCircle, User, GraduationCap, Building, Award, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface VerificationResultProps {
  result: {
    verified: boolean
    certificateId?: string
    studentName?: string
    course?: string
    institution?: string
    graduationDate?: string
    grade?: string
    issuedAt?: string
    error?: string
  }
}

export function VerificationResult({ result }: VerificationResultProps) {
  return (
    <Card
      className={`animate-slide-in-right ${
        result.verified ? "certificate-verified bg-gradient-card" : "certificate-error bg-gradient-card"
      }`}
    >
      <CardHeader
        className={`${
          result.verified
            ? "bg-gradient-to-r from-success/20 to-success/10"
            : "bg-gradient-to-r from-error/20 to-error/10"
        } rounded-t-lg border-b border-border`}
      >
        <CardTitle className={`flex items-center ${result.verified ? "text-success" : "text-error"}`}>
          {result.verified ? (
            <CheckCircle className="h-5 w-5 mr-2 animate-pulse-glow" />
          ) : (
            <XCircle className="h-5 w-5 mr-2" />
          )}
          Verification Result
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {result.verified ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Student Name
                </Label>
                <p className="font-semibold text-text-primary text-lg">{result.studentName}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Course
                </Label>
                <p className="font-semibold text-text-primary">{result.course}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Institution
                </Label>
                <p className="font-semibold text-text-primary">{result.institution}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Grade
                </Label>
                <Badge className="bg-gradient-primary text-white font-semibold">{result.grade}</Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Graduation Date
                </Label>
                <p className="text-text-primary">
                  {result.graduationDate && new Date(result.graduationDate).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Issued Date
                </Label>
                <p className="text-text-primary">{result.issuedAt && new Date(result.issuedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Security Status</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Verified & Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-error mx-auto mb-4" />
            <h3 className="font-bold text-error text-lg mb-2">Certificate Not Found</h3>
            <p className="text-sm text-text-muted">
              {result.error || "This certificate ID does not exist or has been revoked"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
