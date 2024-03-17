import userModel from "../model/userModel.mjs";

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await userModel.getUsers(
        req.query.paginate,
        req.query.page,
        req.query.limit
      );
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while retrieving users." });
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = await userModel.createUser(req.body);
      console.log(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      if (error.code === "23505" && error.constraint === "users_pkey") {
        res
          .status(409)
          .json({ message: "User with the same ID already exists." });
      } else {
        res
          .status(500)
          .json({ message: "An error occurred while creating user." });
      }
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Call the userModel's getUserById function to retrieve the user
      const user = await userModel.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while retrieving the user by id.",
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      console.log(userId)
      if (!userId) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Extract the updated user data from the request body
      const newData = req.body;

      // Update the user using the userModel
      const result = await userModel.updateUser(userId, newData);

      res.status(200).json(result); // Send the updated user data in the response
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the user" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      if (!userId) {
        res.status(400).json({ message: "Id is required" });
        return;
      }

      // Check if the user exists
      const user = await userModel.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Delete the user
      await userModel.deleteUser(userId);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the user." });
    }
  },

  // getOrders: (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const user = users.find((user) => user.id === id);

  //     if (!user) {
  //       res.status(404).json({ message: "User not found." });
  //       return;
  //     }

  //     const orderMenuItems = menu.filter((item) =>
  //       user.orderItems.includes(item.id)
  //     );

  //     const orderMenuItemsInfo = orderMenuItems.map((item) => ({
  //       id: item.id,
  //       name: item.name,
  //       description: item.description,
  //       price: item.price,
  //       category: item.category,
  //       quantity: item.quantity,
  //     }));

  //     res.status(200).json(orderMenuItemsInfo);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       message: "An error occurred while retrieving the user orders.",
  //     });
  //   }
  // },

  // orderByUserIdMenuId: async (req, res) => {
  //   try {
  //     if (!req.session.userId) {
  //       return res
  //         .status(401)
  //         .json({ message: "Unauthorized. Please log in." });
  //     }

  //     req.session.userId = user.id;
  //     const userId = Number(req.params.userId);
  //     const itemId = Number(req.query.itemId);
  //     const quantity = Number(req.query.quantity);

  //     const user = users.find((user) => user.id === userId);
  //     const item = menu.find((item) => item.id === itemId);

  //     if (!user || !item) {
  //       res.status(404).json({ message: "User or Menu item were not found." });
  //       return;
  //     }

  //     let maxOrderId;
  //     if (orders.length > 0) {
  //       maxOrderId = Math.max(...orders.map((order) => order.id));
  //     } else {
  //       maxOrderId = 0;
  //     }

  //     //pridedame 1 kad tureti sekanti id
  //     const orderToSave = {
  //       id: maxOrderId + 1, //  Naujo orderio id sukurimas
  //       customerId: userId,
  //       Items: [],
  //     };
  //     //pashinam ir saugome i users tik itemId o i orders info orderToSave + tai ka gauname is requesto (menuItemId ir quantity)
  //     orderToSave.Items.push({
  //       menuItemId: itemId,
  //       quantity: quantity,
  //     });

  //     orders.push(orderToSave);

  //     user.orderItems.push(orderToSave.id);

  //     await fs.promises.writeFile(
  //       path.join(__dirname, "../db/orders.json"),
  //       JSON.stringify(orders, null, 2)
  //     );

  //     await fs.promises.writeFile(
  //       path.join(__dirname, "../db/users.json"),
  //       JSON.stringify(users, null, 2)
  //     );

  //     res.status(201).json(orderToSave);
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(500)
  //       .json({ message: "An error occurred while creating the order." });
  //   }
  // },
  // deleteOrder: async (req, res) => {
  //   try {
  //     const userId = parseInt(req.params.userId);
  //     const orderId = parseInt(req.params.orderId);

  //     const userIndex = users.findIndex((user) => user.id === userId);
  //     if (userIndex === -1) {
  //       res.status(404).json({ message: "User not found." });
  //       return;
  //     }

  //     const orderIndex = orders.findIndex((order) => order.id === orderId);
  //     if (orderIndex === -1) {
  //       res.status(404).json({ message: "Order not found." });
  //       return;
  //     }

  //     users[userIndex].orderItems = users[userIndex].orderItems.filter(
  //       (id) => id !== orderId
  //     );
  //     orders.splice(orderIndex, 1);

  //     await fs.promises.writeFile(
  //       path.join(__dirname, "../db/users.json"),
  //       JSON.stringify(users, null, 2)
  //     );

  //     await fs.promises.writeFile(
  //       path.join(__dirname, "../db/orders.json"),
  //       JSON.stringify(orders, null, 2)
  //     );

  //     res.status(200).json({ message: "Item successfully cancelled" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Order wasn't cancelled" });
  //   }
  // },
};

export default userController;
