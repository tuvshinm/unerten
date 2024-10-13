import type { WithId, Document } from "mongodb";

export interface Fragrance extends WithId<Document> {
  brand: string;
  name: string;
  price: number;
  stock: number;
  img: string;
}
export interface User extends WithId<Document> {
  password: string;
  email: string;
  verified: boolean;
  admin: boolean;
}
