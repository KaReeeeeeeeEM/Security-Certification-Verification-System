"use client"

import { useState, useEffect } from "react"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { Header } from "@/components/layout/header"
import { AuthScreen } from "@/screens/auth-screen"
import { DashboardScreen } from "@/screens/dashboard-screen"

// Simulated API base URL
const API_BASE = "/api"

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

function CertificateApp() {
  const { showToast } = useToast()

  // Authentication state
  interface User {
    email: string
    role: string
  }

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState("")

  // UI states
  const [loading, setLoading] = useState(false)
  interface VerificationResult {
    verified: boolean
    error?: string
  }
  
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Load certificates when user logs in as admin
  useEffect(() => {
    if (user?.role === "admin") {
      loadCertificates()
    }
  }, [user])

  // Utility function to make API calls
  const apiCall = async (endpoint: string, method: string = "GET", data?: object | null) => {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(typeof data === "object" && data !== null ? { body: JSON.stringify(data) } : {}),
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Request failed")
    }

    return result
  }

  // Authentication functions
  const handleLogin = async (email: string, password: string) => {
    setLoading(true)

    try {
      const result = await apiCall("/auth/login", "POST", { email, password })

      setToken(result.token)
      setUser(result.user)
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))

      showToast("success", "Login Successful", `Welcome back, ${result.user.email}!`)
    } catch (error) {
      showToast("error", "Login Failed", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: {
    email: string
    password: string
    role: string
    institution?: string
  }) => {
    setLoading(true)

    try {
      const result = await apiCall("/auth/register", "POST", data)

      setToken(result.token)
      setUser(result.user)
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))

      showToast("success", "Registration Successful", `Account created for ${result.user.email}`)
    } catch (error) {
      showToast("error", "Registration Failed", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken("")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setVerificationResult(null)
    setCertificates([])
    showToast("info", "Logged Out", "You have been successfully logged out")
  }

  // Certificate functions
  const handleVerifyCertificate = async (certificateId: string) => {
    setLoading(true)
    setVerificationResult(null)

    try {
      const result = await apiCall(`/certificates/verify/${certificateId}`)
      setVerificationResult(result.certificate)
      showToast("success", "Certificate Verified", "Certificate is authentic and valid")
    } catch (error) {
      setVerificationResult({ verified: false, error: (error as Error).message })
      showToast("error", "Verification Failed", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleIssueCertificate = async (certificateData: any) => {
    setLoading(true)

    try {
      await apiCall("/certificates/issue", "POST", certificateData)
      showToast(
        "success",
        "Certificate Issued",
        `Certificate ${certificateData.certificateId} has been issued successfully`,
      )

      // Reload certificates list
      await loadCertificates()
    } catch (error) {
      showToast("error", "Issuance Failed", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeCertificate = async (certificateId: string, reason: string) => {
    setLoading(true)

    try {
      await apiCall(`/certificates/revoke/${certificateId}`, "PATCH", { reason })
      showToast("warning", "Certificate Revoked", `Certificate ${certificateId} has been revoked`)

      // Reload certificates list
      await loadCertificates()
    } catch (error) {
      showToast("error", "Revocation Failed", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const loadCertificates = async (): Promise<Certificate[]> => {
    try {
      const result = await apiCall("/certificates/list")
      setCertificates(result.certificates)
      return result.certificates
    } catch (error) {
      showToast("error", "Failed to Load Certificates", (error as Error).message)
      return []
    }
  }

  // If user is not logged in, show authentication screen
  if (!user) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
  }

  // Main application interface for logged-in users
  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <DashboardScreen
        user={user}
        onVerifyCertificate={handleVerifyCertificate}
        onIssueCertificate={handleIssueCertificate}
        onRevokeCertificate={handleRevokeCertificate}
        onLoadCertificates={loadCertificates}
        loading={loading}
        verificationResult={verificationResult}
        certificates={certificates}
      />
    </div>
  )
}

export default function SecureCertificateVerification() {
  return (
    <ToastProvider>
      <CertificateApp />
    </ToastProvider>
  )
}
