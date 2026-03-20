import React, { useState } from "react"
import { Form, Input, Button, App } from "antd"
import { useNavigate } from "react-router-dom"
import { changePassword } from "../../services/api"
import { useAuth } from "../../context/AuthContext"

export default function ChangePassword() {
  const { message }   = App.useApp()
  const { user }      = useAuth()
  const navigate      = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form]                = Form.useForm()

  const onFinish = async ({ currentPassword, newPassword }) => {
    setLoading(true)
    try {
      const res = await changePassword({ currentPassword, newPassword })
      message.success(res.data.message)
      form.resetFields()
      // Redirect to their dashboard after 1.5s
      setTimeout(() => navigate(user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"), 1500)
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to change password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding:"2rem", maxWidth:520, margin:"0 auto" }}>
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"#0a3c6d", marginBottom:"0.25rem" }}>
          Change Password
        </h1>
        <p style={{ color:"#677890", margin:0 }}>Update your account password below.</p>
      </div>

      <div style={{ background:"white", borderRadius:16, padding:"2rem", border:"1px solid #eceef2", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>

        {/* User info row */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:10, background:"#f0f7ff", border:"1px solid #e0effe", marginBottom:"1.75rem" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#0054a0,#0c87e8)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontFamily:"Sora,sans-serif", fontWeight:700, flexShrink:0 }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily:"DM Sans,sans-serif", fontWeight:600, color:"#0a3c6d" }}>{user?.username}</div>
            <div style={{ color:"#677890", fontSize:"0.8rem" }}>{user?.email}</div>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item name="currentPassword"
            label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Current password</span>}
            rules={[{ required:true, message:"Current password is required" }]}>
            <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
          </Form.Item>

          <Form.Item name="newPassword"
            label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>New password</span>}
            rules={[{ required:true, message:"New password is required" }, { min:6, message:"At least 6 characters" }]}>
            <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
          </Form.Item>

          <Form.Item name="confirmPassword"
            label={<span style={{ fontFamily:"DM Sans,sans-serif", fontWeight:500, color:"#3b4453" }}>Confirm new password</span>}
            dependencies={["newPassword"]}
            rules={[
              { required:true, message:"Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) return Promise.resolve()
                  return Promise.reject(new Error("Passwords do not match"))
                }
              })
            ]}>
            <Input.Password placeholder="••••••••" style={{ borderRadius:10, borderColor:"#d5d9e2" }} />
          </Form.Item>

          <div style={{ display:"flex", gap:12, marginTop:"0.5rem" }}>
            <Button onClick={() => navigate(-1)} block
              style={{ height:46, borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:500, borderColor:"#d5d9e2", color:"#677890" }}>
              Cancel
            </Button>
            <Button htmlType="submit" loading={loading} block
              style={{ height:46, borderRadius:10, fontFamily:"DM Sans,sans-serif", fontWeight:600, border:"none", color:"white", background:"linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow:"0 4px 12px rgba(12,135,232,0.30)" }}>
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}