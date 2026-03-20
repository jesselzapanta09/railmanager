import React, { createContext, useContext, useState, useEffect } from "react"
import { logout as apiLogout } from "../services/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const loginUser = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    // Call this after a successful profile update to refresh user in state + localStorage
    const updateUser = (updatedData) => {
        const merged = { ...user, ...updatedData }
        setUser(merged)
        localStorage.setItem("user", JSON.stringify(merged))
    }

    const logoutUser = async () => {
        try { await apiLogout() } catch (err) { console.log(err) }
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            loginUser, logoutUser, updateUser,
            isAuthenticated: !!token,
            isAdmin: user?.role === "admin",
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)