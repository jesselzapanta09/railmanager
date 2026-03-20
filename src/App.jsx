import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider, App as AntApp } from "antd"
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

// Layouts
import HomeLayout  from "./layouts/HomeLayout.jsx"
import AuthLayout  from "./layouts/AuthLayout.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx"
import UserLayout  from "./layouts/UserLayout.jsx"

// pages/home
import Home from "./Home.jsx"

// pages/auth
import Login          from "./pages/auth/Login.jsx"
import Register       from "./pages/auth/Register.jsx"
import VerifyEmail    from "./pages/auth/VerifyEmail.jsx"
import ForgotPassword from "./pages/auth/ForgotPassword.jsx"
import ResetPassword  from "./pages/auth/ResetPassword.jsx"
import EditProfile    from "./pages/auth/EditProfile.jsx"

// pages/admin
import AdminDashboard  from "./pages/admin/AdminDashboard.jsx"
import ManageTrains    from "./pages/admin/ManageTrains.jsx"
import UserManagement  from "./pages/admin/UserManagement.jsx"

// pages/user
import UserDashboard from "./pages/user/UserDashboard.jsx"

const antTheme = {
  token: {
    colorPrimary:     "#0054a0",
    colorLink:        "#006ac6",
    borderRadius:     10,
    fontFamily:       "'DM Sans', sans-serif",
    colorBgContainer: "#ffffff",
  },
  components: {
    Button: { borderRadius: 10 },
    Input:  { borderRadius: 10 },
    Table:  { borderRadius: 12 },
  },
}

function RoleRedirect() {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />
}

export default function App() {
  return (
    <ConfigProvider theme={antTheme}>
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <Routes>

              {/* Public */}
              <Route element={<HomeLayout />}>
                <Route path="/"         element={<Home />} />
                <Route path="/features" element={<Home />} />
              </Route>

              {/* Auth pages */}
              <Route element={<AuthLayout />}>
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Standalone email/password pages */}
              <Route path="/verify-email"    element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password"  element={<ResetPassword />} />

              {/* Smart redirect */}
              <Route path="/dashboard" element={
                <ProtectedRoute><RoleRedirect /></ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin/dashboard"    element={<AdminDashboard />} />
                <Route path="/admin/trains"       element={<ManageTrains />} />
                <Route path="/admin/users"        element={<UserManagement />} />
                <Route path="/admin/edit-profile" element={<EditProfile />} />
              </Route>

              {/* User routes */}
              <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
                <Route path="/user/dashboard"    element={<UserDashboard />} />
                <Route path="/user/edit-profile" element={<EditProfile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}