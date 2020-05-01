const { gql } = require("apollo-server-express");

const typeDefs = gql`
  enum Providers {
    google
    github
  }

  type User {
    provider: Providers!
    socialId: ID!
    id: ID!
    name: String!
    username: String!
    email: String!
  }

  type Todo {
    id: ID!
    title: String!
    isDone: Boolean
  }

  type Query {
    users: [User!]!
    todos: [Todo!]!
    me: User
  }

  type Mutation {
    addTodo(title: String!): Todo!
    deleteTodo(id: ID!): Todo!
    toggleTodo(id: ID!): Todo!
    logout: Boolean
  }
`;

module.exports = typeDefs;
