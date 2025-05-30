"use client"

import { useState } from "react"
import { Search, Plus, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationForm } from "@/components/certificate/verification-form"
import { VerificationResult } from "@/components/certificate/verification-result"
import { SecurityFeatures } from "@/components/certificate/security-features"
import { IssueForm } from "@/components/certificate/issue-form"
import { ManagementTable } from "@/components/certificate/management-table"
import { CertificateDetailsModal } from "@/components/certificate/certificate-details-modal"

interface Certificate {
  certificateId: string
  studentName: string
  course: string
  institution: string
  graduationDate: string
  grade: string
  status: "active" | "revoked" | "expired"
  issuedAt: string
  issuedBy: string
}

interface DashboardScreenProps {
  user: {
    email: string
    role: string
    institution?: string
  }
  onVerifyCertificate: (certificateId: string) => Promise<any>
  onIssueCertificate: (certificateData: any) => Promise<void>
  onRevokeCertificate: (certificateId: string, reason: string) => Promise<void>
  onLoadCertificates: () => Promise<void>
  loading: boolean
  verificationResult: any
  certificates: Certificate[]
}

export function DashboardScreen({
  user,
  onVerifyCertificate,
  onIssueCertificate,
  onRevokeCertificate,
  onLoadCertificates,
  loading,
  verificationResult,
  certificates,
}: DashboardScreenProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedCertificate(null)
    setDetailsModalOpen(false)
  }

  const tabsConfig = [
    { value: "verify", label: "Verify", icon: Search, available: true },
    { value: "issue", label: "Issue", icon: Plus, available: user.role === "admin" },
    { value: "manage", label: "Manage", icon: Users, available: user.role === "admin" },
  ].filter((tab) => tab.available)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs defaultValue="verify" className="w-full">
          {/* Mobile-friendly tabs */}
          <TabsList
            className="grid w-full bg-surface/50 backdrop-blur-sm border border-border overflow-x-auto"
            style={{ gridTemplateColumns: `repeat(${tabsConfig.length}, minmax(0, 1fr))` }}
          >
            {tabsConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-sm text-text-primary flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap pb-2"
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.label.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Certificate Verification Tab */}
          <TabsContent value="verify" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <VerificationForm onVerify={onVerifyCertificate} loading={loading} />
              {verificationResult && <VerificationResult result={verificationResult} />}
            </div>
          </TabsContent>

          {/* Certificate Issuance Tab (Admin Only) */}
          {user.role === "admin" && (
            <TabsContent value="issue" className="mt-4 sm:mt-6">
              <IssueForm onIssue={onIssueCertificate} loading={loading} user={user} />
            </TabsContent>
          )}

          {/* Certificate Management Tab (Admin Only) */}
          {user.role === "admin" && (
            <TabsContent value="manage" className="mt-4 sm:mt-6">
              <ManagementTable
                certificates={certificates}
                onRefresh={async () => {
                  await onLoadCertificates();
                }}
                onRevoke={onRevokeCertificate}
                onViewDetails={handleViewDetails}
                loading={loading}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Security Information */}
        <SecurityFeatures />
      </div>

      {/* Certificate Details Modal */}
      <CertificateDetailsModal certificate={selectedCertificate} open={detailsModalOpen} onClose={handleCloseDetails} />
    </div>
  )
}
