import React, { useState } from "react"
import { Form, Input, Button, App, Tabs, Upload } from "antd"
import { useNavigate } from "react-router-dom"
import { updateProfile, changePassword, imageUrl } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import Avatar from "../../components/Avatar"
import { Upload as UploadIcon } from "lucide-react"

export default function EditProfile() {
  const { message } = App.useApp()
  const { user, updateUser, logoutUser } = useAuth()
  const navigate = useNavigate()

  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [profileForm] = Form.useForm()
  const [passForm] = Form.useForm()

  // Avatar state
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(imageUrl(user?.avatar))
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
    return false
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

  // Tailwind reusable style constants
  const labelClass = "font-medium text-gray-700"
  const inputClass = "rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
  const btnPrimary = "h-12 rounded-xl font-semibold text-white bg-gradient-to-tr from-blue-800 to-blue-600 shadow-md hover:from-blue-700 hover:to-blue-500"
  const btnSecondary = "h-12 rounded-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">Edit Profile</h1>
        <p className="text-gray-500">Manage your account information and security.</p>
      </div>

      {/* Avatar Card */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow mb-6">
        {avatarPreview && !removeAvatar ? (
          <img src={avatarPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 flex-shrink-0" />
        ) : (
          <Avatar user={removeAvatar ? { username: user?.username } : user} size={64} fontSize="1.4rem" />
        )}
        <div>
          <div className="font-bold text-lg text-blue-900">{user?.username}</div>
          <div className="text-gray-500 text-sm mt-0.5">{user?.email}</div>
          <div className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-mono font-semibold ${user?.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
            {user?.role?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow overflow-hidden">
        <Tabs
          defaultActiveKey="profile"
          className="p-6"
          items={[
            {
              key: "profile",
              label: <span className="font-medium">Profile Info</span>,
              children: (
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileSave}
                  initialValues={{ username: user?.username || "", email: user?.email || "" }}
                  requiredMark={false}
                  size="large"
                  className="space-y-4"
                >
                  {/* Avatar Upload */}
                  <Form.Item label={<span className={labelClass}>Profile Photo</span>}>
                    <div className="flex items-center gap-3">
                      <Upload beforeUpload={handleAvatarChange} showUploadList={false} accept=".jpg,.jpeg,.png,.webp">
                        <Button icon={<UploadIcon size={16} />} className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                          Change Photo
                        </Button>
                      </Upload>
                      {(avatarPreview || user?.avatar) && !removeAvatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}
                      {avatarPreview && !removeAvatar && (
                        <img src={avatarPreview} alt="preview" className="w-12 h-12 rounded-full object-cover border border-blue-100" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · max 5MB</p>
                  </Form.Item>

                  <Form.Item
                    name="username"
                    label={<span className={labelClass}>Username</span>}
                    rules={[{ required: true, message: "Username is required" }, { min: 3, message: "At least 3 characters" }]}
                  >
                    <Input placeholder="e.g. railadmin" className={inputClass} />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<span className={labelClass}>Email address</span>}
                    rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
                  >
                    <Input placeholder="you@example.com" className={inputClass} />
                  </Form.Item>

                  <div className="flex gap-3">
                    <Button onClick={() => navigate(dashPath)} className={btnSecondary} block>
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={profileLoading} className={btnPrimary} block>
                      {profileLoading ? "Saving…" : "Save Changes"}
                    </Button>
                  </div>
                </Form>
              ),
            },
            {
              key: "password",
              label: <span className="font-medium">Password</span>,
              children: (
                <Form
                  form={passForm}
                  layout="vertical"
                  onFinish={handlePasswordSave}
                  requiredMark={false}
                  size="large"
                  className="space-y-4"
                >
                  <Form.Item
                    name="currentPassword"
                    label={<span className={labelClass}>Current password</span>}
                    rules={[{ required: true, message: "Current password is required" }]}
                  >
                    <Input.Password placeholder="••••••••" className={inputClass} />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label={<span className={labelClass}>New password</span>}
                    rules={[{ required: true, message: "New password is required" }, { min: 6, message: "At least 6 characters" }]}
                  >
                    <Input.Password placeholder="••••••••" className={inputClass} />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label={<span className={labelClass}>Confirm new password</span>}
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "Please confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) return Promise.resolve()
                          return Promise.reject(new Error("Passwords do not match"))
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="••••••••" className={inputClass} />
                  </Form.Item>

                  <div className="flex gap-3 mt-2">
                    <Button onClick={() => passForm.resetFields()} className={btnSecondary} block>
                      Clear
                    </Button>
                    <Button type="primary" htmlType="submit" loading={passLoading} className={btnPrimary} block>
                      {passLoading ? "Updating…" : "Update Password"}
                    </Button>
                  </div>
                </Form>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}