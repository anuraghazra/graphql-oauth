require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { v4 } = require("uuid");
const mongoose = require("mongoose");

// graphql
const { buildContext } = require("graphql-passport");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const FormatBytesDirective = require("./graphql/directives/formatBytes");

require("./passport");
const authRoute = require("./routes/auth");

const app = express();

const PORT = 4000;
const SESSION_SECRECT = "DAMNNN ITS EXPOSED";
app.use(
  session({
    genid: () => v4(),
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatBytes: FormatBytesDirective,
  },
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  context: ({ req, res }) => buildContext({ req, res }),
});

server.applyMiddleware({ app, cors: false });

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen({ port: PORT }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  })
  .catch(console.error);
