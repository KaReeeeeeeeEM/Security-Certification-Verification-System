"use client"

import { useState } from "react"
import {
  Users,
  Search,
  Download,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  GraduationCap,
  Building,
  Hash,
  MoreHorizontal,
  RefreshCw,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

interface ManagementTableProps {
  certificates: Certificate[]
  onRefresh: () => Promise<void>
  onRevoke: (certificateId: string, reason: string) => Promise<void>
  onViewDetails: (certificate: Certificate) => void
  loading: boolean
}

export function ManagementTable({ certificates, onRefresh, onRevoke, onViewDetails, loading }: ManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("issuedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; certificate: Certificate | null }>({
    open: false,
    certificate: null,
  })
  const [revokeReason, setRevokeReason] = useState("")

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter((cert) => {
      const matchesSearch =
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || cert.status === statusFilter
      const matchesGrade = gradeFilter === "all" || cert.grade === gradeFilter

      return matchesSearch && matchesStatus && matchesGrade
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Certificate]
      const bValue = b[sortBy as keyof Certificate]

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleRevoke = async () => {
    if (revokeDialog.certificate && revokeReason.trim()) {
      await onRevoke(revokeDialog.certificate.certificateId, revokeReason)
      setRevokeDialog({ open: false, certificate: null })
      setRevokeReason("")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "revoked":
        return <XCircle className="h-3 w-3" />
      case "expired":
        return <Ban className="h-3 w-3" />
      default:
        return null
    }
  }

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

  const exportToCsv = () => {
    const headers = ["Certificate ID", "Student Name", "Course", "Institution", "Grade", "Status", "Issued Date"]
    const csvContent = [
      headers.join(","),
      ...filteredCertificates.map((cert) =>
        [
          cert.certificateId,
          `"${cert.studentName}"`,
          `"${cert.course}"`,
          `"${cert.institution}"`,
          cert.grade,
          cert.status,
          new Date(cert.issuedAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `certificates-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Card className="bg-gradient-card border-border shadow-glow-primary animate-fade-in-up">
        <CardHeader className="bg-gradient-to-r from-primary-900/20 to-primary-800/20 rounded-t-lg border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center text-primary-400">
                <Users className="h-5 w-5 mr-2" />
                Certificate Management
              </CardTitle>
              <CardDescription className="text-text-secondary">
                View, search, and manage all issued certificates
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10 sm:hidden"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={exportToCsv}
                variant="outline"
                size="sm"
                className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10"
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Mobile Search */}
          <div className="sm:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-dark focus-ring"
              />
            </div>
          </div>

          {/* Filters - Desktop always visible, Mobile collapsible */}
          <div className={`${showFilters ? "block" : "hidden"} sm:block mb-6`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 hidden sm:block">
                <Label className="text-text-primary font-medium">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-dark focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-text-primary font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="input-dark focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-elevated border-border">
                    <SelectItem value="all" className="text-text-primary hover:bg-surface-hover">
                      All Status
                    </SelectItem>
                    <SelectItem value="active" className="text-text-primary hover:bg-surface-hover">
                      Active
                    </SelectItem>
                    <SelectItem value="revoked" className="text-text-primary hover:bg-surface-hover">
                      Revoked
                    </SelectItem>
                    <SelectItem value="expired" className="text-text-primary hover:bg-surface-hover">
                      Expired
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-text-primary font-medium">Grade</Label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="input-dark focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-elevated border-border">
                    <SelectItem value="all" className="text-text-primary hover:bg-surface-hover">
                      All Grades
                    </SelectItem>
                    <SelectItem value="First Class" className="text-text-primary hover:bg-surface-hover">
                      First Class
                    </SelectItem>
                    <SelectItem value="Second Class Upper" className="text-text-primary hover:bg-surface-hover">
                      Second Class Upper
                    </SelectItem>
                    <SelectItem value="Second Class Lower" className="text-text-primary hover:bg-surface-hover">
                      Second Class Lower
                    </SelectItem>
                    <SelectItem value="Pass" className="text-text-primary hover:bg-surface-hover">
                      Pass
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-text-primary font-medium">Sort By</Label>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-")
                    setSortBy(field)
                    setSortOrder(order as "asc" | "desc")
                  }}
                >
                  <SelectTrigger className="input-dark focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-elevated border-border">
                    <SelectItem value="issuedAt-desc" className="text-text-primary hover:bg-surface-hover">
                      Newest First
                    </SelectItem>
                    <SelectItem value="issuedAt-asc" className="text-text-primary hover:bg-surface-hover">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="studentName-asc" className="text-text-primary hover:bg-surface-hover">
                      Student Name A-Z
                    </SelectItem>
                    <SelectItem value="studentName-desc" className="text-text-primary hover:bg-surface-hover">
                      Student Name Z-A
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Statistics - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="glass-dark rounded-lg p-3 sm:p-4 border border-border">
              <div className="flex items-center gap-2">
                <div className="bg-primary-500/20 rounded-full p-1.5 sm:p-2">
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-text-muted text-xs sm:text-sm">Total</p>
                  <p className="text-text-primary font-semibold text-sm sm:text-base">{certificates.length}</p>
                </div>
              </div>
            </div>
            <div className="glass-dark rounded-lg p-3 sm:p-4 border border-border">
              <div className="flex items-center gap-2">
                <div className="bg-success/20 rounded-full p-1.5 sm:p-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                </div>
                <div>
                  <p className="text-text-muted text-xs sm:text-sm">Active</p>
                  <p className="text-text-primary font-semibold text-sm sm:text-base">
                    {certificates.filter((c) => c.status === "active").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-dark rounded-lg p-3 sm:p-4 border border-border">
              <div className="flex items-center gap-2">
                <div className="bg-error/20 rounded-full p-1.5 sm:p-2">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-error" />
                </div>
                <div>
                  <p className="text-text-muted text-xs sm:text-sm">Revoked</p>
                  <p className="text-text-primary font-semibold text-sm sm:text-base">
                    {certificates.filter((c) => c.status === "revoked").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-dark rounded-lg p-3 sm:p-4 border border-border">
              <div className="flex items-center gap-2">
                <div className="bg-warning/20 rounded-full p-1.5 sm:p-2">
                  <Ban className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                </div>
                <div>
                  <p className="text-text-muted text-xs sm:text-sm">Expired</p>
                  <p className="text-text-primary font-semibold text-sm sm:text-base">
                    {certificates.filter((c) => c.status === "expired").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates List - Mobile-optimized Cards */}
          {filteredCertificates.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredCertificates.map((certificate) => (
                <div
                  key={certificate.certificateId}
                  className="glass-dark rounded-xl p-4 sm:p-6 border border-border hover:border-primary-500/30 transition-all duration-200 animate-fade-in-up"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Certificate Info - Mobile Stacked Layout */}
                    <div className="flex-1 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs sm:text-sm font-medium text-text-muted flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          Certificate ID
                        </Label>
                        <p className="font-mono text-xs sm:text-sm font-semibold text-text-primary break-all">
                          {certificate.certificateId}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs sm:text-sm font-medium text-text-muted flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Student
                        </Label>
                        <p className="font-semibold text-text-primary text-sm sm:text-base">
                          {certificate.studentName}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted line-clamp-2">{certificate.course}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs sm:text-sm font-medium text-text-muted flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          Institution
                        </Label>
                        <p className="text-xs sm:text-sm text-text-primary">{certificate.institution}</p>
                        <Badge className="bg-gradient-primary text-white font-semibold text-xs">
                          {certificate.grade}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs sm:text-sm font-medium text-text-muted flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Dates
                        </Label>
                        <p className="text-xs sm:text-sm text-text-primary">
                          Graduated: {new Date(certificate.graduationDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted">
                          Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions - Mobile Full Width */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:ml-4">
                      <Badge className={`${getStatusColor(certificate.status)} flex items-center gap-1 text-xs`}>
                        {getStatusIcon(certificate.status)}
                        {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-surface-hover text-text-primary h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-surface-elevated border-border" align="end">
                          <DropdownMenuItem
                            onClick={() => onViewDetails(certificate)}
                            className="text-text-primary hover:bg-surface-hover focus:bg-surface-hover"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {certificate.status === "active" && (
                            <>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem
                                onClick={() => setRevokeDialog({ open: true, certificate })}
                                className="text-error hover:bg-error/10 focus:bg-error/10"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Revoke Certificate
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                {searchTerm || statusFilter !== "all" || gradeFilter !== "all"
                  ? "No certificates match your filters"
                  : "No certificates issued yet"}
              </h3>
              <p className="text-text-muted text-sm sm:text-base">
                {searchTerm || statusFilter !== "all" || gradeFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "Start by issuing your first certificate"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revoke Certificate Dialog */}
      <AlertDialog open={revokeDialog.open} onOpenChange={(open) => setRevokeDialog({ open, certificate: null })}>
        <AlertDialogContent className="bg-surface-elevated border-border mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">Revoke Certificate</AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              Are you sure you want to revoke certificate {revokeDialog.certificate?.certificateId}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label className="text-text-primary font-medium">Reason for Revocation</Label>
            <Input
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="Enter reason for revocation..."
              className="input-dark focus-ring"
            />
          </div>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-border text-text-primary hover:bg-surface-hover w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={!revokeReason.trim()}
              className="bg-error hover:bg-error/90 text-white w-full sm:w-auto"
            >
              Revoke Certificate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
