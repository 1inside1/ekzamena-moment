import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/register', async (req, res) => {
  try {
    const { login, password, fio, phone, email } = req.body;

    const checkUser = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Логин уже занят' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (login, password, fio, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [login, hashedPassword, fio, phone, email]
    );

    res.json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const user = result.rows[0];
    let match = false;

    if (user.login === 'Admin') {
      match = (password === user.password);
    } else {
      match = await bcrypt.compare(password, user.password);
      if (!match) {
        match = (password === user.password);
      }
    }

    if (!match) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    res.json({ 
      success: true, 
      userId: user.id, 
      login: user.login,
      isAdmin: user.login === 'Admin'
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM requests WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const { userId, courseName, startDate, paymentMethod } = req.body;
    
    const result = await pool.query(
      'INSERT INTO requests (user_id, course_name, start_date, payment_method, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, courseName, startDate, paymentMethod, 'Новая']
    );

    res.json({ success: true, request: result.rows[0] });
  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/requests', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT r.*, u.fio, u.login FROM requests r JOIN users u ON r.user_id = u.id ORDER BY r.id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/admin/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ success: true, request: result.rows[0] });
  } catch (error) {
    console.error('Ошибка обновления заявки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
