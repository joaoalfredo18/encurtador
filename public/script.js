async function encurtar() {
    const url = document.getElementById('url').value;
    const resposta = await fetch('/encurtar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });
    const data = await resposta.json();
    document.getElementById('resultado').innerText = data.shortUrl || 'Erro ao encurtar';
}
