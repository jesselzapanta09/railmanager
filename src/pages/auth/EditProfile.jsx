import React, { useState } from "react"
import { Form, Input, Button, App, Tabs, Upload } from "antd"
import { useNavigate } from "react-router-dom"
import { updateProfile, changePassword, imageUrl } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import Avatar from "../../components/Avatar"

export default function EditProfile() {
  const { message } = App.useApp()
  const { user, updateUser, logoutUser } = useAuth()
  const navigate = useNavigate()

  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [profileForm] = Form.useForm()
  const [passForm] = Form.useForm()

  // Avatar state
  const [avatarFile, setAvatarFile] = useState(null)    // File to upload
  const [avatarPreview, setAvatarPreview] = useState(imageUrl(user?.avatar)) // preview URL
  const [removeAvatar, setRemoveAvatar] = useState(false)

  const handleAvatarChange = (file) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) { message.error("Only JPG, PNG, WebP allowed."); return false }
    if (file.size > 5 * 1024 * 1024) { message.error("Max 5MB."); return false }
    const reader = new FileReader()
    reader.onload = (e) => setAvatarPreview(e.target.result)
    reader.readAsDataURL(file)
    setAvatarFile(file)
    setRemoveAvatar(false)
    return false  // prevent auto-upload
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(true)
  }

  const handleProfileSave = async (values) => {
    setProfileLoading(true)
    try {
      const payload = { username: values.username, email: values.email }
      if (avatarFile) payload.avatar = avatarFile
      if (removeAvatar) payload.remove_avatar = "true"

      const res = await updateProfile(payload)

      if (res.data.emailChanged) {
        // Must re-verify new email — log them out
        message.warning(
          "Email changed! A verification link has been sent to your new address. You will be logged out now.",
          5
        )
        setTimeout(async () => {
          await logoutUser()
          navigate("/login")
        }, 5000)
      } else {
        updateUser(res.data.data)
        setAvatarFile(null)
        setRemoveAvatar(false)
        message.success("Profile updated successfully!")
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update profile.")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSave = async (values) => {
    setPassLoading(true)
    try {
      const res = await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      message.success(res.data.message)
      passForm.resetFields()
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to change password.")
    } finally {
      setPassLoading(false)
    }
  }

  const dashPath = user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
  const labelStyle = { fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#3b4453" }
  const inputStyle = { borderRadius: 10, borderColor: "#d5d9e2" }
  const btnPrimary = { height: 46, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 600, border: "none", color: "white", background: "linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow: "0 4px 12px rgba(12,135,232,0.28)" }
  const btnCancel = { height: 46, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 500, borderColor: "#d5d9e2", color: "#677890" }

  return (
    <div style={{ padding: "2rem", maxWidth: 580, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "#0a3c6d", marginBottom: "0.25rem" }}>Edit Profile</h1>
        <p style={{ color: "#677890", margin: 0 }}>Manage your account information and security.</p>
      </div>

      {/* Avatar card */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "1.25rem 1.5rem", borderRadius: 14, background: "white", border: "1px solid #eceef2", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "1.5rem" }}>
        <Avatar user={{ ...user, avatar: removeAvatar ? null : (avatarFile ? null : user?.avatar) }}
          size={64} fontSize="1.4rem"
          style={avatarPreview && !removeAvatar ? { display: "none" } : {}} />
        {avatarPreview && !removeAvatar && (
          <img src={avatarPreview} alt="preview"
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #e0effe" }} />
        )}
        <div>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0a3c6d" }}>{user?.username}</div>
          <div style={{ color: "#677890", fontSize: "0.875rem", marginTop: 2 }}>{user?.email}</div>
          <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 100, background: user?.role === "admin" ? "#e0effe" : "#d5f5e3", color: user?.role === "admin" ? "#0054a0" : "#1e8449", fontSize: "0.72rem", fontFamily: "JetBrains Mono,monospace", fontWeight: 600 }}>
            {user?.role?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceef2", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <Tabs defaultActiveKey="profile" style={{ padding: "0 1.5rem" }} items={[
          {
            key: "profile",
            label: <span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Profile Info</span>,
            children: (
              <div style={{ padding: "0 0 1.5rem" }}>
                <Form form={profileForm} layout="vertical" onFinish={handleProfileSave}
                  requiredMark={false} size="large"
                  initialValues={{ username: user?.username || "", email: user?.email || "" }}>

                  {/* Avatar upload */}
                  <Form.Item label={<span style={labelStyle}>Profile Photo</span>}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* mini preview */}
                      {avatarPreview && !removeAvatar ? (
                        <img src={avatarPreview} alt="preview"
                          style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "1px solid #e0effe" }} />
                      ) : (
                        <Avatar user={removeAvatar ? { username: user?.username } : user} size={48} fontSize="1.1rem" />
                      )}
                      <Upload beforeUpload={handleAvatarChange} showUploadList={false} accept=".jpg,.jpeg,.png,.webp">
                        <Button style={{ borderRadius: 9, borderColor: "#d5d9e2", fontFamily: "DM Sans,sans-serif", fontSize: "0.875rem" }}>
                          Change photo
                        </Button>
                      </Upload>
                      {(avatarPreview || user?.avatar) && !removeAvatar && (
                        <button type="button" onClick={handleRemoveAvatar}
                          style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: "0.825rem", fontFamily: "DM Sans,sans-serif", padding: 0 }}>
                          Remove
                        </button>
                      )}
                    </div>
                    <p style={{ color: "#8795aa", fontSize: "0.75rem", margin: "6px 0 0" }}>JPG, PNG, WebP · max 5MB</p>
                  </Form.Item>

                  <Form.Item name="username" label={<span style={labelStyle}>Username</span>}
                    rules={[{ required: true, message: "Username is required" }, { min: 3, message: "At least 3 characters" }]}>
                    <Input placeholder="e.g. railadmin" style={inputStyle} />
                  </Form.Item>

                  <Form.Item name="email" label={<span style={labelStyle}>Email address</span>}
                    rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}>
                    <Input placeholder="you@example.com" style={inputStyle} />
                  </Form.Item>

                  <div style={{ display: "flex", gap: 12 }}>
                    <Button onClick={() => navigate(dashPath)} style={btnCancel} block>Cancel</Button>
                    <Button htmlType="submit" loading={profileLoading} style={btnPrimary} block>
                      {profileLoading ? "Saving…" : "Save Changes"}
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
          {
            key: "password",
            label: <span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Password</span>,
            children: (
              <div style={{ padding: "0 0 1.5rem" }}>
                <Form form={passForm} layout="vertical" onFinish={handlePasswordSave} requiredMark={false} size="large">
                  <Form.Item name="currentPassword" label={<span style={labelStyle}>Current password</span>}
                    rules={[{ required: true, message: "Current password is required" }]}>
                    <Input.Password placeholder="••••••••" style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="newPassword" label={<span style={labelStyle}>New password</span>}
                    rules={[{ required: true, message: "New password is required" }, { min: 6, message: "At least 6 characters" }]}>
                    <Input.Password placeholder="••••••••" style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="confirmPassword" label={<span style={labelStyle}>Confirm new password</span>}
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "Please confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) return Promise.resolve()
                          return Promise.reject(new Error("Passwords do not match"))
                        },
                      }),
                    ]}>
                    <Input.Password placeholder="••••••••" style={inputStyle} />
                  </Form.Item>
                  <div style={{ display: "flex", gap: 12, marginTop: "0.5rem" }}>
                    <Button onClick={() => passForm.resetFields()} style={btnCancel} block>Clear</Button>
                    <Button htmlType="submit" loading={passLoading} style={btnPrimary} block>
                      {passLoading ? "Updating…" : "Update Password"}
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
        ]} />
      </div>
    </div>
  )
}