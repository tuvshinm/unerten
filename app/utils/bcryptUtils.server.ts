import bcrypt from "bcrypt";
export async function hash(password: string) {
  const sR = 12;
  const hashed = await bcrypt.hash(password, sR);
  return hashed;
}
