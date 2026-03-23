import React, { useState, useEffect } from "react"
import { Form, Input, Button, App } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { CheckCircle, Loader2 } from "lucide-react"
import { register } from "../../services/api"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return isDesktop
}

export default function Register() {
  const { message } = App.useApp()
  const isDesktop = useIsDesktop()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const features = [
    "Manage unlimited train records",
    "Full CRUD — create, update, delete",
    "Live search and sortable table",
    "JWT-secured private dashboard",
  ]

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await register({ username: values.username, email: values.email, password: values.password })
      message.success("Account created! Please check your email to verify.")
      navigate("/login")
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left panel */}
      {isDesktop && (
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-20 bg-gradient-to-br from-rail-950 via-rail-900 to-rail-700 relative overflow-hidden">
          {/* Decorative circles */}
          <span className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/5 animate-pulse-slow" />
          <span className="absolute bottom-20 right-16 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 bg-white/10 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-sky-300">FREE TO JOIN</span>
            </div>

            <h2 className="font-display text-white text-4xl font-bold mb-3">
              Join the <br />
              <span className="text-sky-300">network.</span>
            </h2>

            <p className="text-blue-200 max-w-xs leading-relaxed opacity-80 mb-8">
              Create your account and start managing train operations in minutes.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 border border-green-200 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-blue-200 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 pt-18 sm:pt-0 bg-gray-50">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-rail-900 mb-1">Create account</h2>
            <p className="text-gray-500 text-sm">Fill in your details to get started.</p>
          </div>

          <div className="bg-white border border-blue-50 shadow-sm rounded-2xl p-8">
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">

              <Form.Item
                name="username"
                label={<span className="font-medium text-gray-700">Username</span>}
                rules={[{ required: true, message: "Username is required" }, { min: 3, message: "At least 3 characters" }]}
              >
                <Input placeholder="e.g. railadmin" className="rounded-lg border-gray-300" />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="font-medium text-gray-700">Email address</span>}
                rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
              >
                <Input placeholder="you@example.com" className="rounded-lg border-gray-300" />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="font-medium text-gray-700">Password</span>}
                rules={[{ required: true, message: "Password is required" }, { min: 6, message: "At least 6 characters" }]}
              >
                <Input.Password placeholder="••••••••" className="rounded-lg border-gray-300" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="font-medium text-gray-700">Confirm password</span>}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) return Promise.resolve()
                      return Promise.reject(new Error("Passwords do not match"))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" className="rounded-lg border-gray-300" />
              </Form.Item>

              <Form.Item className="mt-6 mb-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-br from-rail-700 to-rail-500 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin w-5 h-5" />}
                  <span>{loading ? "Creating account…" : "Create Account"}</span>
                </button>
              </Form.Item>
            </Form>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}