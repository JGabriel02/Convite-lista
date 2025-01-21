const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar o middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados com Neon
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:SGElKQW5oD1U@ep-green-rice-a5pam7q7.us-east-2.aws.neon.tech/neondb?sslmode=require',
});

// Verificar conexão com o banco de dados
pool.connect()
  .then(() => console.log('Conectado ao banco de dados Neon'))
  .catch((err) => console.error('Erro ao conectar ao banco de dados:', err));

// Endpoint para confirmar presença
app.post('/confirm', async (req, res) => {
  try {
    console.log('Requisição recebida:', req.body); // Loga o corpo da requisição

    const { nome } = req.body;
    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ message: 'Nome inválido ou ausente.' });
    }

    const result = await pool.query('INSERT INTO lista (nome) VALUES ($1) RETURNING *', [nome]);
    res.status(201).json({ message: 'Confirmação registrada com sucesso.', data: result.rows[0] });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});
// Endpoint para obter todas as confirmações
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lista');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar confirmações:', err);
    res.status(500).json({ error: 'Erro ao buscar as confirmações. Tente novamente mais tarde.' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
