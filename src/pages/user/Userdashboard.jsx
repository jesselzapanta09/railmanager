import React, { useState, useEffect, useCallback } from "react"
import { Table, Input, Tag, App } from "antd"
import { getTrains, imageUrl } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import { Search, Train, Info } from "lucide-react"

export default function UserDashboard() {
  const { user } = useAuth()
  const { message } = App.useApp()

  const [trains, setTrains] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

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
    if (!search.trim()) {
      setFiltered(trains)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      trains.filter(
        t =>
          t.train_name.toLowerCase().includes(q) ||
          t.route.toLowerCase().includes(q)
      )
    )
  }, [search, trains])

  const columns = [
    {
      title: <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">#</span>,
      dataIndex: "id",
      width: 60,
      render: id => (
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-mono font-semibold">
          #{id}
        </span>
      )
    },
    {
      title: <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Train</span>,
      dataIndex: "train_name",
      render: (name, record) => (
        <div className="flex items-center gap-2.5">
          {imageUrl(record.image) ? (
            <img
              src={imageUrl(record.image)}
              alt={name}
              className="w-9 h-9 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700">
              <Train size={16} />
            </div>
          )}
          <span className="font-semibold text-blue-900">{name}</span>
        </div>
      )
    },
    {
      title: <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Fare</span>,
      dataIndex: "price",
      width: 130,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
      render: price => (
        <Tag className="!bg-green-100 !text-green-700 !border-none !rounded-md font-mono font-semibold">
          ₱{parseFloat(price).toFixed(2)}
        </Tag>
      )
    },
    {
      title: <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Route</span>,
      dataIndex: "route",
      render: route => (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
          <span className="text-gray-600 text-sm">{route}</span>
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </div>
      )
    },
    {
      title: <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Date Added</span>,
      dataIndex: "created_at",
      width: 140,
      render: d => (
        <span className="text-gray-400 text-xs">
          {new Date(d).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
        </span>
      )
    }
  ]

  const total = trains.length
  const minPrice = total ? Math.min(...trains.map(t => parseFloat(t.price))).toFixed(2) : "0.00"
  const maxPrice = total ? Math.max(...trains.map(t => parseFloat(t.price))).toFixed(2) : "0.00"

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
       {/* Header Card */}
      <div className="mb-6 from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              {new Date().getHours() < 12 ? '☀️ Good Morning' :
                new Date().getHours() < 18 ? '🌤️ Good Afternoon' :
                  '🌙 Good Evening'}
            </p>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Welcome back, {user?.username}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {user?.role || 'Administrator'}
              </span>
              <span className="text-sm text-gray-500">
                • {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-blue-900">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current Time</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-gray-600">
            Here's an overview of the train fleet
          </p>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-yellow-50 border border-yellow-200 mb-6">
        <Info size={16} className="text-yellow-600" />
        <span className="text-sm text-yellow-800">
          You are viewing as a <strong>User</strong>. Train records are read-only.
          Contact an admin to make changes.
        </span>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          {total} Train{total !== 1 ? "s" : ""} Available
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          Min Fare: ₱{minPrice}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          Max Fare: ₱{maxPrice}
        </span>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-200">
          <div>
            <span className="font-semibold text-blue-900">Train Lines</span>
            <span className="ml-2 text-xs text-gray-400">
              {filtered.length} results
            </span>
          </div>

          <Input
            placeholder="Search by name or route…"
            prefix={<Search size={14} className="text-gray-400" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            className="w-full sm:w-64 rounded-xl"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: t => (
                <span className="text-gray-400 text-sm">
                  {t} trains total
                </span>
              ),
              className: "px-4 py-3"
            }}
            locale={{
              emptyText: (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <Train size={24} />
                  </div>
                  <p className="font-semibold text-gray-700">
                    No trains found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try a different search term.
                  </p>
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}