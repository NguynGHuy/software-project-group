import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Badge
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ICONS
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const InfoStat = ({ icon, title, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {React.cloneElement(icon, { sx: { color: 'grey.400', fontSize: 22 } })}
    <Box>
      <Typography variant="caption" color="grey.400" sx={{ lineHeight: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 'bold', color: '#fff', lineHeight: 1.2 }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

const DriverDashboard = () => {
  const tripData = {
    title: 'Chuyến đón sáng',
    route: 'Cầu Giấy - Trường DEF',
    status: 'Đang thực hiện',
    currentStudents: 12,
    totalStudents: 15,
    startTime: '07:00',
    currentStop: 3,
    totalStops: 5,
    remainingStudents: 3
  };

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Danh sách học sinh (có id để theo dõi trạng thái)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      class: 'Lớp 5A',
      address: '123 Cầu Giấy, Hà Nội',
      pickupTime: '07:15',
      status: 'Chưa đón'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      class: 'Lớp 4B',
      address: '456 Láng Hạ, Hà Nội',
      pickupTime: '07:25',
      status: 'Chưa đón'
    },
    {
      id: 3,
      name: 'Phạm Minh Tuấn',
      class: 'Lớp 3C',
      address: '78 Kim Mã, Hà Nội',
      pickupTime: '07:35',
      status: 'Chưa đón'
    },
    {
      id: 4,
      name: 'Phạm Minh Tuấn',
      class: 'Lớp 3C',
      address: '78 Kim Mã, Hà Nội',
      pickupTime: '07:35',
      status: 'Chưa đón'
    },
    {
      id: 5,
      name: 'Phạm Minh Tuấn',
      class: 'Lớp 3C',
      address: '78 Kim Mã, Hà Nội',
      pickupTime: '07:35',
      status: 'Chưa đón'
    },
    {
      id: 6,
      name: 'Phạm Minh Tuấn',
      class: 'Lớp 3C',
      address: '78 Kim Mã, Hà Nội',
      pickupTime: '07:35',
      status: 'Chưa đón'
    },
    {
      id: 7,
      name: 'Phạm Minh Tuấn',
      class: 'Lớp 3C',
      address: '78 Kim Mã, Hà Nội',
      pickupTime: '07:35',
      status: 'Chưa đón'
    },
    {
      id: 8,
      name: 'Phạm Minh Tuấn',
      class: 'Lớp 3C',
      address: '78 Kim Mã, Hà Nội',
      pickupTime: '07:35',
      status: 'Chưa đón'
    }
  ]);

  // Hàm đổi trạng thái khi bấm nút
  const handlePickupStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    setSnackbar({
      open: true,
      message: status === 'Đã đón' ? 'Đã đón học sinh!' : 'Đánh dấu vắng mặt!',
      severity: status === 'Đã đón' ? 'success' : 'warning'
    });
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStartTrip = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showNotification('Đã bắt đầu chuyến đi!', 'success');
    }, 1500);
  };
  const handleEndTrip = () => showNotification('Đã kết thúc chuyến đi.', 'info');
  const handleReportIssue = () => showNotification('Đã gửi báo cáo sự cố!', 'warning');
  const handleMessages = () => showNotification('Đang mở tin nhắn...', 'info');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#1a1a1a',
          color: '#fff',
          px: 3,
          py: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #222'
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>SSB Driver App</Typography>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Nội dung */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 4
        }}
      >
        {/* Lời chào */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 0.5 }}>
          Xin chào, Nguyễn Văn A
        </Typography>
        <Typography variant="body1" color="grey.400" sx={{ mb: 3 }}>
          Thứ Ba, 30 tháng 9, 2025
        </Typography>

        {/* Card chuyến đi */}
        <Card
          sx={{
            backgroundColor: '#1e1e1e',
            borderRadius: 3,
            mb: 3,
            width: '150%',
            minHeight: 220,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Chip
                  label={tripData.status}
                  size="small"
                  sx={{
                    mb: 1,
                    backgroundColor: '#333',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
                  {tripData.title}
                </Typography>
                <Typography variant="body1" color="grey.400">
                  {tripData.route}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                  {tripData.currentStudents}/{tripData.totalStudents}
                </Typography>
                <Typography variant="body2" color="grey.400">
                  Học sinh
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={5} justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <InfoStat icon={<AccessTimeIcon />} title="Bắt đầu" value={tripData.startTime} />
              <InfoStat icon={<PinDropIcon />} title="Điểm tiếp" value={`${tripData.currentStop}/${tripData.totalStops}`} />
              <InfoStat icon={<PeopleIcon />} title="Còn lại" value={`${tripData.remainingStudents} HS`} />
            </Stack>
          </CardContent>
        </Card>

        {/* Grid 2x2 nút bấm bằng nhau */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{
            width: '150%',
            minHeight: 220,
            textAlign: 'center',
            mb: 3
          }}
        >
          {/* Bắt đầu chuyến */}
          <Grid item xs={6} display="flex" justifyContent="center">
            <LoadingButton
              variant="contained"
              loading={isLoading}
              onClick={handleStartTrip}
              sx={{
                width: 405,
                height: 100,
                backgroundColor: '#fff',
                color: '#121212',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                flexDirection: 'column',
                '&:hover': { backgroundColor: '#e0e0e0' }
              }}
            >
              <PlayArrowOutlinedIcon sx={{ mb: 0.5 }} />
              Bắt đầu chuyến
            </LoadingButton>
          </Grid>

          {/* Kết thúc chuyến */}
          <Grid item xs={6} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={handleEndTrip}
              sx={{
                width: 405,
                height: 100,
                borderColor: 'grey.700',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                flexDirection: 'column'
              }}
            >
              <StopOutlinedIcon sx={{ mb: 0.5 }} />
              Kết thúc chuyến
            </Button>
          </Grid>

          {/* Báo sự cố */}
          <Grid item xs={6} display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleReportIssue}
              sx={{
                width: 405,
                height: 100,
                backgroundColor: '#D32F2F',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                flexDirection: 'column',
                '&:hover': { backgroundColor: '#C62828' }
              }}
            >
              <WarningAmberOutlinedIcon sx={{ mb: 0.5 }} />
              Báo sự cố
            </Button>
          </Grid>

          {/* Tin nhắn */}
          <Grid item xs={6} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={handleMessages}
              sx={{
                width: 405,
                height: 100,
                borderColor: 'grey.700',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                flexDirection: 'column'
              }}
            >
              <MessageOutlinedIcon sx={{ mb: 0.5 }} />
              Tin nhắn
            </Button>
          </Grid>
        </Grid>

        {/* Danh sách học sinh với nút hành động */}
        <Box sx={{ 
            width: '150%', 
            mt: 2,
            backgroundColor: 'transparent',
            border: '1px solid #424242', 
            borderRadius: 3,
            p: { xs: 2, sm: 3 } 
            }}>
          <Typography
            variant="h6" 
            align='center'
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              mb: 2,
              px: 2,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Danh sách học sinh hôm nay
          </Typography>

          {students.map((student) => (
            <Card
              key={student.id}
              sx={{
                height: '150%',
                backgroundColor: '#1e1e1e',
                borderRadius: 3,
                mb: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.25)'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      {student.name}
                      <Chip
                        label={student.status}
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor:
                            student.status === 'Đã đón'
                              ? '#2E7D32'
                              : student.status === 'Vắng mặt'
                              ? '#D32F2F'
                              : '#424242',
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                        icon={
                          student.status === 'Đã đón' ? (
                            <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <AccessTimeIcon sx={{ fontSize: 16  }} />
                          )
                        }
                      />
                    </Typography>

                    <Typography variant="body2" color="grey.400">
                      {student.class}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                      <PinDropIcon sx={{ color: 'grey.500', fontSize: 18 }} />
                      <Typography variant="body2" color="grey.400">
                        {student.address}
                      </Typography>
                    </Stack>
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    {student.pickupTime}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  {student.status === 'Chưa đón' ? (
                    <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: '#2E7D32',
                          color: '#fff',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#1B5E20' }
                        }}
                        onClick={() => handlePickupStatus(student.id, 'Đã đón')}
                      >
                        Đã đón
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                        backgroundColor: '#D32F2F',
                          color: '#ffffffff',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': {backgroundColor: '#d32f2faf' }
                        }}
                        onClick={() => handlePickupStatus(student.id, 'Vắng mặt')}
                      >
                        Vắng mặt
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      fullWidth
                      disabled
                      sx={{
                        backgroundColor:
                          student.status === 'Đã đón' ? '#2E7D32' : '#D32F2F',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&.Mui-disabled': { color: '#fff', opacity: 0.9 }
                      }}
                    >
                      {student.status}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DriverDashboard;
