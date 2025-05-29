"use client"
import { Search, Plus, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationForm } from "@/components/certificate/verification-form"
import { VerificationResult } from "@/components/certificate/verification-result"
import { SecurityFeatures } from "@/components/certificate/security-features"

interface DashboardScreenProps {
  user: {
    email: string
    role: string
    institution?: string
  }
  onVerifyCertificate: (certificateId: string) => Promise<any>
  loading: boolean
  verificationResult: any
}

export function DashboardScreen({ user, onVerifyCertificate, loading, verificationResult }: DashboardScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-surface/50 backdrop-blur-sm border border-border">
            <TabsTrigger
              value="verify"
              className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-sm text-text-primary"
            >
              <Search className="h-4 w-4 mr-2" />
              Verify Certificate
            </TabsTrigger>
            {user.role === "admin" && (
              <TabsTrigger
                value="issue"
                className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-sm text-text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Issue Certificate
              </TabsTrigger>
            )}
            {user.role === "admin" && (
              <TabsTrigger
                value="manage"
                className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-sm text-text-primary"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Certificates
              </TabsTrigger>
            )}
          </TabsList>

          {/* Certificate Verification Tab */}
          <TabsContent value="verify" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VerificationForm onVerify={onVerifyCertificate} loading={loading} />
              {verificationResult && <VerificationResult result={verificationResult} />}
            </div>
          </TabsContent>

          {/* Certificate Issuance Tab (Admin Only) */}
          {user.role === "admin" && (
            <TabsContent value="issue" className="mt-6">
              <div className="text-center py-12">
                <Plus className="h-16 w-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Issue Certificate</h3>
                <p className="text-text-muted">Certificate issuance form will be implemented here</p>
              </div>
            </TabsContent>
          )}

          {/* Certificate Management Tab (Admin Only) */}
          {user.role === "admin" && (
            <TabsContent value="manage" className="mt-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Manage Certificates</h3>
                <p className="text-text-muted">Certificate management interface will be implemented here</p>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Security Information */}
        <SecurityFeatures />
      </div>
    </div>
  )
}
