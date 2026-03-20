import React, { useState, useEffect, useCallback } from "react"
import { Table, Button, Popconfirm, Input, Tag, Tooltip, App, Badge } from "antd"
import { getUsers, createUser, updateUser, deleteUser } from "../../services/api"
// import { useAuth } from "../../context/AuthContext"
import UserModal from "../../components/Usermodal"
import Avatar from "../../components/Avatar"

const IconPlus = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
const IconEdit = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
const IconDelete = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
const IconSearch = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>

export default function UserManagement() {
    const { message } = App.useApp()
    // const { user: me } = useAuth()

    const [users, setUsers] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("add")
    const [editRecord, setEditRecord] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await getUsers()
            setUsers(res.data.data)
            setFiltered(res.data.data)
        } catch {
            message.error("Failed to load users.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    useEffect(() => {
        if (!search.trim()) { setFiltered(users); return }
        const q = search.toLowerCase()
        setFiltered(users.filter(u =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        ))
    }, [search, users])

    const openAdd = () => { setModalMode("add"); setEditRecord(null); setModalOpen(true) }
    const openEdit = (r) => { setModalMode("edit"); setEditRecord(r); setModalOpen(true) }

    const handleSubmit = async (values) => {
        setSubmitLoading(true)
        try {
            if (modalMode === "add") {
                await createUser(values)
                message.success("User created successfully!")
            } else {
                const emailChanged = values.email && values.email !== editRecord.email
                await updateUser(editRecord.id, values)
                if (emailChanged) {
                    message.warning("Email changed — user's email_verified_at has been reset. They must re-verify before logging in.")
                } else {
                    message.success("User updated successfully!")
                }
            }
            setModalOpen(false)
            fetchUsers()
        } catch (err) {
            message.error(err.response?.data?.message || "Operation failed.")
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteUser(id)
            message.success("User deleted.")
            fetchUsers()
        } catch (err) {
            message.error(err.response?.data?.message || "Delete failed.")
        }
    }

    const thStyle = { fontFamily: "DM Sans,sans-serif", fontWeight: 600, color: "#677890", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }

    const columns = [
        {
            title: <span style={thStyle}>ID</span>,
            dataIndex: "id", width: 64,
            render: id => (
                <span style={{ background: "#e0effe", color: "#0054a0", padding: "2px 8px", borderRadius: 6, fontFamily: "JetBrains Mono,monospace", fontSize: "0.75rem", fontWeight: 600 }}>
                    #{id}
                </span>
            )
        },
        {
            title: <span style={thStyle}>User</span>,
            dataIndex: "username",
            render: (username, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar user={record} size={34} fontSize="0.85rem" />
                    <div>
                        <div style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 600, color: "#0a3c6d", fontSize: "0.9rem" }}>
                            {username}
                        </div>
                        <div style={{ color: "#8795aa", fontSize: "0.78rem" }}>{record.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: <span style={thStyle}>Role</span>,
            dataIndex: "role", width: 100,
            filters: [{ text: "Admin", value: "admin" }, { text: "User", value: "user" }],
            onFilter: (value, record) => record.role === value,
            render: role => (
                <Tag style={{
                    background: role === "admin" ? "#e0effe" : "#d5f5e3",
                    color: role === "admin" ? "#0054a0" : "#1e8449",
                    border: "none", borderRadius: 6,
                    fontFamily: "JetBrains Mono,monospace", fontWeight: 600, fontSize: 12,
                }}>
                    {role.toUpperCase()}
                </Tag>
            )
        },
        {
            title: <span style={thStyle}>Email Verified</span>,
            dataIndex: "email_verified_at", width: 150,
            filters: [{ text: "Verified", value: "yes" }, { text: "Not Verified", value: "no" }],
            onFilter: (value, record) => value === "yes" ? !!record.email_verified_at : !record.email_verified_at,
            render: val => val ? (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#1e8449", fontSize: "0.82rem", fontFamily: "DM Sans,sans-serif" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1e8449", display: "inline-block" }}></span>
                    Verified
                </span>
            ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#e74c3c", fontSize: "0.82rem", fontFamily: "DM Sans,sans-serif" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e74c3c", display: "inline-block" }}></span>
                    Not verified
                </span>
            )
        },
        {
            title: <span style={thStyle}>Joined</span>,
            dataIndex: "created_at", width: 130,
            render: d => (
                <span style={{ color: "#8795aa", fontSize: "0.8rem" }}>
                    {new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                </span>
            )
        },
        {
            title: <span style={thStyle}>Actions</span>,
            width: 100,
            render: (_, record) => (
                <div style={{ display: "flex", gap: 6 }}>
                    <Tooltip title="Edit">
                        <Button size="small" onClick={() => openEdit(record)}
                            style={{ borderRadius: 8, borderColor: "#b9dffd", color: "#006ac6", background: "#f0f7ff" }}
                            icon={<IconEdit />} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title={`Delete ${record.username}?`}
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Delete" cancelText="Cancel"
                            okButtonProps={{ danger: true }}>
                            <Button size="small" danger style={{ borderRadius: 8 }} icon={<IconDelete />} />
                        </Popconfirm>
                    </Tooltip>
                </div>
            )
        }
    ]

    const totalAdmins = users.filter(u => u.role === "admin").length
    const totalUsers = users.filter(u => u.role === "user").length
    const unverified = users.filter(u => !u.email_verified_at).length

    return (
        <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "1.75rem" }}>
                <h1 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "#0a3c6d", marginBottom: "0.25rem" }}>
                    User Management
                </h1>
                <p style={{ color: "#677890", margin: 0 }}>
                    Manage all accounts. Your own account is not shown here — use Edit Profile to update it.
                </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                    { label: "Total Users", value: users.length, color: "#0054a0", bg: "#e0effe" },
                    { label: "Admins", value: totalAdmins, color: "#6c3483", bg: "#e8daef" },
                    { label: "Regular Users", value: totalUsers, color: "#1e8449", bg: "#d5f5e3" },
                    { label: "Unverified", value: unverified, color: "#e74c3c", bg: "#fadbd8" },
                ].map(s => (
                    <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "1.1rem 1.25rem", border: "1px solid #eceef2", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.6rem", color: s.color }}>{s.value}</div>
                        <div style={{ color: "#8795aa", fontSize: "0.78rem", marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceef2", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

                {/* Toolbar */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "1.25rem 1.5rem", borderBottom: "1px solid #eceef2" }}>
                    <div>
                        <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#0a3c6d" }}>
                            All Users
                        </span>
                        <span style={{ color: "#8795aa", fontSize: "0.8rem", marginLeft: 8 }}>
                            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Input
                            placeholder="Search username, email, role…"
                            prefix={<span style={{ color: "#b1bac9" }}><IconSearch /></span>}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                            style={{ width: 260, borderRadius: 10, borderColor: "#d5d9e2" }} />
                        <Button onClick={openAdd} icon={<IconPlus />}
                            style={{ borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 600, border: "none", color: "white", display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow: "0 3px 10px rgba(12,135,232,0.30)" }}>
                            Add User
                        </Button>
                    </div>
                </div>

                <Table
                    dataSource={filtered}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: t => <span style={{ color: "#8795aa", fontSize: "0.875rem" }}>{t} users total</span>,
                        style: { padding: "16px 24px" },
                    }}
                    style={{ borderRadius: "0 0 16px 16px" }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: "3rem 0", textAlign: "center" }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#e0effe", color: "#0054a0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                                <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, color: "#444f62", margin: 0 }}>No users found</p>
                                <p style={{ color: "#8795aa", fontSize: "0.875rem", marginTop: 4 }}>
                                    {search ? "Try a different search." : 'Click "Add User" to create one.'}
                                </p>
                            </div>
                        )
                    }}
                />
            </div>

            <UserModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editRecord}
                loading={submitLoading}
                mode={modalMode}
            />
        </div>
    )
}