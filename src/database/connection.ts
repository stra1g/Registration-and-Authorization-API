const enviroment = process.env.enviroment || 'development'
const config = require('../../knexfile')[enviroment]

module.exports = require('knex')(config)