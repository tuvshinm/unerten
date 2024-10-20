import { mongodb } from "~/utils/db.server";
import bcrypt from "bcrypt";
import { json } from "@remix-run/node";
import { Brand, Fragrance, User } from "./types.server";
import { ObjectId } from "mongodb";
export async function findOrCreateUser(user: string, password: string) {
  const db = await mongodb.db("unerten");
  const collection = await db.collection("user");
  const fragrences = await db.collection("fragrences");
  const brandz = await db.collection("brands");
  let found: User = (await collection.findOne({ username: user })) as User;
  let hashish = {
    username: user,
    password: password,
  };
  if (!found) {
    await collection.insertOne(hashish);
    return found;
  } else {
    return found;
  }
}

export async function loginUser(
  user: string,
  password: string
): Promise<User | null> {
  const db = await mongodb.db("unerten");
  const collection = await db.collection("user");
  const fragrences = await db.collection("fragrences");
  const brandz = await db.collection("brands");
  const found = (await collection.findOne({ username: user })) as User;
  if (!found) {
    return null;
  }
  const isPasswordValid = await bcrypt.compare(password, found.password);
  if (!isPasswordValid) {
    return null;
  } else {
    return found;
  }
}
export async function addFragrance(
  brand: any,
  name: any,
  price: any,
  img: any
): Promise<Fragrance | null> {
  const frag = {
    brand: brand,
    name: name,
    price: price,
    img: img,
  };
  const db = await mongodb.db("unerten");
  const fragrences = await db.collection("fragrences");
  const found = (await fragrences.findOne({ name: name })) as Fragrance;
  if (!found) {
    let fart = await fragrences.insertOne(frag);
    return null;
  } else {
    return found;
  }
}
export async function addBrand(name: any): Promise<Brand | null> {
  const db = await mongodb.db("unerten");
  const brandz = await db.collection("brands");
  const brandie = {
    name: name,
  };
  const found = (await brandz.findOne({ name: name })) as Brand;
  if (!found) {
    await brandz.insertOne(brandie);
    return null;
  } else {
    return found;
  }
}
export async function getBrands(name: string) {
  const db = await mongodb.db("unerten");
  const collection = await db.collection("user");
  const fragrences = await db.collection("fragrences");
  const brandz = await db.collection("brands");
  let brands = brandz.find({}).toArray();
  let searchedBrands: Brand[] = [];
  if (name) {
    let searchRegex = new RegExp(name, "i");
    searchedBrands = (await brandz
      .find({ title: { $regex: searchRegex } })
      .limit(10)
      .toArray()) as Brand[];
  }
  return json({ brands, searchedBrands });
}
export async function getFragrences(name: string) {
  const db = await mongodb.db("unerten");
  const fragrences = await db.collection("fragrences");
  let frags = fragrences.find({}).toArray();
  let searchedFragrences: Fragrance[] = [];
  if (name) {
    let searchRegex = new RegExp(name, "i");
    searchedFragrences = (await fragrences
      .find({ title: { $regex: searchRegex } })
      .limit(10)
      .toArray()) as Fragrance[];
  }
  return json({ frags, searchedFragrences });
}
export async function deleteFragrance(id: any) {
  const db = await mongodb.db("unerten");
  const fragrences = await db.collection("fragrences");
  const deleteOne = await fragrences.deleteOne({ _id: new ObjectId(id) });
  return deleteOne.acknowledged;
}
export async function deleteBrand(id: any) {
  const db = await mongodb.db("unerten");
  const brandz = await db.collection("brands");
  const deleteOne = await brandz.deleteOne({
    _id: new ObjectId(id),
  });
  return deleteOne.acknowledged;
}
export async function editFragrance(id: any, newName: any, newPrice: any) {
  const db = await mongodb.db("unerten");
  const fragrences = await db.collection("fragrences");
  const filter = { _id: new ObjectId(id) };
  const updateDocument = {
    $set: {
      name: newName,
      price: newPrice,
    },
  };
  const updateOne = await fragrences.updateOne(filter, updateDocument);
  console.log(updateOne);
  return updateOne.modifiedCount;
}
