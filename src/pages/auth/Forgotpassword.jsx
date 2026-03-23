import React, { useState } from "react"
import { Form, Input, Button, App } from "antd"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../../services/api"

export default function ForgotPassword() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async ({ email }) => {
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      setSent(true)
      message.success(res.data.message)
    } catch (err) {
      message.error(err.response?.data?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rail-950 via-rail-900 to-rail-700 p-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-xl">

        {/* Top Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7" />
        </div>

        {!sent ? (
          <>
            <h2 className="font-display font-bold text-2xl text-rail-900 text-center mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-center mb-6 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

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

              <Form.Item className="mt-2 mb-0">
                <button
                  htmlType="submit"
                  disabled={loading}
                  className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-br from-rail-700 to-rail-500 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin w-5 h-5" />}
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div className="text-center">
            <h3 className="font-display font-bold text-xl text-rail-900 mb-2">
              Check your inbox!
            </h3>
            <p className="text-gray-500 mb-4 leading-relaxed">
              If an account with that email exists, you'll receive a reset link shortly. The link expires in <strong>1 hour</strong>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Back to Sign In */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <Link to="/login" className="text-gray-400 text-sm hover:text-gray-600">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}