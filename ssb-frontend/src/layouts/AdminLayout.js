import React from 'react';

import { Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"

const AdminLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header user={user} onLogout={logout} />
        <main style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
