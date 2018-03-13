const express = require("express");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const GithubStrategy = require("passport-github").Strategy;
const User = require("./models/user");

const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.DEEP_SCHOLAR_TOKEN_SECRET,
  issuer: process.env.DEEP_SCHOLAR_TOKEN_ISSUER,
  audience: process.env.DEEP_SCHOLAR_TOKEN_AUDIENCE
};
passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
  const sub = JSON.parse(payload.sub);
  return User.findByObjectId(sub.id).then((user) => {
    if (user) {
      return done(null, user, payload);
    }

    return done();
  });
}));

passport.use('github', new GithubStrategy({
    clientID: process.env.OAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.DEEP_SCHOLAR_URL}/api/auth/github/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOrCreate(profile).then((user) => {
      done(null, user);
    });
  }
));

const jwt = require("jsonwebtoken");

function generateAccessToken(id) {
  const expiresIn = "1 day";
  const issuer = process.env.DEEP_SCHOLAR_TOKEN_ISSUER;
  const audience = process.env.DEEP_SCHOLAR_TOKEN_AUDIENCE;
  const secret = process.env.DEEP_SCHOLAR_TOKEN_SECRET;
  const subject = JSON.stringify({id});

  const token = jwt.sign({}, secret, {
    expiresIn,
    issuer,
    audience,
    subject
  });

  return token;
}

function generateUserToken(req, res) {
  const accessToken = generateAccessToken(req.user._id);
  res.render('authenticated.html', {
    token: accessToken,
    profile: JSON.stringify(req.user.profile)
  });
}

const providers = [
  {type: "github", scope: ['read:user']}
];

module.exports = class {
  static getVerifiedUserId(headers) {
    return new Promise((resolve, reject) => {
      const authorization = headers ? headers["authorization"] : null;
      if (authorization) {
        const matches = authorization.match(/bearer\s(.+)$/);
        if (matches) {
          const token = matches[1];
          try {
            const user = jwt.verify(token, process.env.DEEP_SCHOLAR_TOKEN_SECRET);
            const sub = JSON.parse(user.sub);
            resolve(sub.id);
          } catch (error) {
            reject(error);
          }
        }
      }
    });
  }

  static router(app) {
    app.use(passport.initialize());

    const router = express.Router();

    router.get(`/verify`, (req, res) => {
      return this.constructor.getVerifiedUserId(req.headers).then(userId => {
        return User.findByObjectId(userId).then(user => {
          const token = generateAccessToken(userId);
          const {profile} = user;
          res.send(JSON.stringify({token, profile}));
        });
      }).catch(() => {
        res.status(403).end();
      });
    });

    providers.forEach(provider => {
      router.get(`/${provider.type}`, passport.authenticate(provider.type, {session: false, scope: provider.scope}));
      router.get(`/${provider.type}/callback`,
        passport.authenticate(provider.type, {session: false}),
        generateUserToken);

    });

    return router;
  }
}
