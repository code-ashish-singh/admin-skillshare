import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => { if (err.response?.status === 401) window.location.href = "/login"; return Promise.reject(err); }
);

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAnalytics: () => api.get("/admin/analytics"),

  getUsers: (params) => api.get("/admin/users", { params }),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getProviders: (params) => api.get("/admin/providers", { params }),
  approveProvider: (id) => api.put(`/admin/providers/${id}/approve`),
  rejectProvider: (id) => api.put(`/admin/providers/${id}/reject`),
  blockProvider: (id) => api.put(`/admin/providers/${id}/block`),
  deleteProvider: (id) => api.delete(`/admin/providers/${id}`),

  getBookings: (params) => api.get("/admin/bookings", { params }),

  getReviews: (params) => api.get("/admin/reviews", { params }),
  toggleReview: (id) => api.put(`/admin/reviews/${id}/toggle`),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),

  getBlogs: (params) => api.get("/blogs", { params }),
  createBlog: (data) => api.post("/blogs", data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),

  getReports: (params) => api.get("/reports", { params }),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

export default api;
