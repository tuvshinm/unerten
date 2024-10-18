import type { WithId, Document, ObjectId } from "mongodb";

export interface Brand extends WithId<Document> {
  brand: string;
}
export interface Fragrance extends WithId<Document> {
  brand: ObjectId | string;
  name: string;
  price: number;
  img: string;
}
export interface User extends WithId<Document> {
  username: string;
  password: string;
}
