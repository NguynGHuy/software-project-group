import axios from "axios"

// Cấu hình base URL cho API backend
const API_BASE_URL = "http://localhost:5000/api"

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies/session
})

// ============ AUTHENTICATION APIs ============
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
}

// ============ BUS APIs ============
export const busAPI = {
  getAll: () => api.get("/buses"),
  getById: (id) => api.get(`/buses/${id}`),
  create: (data) => api.post("/buses", data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  delete: (id) => api.delete(`/buses/${id}`),
}

// ============ STUDENT APIs ============
export const studentAPI = {
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getParents: (id) => api.get(`/students/${id}/parents`),
}

// ============ DRIVER APIs ============
export const driverAPI = {
  getAll: () => api.get("/drivers"),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post("/drivers", data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
}

// ============ ROUTE APIs ============
export const routeAPI = {
  getAll: () => api.get("/routes"),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post("/routes", data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
}

// ============ SCHEDULE APIs ============
export const scheduleAPI = {
  getAll: () => api.get("/schedules"),
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post("/schedules", data),
  updateStatus: (id, status) => api.put(`/schedules/${id}/status`, { trangThai: status }),
  updateAttendance: (scheduleId, studentId, data) =>
    api.put(`/schedules/${scheduleId}/students/${studentId}/attendance`, data),
}

// ============ PARENT APIs ============
export const parentAPI = {
  getAll: () => api.get("/parents"),
  getById: (id) => api.get(`/parents/${id}`),
  create: (data) => api.post("/parents", data),
  update: (id, data) => api.put(`/parents/${id}`, data),
  delete: (id) => api.delete(`/parents/${id}`),
  getStudents: (id) => api.get(`/parents/${id}/students`),
  linkStudent: (parentId, studentId) => api.post(`/parents/${parentId}/students`, { idHocSinh: studentId }),
  unlinkStudent: (parentId, studentId) => api.delete(`/parents/${parentId}/students/${studentId}`),
}

// ============ STOP APIs ============
export const stopAPI = {
  getAll: () => api.get("/stops"),
  getById: (id) => api.get(`/stops/${id}`),
  create: (data) => api.post("/stops", data),
  update: (id, data) => api.put(`/stops/${id}`, data),
  delete: (id) => api.delete(`/stops/${id}`),
}

export default api
