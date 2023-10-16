# IFSPORT
npm install express --save
npm install -D handlebars
npm install -g npm@10.1.0
npm install body-parser --save
npm install mysql
npm install --save mysql2
npm install sequelize sqlite3
npm install sqlite3
npm install -g nodemon
npm install axios
npm install hbs
npm install express-handlebars --save
npm install date-fns
npm install handlebars-helpers
npm install express-handlebars
npm install
npm install handlebars --save
npm i bootstrap-icons


Não excluir é da tabela times:

<ul>
        {{#each teams}}
        <li>
            <strong>{{name}}</strong>
            <p>Abreviação: {{abbreviation}}</p>
            <p>Conferência: {{conference}}</p>
            <p>Divisão: {{division}}</p>
        </li>
        {{/each}}
    </ul>