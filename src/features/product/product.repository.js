// import { ObjectId } from "mongodb";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { mongo } from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      productData.categories = productData.category
        .split(",")
        .map((e) => e.trim());

      console.log(productData);
      //1. Add the product.
      const newProduct = new ProductModel(productData);
      const savedproduct = newProduct.save();

      //2. Update categories
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        {
          $push: { products: new ObjectId(savedproduct._id) },
        }
      );

      // const db = getDB();
      // const collection = db.collection(this.collection);
      // await collection.insertOne(newProduct);
      // return newProduct;
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // console.log(collection.find());
      return await collection.find().toArray();
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  //Products should have minimum price specified and category
  async filter(minPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      //['cat1','cat2']
      categories = JSON.parse(categories.replace(/'/g, '"'));
      console.log(categories);

      // if (maxPrice) {
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      // }
      if (categories) {
        filterExpression = {
          $or: [{ categories: { $in: categories } }, filterExpression],
        };
        // filterExpression = { $and: [{ category: category }, filterExpression] };
        // filterExpression = { $or: [{ category: category }, filterExpression] };
        // filterExpression.category = category;
      }
      return collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })
        .toArray();
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async rate(userId, productId, rating) {
    try {
      //1. Check if product exists
      const productToUpdate = await ProductModel.findById(productId);
      if (!productId) {
        throw new Error("Product not found");
      }

      //2. Get the existing review
      const userReview = await ProductModel.findOne({
        product: new ObjectId(productId),
        user: new ObjectId(userId),
      });

      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
          rating: rating,
        });
        newReview.save();
      }

      // const db = getDB();
      // const collection = db.collection(this.collection);

      // //1.Removes existing entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $pull: { ratings: { userId: new ObjectId(userId) } },
      //   }
      // );
      // // console.log(productId)
      // //2.Add new entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $push: { ratings: { userId: new ObjectId(userId), rating } },
      //   }
      // );
    } catch (err) {
      console.log(err);
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            //Stage 1: Get avergae price per category
            $group: {
              _id: "$category",
              averageprice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  // async rate(userId, productId, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     //1.Find the product
  //     const product = await collection.findOne({
  //       _id:new ObjectId(productId),
  //     });
  //     console.log(product);
  //     //2.Find the rating
  //     const userRating = await product?.ratings?.find(
  //       (r) => r.userId == userId
  //     );
  //     if (userRating) {
  //       //3.Update the rating
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //           "ratings.userId": new ObjectId(userId),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rating": rating,
  //           },
  //         }
  //       );
  //     } else {
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //         },
  //         {
  //           $push: { ratings: { userId: new ObjectId(userId), rating } },
  //         }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError(err.message || "Something went wrong", 500);
  //   }
  // }
}

export default ProductRepository;
