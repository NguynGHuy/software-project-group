const sql = require('mssql');

const config = {
    user: 'sa',
    password: '12345678',
    server: 'localhost\\MTHANHDUY',
    database: 'CNPM',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let poolPromise;

try {
    poolPromise = new sql.ConnectionPool(config)
        .connect()
        .then(pool => {
            console.log('Kết nối SQL Server thành công!');
            return pool;
        })
        .catch(err => {
            console.log('Lỗi kết nối SQL Server: ', err.message);
            return null;
        });
} catch (err) {
    console.log('Lỗi khởi tạo kết nối: ', err);
    poolPromise = Promise.resolve(null);
}

module.exports = {
    sql,
    poolPromise
};
