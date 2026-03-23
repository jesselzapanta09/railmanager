import React, { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { verifyEmail } from "../../services/api"
import { Button } from "antd"

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading")
  const [msg, setMsg] = useState("")
  const calledRef = useRef(false) // prevent double call in StrictMode

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setMsg("No verification token found in the link.")
      return
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success")
        setMsg(res.data.message)
      })
      .catch((err) => {
        setStatus("error")
        setMsg(err.response?.data?.message || "Verification failed.")
      })
  }, [])

  const config = {
    loading: {
      icon: <Loader2 className="animate-spin w-10 h-10 text-blue-600" />,
      bg: "bg-blue-100",
      title: "Verifying your email…",
      sub: "Please wait a moment.",
    },
    success: {
      icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      bg: "bg-green-100",
      title: "Email Verified!",
      sub: msg,
    },
    error: {
      icon: <XCircle className="w-10 h-10 text-red-600" />,
      bg: "bg-red-100",
      title: "Verification Failed",
      sub: msg,
    },
  }[status]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rail-950 via-rail-900 to-rail-700 p-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
        
        {/* Icon */}
        <div
          className={`w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 ${config.bg}`}
        >
          {config.icon}
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-display font-bold text-2xl text-rail-900 mb-2">{config.title}</h2>
        <p className="text-gray-500 mb-8">{config.sub}</p>

        {/* Action Buttons */}
        {status === "success" && (
          <Button
            type="primary"
            size="large"
            block
            className="bg-gradient-to-br from-rail-700 to-rail-500 hover:opacity-90 shadow-md"
            href="/login"
          >
            Sign In Now
          </Button>
        )}

        {status === "error" && (
          <div className="flex flex-col gap-3 items-center">
            <Button
              type="primary"
              size="large"
              className="w-full bg-gradient-to-br from-rail-700 to-rail-500 hover:opacity-90 shadow-md"
              href="/login"
            >
              Back to Login
            </Button>
            <p className="text-gray-400 text-sm">
              Need a new link? Log in and request a resend.
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link to="/" className="text-gray-400 text-sm hover:text-gray-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}