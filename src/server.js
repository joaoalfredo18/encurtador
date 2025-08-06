// Encurtar link
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

// Redirecionar link
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
