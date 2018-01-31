const express = require("express");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const GithubStrategy = require("passport-github").Strategy;
const DB = require("./db");

const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.DEEP_SCHOLAR_TOKEN_SECRET,
  issuer: process.env.DEEP_SCHOLAR_TOKEN_ISSUER,
  audience: process.env.DEEP_SCHOLAR_TOKEN_AUDIENCE
};
passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
  const user = payload.sub;
  if (user) {
    return done(null, user, payload);
  }

  return done();
}));

passport.use('github', new GithubStrategy({
    clientID: process.env.OAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.DEEP_SCHOLAR_URL}/api/auth/github/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    DB.findOrCreateUser(profile).then((user) => {
      console.log(user);
      done(null, user);
    });
  }
));

const jwt = require("jsonwebtoken");

function generateAccessToken(type, username) {
  const expiresIn = "1 hour";
  const issuer = process.env.DEEP_SCHOLAR_TOKEN_ISSUER;
  const audience = process.env.DEEP_SCHOLAR_TOKEN_AUDIENCE;
  const secret = process.env.DEEP_SCHOLAR_TOKEN_SECRET;
  const subject = {type, username}.toString();

  const token = jwt.sign({}, secret, {
    expiresIn,
    issuer,
    audience,
    subject
  });

  return token;
}

function generateUserToken(req, res) {
  const accessToken = generateAccessToken("github", req.user._id);
  res.render('authenticated.html', {
    token: accessToken,
    profile: JSON.stringify(req.user.profile)
  });
}

const providers = [
  {type: "github", scope: ['read:user']}
];

module.exports = (app) => {
  app.use(passport.initialize());

  const router = express.Router();

  providers.forEach(provider => {
    router.get(`/${provider.type}`, passport.authenticate(provider.type, {session: false, scope: provider.scope}));
    router.get(`/${provider.type}/callback`,
      passport.authenticate(provider.type, {session: false}),
      generateUserToken);

  });

  return router;
};
