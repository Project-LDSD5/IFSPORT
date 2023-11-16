const { Sequelize, sequelize } = require('./db'); // Importe as dependências corretamente

const Events = sequelize.define('events', {
    sport: {
        type: Sequelize.STRING

    },
    hostTeam: {
        type: Sequelize.STRING
    },
    visitingTeam: {
        type: Sequelize.STRING
    },
    eventTime: {
        type: Sequelize.TIME
    },
    dateEvent: {
        type: Sequelize.DATE
    },
    eventsPlace: {
        type: Sequelize.TEXT
    },
    hostTeamScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0 // Definir a pontuação inicial como 0
    },
    visitingTeamScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0 // Definir a pontuação inicial como 0
    }
});

// Não é necessário exportar o modelo aqui
Events.sync({ force: true })
    .then(() => {
        console.log("Tabela 'events' criada com sucesso!");
    })
    .catch(err => {
        console.error("Erro ao criar a tabela 'events':", err);
    });

// Exporte apenas o modelo
module.exports = Events;

