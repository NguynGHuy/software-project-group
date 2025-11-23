import { sql, pool } from '../config/database.js';

class Route {
    static async getAll() {
        const db = await pool;
        const result = await db.request().query(`
            SELECT t.idTuyenDuong as idTuyen, t.tenTuyen, t.idXeBus, x.bienSo,
                   CONVERT(varchar(5), t.gioBatDau, 108) as gioBatDau,
                   CONVERT(varchar(5), t.gioKetThuc, 108) as gioKetThuc
            FROM TUYENDUONG t
            LEFT JOIN XEBUS x ON t.idXeBus = x.idXe ORDER BY t.idTuyenDuong
        `);
        return result.recordset;
    }

    static async getById(id) {
        const db = await pool;
        const routeResult = await db.request().input('id', sql.Int, id).query(`
            SELECT t.idTuyenDuong as idTuyen, t.tenTuyen, t.idXeBus, x.bienSo,
                   CONVERT(varchar(5), t.gioBatDau, 108) as gioBatDau,
                   CONVERT(varchar(5), t.gioKetThuc, 108) as gioKetThuc
            FROM TUYENDUONG t
            LEFT JOIN XEBUS x ON t.idXeBus = x.idXe WHERE t.idTuyenDuong = @id
        `);

        if (!routeResult.recordset.length) return null;
        const route = routeResult.recordset[0];

        const stopsResult = await db.request().input('id', sql.Int, id).query(`
            SELECT d.idDiemDung, d.tenDiemDung, d.kinhDo, d.viDo, td.thuTu
            FROM DIEMDUNG d
            JOIN TUYENDUONG_DIEMDUNG td ON d.idDiemDung = td.idDiemDung
            WHERE td.idTuyenDuong = @id ORDER BY td.thuTu
        `);
        route.diemDung = stopsResult.recordset;
        return route;
    }

    static async create(routeData) {
        const { tenTuyen, idXeBus, gioBatDauStr, gioKetThucStr, diemDung } = routeData;
        const db = await pool;
        const transaction = new sql.Transaction(db);
        await transaction.begin();

        try {
            const request = transaction.request()
                .input('tenTuyen', sql.NVarChar, tenTuyen)
                .input('gioBatDau', sql.VarChar, gioBatDauStr)
                .input('gioKetThuc', sql.VarChar, gioKetThucStr);
            if (idXeBus) request.input('idXeBus', sql.Int, parseInt(idXeBus));

            const routeResult = await request.query(`
                INSERT INTO TUYENDUONG (tenTuyen, gioBatDau, gioKetThuc${idXeBus ? ', idXeBus' : ''})
                OUTPUT INSERTED.idTuyenDuong as idTuyen
                VALUES (@tenTuyen, CONVERT(time, @gioBatDau), CONVERT(time, @gioKetThuc)${idXeBus ? ', @idXeBus' : ''})
            `);
            const newRoute = routeResult.recordset[0];

            if (diemDung && diemDung.length > 0) {
                for (let i = 0; i < diemDung.length; i++) {
                    await transaction.request()
                        .input('idTuyen', sql.Int, newRoute.idTuyen)
                        .input('idDiem', sql.Int, diemDung[i].idDiemDung)
                        .input('thuTu', sql.Int, i + 1)
                        .query(`INSERT INTO TUYENDUONG_DIEMDUNG (idTuyenDuong, idDiemDung, thuTu) VALUES (@idTuyen, @idDiem, @thuTu)`);
                }
            }
            await transaction.commit();
            return newRoute;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
    // Update và Remove làm tương tự với Transaction...
    static async remove(id) {
        const db = await pool;
        const transaction = new sql.Transaction(db);
        await transaction.begin();
        try {
            await transaction.request().input('id', sql.Int, id).query('DELETE FROM TUYENDUONG_DIEMDUNG WHERE idTuyenDuong = @id');
            const result = await transaction.request().input('id', sql.Int, id).query('DELETE FROM TUYENDUONG OUTPUT DELETED.* WHERE idTuyenDuong = @id');
            if (!result.recordset.length) throw new Error('Tuyến xe không tồn tại');
            await transaction.commit();
            return result.recordset[0];
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}
export default Route;