"use client"

import { useEffect, useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// --- 1. Fix Icon Leaflet ---
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// --- 2. Định nghĩa Icon ---
const busIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%233b82f6' d='M18 6h-2V2H8v4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 4h-4V8h4v2zm-4 4h4v2h-4v-2z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const busNearbyIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%2322c55e' d='M18 6h-2V2H8v4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 4h-4V8h4v2zm-4 4h4v2h-4v-2z'/%3E%3C/svg%3E",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
})

const pickupIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath fill='%23ef4444' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})

const schoolIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%23f97316' d='M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const studentIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%2360a5fa' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

// --- 3. Components hỗ trợ ---

// Fix lỗi render xám bản đồ
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
       map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Auto fit bounds
function MapBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      // Thêm animate: false để tránh conflict render
      map.fitBounds(bounds, { padding: [50, 50], animate: false }) 
    }
  }, [map, bounds])
  return null
}

export default function MapComponent({
  center = [10.88, 106.59],
  zoom = 13,
  buses = [],
  pickupPoint = null,
  routePolyline = null,
  stops = [],
  students = [],
  school = null,
  showRoute = false,
  height = "100%",
}) {
  const [mapBounds, setMapBounds] = useState(null)

  // SỬA LỖI Ở ĐÂY: Dùng JSON.stringify trong dependency array
  // Điều này đảm bảo useEffect chỉ chạy khi DỮ LIỆU thay đổi, chứ không chạy khi object reference thay đổi
  useEffect(() => {
    const allPoints = []

    if (routePolyline && routePolyline.length > 0) {
      allPoints.push(...routePolyline)
    }

    buses.forEach((bus) => {
      if (bus.position && bus.position.length === 2) {
        allPoints.push(bus.position)
      }
    })

    if (pickupPoint) {
      allPoints.push([pickupPoint.lat, pickupPoint.lng])
    }

    stops.forEach((stop) => {
      if (stop.viDo && stop.kinhDo) {
        allPoints.push([stop.viDo, stop.kinhDo])
      }
    })

    students.forEach((student) => {
      if (student.viDo && student.kinhDo) {
        allPoints.push([student.viDo, student.kinhDo])
      }
    })

    if (school) {
      allPoints.push([school.viDo, school.kinhDo])
    }

    // Chỉ update state nếu có điểm mới
    if (allPoints.length > 0) {
      setMapBounds(allPoints)
    }
  }, [
    // QUAN TRỌNG: So sánh chuỗi JSON để tránh vòng lặp vô tận
    JSON.stringify(routePolyline), 
    JSON.stringify(buses), 
    JSON.stringify(pickupPoint), 
    JSON.stringify(stops), 
    JSON.stringify(students), 
    JSON.stringify(school)
  ])

  return (
    <div style={{ 
        display: 'flex', 
        flex: 1, 
        flexDirection: 'column',
        width: "100%", 
        height: height === "100%" ? "100%" : height,
        minHeight: "100%",
        position: "relative" 
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ flex: 1, width: "100%", height: "100%", zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <MapResizer /> 
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapBounds && <MapBounds bounds={mapBounds} />}

        {showRoute && routePolyline && routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.7, dashArray: "10, 10" }}
          />
        )}

        {school && (
          <Marker position={[school.viDo, school.kinhDo]} icon={schoolIcon}>
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong style={{ fontSize: "1rem", color: "#f97316" }}>{school.tenDiemDung}</strong>
                <br />
                <span style={{ fontSize: "0.85rem" }}>{school.diaChi}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {stops.map((stop, idx) => (
          <Marker key={`stop-${idx}`} position={[stop.viDo, stop.kinhDo]} icon={pickupIcon}>
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong style={{ fontSize: "0.95rem" }}>{stop.tenDiemDung}</strong>
                <br />
                <span style={{ fontSize: "0.8rem", color: "#666" }}>{stop.diaChi}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {students.map((student, idx) => (
          <Marker key={`student-${idx}`} position={[student.viDo, student.kinhDo]} icon={studentIcon}>
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong style={{ fontSize: "0.95rem", color: "#3b82f6" }}>{student.hoTen}</strong>
                <br />
                <span style={{ fontSize: "0.85rem" }}>Lớp: {student.lop}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {buses.map((bus, idx) => (
          <Marker key={`bus-${idx}`} position={bus.position} icon={bus.status === "nearby" ? busNearbyIcon : busIcon}>
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong style={{ fontSize: "1rem", color: bus.status === "nearby" ? "#22c55e" : "#3b82f6" }}>
                  {bus.bienSo}
                </strong>
                <br />
                <span style={{ fontSize: "0.85rem" }}>
                  Trạng thái: {bus.status === "nearby" ? "Sắp đến" : "Đang di chuyển"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {pickupPoint && !showRoute && (
          <Marker position={[pickupPoint.lat, pickupPoint.lng]} icon={pickupIcon}>
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong style={{ fontSize: "0.95rem", color: "#ef4444" }}>Điểm đón</strong>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}