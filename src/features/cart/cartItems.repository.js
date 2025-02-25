import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productId, userId, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      //Find the document
      //either insert or update
      //Inserting the document
      await collection.updateOne(
        {
          productId: new ObjectId(productId),
          userId: new ObjectId(userId),
        },
        {
          $setOnInsert: { _id: id },
          $inc: {
            quantity: quantity,
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        err.message || "Something went wrong with database",
        500
      );
    }
  }

  // async add(productId, userId, quantity) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     // collection.insertOne({ productId:ObjectId.createFromBase64(productId), userId:ObjectId.createFromTime(userId), quantity });
  //     await collection.insertOne({
  //       productId: new ObjectId(productId),
  //       userId: new ObjectId(userId),
  //       quantity,
  //     });
  //   } catch (err) {
  //     throw new ApplicationError(err.message || "Something went wrong", 500);
  //   }
  // }

  async get(userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async delete(userId, cartItemId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
        userId: new ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );

    console.log(resultDocument);
    return resultDocument.value;
  }
}
