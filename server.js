//1.Import Express
import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";

import ProductRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import UserRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basiAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cartItems.routes.js";
// import apiDocs from "./swagger.json" assert {type:'json'};
import fs from "fs";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.router.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.router.js";

const apiDocs = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));
// const apiDocs = require("./swagger.json");
//2.Create Server
const server = express();

server.use(express.json());

//CORS policy configuration
var corsOptions = {
  origin: "http://localhost:5500",
};

server.use(cors(corsOptions));
server.use(loggerMiddleware);

// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   //return ok for preflight request
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

//Bearer <token>
// For all requests related to product, redirect to product routes.
//localhost:3200/api/products
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", ProductRouter);
server.use("/api/cartItems", loggerMiddleware, jwtAuth, cartRouter);
server.use("/api/user/", UserRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/likes", jwtAuth, likeRouter);

//3.Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  res.status(500).send("Something went wrong, please try later");
});

//4.Middleware to handle 404 requests
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation at localhost:3900/api-docs"
    );
});

//5.Specify Port
server.listen(3900, () => {
  console.log("Server is running at 3900");
  // connectToMongoDB();
  connectUsingMongoose();
});
