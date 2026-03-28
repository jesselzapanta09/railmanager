import React, { useState, useEffect, useCallback } from "react"
import { Table, Button, Popconfirm, Input, Tag, Tooltip, App, Modal, Spin } from "antd"
import { Plus, Edit, Trash2, Search, User, User2 } from "lucide-react"
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../../services/api"
import UserModal from "../../components/Usermodal"
import Avatar from "../../components/Avatar"

export default function UserManagement() {
    const { message } = App.useApp()

    const [users, setUsers] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("add")
    const [editRecord, setEditRecord] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [viewUser, setViewUser] = useState(null)
    const [viewLoading, setViewLoading] = useState(false)

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
        if (!search.trim()) return setFiltered(users)
        const q = search.toLowerCase()
        setFiltered(users.filter(u =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        ))
    }, [search, users])

    const openAdd = () => { setModalMode("add"); setEditRecord(null); setModalOpen(true) }
    const openEdit = r => { setModalMode("edit"); setEditRecord(r); setModalOpen(true) }

    const openView = async (id) => {
        setViewModalOpen(true)
        setViewLoading(true)
        try {
            const res = await getUserById(id)
            setViewUser(res.data.data)
        } catch {
            message.error("Failed to load user details.")
            setViewModalOpen(false)
        } finally {
            setViewLoading(false)
        }
    }

    const handleSubmit = async values => {
        setSubmitLoading(true)
        try {
            if (modalMode === "add") {
                await createUser(values)
                message.success("User created successfully!")
            } else {
                const emailChanged = values.email && values.email !== editRecord.email
                await updateUser(editRecord.id, values)
                if (emailChanged) {
                    message.warning("Email changed — user's email_verified_at has been reset.")
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

    const handleDelete = async id => {
        try {
            await deleteUser(id)
            message.success("User deleted.")
            fetchUsers()
        } catch (err) {
            message.error(err.response?.data?.message || "Delete failed.")
        }
    }

    const totalAdmins = users.filter(u => u.role === "admin").length
    const totalUsers = users.filter(u => u.role === "user").length
    const unverified = users.filter(u => !u.email_verified_at).length

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 64,
            sorter: (a, b) => parseFloat(a.id) - parseFloat(b.id),
            render: id => (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono text-xs font-semibold">
                    #{id}
                </span>
            )
        },
        {
            title: "User",
            dataIndex: "username",
            render: (username, record) => (
                <div className="flex items-center gap-3">
                    <Avatar user={record} size={34} fontSize="0.85rem" />
                    <div>
                        <div
                            onClick={() => openView(record.id)}
                            className="font-semibold text-blue-900 text-sm cursor-pointer hover:underline"
                        >
                            {username}
                        </div>
                        <div className="text-gray-400 text-xs">{record.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: "Role",
            dataIndex: "role",
            width: 100,
            filters: [{ text: "Admin", value: "admin" }, { text: "User", value: "user" }],
            onFilter: (value, record) => record.role === value,
            render: role => (
                <Tag variant="filled" color={role === "admin" ? "blue" : "green"}>
                    {role.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Email Verified",
            dataIndex: "email_verified_at",
            width: 150,
            filters: [{ text: "Verified", value: "yes" }, { text: "Not Verified", value: "no" }],
            onFilter: (value, record) => value === "yes" ? !!record.email_verified_at : !record.email_verified_at,
            render: val => (
                <span className={`flex items-center gap-1 text-xs ${val ? "text-green-600" : "text-red-600"}`}>
                    <span className={`w-2 h-2 rounded-full ${val ? "bg-green-600" : "bg-red-600"}`}></span>
                    {val ? "Verified" : "Not Verified"}
                </span>
            )
        },
        {
            title: "Joined",
            dataIndex: "created_at",
            width: 130,
            render: d => (
                <span className="text-gray-400 text-xs">
                    {new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                </span>
            )
        },
        {
            title: "Actions",
            width: 100,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Tooltip title="Edit">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => openEdit(record)}
                            icon={<Edit size={14} />}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title={`Delete ${record.username}?`}
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Button size="small" danger className="rounded-md" icon={<Trash2 size={14} />} />
                        </Popconfirm>
                    </Tooltip>
                </div>
            )
        }
    ]

    const stats = [
        { label: "Total Users", value: users.length, bg: "bg-blue-100", text: "text-blue-800" },
        { label: "Admins", value: totalAdmins, bg: "bg-purple-100", text: "text-purple-700" },
        { label: "Regular Users", value: totalUsers, bg: "bg-green-100", text: "text-green-700" },
        { label: "Unverified", value: unverified, bg: "bg-red-100", text: "text-red-600" },
    ]

    return (
        <div className="p-8 max-w-275 mx-auto">

            {/* Header */}
            <div className="mb-7 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 shadow-sm border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md mb-2 sm:mb-0">
                        <User className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="font-sora font-bold text-xl sm:text-2xl lg:text-3xl text-blue-900 truncate">
                            User Management
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1 sm:mt-2">
                            Manage all accounts. Your own account is not shown here — use{' '}
                            <span className="font-medium text-blue-600">Edit Profile</span> to update it.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 overflow-x-auto py-2 mb-6 justify-between">
                {stats.map(s => (
                    <div key={s.label} className={`shrink-0 w-60 ${s.bg} rounded-xl p-4 border border-gray-200 shadow-sm`}>
                        <div className={`font-sora font-bold text-xl ${s.text}`}>{s.value}</div>
                        <div className="text-gray-400 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                <div className="flex flex-wrap justify-between items-center gap-3 p-5 border-b border-gray-200">
                    <div>
                        <span className="font-sora font-semibold text-sm text-blue-900">All Users</span>
                        <span className="text-gray-400 text-xs ml-2">{filtered.length} record{filtered.length !== 1 && "s"}</span>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Search username, email, role…"
                            prefix={<Search size={14} className="text-gray-400" />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                            className="w-64 rounded-lg"
                        />
                        <Button onClick={openAdd} type="primary" icon={<Plus size={14} />}>
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
                        showTotal: t => <span className="text-gray-400 text-sm">{t} users total</span>,
                    }}
                />
            </div>

            <Modal
                open={viewModalOpen}
                onCancel={() => setViewModalOpen(false)}
                footer={null}
            // title="User Details"
            >
                {viewLoading ? (
                    <div className="flex justify-center py-10">
                        <Spin />
                    </div>
                ) : viewUser && (
                    <div className="space-y-4 pt-20">

                        {/* Header */}
                        <div className="absolute top-0 left-0 w-full p-6 bg-linear-to-tr from-blue-900 to-blue-700 flex items-center gap-3 rounded-t-xl z-10">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <User2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">
                                    User Details
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Avatar user={viewUser} size={50} fontSize="1rem" />
                            <div>
                                <div className="font-semibold text-blue-900">{viewUser.username}</div>
                                <div className="text-gray-400 text-sm">{viewUser.email}</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Tag color={viewUser.role === "admin" ? "blue" : "green"}>
                                {viewUser.role.toUpperCase()}
                            </Tag>

                            <Tag color={viewUser.email_verified_at ? "green" : "red"}>
                                {viewUser.email_verified_at ? "Verified" : "Not Verified"}
                            </Tag>
                        </div>

                        <div className="text-sm text-gray-500">
                            Joined: {new Date(viewUser.created_at).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </div>
                    </div>
                )}
            </Modal>

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
