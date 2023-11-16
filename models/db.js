const { Sequelize } = require('sequelize'); // Importe a dependência corretamente

// Conexão BD
const sequelize = new Sequelize('ifsports', 'root', '89471240', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log // Adicione esta linha
});

module.exports = {
    Sequelize: Sequelize, // Exporte o Sequelize
    sequelize: sequelize
};
