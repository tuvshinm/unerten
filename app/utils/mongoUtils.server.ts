import { mongodb } from "~/utils/db.server";
import bcrypt from "bcrypt";
import { json } from "@remix-run/node";
import { Brand, Fragrance, User } from "./types.server";
import { ObjectId } from "mongodb";
export async function findOrCreateUser(user: string, password: string) {
  const db = await mongodb.db("unerten");
  const collection = await db.collection("user");
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
  img: any,
  volume: any,
  desc: any,
  gender: any // 0 is male 1 is womale 2 is unisex
): Promise<Fragrance | null> {
  const frag = {
    brand: brand,
    name: name,
    price: price,
    img: img,
    volume: volume,
    desc: desc,
    gender: gender,
  };
  const db = mongodb.db("unerten");
  const fragrences = db.collection("fragrences");
  console.log("message received.");
  const found = (await fragrences.findOne({ name: name })) as Fragrance;
  if (!found) {
    await fragrences.insertOne(frag);
    console.log("such fragrence not found and added");
    return null;
  } else {
    console.log("such fragrence found and was not added");
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
export async function AtoZBrands() {
  const db = await mongodb.db("unerten");
  const brandsCollection = db.collection<Brand>("brands");
  let brands = await brandsCollection.find({}).toArray();
  let aToc: Brand[] = [];
  const aregex = new RegExp(/[a-c]/i);
  let dToj: Brand[] = [];
  const dregex = new RegExp(/[d-j]/i);
  let kTon: Brand[] = [];
  const kregex = new RegExp(/[k-n]/i);
  let oTor: Brand[] = [];
  const oregex = new RegExp(/[o-r]/i);
  let sToz: Brand[] = [];
  const sregex = new RegExp(/[s-z]/i);
  let extra: Brand[] = [];
  brands.map((v) => {
    if (aregex.test(v.name.charAt(0)) === true) {
      aToc.push(v);
    } else if (dregex.test(v.name.charAt(0)) === true) {
      dToj.push(v);
    } else if (kregex.test(v.name.charAt(0)) === true) {
      kTon.push(v);
    } else if (oregex.test(v.name.charAt(0)) === true) {
      oTor.push(v);
    } else if (sregex.test(v.name.charAt(0)) === true) {
      sToz.push(v);
    } else {
      extra.push(v);
    }
  });
  return json({
    aToc,
    dToj,
    kTon,
    oTor,
    sToz,
    extra,
  });
}
