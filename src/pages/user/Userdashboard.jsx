import React, { useState, useEffect, useCallback } from "react"
import { Table, Input, Tag, App } from "antd"
import { getTrains, imageUrl } from "../../services/api"
import { useAuth } from "../../context/AuthContext"

const IconSearch = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
const IconTrain = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" /></svg>
const IconInfo = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>

export default function UserDashboard() {
  const { user } = useAuth()
  const { message } = App.useApp()
  const [trains, setTrains] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchTrains = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getTrains()
      setTrains(res.data.data)
      setFiltered(res.data.data)
    } catch { message.error("Failed to load trains.") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTrains() }, [fetchTrains])

  useEffect(() => {
    if (!search.trim()) { setFiltered(trains); return }
    const q = search.toLowerCase()
    setFiltered(trains.filter(t => t.train_name.toLowerCase().includes(q) || t.route.toLowerCase().includes(q)))
  }, [search, trains])

  const thStyle = { fontFamily: "DM Sans,sans-serif", fontWeight: 600, color: "#677890", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }

  const columns = [
    {
      title: <span style={thStyle}>#</span>, dataIndex: "id", width: 60,
      render: id => <span style={{ background: "#e0effe", color: "#0054a0", padding: "2px 8px", borderRadius: 6, fontFamily: "JetBrains Mono,monospace", fontSize: "0.75rem", fontWeight: 600 }}>#{id}</span>
    },
    {
      title: <span style={thStyle}>Train</span>, dataIndex: "train_name",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {imageUrl(record.image) ? (
            <img
              src={imageUrl(record.image)} alt={name}
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: "1px solid #eceef2" }}
            />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#e0effe,#b9dffd)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0054a0", flexShrink: 0 }}>
              <IconTrain />
            </div>
          )}
          <span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 600, color: "#0a3c6d" }}>{name}</span>
        </div>
      )
    },
    {
      title: <span style={thStyle}>Fare</span>, dataIndex: "price", width: 130,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
      render: price => <Tag style={{ background: "#d5f5e3", color: "#1e8449", border: "none", borderRadius: 6, fontFamily: "JetBrains Mono,monospace", fontWeight: 600, fontSize: 13 }}>₱{parseFloat(price).toFixed(2)}</Tag>
    },
    {
      title: <span style={thStyle}>Route</span>, dataIndex: "route",
      render: route => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#36a5f7", flexShrink: 0 }}></span>
          <span style={{ color: "#536078", fontSize: "0.9rem" }}>{route}</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#36a5f7", flexShrink: 0 }}></span>
        </div>
      )
    },
    {
      title: <span style={thStyle}>Date Added</span>, dataIndex: "created_at", width: 140,
      render: d => <span style={{ color: "#8795aa", fontSize: "0.8rem" }}>{new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</span>
    },
  ]

  const total = trains.length
  const minPrice = total ? Math.min(...trains.map(t => parseFloat(t.price))).toFixed(2) : "0.00"
  const maxPrice = total ? Math.max(...trains.map(t => parseFloat(t.price))).toFixed(2) : "0.00"

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "#0a3c6d", marginBottom: "0.25rem" }}>
          Hello, {user?.username} 👋
        </h1>
        <p style={{ color: "#677890", margin: 0 }}>Browse the available train lines and fares below.</p>
      </div>

      {/* Read-only notice */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: "1.5rem" }}>
        <span style={{ color: "#d97706" }}><IconInfo /></span>
        <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.875rem", color: "#92400e" }}>
          You are viewing as a <strong>User</strong>. Train records are read-only. Contact an admin to make changes.
        </span>
      </div>

      {/* Summary chips */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {[
          { label: `${total} Train${total !== 1 ? "s" : ""} Available`, color: "#0054a0", bg: "#e0effe" },
          { label: `Min Fare: ₱${minPrice}`, color: "#1e8449", bg: "#d5f5e3" },
          { label: `Max Fare: ₱${maxPrice}`, color: "#ba4a00", bg: "#fdebd0" },
        ].map(c => (
          <span key={c.label} style={{ padding: "6px 14px", borderRadius: 100, background: c.bg, color: c.color, fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.825rem" }}>
            {c.label}
          </span>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceef2", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #eceef2", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#0a3c6d" }}>Train Lines</span>
            <span style={{ color: "#8795aa", fontSize: "0.8rem", marginLeft: 8 }}>{filtered.length} results</span>
          </div>
          <Input
            placeholder="Search by name or route…"
            prefix={<span style={{ color: "#b1bac9" }}><IconSearch /></span>}
            value={search} onChange={e => setSearch(e.target.value)} allowClear
            style={{ width: 260, borderRadius: 10, borderColor: "#d5d9e2" }} />
        </div>

        <div className="overflow-x-auto">
          <Table
            dataSource={filtered} columns={columns} rowKey="id" loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: false, showTotal: t => <span style={{ color: "#8795aa", fontSize: "0.875rem" }}>{t} trains total</span>, style: { padding: "16px 24px" } }}
            style={{ borderRadius: "0 0 16px 16px" }}
            locale={{
              emptyText: (
                <div style={{ padding: "3rem 0", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#e0effe", color: "#0054a0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" /></svg>
                  </div>
                  <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, color: "#444f62", margin: 0 }}>No trains found</p>
                  <p style={{ color: "#8795aa", fontSize: "0.875rem", marginTop: 4 }}>Try a different search term.</p>
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}