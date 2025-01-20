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
  const { nome } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ error: 'O nome é obrigatório' });
  }

  try {
    // Inserir o nome no banco de dados
    const result = await pool.query(
      'INSERT INTO lista (nome) VALUES ($1) RETURNING id',
      [nome.trim()]
    );

    res.status(201).json({ message: 'Presença confirmada!', id: result.rows[0].id });
  } catch (err) {
    console.error('Erro ao salvar confirmação:', err);
    res.status(500).json({ error: 'Erro ao salvar a confirmação. Tente novamente mais tarde.' });
  }
});

// Endpoint para obter todas as confirmações
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lista ORDER BY id ASC');
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
