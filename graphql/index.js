const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const AuthDirective = require("./directives/AuthDirective");

module.exports = {
  typeDefs,
  resolvers,
  AuthDirective,
};
