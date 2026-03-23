import React, { useState, useEffect } from "react"
import { Skeleton, Card } from "antd"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { getTrains } from "../../services/api"
import { Train, DollarSign, MapPin, ChevronRight, User } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrains()
      .then(res => setTrains(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const total = trains.length
  const avgPrice = total ? (trains.reduce((s, t) => s + parseFloat(t.price), 0) / total).toFixed(2) : "0.00"
  const maxPrice = total ? Math.max(...trains.map(t => parseFloat(t.price))).toFixed(2) : "0.00"
  const routes = new Set(trains.map(t => t.route)).size

  const stats = [
    { label: "Total Trains", value: total, icon: <Train className="w-5 h-5" />, color: "text-blue-800", bg: "bg-blue-100" },
    { label: "Avg. Fare", value: `₱${avgPrice}`, icon: <DollarSign className="w-5 h-5" />, color: "text-green-700", bg: "bg-green-100" },
    { label: "Highest Fare", value: `₱${maxPrice}`, icon: <DollarSign className="w-5 h-5" />, color: "text-orange-700", bg: "bg-orange-100" },
    { label: "Unique Routes", value: routes, icon: <MapPin className="w-5 h-5" />, color: "text-purple-700", bg: "bg-purple-100" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
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
            Here's an overview of your train fleet
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s) => (
          <Card
            key={s.label}
            hoverable
            className="rounded-xl shadow-sm border-gray-200"
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3 ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-xl font-bold text-gray-900">
              {loading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : s.value}
            </div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-6">

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm border-gray-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link
              to="/admin/users"
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-linear-to-br from-blue-800 to-blue-600 text-white font-medium text-sm"
            >
              <span className="flex items-center gap-2"><User className="w-5 h-5" /> Manage Users</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/trains"
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-linear-to-br from-blue-800 to-blue-600 text-white font-medium text-sm"
            >
              <span className="flex items-center gap-2"><Train className="w-5 h-5" /> Manage Trains</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>

        {/* Recent Trains */}
        <Card className="rounded-xl shadow-sm border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-900">Recently Added</h2>
            <Link to="/admin/trains" className="text-blue-600 text-xs font-semibold">View all</Link>
          </div>
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : trains.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No trains yet.</p>
          ) : (
            trains.slice(0, 4).map((t) => (
              <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{t.train_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.route}</div>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md font-mono text-xs font-semibold">
                  ₱{parseFloat(t.price).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </Card>

      </div>
    </div>
  )
}