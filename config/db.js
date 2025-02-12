import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const query = async (sql, params) => {
  // Establish connection to the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });



  // Execute the query
  const [results] = await connection.execute(sql, params);
  // Close the connection
  await connection.end();

  return results;
};
