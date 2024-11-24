import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import config from "./config";
import errorHandler from "./middleware/errorHandler";
import fourOhFour from "./middleware/fourOhFour";
import root from "./routes/root";
import connectToMongoDB from './connectDb'
import newroute from '../src/controllers/sanda/create'

const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToMongoDB()

app.use(
  cors({
    // @ts-ignore no-implicit-any
    origin: config.clientCorsOrigins[config.nodeEnv] ?? "*",
  })
);

app.use(helmet());
app.use(morgan("tiny"));

app.use("/", root);
app.use("/new-route", newroute);

app.use(fourOhFour);
app.use(errorHandler);

export default app;
