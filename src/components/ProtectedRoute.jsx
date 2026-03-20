import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// role: "admin" | "user" | undefined (any authenticated)
const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth()

    if (loading) return null

    if (!isAuthenticated) return <Navigate to="/login" replace />

    // Role guard
    if (role === "admin" && !isAdmin) return <Navigate to="/user/dashboard" replace />
    if (role === "user" && isAdmin) return <Navigate to="/admin/dashboard" replace />

    return children
}

export default ProtectedRoute