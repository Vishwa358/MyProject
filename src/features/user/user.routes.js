//Manage routes/paths to productController

//1. Import express
import express from "express";
import { UserController } from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

//2.Initialise Express router
const userRouter = express.Router();

const userController = new UserController();

//All the paths to controller methods.
userRouter.post("/signUp", (req, res, next) => {
  userController.signUp(req, res, next);
});
userRouter.post("/signIn", (req, res, next) => {
  userController.signIn(req, res, next);
});
userRouter.put("/resetPassword", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
