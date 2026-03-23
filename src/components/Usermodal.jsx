import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Select, Button, Upload, App } from "antd"
import { Plus, User2, UserPlus } from "lucide-react"
import { imageUrl } from "../services/api"
import Avatar from "./Avatar"

export default function UserModal({ open, onClose, onSubmit, initialValues, loading, mode }) {
    const { message } = App.useApp()
    const [form] = Form.useForm()
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [removeAvatar, setRemoveAvatar] = useState(false)
    const [previewUser, setPreviewUser] = useState(null)

    // Reusable styles
    const labelClass = "font-medium text-gray-700"
    const inputClass = "rounded-xl border border-gray-300 w-full"
    const btnBase = "h-11 rounded-xl font-medium"
    const btnCancel = `${btnBase} text-gray-600 border border-gray-300`

    // Watch username for avatar initials fallback
    const currentUsername = Form.useWatch("username", form)

    useEffect(() => {
        if (open) {
            setAvatarFile(null)
            setRemoveAvatar(false)
            if (initialValues) {
                form.setFieldsValue({
                    username: initialValues.username,
                    email: initialValues.email,
                    role: initialValues.role,
                    password: "",
                })
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

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
            className="rounded-xl overflow-hidden"
        >
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 bg-linear-to-tr from-blue-900 to-blue-700 flex items-center gap-3 rounded-t-xl z-10">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <User2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">
                        {mode === "add" ? "Add New User" : "Edit User"}
                    </h3>
                    <p className="text-blue-200 text-sm mt-1">
                        {mode === "add"
                            ? "Admin-created accounts are pre-verified."
                            : "Leave password blank to keep unchanged."}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="p-6 mt-6">
                <Form layout="vertical" form={form} requiredMark={false} size="large">
                    {/* Avatar Upload */}
                    <Form.Item
                        label={<span className={labelClass}>Profile Photo <span className="text-gray-400 font-normal">(optional)</span></span>}
                    >
                        <div className="flex items-center gap-3">
                            {avatarPreview && !removeAvatar ? (
                                <img
                                    src={avatarPreview}
                                    alt="preview"
                                    className="w-12 h-12 rounded-full object-cover border border-blue-100"
                                />
                            ) : (
                                <Avatar
                                    user={{ username: currentUsername || previewUser?.username }}
                                    size={48}
                                    fontSize="1.1rem"
                                />
                            )}
                            <Upload beforeUpload={handleAvatarChange} showUploadList={false} accept=".jpg,.jpeg,.png,.webp">
                                <Button className="rounded-lg border border-gray-300 font-sans text-sm">
                                    {avatarPreview && !removeAvatar ? "Change photo" : "Upload photo"}
                                </Button>
                            </Upload>
                            {avatarPreview && !removeAvatar && (
                                <button
                                    type="button"
                                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); setRemoveAvatar(mode === "edit") }}
                                    className="text-red-500 text-xs font-sans hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP · max 5MB</p>
                    </Form.Item>

                    {/* Username */}
                    <Form.Item
                        name="username"
                        label={<span className={labelClass}>Username</span>}
                        rules={[{ required: true, message: "Username is required" }, { min: 3, message: "At least 3 characters" }]}
                    >
                        <Input placeholder="e.g. railuser" className={inputClass} />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        label={<span className={labelClass}>Email address</span>}
                        rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
                    >
                        <Input placeholder="user@example.com" className={inputClass} />
                    </Form.Item>

                    {/* Role */}
                    <Form.Item
                        name="role"
                        label={<span className={labelClass}>Role</span>}
                        rules={[{ required: true, message: "Role is required" }]}
                    >
                        <Select placeholder="Select role" className="rounded-xl">
                            <Select value="user">User</Select>
                            <Select value="admin">Admin</Select>
                        </Select>
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        name="password"
                        label={
                            <span className={labelClass}>
                                Password
                                {mode === "edit" && <span className="text-gray-400 font-normal"> (blank = keep current)</span>}
                            </span>
                        }
                        rules={mode === "add"
                            ? [{ required: true, message: "Password is required" }, { min: 6, message: "At least 6 characters" }]
                            : [{ min: 6, message: "At least 6 characters if changing" }]}
                    >
                        <Input.Password placeholder="••••••••" className={inputClass} />
                    </Form.Item>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        <Button onClick={onClose} block className={btnCancel}>Cancel</Button>
                        <Button icon={<UserPlus />} onClick={handleOk} loading={loading} type='primary' block >
                            {loading ? "Saving…" : mode === "add" ? "Create User" : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}