import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Divider,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { busService, parentService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MapComponent from '../components/MapComponent'

const ParentDashboard = () => {
  const { user } = useAuth()
  const [bus, setBus] = useState(null)
  const [children, setChildren] = useState([])

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      if (user && user.detail?.idPhuHuynh) {
        const childrenRes = await parentService.getStudents(user.detail.idPhuHuynh)
        const childrenData = Array.isArray(childrenRes.data) 
          ? childrenRes.data 
          : (childrenRes.data?.data || [])
        setChildren(childrenData)
      }

      // Mock bus data for demo
      const busRes = await busService.getAll()
      const busData = Array.isArray(busRes.data) ? busRes.data : (busRes.data?.data || [])
      if (busData.length > 0) {
        setBus(busData[0])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Theo Dõi Xe Đưa Đón
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Xe bus đang trên đường đến điểm đón. Dự kiến còn 5 phút.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vị Trí Xe Bus Realtime
              </Typography>
              <MapComponent buses={bus ? [bus] : []} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông Tin Con Em ({children.length})
              </Typography>
              {children.length === 0 ? (
                <Typography color="text.secondary">
                  Chưa có thông tin học sinh được liên kết
                </Typography>
              ) : (
                children.map((child, index) => (
                  <Box key={child.idHocSinh}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Họ tên" secondary={child.hoTen} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Lớp" secondary={child.lop} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Trạng thái"
                          secondary={
                            <Chip
                              label={child.trangThai === 1 ? 'Hoạt động' : 'Nghỉ học'}
                              color={child.trangThai === 1 ? 'success' : 'default'}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông Tin Xe Bus
              </Typography>
              {bus ? (
                <List>
                  <ListItem>
                    <ListItemText primary="Biển số" secondary={bus.bienSo} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Khoảng cách"
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon fontSize="small" />
                          Cách 2.5 km
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Thời gian đến"
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon fontSize="small" />
                          Khoảng 5 phút
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography color="text.secondary">
                  Chưa có thông tin xe bus
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ParentDashboard
