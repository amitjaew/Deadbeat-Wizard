import * as mysql from 'mysql2';

export const dbPool = mysql.createPool({
    connectionLimit: 10,
    host: import.meta.env.VITE_DB_HOST,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASS,
    port: import.meta.env.VITE_DB_PORT,
    database: import.meta.env.VITE_DB_NAME
});

export const getConnection = async () => {{
    return new Promise((resolve, reject) => {
        dbPool.getConnection((err, connection) => {
            if (err) reject(err);
            else resolve(connection);
        });
    });
}};

export const queryDatabase = async (sql, values=[]) => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) reject(err);
            else resolve(results);
        });
    });
};
