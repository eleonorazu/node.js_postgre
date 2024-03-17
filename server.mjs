import express from "express";
import userRouter from "./routes/users.mjs";
// import menuRouter from "./routes/menu.mjs";
import cookies from "./middleware/cookies.mjs";
import { connectDB } from "./db/postresConnection.mjs";

// Create an Express application
const app = express();

const startServer = async () => {
  try {
    const message = await connectDB();
    console.log(message);
    app.use(cookies);
    // Middleware
    app.use(express.json());

    // Use routers
    app.use("/api/v1/restaurant/users", userRouter);
    // app.use("/api/v1/restaurant/menu", menuRouter);

    //specified PORT
    const PORT = 3000;
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the server or database", error);
  }
};
startServer()
