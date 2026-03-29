import React, { useState, useEffect, useCallback } from "react"
import { Table, Button, Popconfirm, Input, Tag, Tooltip, App, Modal, Spin } from "antd"
import { Plus, Edit, Trash2, Search, Train, TrainFront } from "lucide-react"
import { getTrains, getTrainById, createTrain, updateTrain, deleteTrain, imageUrl } from "../../services/api"
import TrainModal from "../../components/TrainModal"

export default function ManageTrains() {
  const { message } = App.useApp()

  const [trains, setTrains] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [editRecord, setEditRecord] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // 🔥 View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewTrain, setViewTrain] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)

  const fetchTrains = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getTrains()
      setTrains(res.data.data)
      setFiltered(res.data.data)
    } catch {
      message.error("Failed to load trains.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTrains() }, [fetchTrains])

  useEffect(() => {
    if (!search.trim()) return setFiltered(trains)
    const q = search.toLowerCase()
    setFiltered(trains.filter(t =>
      t.train_name.toLowerCase().includes(q) ||
      t.route.toLowerCase().includes(q)
    ))
  }, [search, trains])

  const openAdd = () => {
    setModalMode("add")
    setEditRecord(null)
    setModalOpen(true)
  }

  const openEdit = r => {
    setModalMode("edit")
    setEditRecord(r)
    setModalOpen(true)
  }

  const openView = async (id) => {
    setViewModalOpen(true)
    setViewLoading(true)
    try {
      const res = await getTrainById(id)
      setViewTrain(res.data.data)
    } catch {
      message.error("Failed to load train details.")
      setViewModalOpen(false)
    } finally {
      setViewLoading(false)
    }
  }

  const handleSubmit = async values => {
    setSubmitLoading(true)
    try {
      if (modalMode === "add") {
        await createTrain(values)
        message.success("Train added successfully!")
      } else {
        await updateTrain(editRecord.id, values)
        message.success("Train updated successfully!")
      }
      setModalOpen(false)
      fetchTrains()
    } catch (err) {
      message.error(err.response?.data?.message || "Operation failed.")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteTrain(id)
      message.success("Train deleted.")
      fetchTrains()
    } catch {
      message.error("Delete failed.")
    }
  }

  // Stats
  const totalTrains = trains.length
  const prices = trains.map(t => parseFloat(t.price)).filter(p => !isNaN(p))
  const lowestPrice = prices.length ? Math.min(...prices) : 0
  const highestPrice = prices.length ? Math.max(...prices) : 0
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length) : 0

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
      title: "Train",
      dataIndex: "train_name",
      render: (name, record) => (
        <div className="flex items-center gap-3">
          {imageUrl(record.image) ? (
            <img
              src={imageUrl(record.image)}
              alt={name}
              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-900 shrink-0">
              <Train size={16} />
            </div>
          )}

          <span
            onClick={() => openView(record.id)}
            className="font-semibold text-gray-900 cursor-pointer hover:underline"
          >
            {name}
          </span>
        </div>
      )
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 130,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
      render: price => (
        <Tag color="green" variant="solid">
          ₱{parseFloat(price).toFixed(2)}
        </Tag>
      )
    },
    {
      title: "Route",
      dataIndex: "route",
      render: route => <span className="text-gray-500 text-sm">{route}</span>
    },
    {
      title: "Date Added",
      dataIndex: "created_at",
      width: 130,
      render: date => (
        <span className="text-gray-400 text-xs">
          {new Date(date).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
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
              title={`Delete ${record.train_name}?`}
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<Trash2 size={14} />} className="rounded-md" />
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ]

  const stats = [
    { label: "Total Trains", value: totalTrains, bg: "bg-blue-100", text: "text-blue-800" },
    { label: "Lowest Price", value: `₱${lowestPrice.toFixed(2)}`, bg: "bg-green-100", text: "text-green-700" },
    { label: "Highest Price", value: `₱${highestPrice.toFixed(2)}`, bg: "bg-purple-100", text: "text-purple-700" },
    { label: "Average Price", value: `₱${avgPrice.toFixed(2)}`, bg: "bg-yellow-100", text: "text-yellow-700" },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-7 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md mb-2 sm:mb-0">
            <Train className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-sora font-bold text-xl sm:text-2xl lg:text-3xl text-blue-900 truncate">
              Manage Trains
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1 sm:mt-2">
              Manage all train records. Use <span className="font-medium text-blue-600">Edit Train</span> to update them.
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
            <span className="font-sora font-semibold text-sm text-blue-900">All Trains</span>
            <span className="text-gray-400 text-xs ml-2">{filtered.length} record{filtered.length !== 1 && "s"}</span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search trains or routes…"
              prefix={<Search size={14} className="text-gray-400" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              className="w-64 rounded-lg"
            />
            <Button onClick={openAdd} type="primary" icon={<Plus size={14} />}>
              Add Train
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              showTotal: t => <span className="text-gray-400 text-sm">{t} trains total</span>
            }}
          />
        </div>

      </div>

      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
      >
        {viewLoading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : viewTrain && (
          <div className="space-y-4 pt-20">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 bg-linear-to-tr from-blue-900 to-blue-700 flex items-center gap-3 rounded-t-xl z-10">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <TrainFront className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  Train Details
                </h3>
              </div>
            </div>
            {/* Info */}
            <div className="flex items-center gap-3">
              {imageUrl(viewTrain.image) ? (
                <img
                  src={imageUrl(viewTrain.image)}
                  alt={viewTrain.train_name}
                  className="w-14 h-14 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Train size={20} className="text-blue-700" />
                </div>
              )}

              <div>
                <div className="font-semibold text-blue-900 text-lg">
                  {viewTrain.train_name}
                </div>
                <div className="text-gray-400 text-sm">
                  {viewTrain.route}
                </div>
              </div>
            </div>

            <Tag color="green" className="text-sm px-3 py-1">
              ₱{parseFloat(viewTrain.price).toFixed(2)}
            </Tag>

            <div className="text-sm text-gray-500">
              Added: {new Date(viewTrain.created_at).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
        )}
      </Modal>

      <TrainModal
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
