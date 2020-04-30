const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const dotenv = require("dotenv");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const { requestGithubUserAccount } = require("./utils");
const FormatBytesDirective = require("./graphql/directives/formatBytes");

dotenv.config();
const app = express();

const server = new ApolloServer({
  schemaDirectives: {
    formatBytes: FormatBytesDirective,
  },
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];
    const githubUser = await requestGithubUserAccount(token);
    if (!githubUser.data) {
      return { currentUser: null };
      // throw new AuthenticationError("you must be logged in");
    }

    let user = {
      username: githubUser.data.login,
      name: githubUser.data.name,
      githubLogin: githubUser.data.login,
      avatar: githubUser.data.avatar_url,
    };
    // add the user to the context
    return { currentUser: user, token };
  },
});

server.applyMiddleware({ app });
app.listen({ port: 3000 }, () => {
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
});
