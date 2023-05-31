const mysql = require('mysql2');
require('dotenv').config();


// Configurações do banco de dados
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  };

// Cria uma conexão com o banco de dados
const connection = mysql.createConnection(dbConfig);

// Conecta ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados!');
});

// Exporta a conexão para que possa ser utilizada em outros arquivos
module.exports = connection;
