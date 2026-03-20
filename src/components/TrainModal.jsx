import React, { useEffect, useState } from "react"
import { Modal, Form, Input, InputNumber, Button, Upload, App } from "antd"
import { imageUrl } from "../services/api"

const TrainIcon = () => <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" /></svg>
const IconUpload = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" /></svg>

export default function TrainModal({ open, onClose, onSubmit, initialValues, loading, mode }) {
    const { message } = App.useApp()
    const [form] = Form.useForm()
    const [preview, setPreview] = useState(null)   // image preview URL
    const [imageFile, setImageFile] = useState(null)   // File object to upload

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    train_name: initialValues.train_name,
                    price: parseFloat(initialValues.price),
                    route: initialValues.route,
                })
                setPreview(imageUrl(initialValues.image))
                setImageFile(null)
            } else {
                form.resetFields()
                setPreview(null)
                setImageFile(null)
            }
        }
    }, [open, initialValues, form])

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            // Pass image file through so the parent can include it in FormData
            onSubmit({ ...values, image: imageFile || undefined })
        } catch (err) {
            console.log(err);
        }
    }

    const beforeUpload = (file) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"]
        if (!allowed.includes(file.type)) {
            message.error("Only JPG, PNG, or WebP images are allowed.")
            return Upload.LIST_IGNORE
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error("Image must be smaller than 5MB.")
            return Upload.LIST_IGNORE
        }
        // Preview locally
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(file)
        setImageFile(file)
        return false  // prevent auto-upload
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
            destroyOnClose
            styles={{
                content: { borderRadius: 16, padding: 0, overflow: "hidden" },
                mask: { backdropFilter: "blur(4px)" },
            }}
        >
            {/* Header */}
            <div style={{ padding: "1.75rem 2rem 1.25rem", background: "linear-gradient(135deg,#072649,#0054a0)", borderRadius: "16px 16px 0 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <TrainIcon />
                    </div>
                    <div>
                        <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "white", fontSize: "1.05rem", margin: 0 }}>
                            {mode === "add" ? "Add New Train" : "Edit Train"}
                        </h3>
                        <p style={{ color: "#93c5fd", fontSize: "0.75rem", marginTop: 2, marginBottom: 0 }}>
                            {mode === "add" ? "Fill in the details to register a new train." : "Update the train information below."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div style={{ padding: "1.5rem 2rem 2rem" }}>
                <Form layout="vertical" form={form} requiredMark={false} size="large">

                    <Form.Item
                        name="train_name"
                        label={<span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#3b4453" }}>Train Name</span>}
                        rules={[{ required: true, message: "Train name is required" }]}
                    >
                        <Input placeholder="e.g. LRT Line 1" style={{ borderRadius: 10, borderColor: "#d5d9e2" }} />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label={<span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#3b4453" }}>Ticket Price (₱)</span>}
                        rules={[
                            { required: true, message: "Price is required" },
                            { type: "number", min: 0.01, message: "Must be greater than 0" },
                        ]}
                    >
                        <InputNumber
                            placeholder="e.g. 30.00" min={0.01} step={0.50} precision={2} prefix="₱"
                            style={{ width: "100%", borderRadius: 10, borderColor: "#d5d9e2" }} />
                    </Form.Item>

                    <Form.Item
                        name="route"
                        label={<span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#3b4453" }}>Route</span>}
                        rules={[{ required: true, message: "Route is required" }]}
                    >
                        <Input placeholder="e.g. Baclaran - Roosevelt" style={{ borderRadius: 10, borderColor: "#d5d9e2" }} />
                    </Form.Item>

                    {/* Image upload */}
                    <Form.Item label={<span style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#3b4453" }}>Train Image <span style={{ color: "#8795aa", fontWeight: 400 }}>(optional)</span></span>}>
                        <Upload.Dragger
                            name="image"
                            accept=".jpg,.jpeg,.png,.webp"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            style={{ borderRadius: 10 }}
                        >
                            {preview ? (
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={preview} alt="preview"
                                        style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, display: "block" }}
                                    />
                                    <div style={{
                                        position: "absolute", inset: 0, borderRadius: 8,
                                        background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center",
                                        justifyContent: "center", opacity: 0, transition: "opacity 0.2s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                                        onMouseLeave={e => e.currentTarget.style.opacity = "0"}>
                                        <span style={{ color: "white", fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>
                                            Click to change
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: "1.5rem 0", color: "#677890" }}>
                                    <div style={{ color: "#0054a0", marginBottom: 8 }}><IconUpload /></div>
                                    <p style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 500, margin: 0, fontSize: "0.9rem" }}>
                                        Click or drag image here
                                    </p>
                                    <p style={{ color: "#8795aa", fontSize: "0.78rem", marginTop: 4, marginBottom: 0 }}>
                                        JPG, PNG, WebP · max 5MB
                                    </p>
                                </div>
                            )}
                        </Upload.Dragger>
                        {preview && (
                            <button
                                type="button"
                                onClick={() => { setPreview(null); setImageFile(null) }}
                                style={{ marginTop: 6, background: "none", border: "none", color: "#e74c3c", fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem", cursor: "pointer", padding: 0 }}>
                                Remove image
                            </button>
                        )}
                    </Form.Item>

                    <div style={{ display: "flex", gap: 12, marginTop: "0.5rem" }}>
                        <Button onClick={onClose} block
                            style={{ height: 44, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 500, color: "#677890", borderColor: "#d5d9e2" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleOk} loading={loading} block
                            style={{ height: 44, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontWeight: 600, border: "none", color: "white", background: "linear-gradient(135deg,#0054a0,#0c87e8)", boxShadow: "0 4px 12px rgba(12,135,232,0.28)" }}>
                            {loading ? "Saving…" : mode === "add" ? "Add Train" : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}