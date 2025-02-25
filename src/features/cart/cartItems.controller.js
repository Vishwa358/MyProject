import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export class CartItemsController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }

  async add(req, res) {
    try{
        const { productId, quantity} = req.body;
        // console.log(req.body)
        const userId = req.userId;
        await this.cartItemsRepository.add(productId, userId, quantity);
        res.status(201).send("Cart is updated");
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
       }    
}

  // async add(req, res) {
  //   try {
  //     const { productId, quantity } = req.body;
  //     // console.log(productId + "," + quantity);
  //     const userId = req.userId;
  //     await this.cartItemsRepository.add(productId, userId, quantity);
  //     res.status(201).send("Cart is updated");
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(200).send("Something went wrong");
  //   }
  // }

  async get(req, res) {
    try {
      const userId = req.userId;
      // console.log(userId);
      const items = await this.cartItemsRepository.get(userId);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async delete(req, res) {
    const userId = req.userId;
    const cartItemId = req.params.id;
    const isDeleted = await this.cartItemsRepository.delete(userId,cartItemId);
    if (!isDeleted) {
      return res.status(404).send("Item Not Found");
    }
    return res.status(200).send("Cart item is removed");
  }
}
