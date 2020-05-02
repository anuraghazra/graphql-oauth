const { gql } = require("apollo-server-express");

const typeDefs = gql`
  directive @auth on FIELD_DEFINITION

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
    users: [User!]! @auth
    todos: [Todo!]! @auth
    me: User
  }

  type Mutation {
    addTodo(title: String!): Todo! @auth
    updateTodo(id: ID! title: String!): Todo! @auth
    deleteTodo(id: ID!): Todo! @auth
    toggleTodo(id: ID!): Todo! @auth
    logout: Boolean
  }
`;

module.exports = typeDefs;
