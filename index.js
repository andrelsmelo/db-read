const dbConnection = require('./db');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// Função para executar o comando "SHOW DATABASES"
function showDatabases() {
  const query = 'SHOW DATABASES';

  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar o comando SHOW DATABASES:', err);
      return;
    }

    console.log('Bancos de dados disponíveis:');
    results.forEach((row) => {
      console.log(row.Database);
    });

    promptCommand();
  });
}

// Função para executar o comando "SHOW TABLES"
function showTables() {
  const query = 'SHOW TABLES';

  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar o comando SHOW TABLES:', err);
      return;
    }

    console.log('Tabelas disponíveis:');
    results.forEach((row) => {
      const tableName = Object.values(row)[0];
      console.log(tableName);
    });

    promptCommand();
  });
}

// Função para executar o comando "DESC table"
function descTable(table) {
  const query = `DESC ${table}`;

  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error(`Erro ao executar o comando DESC ${table}:`, err);
      return;
    }

    console.log('Desc da tabela:');
    results.forEach((row) => {
      const columnName = row.Field;
      const columnType = row.Type;
      console.log(`${columnName} - ${columnType}`);
    });

    promptCommand();
  });
}

// Função para descrever todas as tabelas
function describeAllTables() {
  const query = 'SHOW TABLES';

  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar o comando SHOW TABLES:', err);
      return;
    }

    const tables = results.map((row) => Object.values(row)[0]);

    const describeTablePromises = tables.map((table) => {
      return new Promise((resolve, reject) => {
        descTable(table);
        resolve();
      });
    });

    Promise.all(describeTablePromises)
      .then(() => {
        promptCommand();
      })
      .catch((error) => {
        console.error('Erro ao descrever tabelas:', error);
        promptCommand();
      });
  });
}

// Função para exibir a query de criação de uma tabela
function showCreateTable(tableName) {
  const query = `SHOW CREATE TABLE ${tableName}`;

  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error(
        `Erro ao executar o comando SHOW CREATE TABLE ${tableName}:`,
        err
      );
      return;
    }

    const createTableQuery = results[0]['Create Table'];
    console.log(`Query de criação da tabela ${tableName}:`);
    console.log(createTableQuery);

    promptCommand();
  });
}

function getCreateTableQuery(tableName) {
  return new Promise((resolve, reject) => {
    const query = `SHOW CREATE TABLE ${tableName}`;

    dbConnection.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      const createTableQuery = results[0]['Create Table'];
      resolve(createTableQuery);
    });
  });
}

function getTableNames() {
  return new Promise((resolve, reject) => {
    const query = 'SHOW TABLES';

    dbConnection.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      const tableNames = results.map((row) => Object.values(row)[0]);
      resolve(tableNames);
    });
  });
}

// Função para salvar a query de criação de uma tabela em um arquivo
function saveCreateTableQueryToFile(tableName, createTableQuery) {
  const folderPath = path.join(__dirname, 'sql');
  const filePath = path.join(folderPath, `${tableName}.sql`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFile(filePath, createTableQuery, (err) => {
    if (err) {
      console.error(`Erro ao salvar o arquivo ${tableName}.sql:`, err);
      return;
    }

    console.log(`Arquivo ${tableName}.sql salvo com sucesso!`);
  });
}

// Função para salvar o comando SQL de criação de tabela em um arquivo .txt
function saveCreateTableCommandToFile(tableName, createTableQuery) {
  const folderPath = path.join(__dirname, 'txt');
  const filePath = path.join(folderPath, `${tableName}_create_command.txt`);
  const command = `Crie a entidade NestJs a partir desse comando SQL:\n\n${createTableQuery} \n\n nest g resource ${tableName}`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFile(filePath, command, (err) => {
    if (err) {
      console.error(
        `Erro ao salvar o arquivo ${tableName}_create_command.txt:`,
        err
      );
      return;
    }

    console.log(`Arquivo ${tableName}_create_command.txt salvo com sucesso!`);
  });
}

// Função para executar o comando SHOW CREATE TABLE em todas as tabelas
function exportCreateTableQueries() {
  getTableNames()
    .then((tableNames) => {
      const getCreateTableQueries = tableNames.map((tableName) => {
        return getCreateTableQuery(tableName)
          .then((createTableQuery) => {
            saveCreateTableQueryToFile(tableName, createTableQuery);
            saveCreateTableCommandToFile(tableName, createTableQuery);
          })
          .catch((error) => {
            console.error(
              `Erro ao obter a query de criação da tabela ${tableName}:`,
              error
            );
          });
      });

      Promise.all(getCreateTableQueries)
        .then(() => {
          console.log('Exportação concluída com sucesso!');
          promptCommand();
        })
        .catch((error) => {
          console.error(
            'Erro ao exportar as queries de criação das tabelas:',
            error
          );
          promptCommand();
        });
    })
    .catch((error) => {
      console.error('Erro ao obter os nomes das tabelas:', error);
      promptCommand();
    });
}

// Função para exibir o menu de comandos
function promptCommand() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'command',
        message: 'Qual comando deseja executar?',
        choices: [
          'Show databases',
          'Show tables',
          'Describe table',
          'Describe all tables',
          'Show create table',
          'Export create table queries',
          'Exit'
        ]
      }
    ])
    .then((answers) => {
      const { command } = answers;

      switch (command) {
        case 'Show databases':
          showDatabases();
          break;
        case 'Show tables':
          showTables();
          break;
        case 'Describe table':
          promptTableName();
          break;
        case 'Describe all tables':
          describeAllTables();
          break;
        case 'Show create table':
          promptTableNameForCreateTable();
          break;
        case 'Export create table queries':
          exportCreateTableQueries();
          break;
        case 'Exit':
          dbConnection.end(() => {
            console.log('Conexão com o banco de dados encerrada.');
            process.exit(0);
          });
          break;
        default:
          console.log('Comando inválido.');
          promptCommand();
      }
    });
}

// Função para solicitar o nome da tabela para descrever
function promptTableName() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'tableName',
        message: 'Digite o nome da tabela:'
      }
    ])
    .then((answers) => {
      const { tableName } = answers;

      descTable(tableName);
    });
}

// Função para solicitar o nome da tabela para mostrar a query de criação
function promptTableNameForCreateTable() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'tableName',
        message: 'Digite o nome da tabela:'
      }
    ])
    .then((answers) => {
      const { tableName } = answers;

      showCreateTable(tableName);
    });
}

// Inicia o programa exibindo o menu de comandos
promptCommand();
