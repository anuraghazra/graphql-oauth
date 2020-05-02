require("dotenv").config();
const { v4 } = require("uuid");
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
// const session = require("express-session");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");

// graphql
const { buildContext } = require("graphql-passport");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers, AuthDirective } = require("./graphql");

require("./passport");
const authRoute = require("./routes/auth");

const app = express();

const PORT = 4000;
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRECT],
    maxAge: 24 * 60 * 60 * 1000, // session will expire after 24 hours
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
    auth: AuthDirective,
  },
  // not needed
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  context: ({ req, res }) => buildContext({ req, res }),
});

server.applyMiddleware({ app });

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
