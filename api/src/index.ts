import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { createConnection } from "typeorm";
import { join } from "path";
import { __prod__ } from "./constants";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { User } from "./entities/User";
import jwt from "jsonwebtoken";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "vstodo",
    dropSchema: true,
    entities: [join(__dirname, "./entities/*.*")],
    logging: !__prod__,
    synchronize: !__prod__,
  });
  const app = express();
  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });
  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        cb(null, {
          accessToken: jwt.sign(
            { userId: user.id },
            process.env.PRIVAT_KEY_JWT,
            { expiresIn: "1y" }
          ),
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github"));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );

  app.get("/", (_req, res) => {
    res.send("Hellow World!");
  });
  app.listen(3002, () => {
    console.log("Listening on localhost:3002.");
  });
};

main();
