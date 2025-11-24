// Calculate distance between two GPS coordinates using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

function toRad(degrees) {
  return degrees * (Math.PI / 180)
}

// Calculate ETA based on distance and average speed
export function calculateETA(distanceKm, averageSpeedKmh = 30) {
  const hours = distanceKm / averageSpeedKmh
  const minutes = Math.round(hours * 60)

  if (minutes < 1) {
    return "Sắp đến"
  } else if (minutes < 60) {
    return `${minutes} phút`
  } else {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}m`
  }
}

// Check if bus is close to pickup point (within threshold km)
export function isNearby(busLat, busLon, pickupLat, pickupLon, thresholdKm = 1) {
  const distance = calculateDistance(busLat, busLon, pickupLat, pickupLon)
  return distance <= thresholdKm
}

// Check if bus is late compared to scheduled time
export function isLate(scheduledTime, currentTime, thresholdMinutes = 10) {
  if (!scheduledTime) return false

  const scheduled = new Date(`2000-01-01 ${scheduledTime}`)
  const current = currentTime instanceof Date ? currentTime : new Date(currentTime)
  const currentTimeOnly = new Date(`2000-01-01 ${current.getHours()}:${current.getMinutes()}`)

  const diffMs = currentTimeOnly - scheduled
  const diffMinutes = diffMs / (1000 * 60)

  return diffMinutes > thresholdMinutes
}

// Format distance for display
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}
