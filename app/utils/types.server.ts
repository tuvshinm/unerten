import type { WithId, Document, ObjectId } from "mongodb";

export interface Brand extends WithId<Document> {
  brand: string;
}
export interface Fragrance extends WithId<Document> {
  brand: ObjectId | string;
  name: string;
  price: number;
  img: string;
  description: string;
  gender: Number;
  // 0 === Masculine
  // 1 === Feminine
  // 2 === Unisex
  releaseyear: Number;
  volume: Number;
  // Measured in ml's
}
export interface User extends WithId<Document> {
  username: string;
  password: string;
}
