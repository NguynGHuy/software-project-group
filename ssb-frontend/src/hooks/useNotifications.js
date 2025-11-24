"use client"

import { useState, useEffect, useCallback } from "react"
import io from "socket.io-client"
import { notificationService } from "../services/api"

const SOCKET_URL = "http://localhost:5000"

const useNotifications = (userId, userType) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Initialize socket connection
  useEffect(() => {
    if (!userId || !userType) return

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    })

    newSocket.on("connect", () => {
      console.log("[v0] Notification socket connected")
      setConnected(true)

      // Register user for targeted notifications
      newSocket.emit("user:register", { userId, userType })
    })

    newSocket.on("disconnect", () => {
      console.log("[v0] Notification socket disconnected")
      setConnected(false)
    })

    // Listen for new notifications
    newSocket.on("notification:new", (notification) => {
      console.log("[v0] New notification received:", notification)
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification(notification.tieuDe, {
          body: notification.noiDung,
          icon: "/icon.png",
        })
      }
    })

    // Listen for new messages
    newSocket.on("message:new", (message) => {
      console.log("[v0] New message received:", message)
      // Create notification for new message
      const notification = {
        idThongBao: Date.now(),
        tieuDe: "Tin nhắn mới",
        noiDung: message.noiDung,
        loai: "INFO",
        daDoc: false,
        thoiGian: new Date().toISOString(),
      }
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    // Listen for new incidents (admin only)
    if (userType === "QUAN_LY") {
      newSocket.on("incident:new", (incident) => {
        console.log("[v0] New incident received:", incident)
        const notification = {
          idThongBao: Date.now(),
          tieuDe: `Báo cáo sự cố: ${incident.loaiSuCo}`,
          noiDung: incident.moTa,
          loai: "ALERT",
          daDoc: false,
          thoiGian: new Date().toISOString(),
        }
        setNotifications((prev) => [notification, ...prev])
        setUnreadCount((prev) => prev + 1)
      })
    }

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [userId, userType])

  // Load initial notifications
  useEffect(() => {
    if (userId && userType) {
      loadNotifications()
      loadUnreadCount()
    }
  }, [userId, userType])

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getByUser(userId, userType)
      if (res.data.success) {
        setNotifications(res.data.data)
      }
    } catch (error) {
      console.error("Failed to load notifications:", error)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount(userId, userType)
      if (res.data.success) {
        setUnreadCount(res.data.data.count)
      }
    } catch (error) {
      console.error("Failed to load unread count:", error)
    }
  }

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications((prev) => prev.map((n) => (n.idThongBao === notificationId ? { ...n, daDoc: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(userId, userType)
      setNotifications((prev) => prev.map((n) => ({ ...n, daDoc: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }, [userId, userType])

  const sendNotification = useCallback(
    (notification) => {
      if (socket && connected) {
        socket.emit("notification:send", notification)
      }
    },
    [socket, connected],
  )

  const sendMessage = useCallback(
    (message) => {
      if (socket && connected) {
        socket.emit("message:send", message)
      }
    },
    [socket, connected],
  )

  const reportIncident = useCallback(
    (incident) => {
      if (socket && connected) {
        socket.emit("incident:report", incident)
      }
    },
    [socket, connected],
  )

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return {
    connected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendNotification,
    sendMessage,
    reportIncident,
    refreshNotifications: loadNotifications,
  }
}

export default useNotifications
