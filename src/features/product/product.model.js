import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, price, imageUrl, category, sizes, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.sizes = sizes;
    
  }

  static get(id) {
    const product = products.find((i) => i.id == id);
    return product;
  }

  static getAll() {
    return products;
  }

  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static filter(minPrice, maxPrice, category) {
    const result = products.filter((product) => {
      // return (
      //   product.price >= minPrice &&
      //   product.price <= maxPrice &&
      //   product.category == category
      // );
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });
    console.log(result)
    return result;
  }

  static rateProduct(userId, productId, rating) {
    //1.Validate user and product
    const user = UserModel.getAll().find((u) => u.id == userId);
    if (!user) {
      throw new ApplicationError("User not found", 404);
    }

    //Validate Product
    const product = products.find((p) => p.id == productId);
    if (!product) {
      throw new ApplicationError("Product not found", 400);
    }

    //2.Check if there are any ratings and if not then add ratings array.
    if (!product.ratings) {
      product.raings = [];
      product.raings.push({ userId: userId, rating: rating });
    } else {
      //3. Check if user rating is already available
      const existingRatingIndex = product.rating.findIndex(
        (r) => r.userId == userId
      );
      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = {
          userId: userId,
          rating: rating,
        };
      } else {
        //4. If no existing rating, then add new rating
        product.ratings.push({ userId: userId, rating: rating });
      }
    }
  }
}

var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "Cateogory1"
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "Cateogory2",
    ["M", "XL"]
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Cateogory3",
    ["M", "XL", "S"]
  ),
];
