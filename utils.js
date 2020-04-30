const axios = require("axios");

const requestGithubToken = async (credentials) => {
  return axios({
    method: "POST",
    url: "https://github.com/login/oauth/access_token",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: credentials,
  });
};

const requestGithubUserAccount = (token) =>
  axios.get(`https://api.github.com/user?access_token=${token}`);

const requestGithubUser = async (credentials) => {
  let githubToken = await requestGithubToken(credentials);
  let githubUser = await requestGithubUserAccount(
    githubToken.data.access_token
  );

  return { ...githubUser, access_token: githubToken.data.access_token };
};

module.exports = {
  requestGithubToken,
  requestGithubUserAccount,
  requestGithubUser,
};
