const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize } = require('sequelize');
const handlebars = require('express-handlebars');
const handlebarsHelpers = require('handlebars-helpers')();
const Events = require('./models/Events');
const User = require('./models/User');
const axios = require('axios');
const app = express();
const teams = []; // Array para armazenar os times
const session = require('express-session');
const bcrypt = require('bcrypt'); // Importe o módulo bcrypt para criptografia de senhas
let currentRound = 1;
const matches = [];


//////////////////----LOGIN----///////////////////////

// Rota para logout


// Middleware para analisar dados JSON e formulários
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do express-session
app.use(session({
  secret: '123', // Substitua com sua chave secreta
  resave: false,
  saveUninitialized: true,
}));

// Rota para logout
app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro durante o logout:', err);
        res.send('Erro durante o logout. Tente novamente.');
      } else {
        res.redirect('/login'); // Redirecionar para a página de login após o logout
      }
    });
  } else {
    res.redirect('/login'); // Se a sessão não estiver definida, redirecione para o login
  }
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html'); // Substitua pelo caminho correto para o seu arquivo HTML de login
});

// Middleware de verificação de login
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    // Se a sessão do usuário estiver definida, o usuário está autenticado
    next(); // Passe para a próxima rota
  } else {
    // Se a sessão do usuário não estiver definida, redirecione para a página de login
    res.redirect('/login');
  }
}


// Rota para processar o formulário de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Procure o usuário no banco de dados
    const user = await User.findOne({ where: { username } });

    if (user) {
      // Verifique a senha
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Autenticação bem-sucedida, inicie a sessão
        req.session.user = user;
        res.redirect('/home'); // Redirecionar para a página "home" após um login bem-sucedido
      } else {
        res.send('Credenciais inválidas. Tente novamente.');
      }
    } else {
      res.send('Credenciais inválidas. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.send('Erro durante o login. Tente novamente.');
  }
});


// Rota para a página registro
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html'); // Substitua pelo caminho correto para o seu arquivo HTML de registro
});

// Rota para processar o formulário de registro:
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifique se o usuário já existe no banco de dados
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      res.send('Nome de usuário já está em uso. Tente outro.');
    } else {
      // Crie um novo usuário no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
      await User.create({ username, password: hashedPassword });

      res.redirect('/login'); // Redirecionar para a página de login após o registro bem-sucedido
    }
  } catch (error) {
    console.error('Erro durante o registro:', error);
    res.send('Erro durante o registro. Tente novamente.');
  }
});

// Middleware de verificação de login
app.use(requireLogin);


/////////////////////-----CODIGO GERAL----///////////////////////////


