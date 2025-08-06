const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const path = require('path');
require('dotenv').config();
const connection = require('./database');

// Middleware para ler JSON e formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Rota para encurtar links
app.post('/encurtar', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL obrigatória' });

    const codigo = nanoid(6);

    connection.query(
        'INSERT INTO links (codigo, url_original) VALUES ($1, $2)',
        [codigo, url],
        (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao salvar link' });
            res.json({ shortUrl: `${process.env.APP_URL}/${codigo}` });
        }
    );
});

// Rota para redirecionar
app.get('/:codigo', (req, res) => {
    const { codigo } = req.params;

    connection.query(
        'SELECT url_original FROM links WHERE codigo = $1',
        [codigo],
        (err, results) => {
            if (err || results.rows.length === 0) {
                return res.status(404).send('Link não encontrado');
            }
            res.redirect(results.rows[0].url_original);
        }
    );
});

// Porta para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

