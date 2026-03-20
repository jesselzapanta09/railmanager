import React, { useState, useEffect } from "react"
import { Form, Input, Button, App } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../../services/api"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])
  return isDesktop
}

export default function Register() {
  const { message }             = App.useApp()
  const isDesktop               = useIsDesktop()
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()
  const [form]                  = Form.useForm()

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
              <span style={{ color:"#7cc4fb", fontSize:"0.78rem", fontFamily:"JetBrains Mono,monospace", fontWeight:500 }}>FREE TO JOIN</span>
            </div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, color:"white", fontSize:"2.2rem", lineHeight:1.25, marginBottom:"1rem" }}>
              Join the<br /><span style={{ color:"#7cc4fb" }}>network.</span>
            </h2>
            <p style={{ color:"#bfdbfe", fontSize:"1rem", lineHeight:1.75, maxWidth:300, opacity:0.85 }}>
              Create your account and start managing train operations in minutes.
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {["Manage unlimited train records", "Full CRUD — create, update, delete", "Live search and sortable table", "JWT-secured private dashboard"].map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.4)" }}>
                  <svg viewBox="0 0 12 12" width="10" height="10">
                    <path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color:"#bfdbfe", fontSize:"0.9rem" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right form panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"#f6f7f9" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          <div style={{ marginBottom:"2rem" }}>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.9rem", color:"#0a3c6d", marginBottom:"0.35rem" }}>Create account</h2>
            <p style={{ color:"#677890", margin:0 }}>Fill in your details to get started.</p>
          </div>

          <div style={{ background:"white", borderRadius:16, padding:"2rem", border:"1px solid #e0effe", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06)" }}>
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">

              <Form.Item name="username"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Username</span>}
                rules={[{ required:true, message:"Username is required" }, { min:3, message:"At least 3 characters" }]}>
                <Input placeholder="e.g. railadmin" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item name="email"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Email address</span>}
                rules={[{ required:true, message:"Email is required" }, { type:"email", message:"Enter a valid email" }]}>
                <Input placeholder="you@example.com" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item name="password"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Password</span>}
                rules={[{ required:true, message:"Password is required" }, { min:6, message:"At least 6 characters" }]}>
                <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item name="confirmPassword"
                label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Confirm password</span>}
                dependencies={["password"]}
                rules={[
                  { required:true, message:"Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) return Promise.resolve()
                      return Promise.reject(new Error("Passwords do not match"))
                    },
                  }),
                ]}>
                <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
              </Form.Item>

              <Form.Item style={{ marginBottom:0, marginTop:"1.5rem" }}>
                <Button htmlType="submit" loading={loading} block
                  style={{ height:48, borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:15, border:"none", color:"white", background:"linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow:"0 4px 14px rgba(12,135,232,0.35)" }}>
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </Form.Item>
            </Form>
          </div>

          <p style={{ textAlign:"center", marginTop:"1.5rem", color:"#677890", fontSize:"0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:"#006ac6", fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}