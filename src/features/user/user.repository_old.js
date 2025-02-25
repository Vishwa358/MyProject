import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "./user.model.js";
import { users } from "./user.model.js";

class Repository {
  constructor() {
    this.collection = "users";
  }

  async SignUp(newUser) {
    try {
      //1.Get the database
      const db = getDB();
      //2.Get the collection
      const collection = db.collection(this.collection);

      // const newUser = new UserModel( email, password, type);
      // As we are working with database these things will be taken care of by mongodb
      // newUser.id = users.length + 1;
      // users.push(newUser);

      // 3.To insert the document
      // console.log(name)
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }

  async signIn(email, password) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);

      // 3. Find the document.
      return await collection.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ email });
    } catch (err) {
      throw new ApplicationError(err.message || "Something went wrong", 500);
    }
  }
}

export default Repository;
