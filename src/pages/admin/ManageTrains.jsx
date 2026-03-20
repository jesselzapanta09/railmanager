import React, { useState, useEffect, useCallback } from "react"
import { Table, Button, Popconfirm, Input, Tag, Tooltip, App } from "antd"
import { getTrains, createTrain, updateTrain, deleteTrain, imageUrl } from "../../services/api"
import TrainModal from "../../components/TrainModal"

const IconPlus   = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
const IconEdit   = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
const IconDelete = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
const IconSearch = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
const IconTrain  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z"/></svg>

export default function ManageTrains() {
  const { message } = App.useApp()
  const [trains,        setTrains]        = useState([])
  const [filtered,      setFiltered]      = useState([])
  const [loading,       setLoading]       = useState(false)
  const [search,        setSearch]        = useState("")
  const [modalOpen,     setModalOpen]     = useState(false)
  const [modalMode,     setModalMode]     = useState("add")
  const [editRecord,    setEditRecord]    = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchTrains = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getTrains()
      setTrains(res.data.data)
      setFiltered(res.data.data)
    } catch { message.error("Failed to load trains.") }
    finally   { setLoading(false) }
  }, [])

  useEffect(() => { fetchTrains() }, [fetchTrains])

  useEffect(() => {
    if (!search.trim()) { setFiltered(trains); return }
    const q = search.toLowerCase()
    setFiltered(trains.filter(t => t.train_name.toLowerCase().includes(q) || t.route.toLowerCase().includes(q)))
  }, [search, trains])

  const openAdd  = () => { setModalMode("add");  setEditRecord(null);  setModalOpen(true) }
  const openEdit = (r) => { setModalMode("edit"); setEditRecord(r);    setModalOpen(true) }

  const handleSubmit = async (values) => {
    setSubmitLoading(true)
    try {
      if (modalMode === "add") {
        await createTrain(values)
        message.success("Train added!")
      } else {
        await updateTrain(editRecord.id, values)
        message.success("Train updated!")
      }
      setModalOpen(false)
      fetchTrains()
    } catch (err) { message.error(err.response?.data?.message || "Operation failed.") }
    finally       { setSubmitLoading(false) }
  }

  const handleDelete = async (id) => {
    try { await deleteTrain(id); message.success("Train deleted."); fetchTrains() }
    catch { message.error("Delete failed.") }
  }

  const thStyle = { fontFamily:"DM Sans,sans-serif", fontWeight:600, color:"#677890", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.05em" }

  const columns = [
    {
      title: <span style={thStyle}>ID</span>, dataIndex:"id", width:70,
      render: id => <span style={{ background:"#e0effe", color:"#0054a0", padding:"2px 8px", borderRadius:6, fontFamily:"JetBrains Mono,monospace", fontSize:"0.75rem", fontWeight:600 }}>#{id}</span>
    },
    {
      title: <span style={thStyle}>Train</span>, dataIndex:"train_name",
      render: (name, record) => (
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {imageUrl(record.image) ? (
            <img
              src={imageUrl(record.image)} alt={name}
              style={{ width:36, height:36, borderRadius:8, objectFit:"cover", flexShrink:0, border:"1px solid #eceef2" }}
            />
          ) : (
            <div style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,#e0effe,#b9dffd)", display:"flex", alignItems:"center", justifyContent:"center", color:"#0054a0", flexShrink:0 }}>
              <IconTrain />
            </div>
          )}
          <span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:600, color:"#0a3c6d" }}>{name}</span>
        </div>
      )
    },
    {
      title: <span style={thStyle}>Price</span>, dataIndex:"price", width:130,
      sorter: (a,b) => parseFloat(a.price) - parseFloat(b.price),
      render: price => <Tag style={{ background:"#d5f5e3", color:"#1e8449", border:"none", borderRadius:6, fontFamily:"JetBrains Mono,monospace", fontWeight:600, fontSize:13 }}>₱{parseFloat(price).toFixed(2)}</Tag>
    },
    {
      title: <span style={thStyle}>Route</span>, dataIndex:"route",
      render: route => <span style={{ color:"#677890", fontSize:"0.9rem" }}>{route}</span>
    },
    {
      title: <span style={thStyle}>Date Added</span>, dataIndex:"created_at", width:140,
      render: d => <span style={{ color:"#8795aa", fontSize:"0.8rem" }}>{new Date(d).toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" })}</span>
    },
    {
      title: <span style={thStyle}>Actions</span>, width:110,
      render: (_, r) => (
        <div style={{ display:"flex", gap:6 }}>
          <Tooltip title="Edit">
            <Button size="small" onClick={() => openEdit(r)}
              style={{ borderRadius:8, borderColor:"#b9dffd", color:"#006ac6", background:"#f0f7ff" }}
              icon={<IconEdit />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete this train?" description="This cannot be undone." onConfirm={() => handleDelete(r.id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger:true }}>
              <Button size="small" danger style={{ borderRadius:8 }} icon={<IconDelete />} />
            </Popconfirm>
          </Tooltip>
        </div>
      )
    },
  ]

  return (
    <div style={{ padding:"2rem", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ marginBottom:"1.5rem" }}>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#0a3c6d", marginBottom:"0.25rem" }}>
          Manage Trains
        </h1>
        <p style={{ color:"#677890", margin:0 }}>Add, edit, or remove train records.</p>
      </div>

      <div style={{ background:"white", borderRadius:16, border:"1px solid #eceef2", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Toolbar */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12, padding:"1.25rem 1.5rem", borderBottom:"1px solid #eceef2" }}>
          <div>
            <span style={{ fontFamily:"Sora,sans-serif", fontWeight:600, fontSize:"0.95rem", color:"#0a3c6d" }}>All Trains</span>
            <span style={{ color:"#8795aa", fontSize:"0.8rem", marginLeft:8 }}>{filtered.length} records</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Input
              placeholder="Search trains or routes…"
              prefix={<span style={{ color:"#b1bac9" }}><IconSearch /></span>}
              value={search} onChange={e => setSearch(e.target.value)} allowClear
              style={{ width:240, borderRadius:10, borderColor:"#d5d9e2" }} />
            <Button onClick={openAdd} icon={<IconPlus />}
              style={{ borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:600, border:"none", color:"white", display:"flex", alignItems:"center", gap:6, background:"linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow:"0 3px 10px rgba(12,135,232,0.30)" }}>
              Add Train
            </Button>
          </div>
        </div>

        <Table
          dataSource={filtered} columns={columns} rowKey="id" loading={loading}
          pagination={{ pageSize:8, showSizeChanger:false, showTotal: t => <span style={{ color:"#8795aa", fontSize:"0.875rem" }}>{t} trains total</span>, style:{ padding:"16px 24px" } }}
          style={{ borderRadius:"0 0 16px 16px" }}
          locale={{ emptyText: (
            <div style={{ padding:"3rem 0", textAlign:"center" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"#e0effe", color:"#0054a0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}><svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z"/></svg></div>
              <p style={{ fontFamily:"Sora,sans-serif", fontWeight:600, color:"#444f62", margin:0 }}>No trains found</p>
              <p style={{ color:"#8795aa", fontSize:"0.875rem", marginTop:4 }}>{search ? "Try a different search." : 'Click "Add Train" to get started.'}</p>
            </div>
          )}}
        />
      </div>

      <TrainModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialValues={editRecord} loading={submitLoading} mode={modalMode} />
    </div>
  )
}