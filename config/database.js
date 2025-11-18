const sql = require('mssql');

const config = {
    user: 'sa',
    password: '123456',
    server: 'DESKTOP-UKN1BR0', // chỉ hostname, không \instance
    port: 1435,                 // port cố định của instance MSSQLSERVER02
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
            console.log('Lỗi kết nối SQL Server: ', err);
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
