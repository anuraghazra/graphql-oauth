const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User } = require("./models/User");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  done(null, user);
});

const UpsertUser = async (
  provider,
  { socialId, email, username, displayName },
  done
) => {
  let userData = {
    provider: provider,
    socialId: socialId,
    username: username,
    email: email,
    name: displayName,
  };

  try {
    let matchedUser = await User.findOne({ email: userData.email });
    if (matchedUser) {
      console.log("matched user", matchedUser.email);
      return done(null, matchedUser);
    }

    let newUser = new User(userData);
    await newUser.save();

    console.log("newUser created", newUser.email);
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
};

const GithubAuthStrategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    await UpsertUser(
      "github",
      {
        socialId: profile.id,
        email: profile.emails[0].value,
        username: profile.username,
        displayName: profile.displayName,
      },
      done
    );
  }
);

const GoogleAuthStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    await UpsertUser(
      "google",
      {
        socialId: profile.id,
        email: profile.emails[0].value,
        username: profile.emails[0].value.replace("@gmail.com", ""),
        displayName: profile.displayName,
      },
      done
    );
  }
);

passport.use(GithubAuthStrategy);
passport.use(GoogleAuthStrategy);
