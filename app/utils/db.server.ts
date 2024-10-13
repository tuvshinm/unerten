import { MongoClient, BSON } from "mongodb";

let connectionString = process.env.CONNECTION_STRING || "";

if (!connectionString) {
  throw new Error(
    "No connection string provided. \n\nPlease create a `.env` file in the root of this project. Add a CONNECTION_STRING variable to that file with the connection string to your MongoDB cluster. \nRefer to the README.md file for more information."
  );
}
let mongodb: MongoClient;

declare global {
  var __db: MongoClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  mongodb = new MongoClient(connectionString);
} else {
  if (!global.__db) {
    global.__db = new MongoClient(connectionString);
  }
  mongodb = global.__db;
}

let ObjectId = BSON.ObjectId;

export { mongodb, ObjectId };
