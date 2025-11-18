import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, Box, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import PersonIcon from '@mui/icons-material/Person'
import RouteIcon from '@mui/icons-material/Route'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ open }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const getMenuItems = () => {
    if (user?.role === 'QUAN_LY') {
      return [
        { text: 'Tổng quan', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Quản lý học sinh', icon: <PersonIcon />, path: '/admin/students' },
        { text: 'Quản lý tuyến đường', icon: <RouteIcon />, path: '/admin/routes' },
        { text: 'Quản lý lịch trình', icon: <ScheduleIcon />, path: '/admin/schedules' },
      ]
    } else if (user?.role === 'TAI_XE') {
      return [
        { text: 'Lịch làm việc', icon: <ScheduleIcon />, path: '/driver' },
        { text: 'Danh sách học sinh', icon: <PersonIcon />, path: '/driver/students' },
      ]
    } else if (user?.role === 'PHU_HUYNH') {
      return [
        { text: 'Theo dõi xe bus', icon: <DirectionsBusIcon />, path: '/parent' },
        { text: 'Thông tin con em', icon: <PersonIcon />, path: '/parent/info' },
      ]
    }
    return []
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          mt: 8,
          backgroundColor: '#000000',
          borderRight: '1px solid #2a2a2a',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #2a2a2a' }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
          MENU
        </Typography>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {getMenuItems().map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.3)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar
