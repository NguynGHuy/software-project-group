import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

const MapUpdater = ({ buses }) => {
  const map = useMap();

  useEffect(() => {
    if (buses.length > 0 && buses[0].position) {
      map.setView(buses[0].position, map.getZoom());
    }
  }, [buses, map]);

  return null;
};

const MapComponent = ({ center = [10.762622, 106.660172], buses = [], realTimeLocations = {} }) => {
  const updatedBuses = buses.map(bus => {
    const rtLocation = realTimeLocations[bus.idXeBus || bus.idXe];
    if (rtLocation) {
      return {
        ...bus,
        position: [rtLocation.latitude, rtLocation.longitude],
        speed: rtLocation.speed,
        lastUpdate: rtLocation.timestamp
      };
    }
    return bus;
  });

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater buses={updatedBuses} />
      
      {updatedBuses.map((bus) => (
        <Marker
          key={bus.idXeBus || bus.idXe}
          position={bus.position || center}
          icon={busIcon}
        >
          <Popup>
            <strong>{bus.bienSo}</strong><br />
            Tuyến: {bus.tenTuyen || 'N/A'}<br />
            Trạng thái: {bus.trangThai}<br />
            {bus.speed !== undefined && `Tốc độ: ${bus.speed} km/h`}<br />
            {bus.lastUpdate && `Cập nhật: ${new Date(bus.lastUpdate).toLocaleTimeString()}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent
