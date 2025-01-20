const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Caminho do arquivo JSON para armazenar confirmações
const filePath = path.join(__dirname, 'confirmations.json');

// Inicializar o arquivo JSON se não existir
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// Rota para salvar confirmações
app.post('/confirm', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'O nome é obrigatório!' });
  }

  // Ler as confirmações existentes
  const confirmations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Adicionar a nova confirmação
  confirmations.push({ name, date: new Date().toISOString() });

  // Salvar no arquivo JSON
  fs.writeFileSync(filePath, JSON.stringify(confirmations, null, 2));

  res.status(201).json({ message: 'Presença confirmada com sucesso!' });
});

// Rota para listar as confirmações
app.get('/confirmations', (req, res) => {
  const confirmations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(confirmations);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
