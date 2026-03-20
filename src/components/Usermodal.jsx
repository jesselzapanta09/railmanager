import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Select, Button, Upload, App } from "antd"
import { imageUrl } from "../services/api"
import Avatar from "./Avatar"

export default function UserModal({ open, onClose, onSubmit, initialValues, loading, mode }) {
    const { message } = App.useApp()
    const [form] = Form.useForm()

    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [removeAvatar, setRemoveAvatar] = useState(false)
    const [previewUser, setPreviewUser] = useState(null)

    useEffect(() => {
        if (open) {
            setAvatarFile(null)
            setRemoveAvatar(false)
            if (initialValues) {
                form.setFieldsValue({ username: initialValues.username, email: initialValues.email, role: initialValues.role, password: "" })
                setAvatarPreview(imageUrl(initialValues.avatar))
                setPreviewUser(initialValues)
            } else {
                form.resetFields()
                setAvatarPreview(null)
                setPreviewUser(null)
            }
        }
    }, [open, initialValues, form])

    const handleAvatarChange = (file) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"]
        if (!allowed.includes(file.type)) { message.error("Only JPG, PNG, WebP allowed."); return false }
        if (file.size > 5 * 1024 * 1024) { message.error("Max 5MB."); return false }
        const reader = new FileReader()
        reader.onload = (e) => setAvatarPreview(e.target.result)
        reader.readAsDataURL(file)
        setAvatarFile(file)
        setRemoveAvatar(false)
        return false
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            if (mode === "edit" && !values.password) delete values.password
            if (avatarFile) values.avatar = avatarFile
            if (removeAvatar) values.remove_avatar = "true"
            onSubmit(values)
        } catch (err) {
            console.log(err)
        }
    }

    const labelStyle = { fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#3b4453" }
    const inputStyle = { borderRadius: 10, borderColor: "#d5d9e2" }

    // current username from form for initials fallback
    const currentUsername = Form.useWatch("username", form)

    return (
        <Modal open={open} onCancel={onClose} footer={null} width={500} centered destroyOnClose
            styles={{ content: { borderRadius: 16, padding: 0, overflow: "hidden" }, mask: { backdropFilter: "blur(4px)" } }}>

            {/* Header */}
            <div style={{ padding: "1.75rem 2rem 1.25rem", background: "linear-gradient(135deg,#072649,#0054a0)", borderRadius: "16px 16px 0 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                    <div>
                        <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "white", fontSize: "1.05rem", margin: 0 }}>
                            {mode === "add" ? "Add New User" : "Edit User"}
                        </h3>
                        <p style={{ color: "#93c5fd", fontSize: "0.75rem", marginTop: 2, marginBottom: 0 }}>
                            {mode === "add" ? "Admin-created accounts are pre-verified." : "Leave password blank to keep unchanged."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div style={{ padding: "1.5rem 2rem 2rem" }}>
                <Form layout="vertical" form={form} requiredMark={false} size="large">

                    {/* Avatar upload */}
                    <Form.Item label={<span style={labelStyle}>Profile Photo <span style={{ color: "#8795aa", fontWeight: 400 }}>(optional)</span></span>}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {avatarPreview && !removeAvatar ? (
                                <img src={avatarPreview} alt="preview"
                                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "1px solid #e0effe" }} />
                            ) : (
                                <Avatar user={{ username: currentUsername || previewUser?.username }} size={48} fontSize="1.1rem" />
                            )}
                            <Upload beforeUpload={handleAvatarChange} showUploadList={false} accept=".jpg,.jpeg,.png,.webp">
                                <Button style={{ borderRadius: 9, borderColor: "#d5d9e2", fontFamily: "DM Sans,sans-serif", fontSize: "0.875rem" }}>
                                    {avatarPreview && !removeAvatar ? "Change photo" : "Upload photo"}
                                </Button>
                            </Upload>
                            {(avatarPreview) && !removeAvatar && (
                                <button type="button"
                                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); setRemoveAvatar(mode === "edit") }}
                                    style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: "0.825rem", fontFamily: "DM Sans,sans-serif", padding: 0 }}>
                                    Remove
                                </button>
                            )}
                        </div>
                        <p style={{ color: "#8795aa", fontSize: "0.75rem", margin: "6px 0 0" }}>JPG, PNG, WebP · max 5MB</p>
                    </Form.Item>

                    <Form.Item name="username" label={<span style={labelStyle}>Username</span>}
                        rules={[{ required: true, message: "Username is required" }, { min: 3, message: "At least 3 characters" }]}>
                        <Input placeholder="e.g. railuser" style={inputStyle} />
                    </Form.Item>

                    <Form.Item name="email" label={<span style={labelStyle}>Email address</span>}
                        rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}>
                        <Input placeholder="user@example.com" style={inputStyle} />
                    </Form.Item>

                    <Form.Item name="role" label={<span style={labelStyle}>Role</span>}
                        rules={[{ required: true, message: "Role is required" }]}>
                        <Select placeholder="Select role" style={{ borderRadius: 10 }}>
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="password"
                        label={<span style={labelStyle}>Password{mode === "edit" && <span style={{ color: "#8795aa", fontWeight: 400 }}> (blank = keep current)</span>}</span>}
                        rules={mode === "add"
                            ? [{ required: true, message: "Password is required" }, { min: 6, message: "At least 6 characters" }]
                            : [{ min: 6, message: "At least 6 characters if changing" }]}>
                        <Input.Password placeholder="••••••••" style={inputStyle} />
                    </Form.Item>

                    <div style={{ display: "flex", gap: 12, marginTop: "0.5rem" }}>
                        <Button onClick={onClose} block style={{ height: 44, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#677890", borderColor: "#d5d9e2" }}>Cancel</Button>
                        <Button onClick={handleOk} loading={loading} block
                            style={{ height: 44, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 600, border: "none", color: "white", background: "linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow: "0 4px 12px rgba(12,135,232,0.28)" }}>
                            {loading ? "Saving…" : mode === "add" ? "Create User" : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}