import {json, urlencoded} from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import {ssoRoutes} from "./routes/sso";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({extended: true}))
    .use(json())
    .use(cors())
    .use(express.urlencoded({extended: true}))
    .use(express.static(path.join(__dirname, 'public')))
    .use('/sso', ssoRoutes)
    .get("/health", (req, res) => {
      return res.json({ok: true});
    })


  return app;
};
