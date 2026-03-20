import React, { useState, useEffect } from "react"
import { Skeleton } from "antd"
import { Link } from "react-router-dom"
import { getTrains } from "../../services/api"
import { useAuth } from "../../context/AuthContext"

const IconTrain  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z"/></svg>
const IconMoney  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
const IconRoute  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
const IconArrow  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>

export default function AdminDashboard() {
  const { user } = useAuth()
  const [trains,  setTrains]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrains()
      .then(res => setTrains(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total    = trains.length
  const avgPrice = total ? (trains.reduce((s,t) => s + parseFloat(t.price), 0) / total).toFixed(2) : "0.00"
  const maxPrice = total ? Math.max(...trains.map(t => parseFloat(t.price))).toFixed(2) : "0.00"
  const routes   = new Set(trains.map(t => t.route)).size

  const stats = [
    { label:"Total Trains",  value: total,          icon:<IconTrain />,  color:"#0054a0", bg:"#e0effe" },
    { label:"Avg. Fare",     value:`₱${avgPrice}`,  icon:<IconMoney />,  color:"#1e8449", bg:"#d5f5e3" },
    { label:"Highest Fare",  value:`₱${maxPrice}`,  icon:<IconMoney />,  color:"#ba4a00", bg:"#fdebd0" },
    { label:"Unique Routes", value: routes,          icon:<IconRoute />,  color:"#6c3483", bg:"#e8daef" },
  ]

  return (
    <div style={{ padding:"2rem", maxWidth:1100, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#0a3c6d", marginBottom:"0.25rem" }}>
          Welcome back, {user?.username} 👋
        </h1>
        <p style={{ color:"#677890", margin:0 }}>Here's an overview of your train fleet.</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background:"white", borderRadius:16, padding:"1.4rem",
            border:"1px solid #eceef2",
            boxShadow:"0 1px 3px rgba(0,0,0,0.05),0 4px 12px rgba(0,0,0,0.04)",
            transition:"all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.09)" }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05),0 4px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:s.bg, color:s.color, marginBottom:"0.85rem" }}>
              {s.icon}
            </div>
            <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#1e232d" }}>
              {loading ? <Skeleton.Input active size="small" style={{ width:60 }} /> : s.value}
            </div>
            <div style={{ color:"#8795aa", fontSize:"0.78rem", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        <div style={{ background:"white", borderRadius:16, padding:"1.5rem", border:"1px solid #eceef2", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:600, fontSize:"1rem", color:"#0a3c6d", marginBottom:"1rem" }}>
            Quick Actions
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Link to="/admin/trains"
              style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"12px 14px", borderRadius:10, textDecoration:"none",
                background:"linear-gradient(135deg,#0054a0,#0c87e8)", color:"white",
                fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:"0.9rem",
              }}>
              <span style={{ display:"flex", alignItems:"center", gap:8 }}><IconTrain /> Manage Trains</span>
              <IconArrow />
            </Link>
          </div>
        </div>

        {/* Recent trains */}
        <div style={{ background:"white", borderRadius:16, padding:"1.5rem", border:"1px solid #eceef2", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontWeight:600, fontSize:"1rem", color:"#0a3c6d", margin:0 }}>Recently Added</h2>
            <Link to="/admin/trains" style={{ color:"#006ac6", fontSize:"0.8rem", fontFamily:"DM Sans,sans-serif", fontWeight:600, textDecoration:"none" }}>View all</Link>
          </div>
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : trains.length === 0 ? (
            <p style={{ color:"#8795aa", fontSize:"0.875rem", textAlign:"center", padding:"1rem 0" }}>No trains yet.</p>
          ) : (
            trains.slice(0, 4).map(t => (
              <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f0f1f3" }}>
                <div>
                  <div style={{ fontFamily:"DM Sans,sans-serif", fontWeight:600, fontSize:"0.875rem", color:"#1e232d" }}>{t.train_name}</div>
                  <div style={{ color:"#8795aa", fontSize:"0.75rem", marginTop:1 }}>{t.route}</div>
                </div>
                <span style={{ background:"#d5f5e3", color:"#1e8449", padding:"3px 10px", borderRadius:6, fontFamily:"JetBrains Mono,monospace", fontWeight:600, fontSize:"0.8rem" }}>
                  ₱{parseFloat(t.price).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}