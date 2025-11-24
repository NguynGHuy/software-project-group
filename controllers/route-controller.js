import Route from "../models/route-model.js"
import Stop from "../models/stop-model.js"
import Student from "../models/student-model.js"

function normalizeTimeStr(t) {
  if (!t) return null
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t.trim())
  if (!m) return null
  const hh = String(Number.parseInt(m[1], 10)).padStart(2, "0")
  const mm = String(Number.parseInt(m[2], 10)).padStart(2, "0")
  const ss = String(m[3] ? Number.parseInt(m[3], 10) : 0).padStart(2, "0")
  return `${hh}:${mm}:${ss}`
}

export const getAllRoutes = async (req, res) => {
  try {
    console.log("[v0] Getting all routes...")
    const data = await Route.getAll()
    console.log("[v0] Routes fetched successfully:", data.length, "routes")
    res.json({ success: true, data })
  } catch (err) {
    console.error("[v0] Error getting routes:", err)
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const getRouteById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const route = await Route.getById(id)
    if (!route) return res.status(404).json({ success: false, message: "Không tìm thấy tuyến xe" })
    res.json({ success: true, data: route })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const getRouteDetails = async (req, res) => {
  try {
    console.log("[v0] Getting route details for:", req.params.id)
    const routeId = Number.parseInt(req.params.id)

    // Get route info
    const route = await Route.getById(routeId)
    if (!route) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tuyến đường" })
    }

    // Get stops with student count
    const stops = await Stop.getByRoute(routeId)

    // Get students on this route
    const students = await Student.getByRoute(routeId)

    // Create polyline from stops (ordered by thuTu)
    const polyline = stops.map((stop) => [stop.viDo, stop.kinhDo])

    // Find school stop (idDiemDung = 0)
    const school = stops.find((s) => s.idDiemDung === 0)

    res.json({
      success: true,
      data: {
        route,
        stops: stops.filter((s) => s.idDiemDung !== 0), // Exclude school from stops list
        students,
        polyline,
        school,
      },
    })
  } catch (error) {
    console.error("[v0] Error getting route details:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createRoute = async (req, res) => {
  const { tenTuyen, gioBatDau, gioKetThuc } = req.body || {}
  if (!tenTuyen || !gioBatDau || !gioKetThuc)
    return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" })

  const gioBatDauStr = normalizeTimeStr(gioBatDau)
  const gioKetThucStr = normalizeTimeStr(gioKetThuc)
  if (!gioBatDauStr || !gioKetThucStr) return res.status(400).json({ success: false, message: "Giờ không hợp lệ" })

  try {
    const newRoute = await Route.create({ ...req.body, gioBatDauStr, gioKetThucStr })
    res.status(201).json({ success: true, message: "Thêm tuyến thành công!", data: newRoute })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const updateRoute = async (req, res) => {
  const id = Number.parseInt(req.params.id)
  const { gioBatDau, gioKetThuc, idXeBus } = req.body || {}

  console.log("[v0] Controller received update request:", { id, body: req.body })

  let gioBatDauStr = null,
    gioKetThucStr = null

  if (gioBatDau) {
    gioBatDauStr = normalizeTimeStr(gioBatDau)
    if (!gioBatDauStr) return res.status(400).json({ success: false, message: "Giờ bắt đầu không hợp lệ" })
  }
  if (gioKetThuc) {
    gioKetThucStr = normalizeTimeStr(gioKetThuc)
    if (!gioKetThucStr) return res.status(400).json({ success: false, message: "Giờ kết thúc không hợp lệ" })
  }

  let sanitizedIdXeBus = idXeBus
  if (idXeBus === "undefined" || idXeBus === "" || idXeBus === undefined) {
    sanitizedIdXeBus = null
    console.log("[v0] Converting idXeBus to null")
  }

  try {
    const updatedRoute = await Route.update(id, {
      ...req.body,
      idXeBus: sanitizedIdXeBus,
      gioBatDauStr,
      gioKetThucStr,
    })
    console.log("[v0] Route updated successfully:", updatedRoute)
    res.json({ success: true, message: "Cập nhật thành công!", data: updatedRoute })
  } catch (err) {
    console.error("[v0] Update error:", err)
    if (err.message === "Không tìm thấy tuyến xe") return res.status(404).json({ success: false, message: err.message })
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const deleteRoute = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const deletedRoute = await Route.remove(id)
    res.json({ success: true, message: "Xóa thành công!", data: deletedRoute })
  } catch (err) {
    if (err.message.includes("đang được sử dụng")) return res.status(400).json({ success: false, message: err.message })
    if (err.message === "Tuyến xe không tồn tại") return res.status(404).json({ success: false, message: err.message })
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}
