import bcrypt from "bcrypt";
export function passwordSalt(saltRounds: number, plain: any) {
  const fart: any = bcrypt.genSalt(saltRounds, (err: any, salt: string) => {
    if (err) {
      console.log(err);
      return;
    }
    return salt;
  });
  const hashed = bcrypt.hash(plain, fart, (err: any, hash: any) => {
    if (err) {
      console.log(err);
      return;
    }
    return hash;
  });
  return hashed;
}
