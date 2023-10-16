const express = require('express');
const handlebars = require('express-handlebars');
const handlebarsHelpers = require('handlebars-helpers')();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path'); // Importe o módulo 'path'
const Events = require('./models/Events');
const axios = require('axios');
const app = express();


// Template Engine Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração para servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Defina a pasta de visualizações (views) para conter seus arquivos .handlebars
app.set('views', path.join(__dirname, 'views'));



// Rota HOME || para obter informações sobre times de futebol 
app.get('/home', function (req, res) {
  const limit = req.query.limit || 2; // Limite padrão de 10 eventos

  Events.findAll({
    limit: parseInt(limit),
    order: [['dateEvent', 'DESC']] // Ordenar por dataEvent em ordem decrescente
  })
    .then(function (events) {
      res.render('home', { events: events, limit: limit });
    })
    .catch(function (error) {
      console.error("Erro ao buscar eventos do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

// Rota Eventos
app.get("/eventos", function (req, res) {
  Events.findAll()
    .then(function (events) {
      res.render('eventos', { events: events });
    })
    .catch(function (error) {
      console.error("Erro ao buscar eventos do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

// Rota EventosADM
app.get("/eventosAdm", function (req, res) {
  Events.findAll()
    .then(function (events) {
      res.render('eventosAdm', { events: events });
    })
    .catch(function (error) {
      console.error("Erro ao buscar eventos do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});


// Rota para adicionar um Evento || Redireciona para eventosAdm
app.post("/add", function (req, res) {
  Events.create({
    sport: req.body.sport,
    hostTeam: req.body.hostTeam,
    visitingTeam: req.body.visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace
  }).then(function () {
    res.redirect('/eventosAdm');
  }).catch(function (erro) {
    console.error("Erro ao adicionar evento:", erro);
    res.status(400).render('error', { message: "Preencha todos os campos corretamente" });
  });
});

try {
  // Seu código problemático aqui
} catch (error) {
  console.error('Erro:', error);
}

// Rota para remover um Evento || Rediciona para eventosAdm
app.get('/remove/:id', function (req, res) {
  Events.destroy({ where: { 'id': req.params.id } }).then(function () {
    // Redireciona para a página inicial após apagar um evento
    res.redirect('/eventosAdm');
  }).catch(function (erro) {
    res.send("Este evento não existe.");
  });
});

// Rota para atualizar um Evento
app.get("/update/:id", function (req, res) {
  const eventId = req.params.id; // ID do evento que você deseja atualizar
  Events.findByPk(eventId).then(function (events) {
    res.render('update', { events: events });
  });
});

// Rota para processar a atualização de um Evento || Rediciona para eventosAdm
app.post("/update", function (req, res) {
  const eventId = req.body.eventId;
  const dataUp = {
    sport: req.body.sport,
    hostTeam: req.body.hostTeam,
    visitingTeam: req.body.visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace
  };

  Events.update(dataUp, {
    where: { id: eventId }
  }).then(function (result) {
    if (result[0] === 1) {
      // Redireciona para a página eventos após atualizar um evento com sucesso
      res.redirect('/eventosAdm');
    } else {
      res.send("Evento não encontrado ou não atualizado.");
    }
  }).catch(function (error) {
    res.send("Ocorreu um erro ao atualizar o evento: " + error);
  });
});



// Rota Página de contato
app.get('/contato', (req, res) => {
  // Dados dos desenvolvedores (substitua com seus próprios dados)
  const developers = [
    { name: 'Henrique', email: 'henrique.leite@aluno.ifsp.edu.br' },
    { name: 'Sabrina', email: 'dev3@aluno.ifsp.edu.br' },
    { name: 'Sullivan Santos Castilho', email: 's.castilho@aluno.ifsp.edu.br' },
    { name: 'Taina Bueno', email: 'taina.bueno@aluno.ifsp.edu.br' },
    { name: 'Thiago', email: 'dev6@aluno.ifsp.edu.br' },
    //{ name: 'Rhenan', email: 'dev7@aluno.ifsp.edu.br' },
    { name: 'Yasmim', email: 'yasmin.cristina@aluno.ifsp.edu.br' }
  ];

  // Renderiza a página 'contato.handlebars' com os dados dos desenvolvedores
  res.render('contato', { developers });
});

// Rota Formulário
app.get("/form", function (req, res) {
  res.render('form');
});

// Rota Barra de navegação
app.get('/navbar', (req, res) => {
  res.render('navbar');
});

// Servidor
app.listen(8081, function (req, res) {
  console.log("Servidor rodando na porta 8081");
});
