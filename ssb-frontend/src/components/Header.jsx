import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../context/AuthContext'

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'QUAN_LY': return 'Quản lý'
      case 'TAI_XE': return 'Tài xế'
      case 'PHU_HUYNH': return 'Phụ huynh'
      default: return ''
    }
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#000000',
        borderBottom: '1px solid #2a2a2a',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Smart School Bus System
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              {(user?.hoTen || user?.tenDangNhap)?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {user?.hoTen || user?.tenDangNhap}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getRoleDisplay()}
              </Typography>
            </Box>
          </Box>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 2,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
