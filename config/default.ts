import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, SECRET } = process.env;

export default {
  port: 3000,
  dbUri: DB_HOST,
  saltRounds: 10,
  secret: SECRET,
  tokenTtl: "10m",
};
