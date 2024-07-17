import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const config = {
  port: process.env.PORT,
  database: {
    DB_CLIENT: process.env.DB_CLIENT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PW: process.env.DB_PW,
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    accessTokenExpiryS: 600,
    refrehTokenExpiryS: 3000,
  },
};

export default config;
