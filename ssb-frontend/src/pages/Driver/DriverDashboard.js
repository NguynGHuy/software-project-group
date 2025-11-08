// import React, { useState } from 'react';
// import {
//   Container,
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Grid,
//   Stack,
//   Chip,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import { LoadingButton } from '@mui/lab';

// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import StopIcon from '@mui/icons-material/Stop';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import MessageIcon from '@mui/icons-material/Message';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import PinDropIcon from '@mui/icons-material/PinDrop';
// import PeopleIcon from '@mui/icons-material/People';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// const InfoStat = ({ icon, title, value }) => (
//   <Stack direction="row" spacing={1} alignItems="center">
//     {React.cloneElement(icon, { sx: { color: 'grey.400', fontSize: 22 } })}
//     <Box>
//       <Typography variant="caption" color="grey.400" sx={{ lineHeight: 1 }}>
//         {title}
//       </Typography>
//       <Typography
//         variant="body1"
//         sx={{ fontWeight: 'bold', color: '#fff', lineHeight: 1.2 }}
//       >
//         {value}
//       </Typography>
//     </Box>
//   </Stack>
// );

// const DriverDashboard = () => {
//   const tripData = {
//     title: 'Chuyến đón sáng',
//     route: 'Cầu Giấy - Trường DEF',
//     status: 'Đang thực hiện',
//     currentStudents: 12,
//     totalStudents: 15,
//     startTime: '07:00',
//     currentStop: 3,
//     totalStops: 5,
//     remainingStudents: 3
//   };

//   const [isLoading, setIsLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const showNotification = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = (_, reason) => {
//     if (reason === 'clickaway') return;
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleStartTrip = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       showNotification('Đã bắt đầu chuyến đi!', 'success');
//     }, 2000);
//   };

//   const handleEndTrip = () => {
//     showNotification('Đã kết thúc chuyến đi.', 'info');
//   };

//   const handleReportIssue = () => {
//     showNotification('Đã gửi báo cáo sự cố!', 'warning');
//   };

//   const handleMessages = () => {
//     showNotification('Đang mở tin nhắn...', 'info');
//   };// Danh sách học sinh (state)
// const [students, setStudents] = useState([
//   {
//     id: 1,
//     name: 'Nguyễn Văn An',
//     class: 'Lớp 5A',
//     address: '123 Cầu Giấy, Hà Nội',
//     pickupTime: '07:15',
//     status: 'Chưa đón'
//   },
//   {
//     id: 2,
//     name: 'Trần Thị Bình',
//     class: 'Lớp 4B',
//     address: '456 Láng Hạ, Hà Nội',
//     pickupTime: '07:25',
//     status: 'Chưa đón'
//   },
//   {
//     id: 3,
//     name: 'Phạm Minh Tuấn',
//     class: 'Lớp 3C',
//     address: '78 Kim Mã, Hà Nội',
//     pickupTime: '07:35',
//     status: 'Chưa đón'
//   }
// ]);

// // Hàm cập nhật trạng thái học sinh
// const handlePickupStatus = (id, newStatus) => {
//   setStudents(prev =>
//     prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
//   );
//   showNotification(
//     `Đã đánh dấu ${newStatus.toLowerCase()} cho học sinh ${
//       students.find(s => s.id === id)?.name
//     }`,
//     newStatus === 'Đã đón' ? 'success' : 'warning'
//   );
// };

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', py: 3 }}>
//       <Container maxWidth="sm">
//         {/* Header */}
//         <Typography
//           variant="h5"
//           sx={{ fontWeight: 'bold', color: '#fff', mb: 0.5 }}
//         >
//           Xin chào, Nguyễn Văn A
//         </Typography>
//         <Typography variant="body2" color="grey.400" sx={{ mb: 3 }}>
//           Thứ Ba, 30 tháng 9, 2025
//         </Typography>

//         {/* Trip Card */}
//         <Card
//           sx={{
//             backgroundColor: '#1e1e1e',
//             borderRadius: 3,
//             mb: 3,
//             color: '#fff'
//           }}
//         >
//           <CardContent sx={{ p: 3 }}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="flex-start"
//               mb={2}
//             >
//               <Box>
//                 <Chip
//                   label={tripData.status}
//                   size="small"
//                   sx={{
//                     mb: 1,
//                     backgroundColor: '#333',
//                     color: '#fff',
//                     fontWeight: 'bold'
//                   }}
//                 />
//                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                   {tripData.title}
//                 </Typography>
//                 <Typography variant="body2" color="grey.400">
//                   {tripData.route}
//                 </Typography>
//               </Box>
//               <Box sx={{ textAlign: 'right' }}>
//                 <Typography
//                   variant="h5"
//                   sx={{ fontWeight: 'bold', color: '#fff' }}
//                 >
//                   {tripData.currentStudents}/{tripData.totalStudents}
//                 </Typography>
//                 <Typography variant="caption" color="grey.400">
//                   Học sinh
//                 </Typography>
//               </Box>
//             </Stack>

