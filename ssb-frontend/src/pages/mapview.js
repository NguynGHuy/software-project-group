import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon path (important trong CRA)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapViewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Map View</h2>
        <div className="text-sm text-gray-400">Bản đồ vị trí xe & tuyến</div>
      </div>

      <div className="bg-[#141414] p-4 rounded-xl border border-[#202020]">
        <div className="h-[70vh] rounded overflow-hidden">
          <MapContainer center={[10.762622, 106.660172]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[10.762622, 106.660172]}>
              <Popup>Xe buýt 01 • 07:35</Popup>
            </Marker>
            {/* Bạn có thể thêm route polylines, nhiều marker ở đây */}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
