const express = require('express');
const { Pool, types } = require('pg');

// DATE (oid 1082) devolvido como string 'YYYY-MM-DD', sem conversão de fuso
types.setTypeParser(1082, (v) => v);

const STATUS_VALIDOS = ['pendente', 'confirmada', 'cancelada'];

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'reservas',
  // RDS PostgreSQL 15+ exige SSL por padrão
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const app = express();
app.use(express.json());

function validar(body) {
  const erros = [];
  const { cliente, data, status } = body || {};
  if (typeof cliente !== 'string' || !cliente.trim()) erros.push('cliente é obrigatório');
  if (typeof data !== 'string' || Number.isNaN(Date.parse(data))) erros.push('data é obrigatória (YYYY-MM-DD)');
  if (status !== undefined && !STATUS_VALIDOS.includes(status)) {
    erros.push(`status deve ser um de: ${STATUS_VALIDOS.join(', ')}`);
  }
  return erros;
}

function idInvalido(id) {
  return !/^\d+$/.test(id);
}

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(503).json({ status: 'erro', detalhe: 'banco indisponível' });
  }
});

app.post('/reservas', async (req, res, next) => {
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erros });
  const { cliente, data, status = 'pendente' } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO reservas (cliente, data, status) VALUES ($1, $2, $3) RETURNING *',
      [cliente.trim(), data, status]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { next(e); }
});

app.get('/reservas', async (_req, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM reservas ORDER BY id');
    res.json(r.rows);
  } catch (e) { next(e); }
});

app.get('/reservas/:id', async (req, res, next) => {
  if (idInvalido(req.params.id)) return res.status(400).json({ erro: 'id inválido' });
  try {
    const r = await pool.query('SELECT * FROM reservas WHERE id = $1', [req.params.id]);
    if (!r.rowCount) return res.status(404).json({ erro: 'Reserva não encontrada' });
    res.json(r.rows[0]);
  } catch (e) { next(e); }
});

app.put('/reservas/:id', async (req, res, next) => {
  if (idInvalido(req.params.id)) return res.status(400).json({ erro: 'id inválido' });
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erros });
  const { cliente, data, status = 'pendente' } = req.body;
  try {
    const r = await pool.query(
      'UPDATE reservas SET cliente = $1, data = $2, status = $3 WHERE id = $4 RETURNING *',
      [cliente.trim(), data, status, req.params.id]
    );
    if (!r.rowCount) return res.status(404).json({ erro: 'Reserva não encontrada' });
    res.json(r.rows[0]);
  } catch (e) { next(e); }
});

app.delete('/reservas/:id', async (req, res, next) => {
  if (idInvalido(req.params.id)) return res.status(400).json({ erro: 'id inválido' });
  try {
    const r = await pool.query('DELETE FROM reservas WHERE id = $1', [req.params.id]);
    if (!r.rowCount) return res.status(404).json({ erro: 'Reserva não encontrada' });
    res.status(204).send();
  } catch (e) { next(e); }
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno' });
});

async function initDb(tentativas = 15) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservas (
          id SERIAL PRIMARY KEY,
          cliente VARCHAR(120) NOT NULL,
          data DATE NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pendente'
        )`);
      console.log('Banco pronto.');
      return;
    } catch (e) {
      console.log(`Aguardando banco (${i}/${tentativas}): ${e.message}`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error('Não foi possível conectar ao banco');
}

const PORT = Number(process.env.PORT || 3000);
initDb()
  .then(() => app.listen(PORT, () => console.log(`API de Reservas na porta ${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1); });
