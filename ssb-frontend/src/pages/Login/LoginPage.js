import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./LoginPage.css"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] Attempting login with:", { username, password })

    const result = await login(username, password)

    console.log("[v0] Login result:", result)

    setLoading(false)

    if (result.success) {
      const role = result.user.role
      console.log("[v0] Login successful, role:", role)

      if (role === "QUAN_LY") {
        navigate("/dashboard")
      } else if (role === "TAI_XE") {
        navigate("/driver")
      } else if (role === "PHU_HUYNH") {
        navigate("/parent")
      }
    } else {
      console.log("[v0] Login failed:", result.message)
      setError(result.message || "Đăng nhập thất bại")
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Hệ thống quản lý xe bus</h1>
        <h2 className="login-subtitle">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-info">
          <p>Tài khoản demo (username / password):</p>
          <ul>
            <li>Admin: admin / admin123</li>
            <li>Tài xế: driver1 / driver123</li>
            <li>Phụ huynh: parent1 / parent123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
