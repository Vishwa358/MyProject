import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  // static async SignUp(name, email, password, type) {
  //   try {
  //     //1.Get the database
  //     const db = getDB();
  //     //2.Get the collection
  //     const collection = db.collection("users");

  //     const newUser = new UserModel(name, email, password, type);
  //     // As we are working with database these things will be taken care of by mongodb
  //     // newUser.id = users.length + 1;
  //     // users.push(newUser);

  //     // 3.To insert the document
  //     await collection.insertOne(newUser);
  //     return newUser;
  //   } catch (err) {
  //     throw new ApplicationError(err.message || "Something went wrong", 500);
  //   }
  // }

  static SignIn(email, password) {
    const user = users.find((u) => u.email == email && u.password == password);
    return user;
  }

  static getAll() {
    return users;
  }
}

export let users = [
  {
    id: 1,
    name: "Customer User",
    email: "customer@ecom.com",
    password: "Password1",
    type: "customer",
  },
  {
    id: 2,
    name: "Customer User",
    email: "customer@ecom.com",
    password: "Password2",
    type: "customer",
  },
];
