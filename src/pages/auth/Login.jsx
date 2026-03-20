import React, { useState, useEffect } from "react"
import { Form, Input, Button, App, Alert } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { login, resendVerification } from "../../services/api"
import { useAuth } from "../../context/AuthContext"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])
  return isDesktop
}

export default function Login() {
  const { message }                            = App.useApp()
  const isDesktop                              = useIsDesktop()
  const [loading,        setLoading]           = useState(false)
  const [unverified,     setUnverified]        = useState(false)
  const [unverifiedEmail,setUnverifiedEmail]   = useState("")
  const [resending,      setResending]         = useState(false)
  const { loginUser }                          = useAuth()
  const navigate                               = useNavigate()
  const [form]                                 = Form.useForm()

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

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>

      {/* Left panel — desktop only */}
      {isDesktop && (
        <div style={{
          width:"45%", padding:"8rem 3.5rem 3.5rem",
          background:"linear-gradient(145deg,#072649 0%,#0054a0 60%,#006ac6 100%)",
          display:"flex", flexDirection:"column", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:100, marginBottom:"2rem", background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.15)" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", display:"inline-block" }}></span>
              <span style={{ color:"#7cc4fb", fontSize:"0.78rem", fontFamily:"JetBrains Mono,monospace", fontWeight:500 }}>SYSTEM ONLINE</span>
            </div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, color:"white", fontSize:"2.2rem", lineHeight:1.25, marginBottom:"1rem" }}>
              Welcome<br /><span style={{ color:"#7cc4fb" }}>back.</span>
            </h2>
            <p style={{ color:"#bfdbfe", fontSize:"1rem", lineHeight:1.75, maxWidth:300, opacity:0.85 }}>
              Sign in to access your train fleet dashboard.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[{ label:"Routes", value:"50+" }, { label:"Uptime", value:"99.9%" }, { label:"Trains", value:"120+" }].map(s => (
              <div key={s.label} style={{ borderRadius:12, padding:"1rem", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, color:"white", fontSize:"1.4rem" }}>{s.value}</div>
                <div style={{ color:"#93c5fd", fontSize:"0.8rem", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right form panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"#f6f7f9" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          <div style={{ marginBottom:"2rem" }}>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.9rem", color:"#0a3c6d", marginBottom:"0.35rem" }}>Sign in</h2>
            <p style={{ color:"#677890", margin:0 }}>Enter your credentials to continue.</p>
          </div>

          {/* Unverified email banner — stays persistent since it needs a resend action */}
          {unverified && (
            <Alert type="warning" showIcon message="Email not verified"
              description={
                <span>
                  Please verify your email first.{" "}
                  <button onClick={handleResend} disabled={resending}
                    style={{ background:"none", border:"none", color:"#d97706", fontWeight:600, cursor:"pointer", padding:0, textDecoration:"underline" }}>
                    {resending ? "Sending…" : "Resend verification email"}
                  </button>
                </span>
              }
              style={{ marginBottom:"1.25rem", borderRadius:10 }} />
          )}

          <div style={{ background:"white", borderRadius:16, padding:"2rem", border:"1px solid #e0effe", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06)" }}>
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">

              <Form.Item name="email"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Email address</span>}
                rules={[{ required:true, message:"Email is required" }, { type:"email", message:"Enter a valid email" }]}>
                <Input placeholder="you@example.com" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item name="password"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Password</span>}
                rules={[{ required:true, message:"Password is required" }]}>
                <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <div style={{ textAlign:"right", marginTop:"-0.5rem", marginBottom:"1rem" }}>
                <Link to="/forgot-password" style={{ color:"#006ac6", fontSize:"0.85rem", fontWeight:500 }}>
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{ marginBottom:0 }}>
                <Button htmlType="submit" loading={loading} block
                  style={{ height:48, borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:15, border:"none", color:"white", background:"linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow:"0 4px 14px rgba(12,135,232,0.35)" }}>
                  {loading ? "Signing in…" : "Sign in to Dashboard"}
                </Button>
              </Form.Item>
            </Form>

            
                                <p>to fix, the responsivenes, avatar wont show if log out</p>
          </div>

          <p style={{ textAlign:"center", marginTop:"1.5rem", color:"#677890", fontSize:"0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:"#006ac6", fontWeight:600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}