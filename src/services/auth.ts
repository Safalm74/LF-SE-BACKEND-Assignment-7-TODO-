import config from "../config";
import { UnaunthicatedError } from "../error/UnauthenticatedError";
import { IUser } from "../interface/user";
import { getUserByEmail } from "./user";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Auth Service");

//service function to login:
//returns new access and refresh token
export async function login(
  body: Pick<IUser, "email" | "password">
) {
  //to await bcrypt compare
  //getting existing user
  logger.info("Attempting to get email by id");

  const existingUser = (await getUserByEmail(body.email))[0];

  //checking if user exists
  if (!existingUser) {
    logger.error("requested user doesnot exist");

    throw new UnaunthicatedError("Invalid email or password");
  }
  //comparing hashed password with incomming password
  logger.info("Checking password");

  const isValidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );

  //checking if password entered is correct
  if (!isValidPassword) {
    logger.error("password doesnot match");

    throw new UnaunthicatedError("Invalid email or password");
  }

  logger.info("creating payload");

  //creating payload to generate tokens
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role_id: existingUser.roleId,
  };

  //generating access token using config jwt secret
  logger.info("creating access token");

  const accessToken = await sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accessTokenExpiryS,
  });

  //generating refresh token using config jwt secret
  logger.info("creating refresh token");
  const refreshToken = await sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.refrehTokenExpiryS,
  });

  //returning access and refresh token
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

//service function to generate new access token from valid refresh token
export async function refreshAccessToken(RefreshToken: string) {
  //JWT sign await
  //refresh token is already ensured not to be empty in controller
  const token = RefreshToken.split(" ");

  /*
    the incoming token must have format of:
      "Bearer <token>"
    to ensure this, 
    refresh token is splitted by (" ")
    then checked if token[0]==="Bearer"
    and splitted token is of length 2
  */
  if (token?.length !== 2 || token[0] !== "Bearer") {
    logger.error(`token format mismatch: ${token}`);

    throw new UnaunthicatedError("Un-Aunthenticated");
  }

  logger.info(`Verifying refresh token`);
  try {
    //JWT verify verifies the token and returns decoded token  if verified
    const isValidToken = verify(token[1], config.jwt.jwt_secret!) as Omit<
      IUser,
      "password" | "role"
    >;

    //creating payload to generate new access token
    logger.info("creating payload");

    const payload = {
      id: isValidToken.id,
      name: isValidToken.name,
      email: isValidToken.email,
    };

    //generating access token using config jwt secret
    logger.info("creating access token");

    const accessToken = await sign(payload, config.jwt.jwt_secret!, {
      expiresIn: config.jwt.accessTokenExpiryS,
    });

    //returning access token
    return { accessToken: accessToken };
  } catch (error) {
    logger.error(`JWT token not verified`);

    //return the error to controller
    throw error;
  }
}
