# DB Read

Este é um projeto simples que permite executar comandos SQL em um banco de dados MySQL e realizar operações como listar bancos de dados, tabelas, descrever tabelas e exportar queries de criação de tabelas.

## Pré-requisitos

- Node.js instalado
- Banco de dados MySQL configurado
- Dependências do projeto instaladas (execute `npm install`)

## Configuração

Antes de executar o projeto, certifique-se de configurar corretamente as informações de conexão com o banco de dados no arquivo `.env`. Você pode usar o arquivo `.env.example` como base e preencher as informações necessárias.

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

## Como usar

1. Instale as dependências do projeto executando o comando `npm install`.

2. Execute o projeto executando o comando `npm start`.

3. O menu de comandos será exibido no terminal. Escolha a opção desejada digitando o número correspondente ou digite `Exit` para sair.

4. Siga as instruções fornecidas para executar os comandos desejados no banco de dados.

## Comandos disponíveis

- Show databases: Lista todos os bancos de dados disponíveis.

- Show tables: Lista todas as tabelas do banco de dados selecionado.

- Describe table: Descreve uma tabela específica.

- Describe all tables: Descreve todas as tabelas do banco de dados.

- Show create table: Exibe a query de criação de uma tabela específica.

- Export create table queries: Exporta as queries de criação de todas as tabelas para arquivos separados.

- Exit: Encerra a conexão com o banco de dados e sai do programa.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