// Configuração do Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração para servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota HOME para informações sobre times de futebol
app.get('/home', function (req, res) {
  const limit = req.query.limit || 2; // Limite padrão de 2 eventos

  Events.findAll({
    limit: parseInt(limit),
    order: [['dateEvent', 'DESC']] // Ordenar por dataEvent em ordem decrescente
  })
    .then(function (events) {
      res.render('home', { events, limit });
    })
    .catch(function (error) {
      console.error("Erro ao buscar eventos do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

// Rota Eventos
app.get('/eventos', function (req, res) {
  Events.findAll()
    .then(function (events) {
      res.render('eventos', { events });
    })
    .catch(function (error) {
      console.error("Erro ao buscar eventos do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

// Rota EventosADM
app.get('/eventosAdm', function (req, res) {
  Events.findAll()
    .then(function (events) {
      res.render('eventosAdm', { events });
    })
    .catch(function (error) {
      console.error("Erro ao buscar eventos do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

// Rota para adicionar um evento
app.post('/add', function (req, res) {
  const hostTeam = req.body.hostTeam;
  const visitingTeam = req.body.visitingTeam;
  const hostTeamScore = parseInt(req.body.hostTeamScore); // Obter pontuação do time da casa
  const visitingTeamScore = parseInt(req.body.visitingTeamScore); // Obter pontuação do time visitante

  Events.create({
    sport: req.body.sport,
    hostTeam,
    visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace,
    hostTeamScore, // Adicione a pontuação do time da casa
    visitingTeamScore // Adicione a pontuação do time visitante
  })
    .then(function () {
      res.redirect('/eventosAdm');
    })
    .catch(function (error) {
      console.error("Erro ao adicionar evento:", error);
      res.status(400).render('error', { message: "Preencha todos os campos corretamente" });
    });
});

// Rota para remover um Evento
app.get('/remove/:id', function (req, res) {
  Events.destroy({ where: { id: req.params.id } })
    .then(function () {
      res.redirect('/eventosAdm');
    })
    .catch(function (error) {
      res.send("Este evento não existe.");
    });
});

// Rota para atualizar um Evento
app.get('/update/:id', function (req, res) {
  const eventId = req.params.id;
  Events.findByPk(eventId)
    .then(function (events) {
      res.render('update', { events });
    });
});

// Rota para processar a atualização de um Evento
app.post('/update', function (req, res) {
  const eventId = req.body.eventId;
  const dataUp = {
    sport: req.body.sport,
    hostTeam: req.body.hostTeam,
    visitingTeam: req.body.visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace,
    hostTeamScore: req.body.hostTeamScore,
    visitingTeamScore: req.body.visitingTeamScore
  };

  Events.update(dataUp, { where: { id: eventId } })
    .then(function (result) {
      if (result[0] === 1) {
        res.redirect('/eventosAdm');
      } else {
        res.send("Evento não encontrado ou não atualizado.");
      }
    })
    .catch(function (error) {
      res.send("Ocorreu um erro ao atualizar o evento: " + error);
    });
});

app.get('/atualizarPontuacoes/:id', (req, res) => {
  const eventId = req.params.id;
  res.render('atualizarPontuacoes', { eventId });
});


// Rota para processar a atualização de pontuações
app.post('/atualizarPontuacoes/:id', (req, res) => {
  const eventId = req.params.id;
  const hostTeamScore = req.body.hostTeamScore;
  const visitingTeamScore = req.body.visitingTeamScore;

  Events.findByPk(eventId)
    .then(function (event) {
      if (!event) {
        res.send("Evento não encontrado.");
      } else {
        if (event.hostTeamScore === null && event.visitingTeamScore === null) {
          Events.update(
            {
              hostTeamScore,
              visitingTeamScore
            },
            {
              where: { id: eventId }
            }
          )
            .then(function (result) {
              if (result[0] === 1) {
                res.redirect('/eventosAdm');
              } else {
                res.send("Evento não encontrado ou não atualizado.");
              }
            })
            .catch(function (error) {
              res.send("Ocorreu um erro ao atualizar as pontuações: " + error);
            });
        } else {
          res.send("As pontuações já foram inseridas para este evento.");
        }
      }
    })
    .catch(function (error) {
      console.error("Erro ao buscar evento do banco de dados:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

// Rota de erro
app.get('/error', (req, res) => {
  const errorMessage = 'Esta é uma mensagem de erro personalizada.';
  res.render('error', { message: errorMessage });
});

// Rota para a página de contato
app.get('/contato', (req, res) => {
  const developers = [
    { name: 'Henrique', email: 'henrique.leite@aluno.ifsp.edu.br' },
    { name: 'Sabrina', email: 'dev3@aluno.ifsp.edu.br' },
    { name: 'Sullivan Santos Castilho', email: 's.castilho@aluno.ifsp.edu.br' },
    { name: 'Taina Bueno', email: 'taina.bueno@aluno.ifsp.edu.br' },
    { name: 'Thiago', email: 'dev6@aluno.ifsp.edu.br' },
    { name: 'Yasmim', email: 'yasmin.cristina@aluno.ifsp.edu.br' }
  ];

  res.render('contato', { developers });
});

// Rota para o formulário
app.get('/form', function (req, res) {
  res.render('form');
});

// Rota para a barra de navegação
app.get('/navbar', (req, res) => {
  res.render('navbar');
});

/////////////////////////////------LÓGICA DO TORNEIO / CHAVES -----------------/////////////////////////

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);

app.use(express.static(__dirname));

app.get('/torneio', (req, res) => {
  res.render('index', {
    teams: [],
    matches: [],
    currentRound: 1,
  });
});

const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('addTeam', (data) => {
    const team = { name: data.name, score: data.score };
    teams.push(team);
    io.emit('updateTeams', teams);
  });


  socket.on('shuffleTeams', () => {
    teams.sort(() => Math.random() - 0.5);
    io.emit('updateTeams', teams);
  });

  socket.on('updateTeamScores', (updatedScores) => {
    updatedScores.forEach((score) => {
      const team = teams.find((t) => t.name === score.name);
      if (team) {
        team.score = score.score;
      }
    });

    io.emit('updateTeams', teams);
  });

  socket.on('startTournament', () => {
    if (teams.length < 2) {
      socket.emit('errorMessage', 'Mínimo de 2 times para iniciar o torneio.');
    } else {
      currentRound = 1;
      updateRound();
    }
  });

  socket.on('resetTournament', () => {
    teams.length = 0;
    matches.length = 0;
    currentRound = 1;
    updateRound();

    // Emita um evento para limpar os vencedores da rodada no cliente
    io.emit('clearRoundWinners');
    io.emit('tournamentWinner', '');
  });

  socket.on('resetTeams', () => {
    teams.length = 0;
    io.emit('updateTeams', teams);
    matches.length = 0;
    currentRound = 1;
    io.emit('updateMatches', matches, currentRound);
    io.emit('updateRoundWinner', '');
    io.emit('tournamentWinner', '');
  });

  socket.on('advanceRound', () => {
    if (matches.length === 0) {
      return;
    }

    const roundWinners = [];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      let winner;

      if (match.score1 > match.score2) {
        winner = match.team1;
      } else if (match.score2 > match.score1) {
        winner = match.team2;
      } else {
        // Em caso de empate, você pode escolher como deseja lidar. Aqui, escolho aleatoriamente.
        winner = Math.random() < 0.5 ? match.team1 : match.team2;
      }

      roundWinners.push({
        name: winner.name,
        score: winner === match.team1 ? match.score1 : match.score2,
      });
    }

    // Limpa as partidas da rodada anterior
    matches = [];

    // Atualiza a lista de times com os vencedores da rodada
    teams = roundWinners;

    // Incrementa o número da rodada
    currentRound++;

    // Emita um evento para atualizar a rodada no cliente
    io.emit('updateRound', currentRound);

    // Determine o campeão se houver apenas um time vencedor
    if (teams.length === 1) {
      io.emit('tournamentWinner', teams[0]);
    }

    // Emita um evento para informar o vencedor da rodada
    io.emit('roundWinner', roundWinners);
  });


  socket.on('updateMatchScore', ({ matchIndex, score1, score2 }) => {
    matches[matchIndex].score1 = score1;
    matches[matchIndex].score2 = score2;

    io.emit('updateMatches', matches, currentRound);

    // Adicione a lógica para determinar o vencedor da partida aqui, se necessário
  });

  socket.on('disconnect', () => {
    console.log('Um usuário desconectou');
  });
});


// Inicialização do servidor
app.listen(8081, function (req, res) {
  console.log('Servidor rodando http://localhost:8081/login');
});
