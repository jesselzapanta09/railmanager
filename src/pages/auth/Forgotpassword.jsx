import React, { useState } from "react"
import { Form, Input, Button, App } from "antd"
import { Link } from "react-router-dom"
import { forgotPassword } from "../../services/api"

export default function ForgotPassword() {
  const { message } = App.useApp()
  const [loading, setLoading]   = useState(false)
  const [sent,    setSent]      = useState(false)
  const [form]                  = Form.useForm()

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
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#072649,#0054a0)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div style={{ background:"white", borderRadius:20, padding:"3rem 2.5rem", maxWidth:440, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>

        {/* Icon */}
        <div style={{ width:60, height:60, borderRadius:"50%", background:"#e0effe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", color:"#0054a0" }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </div>

        {!sent ? (
          <>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#0a3c6d", textAlign:"center", marginBottom:"0.5rem" }}>
              Forgot Password?
            </h2>
            <p style={{ color:"#677890", textAlign:"center", lineHeight:1.7, marginBottom:"2rem" }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
              <Form.Item name="email"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Email address</span>}
                rules={[{ required:true, message:"Email is required" }, { type:"email", message:"Enter a valid email" }]}>
                <Input placeholder="you@example.com" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>
              <Form.Item style={{ marginBottom:0, marginTop:"0.5rem" }}>
                <Button htmlType="submit" loading={loading} block
                  style={{ height:48, borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:15, border:"none", color:"white", background:"linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow:"0 4px 14px rgba(12,135,232,0.35)" }}>
                  {loading ? "Sending…" : "Send Reset Link"}
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#d5f5e3", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", color:"#1e8449" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, color:"#0a3c6d", fontSize:"1.3rem", marginBottom:"0.5rem" }}>Check your inbox!</h3>
            <p style={{ color:"#677890", lineHeight:1.7, marginBottom:"1.5rem" }}>
              If an account with that email exists, you'll receive a reset link shortly. The link expires in <strong>1 hour</strong>.
            </p>
            <button onClick={() => setSent(false)}
              style={{ background:"none", border:"none", color:"#006ac6", cursor:"pointer", fontWeight:500, fontSize:"0.9rem" }}>
              Try a different email
            </button>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:"2rem", paddingTop:"1.5rem", borderTop:"1px solid #eceef2" }}>
          <Link to="/login" style={{ color:"#677890", fontSize:"0.875rem", textDecoration:"none" }}>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}