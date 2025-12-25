import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'ivanknazev',
  host: 'localhost',
  database: 'korochki_db',
  password: '',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Ошибка подключения к БД:', err);
  } else {
    console.log('Подключение к БД успешно');
  }
});

export default pool;

