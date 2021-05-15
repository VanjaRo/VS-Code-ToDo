import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { join } from "path";
import { __prod__ } from "./constants";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "vstodo",
    entities: [join(__dirname, "./entities/*.*")],
    logging: !__prod__,
    synchronize: !__prod__,
  });
  const app = express();
  app.get("/", (_req, res) => {
    res.send("Hellow World!");
  });
  app.listen(3002, () => {
    console.log("Listening on localhost:3002.");
  });
};

main();
