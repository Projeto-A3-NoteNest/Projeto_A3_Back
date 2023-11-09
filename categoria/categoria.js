const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const categoriasPorLembreteId = {};
const categorias= [];
let proximoIdCategoria = 1; // Variável para rastrear o próximo ID de categoria

//PERGUNTAR PARA O PROFESSOR SE AS ROTAS EM CATEGORIAS QUE NÃO ESTÃO ASSOCIADAS A LEMBRETES SÃO NECESSÁRIAS

// Rota para listar todas as categorias
app.get('/categorias', (req, res) => {
  res.json(categorias);
});

// Rota para criar uma nova categoria
app.post('/categorias', (req, res) => {
  const { nome_categoria } = req.body;
  if (nome_categoria) {
    const categoria = { id_categoria: proximoIdCategoria, nome_categoria, lembretes: [] };
    categorias.push(categoria);
    proximoIdCategoria++; // Incrementa o próximo ID de categoria
    res.json(categoria);
  } else {
    res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
  }
});

//rota para alterar uma categoria
app.put('/categorias/:id_categoria', (req, res) => {
  const idCategoria = parseInt(req.params.id_categoria);
  const categoria = categorias.find((c) => c.id_categoria === idCategoria);
  
  if (categoria) {
    const { nome_categoria } = req.body;
    categoria.nome_categoria = nome_categoria;
    // Aqui você pode adicionar a lógica para atualizar a categoria, se necessário
    res.json(categoria);
  } else {
    res.status(404).json({ error: 'Categoria não encontrada.' });
  }
});

//rota para deletar uma categoria
app.delete('/categorias/:id_categoria', (req, res) => {
  const idCategoria = parseInt(req.params.id_categoria);
  const categoriaIndex = categorias.findIndex((c) => c.id_categoria === idCategoria);
  
  if (categoriaIndex !== -1) {
    categorias.splice(categoriaIndex, 1);
    // Aqui você também deve remover a categoria dos lembretes associados, se necessário
    res.json({ message: 'Categoria deletada com sucesso.' });
  } else {
    res.status(404).json({ error: 'Categoria não encontrada.' });
  }
});

// Rota para listar todos os lembretes associados a uma categoria
app.get('/lembretes/:id/categorias', (req, res) => {
  res.send(categoriasPorLembreteId[req.params.id] || []);
});

// Rota para associar uma categoria a um lembrete
app.post('/lembretes/:id/categorias', async (req, res) => {
    const idObs = uuidv4();
    const { nome_categoria } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const categoriasDoLembrete =
        categoriasPorLembreteId[req.params.id] || [];
    categoriasDoLembrete.push({ id: idObs, nome_categoria });
    categoriasPorLembreteId[req.params.id] =
        categoriasDoLembrete;
    
    res.status(201).send(categoriasDoLembrete);
});

//altera categoria sem alterar relacionamento com lembrete
app.put('/lembretes/:id/categorias/:id_cat', (req, res) => {
  const lembreteId = req.params.id;
  const idCategorias = req.params.id_cat;
  const categoriasDoLembrete = categoriasPorLembreteId[lembreteId];

  if (categoriasDoLembrete) {
    const categoria = categoriasDoLembrete.find((cat) => cat.id === idCategorias);
    
    if (categoria) {
      const { nome_categoria } = req.body;
      categoria.nome_categoria = nome_categoria;
      res.json(categoria);
    } else {
      res.status(404).json({ error: 'Categoria não encontrada.' });
    }
  } else {
    res.status(404).json({ error: 'Lembrete não encontrado.' });
  }
});

//deleta categoria sem alterar relacionamento com lembrete
  app.delete('/lembretes/:id/categorias/:id_cat', (req, res) => {
    const lembreteId = req.params.id;
    const idCategorias = req.params.id_cat;
    const categoriasDoLembrete = categoriasPorLembreteId[lembreteId];
  
    if (categoriasDoLembrete) {
      const categoriaIndex = categoriasDoLembrete.findIndex((cat) => cat.id === idCategorias);
      
      if (categoriaIndex !== -1) {
        categoriasDoLembrete.splice(categoriaIndex, 1);
        res.json({ message: 'Categoria deletada com sucesso.' });
      } else {
        res.status(404).json({ error: 'Categoria não encontrada.' });
      }
    } else {
      res.status(404).json({ error: 'Lembrete não encontrado.' });
    }
  });




app.listen(4000, (() => {
    console.log('Observacoes. Porta 4000');
}));



















/*const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const categorias = [];
let proximoIdCategoria = 1; // Variável para rastrear o próximo ID de categoria

const lembretes = [];

const categoriasPorLembreteId = {};

// Rota para criar uma nova categoria
app.post('/categorias', (req, res) => {
  const { nome_categoria } = req.body;
  if (nome_categoria) {
    const categoria = { id_categoria: proximoIdCategoria, nome_categoria, lembretes: [] };
    categorias.push(categoria);
    proximoIdCategoria++; // Incrementa o próximo ID de categoria
    res.json(categoria);
  } else {
    res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
  }
});

// Rota para listar todas as categorias
app.get('/categorias', (req, res) => {
  res.json(categorias);
});

// Rota para associar uma categoria a um lembrete
app.post('/lembretes/:id/categorias', async (req, res) => {
  const idObs = uuidv4();
  const { nome_categoria } = req.body;

  const categoriasDoLembrete = categoriasPorLembreteId[req.params.id] || [];
  categoriasDoLembrete.push({ id: idObs, nome_categoria });
  categoriasPorLembreteId[req.params.id] = categoriasDoLembrete;

  res.status(201).json(categoriasDoLembrete);
});


// Rota para listar todos os lembretes associados a uma categoria
app.get('/categorias/:id_categoria/lembretes', (req, res) => {
  const idCategoria = parseInt(req.params.id_categoria);
  const categoria = categorias.find((c) => c.id_categoria === idCategoria);

  if (categoria) {
    const lembretesAssociados = lembretes.filter((l) => categoria.lembretes.includes(l.id_lembrete));
    res.json(lembretesAssociados);
  } else {
    res.status(404).json({ error: 'Categoria não encontrada.' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
*/




