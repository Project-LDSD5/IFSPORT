const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path'); // Importe o módulo 'path'
const Events = require('./models/Event');

// Template Engine Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração para servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get("/", function (req, res) {
  Events.findAll().then(function (events) {
    res.render('home', { events: events });
  });
});

// Rota para o formulário
app.get("/form", function (req, res) {
  res.render('form');
});

// Rota para adicionar um evento
app.post("/add", function (req, res) {
  Events.create({
    sport: req.body.sport,
    hostTeam: req.body.hostTeam,
    visitingTeam: req.body.visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace
  }).then(function () {
    res.redirect('/');
  }).catch(function (erro) {
    res.send("Preencha todos os campos corretamente");
  });
});

// Rota para remover um evento
app.get('/remove/:id', function (req, res) {
  Events.destroy({ where: { 'id': req.params.id } }).then(function () {
    res.send("Evento apagado com sucesso.");
  }).catch(function (erro) {
    res.send("Este evento não existe.");
  });
});

// Rota para atualizar um evento
app.get("/update/:id", function (req, res) {
  const eventId = req.params.id; // ID do evento que você deseja atualizar
  Events.findByPk(eventId).then(function (events) {
    res.render('update', { events: events });
  });
});

// Rota para processar a atualização de um evento
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
      res.send("Evento atualizado com sucesso.");
    } else {
      res.send("Evento não encontrado ou não atualizado.");
    }
  }).catch(function (error) {
    res.send("Ocorreu um erro ao atualizar o evento: " + error);
  });
});

// Rota para a página com a barra de navegação
app.get('/navbar', (req, res) => {
  res.render('navbar');
});

// Servidor
app.listen(8081, function (req, res) {
  console.log("Está rodando finalmente aeeeeeeeeeee");
});
