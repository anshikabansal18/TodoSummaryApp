import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todoapp',
  password: 'thAt6e6e#)@s', // ✅ use your actual raw password
  port: 5432,
});

export default pool;


