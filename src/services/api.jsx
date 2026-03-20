import axios from "axios"

const BASE = "http://localhost:5000"

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url    = err.config?.url || ""

    // Only auto-logout on 401 for protected routes.
    // Never auto-logout for auth endpoints — wrong password on login or
    // change-password should show an error, not kick the user out.
    const isAuthEndpoint = url.includes("/login") ||
                           url.includes("/register") ||
                           url.includes("/change-password") ||
                           url.includes("/forgot-password") ||
                           url.includes("/reset-password") ||
                           url.includes("/verify-email")

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)

// ── Helpers ─────────────────────────────────────────────────────
// Returns full URL for a stored image path like /uploads/trains/x.jpg
export const imageUrl = (imgPath) =>
  imgPath ? `${BASE}${imgPath}` : null

// ── Auth ─────────────────────────────────────────────────────────
export const register           = (data)  => api.post("/register", data)
export const login              = (data)  => api.post("/login", data)
export const logout             = ()      => api.post("/logout")
export const verifyEmail        = (token) => api.get(`/verify-email?token=${token}`)
export const resendVerification = (email) => api.post("/resend-verification", { email })
export const forgotPassword     = (email) => api.post("/forgot-password", { email })
export const resetPassword      = (data)  => api.post("/reset-password", data)
export const changePassword     = (data)  => api.post("/change-password", data)
export const updateProfile = (data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v) })
  return api.post("/update-profile", form, { headers: { "Content-Type": "multipart/form-data" } })
}

// ── Trains ───────────────────────────────────────────────────────
export const getTrains    = ()          => api.get("/train")
export const getTrainById = (id)        => api.get(`/train/${id}`)

// Image-aware: uses FormData so multer can parse the file
export const createTrain = (data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v) })
  return api.post("/train", form, { headers: { "Content-Type": "multipart/form-data" } })
}
export const updateTrain = (id, data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v) })
  return api.put(`/train/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } })
}
export const deleteTrain = (id) => api.delete(`/train/${id}`)

export default api

// ── User management (admin only) ─────────────────────────────────
export const getUsers    = ()          => api.get("/users")
export const getUserById = (id)        => api.get(`/users/${id}`)
export const createUser = (data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v) })
  return api.post("/users", form, { headers: { "Content-Type": "multipart/form-data" } })
}
export const updateUser = (id, data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v) })
  return api.put(`/users/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } })
}
export const deleteUser  = (id)        => api.delete(`/users/${id}`)