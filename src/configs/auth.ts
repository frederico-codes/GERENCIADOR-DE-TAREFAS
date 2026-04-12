import type { Secret, SignOptions } from "jsonwebtoken";

type JwtConfig = {
  secret: Secret;
  expiresIn: SignOptions["expiresIn"];
};

export const authConfig: { jwt: JwtConfig } = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default",
    expiresIn: "1d",
  },
};