//             <Grid container spacing={2}>
//               <Grid item xs={4}>
//                 <InfoStat
//                   icon={<AccessTimeIcon />}
//                   title="Bắt đầu"
//                   value={tripData.startTime}
//                 />
//               </Grid>
//               <Grid item xs={4}>
//                 <InfoStat
//                   icon={<PinDropIcon />}
//                   title="Điểm tiếp"
//                   value={`${tripData.currentStop}/${tripData.totalStops}`}
//                 />
//               </Grid>
//               <Grid item xs={4}>
//                 <InfoStat
//                   icon={<PeopleIcon />}
//                   title="Còn lại"
//                   value={`${tripData.remainingStudents} HS`}
//                 />
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <LoadingButton
//               fullWidth
//               startIcon={<PlayArrowIcon />}
//               variant="contained"
//               loading={isLoading}
//               onClick={handleStartTrip}
//               sx={{
//                 py: 2,
//                 backgroundColor: '#fff',
//                 color: '#000',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 borderRadius: 2,
//                 '&:hover': { backgroundColor: '#e0e0e0' }
//               }}
//             >
//               Bắt đầu chuyến
//             </LoadingButton>
//           </Grid>
//           <Grid item xs={6}>
//             <Button
//               fullWidth
//               startIcon={<StopIcon />}
//               variant="outlined"
//               onClick={handleEndTrip}
//               sx={{
//                 py: 2,
//                 borderColor: '#444',
//                 color: '#fff',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 borderRadius: 2
//               }}
//             >
//               Kết thúc chuyến
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Button
//               fullWidth
//               startIcon={<WarningAmberIcon />}
//               variant="contained"
//               onClick={handleReportIssue}
//               sx={{
//                 py: 2,
//                 backgroundColor: '#b71c1c',
//                 color: '#fff',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 borderRadius: 2,
//                 '&:hover': { backgroundColor: '#a11212' }
//               }}
//             >
//               Báo sự cố
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Button
//               fullWidth
//               startIcon={<MessageIcon />}
//               variant="outlined"
//               onClick={handleMessages}
//               sx={{
//                 py: 2,
//                 borderColor: '#444',
//                 color: '#fff',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 borderRadius: 2
//               }}
//             >
//               Tin nhắn
//             </Button>
//           </Grid>
//         </Grid>

// {/* Danh sách học sinh hôm nay */}
// <Box
//   sx={{
//     width: '150%',
//     mt: 2,
//     backgroundColor: '#1a1a1a',
//     borderRadius: 3,
//     p: 2,
//     maxHeight: 500,
//     overflowY: 'auto',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
//   }}
// >
//   <Typography
//     variant="h6"
//     sx={{
//       fontWeight: 'bold',
//       color: '#fff',
//       mb: 2,
//       textAlign: 'center'
//     }}
//   >
//     Danh sách học sinh hôm nay
//   </Typography>

//   {students.map((student) => (
//     <Card
//       key={student.id}
//       sx={{
//         backgroundColor: '#1e1e1e',
//         borderRadius: 3,
//         mb: 2,
//         boxShadow: '0 2px 10px rgba(0,0,0,0.25)'
//       }}
//     >
//       <CardContent sx={{ p: 2.5 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
//               {student.name}
//               <Chip
//                 label={student.status}
//                 size="small"
//                 sx={{
//                   ml: 1,
//                   backgroundColor:
//                     student.status === 'Đã đón'
//                       ? '#2E7D32'
//                       : student.status === 'Vắng mặt'
//                       ? '#D32F2F'
//                       : '#424242',
//                   color: '#fff',
//                   fontWeight: 'bold'
//                 }}
//                 icon={
//                   student.status === 'Đã đón' ? (
//                     <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
//                   ) : (
//                     <AccessTimeIcon sx={{ fontSize: 16 }} />
//                   )
//                 }
//               />
//             </Typography>

//             <Typography variant="body2" color="grey.400">
//               {student.class}
//             </Typography>

//             <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
//               <PinDropIcon sx={{ color: 'grey.500', fontSize: 18 }} />
//               <Typography variant="body2" color="grey.400">
//                 {student.address}
//               </Typography>
//             </Stack>
//           </Box>

//           <Typography
//             variant="subtitle1"
//             sx={{
//               fontWeight: 'bold',
//               color: '#fff'
//             }}
//           >
//             {student.pickupTime}
//           </Typography>
//         </Box>

//         {/* Nút căn giữa */}
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
//           {student.status === 'Chưa đón' ? (
//             <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   backgroundColor: '#2E7D32',
//                   color: '#fff',
//                   fontWeight: 'bold',
//                   textTransform: 'none',
//                   '&:hover': { backgroundColor: '#1B5E20' }
//                 }}
//                 onClick={() => handlePickupStatus(student.id, 'Đã đón')}
//               >
//                 Đã đón
//               </Button>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 sx={{
//                   borderColor: '#D32F2F',
//                   color: '#D32F2F',
//                   fontWeight: 'bold',
//                   textTransform: 'none',
//                   '&:hover': { borderColor: '#B71C1C', color: '#B71C1C' }
//                 }}
//                 onClick={() => handlePickupStatus(student.id, 'Vắng mặt')}
//               >
//                 Vắng mặt
//               </Button>
//             </Stack>
//           ) : (
//             <Button
//               fullWidth
//               disabled
//               sx={{
//                 backgroundColor:
//                   student.status === 'Đã đón' ? '#2E7D32' : '#D32F2F',
//                 color: '#fff',
//                 fontWeight: 'bold',
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 '&.Mui-disabled': { color: '#fff', opacity: 0.9 }
//               }}
//             >
//               {student.status}
//             </Button>
//           )}
//         </Box>
//       </CardContent>
//     </Card>
//   ))}
// </Box>

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={4000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={handleCloseSnackbar}
//             variant="filled"
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Box>
//   );
// };

// export default DriverDashboard;
