"use client"

import { Shield, CheckCircle, Calendar, User, GraduationCap, Building, Award, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface CertificateDetailsModalProps {
  certificate: Certificate | null
  open: boolean
  onClose: () => void
}

export function CertificateDetailsModal({ certificate, open, onClose }: CertificateDetailsModalProps) {
  if (!certificate) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30"
      case "revoked":
        return "bg-error/20 text-error border-error/30"
      case "expired":
        return "bg-warning/20 text-warning border-warning/30"
      default:
        return "bg-text-muted/20 text-text-muted border-text-muted/30"
    }
  }

  const printCertificate = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${certificate.certificateId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .certificate { border: 3px solid #a855f7; padding: 40px; text-align: center; }
            .header { color: #a855f7; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .title { font-size: 32px; font-weight: bold; margin: 20px 0; }
            .student { font-size: 24px; margin: 20px 0; }
            .details { margin: 10px 0; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">CERTIFICATE OF COMPLETION</div>
            <div class="title">${certificate.course}</div>
            <div class="details">This is to certify that</div>
            <div class="student">${certificate.studentName}</div>
            <div class="details">has successfully completed the requirements for</div>
            <div class="details">Grade: ${certificate.grade}</div>
            <div class="details">Institution: ${certificate.institution}</div>
            <div class="details">Graduation Date: ${new Date(certificate.graduationDate).toLocaleDateString()}</div>
            <div class="footer">
              Certificate ID: ${certificate.certificateId}<br>
              Issued: ${new Date(certificate.issuedAt).toLocaleDateString()}<br>
              Status: ${certificate.status.toUpperCase()}
            </div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface-elevated border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-400" />
            Certificate Details
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Complete information for certificate {certificate.certificateId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <div className="glass-dark rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-success" />
                <div>
                  <h3 className="font-semibold text-text-primary">Certificate Status</h3>
                  <p className="text-sm text-text-muted">This certificate has been verified and encrypted</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(certificate.status)} flex items-center gap-1`}>
                {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Certificate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Certificate ID
                </Label>
                <p className="font-mono text-lg font-semibold text-text-primary bg-surface rounded-lg p-3">
                  {certificate.certificateId}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Student Name
                </Label>
                <p className="text-lg font-semibold text-text-primary">{certificate.studentName}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Institution
                </Label>
                <p className="text-text-primary">{certificate.institution}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Course
                </Label>
                <p className="text-text-primary">{certificate.course}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Grade Achieved
                </Label>
                <Badge className="bg-gradient-primary text-white font-semibold">{certificate.grade}</Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Important Dates
                </Label>
                <div className="space-y-1">
                  <p className="text-sm text-text-primary">
                    Graduated: {new Date(certificate.graduationDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-text-muted">
                    Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="glass-dark rounded-lg p-4 border border-primary-500/20">
            <div className="flex items-start gap-3">
              <div className="bg-primary-500/20 rounded-full p-2">
                <Shield className="h-4 w-4 text-primary-400" />
              </div>
              <div>
                <h4 className="text-primary-400 font-medium mb-1">Security Features</h4>
                <ul className="text-text-muted text-sm space-y-1">
                  <li>• AES-256 encrypted certificate data</li>
                  <li>• SHA-256 integrity verification</li>
                  <li>• Tamper-proof digital signature</li>
                  <li>• Blockchain-alternative security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={printCertificate} className="btn-primary flex-1">
              <GraduationCap className="h-4 w-4 mr-2" />
              Print Certificate
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-border text-text-primary hover:bg-surface-hover"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
