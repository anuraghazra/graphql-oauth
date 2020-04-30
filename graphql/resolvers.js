const { AuthenticationError } = require("apollo-server-express");
const { requestGithubUser } = require("../utils.js");
const axios = require("axios");

const useAuth = (next) => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new AuthenticationError("User not authenticated");
  }
  return next(root, args, context, info);
};

let currentUser;
const resolvers = {
  Query: {
    githubLoginUrl: () => {
      let url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user`;
      return url;
    },
    repos: useAuth(async (root, args, context) => {
      let repos = await axios.get(
        `https://api.github.com/user/repos?access_token=${context.token}`
      );
      return repos.data
        .map((repo) => ({
          name: repo.name,
          stars: repo.stargazers_count,
          owner: repo.owner.login,
          size: repo.size
        }))
        .sort((a, b) => b.stars - a.stars);
    }),
    me: useAuth((root, args, context) => context.currentUser),
  },

  Mutation: {
    authorizeWithGithub: async (parent, { code }) => {
      let githubUser = await requestGithubUser({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      });
      console.log(githubUser);
      currentUser = {
        name: githubUser.data.name,
        githubLogin: githubUser.data.login,
        githubToken: githubUser.access_token,
        avatar: githubUser.data.avatar_url,
      };
      return { githubToken: code, user: currentUser };
    },
  },
};

module.exports = resolvers;
