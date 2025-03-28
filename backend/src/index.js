import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import {app} from "./app.js";

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    console.log("Database connected");
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
  )
 