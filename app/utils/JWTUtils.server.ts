import jwt from "jsonwebtoken";
import { User } from "./types.server";
export const generateToken = (payload: User) => {
  const secretKey = "yourSecretKey"; // Replace with your own secret key
  const options = {
    expiresIn: "1h", // Token expiration time
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};
