const db = require('./db')

const Events = db.sequelize.define('events', {
    sport: {
        type: db.Sequelize.STRING
    },
    hostTeam: {
        type: db.Sequelize.STRING
    },
    visitingTeam: {
        type: db.Sequelize.STRING
    },
    eventTime: {
        type: db.Sequelize.TIME
    },
    dateEvent: {
        type: db.Sequelize.DATE
    },
    eventsPlace: {
        type: db.Sequelize.TEXT
    }


})

//Rodar uma unica vez para criar tabela
//Events.sync({force: true})
module.exports = Events