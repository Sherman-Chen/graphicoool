const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require('./schema');
const port = process.env.PORT || 4400;
const chalk = require('chalk');

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(port, () => {
  console.log(chalk.green(`server is running on port ${port} \u2728`));
});
