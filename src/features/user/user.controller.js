import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res,next) {
    const { name, email, password, type } = req.body;
    try {
      const hashedpassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedpassword, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      
      console.log(err);
      next(err);
      // return res.status(200).send("Something went wrong");
    }
  }
  async signIn(req, res, next) {
    try {
      //1.Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      // console.log(user);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        //2.Compare password with hashedpassword
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          //3. Create token
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          //4.Send token
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }

      // const result = await this.userRepository.SignIn(
      //   req.body.email,
      //   req.body.password
      // );
      // if (!result) {
      //   return res.status(400).send("Incorrect Credentials");
      // } else {
      //1. Create token
      //   const token = jwt.sign(
      //     { userId: result.id, email: result.email },
      //     "C8g4fQ5agMcqdgE9kKYAAF95lMIeNAI7",
      //     { expiresIn: "1h" }
      //   );
      //   return res.status(200).send(token);
      // }
    } catch (err) {
      next(err);
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
  // signIn(req, res) {
  //   const result = UserModel.SignIn(req.body.email, req.body.password);
  //   if (!result) {
  //     return res.status(400).send("Incorrect Credentials");
  //   } else {
  //     return res.send("Login Successful");
  //   }
  // }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userId = req.userId;
    const hashedpassword = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userId, hashedpassword);
      res.status(200).send("Password is reset");
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
