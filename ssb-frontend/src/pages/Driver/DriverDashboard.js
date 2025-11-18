import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PersonIcon from "@mui/icons-material/Person";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.2} alignItems="center">
    {React.cloneElement(icon, { sx: { fontSize: 18, color: "#aaa" } })}
    <Typography sx={{ fontSize: 13, color: "#ccc" }}>{label}: {value}</Typography>
  </Stack>
);

export default function DriverDashboard() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [isLoading, setIsLoading] = useState(false);

  const trip = {
    title: "Chuyến đón sáng",
    route: "Cầu Giấy → Trường DEF",
    start: "07:00",
    nextStop: "3 / 5",
    remaining: "3 HS",
    status: "Đang thực hiện",
    pickedStudents: 12,
    totalStudents: 15,
  };

  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn A", class: "5A", time: "07:15", address: "123 Cầu Giấy", status: "Đã đón" },
    { id: 2, name: "Trần Thị B", class: "4B", time: "07:22", address: "456 Láng Hạ", status: "Chưa đón" },
    { id: 3, name: "Trần Thị B", class: "4B", time: "07:22", address: "456 Láng Hạ", status: "Chưa đón" },
    { id: 4, name: "Trần Thị B", class: "4B", time: "07:22", address: "456 Láng Hạ", status: "Chưa đón" },
    { id: 5, name: "Trần Thị B", class: "4B", time: "07:22", address: "456 Láng Hạ", status: "Chưa đón" },
    { id: 6, name: "Phạm Minh C", class: "3C", time: "07:30", address: "78 Kim Mã", status: "Vắng mặt" },
  ]);

  const updateStatus = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSnackbar({ open: true, message: `Đã cập nhật: ${newStatus}`, severity: newStatus === "Đã đón" ? "success" : "warning" });
  };
  
  const handleStartTrip = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSnackbar({ open: true, message: 'Đã bắt đầu chuyến đi!', severity: 'success' });
    }, 1500);
  };
  const handleEndTrip = () => setSnackbar({ open: true, message: 'Đã kết thúc chuyến đi.', severity: 'info' });
  const handleReportIssue = () => setSnackbar({ open: true, message: 'Đã gửi báo cáo sự cố!', severity: 'warning' });
  const handleMessages = () => setSnackbar({ open: true, message: 'Đang mở tin nhắn...', severity: 'info' });
  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ color: "white", pb: 4, pt: 4 }}>
      {/* Greeting */}
      <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Xin chào, Nguyễn Văn A</Typography>
      <Typography sx={{ fontSize: 13, color: "#aaa", mb: 2 }}>Thứ Ba, 30/09/2025</Typography>

      {/* Thông tin */}
      <Card sx={{ background: "#1A1A1A", borderRadius: 3, p: 2, mb: 3 }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Chip
                label={trip.status}
                sx={{
                  background: "#fff",
                  color: "#121212",
                  fontSize: 12,
                  fontWeight: 'bold',
                  mb: 1,
                  px: 1, 
                  py: 0.5, 
                  borderRadius: '6px' 
                }}
              />
              <Typography sx={{ fontSize: 20, color: "#aaa", fontWeight: 700, mt: 0.5 }}>{trip.title}</Typography>
              <Typography sx={{ fontSize: 13, color: "#aaa" }}>{trip.route}</Typography>
            </Box>

            <Box textAlign="right">
              <Typography sx={{ fontSize: 24, color: "#aaa", fontWeight: 700, lineHeight: 1 }}>
                {trip.pickedStudents}/{trip.totalStudents}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#aaa" }}>Học sinh</Typography>
            </Box>
          </Stack>

          {/* Hàng thông tin chi tiết (Bắt đầu, Điểm tiếp, Còn lại) */}
          <Grid container spacing={8} mt={1}>
            <Grid item xs={4}>
              <InfoRow icon={<AccessTimeIcon />} label="Bắt đầu" value={trip.start} />
            </Grid>
            <Grid item xs={4}>
              <InfoRow icon={<PinDropIcon />} label="Điểm tiếp" value={trip.nextStop} />
            </Grid>
            <Grid item xs={4}>
              <InfoRow
                icon={<PersonIcon />}
                label="Còn lại"
                value={trip.totalStudents - trip.pickedStudents}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Nút chức năng */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={6} width={268}>
          <LoadingButton
            fullWidth
            variant="contained"
            loading={isLoading}
            onClick={handleStartTrip}
            sx={{
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
            {isLoading ? (
              <CircularProgress size={24} sx={{ mb: 0.5, color: '#ffff' }} />
            ) : (
              <PlayArrowOutlinedIcon sx={{ mb: 0.5 }} />
            )}
            Bắt đầu chuyến
          </LoadingButton>
        </Grid>
        <Grid item xs={6} width={268}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleEndTrip}
            sx={{
              height: 100,
              borderColor: 'grey.700',
              color: 'white',
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
        <Grid item xs={6} width={268}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleReportIssue}
            sx={{
              height: 100,
              backgroundColor: '#D32F2F',
              color: 'white',
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
        <Grid item xs={6} width={268}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleMessages}
            sx={{
              height: 100,
              borderColor: 'grey.700',
              color: 'white',
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

      {/* (Danh sách học sinh) */}
      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2, mt:2}}>Danh sách học sinh</Typography>

      <Stack spacing={2}>
        {students.map(s => (
          <Card key={s.id} sx={{ background: "#1A1A1A", borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#ffff" }}>{s.name}</Typography>
                <Chip
                  label={s.status}
                  size="small"
                  icon={s.status === "Đã đón" }
                  sx={{
                    background:
                      s.status === "Đã đón" ? "#2E7D32" : s.status === "Vắng mặt" ? "#B71C1C" : "#555",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Typography sx={{ fontSize: 13, color: "#aaa", mb: 1 }}>Lớp {s.class}</Typography>
              <InfoRow icon={<PinDropIcon />} label="Địa chỉ" value={s.address} />
              <InfoRow icon={<AccessTimeIcon />} label="Giờ đón" value={s.time} />

              {/* CĂN CHỈNH NÚT HỌC SINH */}
              <Stack direction="row" spacing={1} mt={2}>
                {s.status === "Chưa đón" ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        background: "#2E7D32", 
                        textTransform: 'none', 
                        fontWeight: 'bold',
                        '&:hover': { background: '#1B5E20' }
                      }}
                      onClick={() => updateStatus(s.id, "Đã đón")}
                    >
                      Đã đón
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        background: "#D32F2F", 
                        color: "#ffff",
                        textTransform: 'none', 
                        fontWeight: 'bold',
                        '&:hover': { background: '#8a1111ff' }
                      }}
                      onClick={() => updateStatus(s.id, "Vắng mặt")}
                    >
                      Vắng mặt
                    </Button>
                  </>
                ) : (
                  <Button 
                    fullWidth 
                    disabled 
                    sx={{ 
                      backgroundColor: s.status === 'Đã đón' ? '#2E7D32' : '#B71C1C',
                      textTransform: 'none', 
                      fontWeight: 'bold',
                      '&.Mui-disabled': { color: '#fff', opacity: 0.7 }
                    }}
                  >
                    {s.status}
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}