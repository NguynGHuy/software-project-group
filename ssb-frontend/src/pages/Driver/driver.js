import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DriverPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Driver Dashboard</h2>
          <div className="text-sm text-gray-400">Thông tin chuyến & vị trí xe</div>
        </div>
        <div className="text-sm text-gray-300">Xe: 01 • Trạng thái: Đang chạy</div>
      </div>

      <div className="bg-[#141414] p-4 rounded-xl border border-[#202020]">
        <div className="h-80 rounded overflow-hidden">
          <MapContainer center={[10.762622, 106.660172]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[10.762622, 106.660172]}>
              <Popup>Xe buýt 01 - Đang dừng</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      <div className="bg-[#141414] p-4 rounded-xl border border-[#202020]">
        <h4 className="text-sm text-gray-300 mb-2">Chi tiết chuyến</h4>
        <p className="text-gray-300">Tuyến: B1 • Điểm đi: Trường A • Điểm đến: Trường B</p>
      </div>
    </div>
  );
}
