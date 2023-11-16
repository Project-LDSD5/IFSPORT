# Sistema de Gerenciamento de Eventos Esportivos (`app.js`)

Este é um sistema em Node.js que oferece funcionalidades completas para o gerenciamento de eventos esportivos, incluindo autenticação de usuários, manipulação de eventos, lógica de torneio com chaves, e outras páginas relacionadas ao sistema.

## Dependências

- **express:** Framework web para Node.js.
- **express-handlebars:** Mecanismo de modelo para Express.js.
- **body-parser:** Middleware para analisar dados JSON e formulários.
- **sequelize:** ORM (Object-Relational Mapping) para interagir com o banco de dados.
- **handlebars:** Sistema de modelo para renderizar HTML.
- **handlebars-helpers:** Conjunto de ajudantes para Handlebars.
- **axios:** Cliente HTTP baseado em Promises.
- **express-session:** Middleware para gerenciar sessões de usuário.
- **bcrypt:** Biblioteca para a criptografia de senhas.
- **socket.io:** Biblioteca para comunicação em tempo real via WebSockets.

## Configuração e Middleware

- Configuração do express-handlebars para renderização de modelos.
- Inicialização do servidor express.
- Configuração do express-session para autenticação de usuário.
- Uso do body-parser para analisar dados JSON e formulários.
- Configuração do bcrypt para criptografia de senhas.
- Definição de um middleware `requireLogin` para verificar se o usuário está autenticado.

## Rotas de Autenticação

- **/login:** Rota para a página de login.
- **/logout:** Rota para realizar logout.
- **/register:** Rota para a página de registro.
- **/login (POST):** Rota para processar o formulário de login.
- **/register (POST):** Rota para processar o formulário de registro.

## Rotas de Páginas Gerais

- **/home:** Rota para exibir informações sobre times de futebol.
- **/eventos:** Rota para exibir todos os eventos.
- **/eventosAdm:** Rota para exibir eventos com opções de administração.
- **/add (POST):** Rota para adicionar um evento.
- **/remove/:id:** Rota para remover um evento.
- **/update/:id:** Rota para exibir o formulário de atualização de um evento.
- **/update (POST):** Rota para processar a atualização de um evento.
- **/atualizarPontuacoes/:id:** Rota para exibir o formulário de atualização de pontuações de um evento.
- **/atualizarPontuacoes/:id (POST):** Rota para processar a atualização de pontuações de um evento.
- **/error:** Rota para exibir uma página de erro personalizada.
- **/contato:** Rota para exibir informações de contato.
- **/form:** Rota para exibir um formulário.
- **/navbar:** Rota para exibir uma barra de navegação.

## Lógica do Torneio / Chaves

- **/torneio:** Rota para a página inicial do torneio.
- **Socket.io:** Lógica de WebSockets para interação em tempo real.
- Adição e embaralhamento de times.
- Início, reinício e avanço de rodadas no torneio.
- Atualização e reinicialização de equipes e partidas.
- Atualização e processamento de pontuações das partidas.

## Execução do Servidor

O servidor é inicializado na porta 8081. O acesso inicial é redirecionado para a página de login.
- Servidor rodando http://localhost:8081/login

# Torneio de Times

## Descrição do Projeto

Este projeto consiste em uma aplicação web para organizar torneios esportivos entre times. A interface principal está definida no arquivo `index.handlebars`, utilizando HTML, Bootstrap CSS v5.2.1 e estilos personalizados em SCSS. A aplicação gerencia a adição de times, o embaralhamento da ordem dos times, o acompanhamento das partidas e a determinação do vencedor do torneio.

## Estrutura do Projeto

- **Página Principal (`index.handlebars`):**
  - Estrutura HTML para a interface do usuário.
  - Utilização do Bootstrap para estilos e layout responsivo.
  - Personalização adicional com estilos em CSS embutido.

- **Scripts JavaScript:**
  - Lógica de funcionamento da aplicação.
  - Adição de times, embaralhamento, atualização de pontuações e gestão das rodadas do torneio.
  - Utilização de classes e funções para modularidade e clareza.

## Funcionalidades Principais

1. **Adição de Times:**
   - Nome e pontuação do time são inseridos através do formulário.
   - Botão "Adicionar Time" aciona a função para adicionar o time à lista.

2. **Embaralhamento de Times:**
   - Botão "Embaralhar Times" reorganiza aleatoriamente a ordem dos times.

3. **Atualização de Pontuações:**
   - Botão "Atualizar Pontuações" permite a modificação das pontuações dos times.

4. **Início do Torneio:**
   - Botão "Iniciar Partidas" inicializa o torneio, criando chaves com base nos times cadastrados.

5. **Avanço de Rodadas:**
   - Botão "Avançar Rodada" permite a progressão para a próxima fase do torneio.

6. **Reinício do Torneio:**
   - Botão "Reiniciar Torneio" zera todas as informações, preparando para um novo torneio.

7. **Determinação do Vencedor do Torneio:**
   - Ao final do torneio, é apresentado o campeão com base nas pontuações finais.
