import React, { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { verifyEmail } from "../../services/api"

const IconCheck = () => <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
const IconX     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
const IconSpin  = () => (
  <svg viewBox="0 0 24 24" fill="none" width="32" height="32" style={{ animation:"spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="#e0effe" strokeWidth="3"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="#0054a0" strokeWidth="3" strokeLinecap="round"/>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </svg>
)

export default function VerifyEmail() {
  const [searchParams]          = useSearchParams()
  const [status, setStatus]     = useState("loading")
  const [msg,    setMsg]        = useState("")
  const calledRef               = useRef(false)   // ← prevents double call in StrictMode

  useEffect(() => {
    if (calledRef.current) return   // already ran — skip the second StrictMode call
    calledRef.current = true

    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setMsg("No verification token found in the link.")
      return
    }

    verifyEmail(token)
      .then(res => {
        setStatus("success")
        setMsg(res.data.message)
      })
      .catch(err => {
        setStatus("error")
        setMsg(err.response?.data?.message || "Verification failed.")
      })
  }, [])

  const config = {
    loading: { icon:<IconSpin />,  iconBg:"#e0effe", iconColor:"#0054a0", title:"Verifying your email…",  sub:"Please wait a moment."  },
    success: { icon:<IconCheck />, iconBg:"#d5f5e3", iconColor:"#1e8449", title:"Email Verified!",          sub:msg                      },
    error:   { icon:<IconX />,     iconBg:"#fadbd8", iconColor:"#922b21", title:"Verification Failed",      sub:msg                      },
  }[status]

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#072649,#0054a0)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div style={{ background:"white", borderRadius:20, padding:"3rem 2.5rem", maxWidth:440, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>

        <div style={{ width:72, height:72, borderRadius:"50%", background:config.iconBg, display:"flex", alignItems:"center", justifyContent:"center", color:config.iconColor, margin:"0 auto 1.5rem" }}>
          {config.icon}
        </div>

        <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#0a3c6d", marginBottom:"0.75rem" }}>
          {config.title}
        </h2>
        <p style={{ color:"#677890", lineHeight:1.7, marginBottom:"2rem" }}>{config.sub}</p>

        {status === "success" && (
          <Link to="/login"
            style={{ display:"inline-block", padding:"12px 32px", borderRadius:10, textDecoration:"none", background:"linear-gradient(135deg,#0054a0,#0c87e8)", color:"white", fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:"1rem", boxShadow:"0 4px 14px rgba(12,135,232,0.35)" }}>
            Sign In Now
          </Link>
        )}

        {status === "error" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
            <Link to="/login"
              style={{ display:"inline-block", padding:"11px 28px", borderRadius:10, textDecoration:"none", background:"linear-gradient(135deg,#0054a0,#0c87e8)", color:"white", fontFamily:"DM Sans,sans-serif", fontWeight:600 }}>
              Back to Login
            </Link>
            <p style={{ color:"#8795aa", fontSize:"0.85rem", margin:0 }}>
              Need a new link? Log in and request a resend.
            </p>
          </div>
        )}

        <div style={{ marginTop:"2rem", paddingTop:"1.5rem", borderTop:"1px solid #eceef2" }}>
          <Link to="/" style={{ color:"#8795aa", fontSize:"0.85rem", textDecoration:"none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}