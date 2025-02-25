import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      // console.log(products);
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes, categories, description } = req.body;
      const newProduct = new ProductModel(
        name,
        description,
        parseFloat(price),
        req?.file?.filename,
        categories,
        sizes?.split(",")
      );
      const createdProduct = await this.productRepository.add(newProduct);
      // console.log(createdProduct);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async rateProduct(req, res, next) {
    try {
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      // try {
      await this.productRepository.rate(userId, productId, rating);
      // } catch (err) {
      //   return res.status(400).send(err.message);
      // }

      return res.status(200).send("Rating has been added");
    } catch (err) {
      console.log(err);
      console.log("Passing eroor to middleware");
      next(err);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.query.id || req.params.id;
      // console.log("Hi    ",id)
      const product = await this.productRepository.get(id);
      // res.status(200).send(product);
      if (!product) {
        res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;
      const result = await this.productRepository.filter(minPrice, categories);
      // console.log(result);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
