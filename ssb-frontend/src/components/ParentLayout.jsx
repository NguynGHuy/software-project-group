import { useState } from 'react'
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Badge, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  DirectionsBus as BusIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ParentLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifAnchor, setNotifAnchor] = useState(null)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const mockNotifications = [
    { id: 1, icon: 'check', text: 'Con của bạn đã đến trường', time: 'Hôm nay 07:45', type: 'success' },
    { id: 2, icon: 'check', text: 'Con của bạn đã lên xe', time: 'Hôm nay 07:15', type: 'success' },
    { id: 3, icon: 'warning', text: 'Xe buýt bị trễ', time: 'Hôm nay 06:50', type: 'warning' },
    { id: 4, icon: 'time', text: 'Lịch hẹn hôm nay', time: 'Hôm nay 06:00', type: 'info' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNotificationIcon = (icon, type) => {
    const iconProps = { fontSize: 18 }
    switch(icon) {
      case 'check':
        return <CheckCircleIcon sx={iconProps} />
      case 'warning':
        return <WarningIcon sx={iconProps} />
      case 'time':
        return <AccessTimeIcon sx={iconProps} />
      default:
        return <CheckCircleIcon sx={iconProps} />
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'var(--color-bg-primary)',
      pb: 2
    }}>
      <AppBar 
        position="fixed" 
        className="parent-header"
        sx={{ 
          bgcolor: 'var(--color-bg-primary)',
          boxShadow: 'none',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton 
            edge="start" 
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography className="parent-title">
            Parent App
          </Typography>
          
          <IconButton 
            color="inherit"
            onClick={(e) => setNotifAnchor(e.currentTarget)}
          >
            <Badge badgeContent={mockNotifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            width: 280,
            borderRight: '1px solid var(--color-border)'
          }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {user?.detail?.hoTen || 'Phụ huynh'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            {user?.detail?.soDienThoai || ''}
          </Typography>
        </Box>

        <List sx={{ p: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              sx={{ 
                borderRadius: 'var(--radius-md)',
                '&:hover': { bgcolor: 'var(--color-bg-card)' }
              }}
            >
              <ListItemIcon sx={{ color: 'var(--color-accent)', minWidth: 40 }}>
                <BusIcon />
              </ListItemIcon>
              <ListItemText primary="Theo dõi xe bus" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton 
              sx={{ 
                borderRadius: 'var(--radius-md)',
                '&:hover': { bgcolor: 'var(--color-bg-card)' }
              }}
            >
              <ListItemIcon sx={{ color: 'var(--color-accent)', minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Thông tin con em" />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ borderColor: 'var(--color-border)' }} />
        
        <List sx={{ p: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ 
                borderRadius: 'var(--radius-md)',
                '&:hover': { bgcolor: 'var(--color-bg-card)' }
              }}
            >
              <ListItemIcon sx={{ color: 'var(--color-danger)', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={() => setNotifAnchor(null)}
        PaperProps={{
          sx: {
            bgcolor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            mt: 1,
            maxWidth: 360,
            maxHeight: 400
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--color-border)' }}>
          <Typography sx={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
            Thông báo gần đây
          </Typography>
        </Box>

        {mockNotifications.map((notif) => (
          <MenuItem 
            key={notif.id}
            onClick={() => setNotifAnchor(null)}
            className="notification-item"
            sx={{ 
              py: 1.5,
              px: 2,
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <Box className={`notification-icon ${notif.type}`}>
              {getNotificationIcon(notif.icon, notif.type)}
            </Box>
            <Box className="notification-content">
              <Typography className="notification-text">
                {notif.text}
              </Typography>
              <Typography className="notification-time">
                {notif.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Content */}
      <Box sx={{ pt: 8, px: 0 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default ParentLayout
