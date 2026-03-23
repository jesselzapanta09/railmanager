import React, { useEffect, useState } from "react"
import { Modal, Form, Input, InputNumber, Button, Upload, App } from "antd"
import { Train, UploadCloud } from "lucide-react"
import { imageUrl } from "../services/api"

export default function TrainModal({ open, onClose, onSubmit, initialValues, loading, mode }) {
    const { message } = App.useApp()
    const [form] = Form.useForm()
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(null)

    // Reusable styles
    const labelClass = "font-medium text-gray-700"
    const inputClass = "rounded-xl border border-gray-300 w-full"
    const btnBase = "h-11 rounded-xl font-medium"
    const btnCancel = `${btnBase} text-gray-600 border border-gray-300`
    const btnPrimary = `${btnBase} font-semibold text-white bg-gradient-to-tr from-blue-800 to-blue-600 shadow-md`

    useEffect(() => {
        if (open) {
            setImageFile(null)
            if (initialValues) {
                form.setFieldsValue({
                    train_name: initialValues.train_name,
                    price: parseFloat(initialValues.price),
                    route: initialValues.route,
                })
                setPreview(imageUrl(initialValues.image))
            } else {
                form.resetFields()
                setPreview(null)
            }
        }
    }, [open, initialValues, form])

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            onSubmit({ ...values, image: imageFile || undefined })
        } catch (err) {
            console.log(err)
        }
    }

    const handleImageChange = (file) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"]
        if (!allowed.includes(file.type)) {
            message.error("Only JPG, PNG, WebP allowed.")
            return false
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error("Max 5MB.")
            return false
        }
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(file)
        setImageFile(file)
        return false
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
                    <Train className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">
                        {mode === "add" ? "Add New Train" : "Edit Train"}
                    </h3>
                    <p className="text-blue-200 text-sm mt-1">
                        {mode === "add"
                            ? "Fill in the details to register a new train."
                            : "Update the train information below."}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="p-6 mt-6">
                <Form layout="vertical" form={form} requiredMark={false} size="large">
                    {/* Train Name */}
                    <Form.Item
                        name="train_name"
                        label={<span className={labelClass}>Train Name</span>}
                        rules={[{ required: true, message: "Train name is required" }]}
                    >
                        <Input placeholder="e.g. LRT Line 1" className={inputClass} />
                    </Form.Item>

                    {/* Price */}
                    <Form.Item
                        name="price"
                        label={<span className={labelClass}>Ticket Price (₱)</span>}
                        rules={[
                            { required: true, message: "Price is required" },
                            { type: "number", min: 0.01, message: "Must be greater than 0" },
                        ]}
                    >
                        <InputNumber
                            min={0.01}
                            step={0.5}
                            precision={2}
                            prefix="₱"
                            placeholder="e.g. 30.00"
                            style={{ width: "100%" }}
                            className={inputClass}
                        />
                    </Form.Item>

                    {/* Route */}
                    <Form.Item
                        name="route"
                        label={<span className={labelClass}>Route</span>}
                        rules={[{ required: true, message: "Route is required" }]}
                    >
                        <Input placeholder="e.g. Baclaran - Roosevelt" className={inputClass} />
                    </Form.Item>

                    {/* Image Upload */}
                    <Form.Item
                        label={
                            <span className={labelClass}>
                                Train Image <span className="text-gray-400 font-normal">(optional)</span>
                            </span>
                        }
                    >
                        <Upload.Dragger
                            name="image"
                            accept=".jpg,.jpeg,.png,.webp"
                            showUploadList={false}
                            beforeUpload={handleImageChange}
                            className="rounded-lg"
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="w-full max-h-40 object-cover rounded-lg block"
                                    />
                                    <div
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                                    >
                                        <span className="text-white font-medium text-sm">Click to change</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 text-gray-500 flex flex-col items-center">
                                    <UploadCloud className="text-blue-600 mb-2" size={20} />
                                    <p className="font-medium text-sm m-0">Click or drag image here</p>
                                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP · max 5MB</p>
                                </div>
                            )}
                        </Upload.Dragger>
                        {preview && (
                            <button
                                type="button"
                                onClick={() => { setPreview(null); setImageFile(null) }}
                                className="mt-2 text-red-600 text-xs font-medium underline hover:no-underline"
                            >
                                Remove image
                            </button>
                        )}
                    </Form.Item>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        <Button onClick={onClose} block className={btnCancel}>Cancel</Button>
                        <Button onClick={handleOk} loading={loading} type="primary" block className={btnPrimary}>
                            {loading ? "Saving…" : mode === "add" ? "Add Train" : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}