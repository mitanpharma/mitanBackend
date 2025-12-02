import dotenv from "dotenv";
import app from "./server.js";
import { mongodbConnection } from "./connection.js";

dotenv.config();

const PORT = process.env.PORT || 6000;

mongodbConnection(process.env.MONGODB_URL).then(() => {
  app.listen(PORT, () => {
    console.log("Mongodb Connection successful");
  });
});
