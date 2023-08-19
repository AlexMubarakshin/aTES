import {json, urlencoded} from "body-parser";
import express from "express";
import session from 'express-session';
import morgan from "morgan";
import cors from "cors";
import path from "path";
import {verifyToken} from "./middlewares/token";
import {verifyAuthentification} from "./middlewares/auth";
import {CONFIG} from "./config";
import {tasksRouter} from "./routes/tasks";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({extended: true}))
    .use(json())
    .use(cors())
    .use(session({
      secret: CONFIG['express_session_key'], // This should be a random string and stored securely
      resave: false,
      saveUninitialized: true,
      cookie: {secure: false} // Set to true if using HTTPS
    }))
    .use(verifyToken)
    .use(verifyAuthentification)
    .get('/', (req, res) => {
      res.sendFile(path.join(__dirname, './public/dashboard.html'));
    })
    .get("/health", (req, res) => {
      return res.json({ok: true});
    })
    .use('/tasks', tasksRouter);

  return app;
};
