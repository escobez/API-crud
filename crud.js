const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// insere o id, titulo e autor

app.get('/inserir', (req, res) => {
  const { id, titulo, autor } = req.query;
  const livros = JSON.parse(fs.readFileSync('crud.json'));
  livros.push({ id: parseInt(id), titulo, autor });
  fs.writeFileSync('crud.json', JSON.stringify(livros, null, 2));
  res.send('Livro inserido com sucesso!');
});

// atualiza algum livro existente no banco

app.get('/atualizar', (req, res) => {
  const { id, titulo, autor } = req.query;
  let livros = JSON.parse(fs.readFileSync('crud.json'));
  livros = livros.map(livro =>
    livro.id === parseInt(id) ? { id: parseInt(id), titulo, autor } : livro
  );
  fs.writeFileSync('crud.json', JSON.stringify(livros, null, 2));
  res.send('Livro atualizado com sucesso!');
});

// exclui algum livro existente

app.get('/excluir', (req, res) => {
  const { id } = req.query;
  let livros = JSON.parse(fs.readFileSync('crud.json'));
  livros = livros.filter(livro => livro.id !== parseInt(id));
  fs.writeFileSync('crud.json', JSON.stringify(livros, null, 2));
  res.send('Livro excluído com sucesso!');
});

// lista todos os livros

app.get('/listar', (req, res) => {
  const livros = JSON.parse(fs.readFileSync('crud.json'));
  let html = '<h2>Lista de Livros</h2><ul>';
  livros.forEach(l => {
    html += `<li>${l.id} - ${l.titulo} - ${l.autor}</li>`;
  });
  html += '</ul><a href="principal.html">Voltar</a>';
  res.send(html);
});

// busca livros que batem com o termo passado no titulo ou autor

app.get('/buscar', (req, res) => {
  const { termo } = req.query;
  const livros = JSON.parse(fs.readFileSync('crud.json'));
  const encontrados = livros.filter(l =>
    l.titulo.toLowerCase().includes(termo.toLowerCase()) ||
    l.autor.toLowerCase().includes(termo.toLowerCase())
  );
  let html = `<h2>Resultado da busca por "${termo}"</h2><ul>`;
  encontrados.forEach(l => {
    html += `<li>${l.id} - ${l.titulo} - ${l.autor}</li>`;
  });
  html += '</ul><a href="principal.html">Voltar</a>';
  res.send(html);
});

// inicializa o servidor

app.listen(3001, () => {
  console.log('Site rodando em : http://localhost:3001/principal.html');
});
