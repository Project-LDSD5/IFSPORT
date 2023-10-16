const Sequelize = require('sequelize')

//conexao BD
const sequelize = new Sequelize('ifsports','root','senha', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log // Adicione esta linha
})

module.exports = {
    Sequelize : Sequelize,
    sequelize : sequelize
}