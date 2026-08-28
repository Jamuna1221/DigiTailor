import bcrypt from "bcrypt";

const hash = await bcrypt.hash("seetha#2097", 10);
console.log(hash);