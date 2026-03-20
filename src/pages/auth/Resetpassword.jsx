import React, { useState } from "react"
import { Form, Input, Button, App } from "antd"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { resetPassword } from "../../services/api"

export default function ResetPassword() {
  const { message }     = App.useApp()
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form]                = Form.useForm()
  const token = searchParams.get("token")

  const onFinish = async ({ password }) => {
    if (!token) { message.error("Invalid reset link."); return }
    setLoading(true)
    try {
      const res = await resetPassword({ token, password })
      setSuccess(true)
      message.success(res.data.message)
      setTimeout(() => navigate("/login"), 2500)
    } catch (err) {
      message.error(err.response?.data?.message || "Reset failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#072649,#0054a0)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div style={{ background:"white", borderRadius:20, padding:"3rem 2.5rem", maxWidth:440, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>

        {!success ? (
          <>
            <div style={{ width:60, height:60, borderRadius:"50%", background:"#e0effe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", color:"#0054a0" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
            </div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#0a3c6d", textAlign:"center", marginBottom:"0.5rem" }}>
              Set New Password
            </h2>
            <p style={{ color:"#677890", textAlign:"center", lineHeight:1.7, marginBottom:"2rem" }}>
              Create a strong new password for your account.
            </p>

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
              <Form.Item name="password"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>New password</span>}
                rules={[{ required:true, message:"Password is required" }, { min:6, message:"At least 6 characters" }]}>
                <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item name="confirmPassword"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Confirm new password</span>}
                dependencies={["password"]}
                rules={[
                  { required:true, message:"Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) return Promise.resolve()
                      return Promise.reject(new Error("Passwords do not match"))
                    }
                  })
                ]}>
                <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item style={{ marginBottom:0, marginTop:"0.5rem" }}>
                <Button htmlType="submit" loading={loading} block
                  style={{ height:48, borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:15, border:"none", color:"white", background:"linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow:"0 4px 14px rgba(12,135,232,0.35)" }}>
                  {loading ? "Resetting…" : "Reset Password"}
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#d5f5e3", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", color:"#1e8449" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, color:"#0a3c6d", fontSize:"1.3rem", marginBottom:"0.5rem" }}>Password Reset!</h3>
            <p style={{ color:"#677890", lineHeight:1.7 }}>Redirecting you to sign in…</p>
          </div>
        )}

        {!success && (
          <div style={{ textAlign:"center", marginTop:"2rem", paddingTop:"1.5rem", borderTop:"1px solid #eceef2" }}>
            <Link to="/login" style={{ color:"#677890", fontSize:"0.875rem", textDecoration:"none" }}>← Back to Sign In</Link>
          </div>
        )}
      </div>
    </div>
  )
}