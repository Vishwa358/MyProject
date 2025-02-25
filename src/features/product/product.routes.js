//Manage routes/paths to productController

//1. Import express
import express from "express";
import ProductController from "./product.controller.js";
import upload from "../../middlewares/fileupload.middleware.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

//2.Initialise Express router
const productRouter = express.Router();
const productController = new ProductController();

//All the paths to controller methods.
//localhost:3200/api/products

productRouter.post("/rate", jwtAuth, (req, res, next) => {
  productController.rateProduct(req, res, next);
});
productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});
productRouter.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
