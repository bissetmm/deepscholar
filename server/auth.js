const express = require("express");
const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use('github', new GithubStrategy({
      clientID: process.env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.DEEP_SCHOLAR_URL}/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  const router = express.Router();
  router.get('/github', passport.authenticate('github'));
  router.get('/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth/github'}),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  return router;
};
