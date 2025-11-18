import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: false, trustServerCertificate: true },
};

// ==========================
// Test kết nối
// ==========================
app.get('/api/test', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT TOP 5 * FROM HOCSINH');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi kết nối database' });
  }
});

// ==========================
// Lấy danh sách học sinh theo PH
// ==========================
app.get('/api/parents/:parentId/students', async (req, res) => {
  const parentId = req.params.parentId;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('parentId', sql.Int, parentId)
      .query(`
        SELECT hs.idHocSinh, hs.hoTen, hs.lop, hs.ngaySinh, hs.noiSinh, hs.idTuyen, hs.diemDon, hs.trangThai,
               td.tenTuyen, dd.tenDiemDung AS tenDiemDon,
               xb.bienSo AS xeBus,
               lt.ngayThucHien, lt.gioBatDau
        FROM PHUHUYNH_HOCSINH phhs
        JOIN HOCSINH hs ON phhs.idHocSinh = hs.idHocSinh
        LEFT JOIN TUYENDUONG td ON hs.idTuyen = td.idTuyen
        LEFT JOIN DIEMDUNG dd ON hs.diemDon = dd.idDiemDung
        LEFT JOIN LICHTRINH lt ON lt.idTuyen = hs.idTuyen
        LEFT JOIN XEBUS xb ON xb.idXe = lt.idXe
        WHERE phhs.idPhuHuynh = @parentId
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ==========================
// Lấy tất cả tuyến
// ==========================
app.get('/api/routes', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM TUYENDUONG');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ==========================
// Start server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
