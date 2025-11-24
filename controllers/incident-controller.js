import Incident from "../models/incident-model.js"
import Notification from "../models/notification-model.js"

export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.getAll()
    res.json({ success: true, data: incidents })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const getDriverIncidents = async (req, res) => {
  try {
    const driverId = Number.parseInt(req.params.driverId)
    const incidents = await Incident.getByDriver(driverId)
    res.json({ success: true, data: incidents })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const createIncident = async (req, res) => {
  try {
    const { idTaiXe, idLichTrinh, loaiSuCo, moTa, viTri, kinhDo, viDo } = req.body

    if (!idTaiXe || !loaiSuCo || !moTa) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" })
    }

    const incident = await Incident.create(req.body)

    await Notification.create({
      tieuDe: `Báo cáo sự cố: ${loaiSuCo}`,
      noiDung: moTa,
      loai: "ALERT",
      nguoiGui: idTaiXe,
      loaiNguoiGui: "TAI_XE",
      nguoiNhan: 1, // Admin ID (you may need to adjust this)
      loaiNguoiNhan: "QUAN_LY",
      idLienQuan: incident.idBaoCao,
      loaiLienQuan: "BAOCAO_SUCO",
    })

    res.status(201).json({ success: true, message: "Báo cáo sự cố thành công!", data: incident })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const updateIncidentStatus = async (req, res) => {
  try {
    const incidentId = Number.parseInt(req.params.id)
    const { trangThai, nguoiXuLy, ghiChu } = req.body

    if (!trangThai) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin trạng thái" })
    }

    const incident = await Incident.updateStatus(incidentId, { trangThai, nguoiXuLy, ghiChu })

    if (!incident) {
      return res.status(404).json({ success: false, message: "Không tìm thấy báo cáo sự cố" })
    }

    await Notification.create({
      tieuDe: `Cập nhật sự cố: ${trangThai}`,
      noiDung: ghiChu || `Sự cố đã được cập nhật trạng thái: ${trangThai}`,
      loai: "INFO",
      nguoiGui: nguoiXuLy,
      loaiNguoiGui: "QUAN_LY",
      nguoiNhan: incident.idTaiXe,
      loaiNguoiNhan: "TAI_XE",
      idLienQuan: incidentId,
      loaiLienQuan: "BAOCAO_SUCO",
    })

    res.json({ success: true, message: "Cập nhật trạng thái sự cố thành công!", data: incident })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const getIncidentById = async (req, res) => {
  try {
    const incidentId = Number.parseInt(req.params.id)
    const incident = await Incident.getById(incidentId)

    if (!incident) {
      return res.status(404).json({ success: false, message: "Không tìm thấy báo cáo sự cố" })
    }

    res.json({ success: true, data: incident })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}
