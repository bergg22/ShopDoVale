const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Rotas de autenticação
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, type } = req.body;

  try {
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.execute(
      'INSERT INTO users (id, name, email, password, phone, type) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, phone, type]
    );

    if (type === 'producer') {
      const { business_name, description, address, delivery_available, pickup_available } = req.body;
      const producerId = uuidv4();

      await pool.execute(
        'INSERT INTO producer_profiles (id, user_id, business_name, description, address, delivery_available, pickup_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [producerId, userId, business_name, description, address, delivery_available, pickup_available]
      );
    }

    const token = jwt.sign({ id: userId, type }, process.env.JWT_SECRET);
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET);
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rotas de produtos
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await pool.execute(`
      SELECT p.*, c.name as category_name, pp.business_name as producer_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      JOIN producer_profiles pp ON p.producer_id = pp.id 
      WHERE p.active = true
    `);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});