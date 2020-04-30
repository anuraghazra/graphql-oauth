const { gql } = require("apollo-server-express");

const typeDefs = gql`
  directive @formatBytes on FIELD_DEFINITION

  type Repo {
    name: String!
    stars: Int!
    size: String! @formatBytes
    owner: String!
  }
  
  type User {
    name: String!
    githubLogin: String!
    githubToken: String!
    avatar: String!
  }

  type AuthPayload {
    githubToken: String!
    user: User!
  }

  type Query {
    repos: [Repo!]!
    me: User!
    githubLoginUrl: String!
  }

  type Mutation {
    authorizeWithGithub(code: String!): AuthPayload!
  }
`;

module.exports = typeDefs;
