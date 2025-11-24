"use client"

import { useState } from "react"
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import useNotifications from "../hooks/useNotifications"

const NotificationBell = ({ userId, userType }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const { notifications, unreadCount, markAsRead, markAllAsRead, connected } = useNotifications(userId, userType)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "ALERT":
        return "#ef4444"
      case "WARNING":
        return "#f59e0b"
      case "SUCCESS":
        return "#22c55e"
      default:
        return "#3b82f6"
    }
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
        {!connected && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
            }}
          />
        )}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1,
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#f1f5f9" }}>
            Thông báo
            {!connected && (
              <Typography component="span" variant="caption" sx={{ ml: 1, color: "#ef4444" }}>
                (Offline)
              </Typography>
            )}
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead} sx={{ textTransform: "none", color: "#60a5fa" }}>
              Đánh dấu tất cả
            </Button>
          )}
        </Box>

        <List sx={{ p: 0, maxHeight: 400, overflow: "auto" }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Không có thông báo</Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <div key={notif.idThongBao}>
                <ListItem
                  button
                  onClick={() => handleMarkAsRead(notif.idThongBao)}
                  sx={{
                    backgroundColor: notif.daDoc ? "transparent" : "rgba(59, 130, 246, 0.1)",
                    "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                    borderLeft: `3px solid ${getNotificationColor(notif.loai)}`,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: notif.daDoc ? 400 : 600, color: "#f1f5f9" }}>
                        {notif.tieuDe}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: "#cbd5e1", mb: 0.5 }}>
                          {notif.noiDung}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {new Date(notif.thoiGian).toLocaleString("vi-VN")}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider sx={{ borderColor: "#334155" }} />
              </div>
            ))
          )}
        </List>
      </Popover>
    </>
  )
}

export default NotificationBell
