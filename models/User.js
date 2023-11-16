
const { Sequelize, sequelize } = require('./db'); // Importe as dependências corretamente

const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    password: Sequelize.STRING,
});

User.sync({ force: true })
    .then(() => {
        console.log("Tabela 'User' criada com sucesso!");
    })
    .catch(err => {
        console.error("Erro ao criar a tabela 'User':", err);
    });

// Exporte apenas o modelo
module.exports = User;