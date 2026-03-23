import React, { useState, useEffect } from "react"
import { Form, Input, App, Alert } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Loader2, MapPin, Activity, Train } from "lucide-react" // icons for stats
import { login, resendVerification } from "../../services/api"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return isDesktop
}

export default function Login() {
  const { message } = App.useApp()
  const isDesktop = useIsDesktop()
  const [loading, setLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState("")
  const [resending, setResending] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setLoading(true)
    setUnverified(false)
    try {
      const res = await login(values)
      const { token, user } = res.data.data
      loginUser(user, token)
      message.success(`Welcome back, ${user.username}!`)
      navigate("/dashboard")
    } catch (err) {
      const data = err.response?.data
      if (data?.code === "EMAIL_NOT_VERIFIED") {
        setUnverified(true)
        setUnverifiedEmail(values.email)
      } else {
        message.error(data?.message || "Invalid email or password.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerification(unverifiedEmail)
      message.success("Verification email resent! Check your inbox.")
      setUnverified(false)
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to resend.")
    } finally {
      setResending(false)
    }
  }

  const stats = [
    { label: "Routes", value: "50+", icon: <MapPin className="w-5 h-5 text-sky-300" /> },
    { label: "Uptime", value: "99.9%", icon: <Activity className="w-5 h-5 text-sky-300" /> },
    { label: "Trains", value: "120+", icon: <Train className="w-5 h-5 text-sky-300" /> },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left panel */}
      {isDesktop && (
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-20 relative overflow-hidden bg-gradient-to-br from-rail-950 via-rail-900 to-rail-700">
          {/* Decorative shapes */}
          <span className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/5 animate-pulse-slow" />
          <span className="absolute bottom-20 right-16 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 bg-white/10 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-sky-300">SYSTEM ONLINE</span>
            </div>
            <h2 className="font-display text-white text-4xl font-bold mb-3">
              Welcome <br />
              <span className="text-sky-300">back.</span>
            </h2>
            <p className="text-blue-200 max-w-xs leading-relaxed opacity-80 mb-8">
              Sign in to access your train fleet dashboard.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-1 hover:scale-105 transition-transform"
              >
                {stat.icon}
                <span className="font-display font-bold text-white text-xl">{stat.value}</span>
                <span className="text-xs text-sky-300">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl text-rail-900 mb-1">Sign in</h2>
            <p className="text-gray-500 text-sm">Enter your credentials to continue.</p>
          </div>

          {unverified && (
            <Alert
              type="warning"
              showIcon
              message="Email not verified"
              description={
                <span>
                  Please verify your email first.{" "}
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-orange-600 font-semibold underline disabled:opacity-50"
                  >
                    {resending ? "Sending…" : "Resend verification email"}
                  </button>
                </span>
              }
              className="mb-5 rounded-lg"
            />
          )}

          <div className="bg-white border border-blue-50 shadow-sm rounded-2xl p-8">
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
              <Form.Item
                name="email"
                label={<span className="font-medium text-gray-700">Email address</span>}
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="you@example.com" className="rounded-lg border-gray-300" />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="font-medium text-gray-700">Password</span>}
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password placeholder="••••••••" className="rounded-lg border-gray-300" />
              </Form.Item>

              <div className="text-right -mt-2 mb-4">
                <Link to="/forgot-password" className="text-blue-600 text-xs font-medium">
                  Forgot password?
                </Link>
              </div>

              <Form.Item className="mb-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-br from-rail-700 to-rail-500 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin w-5 h-5" />}
                  {loading ? "Signing in…" : "Sign in to Dashboard"}
                </button>
              </Form.Item>
            </Form>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}