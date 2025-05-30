"use client"

import type React from "react"

import { useState } from "react"
import { GraduationCap, Award, Building, Calendar, User, Hash, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea" 

interface IssueFormProps {
  onIssue: (certificateData: {
    certificateId: string
    studentName: string
    course: string
    institution: string
    graduationDate: string
    grade: string
    additionalNotes?: string
  }) => Promise<void>
  loading: boolean
  user: {
    institution?: string
  }
}

export function IssueForm({ onIssue, loading, user }: IssueFormProps) {
  const [formData, setFormData] = useState({
    certificateId: "",
    studentName: "",
    course: "",
    institution: user.institution || "",
    graduationDate: "",
    grade: "",
    additionalNotes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.certificateId) {
      newErrors.certificateId = "Certificate ID is required"
    } else if (!/^[A-Z]+-\d{4}-\d{6}$/.test(formData.certificateId)) {
      newErrors.certificateId = "Invalid format. Use: UNIV-YYYY-NNNNNN"
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required"
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = "Student name must be at least 2 characters"
    }

    if (!formData.course.trim()) {
      newErrors.course = "Course is required"
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "Institution is required"
    }

    if (!formData.graduationDate) {
      newErrors.graduationDate = "Graduation date is required"
    } else {
      const gradDate = new Date(formData.graduationDate)
      const today = new Date()
      if (gradDate > today) {
        newErrors.graduationDate = "Graduation date cannot be in the future"
      }
    }

    if (!formData.grade) {
      newErrors.grade = "Grade is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateCertificateId = () => {
    const year = new Date().getFullYear()
    const sequence = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0")
    const institutionCode = user.institution?.substring(0, 4).toUpperCase() || "UNIV"
    const newId = `${institutionCode}-${year}-${sequence}`
    setFormData({ ...formData, certificateId: newId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      await onIssue(formData)
      console.log(formData)
      // Reset form on success
      setFormData({
        certificateId: "",
        studentName: "",
        course: "",
        institution: user.institution || "",
        graduationDate: "",
        grade: "",
        additionalNotes: "",
      })
      setErrors({})
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const grades = [
    "First Class",
    "Second Class Upper",
    "Second Class Lower",
    "Pass",
    "Distinction",
    "Merit",
    "Credit",
    "Satisfactory",
  ]

  return (
    <Card className="bg-gradient-card border-border shadow-glow-primary animate-fade-in-up">
      <CardHeader className="bg-gradient-to-r from-primary-900/20 to-primary-800/20 rounded-t-lg border-b border-border">
        <CardTitle className="flex items-center text-primary-400">
          <GraduationCap className="h-5 w-5 mr-2" />
          Issue New Certificate
        </CardTitle>
        <CardDescription className="text-text-secondary">
          Create a new encrypted certificate for a graduate. All data will be securely encrypted using AES-256.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate ID */}
          <div className="space-y-2">
            <Label htmlFor="cert-id" className="text-text-primary font-medium flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Certificate ID
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="cert-id"
                  value={formData.certificateId}
                  onChange={(e) => handleInputChange("certificateId", e.target.value.toUpperCase())}
                  placeholder="UDSM-2024-123456"
                  className={`font-mono input-dark focus-ring ${errors.certificateId ? "border-error" : ""}`}
                />
                {errors.certificateId && <p className="text-error text-sm mt-1">{errors.certificateId}</p>}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateCertificateId}
                className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="student-name" className="text-text-primary font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                Student Name
              </Label>
              <Input
                id="student-name"
                value={formData.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="Salum Bakari Mwalimu"
                className={`input-dark focus-ring ${errors.studentName ? "border-error" : ""}`}
              />
              {errors.studentName && <p className="text-error text-sm mt-1">{errors.studentName}</p>}
            </div>

            {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="course" className="text-text-primary font-medium flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Course
              </Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder="Bachelor of Science in Computer Science"
                className={`input-dark focus-ring ${errors.course ? "border-error" : ""}`}
              />
              {errors.course && <p className="text-error text-sm mt-1">{errors.course}</p>}
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-text-primary font-medium flex items-center gap-1">
                <Building className="h-3 w-3" />
                Institution
              </Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="University of Dar es Salaam"
                className={`input-dark focus-ring ${errors.institution ? "border-error" : ""}`}
              />
              {errors.institution && <p className="text-error text-sm mt-1">{errors.institution}</p>}
            </div>

            {/* Graduation Date */}
            <div className="space-y-2">
              <Label htmlFor="graduation-date" className="text-text-primary font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Graduation Date
              </Label>
              <Input
                id="graduation-date"
                type="date"
                value={formData.graduationDate}
                onChange={(e) => handleInputChange("graduationDate", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={`input-dark focus-ring ${errors.graduationDate ? "border-error" : ""}`}
              />
              {errors.graduationDate && <p className="text-error text-sm mt-1">{errors.graduationDate}</p>}
            </div>

            {/* Grade */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="grade" className="text-text-primary font-medium flex items-center gap-1">
                <Award className="h-3 w-3" />
                Grade
              </Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                <SelectTrigger className={`input-dark focus-ring ${errors.grade ? "border-error" : ""}`}>
                  <SelectValue placeholder="Select grade achieved" />
                </SelectTrigger>
                <SelectContent className="bg-surface-elevated border-border">
                  {grades.map((grade) => (
                    <SelectItem
                      key={grade}
                      value={grade}
                      className="text-text-primary hover:bg-surface-hover focus:bg-surface-hover"
                    >
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.grade && <p className="text-error text-sm mt-1">{errors.grade}</p>}
            </div>

            {/* Additional Notes */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="text-text-primary font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.additionalNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("additionalNotes", e.target.value)}
                placeholder="Any additional information about the certificate..."
                className="input-dark focus-ring resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="glass-dark rounded-lg p-4 border border-primary-500/20">
            <div className="flex items-start gap-3">
              <div className="bg-primary-500/20 rounded-full p-2">
                <GraduationCap className="h-4 w-4 text-primary-400" />
              </div>
              <div>
                <h4 className="text-primary-400 font-medium mb-1">Security Notice</h4>
                <p className="text-text-muted text-sm">
                  This certificate will be encrypted using AES-256 encryption and signed with SHA-256 hashing for
                  maximum security. Once issued, the certificate data cannot be modified.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="spinner"></div>
                Issuing Certificate...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Issue Certificate
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
