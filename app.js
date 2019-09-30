const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const cred = require('./config/cred');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');


mongoose.connect(cred.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connect.'))
  .catch(e => console.error(e));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  formatError(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occurred.';
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data };
  }
});
const app = express();

server.applyMiddleware({app});
app.use(express.static('client/dist/'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(
    __dirname, 'client', 'dist', 'index.html'
  ))
});

module.exports = app;
